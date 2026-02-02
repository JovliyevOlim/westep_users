import { Link } from "react-router-dom";
import CartItem from "./CartItem";
import { useState } from "react";

// Mock Data (keyinchalik API dan keladi)
const INITIAL_CART_ITEMS = [
  {
    id: 1,
    image: "assets/img/courses/1.jpg",
    title: "Financial Security Thinking",
    price: 80.00,
    quantity: 1,
  },
  {
    id: 2,
    image: "assets/img/courses/2.jpg",
    title: "Financial Security Thinking",
    price: 80.00,
    quantity: 2,
  },
  {
    id: 3,
    image: "assets/img/courses/3.jpg",
    title: "Financial Security Thinking",
    price: 80.00,
    quantity: 4,
  }
];

export default function CartArea() {
  const [items, setItems] = useState(INITIAL_CART_ITEMS);

  const handleRemove = (id: number) => {
    setItems(items.filter(item => item.id !== id));
  };

  const handleUpdateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    setItems(items.map(item =>
      item.id === id ? { ...item, quantity: newQuantity } : item
    ));
  };

  const calculateSubtotal = () => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const subtotal = calculateSubtotal();
  const total = subtotal; // Hozircha total = subtotal (shipping yo'q)

  return (
    <>
      <div className="shopping-cart section-padding">
        <div className="container">
          <div className="row">
            <div className="col-xl-8 wow fadeIn">

              <table className="table shopping-summery responsive-table woocommerce-cart-form">
                <thead>
                  <tr className="main-hading">
                    <th>Products</th>
                    <th>Unit Price</th>
                    <th>Quantity</th>
                    <th>Total</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <CartItem
                      key={item.id}
                      id={item.id}
                      image={item.image}
                      title={item.title}
                      price={item.price}
                      quantity={item.quantity}
                      total={item.price * item.quantity}
                      onRemove={handleRemove}
                      onUpdateQuantity={handleUpdateQuantity}
                    />
                  ))}

                  <tr>
                    <td colSpan={6} className="actions">
                      <div className="bottom-cart">
                        <div className="coupon">
                          <input type="text" name="coupon_code" className="input-text" id="coupon_code" placeholder="Coupon code" />
                          <button type="submit" className="button" name="apply_coupon">Apply coupon</button>
                        </div>
                        <a href="#" className="btn_border">Update Cart</a>
                      </div>

                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="col-xl-4 wow fadeIn">
              <div className="cart-collaterals">
                <h2>Cart totals</h2>

                <div className="shop_table shop_table_responsive">
                  <div className="cart-subtotal">
                    <div className="title">Subtotal</div>
                    <div data-title="Subtotal">
                      <span className="woocommerce-Price-amount amount"><bdi>{subtotal.toFixed(2)}<span className="woocommerce-Price-currencySymbol">$</span></bdi></span>
                    </div>
                  </div>

                  <div className="woocommerce-shipping-totals shipping">
                    <div className="title">Shipping</div>
                    <div data-title="Shipping">
                      <p className="woocommerce-shipping-destination">
                        Shipping to <strong>Afghanistan</strong>.
                      </p>
                    </div>
                  </div>

                  <div className="order-total">
                    <div className="title">Total</div>
                    <div data-title="Total"><strong><span className="woocommerce-Price-amount amount"><bdi>{total.toFixed(2)}<span className="woocommerce-Price-currencySymbol">$</span></bdi></span></strong> </div>
                  </div>

                  <div className="wc-proceed-to-checkout">
                    <Link to="/checkout" className="bg_btn bt">
                      Proceed to checkout
                    </Link>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  )
}
