import React, {Suspense} from 'react';
import {Routes, Route} from 'react-router-dom';

//routes
import {authProtectedRoutes, publicRoutes} from './allRoutes';
import AuthProtected from "./AuthProtected.tsx";
import DefaultLayout from "../layouts/DefaultLayout";
import Preloader from "../components/common/Preloader.tsx";
// import DefaultLayout from '../layout/DefaultLayout.tsx';
// import ProtectedRoute from './ProtectedRoute.tsx';

const Index = () => {
    return (
        <React.Fragment>
            <Suspense fallback={<Preloader/>}>
                <Routes>
                    {publicRoutes.map((route, idx) => (
                        <Route path={route.path} element={route.element} key={idx}/>
                    ))}
                    {authProtectedRoutes.map((route, idx) => (
                        <Route
                            path={route.path}
                            element={
                                <AuthProtected>
                                    {/*<ProtectedRoute allowedRoles={route?.permission}>*/}
                                    <DefaultLayout>{route.element}</DefaultLayout>
                                    {/*</ProtectedRoute>*/}
                                </AuthProtected>
                            }
                            key={idx}
                        />
                    ))}
                </Routes>
            </Suspense>
        </React.Fragment>
    );
};

export default Index;
