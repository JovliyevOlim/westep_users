import ProfileHeader from "./ProfileHeader.tsx";
import {useUser} from "../../api/auth/useAuth.ts";
import ProfileBottom from "./ProfileBottom.tsx";
import {useState} from "react";
import UpdateProfileUser from "./UpdateProfileUser.tsx";

function Index() {

    const {data: user} = useUser()

    const [edit, setEdit] = useState<boolean>(false)

    console.log(user)

    return (
        <div>
            <ProfileHeader user={user} edit={edit} setEdit={setEdit}/>
            {
                edit ? <UpdateProfileUser user={user} setEdit={setEdit}/>
                    : <ProfileBottom user={user}/>
            }
        </div>
    );
}

export default Index;