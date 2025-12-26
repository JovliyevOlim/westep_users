import {NavLink, Route, useLocation, Routes, Navigate} from "react-router-dom";
import {useEffect, useRef} from "react";
import Questions from "./Questions.tsx";
import Files from "./Files.tsx";
import Feedbacks from "./Feedbacks.tsx";

export const links = [
    {path: ":moduleId/:lessonId/questions", title: "Savollar"},
    {path: ":moduleId/:lessonId/files", title: "Materiallar"},
    {path: ":moduleId/:lessonId/feedbacks", title: "Izohlar"},
]

function Index() {

    const location = useLocation();

    const bottomRef = useRef<HTMLDivElement | null>(null);


    useEffect(() => {
        // const activeLink = links.findIndex((item) =>
        //     matchPath(
        //         {path: item.path, end: true},
        //         location.pathname
        //     )
        // );

    }, [location.pathname]);



    return (
        <div className='mt-5'>
            <div className='flex items-center justify-between'>
                <div>
                    <div ref={bottomRef} className={'flex items-center gap-2'}>
                        {links.map(({path, title}: {
                                        path: string;
                                        title: string;
                                    }) => (
                            <NavLink
                                to={path}
                                className={({isActive}) =>
                                    `p-3 rounded-3xl ${
                                        isActive
                                            ? 'bg-primary-500 text-white '
                                            : ''
                                    }`
                                }
                            >
                                {title}
                            </NavLink>
                        ))}


                    </div>
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