import React, { useState, useEffect } from "react";
import { useZxing } from "react-zxing";
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
  const [scanMode, setScanMode] = useState("confirmed"); // Changed default to confirmed
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
  const [stream, setStream] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [isScanning, setIsScanning] = useState(false);

  const {
    ref: zxingRef,
    result,
    error,
  } = useZxing({
    onDecodeResult(result) {
      // Handle successful scan
      const scannedCode = result.getText();
      handleSuccessfulScan(scannedCode);
    },
    onError(error) {
      console.error("Scanning error:", error);
    },
  });

  useEffect(() => {
    if (scanMode === "scanning") {
      startCamera();
      setIsScanning(true);

      // Simulate scanning process
      const scanningTimer = setTimeout(() => {
        setIsScanning(false);
        captureFrame(); // Capture the frame
        stopCamera();
        setScanMode("found");
      }, 3000);

      return () => {
        clearTimeout(scanningTimer);
        stopCamera();
      };
    }
  }, [scanMode]);

  const startCamera = async () => {
    try {
      const constraints = {
        video: {
          facingMode: "environment", // Prefer back camera
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      };

      const mediaStream = await navigator.mediaDevices.getUserMedia(
        constraints
      );
      setStream(mediaStream);

      if (zxingRef.current) {
        zxingRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
  };

  const startScanning = () => {
    setScanMode("scanning");
    startCamera();
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
    stopCamera();
  };

  const handleClose = () => {
    stopCamera();
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

  const handleSuccessfulScan = async (barcode) => {
    setIsScanning(false);

    try {
      // In production, this would be an API call to get product details
      // const response = await fetch(`/api/products/${barcode}`);
      // const productData = await response.json();
      // setProductDetails(productData);

      // For now, we'll just use mock data
      captureFrame();
      setScanMode("found");
    } catch (error) {
      console.error("Error fetching product details:", error);
    }
  };

  const captureFrame = () => {
    if (zxingRef.current) {
      const video = zxingRef.current;
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(video, 0, 0);
      const imageUrl = canvas.toDataURL("image/jpeg");
      setCapturedImage(imageUrl);
    }
  };

  const renderScanningView = () => (
    <div className={styles.scanContainer}>
      <div className={styles.headerBar}>
        <button className={styles.backButton} onClick={handleClose}>
          <X size={20} />
        </button>
        <h2 className={styles.headerTitle}>Scan item</h2>
        <div className={styles.cartIconWrapper}>
          <span className={styles.cartCount}>99+</span>
          <div className={styles.cartIcon}>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6 2L3 6V20C3 20.5304 3.21071 21.0391 3.58579 21.4142C3.96086 21.7893 4.46957 22 5 22H19C19.5304 22 20.0391 21.7893 20.4142 21.4142C20.7893 21.0391 21 20.5304 21 20V6L18 2H6Z"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M3 6H21"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M16 10C16 11.0609 15.5786 12.0783 14.8284 12.8284C14.0783 13.5786 13.0609 14 12 14C10.9391 14 9.92172 13.5786 9.17157 12.8284C8.42143 12.0783 8 11.0609 8 10"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      </div>

      <div className={styles.searchContainer}>
        <Search size={18} className={styles.searchIcon} />
        <span className={styles.searchText}>Search item instead</span>
      </div>

      <div className={styles.cameraPreview}>
        <video ref={zxingRef} className={styles.videoStream} />
        <div className={styles.scannerFrame}>
          <div className={`${styles.scannerCorner} ${styles.topLeft}`}></div>
          <div className={`${styles.scannerCorner} ${styles.topRight}`}></div>
          <div className={`${styles.scannerCorner} ${styles.bottomLeft}`}></div>
          <div
            className={`${styles.scannerCorner} ${styles.bottomRight}`}
          ></div>
          {isScanning && (
            <div className={styles.scanningIndicator}>
              <div className={styles.scanLine}></div>
              <p>Align barcode within frame</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderFoundView = () => (
    <div className={styles.scanContainer}>
      <div className={styles.headerBar}>
        <button className={styles.backButton} onClick={handleClose}>
          <X size={20} />
        </button>
        <h2 className={styles.headerTitle}>Scan item</h2>
        <div className={styles.cartIconWrapper}>
          <span className={styles.cartCount}>3</span>
          <div className={styles.cartIcon}>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6 2L3 6V20C3 20.5304 3.21071 21.0391 3.58579 21.4142C3.96086 21.7893 4.46957 22 5 22H19C19.5304 22 20.0391 21.7893 20.4142 21.4142C20.7893 21.0391 21 20.5304 21 20V6L18 2H6Z"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M3 6H21"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M16 10C16 11.0609 15.5786 12.0783 14.8284 12.8284C14.0783 13.5786 13.0609 14 12 14C10.9391 14 9.92172 13.5786 9.17157 12.8284C8.42143 12.0783 8 11.0609 8 10"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      </div>

      <div className={styles.searchContainer}>
        <Search size={18} className={styles.searchIcon} />
        <span className={styles.searchText}>Search item instead</span>
      </div>

      <div className={`${styles.cameraPreview} ${styles.withOverlay}`}>
        {capturedImage && (
          <img
            src={capturedImage}
            alt="Scanned item"
            className={styles.capturedImage}
          />
        )}
        <div className={styles.foundOverlay}>
          <span className={styles.foundText}>Item Found</span>
        </div>
      </div>

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

      <div className={styles.actionBar}>
        <div className={styles.quantityControls}>
          <button
            className={styles.quantityBtn}
            onClick={() => handleQuantityChange(-1)}
          >
            <Minus size={16} />
          </button>
          <span className={styles.quantityValue}>
            {productDetails.quantity}
          </span>
          <button
            className={styles.quantityBtn}
            onClick={() => handleQuantityChange(1)}
          >
            <Plus size={16} />
          </button>
        </div>
        <button className={styles.addToCart} onClick={handleAddToCart}>
          Add to cart
        </button>
      </div>
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
