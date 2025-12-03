import React, {ReactNode} from 'react';

const AuthLayout: React.FC<{ children: ReactNode }> = ({children}) => {
    return (
        <div className='auth-back'>
            <div className='auth-glass'>
                <div className="container d-flex align-items-center justify-content-center p-0">
                    <div className={'col-12 co-md-8 col-lg-8 col-xl-6'}>
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthLayout;
