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
            }, 500)
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
                <div className="row d-flex align-items-center">
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
                            <AuthDatePicker id={'birthday'} placeholder={"Tug'ilgan kun"} value={formik.values.birthday}
                                            onChange={(e: Date[]) => {
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
                                    <div
                                        className="form-group mb-2 d-flex align-items-center justify-content-between flex-column gap-3">
                                        <label
                                            className={`${formik.values.gender === 'FEMALE' ? 'border-primary' : 'border-0'} col-12 border  overflow-hidden`}
                                            style={{
                                                borderRadius: "26px",
                                            }}>
                                            <div
                                                className={`${formik.values.gender === 'FEMALE' ? 'border-primary border-0 border-bottom' : 'border-secondary'} form-control-input d-flex  justify-content-between align-items-center gap-3`}>
                                                <p className={"m-0"}>
                                                    Onam
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
                                            <div
                                                className={`phone-wrapper ${formik.values.gender === "FEMALE" ? "open" : ""}`}
                                            >
                                                <PhoneNumberInput
                                                    name="parentPhone"
                                                    formik={formik}
                                                    className={"border-0"}
                                                />
                                            </div>
                                        </label>

                                        <label
                                            className={`${formik.values.gender === 'MALE' ? 'border-primary' : 'border-0'} col-12 border  overflow-hidden`}
                                            style={{
                                                borderRadius: "26px",
                                            }}
                                        >
                                            <div
                                                className={`${formik.values.gender === 'MALE' ? 'border-primary border-0 border-bottom' : 'border-secondary'} form-control-input d-flex  justify-content-between align-items-center gap-3`}>
                                                <p className={"m-0"}>
                                                    Otam
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
                                            <div
                                                className={`phone-wrapper ${formik.values.gender === "MALE" ? "open" : ""}`}
                                            >
                                                <PhoneNumberInput
                                                    name="parentPhone"
                                                    formik={formik}
                                                    className={"border-0"}
                                                />
                                            </div>
                                        </label>
                                    </div>
                                </>
                            }
                            <div className="form-group col-lg-12 mt-4">
                                <Button height={{desktop: '54px', mobile: '48px'}} isPending={isPending}
                                        children={'Davom etish'} disabled={!(formik.isValid && formik.dirty)}/>
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
