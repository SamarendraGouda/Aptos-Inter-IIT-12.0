import React from "react";
import styles from "./index.module.css";

const MarketDepthChart = () => {
  const data = [1, 2, 3, 4, 5, 6, 7, 8];
  const bid = [8, 7, 6, 5, 4, 3, 2, 1];
  const ask = [1, 2, 3, 4, 6, 7, 8, 9];
  const max = Math.max(...bid, ...ask);
  const bidWidth = bid.map((item) => (item / max) * 100);
  const askWidth = ask.map((item) => (item / max) * 100);

  return (
    <div className={styles.container}>
      <div className={styles.title}>Market Depth</div>
      <div className={styles.legend}>
        <p>Price</p>
        <p>Size</p>
        <p>Amount</p>
      </div>
      <div className={styles.chart}>
        <div className={styles.chartRow}>
          {data.map((item, index) => {
            const styling = {
              "--calculated-width": `${bidWidth[index]}%`,
            };
            return (
              <div
                className={`${styles.chartRowItem} ${styles.chartRowItemAsk}`}
                // @ts-ignore
                style={styling}
              >
                <div className={styles.chartRowItemPrice}>$38,000</div>
                <div className={styles.chartRowItemSize}>0.1</div>
                <div className={styles.chartRowItemAmount}>$3,800</div>
              </div>
            );
          })}
          <div className={styles.currentPriceRow}>
            <div className={styles.currentPrice}>$38,000</div>
            <div className={styles.currentPriceSize}>0.1</div>
          </div>
          {data.map((item, index) => {
            const styling = {
              "--calculated-width": `${askWidth[index]}%`,
            };
            return (
              <div
                className={`${styles.chartRowItem} ${styles.chartRowItemBid}`}
                // @ts-ignore
                style={styling}
              >
                <div className={styles.chartRowItemPrice}>$38,000</div>
                <div className={styles.chartRowItemSize}>0.1</div>
                <div className={styles.chartRowItemAmount}>$3,800</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MarketDepthChart;
