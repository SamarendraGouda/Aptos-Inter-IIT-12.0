import React from "react";
import styles from "./index.module.css";
import Navbar from "../../Components/Navbar/Navbar";

const History = () => {
  return (
    <div>
      <Navbar />
      <div className={styles.container}>
        <div className={styles.tabs}>
          <div className={styles.tabSelected}>All</div>
          <div className={styles.tab}>Deposits</div>
          <div className={styles.tab}>Withdrawals</div>
          <div className={styles.tab}>Trades</div>
          <div className={styles.tab}>Rewards</div>
          <div className={styles.tab}>Referrals</div>
        </div>
      </div>
    </div>
  );
};

export default History;
