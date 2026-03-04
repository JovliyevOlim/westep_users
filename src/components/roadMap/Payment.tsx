import {Module} from "../../types/types.ts";
import {useSetStudentCourseByIdForPayment} from "../../api/courses/useCourse.ts";
import {useParams} from "react-router-dom";
import {useUser} from "../../api/auth/useAuth.ts";

interface Payment {
    selected: Module[] | null;
}

function Payment({selected}: Payment) {

    const params = useParams();
    const {data: user} = useUser()


    const {mutate} = useSetStudentCourseByIdForPayment()

    function totalSum() {
        const totalPrice = selected
            ? selected.reduce((total: number, current: Module) => total + current.price, 0)
            : 0;
        return totalPrice;
    }

    function handleCourse() {
        const idList: string[] = [];
        if (selected) {
            selected.forEach((module: Module) => idList.push(module.id))
        }
        mutate({
            studentId: user.id,
            courseId: params.id || null,
            moduleList: idList
        })
    }

    return (
        <div className={'flex-1 p-4 flex flex-col justify-between border border-gray-300 rounded-3xl'}>
            <h1 className="text-lg md:text-xl font-semibold leading-tight p-3">
                To'lov turlari
            </h1>

            <div>
                <div className={'flex items-center justify-between gap-3 min-h-[54px] p-2 px-4 md:px-6 border border-1 border-success-200 rounded-full'}>
                    <div className={'flex items-center gap-3 md:gap-5'}>
                        <input type="radio" checked={true} className={'scale-[2]'}/>
                        <p className={"text-base md:text-lg m-0 p-0"}>Payme</p>
                    </div>
                    <div className={'flex w-16 md:w-[68px] shrink-0'}>
                        <img className={'w-full object-contain'}
                             src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSm5LWw67JzpYKSdrB-RWnUu9VGeTOTTn9ZAA&s"
                             alt="payme"/>
                    </div>

                </div>

            </div>
            <div className={'flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 my-8 md:my-10'}>
                <h1 className={'text-xl md:text-2xl'}>Umumiy narx:</h1>
                <h1 className={'text-xl md:text-2xl font-bold break-words'}>{totalSum().toLocaleString().replace(",", ".")} so'm</h1>
            </div>
            <button onClick={handleCourse} className={'w-full rounded-full p-3 md:p-4 bg-primary-600 text-white font-bold'}>
               Buyurtmani rasmiylashtirish
            </button>
        </div>
    );
}

export default Payment;
