import UserDropDown from "./UserDropDown.tsx";
import {useSidebar} from "../SidebarContext.tsx";
import logo from "../../assets/logo.svg";
import HeaderNavMenu from "./HeaderNavMenu.tsx";


export default function HeaderOne() {

    const {toggleMobileSidebar} = useSidebar()
    return (
        <>
            <header id="navigation">
                <div className="container-fluid">
                    <div className="row align-items-center justify-content-between">
                        <div className={'d-block d-md-none col-2 d-flex align-items-center justify-content-start'}>
                            <i onClick={toggleMobileSidebar} style={{width: '44px', height: '44px'}}
                               className="ti-align-justify d-block d-flex align-items-center justify-content-center"></i>
                        </div>
                        <div className="col-2 col-lg-1 d-flex">
                            <div className="d-flex justify-content-center align-items-center">
                                <img src={logo} alt="Logo" width={120}/>
                            </div>
                        </div>
                        <div className="col-8 col-lg-7 d-none d-md-flex justify-content-center">
                            <HeaderNavMenu/>
                        </div>
                        <div className="col-2 col-lg-3 justify-content-end d-flex">
                            <div className="d-flex gap-3">
                                <UserDropDown/>
                            </div>
                        </div>
                    </div>
                </div>
            </header>
        </>
    )
}
