import UserMetaCard from "./UserMetaCard.tsx";
import UserInfoCard from "./UserInfoCard.tsx";
import {User} from "../../types/types.ts";

interface Props {
    user: User;
    setEdit: (edit: boolean) => void;
}

function NewProfile({user, setEdit}: Props) {
    return (
        <div className="hidden lg:flex lg:flex-col gap-6 mt-6">
            <UserMetaCard user={user}/>
            <UserInfoCard user={user} setEdit={setEdit}/>
        </div>
    );
}

export default NewProfile;
