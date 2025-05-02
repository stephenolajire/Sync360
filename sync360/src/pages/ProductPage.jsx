import React, { useState, useEffect } from "react";
import {
  MdShoppingCart,
  MdAdd,
  MdRemove,
  MdSearch,
  MdOutlineStore,
} from "react-icons/md";
import { useNavigate } from "react-router-dom";
import styles from "./css/ProductPage.module.css";
import { sampleProducts } from "../data/sampledata";
import { Link } from "react-router-dom";

const shopData = {
  name: "Urban Trends",
  category: "Boutique",
  address: "123 Fashion Street, Style City",
  image:
    "https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
};

const ProductPage = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState(sampleProducts);
  const [cart, setCart] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  // Extract unique categories from products
  const categories = [
    "All",
    ...new Set(products.map((product) => product.category)),
  ];

  // Initialize quantities state
  useEffect(() => {
    const initialQuantities = {};
    products.forEach((product) => {
      initialQuantities[product.id] = 1;
    });
    setQuantities(initialQuantities);
  }, [products]);

  // Filter products based on search query and active category
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      activeCategory === "All" || product.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  // Function to handle quantity change
  const handleQuantityChange = (productId, change) => {
    setQuantities((prev) => {
      const newQuantity = Math.max(1, (prev[productId] || 1) + change);
      return { ...prev, [productId]: newQuantity };
    });
  };

  // Function to add product to cart
  const addToCart = (product) => {
    const quantity = quantities[product.id] || 1;

    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);

      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        return [...prevCart, { ...product, quantity }];
      }
    });

    // Reset quantity after adding to cart
    setQuantities((prev) => ({ ...prev, [product.id]: 1 }));

    // Show confirmation (in a real app, you might want to use a toast notification)
    alert(`Added ${quantity} ${product.name} to cart`);
  };

  // Function to navigate to product details
  const goToProductDetails = (productId) => {
    const product = products.find((p) => p.id === productId);
    navigate(`/product/${productId}`, { state: { product } });
  };
  return (
    <div className={styles.container}>
      {/* Shop Header */}
      <div className={styles.shopHeader}>
        <img
          src={shopData.image}
          alt={shopData.name}
          className={styles.headerImage}
        />
        <div className={styles.headerContent}>
          <h1 className={styles.shopName}>{shopData.name}</h1>
          <div className={styles.shopInfo}>
            <p>{shopData.category}</p>
            <p>{shopData.address}</p>
          </div>
        </div>
      </div>

      {/* Search and Cart */}
      <div className={styles.searchContainer}>
        <div className={styles.searchInputWrapper}>
          <MdSearch className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search products..."
            className={styles.searchInput}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className={styles.cartButton}>
          <Link to="/cart">
            <MdShoppingCart />
            {cart.length > 0 && (
              <span className={styles.cartBadge}>
                {cart.reduce((total, item) => total + item.quantity, 0)}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* Categories */}
      <div className={styles.categoriesContainer}>
        <div className={styles.categoriesWrapper}>
          {categories.map((category) => (
            <button
              key={category}
              className={`${styles.categoryButton} ${
                activeCategory === category
                  ? styles.categoryButtonActive
                  : styles.categoryButtonInactive
              }`}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Product Grid */}
      <div className={styles.productsGrid}>
        {filteredProducts.map((product) => (
          <div key={product.id} className={styles.productCard}>
            <div
              className={styles.productImageContainer}
              onClick={() => goToProductDetails(product.id)}
            >
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

            <div className={styles.productInfo}>
              <h3
                className={styles.productName}
                onClick={() => goToProductDetails(product.id)}
              >
                {product.name}
              </h3>
              <p className={styles.productPrice}>${product.price.toFixed(2)}</p>
            </div>

            <div className={styles.productActions}>
              <div className={styles.quantitySelector}>
                <div className={styles.quantityControl}>
                  <button
                    className={styles.quantityButton}
                    onClick={() => handleQuantityChange(product.id, -1)}
                    disabled={!product.inStock}
                  >
                    <MdRemove />
                  </button>
                  <span className={styles.quantityValue}>
                    {quantities[product.id] || 1}
                  </span>
                  <button
                    className={styles.quantityButton}
                    onClick={() => handleQuantityChange(product.id, 1)}
                    disabled={!product.inStock}
                  >
                    <MdAdd />
                  </button>
                </div>
              </div>

              <button
                className={`${styles.addToCartButton} ${
                  product.inStock
                    ? styles.addToCartActive
                    : styles.addToCartDisabled
                }`}
                onClick={() => product.inStock && addToCart(product)}
                disabled={!product.inStock}
              >
                <MdShoppingCart />
                <span>Add to Cart</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductPage;
