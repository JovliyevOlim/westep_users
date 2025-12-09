import UserDropDown from "./UserDropDown.tsx";
import logo from "../../assets/logo.svg";
import HeaderNavMenu from "./HeaderNavMenu.tsx";


export default function HeaderOne() {

    return (
        <>
            <header id="navigation" className="w-full hidden lg:block  z-99999">
                <div className="flex items-center justify-between">

                    {/* Logo */}
                    <div className="w-1/6 lg:w-1/4 flex">
                        <div className="flex items-center justify-center">
                            <img src={logo} alt="Logo" className="w-[120px]" />
                        </div>
                    </div>

                    {/* Navigation Menu */}
                    <div className="hidden md:flex w-4/6 lg:w-1/2 justify-center p-0">
                        <HeaderNavMenu />
                    </div>

                    {/* Right side (User dropdown) */}
                    <div className="w-1/6 lg:w-1/4 flex justify-end">
                        <div className="flex gap-3">
                            <UserDropDown />
                        </div>
                    </div>

                </div>
            </header>
        </>
    )
}
