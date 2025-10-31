import React, {ReactNode, useState} from 'react';
import Header from "../headers/HeaderOne.tsx";
import Sidebar from "./sidebar";

const DefaultLayout: React.FC<{ children: ReactNode }> = ({children}) => {
    const [showSidebar, setShowSidebar] = useState(true);
    return (
        <div className='debug-container vh-100 overflow-y-scroll d-flex'>
            <Sidebar sidebarOpen={showSidebar} setSidebarOpen={setShowSidebar}/>
            <div
                style={{width: showSidebar ? 'calc(100% - 150px)' : '100%'}}
            >
                <Header/>
                <main className={'px-5 py-3'}>
                    {children}
                </main>
                {/*<FooterOne/>*/}
            </div>

        </div>
    );
};

export default DefaultLayout;
