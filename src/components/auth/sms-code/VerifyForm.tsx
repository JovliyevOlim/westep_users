import {useVerifyCode} from "../../../api/auth/useAuth.ts";
import 'react-phone-number-input/style.css';
import {useFormik} from "formik";
import * as Yup from "yup";
import Spinner from "../../common/Spinner.tsx";
import {Link, useLocation} from "react-router-dom";


export default function VerifyForm() {

    const location = useLocation();
    const {phoneNumber, url} = location.state;
    const {mutate, isPending} = useVerifyCode();


    const formik = useFormik({
        initialValues: {
            otp: ''
        },
        validationSchema: Yup.object().shape({
            otp: Yup.string()
                .required("Parolni kiriting!")
                .min(6, "Parol kamida 6 ta belgidan iborat bo‘lishi kerak!"),
        }),
        onSubmit: async (values) => {
            await mutate({phoneNumber: phoneNumber, otp: values.otp, url: url})
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
                                <h4 className="login_register_title">Tekshirish</h4>
                                <div className={'form-group mb-5'}>
                                    <label htmlFor="phone" className="form-label">
                                        Sms-kodni kiriting!
                                    </label>
                                    <input type="password" placeholder="Parol" id="otp"
                                           className="form-control m-0" name="otp"
                                           value={formik.values.otp}
                                           onChange={formik.handleChange}
                                           onBlur={formik.handleBlur}/>
                                    {formik.errors.otp && formik.touched.otp ? (
                                        <p className={'text-start d-flex text-danger m-0'}>{formik.errors.otp}</p>
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
                                <p><Link to="/forgot-password">Parolni unutdingizmi?</Link></p>
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
