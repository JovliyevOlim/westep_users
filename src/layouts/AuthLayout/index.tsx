import React, {ReactNode} from 'react';
import logo from '../../assets/logo.svg';

const AuthLayout: React.FC<{ children: ReactNode }> = ({children}) => {
    return (
        <div className='auth-back'>
            <div className='auth-glass'>
                <div className={'col-12 co-md-8 col-lg-8 col-xl-6'}>
                    <div className='d-flex justify-content-center'>
                        <img src={logo} width={220} alt="logo"/>
                    </div>
                    {children}
                </div>
            </div>
            {/*<div className="reflection"></div>*/}
        </div>
    );
};

export default AuthLayout;
