# Telegram OIDC login — dizayn

**Sana**: 2026-08-15
**Status**: Dizayn tasdiqlangan
**Maqsad**: Foydalanuvchi WeStep web (`westep-user`) va mobil (`westep-RNative`) da Telegram orqali bir tugma bilan kira oladi. Backend bitta endpoint orqali Telegram `id_token` ni tekshiradi, telefon bo‘yicha akkauntni topadi yoki ochadi, oddiy JWT sessiya qaytaradi.

**Repo taqsimoti**

| Repo | Vazifa |
|---|---|
| `westep-backend` | OIDC tekshiruv, user match/create, token, qurilma limiti |
| `westep-user` | Login sahifasida Telegram tugmasi + OIDC popup/redirect |
| `westep-RNative` | Login ekranida Telegram tugmasi + in-app browser OIDC |

## Tasdiqlangan qarorlar

- Yuzalar: web **va** mobile, bitta backend endpoint.
- Telegramdan **telefon ham** so‘raladi (`phone` scope). Raqam bo‘yicha mavjud user topiladi, yo‘q bo‘lsa yangi STUDENT ochiladi.
- Yangi user: ism + telefon yetadi. Jins so‘ralmaydi. Parol ixtiyoriy (shu PR da parol qo‘yish UI yo‘q).
- Yondashuv: Telegram **OIDC** (`oauth.telegram.org`), eski `telegram-widget.js` emas — widget telefon bermaydi.
- Ota-ona boti alohida qoladi. Login uchun **alohida WeStep Login boti**.
- Mavjud JWT, `/user/me`, qurilma sessiyasi limiti o‘zgarmaydi.
- Google login, Telegramni sozlamalardan ulash/uzish, Mini App login — **scope tashqarida**.

---

## 1. Arxitektura

Telegram foydalanuvchini tasdiqlaydi. WeStep o‘z sessiyasini ochadi.

```
[westep-user]  ──┐
                 ├── https://oauth.telegram.org/auth
                 │     scope = openid profile phone
[westep-RNative]─┘         │
                           ▼  id_token
              POST /api/auth/telegram
                { idToken, deviceId?, deviceName?, replaceSessionId? }
                           │
              westep-backend
                1. JWT ni Telegram JWKS bilan tekshiradi
                2. phone_number ni 998XXXXXXXXX ga normalizatsiya qiladi
                3. User ni telegram_user_id yoki phone bo‘yicha topadi / ochadi
                4. accessToken + refreshToken qaytaradi
```

Bot token va Client Secret faqat backendda. Web va mobil faqat **Client ID** ni biladi.

### BotFather sozlash (deploy oldidan odam qiladi)

1. Yangi bot: masalan `@westep_login_bot` (ota-ona boti emas).
2. BotFather → Login Widget: Allowed URLs (library ishlaydigan originlar):
   - `https://westep.uz`
   - `https://academy.westep.uz`
   - boshqa haqiqiy web originlar (staging ham)
   Mobil deep link (`westep://`) BotFather ga yozilmaydi — library faqat web bridge sahifada ishlaydi.
3. Client ID va Client Secret ni saqlash.
4. Backend env:

```
app.telegram.login.enabled=true
app.telegram.login.client-id=<bot numeric id / client id>
app.telegram.login.client-secret=<secret>
app.telegram.login.issuer=https://oauth.telegram.org
```

Mavjud `app.telegram.bot-token` (ota-ona boti) ga tegilmaydi.

---

## 2. Backend kontrakti

### Endpoint

`POST /api/auth/telegram`

`/api/auth/**` allaqachon `permitAll` — yangi matcher shart emas.

**Request**

```json
{
  "idToken": "eyJhbGciOiJSUzI1NiIs...",
  "deviceId": "optional-string",
  "deviceName": "optional-string",
  "replaceSessionId": "optional-uuid"
}
```

**200** — hozirgi `/api/auth/login` bilan bir xil token juftligi:

```json
{
  "accessToken": "...",
  "refreshToken": "..."
}
```

Yangi user ham shu format. Alohida register javobi yo‘q.

**Xatolar**

| Holat | HTTP | `message` |
|---|---|---|
| `idToken` bo‘sh / parse bo‘lmasa | 400 | Telegram tasdiqlanmadi. Qaytadan urinib ko‘ring |
| Imzo, `iss`, `aud`, `exp` noto‘g‘ri | 401 | Telegram tasdiqlanmadi. Qaytadan urinib ko‘ring |
| `phone_number` yo‘q yoki normalizatsiya bo‘lmasa | 400 | Kirish uchun Telegramdagi telefon raqamingizni ulashing |
| Telefon boshqa `telegram_user_id` ga ulangan | 409 | Bu telefon raqam boshqa Telegram akkauntga ulangan |
| Qurilma limiti to‘lgan | 409 | Hozirgi login kabi `DeviceLimitExceededDetails` |

