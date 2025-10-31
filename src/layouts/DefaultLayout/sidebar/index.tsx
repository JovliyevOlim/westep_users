import {useEffect, useRef} from 'react';
import {NavLink, useLocation} from 'react-router-dom';
import logo from "../../../assets/logo.svg"
import {Home, Lesson, ShoppingCart, BookMark} from "../../../assets/icon";

interface SidebarProps {
    sidebarOpen: boolean;
    setSidebarOpen: (arg: boolean) => void;
    // sidebarExpanded: boolean;
    // setSidebarExpanded: (arg: boolean) => void;
}


const links = [
    {path: "/", title: "Asosiy", icon: Home},
    {path: "/lessons", title: "Darslar", icon: Lesson},
    {path: "/cart", title: "Keyin ko'rish", icon: BookMark},
    {path: "/shop", title: "Xaridlar", icon: ShoppingCart}
]

const Sidebar = ({sidebarOpen, setSidebarOpen}: SidebarProps) => {
    const location = useLocation();

    const {pathname} = location;

    const trigger = useRef<any>(null);
    const sidebar = useRef<any>(null);
    // const {userPermissions} = useSelector((state: any) => state.Login);


    useEffect(() => {
        const clickHandler = ({target}: MouseEvent) => {
            if (!sidebar.current || !trigger.current) return;
            if (
                !sidebarOpen ||
                sidebar.current.contains(target) ||
                trigger.current.contains(target)
            )
                return;
            setSidebarOpen(false);
        };
        document.addEventListener('click', clickHandler);
        return () => document.removeEventListener('click', clickHandler);
    });

    useEffect(() => {
        const keyHandler = ({keyCode}: KeyboardEvent) => {
            if (!sidebarOpen || keyCode !== 27) return;
            setSidebarOpen(false);
        };
        document.addEventListener('keydown', keyHandler);
        return () => document.removeEventListener('keydown', keyHandler);
    });


    return (
        <aside
            ref={sidebar}
            className={`sidebar ${
                sidebarOpen ? 'open' : 'closed'
            }`}
        >
            <div className="d-flex justify-content-center align-items-center" style={{height: '100px'}}>
                <div className="site-logo d-flex px-4 justify-content-between align-items-center">
                    <img src={logo} alt="Logo"/>
                    <i onClick={() => setSidebarOpen(false)} className="d-md-none fa-solid fa-xmark display-6"></i>
                </div>
            </div>

            {/* Sidebar Menu */}
            <nav className="mt-3 px-2">
                <ul className="list-unstyled">
                    {links.map(({path, icon: Icon, title}: {
                                    path: string;
                                    icon: React.ElementType;
                                    title: string;
                                },
                                index: number) => (
                        <li key={index} className="mb-5">
                            <NavLink
                                to={path}
                                className={({isActive}) =>
                                    `d-md-flex gap-1 d-none align-items-center fs-6 px-3 py-3 rounded ${
                                        isActive
                                            ? 'bg-info text-dark rounded-4'
                                            : 'text-secondary'
                                    }`
                                }
                            >
                                <Icon width={24} height={24}/>
                                <p className={'m-0'} style={{fontSize: '12px'}}>
                                    {title}
                                </p>
                            </NavLink>
                            <NavLink
                                onClick={() => setSidebarOpen(false)}
                                to={path}
                                className={({isActive}) =>
                                    `d-flex d-md-none align-items-center px-3 py-2 rounded ${
                                        isActive || pathname.includes(path)
                                            ? 'bg-info text-dark rounded-4'
                                            : 'text-secondary'
                                    }`
                                }
                            >
                                <Icon style={{stroke: "#0D5FF9"}} width={24} height={24}/>
                                <p className={'m-0'} style={{fontSize: '12px'}}>
                                    {title}
                                </p>
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </nav>
        </aside>
    );
};

export default Sidebar;