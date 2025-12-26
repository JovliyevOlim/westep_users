import {Home, Search, Shop, Message, Profile, HomeBg, ShopBg, SearchBg, MessageBg, ProfileBg} from "../../assets/icon";
import {Link, useLocation} from "react-router-dom";


const icons = [
    {
        path: "/",
        defaultIcon: <Home width={24} height={24}/>,
        activeIcon: <HomeBg width={24} height={24} className='text-primary-500'/>
    },
    {
        path: "/search",
        defaultIcon: <Search width={24} height={24}/>,
        activeIcon: <SearchBg width={24} height={24} className='text-primary-500'/>
    },
    {
        path: "/shopping",
        defaultIcon: <Shop width={24} height={24}/>,
        activeIcon: <ShopBg width={24} height={24} className='text-primary-500'/>
    },
    {
        path: "/message",
        defaultIcon: <Message width={24} height={24}/>,
        activeIcon: <MessageBg width={24} height={24} className='text-primary-500'/>
    },
    {
        path: "/profile",
        defaultIcon: <Profile width={24} height={24}/>,
        activeIcon: <ProfileBg width={24} height={24} className='text-primary-500'/>
    }
]


function MobileNavigation() {

    const location = useLocation()

    return (
        <div className={'fixed bottom-4 left-1/2 -translate-x-1/2 w-[90%] lg:hidden'}>
            <div className={`
        mt-2 rounded-full
        backdrop-blur-sm bg-white/50
        flex items-center justify-between
        cursor-pointer p-4.5  px-5      border border-white/40
        shadow-[0_0_2px_rgba(255,255,255,0.8),_0_0_2px_rgba(255,255,255,0.4)]      
         `}
            >
                {
                    icons.map((icon) => {
                            if (location.pathname === icon.path) {
                                return icon.activeIcon
                            } else {
                                return <Link key={icon.path} to={`${icon.path}`}>{icon.defaultIcon}</Link>
                            }
                        }
                    )
                }
            </div>
        </div>
    );
}

export default MobileNavigation;