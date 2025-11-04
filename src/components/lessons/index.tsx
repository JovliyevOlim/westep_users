import LessonBar from "./LessonBar.tsx";
import LessonActions from "./LessonActions.tsx";

function Index() {
    return (
        <div className='d-flex align-items-top justify-content-between'>
            <LessonBar/>
            <LessonActions/>
        </div>
    );
}

export default Index;