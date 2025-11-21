import Toast from 'react-bootstrap/Toast';
import {useState} from "react";

function Alert({variant, message, title}: { variant: string, message?: string, title?: string }) {
    const [show, setShow] = useState(true);
    return (
        <Toast className={'rounded-4  overflow-hidden'} bg={variant.toLowerCase()} onClose={() => setShow(false)} show={show}>
            <Toast.Header className={'rounded-0 border-0'}>
                {/*<img src="holder.js/20x20?text=%20" className="rounded me-2" alt="" />*/}
                <strong className="me-auto">{title}</strong>
                {/*<small>11 mins ago</small>*/}
            </Toast.Header>
            {
                message && <Toast.Body >{message}</Toast.Body>
            }
        </Toast>
    );
}

export default Alert;