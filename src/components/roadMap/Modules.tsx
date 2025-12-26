import React from "react"
import {Module} from "../../types/types.ts";


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
        }
        else {
            if (selected) {
                console.log(selected.filter((module: Module) => module.id === item.id))
                newList = selected.filter((module: Module) => module.id !== item.id)
            }
        }
        console.log(newList)
        setSelected(newList)
    }

    return (
        <div className={'flex-1 p-4'}>
            <h1 className="text-2xl font-extrabold uppercase leading-tight">
                Kursni xarid qilish
            </h1>

            {/* Divider */}
            <div className="my-8 h-[2px] w-full bg-black"/>

            {/* Course block */}
            <div className="space-y-8">
                {/* Modules */}
                <div className="space-y-6">
                    {

                        modules.map((item:Module, i) => (
                            <div key={i} className="flex items-center gap-8">
                                <input
                                    onChange={(e) => handleChange(e, item)}
                                    type="checkbox"
                                    className="mt-1 h-6 w-6 accent-primary-500"
                                />
                                <div>
                                    <p className="text-xl">{item.name}</p>
                                    <p className="text-2xl font-extrabold">
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