import { createContext, useContext, useState } from "react";
const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
  const [scanMode, setScanMode] = useState("confirmed");
  const [scanStartTime, setScanStartTime] = useState(null);

   const handleStartScanning = () => {
     // Set scanning mode when the user clicks the scan button
     setScanMode("scanning");
     setScanStartTime(Date.now()); // Record when scanning started
   };

  // Context value
  const value = {
    scanMode,
    setScanMode,
    handleStartScanning,
    scanStartTime,
    setScanStartTime,
  };

  return (
    <GlobalContext.Provider value={value}>
      {children}
    </GlobalContext.Provider>
  );
};

// Custom hook for using the global context
export const useGlobal = () => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error('useGlobal must be used within a GlobalProvider');
  }
  return context;
};

export default GlobalContext;