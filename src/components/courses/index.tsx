import {useGetStudentCourseById} from "../../api/courses/useCourse.ts";
import {StudentCourse} from "../../types/types.ts";
import {ArrowRight} from "../../assets/icon";
import {useUser} from "../../api/auth/useAuth.ts";
import StudentCourseCard from "./StudentCourseCard.tsx";


export default function Courses() {
    const {data: user} = useUser()
    const {data} = useGetStudentCourseById(user.id)


    return (
        <div>
            <div className={'flex justify-between items-center'}>
                <h3 className={'text-xl font-normal hidden lg:flex'}>Sizning Darslaringiz</h3>
                <h3 className={'text-xl font-normal lg:hidden'}>Darslarim</h3>
                <div className={'bg-blue-600 rounded-full p-1 text-white lg:hidden'}>
                    <ArrowRight width={24} height={24}/>
                </div>
            </div>
            {
                data && data?.length > 0 ?
                    <div className={'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mt-4'}>
                        {
                            data?.map((course: StudentCourse) =>
                                <StudentCourseCard key={course.id} course={course}/>
                            )
                        }
                    </div>
                    : <h3 className={'text-3xl font-bold text-center p-3'}>Sizda hozircha bironta dars yo'q</h3>

            }
        </div>
    )
}
