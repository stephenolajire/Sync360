import React, { useState, useEffect, useRef } from "react";
import {
  X,
  Camera as CameraIcon,
  CheckCircle2,
  Search,
  Plus,
  Minus,
  Info,
} from "lucide-react";
import styles from "./css/ShoppingScanner.module.css";

const ShoppingScanner = () => {
  // Remove stream and videoRef as they're handled by Camera component
  const [scanMode, setScanMode] = useState("confirmed");
  const [scannedItems, setScannedItems] = useState([]); // Add state for scanned items
  const [productDetails, setProductDetails] = useState({
    name: "Coca Cola",
    description: "(Medium side)",
    price: 500,
    currency: "₦",
    quantity: 1,
    image:
      "https://images.unsplash.com/photo-1554866585-cd94860890b7?w=500&q=80",
  });
  const [walletBalance, setWalletBalance] = useState(5290000);
  const [cartTotal, setCartTotal] = useState(24500);
  const [capturedImage, setCapturedImage] = useState(null); // Add state for captured image

  const handleScan = async ({ format, data }) => {
    try {
      // Here you would typically make an API call to get product details
      // For now, using mock data
      // const response = await fetch(`/api/products/${data}`);
      // const productData = await response.json();

      // Mock successful scan
      setScanMode("found");
      // setProductDetails(productData); // Uncomment when API is ready
    } catch (error) {
      console.error("Error processing scan:", error);
    }
  };

  const handleScanError = (error) => {
    console.error("Scan error:", error);
    // Handle error appropriately
  };

  const handleCloseCamera = () => {
    setScanMode("confirmed");
  };

  const startScanning = () => {
    setScanMode("scanning");
  };

  const handleAddToCart = () => {
    // Add current item to scanned items list
    setScannedItems((prev) => [
      ...prev,
      {
        ...productDetails,
        id: Date.now(), // temporary unique id
        totalPrice: productDetails.price * productDetails.quantity,
      },
    ]);

    // Update cart total
    setCartTotal(
      (prev) => prev + productDetails.price * productDetails.quantity
    );

    // Reset to confirmed view
    setScanMode("confirmed");
  };

  const handleClose = () => {
    // In a real app, this would close the component
  };

  const handleQuantityChange = (change) => {
    setProductDetails((prev) => ({
      ...prev,
      quantity: Math.max(1, prev.quantity + change),
    }));
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      currencyDisplay: "symbol",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })
      .format(amount)
      .replace("NGN", "₦");
  };

  const renderScanningView = () => (
    <div className={styles.scanContainer}>
      <Camera
        onScan={handleScan}
        onError={handleScanError}
        onClose={handleCloseCamera}
      />
    </div>
  );

  const renderFoundView = () => (
    <div className={styles.foundContainer}>
      {capturedImage && (
        <div
          className={styles.backgroundImage}
          style={{ backgroundImage: `url(${capturedImage})` }}
        >
          {/* Product details overlay */}
          <div className={styles.productDetails}>
            <div className={styles.productImage}>
              <img src={productDetails.image} alt={productDetails.name} />
            </div>
            <div className={styles.productInfo}>
              <h3 className={styles.productName}>
                {productDetails.name}{" "}
                <span className={styles.productDescription}>
                  {productDetails.description}
                </span>
              </h3>
              <div className={styles.productStatus}>
                <span className={styles.inStock}>● In Stock</span>
                <span className={styles.productPrice}>
                  {productDetails.currency}
                  {productDetails.price}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderConfirmedView = () => (
    <div className={styles.mainContainer}>
      {/* <div className={styles.walletSection}>
        <div className={styles.balanceContainer}>
          <h2 className={styles.balanceText}>
            {formatCurrency(walletBalance)}
          </h2>
          <button className={styles.balanceBtn}>
            <CheckCircle2 size={16} className={styles.balanceIcon} />
            <span>Show Balance</span>
          </button>
        </div>
        <button className={styles.fundWalletBtn}>
          <Plus size={16} />
          <span>Fund Wallet</span>
        </button>
      </div> */}

      <div className={styles.confirmationMessage}>
        <div className={styles.cameraIconWrapper}>
          <div className={styles.cameraFrameIcon}>
            <div className={styles.cornerTopLeft}></div>
            <div className={styles.cornerTopRight}></div>
            <p className={styles.Scan}>Scan the barcode to start shopping </p>
            <div className={styles.cornerBottomLeft}></div>
            <div className={styles.cornerBottomRight}></div>
          </div>
        </div>
      </div>

      {/* Add Scan Button */}
      <div className={styles.buttons}>
        <button className={styles.startScanButton} onClick={startScanning}>
          <CameraIcon size={20} />
          Scan Item
        </button>

        {/* Show scanned items if any */}
        {/* {scannedItems.length > 0 && (
        <div className={styles.scannedItemsList}>
          {scannedItems.map(item => (
            <div key={item.id} className={styles.scannedItem}>
              <img src={item.image} alt={item.name} className={styles.itemImage} />
              <div className={styles.itemDetails}>
                <h3>{item.name}</h3>
                <p>{item.quantity} x {formatCurrency(item.price)}</p>
              </div>
              <span className={styles.itemTotal}>
                {formatCurrency(item.totalPrice)}
              </span>
            </div>
          ))}
        </div>
      )} */}

        <div className={styles.cartTotal}>
          <span className={styles.totalText}>Total Value in Cart:</span>
          <span className={styles.totalValue}>{formatCurrency(cartTotal)}</span>
        </div>
      </div>
    </div>
  );

  // Render the appropriate view based on the scan mode
  return (
    <div className={styles.scannerContainer}>
      {scanMode === "scanning" && renderScanningView()}
      {scanMode === "found" && renderFoundView()}
      {scanMode === "confirmed" && renderConfirmedView()}
    </div>
  );
};

export default ShoppingScanner;
