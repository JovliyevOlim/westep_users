import {TickCircle} from "../../assets/icon";
import {useEffect, useState} from "react";
import {Lesson, Module} from "../../types/types.ts";
import {useGetLessons} from "../../api/lesson/useLesson.ts";
import Spinner from "../../ui/Spinner.tsx";
import {Link, useNavigate, useParams} from "react-router-dom";
import {useMobile} from "../../hooks/useMobile.ts";


function CourseModuleAccordionCard({modules, setModal}: { modules: Module[], setModal?: (modal: boolean) => void }) {

    const [openIndex, setOpenIndex] = useState<string | null>(null);
    const navigate = useNavigate();
    const params = useParams();
    const isMobile = useMobile()
    const {data, isPending} = useGetLessons(openIndex)
    const toggle = (index: string) => {
        setOpenIndex(prev => (prev === index ? null : index));
    };


    useEffect(() => {
        if (modules) {
            const isActiveModule = modules.find((item: Module) => item.active);
            setOpenIndex(isActiveModule?.id || null);
        }
    }, [modules]);


    function getItemClasses(item: Lesson, classDone: string, classActive: string, classOther: string) {
        if (item?.done) {
            return classDone;
        }

        if (item?.active) {
            return classActive;
        }

        return classOther;
    }


    useEffect(() => {
        if (data) {
            const isActiveModule = data.find((item: Module) => item.active);
            navigate(`${openIndex}/${isActiveModule.id}`);
        }
    }, [data]);

    return (
        <div className="w-full lg:py-4">
            {modules.map((module, index) => (
                <div key={index} className="border-b border-gray-200">

                    {/* Header */}
                    <button
                        onClick={() => toggle(module.id)}
                        className={`w-full text-left p-4 flex flex-col gap-1 transition
                        ${openIndex === module.id ? "shadow-[0px_2px_5px_0px_#787F8C29] bg-white" : ''}
                        `}
                    >
                        <p className="text-gray-400 font-semibold text-md leading-normal m-0 ">
                            Modul {index + 1}:
                        </p>
                        <h5 className="text-lg font-semibold leading-normal m-0 break-all w-full">
                            {module.name}
                        </h5>
                    </button>

                    {/* Body */}
                    <div
                        className={`
              overflow-hidden transition-all duration-100
              ${openIndex === module.id ? "max-h-[100dvh] opacity-100" : "max-h-0 opacity-0"}
            `}
                    >
                        {
                            isPending ? <div className={'flex justify-center p-3'}><Spinner/></div> :
                                <div className="p-4 pe-0 flex flex-col gap-5">
                                    {data.map((item: Lesson, idx: number) => (
                                        <Link
                                            to={isMobile ? `/courses/${params.id}/${openIndex}/${item.id}` : `${openIndex}/${item.id}`}
                                            onClick={() => setModal && setModal(false)}
                                            key={idx}
                                        >
                                            <div
                                                key={idx}
                                                className={`
                    flex items-center gap-4 p-2 
                    ${getItemClasses(item, "bg-transparent text-gray-900 hover:bg-primary-100 cursor-pointer", "text-primary-500 bg-primary-100 border-l-2 border-primary-500", "text-gray-400")}    `}
                                            >
                                                <TickCircle width={24} height={24}
                                                            className={`bg-transparent ${getItemClasses(item, "text-primary-500", "ms-[-2px]", "bg-gray-50 border-gray-200")}`}
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
                                        </Link>

                                    ))}
                                </div>
                        }
                    </div>

                </div>
            ))}
        </div>
    );
}

export default CourseModuleAccordionCard;