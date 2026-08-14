# Telegram OIDC Login Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Foydalanuvchi westep-user va westep-RNative da Telegram tugmasi orqali kiradi; backend `id_token` ni tekshirib telefon bo‘yicha user topadi yoki ochadi va oddiy JWT qaytaradi.

**Architecture:** Telegram Login JS library `id_token` beradi (web popup, mobil web-bridge + `westep://` deep link). `POST /api/auth/telegram` JWKS bilan tokenni tekshiradi, `telegram_user_id` / phone match, yangi STUDENT random parol hash bilan. Mavjud session/JWT oqimi o‘zgarmaydi.

**Tech Stack:** Spring Boot + JUnit/Mockito, Flyway, westep-user React + telegram-login.js, westep-RNative Expo Router + expo-web-browser.

**Spec:** `docs/superpowers/specs/2026-08-15-telegram-oidc-login-design.md`

## Global Constraints

- UI stringlar o‘zbekcha; i18n kalitlari `auth.telegram*`.
- Google login tugmasi qo‘shilmaydi.
- Ota-ona `app.telegram.bot-token` ga tegilmaydi.
- Bot secret / Client Secret faqat backendda.
- `password` ustuni `NOT NULL` qoladi; yangi Telegram userda random BCrypt.
- Qurilma limiti: `replaceSessionId` ni `createOrUpdateSession` ga uzatish (parol revoke shart emas).
- `npm run typecheck` (mobile) va backend `./mvnw test` o‘tishi kerak.

## File map

**westep-backend**

- Create: `src/main/resources/db/migration/V20260815_01__add_user_telegram_login.sql`
- Create: `src/main/java/uz/westep/westepbackend/config/TelegramLoginProperties.java`
- Create: `src/main/java/uz/westep/westepbackend/dto/TelegramLoginRequest.java`
- Create: `src/main/java/uz/westep/westepbackend/dto/TelegramIdentity.java`
- Create: `src/main/java/uz/westep/westepbackend/service/telegram/PhoneNormalizer.java`
- Create: `src/main/java/uz/westep/westepbackend/service/telegram/TelegramIdTokenVerifier.java`
- Create: `src/main/java/uz/westep/westepbackend/service/telegram/JwksTelegramIdTokenVerifier.java`
- Create: `src/main/java/uz/westep/westepbackend/service/telegram/TelegramAuthService.java`
- Create: `src/test/java/uz/westep/westepbackend/service/telegram/PhoneNormalizerTest.java`
- Create: `src/test/java/uz/westep/westepbackend/service/telegram/TelegramAuthServiceTest.java`
- Modify: `User.java`, `UserRepository.java`, `AuthController.java`, `application*.properties`

**westep-user**

- Modify: `src/api/auth/authApi.ts`, `src/api/auth/useAuth.ts`, `src/components/auth/login/LoginForm.tsx`, `src/route/allRoutes.tsx`
- Create: `src/components/auth/telegram/TelegramLoginButton.tsx`, `src/pages/auth/TelegramBridgePage.tsx`

**westep-RNative**

- Modify: `src/constants/env.ts`, `src/features/auth/services/authApi.ts`, `src/features/auth/providers/AuthProvider.tsx`, `src/features/auth/screens/LoginScreen.tsx`, `src/services/api/client.ts`, `src/types/auth.ts`, `app.json` (scheme already `westep`)
- Create: `src/features/auth/services/telegramLogin.ts`

---

### Task 1: Phone normalizer

**Files:**
- Create: `westep-backend/src/main/java/uz/westep/westepbackend/service/telegram/PhoneNormalizer.java`
- Test: `westep-backend/src/test/java/uz/westep/westepbackend/service/telegram/PhoneNormalizerTest.java`

**Interfaces:**
- Consumes: nothing
- Produces: `PhoneNormalizer.normalize(String raw) -> Optional<String>` (`998` + 9 digits)

