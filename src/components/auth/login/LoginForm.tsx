import {useCheckPhoneNumber} from "../../../api/auth/useAuth.ts";
import {useFormik} from "formik";
import * as Yup from "yup";
import Button from "../../../ui/Button.tsx";
import PhoneNumberInput from "../../../ui/PhoneNumberInput.tsx";
import logo from "../../../assets/logo.svg";


export default function LoginForm() {

    const {mutateAsync, isPending} = useCheckPhoneNumber();


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
            <div className='d-flex justify-content-center'>
                <img src={logo} width={220} alt="logo"/>
            </div>
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
                            <p className="login_register_title">Bilimingizni yangi bosqichga olib chiqing!</p>
                            <PhoneNumberInput name={'phone'} formik={formik} className={''}/>
                            <div className="form-group col-lg-12 mt-4 mt-md-5">
                                <Button height={{desktop: '54px', mobile: '48px'}} isPending={isPending}
                                        disabled={!(formik.isValid && formik.dirty)}
                                        children={'Davom etish'}/>
                            </div>
                        </form>
                    </div>
                </div>
            </section>
        </>
    );
}
