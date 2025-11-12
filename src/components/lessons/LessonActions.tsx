import LessonVedio from "./LessonVedio.tsx";
import LessonRating from "./LessonRating.tsx";
import LessonActionsBottom from "./LessonActionsBottom";

function LessonActions() {
    return (
        <>
            <div className='lesson-actions'>
                <LessonVedio videoUrl={'https://youtu.be/u3NFxGsS9Us?si=dlOtH_11j1x5MuC8'}/>
                <LessonRating/>
                <LessonActionsBottom/>
            </div>
        </>

    );
}

export default LessonActions;