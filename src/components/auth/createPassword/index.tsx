import {useRequireState} from "../../../hooks/UseRequireState.ts";
import NewPassword from "./NewPassword.tsx";

function Index() {

    useRequireState('phoneNumber')

    return (
        <>
            <NewPassword/>
        </>
    );
}

export default Index;