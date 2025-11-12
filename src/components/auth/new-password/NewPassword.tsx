import {useCreateNewPassword} from "../../../api/auth/useAuth.ts";
import {useFormik} from "formik";
import * as Yup from "yup";
import {useLocation} from "react-router-dom";
import Button from "../../../ui/Button.tsx";
import InputField from "../../../ui/InputField.tsx";


export default function NewPassword() {

    const {mutate, isPending} = useCreateNewPassword();
    const location = useLocation();
    const phone = location.state?.phoneNumber;

    console.log(phone);
    const formik = useFormik({
        initialValues: {
            password: '',
            confirmPassword: ''
        },
        validationSchema: Yup.object().shape({
            password: Yup.string()
                .required("Parolni kiriting!")
                .min(6, "Parol kamida 6 ta belgidan iborat bo‘lishi kerak!"),
            confirmPassword: Yup.string()
                .required("Parolni kiriting!")
                .oneOf([Yup.ref("password")], "Parollar bir xil bo‘lishi kerak!"),
        }),
        onSubmit: async (values) => {
            await mutate({phoneNumber: phone, password: values.password});
        },
    });

    return (
        <>
            <section>
                <div className="row align-items-center">
                    <div className="col-12">
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                formik.handleSubmit();
                                return false;
                            }}
                            className={'login'}
                        >
                            <h4 className="login_register_title">Yangi Parol o'rnatish</h4>
                            <InputField name="password" label="" placeholder={'Yangi parol'} type="password"
                                        key='passwords' formik={formik}/>
                            <InputField name="confirmPassword" label="" placeholder={'Parol tasdig’i'}
                                        type="password"
                                        key='password' formik={formik}/>
                            <div className="form-group col-lg-12 mt-4">
                                <Button height={{desktop: '54px', mobile: '48px'}} isPending={isPending}
                                        children={'Davom etish'}/>
                            </div>
                        </form>

                    </div>
                </div>
            </section>
        </>
    );
}
