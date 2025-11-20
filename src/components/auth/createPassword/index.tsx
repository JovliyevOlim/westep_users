import NewPassword from "../../../ui/components/NewPassordUi.tsx";
import {useRequireState} from "../../../hooks/UseRequireState.ts";

function Index() {

    useRequireState('phoneNumber')

    return (
        <>
            <NewPassword/>
        </>
    );
}

export default Index;