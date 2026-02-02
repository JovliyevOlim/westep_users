import CourseModuleAccordionCard from "../CourseModuleAccordionCard.tsx";
import {useParams} from "react-router-dom";
import {useGetStudentCourseModulesById} from "../../../api/module/useModule.ts";

function LessonMobileBarModal({show, handleClose}: { show: boolean, handleClose: (modal: boolean) => void }) {

    const params = useParams();
    const {data} = useGetStudentCourseModulesById(params.id);

    return (
        <>
            {show && (
                <div className="fixed top-0 inset-0 px-4 h-dvh z-50 flex items-center justify-center bg-black/40">
                    <div
                        className="bg-white w-full max-w-lg h-full shadow-lg flex flex-col justify-between overflow-hidden">

                        {/* Body */}
                        <div className="p-0">
                            <div className="h-[80%]">
                                <CourseModuleAccordionCard modules={data} setModal={handleClose}/>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="flex justify-end gap-2 p-4 border-t">
                            <button
                                type="button"
                                onClick={() => handleClose(false)}
                                className="bg-primary-600 w-full text-white px-6 py-2 rounded-[16px] hover:bg-blue-700 transition"
                            >
                                Orqaga
                            </button>
                        </div>

                    </div>
                </div>
            )}
        </>
    );
}

export default LessonMobileBarModal;