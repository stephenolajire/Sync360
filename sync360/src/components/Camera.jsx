import React, { useState } from "react";
import { useZxing } from "react-zxing";
import styles from "./css/Camera.module.css";

const Camera = ({ onScan, onError, onClose, onImageCapture }) => {
  const [error, setError] = useState(null);

  const captureFrame = () => {
    if (videoRef.current) {
      const video = videoRef.current;
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(video, 0, 0);
      const imageUrl = canvas.toDataURL("image/jpeg");
      return imageUrl;
    }
    return null;
  };

  const {
    ref: videoRef,
    result,
    error: zxingError,
  } = useZxing({
    onDecodeResult(result) {
      // Capture frame when barcode is detected
      const capturedImage = captureFrame();

      if (onScan) {
        onScan({
          format: result.getBarcodeFormat().toString(),
          data: result.getText(),
          image: capturedImage, // Include captured image in scan result
        });
      }

      if (onImageCapture && capturedImage) {
        onImageCapture(capturedImage);
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
