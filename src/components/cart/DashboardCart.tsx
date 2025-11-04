import React from "react";


type DashboardCartProps = {
    icon: React.ReactNode,
    title: string,
    body: string,
    total: string,
}

export default function DashboardCart({item}: { item: DashboardCartProps }) {
    return (
        <>
            <div className="col-xl-3 col-lg-4 col-md-6 col-6 col-sm-6">
                <div className="dashboard-card border border-primary">
                    <div className="d-flex align-items-center justify-content-between">
                        <div className={'icon'}>
                            {item.icon}
                        </div>
                        <p className={'m-0 text-secondary'}>{item.title}</p>
                    </div>
                    <div className={'mt-4'}>
                        <h3>{item.total}</h3>
                        <span className={'text-secondary'}>{item.body}</span>
                    </div>
                </div>
            </div>
        </>
    )
}
