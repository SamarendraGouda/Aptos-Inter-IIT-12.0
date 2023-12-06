import { useState, useRef, useEffect } from "react";
import styles from "./TradeLayout.module.css";

import TradeHeader from "../../Components/TradeHeader/TradeHeader";
import TradeWidget from "../../Components/TradeWidget/TradeWidget";
import CandleStickChart from "../../Components/CandleStickChart";
import MarketDepthChart from "../../Components/MarketDepthChart";
import TradePosition from "../../Components/TradePosition";

import { priceWsUrl } from "../../api/ws";

const TradeLayout = () => {
  const priceSocketRef = useRef<WebSocket | null>(null);
  const [bidPrice, setBidPrice] = useState(0);
  const [askPrice, setAskPrice] = useState(0);

  useEffect(() => {
    priceSocketRef.current = new WebSocket(priceWsUrl);
    priceSocketRef.current.onopen = (event: Event) => {
      console.log("WebSocket connection opened:", event);
    };

    priceSocketRef.current.onmessage = (event: MessageEvent) => {
      const data = JSON.parse(event.data);
      setBidPrice(data.price_bid);
      setAskPrice(data.price_ask);
    };

    priceSocketRef.current.onerror = (event: Event) => {
      console.error("WebSocket error:", event);
    };

    priceSocketRef.current.onclose = (event: CloseEvent) => {
      console.log("WebSocket connection closed:", event);
    };

    return () => {
      priceSocketRef.current?.close();
    };
  });

  return (
    <div className={styles.container}>
      <div className={styles.subSection}>
        <div className={styles.sectionLeft}>
          <div className={styles.subLeft}>
            <div className={styles.charts}>
              <TradeHeader bidPrice={bidPrice} askPrice={askPrice} />
              <div className={styles.subChart}>
                <CandleStickChart />
              </div>
            </div>
            <MarketDepthChart bidPrice={bidPrice} askPrice={askPrice} />
          </div>
          <div className={styles.positions}>
            <TradePosition />
          </div>
        </div>
        <div className={styles.sectionRight}>
          <TradeWidget />
        </div>
      </div>
    </div>
  );
};

export default TradeLayout;
