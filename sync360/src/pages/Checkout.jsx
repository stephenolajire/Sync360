import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MdArrowBack, MdShoppingCart } from 'react-icons/md';
import styles from './css/Checkout.module.css';

const Checkout = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
  };

  return (
    <div className={styles.checkoutPage}>
      <div className={styles.checkoutHeader}>
        <Link to="/cart" className={styles.backButton}>
          <MdArrowBack /> Back to Cart
        </Link>
        <h2>Checkout</h2>
      </div>

      <div className={styles.checkoutContainer}>
        <form onSubmit={handleSubmit} className={styles.checkoutForm}>
          <section className={styles.formSection}>
            <h3>Contact Information</h3>
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label htmlFor="firstName">First Name</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="lastName">Last Name</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="phone">Phone Number</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                required
              />
            </div>
          </section>

          <section className={styles.formSection}>
            <h3>Shipping Address</h3>
            <div className={styles.formGroup}>
              <label htmlFor="address">Street Address</label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label htmlFor="city">City</label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="state">State</label>
                <input
                  type="text"
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="zipCode">ZIP Code</label>
                <input
                  type="text"
                  id="zipCode"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
          </section>

          <button type="submit" className={styles.submitButton}>
            Place Order
          </button>
        </form>

        <div className={styles.orderSummary}>
          <h3>Order Summary</h3>
          <div className={styles.summaryItems}>
            {/* Demo items - replace with actual cart items */}
            <div className={styles.summaryItem}>
              <span>Subtotal</span>
              <span>$99.99</span>
            </div>
            <div className={styles.summaryItem}>
              <span>Shipping</span>
              <span>Free</span>
            </div>
            <div className={`${styles.summaryItem} ${styles.total}`}>
              <span>Total</span>
              <span>$99.99</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;