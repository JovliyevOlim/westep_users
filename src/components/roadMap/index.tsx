import {useParams} from "react-router-dom";
import {useGetModuleById} from "../../api/module/useModule.ts";
import Modules from "./Modules.tsx";
import Payment from "./Payment.tsx";
import {useState} from "react";
import {Module} from "../../types/types.ts";

function Index() {

    const params = useParams();

    const {data} = useGetModuleById(params.id)

    const [selected, setSelected] = useState<Module[] | null>(null)
    console.log(selected)

    return (
        <div className='lg:flex gap-10 p-10'>
            {
                data && data.length > 0 && <Modules modules={data} selected={selected} setSelected={setSelected}/>
            }
            <Payment selected={selected}/>
        </div>
    );
}

export default Index;