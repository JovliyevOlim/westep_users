import CourseModuleBar from "./CourseModuleBar.tsx";
import {useParams} from "react-router-dom";
import {useGetModuleById} from "../../api/module/useModule.ts";
import LessonDetails from "../lessonDetails";

function Index() {


    const params = useParams();
    const {data} = useGetModuleById(params.id);
    // const {data:progress} = useGetStudentCourseProgress(params.id)


    return (
        <div className='flex items-top justify-between'>
            {
                data && data.length > 0 && <CourseModuleBar modules={data}/>

            }
            <LessonDetails/>
        </div>
    );
}

export default Index;