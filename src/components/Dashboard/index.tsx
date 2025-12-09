import DashboardCart from "../cart/DashboardCart.tsx";
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
    return (
        <>
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