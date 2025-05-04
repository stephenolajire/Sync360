import React, { useState, useEffect } from "react";
import { useZxing } from "react-zxing";
import styles from "./css/Camera.module.css";

const Camera = ({ onScan, onError, onClose, onImageCapture }) => {
  const [error, setError] = useState(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isScanning, setIsScanning] = useState(false);

  const {
    ref: videoRef,
    result,
    error: zxingError,
    torch,
  } = useZxing({
    onDecodeResult(result) {
      console.log("Barcode detected:", result.getText());
      setIsScanning(true);
      const capturedImage = captureFrame();
      if (onScan) {
        onScan({
          format: result.getBarcodeFormat().toString(),
          data: result.getText(),
          image: capturedImage,
        });
      }
      if (onImageCapture && capturedImage) {
        onImageCapture(capturedImage);
      }
      setIsScanning(false);
    },
    onError(error) {
      console.error("Scanning error:", error);
      setError(`Scanning error: ${error.message}`);
      if (onError) onError(error);
    },
    constraints: {
      video: {
        facingMode: "environment",
        width: { min: 640, ideal: 1280, max: 1920 },
        height: { min: 480, ideal: 720, max: 1080 },
        aspectRatio: 1.777777778,
        frameRate: { ideal: 30 },
      },
    },
    timeBetweenDecodingAttempts: 100, // Decrease time between scans
  });

  useEffect(() => {
    console.log("Video element:", videoRef.current);
    console.log("Video playing:", isVideoPlaying);

    return () => {
      if (videoRef.current?.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, [isVideoPlaying]);

  const captureFrame = () => {
    if (videoRef.current) {
      const video = videoRef.current;
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(video, 0, 0);
      return canvas.toDataURL("image/jpeg");
    }
    return null;
  };

  const handleVideoPlay = () => {
    setIsVideoPlaying(true);
    console.log("Camera started playing");
    // Try to enable torch if available
    try {
      torch.on();
    } catch (e) {
      console.log("Torch not available");
    }
  };

  return (
    <div className={styles.cameraContainer}>
      {error ? (
        <div className={styles.error}>
          <p>{error}</p>
          <button
            className={styles.retryButton}
            onClick={() => {
              setError(null);
              window.location.reload(); // Force camera restart
            }}
          >
            Retry
          </button>
        </div>
      ) : (
        <>
          <video
            ref={videoRef}
            className={styles.video}
            onPlay={handleVideoPlay}
            autoPlay
            playsInline
            muted
          />
          {isVideoPlaying && (
            <div className={styles.scanOverlay}>
              <div
                className={`${styles.scanFrame} ${
                  isScanning ? styles.scanning : ""
                }`}
              >
                <div className={`${styles.scanCorner} ${styles.topLeft}`}></div>
                <div
                  className={`${styles.scanCorner} ${styles.topRight}`}
                ></div>
                <div
                  className={`${styles.scanCorner} ${styles.bottomLeft}`}
                ></div>
                <div
                  className={`${styles.scanCorner} ${styles.bottomRight}`}
                ></div>
              </div>
              <div className={styles.scanLine}></div>
              <p className={styles.scanText}>
                {isScanning ? "Scanning..." : "Align barcode within frame"}
              </p>
            </div>
          )}
        </>
      )}
      {/* {onClose && (
        <button className={styles.closeButton} onClick={onClose}>
          Close Camera
        </button>
      )} */}
    </div>
  );
};

export default Camera;
