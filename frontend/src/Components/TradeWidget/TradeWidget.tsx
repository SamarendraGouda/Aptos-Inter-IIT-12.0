import React from "react";
import styles from "./TradeWidget.module.css";
import { Slider } from "@mui/material";

const TradeWidget = () => {
  const [leverage, setLeverage] = React.useState(1);
  const marks = [
    {
      value: 1,
      label: "1x",
    },
    {
      value: 5,
      label: "5x",
    },
    {
      value: 10,
      label: "10x",
    },
    {
      value: 15,
      label: "15x",
    },
    {
      value: 20,
      label: "20x",
    },
    {
      value: 30,
      label: "30x",
    },
    {
      value: 40,
      label: "40x",
    },
    {
      value: 50,
      label: "50x",
    },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.tabs}>
        <div className={styles.tabSelected}>Long</div>
        <div className={styles.tab}>Short</div>
        <div className={styles.tab}>Swap</div>
      </div>
      <div className={styles.orderTabs}>
        <div className={styles.orderTabSelected}>Market</div>
        <div className={styles.orderTab}>Limit</div>
      </div>
      <div className={styles.orderForm}>
        <div className={styles.orderFormRow}>
          <div className={styles.rowLabel}>
            <div className={styles.orderFormLabel}>Pay</div>
            <div className={styles.orderFormLabel}>Balance</div>
          </div>
          <div className={styles.rowLabel}>
            <input className={styles.inputBox} placeholder="0"></input>
            <div className={styles.currency}>
              <img
                src="https://s2.coinmarketcap.com/static/img/coins/64x64/1.png"
                alt="logo"
              />
              <span>BTC</span>
            </div>
          </div>
        </div>
        <div className={styles.orderFormRow}>
          <div className={styles.rowLabel}>
            <div className={styles.orderFormLabel}>Long</div>
            <div className={styles.orderFormLabel}>Leverage: {leverage}x</div>
          </div>
          <div className={styles.rowLabel}>
            <input className={styles.inputBox} placeholder="0"></input>
            <div className={styles.currency}>
              <img
                src="https://s2.coinmarketcap.com/static/img/coins/64x64/3408.png"
                alt="logo"
              />
              <span>USDC</span>
            </div>
          </div>
        </div>
        <div className={styles.leverageSlider}>
          <p>Leverage Slider</p>
          <Slider
            className={styles.slider}
            defaultValue={1}
            value={leverage}
            onChange={(e, value) => setLeverage(value as number)}
            aria-label="Default"
            valueLabelDisplay="off"
            marks={marks}
            min={1}
            max={50}
            sx={{ color: "#6802DD" }}
          />
        </div>
        <div className={styles.tradeDetails}>
          <div className={styles.tradeDetail}>
            <div className={styles.tradeDetailLabel}>Total Margin</div>
            <div className={styles.tradeDetailValue}>$0.00</div>
          </div>
          <div className={styles.tradeDetail}>
            <div className={styles.tradeDetailLabel}>Estd. Trade Value</div>
            <div className={styles.tradeDetailValue}>$0.00</div>
          </div>
          <div className={styles.tradeDetail}>
            <div className={styles.tradeDetailLabel}>Entry Price</div>
            <div className={styles.tradeDetailValue}>$0.00</div>
          </div>
          <div className={styles.tradeDetail}>
            <div className={styles.tradeDetailLabel}>Leverage</div>
            <div className={styles.tradeDetailValue}>2x</div>
          </div>
          <div className={styles.tradeDetail}>
            <div className={styles.tradeDetailLabel}>Liquidation Price</div>
            <div className={styles.tradeDetailValue}>$0.00</div>
          </div>
        </div>

        <div className={styles.tradeButton}>Trade</div>
      </div>
    </div>
  );
};

export default TradeWidget;
