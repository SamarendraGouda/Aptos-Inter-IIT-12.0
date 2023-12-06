import React, { useEffect, useState, useRef } from "react";
import styles from "./TradeHeader.module.css";

//@ts-ignore
const TradeHeader = ({ bidPrice, askPrice }) => {
  const APT_LOGO =
    "https://s2.coinmarketcap.com/static/img/coins/64x64/21794.png";
  //@ts-ignore
  const calcMarketPrice = (bid, ask) => {
    if (bid === null) {
      return ask;
    } else if (ask === null) {
      return bid;
    } else {
      return (bid + ask) / 2;
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.title}>
        <img src={APT_LOGO} alt="logo" />
        APT / USDC
      </div>
      <div className={styles.price}>
        <p>${calcMarketPrice(bidPrice, askPrice)}</p>
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
