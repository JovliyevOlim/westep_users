import CourseModuleBar from "./CourseModuleBar.tsx";
import {useParams} from "react-router-dom";
import LessonDetails from "../lessonDetails";
import {useGetStudentCourseModulesById} from "../../api/module/useModule.ts";

function Index() {


    const params = useParams();
    const {data} = useGetStudentCourseModulesById(params.id)


    return (
        <div className='relative flex items-top justify-between'>
            {
                data && data.length > 0 && <CourseModuleBar modules={data}/>

            }
            <LessonDetails/>
        </div>
    );
}

export default Index;