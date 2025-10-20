import PhoneInput from "react-phone-number-input/min";
import {FormikProps} from "formik";


interface IFormValues {
    phone?: string;
    parentPhoneNumber?: string;
}

interface IPhoneNumberInputProps {
    label?: string;
    name: keyof IFormValues;
    formik: FormikProps<IFormValues>,
    className: string
}

const PhoneNumberInput = ({
                              label = "",
                              name,
                              formik,
                              className = "",
                          }: IPhoneNumberInputProps) => {


    return (
        <div className={`${className} form-group mb-2`}>
            {label && (
                <label htmlFor={name} className="form-label fw-medium">
                    {label}
                </label>
            )}
            <PhoneInput
                defaultCountry="UZ"
                value={formik.values[name]}
                onChange={(e) => {
                    formik.setFieldValue(name, e)
                }}
                international
                countryCallingCodeEditable={false}
            />
            {formik.errors[name] && formik.touched[name] ? (
                <p className={'text-start text-danger m-0'}>{formik.errors[name]}</p>
            ) : null}
        </div>
    );
};

export default PhoneNumberInput;