import React, { useState } from "react";
import { useZxing } from "react-zxing";
import styles from "./css/Camera.module.css";

const Camera = ({ onScan, onError, onClose }) => {
  const [error, setError] = useState(null);

  const {
    ref: videoRef,
    result,
    error: zxingError,
  } = useZxing({
    onDecodeResult(result) {
      // Handle successful scan
      if (onScan) {
        onScan({
          format: result.getBarcodeFormat().toString(),
          data: result.getText(),
        });
      }
    },
    onError(error) {
      console.error("Scanning error:", error);
      setError(`Scanning error: ${error.message}`);
      if (onError) onError(error);
    },
  });

  return (
    <div className={styles.cameraContainer}>
      {error ? (
        <div className={styles.error}>
          <p>{error}</p>
          <button onClick={() => setError(null)}>Retry Scanning</button>
        </div>
      ) : (
        <>
          <video ref={videoRef} className={styles.video} />
          <div className={styles.scanOverlay}>
            <div className={styles.scanFrame}>
              <div className={styles.scanCorner}></div>
              <div className={styles.scanCorner}></div>
              <div className={styles.scanCorner}></div>
              <div className={styles.scanCorner}></div>
            </div>
            <div className={styles.scanLine}></div>
            <p className={styles.scanText}>Align barcode within frame</p>
          </div>
        </>
      )}
      {onClose && (
        <button className={styles.closeButton} onClick={onClose}>
          Close Camera
        </button>
      )}
    </div>
  );
};

export default Camera;
