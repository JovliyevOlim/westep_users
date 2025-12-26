import React, {ReactNode} from 'react';
import Header from "../headers/HeaderOne.tsx";
import MobileNavigation from "./MobileNavigation.tsx";
import {useLocation} from "react-router-dom";


const DefaultLayout: React.FC<{ children: ReactNode }> = ({children}) => {

    const location = useLocation();

    function checking() {
        switch (location.pathname) {
            case "/":
                return true;
            case "/profile":
                return true;
            default:
                return false;
        }
    }

    return (
        <div className='min-h-dvh p-3 lg:p-0'>
            <div>
                <Header/>
                <div className='max-w-[1600px] mx-auto'>
                    {children}
                </div>
                {
                    checking() && <MobileNavigation/>
                }
            </div>

        </div>
    );
};

export default DefaultLayout;