- [ ] **Step 1: Write the failing test**

```java
package uz.westep.westepbackend.service.telegram;

import org.junit.jupiter.api.Test;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

class PhoneNormalizerTest {

    @Test
    void acceptsPlus998AndLocalForms() {
        assertEquals(Optional.of("998901234567"), PhoneNormalizer.normalize("+998901234567"));
        assertEquals(Optional.of("998901234567"), PhoneNormalizer.normalize("998901234567"));
        assertEquals(Optional.of("998901234567"), PhoneNormalizer.normalize("8901234567"));
        assertEquals(Optional.of("998901234567"), PhoneNormalizer.normalize("901234567"));
        assertEquals(Optional.of("998901234567"), PhoneNormalizer.normalize("+998 90 123 45 67"));
    }

    @Test
    void rejectsForeignOrShort() {
        assertTrue(PhoneNormalizer.normalize("+1 415 555 2671").isEmpty());
        assertTrue(PhoneNormalizer.normalize("12345").isEmpty());
        assertTrue(PhoneNormalizer.normalize(null).isEmpty());
        assertTrue(PhoneNormalizer.normalize("").isEmpty());
    }
}
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd /Users/humoyunrobilov/Projects/westep-backend && ./mvnw -q -Dtest=PhoneNormalizerTest test`

Expected: FAIL — `PhoneNormalizer` topilmaydi.

- [ ] **Step 3: Write minimal implementation**

```java
package uz.westep.westepbackend.service.telegram;

import java.util.Optional;

public final class PhoneNormalizer {

    private PhoneNormalizer() {}

    public static Optional<String> normalize(String raw) {
        if (raw == null || raw.isBlank()) {
            return Optional.empty();
        }
        String digits = raw.replaceAll("\\D", "");
        if (digits.startsWith("998") && digits.length() == 12) {
            return Optional.of(digits);
        }
        if (digits.startsWith("8") && digits.length() == 10) {
            return Optional.of("998" + digits.substring(1));
        }
        if (digits.length() == 9) {
            return Optional.of("998" + digits);
        }
        return Optional.empty();
    }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `./mvnw -q -Dtest=PhoneNormalizerTest test`

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/main/java/uz/westep/westepbackend/service/telegram/PhoneNormalizer.java \
        src/test/java/uz/westep/westepbackend/service/telegram/PhoneNormalizerTest.java
git commit -m "feat(auth): add Telegram phone normalizer"
```

---

### Task 2: User schema + repository

**Files:**
- Create: `westep-backend/src/main/resources/db/migration/V20260815_01__add_user_telegram_login.sql`
- Modify: `westep-backend/src/main/java/uz/westep/westepbackend/entity/User.java`
- Modify: `westep-backend/src/main/java/uz/westep/westepbackend/repository/UserRepository.java`

**Interfaces:**
- Consumes: nothing
- Produces: `User.telegramUserId: Long`, `User.telegramUsername: String`, `UserRepository.findByTelegramUserId(Long)`

- [ ] **Step 1: Add Flyway migration**

```sql
ALTER TABLE users
    ADD COLUMN IF NOT EXISTS telegram_user_id BIGINT NULL,
    ADD COLUMN IF NOT EXISTS telegram_username VARCHAR(128) NULL;

CREATE UNIQUE INDEX IF NOT EXISTS uk_users_telegram_user_id
    ON users (telegram_user_id)
    WHERE telegram_user_id IS NOT NULL;
```

- [ ] **Step 2: Add fields on User (after `preferredLanguageCode`)**

```java
@Column(name = "telegram_user_id")
private Long telegramUserId;

@Column(name = "telegram_username", length = 128)
private String telegramUsername;
```

- [ ] **Step 3: Add repository method**

```java
Optional<User> findByTelegramUserId(Long telegramUserId);
```

- [ ] **Step 4: Commit**

