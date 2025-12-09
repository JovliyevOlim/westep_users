import {StudentCourse} from "../../types/types.ts";
import {useNavigate} from "react-router-dom";
import Image from "../../ui/Image"

interface props {
    course: StudentCourse;
}

function StudentCourseCard({course}: props) {

    const navigate = useNavigate();

    function handleCourse(item: StudentCourse) {
        navigate(`/courses/${item.courseId}`)
    }

    return (
        <>
            <div className={'border border-blue-200 rounded-3xl overflow-hidden h-full flex flex-col'}>
                <div className="w-full h-[180px]">
                    <Image id={course?.attachmentId}/>
                </div>
                <div className={'p-4 flex flex-col justify-between flex-1'}>
                    <div>
                        <h3 className={'text-md font-medium break-all'}>{course?.courseName}</h3>
                        <div className={'flex items-center gap-3 mt-2 justify-start flex-wrap'}>
                            {/*<p className={'text-xs font-light break-all'}>{course?.description}</p>*/}
                        </div>
                    </div>
                    <button
                        onClick={() => handleCourse(course)}
                        className={'w-full h-[40px] mt-3 bg-blue-50 text-blue-400 border border-blue-400 rounded-full p-1 text-center'}>
                        Davom etish
                    </button>
                </div>
            </div>
        </>
    );
}

export default StudentCourseCard;