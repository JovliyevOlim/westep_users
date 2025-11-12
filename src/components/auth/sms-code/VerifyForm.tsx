import {useVerifyCode} from "../../../api/auth/useAuth.ts";
import 'react-phone-number-input/style.css';
import {useFormik} from "formik";
import * as Yup from "yup";
import Button from "../../../ui/Button.tsx";
import {useEffect, useState} from "react";
import moment from "moment";


export default function VerifyForm() {

    // const {phoneNumber, url} = location.state;
    const {isPending} = useVerifyCode();
    const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
    const [remainingTime, setRemainingTime] = useState(3 * 60);


    const getInputElement = (index: number): HTMLInputElement | null => {
        return document.getElementById(`digit${index}-input`) as HTMLInputElement | null;
    };

    // KeyUp hodisasi
    const moveToNext = (index: number, value: string) => {
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);
        // Agar qiymat uzunligi 1 bo'lsa, keyingi inputga o'tadi
        if (value.length === 1) {
            if (index < 5) {
                const nextInput = getInputElement(index + 1);
                nextInput?.focus();
            } else {
                // Oxirgi inputdan keyin submit qilish
                console.log("Submit code:", newOtp.join(""));
            }
        }
    };

    const handleBackspace = (index: number, value: string) => {
        if (value === "" && index > 0) {
            const prevInput = getInputElement(index - 1);
            prevInput?.focus();
        }
    };

    const formik = useFormik({
        initialValues: {
            otp: ''
        },
        validationSchema: Yup.object().shape({
            otp: Yup.string()
                .required("Parolni kiriting!")
                .min(6, "Parol kamida 6 ta belgidan iborat bo‘lishi kerak!"),
        }),
        onSubmit: async () => {
            // await mutate({phoneNumber: phoneNumber, otp: values.otp, url: url})
        },
    });

    useEffect(() => {
        const interval = setInterval(() => {
            setRemainingTime((prevTime) => {
                if (prevTime <= 1) {
                    clearInterval(interval); // Taymer tugadi
                    return 0;
                }
                return prevTime - 1;
            });
        }, 1000);

        return () => clearInterval(interval); // Komponent unmounted bo'lsa, intervalni to'xtatish
    }, []);

    const formatTime = (seconds: number) => {
        const duration = moment.duration(seconds, "seconds");
        const minutes = Math.floor(duration.asMinutes());
        const secs = duration.seconds();
        return `${minutes}:${secs.toString().padStart(2, "0")}`; // 2 xonali ko'rinish
    };

    return (
        <>
            <section>
                <div className="row align-items-center">
                    <div className="col-12">
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                formik.handleSubmit();
                                return false;
                            }}
                        >
                            <h1 className={'text-center login_register_h1'}>Raqamni tasdiqlash</h1>
                            <p className='login_register_title'>Parol <strong className={'fw-bolder'}>99820 008 08
                                08</strong> raqamga yuborildi</p>
                            <div className="row justify-content-center">
                                <div className='col-12 d-flex justify-content-between'>
                                    {otp.map((digit, index) => (
                                        <input
                                            type="number"
                                            className={'otp-input'}
                                            maxLength={1}
                                            id={`digit${index}-input`}
                                            value={digit}
                                            onChange={(e) => moveToNext(index, e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === "Backspace") {
                                                    handleBackspace(index, e.currentTarget.value);
                                                }
                                            }}
                                            onInput={(e) => {
                                                // Faqat bir raqamli qiymat qoldirish
                                                const value = e.currentTarget.value;
                                                if (value.length > 1) {
                                                    e.currentTarget.value = value[0]; // Faqat birinchi raqamni qoldiradi
                                                }
                                            }}
                                            key={`digit${index}-input`}
                                        />
                                    ))}
                                </div>
                            </div>
                            <div className="row mt-3 mb-2 justify-content-center">
                                <div className={'col-12 d-flex justify-content-between'}>
                                        <p className={'m-0 fs-5 text-secondary'}>{formatTime(remainingTime)}</p>
                                        <p onClick={() => {
                                            // dispatch(refreshVerifyCode())
                                        }} className="fs-5 text-secondary cursor-pointer">Qaytadan yuborish</p>
                                </div>
                            </div>
                            <div className="form-group mt-4">
                                <Button height={{desktop: '54px', mobile: '48px'}} isPending={isPending}
                                        children={'Davom etish'}/>
                            </div>
                        </form>
                    </div>
                </div>
            </section>
        </>
    );
}