Qurilma limiti: `userDeviceSessionService.createOrUpdateSession` — hozirgi login bilan bir xil 409 + `replaceSessionId` qayta urinish.

### Token tekshiruvi

1. JWKS: `https://oauth.telegram.org/.well-known/jwks.json` (cache).
2. `iss` == `https://oauth.telegram.org`
3. `aud` == `app.telegram.login.client-id`
4. `exp` o‘tmagan
5. Imzo `RS256` (default)

`id_token` dan olinadigan maydonlar: `id` (Telegram user id), `given_name` / `name`, `family_name`, `preferred_username`, `phone_number`, `picture`.

### Telefon normalizatsiya

Kirish: `+998901234567`, `998901234567`, `8901234567`, `901234567`.

Chiqish: `998` + 9 raqam (`998901234567`). Boshqa mamlakat kodi yoki 9 tadan kam/ko‘p mahalliy raqam — 400.

### User match tartibi

1. `users.telegram_user_id == token.id` → shu user. Telefonni avtomatik almashtirmaymiz (unique collision xavfi).
2. Aks holda `users.phone == normalizedPhone`:
   - `telegram_user_id` bo‘sh → shu userga yozamiz, login.
   - `telegram_user_id` boshqa id → 409 (boshqa Telegram akkaunt).
3. Hech kim topilmasa → yangi STUDENT:
   - `phone` = normalized
   - `firstname` = `given_name` yoki `name` ning birinchi so‘zi, yo‘q bo‘lsa `Foydalanuvchi`
   - `lastname` = `family_name`, yo‘q bo‘lsa `""` (`NOT NULL` saqlanadi)
   - `password` = `passwordEncoder.encode(random 32-byte)` — telefon+parol login ishlamaydi
   - `gender` = null
   - `role` = STUDENT
   - `telegram_user_id`, `telegram_username` yoziladi
   - `studentProfileService.ensureProfile`
   - welcome notification — hozirgi register kabi

`telegram_username` har muvaffaqiyatli kirishda yangilanadi.

### Schema

`users` jadvaliga:

- `telegram_user_id BIGINT NULL UNIQUE`
- `telegram_username VARCHAR(128) NULL`

`password` `NOT NULL` qoladi.

Flyway migratsiya: `V20260815_01__add_user_telegram_login.sql`.

### Konfiguratsiya

Yangi `@ConfigurationProperties(prefix = "app.telegram.login")`:

- `enabled` (default false — yoqilmaguncha endpoint 503)
- `client-id`
- `client-secret` (shu PR da ishlatilmaydi; keyin code exchange uchun saqlanadi)
- `issuer` = `https://oauth.telegram.org`

`enabled=false` bo‘lsa: 503, xabar “Telegram orqali kirish hozircha o‘chirilgan”.

---

## 3. Web (`westep-user`)

Login (`LoginForm`) ostida **Yoki** ajratgich + Telegram tugmasi.

`id_token` ni klient **Telegram Login JS library** orqali oladi (`https://telegram.org/js/telegram-login.js`), authorization-code exchange yo‘q.

Oqim:

1. Tugma → `Telegram.Login.auth({ client_id, scope: ['profile', 'phone'] }, callback)`.
2. Popup yopilsa yoki `error` → “Telegram orqali kirish bekor qilindi”.
3. Callback `id_token` bersa → `POST /api/auth/telegram` (mavjud API client + `deviceId`/`deviceName`).
4. Tokenlarni hozirgi auth store ga yozish → post-auth redirect yoki home.

Google tugmasi qo‘shilmaydi.

Sahifa origini BotFather Allowed URLs da bo‘lishi shart. Login sahifasida popup + JS callback yetadi.

Mobil uchun qo‘shimcha route: `/auth/telegram/bridge` — faqat `Telegram.Login.auth` chaqiradi va natijani `westep://auth/telegram?...` ga qaytaradi. Login UI yo‘q.

---

## 4. Mobile (`westep-RNative`)

Login ekranida `ProSocialButton kind="telegram"` qayta chiqadi. Google tugmasi **chiqmaydi** (Play Store broken-functionality).

Mobil ham `id_token` oladi, code exchange yo‘q. Native Telegram SDK bu PR da yo‘q.

Oqim:

