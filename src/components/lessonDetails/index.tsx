import {Route, Routes} from "react-router-dom";
import LessonActions from "./LessonActions.tsx";

function Index() {
    return (
        <>
            <Routes>
                <Route
                    path={':moduleId/:lessonId/*'}
                    element={<LessonActions/>}
                />
            </Routes>
        </>
    );
}

export default Index;