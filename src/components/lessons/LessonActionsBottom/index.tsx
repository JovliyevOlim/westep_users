import {ListGroup} from "react-bootstrap";
import {NavLink, Route, useLocation, Routes, Navigate} from "react-router-dom";
import {useSidebar} from "../../../layouts/SidebarContext.tsx";
import React, {useEffect, useRef, useState} from "react";
import Questions from "./Questions.tsx";
import Files from "./Files.tsx";
import Feedbacks from "./Feedbacks.tsx";

export const links = [
    {path: "/lessons/questions", title: "Savollar"},
    {path: "/lessons/files", title: "Materiallar"},
    {path: "/lessons/feedbacks", title: "Izohlar"},
]

function Index() {

    const {isMobileOpen, toggleMobileSidebar, isExpanded} = useSidebar();
    const location = useLocation();

    const [active, setActive] = useState(0);
    const bottomRef = useRef<HTMLDivElement | null>(null);
    const [indicatorStyle, setIndicatorStyle] = useState<React.CSSProperties>({});


    useEffect(() => {
        const activeLinkIndex = links.findIndex(item => {
            if (location.pathname === "/lessons") {
                return item.path === "/lessons/questions";
            }
            return location.pathname.startsWith(item.path);
        });

        setActive(activeLinkIndex >= 0 ? activeLinkIndex : 0);
    }, [location.pathname]);

    useEffect(() => {
        const wrapper = bottomRef.current;
        const activeEl = wrapper?.children[active + 1] as HTMLElement | undefined;

        if (activeEl) {
            setIndicatorStyle({
                width: `${activeEl.offsetWidth}px`,
                transform: `translateX(${activeEl.offsetLeft}px)`
            });
        }
    }, [active]);

    return (
        <div className='lesson-actions-bottom mt-5'>
            <div className='d-flex align-items-center justify-content-between'>
                <div>
                    <ListGroup horizontal ref={bottomRef}>

                        <div
                            style={{
                                height: "58px",
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
                </div>
                <div></div>
            </div>
            <div className='mt-5'>
                <Routes>
                    <Route path="/" element={<Navigate to="questions" replace/>}/>
                    <Route path="questions" element={<Questions/>}/>
                    <Route path="files" element={<Files/>}/>
                    <Route path="feedbacks" element={<Feedbacks/>}/>
                </Routes>
            </div>
        </div>
    );
}

export default Index;