1. Tugma → `expo-web-browser` WeStep webdagi kichik sahifani ochadi: `https://<web-origin>/auth/telegram/bridge`.
2. Bridge sahifa `Telegram.Login.auth(...)` ni chaqiradi (web bilan bir xil Client ID + scope).
3. Muvaffaqiyatda deep link: `westep://auth/telegram?id_token=...`. Bekor: `westep://auth/telegram?error=cancelled`.
4. Ilova `id_token` ni olib `loginWithTelegram({ idToken, deviceId, deviceName, replaceSessionId? })` → `POST /api/auth/telegram`.
5. `setAccessToken` / `setRefreshToken`, `AuthProvider.signInWithTelegram` → `loadCurrentUser` → `/(tabs)`.
6. 409 **va** body da `DeviceLimitExceededDetails` bor → mavjud `DeviceLimitModal`; revoke + qayta `loginWithTelegram` with `replaceSessionId`.
7. 409 lekin details yo‘q (boshqa Telegram akkaunt) → oddiy xato matni, modal yo‘q.

Bekor/yopilgan browser: “Telegram orqali kirish bekor qilindi”.
Telefon scope yo‘q: backend 400 matni.

`EXPO_PUBLIC_TELEGRAM_CLIENT_ID` — faqat Client ID. Secret yo‘q.
`EXPO_PUBLIC_TELEGRAM_BRIDGE_URL` — bridge sahifa URL.

Web Expo build (`npm run web`) bridge o‘rniga to‘g‘ridan `Telegram.Login.auth` chaqiradi (westep-user bilan bir xil).

Auth interceptor: `/auth/telegram` ham login kabi 401 retry/refresh dan mustasno.

---

## 5. Xatolar (foydalanuvchi matnlari)

| Holat | Matn |
|---|---|
| Popup/browser yopildi | Telegram orqali kirish bekor qilindi |
| Telefon ulashilmadi | Kirish uchun Telegramdagi telefon raqamingizni ulashing |
| Token yaroqsiz | Telegram tasdiqlanmadi. Qaytadan urinib ko‘ring |
| Boshqa TG akkaunt | Bu telefon raqam boshqa Telegram akkauntga ulangan |
| Feature o‘chirilgan | Telegram orqali kirish hozircha o‘chirilgan |
| Tarmoq | Mavjud umumiy fallback |
| Qurilma limiti | Mavjud modal |

UI stringlar o‘zbekcha; i18n kalitlari `auth.telegram*` ostida.

---

## 6. Testlar

### Backend (`westep-backend`)

- Yaroqli token + yangi telefon → user ochiladi, 200 tokenlar, `telegram_user_id` yozilgan, parol random hash (telefon+parol authenticate qilmaydi).
- Shu telefonli user, `telegram_user_id` bo‘sh → login, id yoziladi, yangi user ochilmaydi.
- `telegram_user_id` mos → o‘sha user, telefon boshqacha bo‘lsa ham (phone unique band bo‘lmasa ham telefon yangilanmaydi).
- Telefonli userda boshqa `telegram_user_id` → 409.
- `phone_number` yo‘q → 400.
- Noto‘g‘ri imzo / `aud` / muddati o‘tgan → 401.
- `enabled=false` → 503.
- Qurilma limiti → 409 + details.

JWKS/imzo testlarida fixture JWT + test JWKS (WireMock yoki stubbed verifier).

### Mobile

- LoginScreen da Telegram tugmasi bor, Google yo‘q.
- `loginWithTelegram` muvaffaqiyatda token saqlaydi.
- Bekor → bekor xabari, authenticated emas.

### Web

- Login form ostida Telegram tugmasi.
- Muvaffaqiyatda token yoziladi va redirect.

---

## 7. Scope tashqarida

- Google login
- Profil sozlamalaridan Telegram ulash / uzish
- Telegram orqali kirganlarga parol qo‘yish UI
- Ota-ona botini login botiga birlashtirish
- Telegram Mini App ichida login
- Authorization-code exchange (shu PR `id_token` ni to‘g‘ridan tekshiradi)

---

## 8. Qabul qilish mezonlari

1. Web login va mobil login da ishlaydigan Telegram tugmasi bor.
2. Telegram telefon ulashsa: mavjud WeStep user kiradi yoki yangi STUDENT ochiladi.
3. Javob — oddiy `accessToken` / `refreshToken`; keyingi API chaqiriqlar hozirgi kabi.
4. Telegram rad etsa yoki telefon bermasa — sessiya ochilmaydi, tushunarli xato.
5. Ishlamaydigan Google tugmasi yo‘q.
6. Ota-ona Telegram boti o‘zgarishsiz.
