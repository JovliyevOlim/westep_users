import {Link, useLocation, useNavigate} from "react-router-dom";
import {useFormik} from "formik";
import * as Yup from "yup";
import {useEffect, useState} from "react";
import Button from "../../../ui/Button.tsx";
import InputField from "../../../ui/InputField.tsx";
import PhoneNumberInput from "../../../ui/PhoneNumberInput.tsx";


export default function Register() {

    const location = useLocation();
    const navigate = useNavigate();
    const phoneNumber = location.state?.phoneNumber;

    const [isYoung, setIsYoung] = useState<boolean>(false);
    const [isPending, setIsPending] = useState<boolean>(false);

    console.log(phoneNumber)

    const formik = useFormik({
        initialValues: {
            firstName: '',
            lastName: '',
            birthday: '',
            gender: 'MALE',
            parentNumber: '',
            password: '',
            confirmPassword: '',
        },
        validationSchema: Yup.object().shape({
            firstName: Yup.string().required('Ism kiriting!'),
            lastName: Yup.string().required('Familiyani kiriting!'),
            birthday: Yup.string().required("Tu'gilgan sanani tanlang!"),
            // password: Yup.string()
            //     .required("Parolni kiriting!")
            //     .min(6, "Parol kamida 6 ta belgidan iborat bo‘lishi kerak!"),
            // confirmPassword: Yup.string()
            //     .required("Parolni kiriting!")
            //     .oneOf([Yup.ref("password")], "Parollar bir xil bo‘lishi kerak!"),
            parentNumber: Yup.string().when([], {
                is: () => !isYoung,
                then: (schema) =>
                    schema
                        .required("Telefon raqamni kiriting!").test(
                        "is-valid-uz-number",
                        "Telefon raqami xato kiritildi!",
                        (value) => {
                            if (!value) return false;
                            // raqamdan faqat sonlarni ajratamiz
                            const digits = value.replace(/\D/g, "");
                            // faqat 998 bilan boshlanadigan va jami 12 ta raqam bo‘lishi kerak
                            return digits.startsWith("998") && digits.length === 12;
                        }
                    ), otherwise: (schema) => schema.notRequired(),
            })
        }),
        onSubmit: (values) => {
            setIsPending(true);
            setTimeout(() => {
                navigate('/create-password', {state: {...values, phoneNumber: phoneNumber, text: 'Parol yaratish'}})
                setIsPending(false)
            }, 1000)
        },
    });

    function isOlderThan20(birthDateString: string): boolean {
        const today = new Date();
        const birthDate = new Date(birthDateString);

        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();

        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }

        return age >= 20;
    }

    useEffect(() => {
        if (formik.values.birthday) {
            setIsYoung(isOlderThan20(formik.values.birthday));
        }
    }, [formik.values.birthday]);

    console.log(formik.values)


    return (
        <>
            <section>
                <div className="row d-flex align-items-center justify-content-between">
                    <div className="col-lg col-xs-12 wow fadeIn">
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                formik.handleSubmit();
                                return false;
                            }}>
                            <h3 className={'text-center mb-0'}>Ro'yxatdan o'tish</h3>
                            <p className="login_register_title">Bilimingizni yangi bosqichga olib chiqing!</p>
                            <InputField placeholder={'Ism'} formik={formik}
                                        type='text'
                                        name={"firstName"}
                            />
                            <InputField placeholder={'Familiya'} formik={formik}
                                        type='text'
                                        name={"lastName"}
                            />
                            <InputField placeholder={"Tug'ilgan kun"} formik={formik}
                                        type='date'
                                        name={"birthday"}
                            />
                            {
                                !isYoung &&
                                <>
                                    <div className="form-group mb-2 d-flex align-items-center justify-content-between">
                                        <label className="d-flex align-items-center gap-2 col-5">
                                            <div
                                                className={'form-control-input d-flex justify-content-center align-items-center gap-3'}>
                                                <p className={"m-0"}>
                                                    Ayol
                                                </p>
                                                <input
                                                    type="radio"
                                                    name="gender"
                                                    value="FEMALE"
                                                    style={{transform: "scale(1.8)"}}
                                                    checked={formik.values.gender === 'FEMALE'}
                                                    onChange={formik.handleChange}
                                                />
                                            </div>
                                        </label>

                                        <label className="d-flex align-items-center gap-2 col-5">
                                            <div
                                                className={'form-control-input d-flex justify-content-center align-items-center gap-3'}>
                                                <p className={"m-0"}>
                                                    Erkak
                                                </p>
                                                <input
                                                    type="radio"
                                                    name="gender"
                                                    value="MALE"
                                                    style={{transform: "scale(1.8)"}}
                                                    checked={formik.values.gender === 'MALE'}
                                                    onChange={formik.handleChange}
                                                />
                                            </div>
                                        </label>
                                    </div>
                                    <PhoneNumberInput name={"parentNumber"} formik={formik} className={''}/>
                                </>
                            }
                            <div className="form-group col-lg-12">
                                <Button isPending={isPending} children={'Davom etish'}/>
                            </div>
                            <p className={'text-center text-dark mt-1'}>Akkountingiz bormi? <Link
                                className={"text-primary"} to="/login">Login</Link></p>
                        </form>
                    </div>
                </div>
            </section>
        </>
    )
}
