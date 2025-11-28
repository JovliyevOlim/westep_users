import {useEffect} from "react";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.css";
import dateIcon from "../assets/icon/date.svg"
import Hook = flatpickr.Options.Hook;
import DateOption = flatpickr.Options.DateOption;

type PropsType = {
    id: string;
    mode?: "single" | "multiple" | "range" | "time";
    onChange?: Hook | Hook[];
    defaultDate?: DateOption;
    label?: string;
    placeholder?: string;
    className?: string;
};

export default function AuthDatePicker({
                                           id,
                                           mode,
                                           onChange,
                                           label,
                                           defaultDate,
                                           placeholder,
                                           className="",
                                       }: PropsType) {
    useEffect(() => {
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

        const flatPickr = flatpickr(`#${id}`, {
            mode: mode || "single",
            static: false,
            monthSelectorType: "static",
            dateFormat: "Y-m-d",
            defaultDate,
            onChange,
            disableMobile:true,
            allowInput: !isMobile, // Mobilda faqat kalendar ochilsin
            clickOpens: true,
        });

        return () => {
            if (!Array.isArray(flatPickr)) {
                flatPickr.destroy();
            }
        };
    }, [mode, onChange, id, defaultDate]);

    return (
        <div className={`${className} form-group mb-2`}>
            {label && <label htmlFor={id} className="form-label fw-medium">{label}</label>}

            <div className="position-relative">
                <input
                    id={id}
                    type={'text'}
                    placeholder={placeholder}
                    className="form-control-input"

                />

                <span className="position-absolute top-50 end-0 translate-middle-y me-3 me-md-4 text-secondary">
          <img src={dateIcon} alt={label}/>
        </span>
            </div>
        </div>
    );
}
