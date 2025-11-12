import Modal from 'react-bootstrap/Modal';
import LessonBarAccordion from "../LessonBarAccordion.tsx";
import Button from "../../../ui/Button.tsx";

function LessonMobileBarModal({show,handleClose}:{show:boolean, handleClose:()=>void}) {


    return (
        <>
            <Modal show={show} onHide={handleClose}>
                <Modal.Body className="p-0">
                    <div className='lesson-bar-modal'>
                        <LessonBarAccordion/>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" type='button' onClick={handleClose}>
                        Orqaga
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default LessonMobileBarModal;