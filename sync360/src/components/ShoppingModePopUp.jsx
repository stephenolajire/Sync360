import React, { useState, useEffect } from 'react';
import styles from './css/ShoppingModePopup.module.css';
import { MdStore, MdDeliveryDining } from 'react-icons/md';

const ShoppingModePopup = ({ onSelectMode, isOpen, onClose }) => {
  const [visible, setVisible] = useState(false);
  
  useEffect(() => {
    if (isOpen) {
      setVisible(true);
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);
  
  const handleModeSelection = (mode) => {
    onSelectMode(mode);
    setVisible(false);
    onClose();
  };

  if (!visible) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.popup}>
        <div className={styles.popupContent}>
          <h2>Welcome to Sync360</h2>
          <p>How would you like to shop today?</p>
          
          <div className={styles.optionsContainer}>
            <button 
              className={`${styles.optionButton} ${styles.inStoreButton}`}
              onClick={() => handleModeSelection('in-store')}
            >
              <div className={styles.iconWrapper}>
                <MdStore className={styles.optionIcon} />
              </div>
              <span>Shopping In-Store</span>
              <p className={styles.optionDescription}>Scan items as you shop in our physical location</p>
            </button>
            
            <button 
              className={`${styles.optionButton} ${styles.deliveryButton}`}
              onClick={() => handleModeSelection('delivery')}
            >
              <div className={styles.iconWrapper}>
                <MdDeliveryDining className={styles.optionIcon} />
              </div>
              <span>Delivery</span>
              <p className={styles.optionDescription}>Browse our catalog and get items delivered to you</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShoppingModePopup;