import React, { useState, useEffect } from "react";
import {
  X,
  Camera as CameraIcon,
  CheckCircle2,
  Search,
  Plus,
  Minus,
  Info,
  ShoppingCart, // Add this
  ArrowLeft, // Add this
} from "lucide-react";
import { useNavigate } from "react-router-dom"; // Add this
import styles from "./css/ShoppingScanner.module.css";
import Camera from "./Camera";
import Swal from "sweetalert2";
import { useGlobal } from "../context/GlobalContext";

const ShoppingScanner = () => {
  const navigate = useNavigate(); // Add this
  const {
    scanMode,
    setScanMode,
    handleStartScanning,
    scanStartTime,
    setScanStartTime,
  } = useGlobal();
  // const [scanMode, setScanMode] = useState("confirmed");
  const [scannedItems, setScannedItems] = useState([]);
  const [productDetails, setProductDetails] = useState({
    name: "Coca Cola",
    description: "(Medium size)",
    price: 500,
    currency: "₦",
    quantity: 1,
    image:
      "https://images.unsplash.com/photo-1554866585-cd94860890b7?w=500&q=80",
  });
  const [walletBalance, setWalletBalance] = useState(5290000);
  const [cartTotal, setCartTotal] = useState(24500);
  const [capturedImage, setCapturedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  // const [scanStartTime, setScanStartTime] = useState(null);

  // This effect handles the scanning timer
  useEffect(() => {
    let timer = null;

    // Only start the timer if we're in scanning mode
    if (scanMode === "scanning" && scanStartTime !== null) {
      console.log("Scanning started, timer running");

      // Set timer to trigger after 3 seconds of scanning
      timer = setTimeout(() => {
        console.log("Scan complete after 3 seconds");
        // Capture the image and move to found mode
        setCapturedImage(productDetails.image);
        setScanMode("found");
        setIsLoading(true);

        // Set another timer for the loading state (2 seconds)
        setTimeout(() => {
          console.log("Loading complete, showing product details");
          setIsLoading(false);
        }, 2000);
      }, 5000);
    }

    // Clean up the timer if component unmounts or mode changes
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [scanMode, scanStartTime, productDetails.image]);

  // Update the handleAddToCart function
  const handleAddToCart = async () => {
    // Show loading toast
    const Toast = Swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener("mouseenter", Swal.stopTimer);
        toast.addEventListener("mouseleave", Swal.resumeTimer);
      },
    });

    // Show loading state
    await Toast.fire({
      icon: "info",
      title: "Adding to cart...",
    });

    // Add current item to scanned items list
    setScannedItems((prev) => [
      ...prev,
      {
        ...productDetails,
        id: Date.now(),
        totalPrice: productDetails.price * productDetails.quantity,
      },
    ]);

    // Update cart total
    setCartTotal(
      (prev) => prev + productDetails.price * productDetails.quantity
    );

    // Show success message
    await Toast.fire({
      icon: "success",
      title: `Added ${productDetails.quantity} ${productDetails.name} to cart`,
      background: "#4CAF50",
      color: "#fff",
    });

    // Reset to confirmed view
    setScanMode("scanning");
  };

  // const handleStartScanning = () => {
  //   // Set scanning mode when the user clicks the scan button
  //   setScanMode("scanning");
  //   setScanStartTime(Date.now()); // Record when scanning started
  // };

  const handleClose = () => {
    // Reset to the initial state
    setScanMode("confirmed");
    setCapturedImage(null);
    setScanStartTime(null);
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
      <div className={styles.header}>
        <button className={styles.closeButton} onClick={handleClose}>
          <X size={24} />
        </button>
      </div>
      <div className={styles.topNav}>
        <button className={styles.backButton} onClick={() => navigate(-1)}>
          <ArrowLeft size={24} />
        </button>

        <div className={styles.searchContainer}>
          <Search size={20} />
          <input
            type="text"
            placeholder="Search items..."
            onClick={() => navigate("/products")}
            readOnly
          />
        </div>

        <button className={styles.cartButton} onClick={() => navigate("/cart")}>
          <ShoppingCart size={24} />
          {scannedItems.length > 0 && (
            <span className={styles.cartBadge}>{scannedItems.length}</span>
          )}
        </button>
      </div>
      <Camera
        onScan={() => {}}
        onError={() => {}}
        onClose={handleClose}
        onImageCapture={() => {}}
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
          <div className={styles.topNav}>
            <button className={styles.backButton} onClick={() => navigate(-1)}>
              <ArrowLeft size={24} />
            </button>

            <div className={styles.searchContainer}>
              <Search size={20} />
              <input
                type="text"
                placeholder="Search items..."
                onClick={() => navigate("/products")}
                readOnly
              />
            </div>

            <button
              className={styles.cartButton}
              onClick={() => navigate("/cart")}
            >
              <ShoppingCart size={24} />
              {scannedItems.length > 0 && (
                <span className={styles.cartBadge}>{scannedItems.length}</span>
              )}
            </button>
          </div>

          {isLoading ? (
            <div className={styles.loadingOverlay}>
              <div className={styles.loadingSpinner}></div>
              <p>Finding product details...</p>
            </div>
          ) : (
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

              {/* Add quantity controls and add to cart button */}
              <div className={styles.quantityControls}>
                <button
                  className={styles.quantityButton}
                  onClick={() => handleQuantityChange(-1)}
                >
                  <Minus size={16} />
                </button>
                <span className={styles.quantity}>
                  {productDetails.quantity}
                </span>
                <button
                  className={styles.quantityButton}
                  onClick={() => handleQuantityChange(1)}
                >
                  <Plus size={16} />
                </button>
              </div>

              <button
                className={styles.addToCartButton}
                onClick={handleAddToCart}
              >
                Add to Cart
              </button>

              <button className={styles.closeButton} onClick={handleClose}>
                <X size={24} />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );

  const renderConfirmedView = () => (
    <div className={styles.mainContainer}>
      <div className={styles.confirmationMessage}>
        <div className={styles.cameraIconWrapper}>
          <div className={styles.cameraFrameIcon}>
            <div className={styles.cornerTopLeft}></div>
            <div className={styles.cornerTopRight}></div>
            <p className={styles.Scan}>
              {scannedItems.length > 0
                ? "Items added to cart successfully!"
                : "Scan the barcode to start shopping"}
            </p>
            <div className={styles.cornerBottomLeft}></div>
            <div className={styles.cornerBottomRight}></div>
          </div>
        </div>
      </div>

      {/* Show scanned items if any */}
      {/* {scannedItems.length > 0 && (
        <div className={styles.scannedItemsList}>
          <h3>Items in Cart</h3>
          {scannedItems.map((item) => (
            <div key={item.id} className={styles.scannedItem}>
              <img
                src={item.image}
                alt={item.name}
                className={styles.itemImage}
              />
              <div className={styles.itemDetails}>
                <h4>{item.name}</h4>
                <p>
                  {item.quantity} x {formatCurrency(item.price)}
                </p>
              </div>
              <span className={styles.itemTotal}>
                {formatCurrency(item.totalPrice)}
              </span>
            </div>
          ))}
        </div>
      )} */}

      {/* Add Scan Button */}
      <div className={styles.buttons}>
        <button
          className={styles.startScanButton}
          onClick={handleStartScanning}
        >
          <CameraIcon size={20} />
          Scan Item
        </button>

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
