import Spinner from "../components/common/Spinner.tsx";
import {Button} from "react-bootstrap";
import {CSSProperties} from "react";

type ResponsiveHeight = string | { desktop: string; mobile: string };

type Props = {
    isPending?: boolean;
    variant?: string;
    type?: "button" | "submit" | "reset";
    children: React.ReactNode;
    className?: string;
    height?: ResponsiveHeight;
    onClick?: () => void;
    disabled?: boolean;
};

function Index({
                   isPending = false,
                   variant = "primary",
                   type = "submit",
                   children = "Davom etish",
                   className,
                   height = "54px",
                   onClick,
                   disabled,
               }: Props) {


    const getHeight = (): CSSProperties["height"] => {
        if (typeof height === "string") return height;
        return window.innerWidth <= 768 ? height.mobile : height.desktop;
    };

    return (
        <Button
            style={{height: getHeight()}}
            variant={disabled ? 'secondary' : variant}
            type={type}
            onClick={onClick}
            className={`w-100 fw-bold d-flex justify-content-center align-items-center rounded-pill text-white ${className ?? ""}`}
            disabled={disabled}
        >
            {
                isPending ? <Spinner/> : children
            }
        </Button>
    );
}

export default Index;