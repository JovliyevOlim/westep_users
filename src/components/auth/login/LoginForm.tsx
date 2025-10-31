import {useCheckPhoneNumber} from "../../../api/auth/useAuth.ts";
import {useFormik} from "formik";
import * as Yup from "yup";
import Button from "../../../ui/Button.tsx";
import PhoneNumberInput from "../../../ui/PhoneNumberInput.tsx";


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
            await mutateAsync({phoneNumber: values.phone});
        },
    });

    return (
        <>
            <section>
                <div className="row align-items-center">
                    <div className="col-lg-12 col-xs-12 wow fadeIn">
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                formik.handleSubmit();
                                return false;
                            }}
                        >
                            <p className="login_register_title">Bilimingizni yangi bosqichga olib chiqing!</p>
                            <PhoneNumberInput name={'phone'} formik={formik} className={''}/>
                            <div className="form-group col-lg-12 mt-5">
                                <Button isPending={isPending} children={'Davom etish'}/>
                            </div>
                        </form>
                    </div>
                </div>
            </section>
        </>
    );
}
