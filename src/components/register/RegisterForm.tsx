import {Link} from "react-router-dom";
import {useFormik} from "formik";
import * as Yup from "yup";
import {useEffect, useState} from "react";


export default function RegisterForm() {

    const [isYoung, setIsYoung] = useState<boolean>(false);

    const formik = useFormik({
        initialValues: {
            fullName: '',
            birthday: '',
            parent: 'Ona',
            parentNumber: '',
            password: '',
            confirmPassword: '',
        },
        validationSchema: Yup.object().shape({
            fullName: Yup.string().required('Ism Familiyani kiriting!'),
            birthday: Yup.string().required("Tu'gilgan sanani tanlang!"),
            password: Yup.string()
                .required("Parolni kiriting!")
                .min(6, "Parol kamida 6 ta belgidan iborat bo‘lishi kerak!"),
            confirmPassword: Yup.string()
                .required("Parolni kiriting!")
                .oneOf([Yup.ref("password")], "Parollar bir xil bo‘lishi kerak!"),
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
            // await mutateAsync({phoneNumber: values.phone});
            console.log(values);
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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const newValue = formatPhoneNumber(e.target.value);
        formik.setFieldValue('parentNumber', newValue);
    };

    const formatPhoneNumber = (value: string): string => {
        console.log(value.length)
        // faqat raqamlarni olish
        const digits = value.replace(/\D/g, '');

        // agar hech nima bo‘lmasa
        if (!digits) return '';

        // faqat +998 bilan boshlansin
        let formatted = '+998';

        // foydalanuvchi hali 2 xonali kod kiritmay turganda
        if (digits.length <= 3) {
            return formatted + ' ' + digits.slice(3);
        }

        // +998 (XX
        formatted += ` (${digits.slice(3, 5)}`;

        // +998 (XX) XXX
        if (digits.length > 5) {
            formatted += `) ${digits.slice(5, 8)}`;
        }

        // +998 (XX) XXX-XX
        if (digits.length > 8) {
            formatted += `-${digits.slice(8, 10)}`;
        }

        // +998 (XX) XXX-XX-XX
        if (digits.length > 10) {
            formatted += `-${digits.slice(10, 12)}`;
        }

        return formatted;
    };

    return (
        <>
            <section className="login_register section-padding">
                <div className="container">
                    <div className="row d-flex align-items-center justify-content-between">
                        <div className="col-lg col-xs-12 wow fadeIn">
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    formik.handleSubmit();
                                    return false;
                                }}
                                className="register">
                                <h4 className="login_register_title">Ro'yxatdan o'tish</h4>
                                <div className="form-group mb-3">
                                    <label htmlFor="fullName">Ism Familiya</label>
                                    <input type="text" placeholder="Ism Familiya"
                                           value={formik.values.fullName}
                                           onChange={formik.handleChange}
                                           onBlur={formik.handleBlur}
                                           id="fullName"
                                           className=" form-control m-0" name="fullName"
                                    />
                                    {formik.errors.fullName && formik.touched.fullName ? (
                                        <p className={'text-start d-flex text-danger m-0'}>{formik.errors.fullName}</p>
                                    ) : null}
                                </div>
                                <div className="form-group mb-3">
                                    <label htmlFor="birthday">Tug'ilgan kuni</label>
                                    <input type="date" placeholder=""
                                           value={formik.values.birthday}
                                           onChange={formik.handleChange}
                                           onBlur={formik.handleBlur}
                                           id="birthday"
                                           className=" form-control m-0" name="birthday"
                                    />
                                    {formik.errors.birthday && formik.touched.birthday ? (
                                        <p className={'text-start d-flex text-danger m-0'}>{formik.errors.birthday}</p>
                                    ) : null}
                                </div>
                                {
                                    !isYoung &&
                                    <>
                                        <div className="form-group mb-3 d-flex align-items-center gap-5">
                                            <label className="d-flex align-items-center gap-2">
                                                <input
                                                    type="radio"
                                                    name="parent"
                                                    value="Ona"
                                                    style={{transform: 'scale(1.5)'}}
                                                    checked={formik.values.parent === 'Ona'}
                                                    onChange={formik.handleChange}
                                                />
                                                Ona
                                            </label>

                                            <label className="d-flex align-items-center gap-2">
                                                <input
                                                    type="radio"
                                                    name="parent"
                                                    value="Ota"
                                                    style={{transform: 'scale(1.5)'}}
                                                    checked={formik.values.parent === 'Ota'}
                                                    onChange={formik.handleChange}
                                                />
                                                Ota
                                            </label>
                                        </div>
                                        <div className="form-group mb-3">
                                            <label htmlFor="parentNumber">{formik.values.parent}ni telefon
                                                raqami</label>
                                            <input type="text" placeholder={`${formik.values.parent}ni telefon raqami`}
                                                   value={formik.values.parentNumber}
                                                   onChange={handleChange}
                                                   onBlur={formik.handleBlur}
                                                   id="parentNumber"
                                                   maxLength={19}
                                                   className=" form-control m-0" name="parentNumber"
                                            />
                                            {formik.errors.parentNumber && formik.touched.parentNumber ? (
                                                <p className={'text-start d-flex text-danger m-0'}>{formik.errors.parentNumber}</p>
                                            ) : null}
                                        </div>
                                    </>
                                }

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
                                    <button className="bg_btn bt" type="submit" name="submit">Registratsiya</button>
                                </div>
                                <p>Akkountingiz bormi? <Link to="/login">Login</Link></p>
                            </form>
                        </div>
                        <div className="col-lg-6 col-xs-12 wow fadeIn">
                            <div className="register d-none d-lg-block">
                                <img src="assets/img/about.png" height={'100%'} alt="ewfef"/>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}
