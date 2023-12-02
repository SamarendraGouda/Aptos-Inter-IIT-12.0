import React from "react";
import styles from "./TradeHeader.module.css";

const TradeHeader = () => {
  const BITCOIN_LOGO =
    "https://s2.coinmarketcap.com/static/img/coins/64x64/1.png";
  return (
    <div className={styles.container}>
      <div className={styles.title}>
        <img src={BITCOIN_LOGO} alt="logo" />
        BTC / USDC
      </div>
      <div className={styles.price}>
        <p>$38,000</p>
      </div>
      <div className={styles.change}>
        <p>24H Change</p>
        <p className={styles.changeValue}>- 2.5%</p>
      </div>
      <div className={styles.change}>
        <p>24H High</p>
        <p className={styles.value}>$38,041</p>
      </div>
      <div className={styles.change}>
        <p>24H Low</p>
        <p className={styles.value}>$37,993</p>
      </div>
    </div>
  );
};

export default TradeHeader;
