import {useState} from "react";
import {useSearchParams} from "react-router-dom";
import {
    getTelegramClientId,
    loadTelegramLoginScript,
} from "../../components/auth/telegram/TelegramLoginButton.tsx";
import CommonButton from "../../ui/CommonButton.tsx";

const DEFAULT_TELEGRAM_REDIRECT = "westep://auth/telegram";
const INVALID_REDIRECT_MESSAGE = "Noto'g'ri qaytish manzili";

function isAllowedTelegramRedirect(raw: string): boolean {
    try {
        const scheme = new URL(raw).protocol.replace(/:$/, "").toLowerCase();
        return scheme === "westep" || scheme === "exp" || scheme.startsWith("exp+");
    } catch {
        return false;
    }
}

function appendQueryParam(base: string, key: string, value: string) {
    const separator = base.includes("?") ? "&" : "?";
    return `${base}${separator}${key}=${encodeURIComponent(value)}`;
}

export default function TelegramBridgePage() {
    const [searchParams] = useSearchParams();
    const [pending, setPending] = useState(false);
    const [error, setError] = useState("");

    const redirect = searchParams.get("redirect")?.trim() || DEFAULT_TELEGRAM_REDIRECT;
    const redirectAllowed = isAllowedTelegramRedirect(redirect);

    const finish = (url: string) => {
        window.location.href = url;
    };

    const cancel = () => {
        finish(appendQueryParam(redirect, "error", "cancelled"));
    };

    const handleContinue = async () => {
        if (!redirectAllowed) {
            setError(INVALID_REDIRECT_MESSAGE);
            return;
        }

        const clientId = getTelegramClientId();
        if (!clientId) {
            cancel();
            return;
        }

        setPending(true);
        setError("");

        try {
            await loadTelegramLoginScript();
            const auth = window.Telegram?.Login?.auth;
            if (!auth) {
                cancel();
                return;
            }

            auth({client_id: clientId, scope: ["profile", "phone"]}, (result) => {
                if (!result || result.error || !result.id_token) {
                    cancel();
                    return;
                }

                finish(appendQueryParam(redirect, "id_token", result.id_token));
            });
        } catch {
            cancel();
        } finally {
            setPending(false);
        }
    };

    return (
        <section className="flex w-full flex-col items-center justify-center gap-4">
            {redirectAllowed ? (
                <CommonButton
                    type="button"
                    variant="primary"
                    disabled={pending}
                    isPending={pending}
                    onClick={() => {
                        void handleContinue();
                    }}
                >
                    Telegram orqali davom etish
                </CommonButton>
            ) : (
                <p className="text-center text-lg text-error-600 dark:text-error-400">
                    {INVALID_REDIRECT_MESSAGE}
                </p>
            )}
            {error ? (
                <p className="text-center text-lg text-error-600 dark:text-error-400">{error}</p>
            ) : null}
        </section>
    );
}