```bash
git add src/main/resources/db/migration/V20260815_01__add_user_telegram_login.sql \
        src/main/java/uz/westep/westepbackend/entity/User.java \
        src/main/java/uz/westep/westepbackend/repository/UserRepository.java
git commit -m "feat(auth): add telegram_user_id columns"
```

---

### Task 3: TelegramAuthService (match / create / tokens)

**Files:**
- Create: `westep-backend/src/main/java/uz/westep/westepbackend/dto/TelegramIdentity.java`
- Create: `westep-backend/src/main/java/uz/westep/westepbackend/config/TelegramLoginProperties.java`
- Create: `westep-backend/src/main/java/uz/westep/westepbackend/service/telegram/TelegramIdTokenVerifier.java`
- Create: `westep-backend/src/main/java/uz/westep/westepbackend/service/telegram/TelegramAuthService.java`
- Test: `westep-backend/src/test/java/uz/westep/westepbackend/service/telegram/TelegramAuthServiceTest.java`

**Interfaces:**
- Consumes: `PhoneNormalizer`, `UserRepository.findByTelegramUserId` / `findByPhone`, `JwtProvider`, `UserDeviceSessionService.createOrUpdateSession`, `StudentProfileService.ensureProfile`, `DelayedNotificationService.scheduleWelcomeAfterRegister`
- Produces: `TelegramAuthService.login(String idToken, HttpServletRequest, String deviceId, String deviceName, UUID replaceSessionId) -> Map<String,String>`

`TelegramIdentity` record:

```java
public record TelegramIdentity(
        long telegramUserId,
        String firstName,
        String lastName,
        String username,
        String phoneNumber
) {}
```

`TelegramIdTokenVerifier`:

```java
public interface TelegramIdTokenVerifier {
    TelegramIdentity verify(String idToken);
}
```

`TelegramLoginProperties` (`@ConfigurationProperties(prefix = "app.telegram.login")`):

```java
private boolean enabled = false;
private String clientId = "";
private String clientSecret = "";
private String issuer = "https://oauth.telegram.org";
private String jwksUrl = "https://oauth.telegram.org/.well-known/jwks.json";
```

Enable binding next to existing `@EnableConfigurationProperties` (yoki `@Component` kabi `TelegramProperties`).

- [ ] **Step 1: Write TelegramAuthServiceTest with a fake verifier**

Fake verifier test ichida:

```java
TelegramIdTokenVerifier verifier = token -> new TelegramIdentity(
        111L, "Ali", "Valiyev", "ali", "+998901234567");
```

Test cases (Mockito, `AuthServiceTest` uslubida):

1. `enabled=false` → `AppException` 503, message `Telegram orqali kirish hozircha o'chirilgan`
2. Yangi telefon → `userRepository.save` chaqiriladi, `ensureProfile`, welcome, token map
3. Mavjud phone, `telegramUserId` null → save da id yoziladi, yangi user ochilmaydi (`save` existing)
4. `findByTelegramUserId` topadi → phone o‘zgarmaydi
5. Phone userda boshqa `telegramUserId` → `AppException` 409, `Bu telefon raqam boshqa Telegram akkauntga ulangan`
6. Verifier `phoneNumber` null → `AppException` 400, `Kirish uchun Telegramdagi telefon raqamingizni ulashing`
7. Verifier `AppException` 401 tashlasa — o‘tadi

Service constructor `AuthService` dagi dependency + `TelegramIdTokenVerifier` + `TelegramLoginProperties` + `PasswordEncoder`.

Yangi user:

```java
User.builder()
    .phone(normalized)
    .firstname(first.isBlank() ? "Foydalanuvchi" : first)
    .lastname(last == null ? "" : last)
    .password(passwordEncoder.encode(UUID.randomUUID() + UUID.randomUUID().toString()))
    .role(studentRole)
    .telegramUserId(identity.telegramUserId())
    .telegramUsername(identity.username())
    .build();
```

