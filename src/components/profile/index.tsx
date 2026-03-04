import ProfileHeader from "./ProfileHeader.tsx";
import {useUser} from "../../api/auth/useAuth.ts";
import ProfileBottom from "./ProfileBottom.tsx";
import {useState} from "react";
import UpdateProfileUser from "./UpdateProfileUser.tsx";
import NewProfile from "./NewProfile.tsx";

function Index() {

    const {data: user} = useUser()

    const [edit, setEdit] = useState<boolean>(false)

    return (
        <div className="w-full max-w-[1100px] mx-auto px-2 lg:px-6">
            <div className="lg:hidden">
                <ProfileHeader user={user} edit={edit} setEdit={setEdit}/>
                {edit ? <UpdateProfileUser user={user} setEdit={setEdit}/> : <ProfileBottom user={user}/>}
            </div>

            <div className="hidden lg:block">
                {edit ? <UpdateProfileUser user={user} setEdit={setEdit}/> : <NewProfile user={user} setEdit={setEdit}/>}
            </div>
        </div>
    );
}

export default Index;
