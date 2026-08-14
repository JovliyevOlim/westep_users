import {useEffect} from "react";
import {FaTelegramPlane} from "react-icons/fa";
import {useTelegramLogin} from "../../../api/auth/useAuth.ts";
import {useToast} from "../../../hooks/useToast.tsx";
import CommonButton from "../../../ui/CommonButton.tsx";

const TELEGRAM_LOGIN_SCRIPT_SRC = "https://telegram.org/js/telegram-login.js";
const TELEGRAM_CANCELLED_MESSAGE = "Telegram orqali kirish bekor qilindi";
const TELEGRAM_UNCONFIGURED_TITLE = "Telegram orqali kirish sozlanmagan";

export type TelegramAuthResult = {
    id_token?: string;
    error?: string;
};

declare global {
    interface Window {
        Telegram?: {
            Login?: {
                auth: (
                    options: { client_id: number; scope: string[] },
                    callback: (result?: TelegramAuthResult | null) => void,
                ) => void;
            };
        };
    }
}

export function getTelegramClientId(): number | null {
    const rawClientId = import.meta.env.VITE_TELEGRAM_CLIENT_ID?.trim() ?? "";
    if (!rawClientId) return null;

    const clientId = Number(rawClientId);
    if (!Number.isFinite(clientId) || clientId <= 0) return null;

    return clientId;
}

let telegramLoginScriptPromise: Promise<void> | null = null;

export function loadTelegramLoginScript(): Promise<void> {
    if (typeof window === "undefined") {
        return Promise.reject(new Error("Telegram login skripti faqat brauzerda ishlaydi"));
    }

    if (window.Telegram?.Login?.auth) {
        return Promise.resolve();
    }

    if (telegramLoginScriptPromise) {
        return telegramLoginScriptPromise;
    }

    telegramLoginScriptPromise = new Promise((resolve, reject) => {
        const settleError = () => {
            telegramLoginScriptPromise = null;
            reject(new Error("Telegram login skripti yuklanmadi"));
        };

        const handleReady = () => {
            if (window.Telegram?.Login?.auth) {
                resolve();
                return;
            }
            settleError();
        };

        const existing = document.querySelector<HTMLScriptElement>(
            `script[src="${TELEGRAM_LOGIN_SCRIPT_SRC}"]`,
        );

        if (existing) {
            existing.addEventListener("load", handleReady, {once: true});
            existing.addEventListener("error", settleError, {once: true});
            return;
        }

        const script = document.createElement("script");
        script.src = TELEGRAM_LOGIN_SCRIPT_SRC;
        script.async = true;
        script.onload = handleReady;
        script.onerror = settleError;
        document.head.appendChild(script);
    });

    return telegramLoginScriptPromise;
}

export default function TelegramLoginButton() {
    const toast = useToast();
    const {mutate, isPending} = useTelegramLogin();
    const clientId = getTelegramClientId();
    const isConfigured = clientId !== null;

    useEffect(() => {
        if (!isConfigured) return;
        void loadTelegramLoginScript().catch(() => undefined);
    }, [isConfigured]);

    const handleClick = async () => {
        if (!clientId) return;

        try {
            await loadTelegramLoginScript();
        } catch {
            toast.error("Telegram login skripti yuklanmadi");
            return;
        }

        const auth = window.Telegram?.Login?.auth;
        if (!auth) {
            toast.error("Telegram login skripti yuklanmadi");
            return;
        }

        auth({client_id: clientId, scope: ["profile", "phone"]}, (result) => {
            if (!result || result.error || !result.id_token) {
                toast.error(TELEGRAM_CANCELLED_MESSAGE);
                return;
            }

            mutate({idToken: result.id_token});
        });
    };

    return (
        <div title={isConfigured ? undefined : TELEGRAM_UNCONFIGURED_TITLE}>
            <CommonButton
                type="button"
                variant="secondary"
                disabled={!isConfigured || isPending}
                isPending={isPending}
                onClick={() => {
                    void handleClick();
                }}
            >
                <FaTelegramPlane className="h-5 w-5" />
                Telegram orqali kirish
            </CommonButton>
        </div>
    );
}
