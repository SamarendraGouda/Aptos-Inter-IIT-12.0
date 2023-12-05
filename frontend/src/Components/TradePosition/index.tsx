import React from "react";
import styles from "./index.module.css";

const TradePosition = () => {
  return (
    <div className={styles.container}>
      <div className={styles.tabs}>
        <div className={styles.tabSelected}>Open Positions</div>
        <div className={styles.tab}>Closed Positions</div>
      </div>
      <div className={styles.bottomContainer}>
        <div className={styles.positionContainer}>
          <div className={styles.positionHeader}>LONG</div>
          <div className={styles.positionAmount}>1.0000 APT</div>
        </div>
        <div className={styles.stats1}>
          <div className={styles.stat}>
            <div className={styles.statTitle}>Leverage</div>
            <div className={styles.statValue}>10x</div>
          </div>
          <div className={styles.stat}>
            <div className={styles.statTitle}>Entry Price</div>
            <div className={styles.statValue}>10x</div>
          </div>
          <div className={styles.stat}>
            <div className={styles.statTitle}>Liquidation Price</div>
            <div className={styles.statValue}>10x</div>
          </div>
        </div>
        <div className={styles.stats2}>
          <div className={styles.stat}>
            <div className={styles.statTitle}>Margin</div>
            <div className={styles.statValue}>10x</div>
          </div>
          <div className={styles.stat}>
            <div className={styles.statTitle}>PnL</div>
            <div className={styles.statValue}>10x</div>
          </div>
          <div className={styles.buttonGroup}>
          <button className={styles.closePositionButton}>Manage</button>
            <button className={styles.closePositionButton}>Close</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TradePosition;
