import React, {ReactNode} from 'react';
import Header from "../headers/HeaderOne.tsx";
import {SidebarProvider} from "../SidebarContext.tsx";
import MobileNavigation from "./MobileNavigation.tsx";


const DefaultLayout: React.FC<{ children: ReactNode }> = ({children}) => {
    return (
        <SidebarProvider>
            <div>
                <div className={'showSidebar'}>
                    <Header/>
                    <main className={''}>
                        {children}
                    </main>
                    {
                        location.pathname === "/" && <MobileNavigation/>
                    }
                </div>

            </div>
        </SidebarProvider>
    );
};

export default DefaultLayout;
