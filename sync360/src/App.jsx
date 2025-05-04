import React, { useState, useEffect } from "react";
import Layout from "./layout/Layout";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ShoppingModePopup from "./components/ShoppingModePopUp";
import BarcodeScannerPage from "./pages/BarCodeScanner";
import ProductPage from "./pages/ProductPage";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import ShippingDetails from "./pages/ShippingDetails";
import PaymentReceipt from "./pages/PaymentReceipt";

function App() {
  const [showModal, setShowModal] = useState(true);
  const [shoppingMode, setShoppingMode] = useState(null);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // Check if user already has a shopping mode preference
    const savedMode = localStorage.getItem("shoppingMode");
    if (savedMode) {
      setShoppingMode(savedMode);
      setShowModal(false);
      setShowContent(true);
    } else {
      // Show only popup on first visit
      setShowModal(true);
      setShowContent(false);
    }
  }, []);

  const handleModeSelection = (mode) => {
    setShoppingMode(mode);
    localStorage.setItem("shoppingMode", mode);
    setShowModal(false);
    setShowContent(true);
  };

  return (
    <>
      {/* Show popup only when needed */}
      <ShoppingModePopup
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setShowContent(true);
        }}
        onSelectMode={handleModeSelection}
      />

      {/* Only render the app content after mode selection */}
      {showContent && (
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              {/* Different routes based on shopping mode */}
              {shoppingMode === "in-store" ? (
                <Route index element={<BarcodeScannerPage />} />
              ) : (
                <Route index element={<ProductPage />} />
              )}
              <Route path="products" element={<ProductPage />} />
              <Route path="scan" element={<BarcodeScannerPage />} />
              <Route path="product/:id" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/shipping-details" element={<ShippingDetails />} />
              <Route path="/receipt" element={<PaymentReceipt />} />
            </Route>
          </Routes>
        </BrowserRouter>
      )}
    </>
  );
}

export default App;
