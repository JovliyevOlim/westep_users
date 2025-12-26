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
            moduleList:idList
        })
    }

    return (
        <div className={'flex-1 p-10  flex flex-col justify-between'}>
            <div>
                <h1 className="text-2xl font-extrabold uppercase leading-tight">
                    To'lov qilish
                </h1>

            </div>

            <div className={'mt-4 p-5 w-[200px] border border-1 border-success-200'}>
                <p className={"text-lg my-2"}>Payme orqali to'lash</p>
                <img width={100}
                     src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSm5LWw67JzpYKSdrB-RWnUu9VGeTOTTn9ZAA&s"
                     alt="payme"/>
            </div>
            <div>
                <h1 className={'text-end text-2xl font-bold'}>Kurs narxi</h1>
                <div className={'flex justify-end gap-20 mt-4'}>
                    <h1 className={'text-xl'}>{selected && selected.length} ta modul</h1>
                    <h1 className={'text-xl font-bold'}>{totalSum().toLocaleString().replace(",", ".")} so'm</h1>
                </div>
                <h1 className={'text-end text-4xl mt-3 font-bold'}>{totalSum().toLocaleString().replace(",", ".")} so'm</h1>
            </div>
            <button onClick={handleCourse} className={'w-full rounded-full p-4 bg-primary-600 text-white font-bold'}>
                Xarid qilish
            </button>
        </div>
    );
}

export default Payment;