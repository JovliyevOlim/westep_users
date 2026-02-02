import CourseModuleBar from "./CourseModuleBar.tsx";
import {useLocation, useParams} from "react-router-dom";
import LessonDetails from "../lessonDetails";
import {useGetModuleById, useGetStudentCourseModulesById} from "../../api/module/useModule.ts";

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