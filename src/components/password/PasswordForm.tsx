import {useLogin} from "../../api/auth/useAuth.ts";
import 'react-phone-number-input/style.css';
import {useFormik} from "formik";
import * as Yup from "yup";
import Spinner from "../common/Spinner.tsx";
import {Link, useLocation} from "react-router-dom";


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
                                <h4 className="login_register_title">Kirish</h4>
                                <div className={'form-group mb-5'}>
                                    <label htmlFor="phone" className="form-label">
                                        Parolni kiriting!
                                    </label>
                                    <input type="password" placeholder="Parol" id="password"
                                           className="form-control m-0" name="password"
                                           value={formik.values.password}
                                           onChange={formik.handleChange}
                                           onBlur={formik.handleBlur}/>
                                    {formik.errors.password && formik.touched.password ? (
                                        <p className={'text-start d-flex text-danger m-0'}>{formik.errors.password}</p>
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
