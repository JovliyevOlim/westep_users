import {Link, useLocation, useNavigate} from "react-router-dom";
import {useFormik} from "formik";
import * as Yup from "yup";
import {useEffect, useState} from "react";
import Button from "../../../ui/Button.tsx";
import InputField from "../../../ui/InputField.tsx";
import PhoneNumberInput from "../../../ui/PhoneNumberInput.tsx";
import AuthDatePicker from "../../../ui/AuthDatePicker.tsx";


export default function Register() {

    const location = useLocation();
    const navigate = useNavigate();
    const phoneNumber = location.state?.phoneNumber;

    const [isYoung, setIsYoung] = useState<boolean>(false);
    const [isPending, setIsPending] = useState<boolean>(false);


    const formik = useFormik({
        initialValues: {
            firstName: '',
            lastName: '',
            birthday: '',
            gender: 'MALE',
            parentPhone: '',
        },
        validationSchema: Yup.object().shape({
            firstName: Yup.string().required('Ism kiriting!'),
            lastName: Yup.string().required('Familiyani kiriting!'),
            birthday: Yup.string().required("Tu'gilgan sanani tanlang!"),
            parentPhone: Yup.string().when([], {
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
                navigate('/create-password')
                sessionStorage.setItem('form', JSON.stringify({
                    ...values,
                    phoneNumber: phoneNumber,
                    text: 'Parol yaratish'
                }));
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

    console.log(formik.values);
    return (
        <>
            <section>
                <div className="row d-flex align-items-center justify-content-between">
                    <div className="col-12">
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                formik.handleSubmit();
                                return false;
                            }}>
                            <h1 className={'login_register_h1 text-center mb-0'}>Ro'yxatdan o'tish</h1>
                            <p className="login_register_title">Yangi bilimlarga marhamat!</p>
                            <InputField placeholder={'Ism'} formik={formik}
                                        type='text'
                                        name={"firstName"}
                            />
                            <InputField placeholder={'Familiya'} formik={formik}
                                        type='text'
                                        name={"lastName"}
                            />
                            <AuthDatePicker id={'birthday'} placeholder={"Tug'ilgan kun"}  onChange={(e: Date[]) => {
                                const date = new Date(e[0]);
                                const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
                                    .toISOString()
                                    .split("T")[0];
                                formik.setFieldValue('birthday', localDate);
                            }}/>
                            {formik.errors.birthday && formik.touched.birthday ? (
                                <p className={'text-start d-flex text-danger m-0 ps-4'}>{formik.errors.birthday as string}</p>
                            ) : null}
                            {
                                !isYoung && formik.values.birthday &&
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
                                    <PhoneNumberInput name={"parentPhone"} formik={formik} className={''}/>
                                </>
                            }
                            <div className="form-group col-lg-12 mt-4">
                                <Button height={{desktop: '54px', mobile: '48px'}} isPending={isPending}
                                        children={'Davom etish'}/>
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
