import LessonVedio from "./LessonVedio.tsx";
import LessonRating from "./LessonRating.tsx";
import LessonActionsBottom from "../courseDetails/LessonActionsBottom";
import {useGetLessonById} from "../../api/lesson/useLesson.ts";
import {useParams} from "react-router-dom";
import LessonMobileNavigationBar from "./LessonMobileNavigationBar.tsx";

function LessonActions() {

    const params = useParams();
    const {data} = useGetLessonById(params.lessonId || null);


    return (
        <div className="h-dvh w-full lg:flex-1 lg:p-10">
            {
                data &&
                <div className={'lg:p-8 border border-blue-300 lg:rounded-[16px]'}>
                    <LessonVedio videoUrl={data?.vedioUrl || ""}/>
                    <div className={'px-4 lg:p-0'}>
                        <p className={'text-lg lg:text-2xl text-gray-900 mt-5 font-medium'}>{data.name}</p>
                        <p className={'text-sm text-gray-400  font-light'}>{data.description}</p>
                        <hr className="bg-blue-100 my-6 h-px border-0 hidden lg:block"/>
                        <LessonRating/>
                        <hr className="bg-blue-100 my-6 h-px border-0 hidden lg:block"/>
                        <LessonActionsBottom/>
                    </div>
                </div>
            }
            <LessonMobileNavigationBar/>
        </div>

    );
}

export default LessonActions;