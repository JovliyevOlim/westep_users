import Spinner from "../components/common/Spinner.tsx";
import {Button} from "react-bootstrap";


type Props = {
    isPending?: boolean;
    variant?: string;
    type?: "button" | "submit" | "reset";
    children: React.ReactNode;
    className?: string;
    height?: string;
};

function Index({
                   isPending = false,
                   variant = "primary",
                   type = "submit",
                   children = "Davom etish",
                   className,
                   height = "54px",
               }: Props) {
    return (
        <Button
            style={{height: height}}
            variant={variant}
            type={type}
            className={`w-100 rounded-pill ${className ?? ""}`}
            disabled={isPending}
        >
            {
                isPending ? <Spinner/> : children
            }
        </Button>
    );
}

export default Index;