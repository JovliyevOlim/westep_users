import Button from "../../ui/Button.tsx";
import {SuccessIcon} from "../../assets/icon";
import {Link} from "react-router-dom";

function Success() {
    return (
        <section>
            <div className="row align-items-center">
                <div className="col-12">
                    <div className="d-flex justify-content-center align-items-center mb-4">
                        <SuccessIcon width={138} height={138}/>
                    </div>
                    <h4 className="login_register_title fs-1 fw-bold">Ro’yxatdan muvaffaqiyatli o’tdingiz</h4>
                    <div className="form-group col-lg-12">
                        <Link to={'/login'}>
                            <Button height={{desktop: '54px', mobile: '48px'}} isPending={false}
                                    children={'Davom etish'}/>
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Success;