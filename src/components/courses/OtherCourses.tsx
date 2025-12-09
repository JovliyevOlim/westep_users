import {useGetCourses} from "../../api/courses/useCourse.ts";
import {Course} from "../../types/types.ts";
import CourseCard from "./CourseCard.tsx";
import {ArrowRight} from "../../assets/icon";


export default function OtherCourses() {
    const {data} = useGetCourses()


    return (
        <div>
            <div className={'flex justify-between items-center'}>
                <h3 className={'text-xl font-normal'}>Siz uchun mahsus</h3>
                <div className={'bg-blue-600 rounded-full p-1 text-white lg:hidden'}>
                    <ArrowRight width={24} height={24}/>
                </div>
            </div>
            <div className={'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mt-4'}>
                {
                    data?.slice(0, 3).map((course: Course) =>
                        <CourseCard key={course.id} course={course}/>
                    )
                }
            </div>

        </div>
    )
}
