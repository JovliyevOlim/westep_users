import {useCheckPhoneNumber, useTelegramWidgetLogin} from "../../../api/auth/useAuth.ts";
import {useFormik} from "formik";
import * as Yup from "yup";
import {useEffect} from "react";
import {useLocation} from "react-router-dom";
import PhoneNumberInput from "../../../ui/PhoneNumberInput.tsx";
import CommonButton from "../../../ui/CommonButton.tsx";
import AuthText from "../../../ui/AuthText.tsx";
import AuthBrand from "../AuthBrand.tsx";
import TelegramLoginButton from "../telegram/TelegramLoginButton.tsx";
import {readTelegramWidgetAuthFromLocation} from "../telegram/openTelegramOidc.ts";
import {clearPostAuthRedirect, setPostAuthRedirect} from "../../../utils/postAuthRedirect.ts";


export default function LoginForm() {
    const location = useLocation();
    const {mutateAsync, isPending} = useCheckPhoneNumber();
    const {mutateAsync: loginTelegramWidget} = useTelegramWidgetLogin();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const nextPath = params.get("next");

        if (nextPath && !nextPath.includes("tgAuthResult")) {
            setPostAuthRedirect(nextPath);
        } else if (location.pathname === "/login") {
            clearPostAuthRedirect();
        }
    }, [location.pathname, location.search]);

    useEffect(() => {
        const widgetAuth = readTelegramWidgetAuthFromLocation();
        if (!widgetAuth) {
            return;
        }
        void loginTelegramWidget(widgetAuth).finally(() => {
            window.history.replaceState(null, "", "/login");
        });
    }, [location.hash, location.search, loginTelegramWidget]);

    const formik = useFormik({
        initialValues: {
            phone: ''
        },
        validationSchema: Yup.object().shape({
            phone: Yup.string()
                .required("Telefon raqami xato kiritildi!")
                .length(12, "Telefon raqami xato kiritildi!"),
        }),
        onSubmit: async (values) => {
            sessionStorage.setItem("form", JSON.stringify({phoneNumber: values.phone}));
            await mutateAsync({phoneNumber: values.phone});
        },
    });

    return (
        <>
            <AuthBrand />
            <section className="flex items-center justify-center w-full">
                <div className="w-full max-w-lg animate-fadeIn">
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            formik.handleSubmit();
                        }}
                        className="bg-transparent"
                    >
                        <AuthText body='Bilimingizni yangi bosqichga olib chiqing!'/>

                        <div className="space-y-6">
                            <PhoneNumberInput name="phone" formik={formik} className=""/>
                        </div>

                        <div className="mt-8 w-full">
                            <CommonButton
                                type="submit"
                                children={"Kirish"}
                                variant="primary"
                                isPending={isPending}
                                disabled={!(formik.isValid && formik.dirty)}
                            />
                        </div>
                    </form>
                    <div className="mt-6 flex items-center gap-3">
                      <div className="h-px flex-1 bg-slate-200" />
                      <span className="text-sm text-slate-400">Yoki</span>
                      <div className="h-px flex-1 bg-slate-200" />
                    </div>
                    <div className="mt-6">
                      <TelegramLoginButton />
                    </div>
                </div>
            </section>
        </>
    );
}
