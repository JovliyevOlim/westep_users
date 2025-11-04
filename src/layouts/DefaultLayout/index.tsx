import React, {ReactNode} from 'react';
import Header from "../headers/HeaderOne.tsx";
import {SidebarProvider} from "../SidebarContext.tsx";

const DefaultLayout: React.FC<{ children: ReactNode }> = ({children}) => {
    return (
        <SidebarProvider>
            <div className='debug-container vh-100 overflow-y-scroll d-flex'>
                {/*<Sidebar/>*/}
                <div className={'showSidebar'}>
                    <Header/>
                    <main className={''}>
                        {children}
                    </main>
                    {/*<FooterOne/>*/}
                </div>

            </div>
        </SidebarProvider>
    );
};

export default DefaultLayout;
