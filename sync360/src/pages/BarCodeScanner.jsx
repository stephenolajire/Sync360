import React, { useState } from "react";
import ScanMode from "../components/ScanMode";
import styles from "./css/BarcodeScannerPage.module.css";

const BarcodeScannerPage = () => {
  const [showScanMode, setShowScanMode] = useState(false);
  const [scannedProduct, setScannedProduct] = useState(null);

  // Function to handle when a product is successfully scanned
  const handleProductScanned = (productData) => {
    setScannedProduct(productData);
    // Show the confirmation with product details
    setShowScanMode(true);
  };

  // Function to handle when the scan modal is closed
  const handleScanClose = () => {
    setShowScanMode(false);
    // Clear scanned product after a delay to allow animations to complete
    setTimeout(() => {
      setScannedProduct(null);
    }, 300);
  };

  // For demo purposes - simulate scanning different products
  const simulateScan = () => {
    // This simulates scanning a product
    const products = [
      { name: "Organic Bananas", price: 3.99 },
      { name: "Whole Grain Bread", price: 4.5 },
      { name: "Farm Fresh Eggs", price: 5.99 },
      { name: "Almond Milk", price: 3.49 },
    ];

    const randomProduct = products[Math.floor(Math.random() * products.length)];
    handleProductScanned(randomProduct);
  };

  return (
    <div className={styles.scannerPage}>
      <div className={styles.scannerHeader}>
        <h1>Product Scanner</h1>
        <p>Start scanning items to add them to your cart</p>
      </div>

      <div className={styles.scannerContainer}>
        <div className={styles.instructions}>
          <div className={styles.step}>
            <div className={styles.stepNumber}>1</div>
            <p>Point your camera at a product barcode</p>
          </div>
          <div className={styles.step}>
            <div className={styles.stepNumber}>2</div>
            <p>Hold steady until the barcode is detected</p>
          </div>
          <div className={styles.step}>
            <div className={styles.stepNumber}>3</div>
            <p>Product will be automatically added to your cart</p>
          </div>
        </div>

        <button
          className={styles.scanButton}
          onClick={() => setShowScanMode(true)}
        >
          Open Scanner
        </button>

        {/* For demo purposes only */}
        <button className={styles.demoButton} onClick={simulateScan}>
          Simulate Successful Scan
        </button>
      </div>

      {/* The scan mode component handles both camera and confirmation */}
      <ScanMode
        isOpen={showScanMode}
        onClose={handleScanClose}
        productName={scannedProduct?.name}
        productPrice={scannedProduct?.price}
      />
    </div>
  );
};

export default BarcodeScannerPage;
