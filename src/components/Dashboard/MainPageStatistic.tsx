import StatisticCard from "./StatisticCard.tsx";
import {Book, MagicStart} from "../../assets/icon";
import CourseProcess from "./CourseProcess.tsx";
import {useUser} from "../../api/auth/useAuth.ts";
import {useGetStudentCourseById} from "../../api/courses/useCourse.ts";
import StatisticCardMobile from "./StaticticCardMobile.tsx";


function MainPageStatistic() {

    const {data: user} = useUser()
    const {data} = useGetStudentCourseById(user.id)

    const items = [
        {
            icon: <Book className="text-primary-500 size-4 lg:size-6"/>,
            title: 'Jami',
            result: data?.length || 0,
            body: 'Davom etayotgan kurslar'
        },
        {
            icon: <MagicStart className="text-primary-500 size-4 lg:size-6"/>,
            title: 'Hozirgi',
            result: '80%',
            body: 'Umumiy ball'
        }
    ]

    return (
        <div className="grid xl:grid-cols-2 md:grid-cols-1  gap-4 items-stretch">
            <div className={'lg:hidden'}>
                <h1 className={'text-3xl font-medium'}>Salom {user?.firstname}!</h1>
                <p className={'text-sm text-gray-300'}>Keling biz bilan birga yangi bilimlarga yo’l oling</p>
            </div>

            <div className="hidden lg:grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-2 md:gap-6">
                {
                    items.map((item, index) =>
                        <StatisticCard item={item} key={index}/>)
                }
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:hidden">
                {
                    items.map((item, index) =>
                        <StatisticCardMobile item={item} key={index}/>)
                }
            </div>
            <CourseProcess/>
        </div>

    );
}

export default MainPageStatistic;