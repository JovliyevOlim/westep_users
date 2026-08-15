export type TelegramOidcResult = {
    id_token?: string;
    error?: string;
};

const OIDC_ORIGIN = "https://oauth.telegram.org";

export function openTelegramOidcPopup(clientId: number): Promise<string> {
    return new Promise((resolve, reject) => {
        const pageOrigin = window.location.origin;
        const redirectUri = `${pageOrigin}${window.location.pathname}`;
        const params = new URLSearchParams({
            response_type: "post_message",
            client_id: String(clientId),
            redirect_uri: redirectUri,
            origin: pageOrigin,
            scope: "openid profile phone",
        });
        const authUrl = `${OIDC_ORIGIN}/auth?${params.toString()}`;

        const width = 550;
        const height = 650;
        const left = Math.max(0, (window.screen.width - width) / 2);
        const top = Math.max(0, (window.screen.height - height) / 2);
        const popup = window.open(
            authUrl,
            "telegram_oidc_login",
            `width=${width},height=${height},left=${left},top=${top},status=0,location=0,menubar=0,toolbar=0`,
        );

        if (!popup) {
            reject(new Error("Telegram oynasi ochilmadi. Popup bloklangan bo'lishi mumkin"));
            return;
        }

        let settled = false;
        const finish = (fn: () => void) => {
            if (settled) return;
            settled = true;
            window.removeEventListener("message", onMessage);
            window.clearTimeout(closeTimer);
            fn();
        };

        const onMessage = (event: MessageEvent) => {
            if (event.origin !== OIDC_ORIGIN) return;

            let data: {event?: string; result?: string; error?: string} | null = null;
            try {
                data = typeof event.data === "string" ? JSON.parse(event.data) : event.data;
            } catch {
                return;
            }

            if (!data || data.event !== "auth_result") return;

            if (data.error || typeof data.result !== "string" || !data.result) {
                finish(() => reject(new Error("Telegram orqali kirish bekor qilindi")));
                return;
            }

            finish(() => resolve(data.result as string));
        };

        window.addEventListener("message", onMessage);

        // Do not cancel the moment the popup looks closed — confirming in the
        // Telegram app often backgrounds/closes the popup before postMessage.
        const closeTimer = window.setTimeout(() => {
            finish(() => reject(new Error("Telegram orqali kirish vaqti tugadi. Qaytadan urinib ko'ring")));
        }, 180000);

        popup.focus();
    });
}
