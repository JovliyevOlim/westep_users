import PhoneInput from "react-phone-number-input/min";
import {FormikProps} from "formik";
import {FlagUz} from "../assets/icon";


interface IPhoneNumberInputProps<T> {
    label?: string;
    name: keyof T;
    formik: FormikProps<T>,
    className: string
}

const PhoneNumberInput = <T extends Record<string, any>>({
                                                             label = "",
                                                             name,
                                                             formik,
                                                             className = "",
                                                         }: IPhoneNumberInputProps<T>) => {


    return (
        <div className={`form-group mb-2`}>
            {label && (
                <label htmlFor={name as string} className="form-label fw-medium">
                    {label}
                </label>
            )}
            <PhoneInput
                defaultCountry="UZ"
                value={formik.values[name] ? `+${formik.values[name] as string}` : ""}
                onChange={(e) => {
                    formik.setFieldValue(name as string, e?.replace("+", ""));
                }}
                maxLength={17}
                international
                countryCallingCodeEditable={true} // '+' kiritilmasin
                countrySelectComponent={() => (
                    <span style={{pointerEvents: 'none', display: 'flex', alignItems: 'center'}}>
      <FlagUz width={24} height={24}/>
    </span>
                )}
                className={`${className}`}
            />
            {formik.errors[name] && formik.touched[name] ? (
                <p className={'text-start text-danger m-0'}>{formik.errors[name] as string}</p>
            ) : null}
        </div>
    );
};

export default PhoneNumberInput;