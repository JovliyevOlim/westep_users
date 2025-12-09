function CourseProcess() {
    return (
        <div
            className="shadow-[0px 0px 4px 0px accent-blue-light-300;] rounded-[18px] border flex-1 lg:flex flex-col justify-center border-blue-200 bg-white p-4 lg:px-10 md:p-6">

            <div className="grid grid-cols-2 items-center lg:items-end justify-between">
                <div className={'flex items-start flex-col gap-1'}>
                    <h3 className={'text-lg md:text-2xl leading-none text-gray-800 font-semibold '}>Ingliz tilini 20
                        kunda IELTS</h3>
                    <p className=" text-gray-400 text-sm md:text-[16px] ">
                        Video (6 minut)
                    </p>
                </div>
                <div>
                    <button
                        className={'bg-primary-500 w-full h-11 flex justify-center gap-2 px-2 py-2 text-white text-md  rounded-full'}>
                        Davom etish
                    </button>
                </div>
            </div>
        </div>);
}

export default CourseProcess;