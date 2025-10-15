import {Navigate} from 'react-router-dom';
import {lazy} from "react";

const Login = lazy(() => import("../components/auth/login"));
const Register = lazy(() => import("../components/auth/register"));
const Error = lazy(() => import("../components/error"));
const Dashboard = lazy(() => import("../components/dashboard"));
const Users = lazy(() => import("../components/users"));
const Statistic = lazy(() => import("../components/statistic"));
const Lessons = lazy(() => import("../components/lessons"));
const Password = lazy(() => import("../components/auth/password"));
const ForgotPassword = lazy(() => import("../components/auth/forgot-password"));
const VerifyCode = lazy(() => import("../components/auth/sms-code"));
const NewPassword = lazy(() => import("../components/auth/new-password"));
const UserForm = lazy(() => import("../components/auth/user"));

const authProtectedRoutes = [
    {path: "/dashboard", element: <Dashboard/>, title: "Dashboard"},
    {path: "/users", element: <Users/>, title: "Users"},
    {path: "/lessons", element: <Lessons/>, title: "Lessons"},
    {path: "/statistic", element: <Statistic/>, title: "Statistics"},

    // {path: "/home-1", element: <HomeOne/>},
    // {path: "/home-2", element: <HomeTwo/>, title: "Home 2"},
    // {path: "/about", element: <About/>, title: "About"},
    // {path: "/courses", element: <Courses/>, title: "Courses"},
    // {path: "/courses-2", element: <CoursesTwo/>, title: "Courses 2"},
    // {path: "/course-details", element: <CourseDetails/>, title: "Course Details"},
    // {path: "/grid-blog", element: <GridBlog/>, title: "Grid Blog"},
    // {path: "/standard-blog", element: <StandardBlog/>, title: "Standard Blog"},
    // {path: "/blog-details", element: <BlogDetails/>, title: "Blog Details"},
    // {path: "/cart", element: <Cart/>, title: "Cart"},
    // {path: "/checkout", element: <Checkout/>, title: "Checkout"},
    // {path: "/instructors", element: <Instructors/>, title: "Instructors"},
    // {path: "/contact", element: <Contact/>, title: "Contact"},
    {path: "*", element: <Error/>},
    {
        path: '/',
        exact: true,
        component: <Navigate to="/dashboard"/>,
    },
    {path: '*', component: <Navigate to="/dashboard"/>},
];

const publicRoutes = [
    {path: "/login", element: <Login/>},
    {path: "/register", element: <Register/>},
    {path: "/user-info", element: <UserForm/>},
    {path: "/password", element: <Password/>},
    {path: "/forgot-password", element: <ForgotPassword/>},
    {path: "/verify-code", element: <VerifyCode/>},
    {path: "/new-password", element: <NewPassword/>},
];

export {authProtectedRoutes, publicRoutes};
