import {User} from "../../types/types.ts";
import {formatUzPhone} from "../../utils/utils.ts";

function ProfileBottom({user}: { user: User }) {
    return (
        <div className={'mt-5 flex flex-col gap-5'}>
            <div>
                <p className={'text-sm text-gray-400 font-semibold'}>Ism Sharifi:</p>
                <h1 className={'text-md text-gray-900 font-semibold'}>{user?.firstname} {user?.lastname}</h1>
                <hr className={'border-gray-100 mt-3'} />
            </div>
            <div>
                <p className={'text-sm text-gray-400 font-semibold'}>Tug'ilgan kun:</p>
                <h1 className={'text-md text-gray-900 font-semibold'}>{user?.birthDate}</h1>
                <hr className={'border-gray-100 mt-3'} />
            </div>
            <div>
                <p className={'text-sm text-gray-400 font-semibold'}>Telefon raqami:</p>
                <h1 className={'text-md text-gray-900 font-semibold'}>{formatUzPhone(user?.phoneNumber)}</h1>
                <hr className={'border-gray-100 mt-3'} />
            </div>
            <div>
                <p className={'text-sm text-gray-400 font-semibold'}>Jinsi:</p>
                <h1 className={'text-md text-gray-900 font-semibold'}>{user?.gender === "MALE"?'Erkak':"Ayol"}</h1>
                <hr className={'border-gray-100 mt-3'} />
            </div>
        </div>
    );
}

export default ProfileBottom;