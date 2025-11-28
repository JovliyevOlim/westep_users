import {useFormik} from "formik";
import * as Yup from "yup";
import {useOtpPhoneNumber} from "../../../api/auth/useAuth.ts";
import InputField from "../../../ui/InputField.tsx";
import Button from "../../../ui/Button.tsx";


export default function NewPassword() {

    const form = JSON.parse(sessionStorage.getItem('form') as string);
    const {mutate, isPending} = useOtpPhoneNumber('REGISTER')

    const formik = useFormik({
        initialValues: {
            password: '',
            confirmPassword: ''
        },
        validationSchema: Yup.object().shape({
            password: Yup.string()
                .required("Parolni kiriting!")
                .matches(/[A-Z]/, "Kamida bitta katta harf bo‘lishi kerak")
                .matches(/[a-z]/, "Kamida bitta kichik harf bo‘lishi kerak")
                .matches(/\d/, "Kamida bitta raqam bo‘lishi kerak")
                .min(6, "Parol kamida 6 ta belgidan iborat bo‘lishi kerak"),
            confirmPassword: Yup.string()
                .required("Parolni kiriting!")
                .oneOf([Yup.ref("password")], "Parollar bir xil bo‘lishi kerak!"),
        }),
        onSubmit: (values) => {
            sessionStorage.setItem('form', JSON.stringify({
                ...form,password: values.password,
            }));
            mutate({phoneNumber: form.phoneNumber, type: 'REGISTER'})
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
                        >
                            <h4 className="login_register_title">{form?.text}</h4>
                            <InputField name="password" label="" placeholder={'Yangi parol'} type="password"
                                        key='passwords' formik={formik}/>
                            <InputField name="confirmPassword" label="" placeholder={'Parol tasdig’i'} type="password"
                                        key='password' formik={formik}/>
                            <div className="form-group col-lg-12">
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
