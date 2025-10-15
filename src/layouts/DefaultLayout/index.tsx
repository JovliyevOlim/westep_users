import React, {ReactNode} from 'react';
import FooterOne from "../footers/FooterOne.tsx";
import Header from "../headers/HeaderTwo.tsx";

const DefaultLayout: React.FC<{ children: ReactNode }> = ({children}) => {
    return (
        <>
            <Header/>
            {children}
            <FooterOne/>
        </>
    );
};

export default DefaultLayout;