Har login: `user.setTelegramUsername(identity.username())`.

- [ ] **Step 2: Run tests — FAIL (class yo‘q)**

Run: `./mvnw -q -Dtest=TelegramAuthServiceTest test`

- [ ] **Step 3: Implement TelegramAuthService**

Match tartibi spec §2. Xatolar `new AppException(message, HttpStatus.XXX)`.

Token juftligi `AuthService.login` dagi kabi:

```java
String accessToken = jwtProvider.generateAccessToken(user);
String refreshToken = jwtProvider.generateRefreshToken(user);
userDeviceSessionService.createOrUpdateSession(
        user, refreshToken, LocalDateTime.now().plusDays(14),
        request, deviceId, deviceName, replaceSessionId);
return Map.of("accessToken", accessToken, "refreshToken", refreshToken);
```

- [ ] **Step 4: Tests PASS**

Run: `./mvnw -q -Dtest=TelegramAuthServiceTest,PhoneNormalizerTest test`

- [ ] **Step 5: Commit**

```bash
git add src/main/java/uz/westep/westepbackend/dto/TelegramIdentity.java \
        src/main/java/uz/westep/westepbackend/config/TelegramLoginProperties.java \
        src/main/java/uz/westep/westepbackend/service/telegram/TelegramIdTokenVerifier.java \
        src/main/java/uz/westep/westepbackend/service/telegram/TelegramAuthService.java \
        src/test/java/uz/westep/westepbackend/service/telegram/TelegramAuthServiceTest.java
git commit -m "feat(auth): add TelegramAuthService match-or-create"
```

---

### Task 4: JWKS verifier + HTTP endpoint

**Files:**
- Create: `westep-backend/src/main/java/uz/westep/westepbackend/service/telegram/JwksTelegramIdTokenVerifier.java`
- Create: `westep-backend/src/main/java/uz/westep/westepbackend/dto/TelegramLoginRequest.java`
- Modify: `westep-backend/src/main/java/uz/westep/westepbackend/controller/AuthController.java`
- Modify: `westep-backend/src/main/resources/application.properties`
- Modify: `westep-backend/src/main/resources/application-dev.properties`
- Modify: `westep-backend/src/main/resources/application-prod.properties`
- Modify: `westep-backend/pom.xml` (agar `nimbus-jose-jwt` yo‘q bo‘lsa)

**Interfaces:**
- Consumes: `TelegramAuthService.login`
- Produces: `POST /api/auth/telegram` body `TelegramLoginRequest`

`TelegramLoginRequest`:

```java
public record TelegramLoginRequest(
        @NotBlank String idToken,
        String deviceId,
        String deviceName,
        UUID replaceSessionId
) {}
```

Controller method:

```java
@PostMapping("/telegram")
public ResponseEntity<Map<String, String>> loginWithTelegram(
        @Valid @RequestBody TelegramLoginRequest request,
        HttpServletRequest httpRequest
) {
    return ResponseEntity.ok(telegramAuthService.login(
            request.idToken(),
            httpRequest,
            request.deviceId(),
            request.deviceName(),
            request.replaceSessionId()
    ));
}
```

`JwksTelegramIdTokenVerifier` (`@Component`):

1. `nimbus-jose-jwt` `JWKSource` + `ConfigurableJWTProcessor`
2. `iss` == properties.issuer
3. `aud` == properties.clientId
4. Claims: `id` (long), `given_name` / `name`, `family_name`, `preferred_username`, `phone_number`
5. Yaroqsiz → `new AppException("Telegram tasdiqlanmadi. Qaytadan urinib ko'ring", UNAUTHORIZED)`

Properties (har uch profile):

```
app.telegram.login.enabled=${APP_TELEGRAM_LOGIN_ENABLED:false}
app.telegram.login.client-id=${APP_TELEGRAM_LOGIN_CLIENT_ID:}
app.telegram.login.client-secret=${APP_TELEGRAM_LOGIN_CLIENT_SECRET:}
app.telegram.login.issuer=https://oauth.telegram.org
app.telegram.login.jwks-url=https://oauth.telegram.org/.well-known/jwks.json
```

