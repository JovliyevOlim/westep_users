import {Navigate} from 'react-router-dom';
import {lazy} from "react";

const HomeOne = lazy(() => import("../components/homes/home"));
const HomeTwo = lazy(() => import("../components/homes/home-2"));
const About = lazy(() => import("../components/about"));
const Courses = lazy(() => import("../components/courses"));
const CoursesTwo = lazy(() => import("../components/courses-2"));
const CourseDetails = lazy(() => import("../components/course-details"));
const GridBlog = lazy(() => import("../components/grid-blog"));
const StandardBlog = lazy(() => import("../components/standard-blog"));
const BlogDetails = lazy(() => import("../components/blog-details"));
const Cart = lazy(() => import("../components/cart"));
const Checkout = lazy(() => import("../components/checkout"));
const Instructors = lazy(() => import("../components/instructors"));
const Contact = lazy(() => import("../components/contact"));
const Login = lazy(() => import("../components/auth/login"));
const Error = lazy(() => import("../components/error"));
const Users = lazy(() => import("../components/users"));
const Statistic = lazy(() => import("../components/statistic"));
const Lessons = lazy(() => import("../components/lessons"));
const Password = lazy(() => import("../components/auth/password"));
const ForgotPassword = lazy(() => import("../components/auth/forgot-password"));
const VerifyCode = lazy(() => import("../components/auth/sms-code"));
const NewPassword = lazy(() => import("../components/auth/new-password"));
const CreatePassword = lazy(() => import("../components/auth/createPassword"));
const Register = lazy(() => import("../components/auth/register"));

const authProtectedRoutes = [
    {path: "/", element: <HomeOne/>, title: "Home"},
    {path: "/users", element: <Users/>, title: "Users"},
    {path: "/lessons", element: <Lessons/>, title: "Lessons"},
    {path: "/statistic", element: <Statistic/>, title: "Statistics"},

    {path: "/home-1", element: <HomeOne/>},
    {path: "/home-2", element: <HomeTwo/>, title: "Home 2"},
    {path: "/about", element: <About/>, title: "About"},
    {path: "/courses", element: <Courses/>, title: "Courses"},
    {path: "/courses-2", element: <CoursesTwo/>, title: "Courses 2"},
    {path: "/course-details", element: <CourseDetails/>, title: "Course Details"},
    {path: "/grid-blog", element: <GridBlog/>, title: "Grid Blog"},
    {path: "/standard-blog", element: <StandardBlog/>, title: "Standard Blog"},
    {path: "/blog-details", element: <BlogDetails/>, title: "Blog Details"},
    {path: "/cart", element: <Cart/>, title: "Cart"},
    {path: "/checkout", element: <Checkout/>, title: "Checkout"},
    {path: "/instructors", element: <Instructors/>, title: "Instructors"},
    {path: "/contact", element: <Contact/>, title: "Contact"},
    {path: "*", element: <Error/>},
    {
        path: '/',
        exact: true,
        component: <Navigate to="/"/>,
    },
    {path: '*', component: <Navigate to="/"/>},
];

const publicRoutes = [
    {path: "/login", element: <Login/>},
    {path: "/register", element: <Register/>},
    {path: "/password", element: <Password/>},
    {path: "/forgot-password", element: <ForgotPassword/>},
    {path: "/verify-code", element: <VerifyCode/>},
    {path: "/new-password", element: <NewPassword/>},
    {path: "/create-password", element: <CreatePassword/>},
];

export {authProtectedRoutes, publicRoutes};
