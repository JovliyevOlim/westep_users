import {useLogin} from "../../../api/auth/useAuth.ts";
import 'react-phone-number-input/style.css';
import {useFormik} from "formik";
import * as Yup from "yup";
import {Link, useLocation} from "react-router-dom";
import Button from "../../../ui/Button.tsx";
import InputField from "../../../ui/InputField.tsx";


export default function PasswordForm() {

    const location = useLocation();
    const phone = location.state?.phoneNumber;
    const {mutateAsync, isPending} = useLogin();


    const formik = useFormik({
        initialValues: {
            password: ''
        },
        validationSchema: Yup.object().shape({
            password: Yup.string()
                .required("Parolni kiriting!")
                .min(6, "Parol kamida 6 ta belgidan iborat bo‘lishi kerak!"),
        }),
        onSubmit: async (values) => {
            await mutateAsync({
                phoneNumber: phone,
                password: values.password
            })
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
                            <p className="login_register_title">Kirish</p>
                            <div className={'form-group'}>
                                <InputField name={'password'} formik={formik} placeholder={'Parol'}
                                            type={'password'}/>

                            </div>
                            <div className="form-group col-lg-12 mt-4">
                                <Button height={{desktop:'54px',mobile:'48px'}} isPending={isPending} type="submit" children={'Kirish'}/>
                            </div>
                            <p className={'mt-2 text-center'}><Link to="/forgot-password">Parolni unutdingizmi?</Link></p>
                        </form>
                    </div>
                </div>
            </section>
        </>
    );
}
