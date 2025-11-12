import Button from "../../../ui/Button.tsx";
import LessonMobileBarModal from "./LessonMobileBarModal";
import {useState} from "react";

function Index() {

    const [modal, setModal] = useState<boolean>(false);

    return (
        <div className="lesson-mobile-bar d-md-none">
            <Button variant="outline-primary" height={"34px"} type={'button'} children={"O'tkan dars"}/>
            <Button variant="outline-primary" height={"34px"} type={'button'} onClick={()=>setModal(true)} children={"Modullarni ko’rish"}/>
            <Button variant="outline-primary" height={"34px"} type={'button'} children={"Keyingi dars"}/>
            <LessonMobileBarModal show={modal} handleClose={()=>setModal(!modal)}/>
        </div>
    );
}

export default Index;