import { Menu } from "@headlessui/react";
import person from "../../assets/icon/person.svg"
import arrow from "../../assets/icon/arrow-down.svg"

function UserDropDown() {


    return (
        <div className="flex items-center gap-3">

            {/* Avatar */}
            <div className="w-10 h-10 rounded-full overflow-hidden">
                <img src={person} alt="person" className="w-full h-full object-cover" />
            </div>

            {/* Username */}
            {/*<div className="hidden lg:block">*/}
            {/*    <h5 className="m-0 text-base font-medium">*/}
            {/*        {user?.firstname} {user?.lastname}*/}
            {/*    </h5>*/}
            {/*    <p className="m-0 text-sm text-gray-500">{user?.roleName}</p>*/}
            {/*</div>*/}

            {/* Dropdown */}
            <Menu as="div" className="relative inline-block text-left p-0">
                <Menu.Button className="bg-transparent border-none outline-none">
                    <img src={arrow} alt="arrow" className="w-6 h-6" />
                </Menu.Button>

                {/* Dropdown Menu */}
                <Menu.Items
                    className="absolute right-0 mt-2 w-40 origin-top-right bg-white shadow-lg rounded-md ring-1 ring-black/5 focus:outline-none z-50"
                >
                    <Menu.Item>
                        {({ active }) => (
                            <a
                                href="/profile"
                                className={`block px-4 py-2 text-sm ${
                                    active ? "bg-gray-100" : ""
                                }`}
                            >
                                Profile
                            </a>
                        )}
                    </Menu.Item>

                    <Menu.Item>
                        {({ active }) => (
                            <a
                                href="/logout"
                                className={`block px-4 py-2 text-sm ${
                                    active ? "bg-gray-100" : ""
                                }`}
                            >
                                Logout
                            </a>
                        )}
                    </Menu.Item>
                </Menu.Items>
            </Menu>

        </div>
    );
}

export default UserDropDown;