import dateIcon from "../assets/icon/date.svg"
import eye from "../assets/icon/eye.svg"
import eyeSlash from "../assets/icon/eye-slash.svg"
import {useState} from "react";
const InputField = ({
                        label = "",
                        type = "text",
                        name,
                        formik,
                        placeholder,
                        icon = null,
                        className = "",
                        ...rest
                    }) => {


   const  [changeType,setChangeType] = useState(type);

    console.log(changeType);
    return (
        <div className={`${className} form-group mb-2`}>
            {label && (
                <label htmlFor={name} className="form-label fw-medium">
                    {label}
                </label>
            )}

            <div className="position-relative">
                <input
                    type={changeType}
                    id={name}
                    name={name}
                    value={formik.values[name]}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder={placeholder}
                    className="form-control"
                    {...rest}
                />
                {(type === "date" || icon) && (
                    <span
                        className="position-absolute top-50 end-0 translate-middle-y me-5 text-secondary"
                        style={{ pointerEvents: "none"}}
                    >
            {icon || <img src={dateIcon} width={24} height={24} alt="date_icon"/>}
          </span>
                )}
                {(type === "password" || icon) && (
                    <span
                        className="position-absolute top-50 end-0 translate-middle-y me-5 text-secondary"
                    >
            {type === "password" && changeType === "text" && <img onClick={()=>setChangeType('password')} src={eye} width={24} height={24} alt="date_icon"/>}
            {type === "password" && changeType === "password" && <img onClick={()=>setChangeType('text')} src={eyeSlash} width={24} height={24} alt="date_icon"/>}
          </span>
                )}
            </div>
            {formik.errors[name] && formik.touched[name] ? (
                <p className={'text-start d-flex text-danger m-0 ps-4'}>{formik.errors[name]}</p>
            ) : null}
        </div>
    );
};

export default InputField;