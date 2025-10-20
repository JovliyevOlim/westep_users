import {useFormik} from "formik";
import * as Yup from "yup";
import {useLocation} from "react-router-dom";
import InputField from "../InputField.tsx";
import Button from "../Button.tsx";



interface mutateProps {
    firstname: string,
    lastname: string,
    birthDate: string,
    gender: string,
    password: string,
    phone:string
}

interface Props {
    isPending: boolean;
    mutate: (variables:mutateProps) => void;
}

export default function NewPassword({mutate, isPending}: Props) {

    const location = useLocation();
    const {text, firstName, lastName, phoneNumber, birthday,gender} = location.state

    console.log("phone", location.state);

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
        onSubmit: (values) => {
            mutate({
                firstname: firstName, lastname: lastName,
                gender,
                birthDate: birthday, phone:
                phoneNumber, password:
                values.password
            })
            ;
        },
    });

    return (
        <>
            <section>
                <div className="row align-items-center">
                    <div className="col-12 wow fadeIn">
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                formik.handleSubmit();
                                return false;
                            }}
                        >
                            <h4 className="login_register_title">{text}</h4>
                            <InputField name="password" label="" placeholder={'Yangi parol'} type="password"
                                        key='passwords' formik={formik}/>
                            <InputField name="confirmPassword" label="" placeholder={'Parol tasdig’i'} type="password"
                                        key='password' formik={formik}/>
                            <div className="form-group col-lg-12">
                                <Button isPending={isPending}/>
                            </div>
                        </form>

                    </div>
                </div>
            </section>
        </>
    );
}