`pom.xml` ga kerak bo‘lsa:

```xml
<dependency>
  <groupId>com.nimbusds</groupId>
  <artifactId>nimbus-jose-jwt</artifactId>
</dependency>
```

- [ ] **Step 1: Implement verifier + endpoint + properties**

- [ ] **Step 2: Run backend tests**

Run: `./mvnw -q -Dtest=TelegramAuthServiceTest,PhoneNormalizerTest,AuthServiceTest test`

Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add pom.xml src/main/java/uz/westep/westepbackend/service/telegram/JwksTelegramIdTokenVerifier.java \
        src/main/java/uz/westep/westepbackend/dto/TelegramLoginRequest.java \
        src/main/java/uz/westep/westepbackend/controller/AuthController.java \
        src/main/resources/application.properties \
        src/main/resources/application-dev.properties \
        src/main/resources/application-prod.properties
git commit -m "feat(auth): expose POST /api/auth/telegram"
```

---

### Task 5: westep-user — tugma + API + bridge

**Files:**
- Modify: `westep-user/src/api/auth/authApi.ts`
- Modify: `westep-user/src/api/auth/useAuth.ts`
- Create: `westep-user/src/components/auth/telegram/TelegramLoginButton.tsx`
- Modify: `westep-user/src/components/auth/login/LoginForm.tsx`
- Create: `westep-user/src/pages/auth/TelegramBridgePage.tsx`
- Modify: `westep-user/src/route/allRoutes.tsx`

**Interfaces:**
- Consumes: `POST /api/auth/telegram` → `{ accessToken, refreshToken }`
- Produces: `loginWithTelegram({ idToken, replaceSessionId? })`, `useTelegramLogin()`, `/auth/telegram/bridge`

`loginWithTelegram` `authApi.ts` da `login` dan keyin, xato mapping `login` dagi 409/`DeviceLimitExceededError` bilan bir xil; 401 ni “Parol xato” ga aylantirmang — `err.response.data.message` ni ko‘rsating.

```ts
export interface TelegramLoginBody {
    idToken: string;
    deviceId?: string;
    deviceName?: string;
    replaceSessionId?: string;
}

export const loginWithTelegram = async (body: TelegramLoginBody) => {
    const resolvedDeviceId = body.deviceId || getOrCreateDeviceId();
    const resolvedDeviceName = body.deviceName || getCurrentDeviceName();
    const { data } = await apiClient.post<LoginResponse>("/auth/telegram", {
        idToken: body.idToken,
        deviceId: resolvedDeviceId,
        deviceName: resolvedDeviceName,
        replaceSessionId: body.replaceSessionId,
    });
    setItem<string>("accessToken", data.accessToken);
    setItem<string>("refreshToken", data.refreshToken);
    return data;
};
```

`useTelegramLogin` — `useLogin` dagi `onSuccess` (getCurrentUser, redirect) ni qayta ishlating.

`TelegramLoginButton.tsx`:

- `VITE_TELEGRAM_CLIENT_ID` o‘qiladi; bo‘sh bo‘lsa tugma `disabled`, title: sozlanmagan.
- Click: `window.Telegram.Login.auth({ client_id: Number(id), scope: ["profile", "phone"] }, (result) => { ... })`
- `telegram-login.js` ni bir marta `document.createElement("script")` bilan qo‘shing (`https://telegram.org/js/telegram-login.js`).
- `!result || result.error` → toast “Telegram orqali kirish bekor qilindi”
- `result.id_token` → `useTelegramLogin().mutate({ idToken })`

`LoginForm.tsx` submit tugmasidan keyin:

