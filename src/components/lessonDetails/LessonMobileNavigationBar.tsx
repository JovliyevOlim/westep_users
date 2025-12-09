import LessonMobileBarModal from "../courseDetails/LessonMobileBar/LessonMobileBarModal.tsx";
import {useState} from "react";

function MobileNavigation() {
    const [modal, setModal] = useState<boolean>(false);


    return (
        <>
            {
                !modal &&
                <div className={'fixed bottom-4 left-1/2 -translate-x-1/2 w-full p-3 lg:hidden'}>
                    <div className={`flex`}>
                        <button className={'text-primary-500 rounded-[100px] border border-blue-300 px-2 h-11'}>
                            Oldingi Dars
                        </button>
                        <button onClick={() => setModal(true)}
                                className={'flex-1 text-primary-500 rounded-[100px] border border-blue-300 px-2 h-11'}>
                            Modullarni ko’rish
                        </button>
                        <button className={'text-primary-500 rounded-[100px] border border-blue-300 px-2 h-11'}>
                            Keyingi dars
                        </button>
                    </div>
                </div>
            }
            <LessonMobileBarModal show={modal} handleClose={setModal}/>
        </>

    );
}

export default MobileNavigation;