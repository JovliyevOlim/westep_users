import {useEffect, useRef, useState} from 'react';
import {ListGroup} from "react-bootstrap";
import {NavLink, useLocation} from "react-router-dom";
import {useSidebar} from "../SidebarContext.tsx";
import {links} from "../DefaultLayout/sidebar";

function HeaderNavMenu() {
    const {isMobileOpen, toggleMobileSidebar, isExpanded} = useSidebar();
    const location = useLocation();

    const [active, setActive] = useState(0);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const [indicatorStyle, setIndicatorStyle] = useState<React.CSSProperties>({});


    useEffect(() => {
        const activeLinkIndex = links.findIndex(item => item.path === location.pathname)
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
        <ListGroup horizontal ref={containerRef}
        >

            <div
                style={{
                    height: "34px",
                    transition: "transform .25s ease, width .25s ease",
                    ...indicatorStyle
                }}
                className="bg-indicator"
            ></div>
            {links.map(({path, title}: {
                            path: string;
                            title: string;
                        },
                        index: number) => (
                <ListGroup.Item key={index}>
                    <NavLink
                        to={path}
                        onClick={() => {
                            setActive(index)
                            if (isMobileOpen && isExpanded) {
                                toggleMobileSidebar()
                            }
                        }}
                        className={({isActive}) =>
                            ` ${
                                isActive
                                    ? 'active'
                                    : ''
                            }`
                        }
                    >
                        {title}
                    </NavLink>
                </ListGroup.Item>
            ))}
        </ListGroup>

    );
}

export default HeaderNavMenu;