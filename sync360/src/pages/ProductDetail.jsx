import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MdArrowBack, MdShoppingCart, MdAdd, MdRemove } from "react-icons/md";
import styles from "./css/ProductDetail.module.css";
import { useLocation } from "react-router-dom";
import { sampleProducts } from "../data/sampledata";
import Swal from "sweetalert2";

// Sample product data with updated image URLs
const ProductDetail = () => {
  //   const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  const { productId } = useParams();
  const { state } = useLocation();
  //   const [product, setProduct] = useState(null);
  useEffect(() => {
    if (state && state.product) {
      setProduct(state.product);
      setLoading(false); // Add this line
    } else {
      // Fallback to looking in local sample data
      const foundProduct = sampleProducts.find(
        (p) => p.id === parseInt(productId)
      );
      if (foundProduct) {
        setProduct(foundProduct);
      }
      setLoading(false); // Add this line too
    }
  }, [productId, state]);

  const handleQuantityChange = (change) => {
    setQuantity((prev) => Math.max(1, prev + change));
  };

  const addToCart = async () => {
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

    // Simulate adding to cart (replace with actual cart logic)
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Show success message
    await Toast.fire({
      icon: "success",
      title: `Added ${quantity} ${product.name} to cart`,
      background: "#4CAF50",
      color: "#fff",
    });
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className={styles.notFoundContainer}>
        <h2 className={styles.notFoundTitle}>Product Not Found</h2>
        <button
          className={styles.notFoundButton}
          onClick={() => navigate("/products")}
        >
          Back to Products
        </button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <button
            className={styles.backButton}
            onClick={() => navigate("/products")}
          >
            <MdArrowBack className={styles.backIcon} />
          </button>
          <h1 className={styles.headerTitle}>Product Details</h1>
        </div>
      </div>

      <div className={styles.mainContent}>
        <div className={styles.productCard}>
          {/* Product Image */}
          <div className={styles.imageContainer}>
            <img
              src={product.image}
              alt={product.name}
              className={styles.productImage}
            />
            <div
              className={`${styles.stockBadge} ${
                product.inStock ? styles.inStock : styles.outOfStock
              }`}
            >
              {product.inStock ? "In Stock" : "Out of Stock"}
            </div>
          </div>

          {/* Product Info */}
          <div className={styles.productInfo}>
            <div className={styles.productHeader}>
              <div>
                <h1 className={styles.productTitle}>{product.name}</h1>
                <p className={styles.productCategory}>
                  {product.category} {product.gender && `• ${product.gender}`}
                </p>
              </div>
              <div className={styles.productPrice}>
                ${product.price.toFixed(2)}
              </div>
            </div>

            <div>
              <h2 className={styles.sectionTitle}>Description</h2>
              <p className={styles.descriptionText}>{product.description}</p>
            </div>

            {/* Features */}
            {product.features && (
              <div>
                <h2 className={styles.sectionTitle}>Features</h2>
                <ul className={styles.featuresList}>
                  {product.features.map((feature, index) => (
                    <li key={index} className={styles.featureItem}>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Specifications */}
            {product.specifications && (
              <div>
                <h2 className={styles.sectionTitle}>Specifications</h2>
                <div className={styles.specificationsContainer}>
                  {Object.entries(product.specifications).map(
                    ([key, value]) => (
                      <div key={key} className={styles.specificationRow}>
                        <div className={styles.specificationLabel}>{key}</div>
                        <div className={styles.specificationValue}>{value}</div>
                      </div>
                    )
                  )}
                </div>
              </div>
            )}

            {/* Add to Cart Section */}
            <div className={styles.cartSection}>
              <div className={styles.quantitySelector}>
                <button
                  className={styles.quantityButton}
                  onClick={() => handleQuantityChange(-1)}
                  disabled={!product.inStock}
                >
                  <MdRemove />
                </button>
                <span className={styles.quantityValue}>{quantity}</span>
                <button
                  className={styles.quantityButton}
                  onClick={() => handleQuantityChange(1)}
                  disabled={!product.inStock}
                >
                  <MdAdd />
                </button>
              </div>

              <button
                className={`${styles.addButton} ${
                  product.inStock
                    ? styles.addButtonActive
                    : styles.addButtonDisabled
                }`}
                onClick={addToCart}
                disabled={!product.inStock}
              >
                <MdShoppingCart className={styles.cartIcon} />
                <span>{product.inStock ? "Add to Cart" : "Out of Stock"}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
