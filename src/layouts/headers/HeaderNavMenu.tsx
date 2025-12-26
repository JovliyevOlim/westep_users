import {useEffect, useRef, useState} from 'react';
import {NavLink, useLocation} from "react-router-dom";
import {links} from "../DefaultLayout/sidebar";

function HeaderNavMenu() {
    const location = useLocation();

    const [active, setActive] = useState(0);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const [indicatorStyle, setIndicatorStyle] = useState<React.CSSProperties>({});


    useEffect(() => {
        const activeLinkIndex = links.findIndex(item => {
            if (item.path === "/") {
                return location.pathname === "/";
            }

            return location.pathname.startsWith(item.path);
        });
        setActive(activeLinkIndex);
    }, [location.pathname]);

    useEffect(() => {
        const wrapper = containerRef.current;
        const activeEl = wrapper?.children[active + 1] as HTMLElement | undefined;

        if (activeEl) {
            setIndicatorStyle({
                width: `${activeEl.offsetWidth}px`,
                transform: `translateX(${activeEl.offsetLeft}px)`
            });
        }
    }, [active]);

    return (
        <div
            ref={containerRef}
            className="relative flex gap-2 overflow-x-auto whitespace-nowrap"
        >

            {/* Indicator */}
            <div
                className="absolute bg-blue-500 rounded-md"
                style={{
                    height: "34px",
                    transition: "transform .25s ease, width .25s ease",
                    ...indicatorStyle,
                }}
            ></div>

            {/* Links */}
            {links.map(({ path, title }, index) => (
                <div key={index} className="relative z-10 px-2">
                    <NavLink
                        to={path}
                        onClick={() => {
                            setActive(index);
                        }}
                        className={({ isActive }) =>
                            `
            block px-3 py-2 rounded-md text-sm font-medium
            transition-colors duration-200
            ${
                                isActive
                                    ? "text-blue-600 font-semibold"
                                    : "text-gray-600 hover:text-black"
                            }
          `
                        }
                    >
                        {title}
                    </NavLink>
                </div>
            ))}

        </div>

    );
}

export default HeaderNavMenu;