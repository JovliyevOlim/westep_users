import ScrollToTop from "../components/common/ScrollToTop.tsx";
import ScrollTop from "../components/common/ScrollTop.tsx";
import Dashboard from "../components/Dashboard";
import Courses from "../components/courses";


export default function MainPage() {

    return (
        <>
            <Dashboard/>
            <Courses/>
            <ScrollToTop/>
            <ScrollTop/>
        </>

    )
}
