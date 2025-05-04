import React from "react";
import { ArrowLeft, CheckCircle, X, Printer } from "lucide-react";
import styles from "./css/PaymentReceipt.module.css";

const PaymentReceipt = () => {
  const receiptData = {
    receiptNo: "#SM123456",
    date: "August 9, 2024, 11:35 AM",
    store: {
      name: "Jenny & Co.",
      address: "123 Market Street, Lagos, Nigeria",
      phone: "+234 800 123 4567",
      email: "support@jennyco.com",
      logo: "/api/placeholder/40/40",
    },
    items: [
      {
        name: "Coca Cola",
        description: "(Medium side)",
        quantity: 1,
        price: 500,
      },
      {
        name: "Poundo yam",
        description: "(Small side)",
        quantity: 1,
        price: 500,
      },
    ],
    vat: {
      rate: 7.5,
      amount: 75,
    },
    total: 1075,
    customer: {
      name: "Mr. Tobi Olosunde",
      phone: "08123456789",
      email: "tobi@gmail.com",
      avatar: "/api/placeholder/40/40",
    },
    paymentMethod: "Bank Transfer",
  };

  const formatCurrency = (amount) => {
    return `₦${amount}`;
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button className={styles.backButton}>
          <ArrowLeft size={24} />
        </button>
        <h5 className={styles.headerTitle}>Payment Receipt</h5>
      </div>

      <div className={styles.content}>
        <div className={styles.successSection}>
          <div className={styles.successIcon}>
            <CheckCircle size={28} color="white" />
          </div>
          <h5 className={styles.successTitle}>Sale Successful</h5>
          <p className={`${styles.thankYouText} subtext`}>
            Thank you for your purchase.
          </p>
        </div>

        <div className={styles.section}>
          <h6 className={styles.sectionTitle}>Sale summary</h6>
          <div className={styles.summaryCard}>
            <div className={styles.summaryRow}>
              <span className={styles.summaryLabel}>Receipt No</span>
              <span className={styles.summaryValue}>
                {receiptData.receiptNo}
              </span>
            </div>

            <div className={styles.summaryRow}>
              <span className={styles.summaryLabel}>Date & Time</span>
              <span className={styles.summaryValue}>{receiptData.date}</span>
            </div>
          </div>

          <div className={styles.summaryCard}>
            <div className={styles.storeRow}>
              <div>
                <span className={styles.summaryLabel}>Store</span>
                <div className={styles.summaryValue}>
                  {receiptData.store.name}
                </div>
              </div>
              <div className={styles.storeLogo}>
                <img src={receiptData.store.logo} alt="Store logo" />
              </div>
            </div>

            <div className={styles.summaryRow}>
              <span className={styles.summaryLabel}>Address</span>
              <span className={styles.summaryValue}>
                {receiptData.store.address}
              </span>
            </div>

            <div className={styles.summaryRow}>
              <span className={styles.summaryLabel}>Phone</span>
              <span className={styles.summaryValue}>
                {receiptData.store.phone}
              </span>
            </div>

            <div className={styles.summaryRow}>
              <span className={styles.summaryLabel}>Email</span>
              <span className={styles.summaryValue}>
                {receiptData.store.email}
              </span>
            </div>
          </div>

          <div className={styles.itemsCard}>
            <div className={styles.itemsHeader}>
              <span className={styles.itemColumn}>Item(s)</span>
              <span className={styles.qtyColumn}>Qty</span>
              <span className={styles.priceColumn}>Price</span>
              <span className={styles.subtotalColumn}>Sub-total</span>
            </div>

            <div className={styles.itemsList}>
              {receiptData.items.map((item, index) => (
                <div key={index} className={styles.itemRow}>
                  <div className={styles.itemColumn}>
                    <div className={styles.itemName}>{item.name}</div>
                    <div className={styles.itemDescription}>
                      {item.description}
                    </div>
                  </div>
                  <span className={styles.qtyColumn}>{item.quantity}</span>
                  <span className={styles.priceColumn}>
                    {formatCurrency(item.price)}
                  </span>
                  <span className={styles.subtotalColumn}>
                    {formatCurrency(item.quantity * item.price)}
                  </span>
                </div>
              ))}
            </div>

            <div className={styles.divider}></div>

            <div className={styles.totalSection}>
              <div className={styles.taxRow}>
                <span>VAT ({receiptData.vat.rate}%)</span>
                <span>{formatCurrency(receiptData.vat.amount)}</span>
              </div>
              <div className={styles.totalRow}>
                <span>Total</span>
                <span className={styles.totalAmount}>
                  {formatCurrency(receiptData.total)}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.section}>
          <h6 className={styles.sectionTitle}>Customer details</h6>
          <div className={styles.customerCard}>
            <div className={styles.customerInfo}>
              <div className={styles.customerAvatar}>
                <img src={receiptData.customer.avatar} alt="Customer avatar" />
              </div>
              <div className={styles.customerDetails}>
                <div className={styles.customerName}>
                  {receiptData.customer.name}
                </div>
                <div className={styles.customerContact}>
                  {receiptData.customer.phone} • {receiptData.customer.email}
                </div>
              </div>
            </div>
            <button className={styles.closeButton}>
              <X size={20} />
            </button>
          </div>
        </div>

        <div className={styles.section}>
          <h6 className={styles.sectionTitle}>Payment Method</h6>
          <div className={styles.paymentMethodCard}>
            <div className={styles.paymentMethod}>
              <div className={styles.paymentIcon}>
                <div className={styles.dollarIcon}>$</div>
              </div>
              <div className={styles.paymentName}>Bank Transfer</div>
            </div>
            <div className={styles.checkIcon}>
              <CheckCircle size={24} color="var(--success-1)" />
            </div>
          </div>
        </div>

        <div className={styles.actions}>
          <button className={styles.printButton}>
            <Printer size={20} />
            <span>Print Receipt</span>
          </button>
          <button className={styles.newSaleButton}>Start New Sale</button>
        </div>
      </div>
    </div>
  );
};

export default PaymentReceipt;
