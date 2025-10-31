import UserDropDown from "./UserDropDown.tsx";


export default function HeaderOne() {
    return (
        <>
            <header id="navigation">
                <div className="container-fluid">
                    <div className="row align-items-center justify-content-between">
                        <div className={'col-6'}></div>
                        <div className="col-5 justify-content-end d-flex">
                            <div className="d-flex gap-3">
                                <UserDropDown/>
                            </div>
                        </div>
                    </div>
                </div>
            </header>
        </>
    )
}
