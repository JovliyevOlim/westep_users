import {baseUrlImage} from "../api/apiClient.ts";

interface Props {
    imageUrl: string | null,
}

function Image({imageUrl}: Props) {


    return (
        <div className="w-full h-[180px] relative">
            {
                imageUrl && <img
                    style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        objectPosition: 'center'
                    }}
                    loading='lazy'
                    src={baseUrlImage + imageUrl}
                    alt={imageUrl as string}
                />
            }
        </div>);
}

export default Image;