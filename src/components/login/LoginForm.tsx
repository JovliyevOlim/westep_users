import {useCheckPhoneNumber} from "../../api/auth/useAuth.ts";
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import {useFormik} from "formik";
import * as Yup from "yup";
import Spinner from "../common/Spinner.tsx";


export default function LoginForm() {

    const {mutateAsync, isPending} = useCheckPhoneNumber();


    const formik = useFormik({
        initialValues: {
            phone: ''
        },
        validationSchema: Yup.object().shape({
            phone: Yup.string()
                .required("Telefon raqami xato kiritildi!")
                .length(13, "Telefon raqami xato kiritildi!"),
        }),
        onSubmit: async (values) => {
            await mutateAsync({phoneNumber: values.phone});
        },
    });

    return (
        <>
            <section className="login_register section-padding">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-lg-6 col-xs-12 wow fadeIn">
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    formik.handleSubmit();
                                    return false;
                                }}
                                className={'login'}
                            >
                                <h4 className="login_register_title">Xush kelibsiz</h4>
                                <div className={'form-group mb-5'}>
                                    <label htmlFor="phone" className="form-label">
                                        Telefon raqamingiz
                                    </label>
                                    <PhoneInput
                                        defaultCountry="UZ"
                                        value={formik.values.phone}
                                        onChange={(e) => {
                                            formik.setFieldValue("phone", e)
                                        }}
                                        international
                                        countryCallingCodeEditable={false}
                                        onBlur={formik.handleBlur}
                                    />
                                    {formik.errors.phone && formik.touched.phone ? (
                                        <p className={'text-start text-danger'}>{formik.errors.phone}</p>
                                    ) : null}

                                </div>
                                <div className="form-group col-lg-12">
                                    <button className="bg_btn bt" disabled={isPending} type="submit"
                                            name="submit">
                                        {
                                            isPending ? <Spinner/> : "Davom Etish"
                                        }
                                    </button>
                                </div>
                            </form>

                        </div>
                        <div className="col-lg-6 col-xs-12 wow fadeIn">
                            <div className="login d-none d-lg-block">
                                <img src="assets/img/about.png" height={'100%'} alt="ewfef"/>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
