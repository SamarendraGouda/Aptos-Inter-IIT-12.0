import React from "react";
import styles from "./TradeLayout.module.css";

import TradeHeader from "../../Components/TradeHeader/TradeHeader";
import TradeWidget from "../../Components/TradeWidget/TradeWidget";
import CandleStickChart from "../../Components/CandleStickChart";
import MarketDepthChart from "../../Components/MarketDepthChart";

const TradeLayout = () => {
  const data = [
    ["Day", "", "", "", ""],
    ["Mon", 20, 28, 38, 45],
    ["Tue", 31, 38, 55, 66],
    ["Wed", 50, 55, 77, 80],
    ["Thu", 77, 77, 66, 50],
    ["Fri", 68, 66, 22, 15],
    ["Mon", 20, 28, 38, 45],
    ["Tue", 31, 38, 55, 66],
    ["Wed", 50, 55, 77, 80],
    ["Thu", 77, 77, 66, 50],
    ["Fri", 68, 66, 22, 15],
    ["Mon", 20, 28, 38, 45],
    ["Tue", 31, 38, 55, 66],
    ["Wed", 50, 55, 77, 80],
    ["Thu", 77, 77, 66, 50],
    ["Fri", 68, 66, 22, 15],
    ["Mon", 20, 28, 38, 45],
    ["Tue", 31, 38, 55, 66],
    ["Wed", 50, 55, 77, 80],
    ["Thu", 77, 77, 66, 50],
    ["Fri", 68, 66, 22, 15],
    ["Mon", 20, 28, 38, 45],
    ["Tue", 31, 38, 55, 66],
    ["Wed", 50, 55, 77, 80],
    ["Thu", 77, 77, 66, 50],
    ["Fri", 68, 66, 22, 15],
  ];

  return (
    <div className={styles.container}>
      <div className={styles.sectionLeft}>
        <TradeHeader />
        <CandleStickChart data={data} />
        <MarketDepthChart />
      </div>
      <div className={styles.sectionRight}>
        <TradeWidget />
      </div>
    </div>
  );
};

export default TradeLayout;
