import React, { useEffect, useRef, useState } from 'react';
import styles from './css/Camera.module.css';

const Camera = ({ onClose }) => {
  const videoRef = useRef(null);
  const [error, setError] = useState(null);
  const [stream, setStream] = useState(null);

  useEffect(() => {
    startCamera();
    
    // Cleanup function to stop camera when component unmounts
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const startCamera = async () => {
    try {
      const constraints = {
        video: {
          facingMode: 'environment', // Prefer back camera
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      };

      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(mediaStream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      
      setError(null);
    } catch (err) {
      console.error('Error accessing camera:', err);
      setError(`Camera access error: ${err.message}`);
    }
  };

  return (
    <div className={styles.cameraContainer}>
      {error ? (
        <div className={styles.error}>
          <p>{error}</p>
          <button onClick={startCamera}>Retry Camera Access</button>
        </div>
      ) : (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={styles.video}
        />
      )}
      <button className={styles.closeButton} onClick={onClose}>
        Close Camera
      </button>
    </div>
  );
};

export default Camera;