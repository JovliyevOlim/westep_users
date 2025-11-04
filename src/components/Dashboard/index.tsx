import DashboardCart from "../cart/DashboardCart.tsx";
import {useUser} from "../../api/auth/useAuth.ts";
import {Book, MagicStart} from "../../assets/icon";


const dashboardInfo = [
    {
        icon: <Book/>,
        title: 'Jami',
        total: '3',
        body: 'Davom etayotgan kurslar'
    },
    {
        icon: <MagicStart/>,
        title: 'Hozirgi',
        total: '80%',
        body: 'Umumiy ball'
    }
]


function Index() {
    const {data: user} = useUser()
    return (
        <>
            <div>
                <h1>Salom {user?.firstname}</h1>
                <p>Keling biz bilan birga yangi bilimlarga yo’l oling</p>
            </div>
            <section>
                <div className="row p-0 g-2 g-md-4 align-items-stretch">
                    {
                        dashboardInfo.map((item) =>
                            <DashboardCart item={item}/>
                        )
                    }
                </div>
            </section>
        </>
    );
}

export default Index;