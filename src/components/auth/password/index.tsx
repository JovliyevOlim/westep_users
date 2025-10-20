import PasswordForm from "./PasswordForm.tsx";
import {useRequireState} from "../../../hooks/UseRequireState.ts";


export default function Login() {
    useRequireState('phoneNumber');
    return (
        <>
            <PasswordForm/>
        </>
    )
}