```tsx
<div className="mt-6 flex items-center gap-3">
  <div className="h-px flex-1 bg-slate-200" />
  <span className="text-sm text-slate-400">Yoki</span>
  <div className="h-px flex-1 bg-slate-200" />
</div>
<div className="mt-6">
  <TelegramLoginButton />
</div>
```

`TelegramBridgePage` (public route `/auth/telegram/bridge`):

- Mount da `Telegram.Login.auth(...)` chaqiriladi.
- Success: `window.location.href = "westep://auth/telegram?id_token=" + encodeURIComponent(token)`
- Cancel: `westep://auth/telegram?error=cancelled`
- Minimal UI: “Telegram orqali kirilmoqda…”

`allRoutes.tsx` `publicRoutes` ga:

```ts
{ path: "/auth/telegram/bridge", element: <TelegramBridgePage /> },
```

- [ ] **Step 1: Implement API + button + login form + bridge**

- [ ] **Step 2: Typecheck / build**

Run: `cd /Users/humoyunrobilov/Projects/westep-user && npx tsc --noEmit`

Expected: PASS (yoki loyihada tsc yo‘q bo‘lsa `npm run build` faqat yangi xatolarga qarang)

- [ ] **Step 3: Commit**

```bash
git add src/api/auth/authApi.ts src/api/auth/useAuth.ts \
        src/components/auth/telegram/TelegramLoginButton.tsx \
        src/components/auth/login/LoginForm.tsx \
        src/pages/auth/TelegramBridgePage.tsx \
        src/route/allRoutes.tsx
git commit -m "feat(auth): add Telegram login button and mobile bridge"
```

---

### Task 6: westep-RNative — tugma + deep link

**Files:**
- Modify: `westep-RNative/src/constants/env.ts`
- Modify: `westep-RNative/src/types/auth.ts`
- Modify: `westep-RNative/src/features/auth/services/authApi.ts`
- Modify: `westep-RNative/src/features/auth/providers/AuthProvider.tsx`
- Modify: `westep-RNative/src/services/api/client.ts`
- Modify: `westep-RNative/src/features/auth/screens/LoginScreen.tsx`
- Modify: `westep-RNative/src/features/i18n/fallbackTranslations.ts` (`auth.telegram*` kalitlar)
- Create: `westep-RNative/src/features/auth/services/telegramLogin.ts`
- Create: `westep-RNative/src/features/auth/components/TelegramDeviceLimitSheet.tsx` (PasswordScreen modalini extract qilish shart emas — LoginScreen da qisqa qayta ishlatish mumkin; PasswordScreen modal kodini copy qilmang, `deviceList` state LoginScreen da)

**Interfaces:**
- Consumes: bridge URL + `POST /api/auth/telegram`
- Produces: `loginWithTelegram`, `signInWithTelegram`, `openTelegramLogin()`

`env.ts`:

```ts
telegramClientId: process.env.EXPO_PUBLIC_TELEGRAM_CLIENT_ID ?? "",
telegramBridgeUrl:
  process.env.EXPO_PUBLIC_TELEGRAM_BRIDGE_URL ?? "https://westep.uz/auth/telegram/bridge",
```

`client.ts` `isAuthRequest` ga qo‘shing: `requestUrl.includes("/auth/telegram")`

`authApi.ts` — `loginWithTelegram` `login` dagi 409 mapping bilan; 401 ni parol xatosiga aylantirmang.

`telegramLogin.ts`:

```ts
import * as WebBrowser from "expo-web-browser";
import * as Linking from "expo-linking";
import { env } from "../../../constants/env";

export async function openTelegramLogin(): Promise<string> {
  const redirect = Linking.createURL("auth/telegram");
  const url = `${env.telegramBridgeUrl}?redirect=${encodeURIComponent(redirect)}`;
  const result = await WebBrowser.openAuthSessionAsync(url, redirect);
  if (result.type !== "success" || !result.url) {
    throw new Error("Telegram orqali kirish bekor qilindi");
  }
  const parsed = Linking.parse(result.url);
  const err = typeof parsed.queryParams?.error === "string" ? parsed.queryParams.error : null;
  if (err) {
    throw new Error("Telegram orqali kirish bekor qilindi");
  }
  const idToken = parsed.queryParams?.id_token;
  if (typeof idToken !== "string" || !idToken) {
    throw new Error("Telegram tasdiqlanmadi. Qaytadan urinib ko'ring");
  }
  return idToken;
}
```

