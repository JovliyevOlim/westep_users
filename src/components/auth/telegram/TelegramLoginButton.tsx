import {useState} from "react";
import {FaTelegramPlane} from "react-icons/fa";
import {
    type DeviceLimitExceededDetails,
    isDeviceLimitExceededError,
} from "../../../api/auth/authApi.ts";
import {useTelegramLogin} from "../../../api/auth/useAuth.ts";
import CommonButton from "../../../ui/CommonButton.tsx";
import DeviceLimitModal from "../password/DeviceLimitModal.tsx";
import {startTelegramLoginRedirect} from "./openTelegramOidc.ts";

const TELEGRAM_LOGIN_SCRIPT_SRC = "https://telegram.org/js/telegram-login.js";
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

function getTelegramLoginScript(): HTMLScriptElement | null {
    return document.querySelector<HTMLScriptElement>(
        `script[src="${TELEGRAM_LOGIN_SCRIPT_SRC}"]`,
    );
}

function isTelegramLoginScriptUnusable(script: HTMLScriptElement): boolean {
    if (window.Telegram?.Login?.auth) {
        return false;
    }

    const readyState = (script as HTMLScriptElement & {readyState?: string}).readyState;
    if (readyState === "complete" || readyState === "loaded") {
        return true;
    }

    const status = script.dataset.telegramLogin;
    if (status === "loaded" || status === "error") {
        return true;
    }

    if (typeof performance !== "undefined") {
        return performance.getEntriesByName(TELEGRAM_LOGIN_SCRIPT_SRC).some((entry) => {
            return (entry as PerformanceResourceTiming).responseEnd > 0;
        });
    }

    return false;
}

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
        const settleError = (script?: HTMLScriptElement | null) => {
            const tag = script ?? getTelegramLoginScript();
            if (tag) {
                tag.dataset.telegramLogin = "error";
                tag.remove();
            }
            telegramLoginScriptPromise = null;
            reject(new Error("Telegram login skripti yuklanmadi"));
        };

        const handleReady = (script: HTMLScriptElement) => {
            if (window.Telegram?.Login?.auth) {
                script.dataset.telegramLogin = "loaded";
                resolve();
                return;
            }
            settleError(script);
        };

        const injectScript = () => {
            const script = document.createElement("script");
            script.src = TELEGRAM_LOGIN_SCRIPT_SRC;
            script.async = true;
            script.onload = () => handleReady(script);
            script.onerror = () => settleError(script);
            document.head.appendChild(script);
        };

        const existing = getTelegramLoginScript();
        if (existing) {
            if (isTelegramLoginScriptUnusable(existing)) {
                existing.remove();
                injectScript();
                return;
            }

            existing.addEventListener("load", () => handleReady(existing), {once: true});
            existing.addEventListener("error", () => settleError(existing), {once: true});
            return;
        }

        injectScript();
    });

    return telegramLoginScriptPromise;
}

export default function TelegramLoginButton() {
    const {mutateAsync, isPending} = useTelegramLogin();
    const clientId = getTelegramClientId();
    const isConfigured = clientId !== null;
    const [idToken, setIdToken] = useState<string | null>(null);
    const [deviceLimitDetails, setDeviceLimitDetails] = useState<DeviceLimitExceededDetails | null>(null);
    const [deviceActionError, setDeviceActionError] = useState("");
    const [deletingSessionId, setDeletingSessionId] = useState<string | null>(null);

    const closeDeviceLimitModal = () => {
        setIdToken(null);
        setDeviceLimitDetails(null);
        setDeviceActionError("");
        setDeletingSessionId(null);
    };

    const submitTelegramLogin = async (nextIdToken: string, replaceSessionId?: string) => {
        try {
            await mutateAsync({idToken: nextIdToken, replaceSessionId});
            closeDeviceLimitModal();
        } catch (error) {
            if (isDeviceLimitExceededError(error)) {
                setIdToken(nextIdToken);
                setDeviceLimitDetails(error.details);
                if (replaceSessionId) {
                    setDeviceActionError(error.message);
                }
                return;
            }

            if (replaceSessionId) {
                setDeviceActionError(
                    error instanceof Error
                        ? error.message
                        : "Qurilmani almashtirishda xatolik yuz berdi",
                );
            }
        }
    };

    const handleClick = async () => {
        if (!clientId) return;

        startTelegramLoginRedirect(clientId);
    };

    const handleContinue = async (sessionId: string) => {
        if (!idToken) return;

        setDeletingSessionId(sessionId);
        setDeviceActionError("");

        try {
            await submitTelegramLogin(idToken, sessionId);
        } finally {
            setDeletingSessionId(null);
        }
    };

    return (
        <>
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
            {deviceLimitDetails ? (
                <DeviceLimitModal
                    details={deviceLimitDetails}
                    isDeletingSessionId={deletingSessionId}
                    isPending={isPending}
                    errorMessage={deviceActionError}
                    onClose={closeDeviceLimitModal}
                    onContinue={(sessionId) => {
                        void handleContinue(sessionId);
                    }}
                />
            ) : null}
        </>
    );
}
