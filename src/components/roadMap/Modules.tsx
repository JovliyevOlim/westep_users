import React from "react"
import {Module} from "../../types/types.ts";
import {FaCircleCheck} from "react-icons/fa6";


interface Props {
    modules: Module[];
    selected: Module[] | null;
    setSelected: (modules: Module[]) => void;
}

function Modules({modules, setSelected, selected}: Props) {


    function handleChange(e: React.ChangeEvent<HTMLInputElement>, item: Module) {
        let newList: Module[] = selected ? [...selected] : []
        if (e.target.checked) {
            newList.push(item)
        } else {
            if (selected) {
                newList = selected.filter((module: Module) => module.id !== item.id)
            }
        }
        setSelected(newList)
    }

    function isSelectedModuleList(id: string) {
        return selected?.some((item) => item.id === id)
    }

    return (
        <div className={'flex-1 p-4 border border-gray-300 rounded-3xl'}>
            <h1 className="text-xl font-semibold  leading-tight p-3">
                Kursni xarid qilish
            </h1>


            {/* Course block */}
            <div className="space-y-8">
                <div>
                    {

                        modules.map((item: Module, i) => (
                            <div key={i}
                                 className={`flex items-center justify-between p-3 gap-8 ${isSelectedModuleList(item.id) && 'bg-success-100'}`}>

                                <div className={'flex items-center gap-8'}>
                                    <div>
                                        <label htmlFor={item.id}>
                                            {
                                                isSelectedModuleList(item.id) ?
                                                    <FaCircleCheck size={24} color="#1BB66E"/>
                                                    : <FaCircleCheck size={24} color="#ACB5C5"/>

                                            }
                                        </label>
                                        <input
                                            id={item.id}
                                            onChange={(e) => handleChange(e, item)}
                                            type="checkbox"
                                            className="mt-1 h-6 w-6 hidden accent-primary-500"
                                        />
                                    </div>
                                    <div>
                                        <p className="text-xl">{item.name}</p>
                                    </div>
                                </div>

                                <div>
                                    <p className="text-xl">
                                        {item.price.toLocaleString().replace(',', '.')} so'm
                                    </p>
                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>
        </div>
    );
}

export default Modules;