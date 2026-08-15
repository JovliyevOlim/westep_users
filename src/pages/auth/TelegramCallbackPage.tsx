import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {useTelegramLogin} from "../../api/auth/useAuth.ts";
import {
    readTelegramCallbackError,
    readTelegramIdTokenFromLocation,
} from "../../components/auth/telegram/openTelegramOidc.ts";
import AuthBrand from "../../components/auth/AuthBrand.tsx";
import AuthText from "../../ui/AuthText.tsx";

export default function TelegramCallbackPage() {
    const navigate = useNavigate();
    const {mutateAsync} = useTelegramLogin();
    const [error, setError] = useState("");

    useEffect(() => {
        const run = async () => {
            const callbackError = readTelegramCallbackError();
            if (callbackError) {
                setError(callbackError);
                return;
            }

            const idToken = readTelegramIdTokenFromLocation();
            if (!idToken) {
                setError("Telegram token qaytmadi. Qaytadan urinib ko'ring.");
                return;
            }

            try {
                await mutateAsync({idToken});
            } catch (nextError) {
                setError(nextError instanceof Error ? nextError.message : "Kirishda xatolik");
            }
        };

        void run();
    }, [mutateAsync]);

    return (
        <>
            <AuthBrand />
            <section className="flex w-full items-center justify-center">
                <div className="w-full max-w-lg">
                    <AuthText body={error || "Telegram orqali kirilmoqda..."} />
                    {error ? (
                        <button
                            type="button"
                            className="mt-6 text-blue-600"
                            onClick={() => navigate("/login")}
                        >
                            Login sahifasiga qaytish
                        </button>
                    ) : null}
                </div>
            </section>
        </>
    );
}
