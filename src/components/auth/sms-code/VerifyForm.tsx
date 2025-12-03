import {useOtpPhoneNumber, useVerifyCode} from "../../../api/auth/useAuth.ts";
import 'react-phone-number-input/style.css';
import Button from "../../../ui/Button.tsx";
import {useEffect,useState} from "react";
import moment from "moment";
import {formatUzPhone} from "../../../utils/utils.ts";


export default function VerifyForm() {
    const form = JSON.parse(sessionStorage.getItem('form') as string)
    const otpType = JSON.parse(sessionStorage.getItem('otpType') as string);
    const {mutate} = useOtpPhoneNumber(otpType)
    const {isPending, mutate: verifyCode, isError} = useVerifyCode();
    const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
    const [remainingTime, setRemainingTime] = useState(3 * 60);
    const [error, setError] = useState<boolean>(isError);


    useEffect(() => {
        setError(isError);
    }, [isError]);


    const getInputElement = (index: number): HTMLInputElement | null => {
        return document.getElementById(`digit${index}-input`) as HTMLInputElement | null;
    };

    // KeyUp hodisasi
    const moveToNext = (index: number, value: string) => {
        setError(false);
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
    }, [remainingTime]);

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
                            <h1 className={'text-center login_register_h1'}>Raqamni tasdiqlash</h1>
                            <p className='login_register_title'>Parol <strong
                                className={'fw-bolder'}> {formatUzPhone(form?.phoneNumber)}</strong> raqamga yuborildi
                            </p>
                            <div className="row justify-content-center">
                                <div className='col-12 d-flex justify-content-between'>
                                    {otp.map((digit, index) => (
                                        <input
                                            type="number"
                                            inputMode="numeric"
                                            pattern="[0-9]*"
                                            autoComplete="one-time-code"
                                            className={`otp-input ${error ? 'border-danger text-danger' : ''}`}
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
                                                // faqat bitta raqam qoldiradi
                                                const v = e.currentTarget.value.replace(/\D/g, "");
                                                e.currentTarget.value = v.slice(0, 1);
                                            }}
                                            key={`digit${index}-input`}
                                        />
                                    ))}
                                </div>
                            </div>
                            <div className="row mt-3 mb-2 justify-content-center">
                                <div className={'col-12 d-flex justify-content-between'}>
                                    <p className={'m-0 fs-5 text-secondary'}>{formatTime(remainingTime)}</p>
                                    {
                                        remainingTime === 0
                                        &&
                                        <p onClick={() => {
                                            mutate({
                                                phoneNumber: form.phoneNumber,
                                                type: otpType
                                            })
                                            setRemainingTime(180)
                                        }} className="fs-5 text-secondary cursor-pointer">Qaytadan yuborish</p>
                                    }

                                </div>
                            </div>
                            <div className="form-group mt-4">
                                <Button onClick={() => {
                                    verifyCode({
                                        phoneNumber: form.phoneNumber,
                                        type: otpType,
                                        code: otp.join(''),
                                    })
                                }} type={'button'} height={{desktop: '54px', mobile: '48px'}} isPending={isPending}
                                        children={'Davom etish'}/>
                            </div>
                    </div>
                </div>
            </section>
        </>
    );
}
