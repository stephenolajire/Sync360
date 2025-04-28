import React, { useState, useEffect } from "react";
import { MdCheckCircle, MdClose, MdCamera } from "react-icons/md";
import styles from "./css/ScanMode.module.css";
import Camera from "../components/Camera";

const ScanMode = ({ isOpen, onClose, productName, productPrice }) => {
  const [visible, setVisible] = useState(false);
  const [animation, setAnimation] = useState("");
  const [cameraActive, setCameraActive] = useState(false);
  const [scanning, setScanning] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setVisible(true);
      setAnimation(styles.animateIn);
    }
  }, [isOpen]);

  const handleClose = () => {
    setAnimation(styles.animateOut);
    stopCamera();
    setTimeout(() => {
      setVisible(false);
      onClose();
    }, 300);
  };

  const startCamera = () => {
    setCameraActive(true);
    setScanning(true);
  };

  const stopCamera = () => {
    setCameraActive(false);
    setScanning(false);
  };

  // This function would be passed to the Camera component to handle successful scans
  const handleBarcodeScan = (barcodeData) => {
    console.log("Barcode scanned:", barcodeData);
    stopCamera();
    // In a real app, you would use the barcode data to fetch product information
    // For this example, we'll just simulate a successful scan
    onClose();
  };

  // Simulating a successful scan after a few seconds (for demo purposes)
  useEffect(() => {
    let scanTimer;
    if (scanning) {
      scanTimer = setTimeout(() => {
        if (scanning) {
          stopCamera();
          onClose();
        }
      }, 10000);
    }

    return () => {
      if (scanTimer) clearTimeout(scanTimer);
    };
  }, [scanning, onClose]);

  if (!visible) return null;

  // Display confirmation if product info is available, otherwise show scanner
  const showConfirmation = productName && productPrice;

  return (
    <div className={`${styles.overlay} ${animation}`}>
      <div className={`${styles.popup} ${animation}`}>
        <button className={styles.closeButton} onClick={handleClose}>
          <MdClose />
        </button>

        {showConfirmation ? (
          <div className={styles.content}>
            <div className={styles.successIcon}>
              <MdCheckCircle />
            </div>

            <h3>Item Added Successfully!</h3>

            <div className={styles.productInfo}>
              <p className={styles.productName}>{productName}</p>
              <p className={styles.productPrice}>${productPrice.toFixed(2)}</p>
            </div>

            <div className={styles.actions}>
              <button
                className={`${styles.actionButton} ${styles.continueButton}`}
                onClick={handleClose}
              >
                Continue Shopping
              </button>
              <button
                className={`${styles.actionButton} ${styles.cartButton}`}
                onClick={handleClose}
              >
                View Cart
              </button>
            </div>
          </div>
        ) : (
          <div className={styles.scannerContent}>
            <h3>Scan Product Barcode</h3>

            <div className={styles.cameraContainer}>
              {cameraActive ? (
                <Camera 
                  onScan={handleBarcodeScan} 
                  onError={(error) => console.error("Camera error:", error)}
                  className={styles.cameraView}
                />
              ) : (
                <div className={styles.cameraPlaceholder}>
                  <MdCamera className={styles.cameraIcon} />
                  <p>Camera access required</p>
                </div>
              )}
              
              {cameraActive && (
                <div className={styles.scanOverlay}>
                  <div className={styles.scanLine}></div>
                </div>
              )}
            </div>

            <div className={styles.actions}>
              {!cameraActive ? (
                <button
                  className={`${styles.actionButton} ${styles.startButton}`}
                  onClick={startCamera}
                >
                  Start Camera
                </button>
              ) : (
                <button
                  className={`${styles.actionButton} ${styles.stopButton}`}
                  onClick={stopCamera}
                >
                  Stop Camera
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScanMode;