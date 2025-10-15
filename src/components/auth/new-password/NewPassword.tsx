import {useCreateNewPassword} from "../../../api/auth/useAuth.ts";
import {useFormik} from "formik";
import * as Yup from "yup";
import Spinner from "../../common/Spinner.tsx";
import {Link, useLocation} from "react-router-dom";


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
            await mutate({phoneNumber: phone,password:values.password});
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
                                <h4 className="login_register_title">Yangi Parol o'rnatish</h4>
                                <div className="form-group mb-3">
                                    <label htmlFor="password">Parol</label>
                                    <input type="password" placeholder="Parol" id="password"
                                           className="form-control m-0" name="password"
                                           value={formik.values.password}
                                           onChange={formik.handleChange}
                                           onBlur={formik.handleBlur}/>
                                    {formik.errors.password && formik.touched.password ? (
                                        <p className={'text-start d-flex text-danger m-0'}>{formik.errors.password}</p>
                                    ) : null}
                                </div>
                                <div className="form-group mb-3">
                                    <label htmlFor="confirmPassword">Tasdiqlash paroli</label>
                                    <input type="password" placeholder="Tasdiqlash paroli" id="confirmPassword"
                                           className="form-control m-0" name="confirmPassword"
                                           value={formik.values.confirmPassword}
                                           onChange={formik.handleChange}
                                           onBlur={formik.handleBlur}/>
                                    {formik.errors.confirmPassword && formik.touched.confirmPassword ? (
                                        <p className={'text-start d-flex text-danger m-0'}>{formik.errors.confirmPassword}</p>
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
                                <p><Link to="/register">Ro'yhatdan o'tish</Link></p>
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
