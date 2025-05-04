import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MdArrowBack, MdPayment } from "react-icons/md";
import { FaPaypal, FaCreditCard, FaWallet } from "react-icons/fa";
import styles from "./css/ShippingDetails.module.css";

const ShippingDetails = () => {
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [selectedDelivery, setSelectedDelivery] = useState(null);

  // Demo data - replace with actual data from your state management
  const shippingInfo = {
    name: "John Doe",
    email: "john@example.com",
    phone: "+1234567890",
    address: "123 Main St",
    city: "New York",
    state: "NY",
    zipCode: "10001",
  };

  const orderItems = [
    {
      id: 1,
      name: "Casual T-Shirt",
      price: 19.99,
      quantity: 1,
      image:
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
    },
    {
      id: 2,
      name: "Men's Slim Fit Jeans",
      price: 49.99,
      quantity: 2,
      image:
        "https://images.unsplash.com/photo-1542272604-787c3835535d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
    },
    {
      id: 3,
      name: "Women's Summer Dress",
      price: 39.99,
      quantity: 1,
      image:
        "https://images.unsplash.com/photo-1496747611176-843222e1e57c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
    },
  ];

  const paymentMethods = [
    { id: "paystack", name: "Paystack", icon: <FaCreditCard /> },
    { id: "flutterwave", name: "Flutterwave", icon: <FaPaypal /> },
    { id: "wallet", name: "Wallet", icon: <FaWallet /> },
  ];

  const deliveryMethods = [
    {
      id: "express",
      name: "Express Delivery",
      description: "1-2 business days",
      fee: 5000,
      icon: "🚚",
    },
    {
      id: "standard",
      name: "Standard Delivery",
      description: "3-5 business days",
      fee: 2500,
      icon: "📦",
    },
    {
      id: "pickup",
      name: "Customer Pick-up",
      description: "Pick up from our store",
      fee: 0,
      icon: "🏪",
    },
  ];

  const handlePaymentSelection = (methodId) => {
    setSelectedPayment(methodId);
  };

  const handleDeliverySelection = (methodId) => {
    setSelectedDelivery(methodId);
  };

  const handleProceedToPayment = () => {
    setShowPaymentModal(true);
  };

  const navigate = useNavigate();

  const handlePaymentSubmit = () => {
    if (selectedPayment) {
      // Process payment
      console.log("Processing payment with:", selectedPayment);
      navigate("/receipt");
    }
  };

  return (
    <div className={styles.shippingDetails}>
      <div className={styles.header}>
        <Link to="/checkout" className={styles.backButton}>
          <MdArrowBack /> Back
        </Link>
        <h2 className={styles.review}>Review Order</h2>
      </div>

      <div className={styles.content}>
        <div className={styles.detailsSection}>
          <h3 className={styles.shipping}>Shipping Information</h3>
          <div className={styles.infoCard}>
            <p>
              <strong>Name:</strong> {shippingInfo.name}
            </p>
            <p>
              <strong>Email:</strong> {shippingInfo.email}
            </p>
            <p>
              <strong>Phone:</strong> {shippingInfo.phone}
            </p>
            <p>
              <strong>Address:</strong> {shippingInfo.address}
            </p>
            <p>
              <strong>City:</strong> {shippingInfo.city}
            </p>
            <p>
              <strong>State:</strong> {shippingInfo.state}
            </p>
            <p>
              <strong>ZIP Code:</strong> {shippingInfo.zipCode}
            </p>
          </div>
        </div>

        <div className={styles.detailsSection}>
          <h3 className={styles.orders}>Order Items</h3>
          <div className={styles.orderItems}>
            {orderItems.map((item) => (
              <div key={item.id} className={styles.orderItem}>
                <img src={item.image} alt={item.name} />
                <div className={styles.itemDetails}>
                  <h4>{item.name}</h4>
                  <p>Quantity: {item.quantity}</p>
                  <p className={styles.price}>${item.price.toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.detailsSection}>
          <h3 className={styles.delivery}>Delivery Method</h3>
          <div className={styles.deliveryMethods}>
            {deliveryMethods.map((method) => (
              <button
                key={method.id}
                className={`${styles.deliveryMethod} ${
                  selectedDelivery === method.id ? styles.selected : ""
                }`}
                onClick={() => handleDeliverySelection(method.id)}
              >
                <span className={styles.deliveryIcon}>{method.icon}</span>
                <div className={styles.deliveryInfo}>
                  <span className={styles.deliveryName}>{method.name}</span>
                  <span className={styles.deliveryDescription}>
                    {method.description}
                  </span>
                </div>
                <span className={styles.deliveryFee}>
                  {method.fee === 0
                    ? "Free"
                    : `₦${method.fee.toLocaleString()}`}
                </span>
              </button>
            ))}
          </div>
        </div>

        <button
          className={styles.proceedButton}
          onClick={handleProceedToPayment}
          disabled={!selectedDelivery}
        >
          <MdPayment /> Proceed to Payment
        </button>
      </div>

      {showPaymentModal && (
        <div
          className={styles.modalOverlay}
          onClick={() => setShowPaymentModal(false)}
        >
          <div
            className={styles.paymentModal}
            onClick={(e) => e.stopPropagation()}
          >
            <h3>Select Payment Method</h3>
            <div className={styles.paymentMethods}>
              {paymentMethods.map((method) => (
                <button
                  key={method.id}
                  className={`${styles.paymentMethod} ${
                    selectedPayment === method.id ? styles.selected : ""
                  }`}
                  onClick={() => handlePaymentSelection(method.id)}
                >
                  {method.icon}
                  <span>{method.name}</span>
                </button>
              ))}
            </div>
            <button
              className={styles.confirmButton}
              onClick={handlePaymentSubmit}
              disabled={!selectedPayment}
            >
              Proceed with Payment
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShippingDetails;
