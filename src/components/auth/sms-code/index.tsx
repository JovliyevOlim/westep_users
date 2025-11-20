import VerifyForm from "./VerifyForm.tsx";
import {useRequireState} from "../../../hooks/UseRequireState.ts";


export default function Login() {
    useRequireState('phoneNumber');
    return (
        <>
            <VerifyForm/>
        </>
    )
}
