import {EditIcon, ArrowLeftIcon} from "../../assets/icon";
import {formatUzPhone} from "../../utils/utils.ts";
import {User} from "../../types/types.ts";

interface Props {
    user: User;
    edit: boolean;
    setEdit: (edit: boolean) => void;
}

function ProfileHeader({user,setEdit,edit}: Props) {


    return (
        <div
            className={'flex items-top justify-between p-4 pb-8 shadow-[inset_2px_2px_78px_10px_#DBECFFC7] rounded-[18px]'}>
            <div>
                <ArrowLeftIcon width={22} height={22}/>
            </div>
            <div className={'flex items-center flex-col'}>
                <div className="w-[71px] h-[71px] rounded-full overflow-hidden">
                    <img
                        style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            objectPosition: 'center'
                        }}
                        loading='lazy'
                        src='https://s3.amazonaws.com/cms.ipressroom.com/173/files/20233/6436fb312cfac278e61b35e3_Earth/Earth_mid.jpg'
                    />
                </div>
                <h1 className={'text-md leading-5 font-bold mt-1'}>{user?.firstname} {user?.lastname}</h1>
                <p className={'text-sm leading-5 font-semibold mt-1'}>{formatUzPhone(user?.phoneNumber)}</p>
            </div>
            <div className={'cursor-pointer'} onClick={() => setEdit(!edit)}>
                <EditIcon width={22} height={22}/>
            </div>
        </div>
    );
}

export default ProfileHeader;