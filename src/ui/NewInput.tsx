import {FormikProps} from "formik";

interface InputProps<T> {
    label?: string;
    type?: string;
    placeholder?: string;
    className?: string;
    disabled?: boolean;
    name: keyof T;
    formik: FormikProps<T>;
}

const NewInput = <T extends Record<string, any>>({
                                                     type = "text",
                                                     name,
                                                     placeholder,
                                                     className = "",
                                                     formik,label
                                                 }: InputProps<T>) => {
    const inputClasses = `outline-hidden w-full text-md text-gray-900 font-semibold ${className}`;


    return (
        <div className="relative">
            {
                label &&
                <label className={'text-sm text-gray-400 font-semibold'}>
                    {label}
                </label>
            }
            <input
                type={type}
                id={name as string}
                name={name as string}
                value={formik.values[name]}
                onChange={formik?.handleChange}
                onBlur={formik?.handleBlur}
                placeholder={placeholder}
                className={inputClasses}
            />

            {formik?.errors[name] && formik?.touched[name] && (
                <p
                    className={`text-xs ${
                        formik?.errors[name] && formik.touched[name]
                        && "text-error-500"}`}
                >
                    {formik?.errors[name] as string}
                </p>
            )}
        </div>
    );
};

export default NewInput;
