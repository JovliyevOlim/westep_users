import {Dropdown} from "react-bootstrap";
import person from "../../assets/icon/person.svg"
import arrow from "../../assets/icon/arrow-down.svg"
import {useUser} from "../../api/auth/useAuth.ts";

function UserDropDown() {

    const {data: user} = useUser()

    return (
        <div className='d-flex align-items-center gap-3'>
            <div className="avatar">
                <img src={person} alt="person"/>
            </div>
            <div className={'d-none d-lg-block'}>
                <h5 className='m-0'>{user?.firstname} {user?.lastname}</h5>
                <p className='m-0 fs-6'>{user?.roleName}</p>
            </div>

            <Dropdown>
                <Dropdown.Toggle className={'bg-transparent border-0'} id="dropdown-basic">
                    <img src={arrow} alt="arrow"/>
                </Dropdown.Toggle>

                <Dropdown.Menu>
                    <Dropdown.Item href="/profile">Profile</Dropdown.Item>
                    <Dropdown.Item href="/logout">Logout</Dropdown.Item>
                    {/*<Dropdown.Item href="/login">*/}
                    {/*    <NavMenu/>*/}
                    {/*</Dropdown.Item>*/}
                </Dropdown.Menu>
            </Dropdown>
        </div>
    );
}

export default UserDropDown;