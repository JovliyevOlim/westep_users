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
        <div className={`${className} mb-3 w-full`}>
            {label && (
                <label
                    htmlFor={name as string}
                    className="text-sm text-gray-400 font-semibold"
                >
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
                countryCallingCodeEditable={true}
                countrySelectComponent={() => (
                    <span style={{pointerEvents: 'none', display: 'flex', alignItems: 'center',marginRight:'10px'}}>
      <FlagUz width={24} height={24}/>
    </span>
                )}
                className={`${className} mb-3 w-full rounded-full  bg-transparent px-4 md:px-8 py-3 text-lg text-gray-900`}
            />

            {formik.errors[name] && formik.touched[name] ? (
                <p className="text-sm text-red-500 mt-2 ml-2">
                    {formik.errors[name] as string}
                </p>
            ) : null}
        </div>
    );
};

export default PhoneNumberInput;