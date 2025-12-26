import {CheckLineIcon} from "../../assets/icon";
import {useUser} from "../../api/auth/useAuth.ts";
import {useGetStudentCourseById} from "../../api/courses/useCourse.ts";
import {StudentCourse} from "../../types/types.ts";


const weeks = [
    {
        text: 'Du',
        active: false
    },
    {
        text: 'Se',
        active: false
    },
    {
        text: 'Cho',
        active: true
    },
    {
        text: 'Pa',
        active: true
    }, {
        text: 'Ju',
        active: false
    }, {
        text: 'Sh',
        active: false
    }, {
        text: 'Ya',
        active: false
    },
]

function MainPageBar() {


    const {data: user} = useUser()
    const {data} = useGetStudentCourseById(user.id)


    return (
        <>
            <h1 className={'text-3xl font-medium'}>Salom {user?.firstname}!</h1>
            <p className={'text-sm text-gray-300'}>Keling biz bilan birga yangi bilimlarga yo’l oling</p>
            <div className={'mt-8 w-full'}>
                {
                    data && data.map((item: StudentCourse, index: number) =>
                        <div className={'mb-4'} key={index}>
                            <p className={'text-sm mb-2'}>{item.courseName}</p>
                            <div
                                className="w-full relative bg-transparent border border-gray-100 rounded-full h-[10px]">
                                <div
                                    className={`bg-primary-500 h-[10px]  ${item.percent === 100 ? 'rounded-full' : "rounded-l-lg "}`}
                                    style={{
                                        width: `${5 * index}%`
                                    }}
                                >
                                </div>
                                <p className={`text-center absolute top-0 left-1/2 text-[9px] leading-[10px] m-0 p-0 ${item.percent > 50 ? "text-white" : "text-primary-500"}  `}>{item.percent}%</p>
                            </div>
                        </div>)
                }

            </div>
            <hr/>
            <div className={'mt-8'}>
                <p className={'text-xs text-gray-400'}>Haftalik faoliyatingiz</p>
                <div className={'flex items-center justify-between'}>
                    <p className={'text-xs text-gray-800 w-3/4'}>Hafta davomida shug’ullangan kunlaringiz</p>
                </div>
                <div className={'flex w-[90%] items-center justify-between mt-4'}>
                    {
                        weeks.map((item, index) =>
                            <div key={index}
                                 className={`w-[36px] h-[36px] flex justify-center items-center 
                                border border-blue-300 rounded-md ${item.active ? "bg-blue-light-50" : 'bg-transparent'}`}>
                                {
                                    item.active ?
                                        <CheckLineIcon className={'text-primary-500'} height={14} width={14}/>
                                        : <p className={'text-sm text-blue-300'}>{item.text}</p>
                                }
                            </div>)
                    }
                </div>
                <p className={'text-xs text-gray-800 w-3/4 mt-3'}> 13 ta bajarilgan ish · 73 daqiqa o'rganildi</p>
            </div>
        </>
    );
}

export default MainPageBar;