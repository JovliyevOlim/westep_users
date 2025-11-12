import {useState} from "react";
import {Star} from "../../assets/icon";

function LessonRating() {
    return (
        <div>
            <div className="col-12 my-4 d-flex justify-content-between align-items-center">
                <h3 className="text-black m-0">Darsni baholang</h3>
                <div>
                    <StarRating/>
                </div>
            </div>
        </div>
    );
}

export default LessonRating;


type RatingProps = {
    total?: number; // nechta yulduz (default 5)
    onChange?: (value: number) => void; // baho o‘zgarganda event
};

const StarRating = ({total = 5, onChange}: RatingProps) => {
    const [rating, setRating] = useState(0);      // tanlangan baho
    const [hover, setHover] = useState<number | null>(null); // hover qilganda vaqtinchalik rang

    const handleClick = (value: number) => {
        setRating(value);
        onChange?.(value);
    };

    return (
        <div style={{display: "flex", gap: "6px", cursor: "pointer"}}>
            {Array.from({length: total}).map((_, i) => {
                const value = i + 1;
                const isActive = hover ? value <= hover : value <= rating;

                return (
                    <Star
                        key={i}
                        onClick={() => handleClick(value)}
                        onMouseEnter={() => setHover(value)}
                        onMouseLeave={() => setHover(null)}
                        width={28}
                        height={28}
                        className={`${isActive ? "text-warning" : "text-info"}`}
                        style={{transition: "0.2s"}}
                    />
                );
            })}
        </div>
    );
};
