import {useEffect, useState} from "react";
import {useGetFileById} from "../api/file/useFile.ts";


interface Props {
    id: string | null,
}

function Image({id}: Props) {


    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const {data} = useGetFileById(id as string);

    useEffect(() => {
        if (data) {
            const blob = new Blob([data], {type: data.type || "image/svg+xml"});
            setPreviewUrl(URL.createObjectURL(blob));
        }
    }, [data]);

    return (
        <div className="w-full h-[180px] relative">
            {
                previewUrl && <img
                    style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        objectPosition: 'center'
                    }}
                    loading='lazy'
                    src={previewUrl}
                    alt={id as string}
                />
            }
        </div>);
}

export default Image;