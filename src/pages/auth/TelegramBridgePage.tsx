import {useEffect, useRef} from "react";
import {useSearchParams} from "react-router-dom";
import {
    getTelegramClientId,
    loadTelegramLoginScript,
} from "../../components/auth/telegram/TelegramLoginButton.tsx";

const DEFAULT_TELEGRAM_REDIRECT = "westep://auth/telegram";

function appendQueryParam(base: string, key: string, value: string) {
    const separator = base.includes("?") ? "&" : "?";
    return `${base}${separator}${key}=${encodeURIComponent(value)}`;
}

export default function TelegramBridgePage() {
    const [searchParams] = useSearchParams();
    const startedRef = useRef(false);

    useEffect(() => {
        if (startedRef.current) return;
        startedRef.current = true;

        const redirect =
            searchParams.get("redirect")?.trim() || DEFAULT_TELEGRAM_REDIRECT;

        const finish = (url: string) => {
            window.location.href = url;
        };

        const cancel = () => {
            finish(appendQueryParam(redirect, "error", "cancelled"));
        };

        const clientId = getTelegramClientId();
        if (!clientId) {
            cancel();
            return;
        }

        void loadTelegramLoginScript()
            .then(() => {
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
            })
            .catch(() => {
                cancel();
            });
    }, [searchParams]);

    return (
        <section className="flex w-full items-center justify-center">
            <p className="text-center text-lg text-slate-600 dark:text-slate-300">
                Telegram orqali kirilmoqda…
            </p>
        </section>
    );
}
