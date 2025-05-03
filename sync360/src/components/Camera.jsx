import React, { useEffect, useRef, useState } from "react";
import styles from "./css/Camera.module.css";

const Camera = ({ onScan, onError, onClose }) => {
  const videoRef = useRef(null);
  const [error, setError] = useState(null);
  const [stream, setStream] = useState(null);

  useEffect(() => {
    startCamera();

    // Cleanup function to stop camera when component unmounts
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

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

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }

      setError(null);

      // In a real app, we would implement barcode scanning logic here
      // For demo, we can simulate a scan after a delay
      simulateScan();
    } catch (err) {
      console.error("Error accessing camera:", err);
      setError(`Camera access error: ${err.message}`);
      if (onError) onError(err);
    }
  };

  const simulateScan = () => {
    // Simulate successful scan after 3 seconds
    setTimeout(() => {
      if (onScan) {
        onScan({
          format: "EAN-13",
          data: "5449000054227", // Coca-Cola barcode from the image
        });
      }
    }, 3000);
  };

  return (
    <div className={styles.cameraContainer}>
      {error ? (
        <div className={styles.error}>
          <p>{error}</p>
          <button onClick={startCamera}>Retry Camera Access</button>
        </div>
      ) : (
        <>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className={styles.video}
          />
          <div className={styles.scanOverlay}>
            <div className={styles.scanLine}></div>
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
