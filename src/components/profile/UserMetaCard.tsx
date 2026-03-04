import {User} from "../../types/types.ts";
import person from "../../assets/icon/person.svg";
import {formatUzPhone} from "../../utils/utils.ts";

interface Props {
    user: User;
}

export default function UserMetaCard({user}: Props) {
    return (
        <div className="p-6 border border-gray-200 rounded-2xl bg-white">
            <div className="flex items-center gap-5">
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 flex justify-center items-center overflow-hidden rounded-full bg-gray-100">
                        <img src={person} className="w-full h-full object-cover" alt="user"/>
                    </div>
                    <div>
                        <h4 className="text-xl font-semibold text-gray-900">
                            {user?.firstname} {user?.lastname}
                        </h4>
                        <p className="text-sm text-gray-600 mt-1">{formatUzPhone(user?.phoneNumber)}</p>
                        <p className="text-sm text-gray-500 mt-1">{user?.roleName || "STUDENT"}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
