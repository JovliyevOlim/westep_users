import CourseModuleBar from "./CourseModuleBar.tsx";
import LessonDetails from "../lessonDetails";
import {useGetModuleById, useGetStudentCourseModulesById} from "../../api/module/useModule.ts";
import {useParams} from "react-router-dom";

function Index() {


    const params = useParams();
    const {data} = useGetStudentCourseModulesById(params.id)
    const {data: modules} = useGetModuleById(params.courseId);


    return (
        <div className='relative flex items-top justify-between'>
            {
                data && data.length > 0 && <CourseModuleBar modules={data} allModules={modules}/>

            }
            <LessonDetails/>
        </div>
    );
}

export default Index;