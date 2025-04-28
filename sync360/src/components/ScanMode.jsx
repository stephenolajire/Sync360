import React, { useState, useEffect, useRef } from "react";
import { MdCheckCircle, MdClose, MdCamera } from "react-icons/md";
import styles from "./css/ScanMode.module.css";

const ScanMode = ({ isOpen, onClose, productName, productPrice }) => {
  const [visible, setVisible] = useState(false);
  const [animation, setAnimation] = useState("");
  const [cameraActive, setCameraActive] = useState(false);
  const [scanning, setScanning] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

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

  const startCamera = async () => {
    try {
      const constraints = {
        video: { facingMode: "environment" }, // Use the back camera if available
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play();
          setCameraActive(true);
          setScanning(true);
        };
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      alert(
        "Unable to access camera. Please make sure you've granted camera permissions."
      );
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach((track) => track.stop());
      videoRef.current.srcObject = null;
      setCameraActive(false);
      setScanning(false);
    }
  };

  // This would be where you'd implement your actual barcode scanning logic
  const scanBarcode = () => {
    if (!scanning || !canvasRef.current || !videoRef.current) return;

    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    // Match canvas size to video
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;

    // Draw the current video frame to the canvas
    context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

    // Here you would add your barcode detection logic
    // For example, with a library like quagga.js, zbar.wasm, etc.

    // For this example, we'll just simulate a successful scan after a few seconds
    // In a real app, you'd replace this with actual barcode detection
    setTimeout(() => {
      if (scanning) {
        stopCamera();
        // Simulate finding a product
        onClose();
      }
    }, 3000);
  };

  useEffect(() => {
    // Set up a scanning interval when the camera is active
    let scanInterval;
    if (scanning) {
      scanInterval = setInterval(scanBarcode, 500); // Check for barcodes every 500ms
    }

    return () => {
      if (scanInterval) clearInterval(scanInterval);
    };
  }, [scanning]);

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
                <>
                  <video
                    ref={videoRef}
                    className={styles.cameraView}
                    playsInline
                  />
                  <canvas ref={canvasRef} className={styles.hiddenCanvas} />
                  <div className={styles.scanOverlay}>
                    <div className={styles.scanLine}></div>
                  </div>
                </>
              ) : (
                <div className={styles.cameraPlaceholder}>
                  <MdCamera className={styles.cameraIcon} />
                  <p>Camera access required</p>
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
