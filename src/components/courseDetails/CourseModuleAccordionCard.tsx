import {TickCircle} from "../../assets/icon";
import {useEffect, useState} from "react";
import {Lesson, Module} from "../../types/types.ts";
import {useGetLessons} from "../../api/lesson/useLesson.ts";
import Spinner from "../../ui/Spinner.tsx";
import {Link, useNavigate, useParams} from "react-router-dom";
import {useMobile} from "../../hooks/useMobile.ts";
import {useGetLessonsProgressList, useStartLessonProgress} from "../../api/lessonProgress/useLessonProgress.ts";
import {useGetModulesProgressList} from "../../api/modulesProgress/useModuleProgress.ts";
import {FaLock} from "react-icons/fa";


function CourseModuleAccordionCard({modules, setModal, allModules}: {
    modules: Module[],
    allModules: Module[],
    setModal?: (modal: boolean) => void
}) {

    const [openIndex, setOpenIndex] = useState<string | null>(null);
    const [openLessonId, setOpenLessonId] = useState<number>(0);
    const [studentLesson, setStudentLesson] = useState<Lesson[]>([]);
    const navigate = useNavigate();
    const params = useParams();
    const {mutate} = useStartLessonProgress()
    const {data: progress} = useGetModulesProgressList(params.id)
    const {data: lessonProgress} = useGetLessonsProgressList(params.id)
    const isMobile = useMobile()
    const {data: lessons, isPending} = useGetLessons(openIndex)
    const toggle = (index: string) => {
        setOpenIndex(prev => (prev === index ? null : index));
    };


    useEffect(() => {
        if (progress && progress.length > 0) {
            const isActiveModule = modules.find((item: Module) => item.id === progress[0].moduleId);
            setOpenIndex(isActiveModule?.id || null);
        }
    }, [progress]);


    function getItemClasses(item: Lesson, classDone: string, classActive: string) {
        if (item?.orderIndex === openLessonId) {
            return classActive;
        } else {
            return classDone;
        }
    }


    useEffect(() => {
        if (lessonProgress && lessonProgress.length > 0 && lessons && lessons.length > 0) {
            let activeOrderIndex = 0
            const newList = lessons.map((item: Lesson) => {
                if (item.id === lessonProgress[0].lessonId) {
                    activeOrderIndex = item.orderIndex
                    setOpenLessonId(item.orderIndex)
                    navigate(`${openIndex}/${item.id}`);
                    return {...item, completed: false, progress: true};
                } else if (activeOrderIndex === 0) {
                    return {...item, completed: true, progress: false};
                }
                return {...item, completed: false, progress: false};
            })
            setStudentLesson(newList);
        } else if (lessons && lessons.length > 0) {
            const newList = lessons.map((item: Lesson, index: 0) => {
                if (index === 0) {
                    setOpenLessonId(item.orderIndex)
                    navigate(`${openIndex}/${item.id}`);
                    mutate({
                        studentCourseId: params.id,
                        lessonId: item.id
                    })
                    return {...item, completed: false, progress: true};
                }
                return {...item, completed: false, progress: false};
            })
            setStudentLesson(newList);
        }
    }, [lessonProgress, lessons]);


    function IsModules(moduleId: string) {
        if (modules && modules.length > 0) {
            return modules.some((item) => item.id === moduleId);
        }
        return false;
    }

    console.log(allModules);
    return (
        <div className="w-full lg:py-4">
            {allModules && allModules.length > 0 && allModules.map((module, index) => (
                <div key={index} className="border-b border-gray-200">
                    {/* Header */}
                    <button
                        onClick={() => toggle(module.id)}
                        disabled={!IsModules(module.id)}
                        className={`w-full text-left p-4 items-center justify-between flex gap-1 transition
                        ${openIndex === module.id ? "shadow-[0px_2px_5px_0px_#787F8C29] bg-white" : ''}
                        `}
                    >
                        <div>
                            <p className="text-gray-400 font-semibold text-md leading-normal m-0 ">
                                Modul {index + 1}:
                            </p>
                            <h5 className={`${IsModules(module.id) ? '' : 'text-gray-400'} text-lg font-semibold leading-normal m-0 break-all w-full`}>
                                {module.name}
                            </h5>
                        </div>
                        {
                            !IsModules(module.id) && <FaLock className={'text-gray-400 font-semibold text-md'}/>
                        }
                    </button>

                    {/* Body */}
                    <div
                        className={`
              overflow-hidden transition-all duration-100
              ${openIndex === module.id ? "max-h-[100dvh] opacity-100" : "max-h-0 opacity-0"}
            `}>
                        {
                            isPending ? <div className={'flex justify-center p-3'}><Spinner/></div> :
                                <div className="p-4 pe-0 flex flex-col gap-5">
                                    {studentLesson.length > 0 ? studentLesson.map((item: Lesson, idx: number) => (
                                            <>
                                                {
                                                    (item?.completed || item?.progress) ?
                                                        <Link
                                                            to={isMobile ? `/courses/${params.id}/${openIndex}/${item.id}` : `${openIndex}/${item.id}`}
                                                            onClick={() => {
                                                                if (item?.orderIndex > openLessonId) {
                                                                    mutate({
                                                                        studentCourseId: params.id,
                                                                        lessonId: item.id
                                                                    })
                                                                }
                                                                if (isMobile) {
                                                                    if (setModal) {
                                                                        setModal(false);
                                                                    }
                                                                }
                                                                setOpenLessonId(item?.orderIndex);
                                                            }}
                                                            key={idx}
                                                        >
                                                            <div
                                                                key={idx}
                                                                className={`flex items-center gap-4 p-2  ${getItemClasses(item, "bg-transparent text-gray-900 hover:bg-primary-100 cursor-pointer", "text-primary-500 bg-primary-100 border-l-2 border-primary-500")}`}
                                                            >
                                                                <TickCircle width={24} height={24}
                                                                            className={`bg-transparent ${getItemClasses(item, "text-primary-500", "ms-[-2px]")}`}
                                                                />

                                                                <div className="flex flex-col justify-between w-full gap-1">
                                                                    <p className="text-md font-medium m-0 p-0 leading-none break-all w-full">
                                                                        {item.name}
                                                                    </p>
                                                                    <p className="text-md font-medium m-0 p-0 leading-none">
                                                                        {item.estimatedDuration} min
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </Link> :
                                                        <div
                                                            key={idx}
                                                        >
                                                            <div
                                                                key={idx}
                                                                className={`flex items-center gap-4 p-2 text-gray-400`}
                                                            >
                                                                <TickCircle width={24} height={24}
                                                                            className={`bg-transparent bg-gray-50 border-gray-200`}
                                                                />

                                                                <div className="flex flex-col justify-between w-full gap-1">
                                                                    <p className="text-md font-medium m-0 p-0 leading-none break-all w-full">
                                                                        {item.name}
                                                                    </p>
                                                                    <p className="text-md font-medium m-0 p-0 leading-none">
                                                                        {item.estimatedDuration} min
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                }

                                            </>


                                        ))
                                        : <p className="text-md text-black font-medium text-center w-full">
                                            Hozircha dars yo'q !
                                        </p>
                                    }
                                </div>
                        }
                    </div>

                </div>
            ))}
        </div>
    );
}

export default CourseModuleAccordionCard;