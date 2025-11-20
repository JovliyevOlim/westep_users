import {useFormik} from "formik";
import * as Yup from "yup";
import PhoneNumberInput from "../../../ui/PhoneNumberInput.tsx";
import Button from "../../../ui/Button.tsx";


export default function ForgotPassword() {



    const formik = useFormik({
        initialValues: {
            phone: ''
        },
        validationSchema: Yup.object().shape({
            phone: Yup.string()
                .required("Telefon raqami xato kiritildi!")
                .length(13, "Telefon raqami xato kiritildi!"),
        }),
        onSubmit: async () => {
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
                            <h4 className="login_register_title">Parolni tiklash</h4>
                            <PhoneNumberInput name={'phone'} formik={formik} className={''}/>
                            <div className="form-group col-lg-12 mt-4 mt-md-5">
                                <Button height={{desktop: '54px', mobile: '48px'}} isPending={false}
                                        children={'Davom etish'}/>
                            </div>
                        </form>

                    </div>
                </div>
            </section>
        </>
    );
}
