import { Link } from "react-router-dom";

interface CartItemProps {
    id: number;
    image: string;
    title: string;
    price: number;
    quantity: number;
    total: number;
    onRemove?: (id: number) => void;
    onUpdateQuantity?: (id: number, quantity: number) => void;
}

export default function CartItem({
    id,
    image,
    title,
    price,
    quantity,
    total,
    onRemove,
    onUpdateQuantity
}: CartItemProps) {
    return (
        <tr>
            <td>
                <Link to="/course-details" className="pthumb">
                    <img src={image} alt={title} />
                </Link>

                <div className="product-name">
                    <Link to="/course-details">
                        {title}
                    </Link>
                </div>
            </td>

            <td className="price" data-title="Price"><span>${price.toFixed(2)} </span></td>

            <td className="qty" data-title="Qty">
                <div className="input-group">
                    <div className="button minus">
                        <button
                            type="button"
                            className="btn btn-primary btn-number"
                            disabled={quantity <= 1}
                            onClick={() => onUpdateQuantity && onUpdateQuantity(id, quantity - 1)}
                        >
                            <i className="ti-minus"></i>
                        </button>
                    </div>
                    <input
                        type="text"
                        className="input-number"
                        value={quantity}
                        readOnly
                    />
                    <div className="button plus">
                        <button
                            type="button"
                            className="btn btn-primary btn-number"
                            onClick={() => onUpdateQuantity && onUpdateQuantity(id, quantity + 1)}
                        >
                            <i className="ti-plus"></i>
                        </button>
                    </div>
                </div>
            </td>

            <td className="total-amount"><span>${total.toFixed(2)}</span></td>
            <td className="action">
                <a href="#" onClick={(e) => { e.preventDefault(); onRemove && onRemove(id); }}>
                    <i className="ti-trash remove-icon"></i>
                </a>
            </td>
        </tr>
    );
}
