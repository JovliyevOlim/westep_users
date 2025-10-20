import Register from "./Register.tsx";
import {useRequireState} from "../../../hooks/UseRequireState.ts";

 
export default function Index() {
  useRequireState('phoneNumber');
  return (
    <>
    <Register />
    </>
  )
}
