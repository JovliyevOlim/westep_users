import LessonBar from "./LessonBar.tsx";
import LessonActions from "./LessonActions.tsx";
import LessonMobileBar from "./LessonMobileBar";

function Index() {
    return (
        <div className='d-flex align-items-top justify-content-between'>
            <LessonBar/>
            <LessonActions/>
            <LessonMobileBar/>
        </div>
    );
}

export default Index;