Bridge sahifa `redirect` query ni ishlatsin: `westep://` o‘rniga shu URL (Expo Go `exp://` bo‘lishi mumkin).

`AuthProvider`: `signInWithTelegram(payload: TelegramLoginPayload)` → `loginWithTelegram` + `loadCurrentUser`.

`LoginScreen`: `ProSocialButton kind="telegram"` (Google yo‘q). Press → `openTelegramLogin` → `signInWithTelegram`. 409 + details → device sheet; session tanlangach qayta `signInWithTelegram({ idToken, replaceSessionId })`. `idToken` ni sheet ochiq turganida state da saqlang.

Web platform (`Platform.OS === "web"`): bridge o‘rniga `window.Telegram.Login.auth` (dynamic import yoki `telegramLogin.web.ts`).

- [ ] **Step 1: Implement env, API, provider, screen, interceptor**

- [ ] **Step 2: Typecheck**

Run: `cd /Users/humoyunrobilov/Projects/westep-RNative && npm run typecheck`

Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add src/constants/env.ts src/types/auth.ts \
        src/features/auth/services/authApi.ts \
        src/features/auth/services/telegramLogin.ts \
        src/features/auth/providers/AuthProvider.tsx \
        src/features/auth/screens/LoginScreen.tsx \
        src/features/i18n/fallbackTranslations.ts \
        src/services/api/client.ts
git commit -m "feat(auth): add Telegram login on mobile"
```

---

## Jonli test (implementatsiyadan keyin)

Avval **BotFather**:

1. Yangi bot (`@westep_login_bot` — ota-ona boti emas).
2. Login Widget → Allowed URLs: `http://localhost:5173` (web dev), `https://westep.uz`, `https://academy.westep.uz`.
3. Client ID / Secret ni backend env ga:
   - `APP_TELEGRAM_LOGIN_ENABLED=true`
   - `APP_TELEGRAM_LOGIN_CLIENT_ID=...`
   - `APP_TELEGRAM_LOGIN_CLIENT_SECRET=...`
4. Web: `VITE_TELEGRAM_CLIENT_ID=...`
5. Mobile: `EXPO_PUBLIC_TELEGRAM_CLIENT_ID=...`, `EXPO_PUBLIC_TELEGRAM_BRIDGE_URL=http://<sizning-lan-ip>:5173/auth/telegram/bridge` (simulator uchun)

Tekshiruv:

- Web `/login` → Telegram → popup → telefon ulash → `/` ga kirish.
- Yangi Telegram raqam → `users` da yangi qator, `telegram_user_id` to‘lgan.
- Mavjud WeStep telefon → yangi user ochilmaydi.
- Telefon rad → “Kirish uchun Telegramdagi telefon raqamingizni ulashing”.
- Mobil tugma → bridge → ilovaga qaytish → tabs.

Backend tests BotFathersiz o‘tadi (`TelegramAuthServiceTest` fake verifier).

---

## Spec coverage

| Spec | Task |
|---|---|
| Phone normalize | 1 |
| Schema `telegram_user_id` | 2 |
| Match tartibi + random password | 3 |
| JWKS + `POST /api/auth/telegram` + enabled 503 | 4 |
| Web button + library + bridge | 5 |
| Mobile button + deep link + device 409 | 6 |
| Google yo‘q, parent bot tegilmaydi | 5–6 / 4 properties |
| Device `replaceSessionId` | 3, 5, 6 |
