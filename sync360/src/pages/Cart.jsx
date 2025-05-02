import React, { useState } from "react";
import {
  MdAdd,
  MdRemove,
  MdDelete,
  MdShoppingCart,
  MdArrowBack,
} from "react-icons/md";
import { Link } from "react-router-dom";
import styles from "./css/Cart.module.css";
import { sampleProducts } from "../data/sampledata";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const [cartItems, setCartItems] = useState(
    sampleProducts.slice(0, 3).map((product) => ({
      ...product,
      cartQuantity: 1,
    }))
  );
  const navigate = useNavigate();
  const updateQuantity = (id, change) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id
          ? {
              ...item,
              cartQuantity: Math.max(
                1,
                Math.min(item.quantity, item.cartQuantity + change)
              ),
            }
          : item
      )
    );
  };

  const removeItem = (id) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const calculateTotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.cartQuantity,
      0
    );
  };

  const handleCheckout = () => {
    navigate("/checkout");
  };

  if (cartItems.length === 0) {
    return (
      <div className={styles.emptyCart}>
        <MdShoppingCart className={styles.emptyIcon} />
        <h2>Your cart is empty</h2>
        <Link to="/" className={styles.continueButton}>
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.cartPage}>
      <div className={styles.cartHeader}>
        <Link to="/" className={styles.backButton}>
          <MdArrowBack /> Back to Shop
        </Link>
        <h4 className={styles.cartname}>Your Cart</h4>
        <h2 className={styles.cartName}>Your Cart</h2>
      </div>

      <div className={styles.cartContainer}>
        <div className={styles.cartItems}>
          {cartItems.map((item) => (
            <div key={item.id} className={styles.cartItem}>
              <div className={styles.itemImage}>
                <img src={item.image} alt={item.name} />
              </div>

              <div className={styles.itemInfo}>
                <div className={styles.itemHeader}>
                  <h3>{item.name}</h3>
                  <p className={styles.price}>
                    ${(item.price * item.cartQuantity).toFixed(2)}
                  </p>
                </div>

                <div className={styles.itemControls}>
                  <div className={styles.quantity}>
                    <button
                      onClick={() => updateQuantity(item.id, -1)}
                      disabled={item.cartQuantity <= 1}
                    >
                      <MdRemove />
                    </button>
                    <span>{item.cartQuantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, 1)}
                      disabled={item.cartQuantity >= item.quantity}
                    >
                      <MdAdd />
                    </button>
                  </div>

                  <button
                    className={styles.removeButton}
                    onClick={() => removeItem(item.id)}
                    aria-label="Remove item"
                  >
                    <MdDelete />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.cartSummary}>
          <h3>Order Summary</h3>
          <div className={styles.summaryDetails}>
            <div className={styles.summaryRow}>
              <span>Subtotal</span>
              <span>${calculateTotal().toFixed(2)}</span>
            </div>
            <div className={styles.summaryRow}>
              <span>Shipping</span>
              <span>Free</span>
            </div>
            <div className={`${styles.summaryRow} ${styles.total}`}>
              <span>Total</span>
              <span>${calculateTotal().toFixed(2)}</span>
            </div>
          </div>
          <button onClick={handleCheckout} className={styles.checkoutButton}>Proceed to Checkout</button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
