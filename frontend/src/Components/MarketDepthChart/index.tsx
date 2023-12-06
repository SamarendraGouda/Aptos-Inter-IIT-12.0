import React, { useState, useRef, useEffect } from "react";
import styles from "./index.module.css";
import { BiSolidUpArrow } from "react-icons/bi";
import { BiSolidDownArrow } from "react-icons/bi";

//@ts-ignore
const MarketDepthChart = ({ bidPrice, askPrice }) => {
  const orderBookSocketUrl = "ws://10.81.53.207/backend/ws/order/";
  const orderBookSocketRef = useRef<WebSocket | null>(null);
  const [bidOrders, setBidOrders] = useState([]);
  const [askOrders, setAskOrders] = useState([]);

  const bidOrdersPrice = bidOrders.map((items: any) => items);
  bidOrdersPrice.reverse();
  const bidOrderCalcAmount = bidOrdersPrice.map(
    (item: any) => (item[0] * item[1]) / 1000
  );

  const askOrdersPrice = askOrders.map((items: any) => items);
  askOrdersPrice.reverse();
  const askOrderCalcAmount = askOrdersPrice.map(
    (item: any) => (item[0] * item[1]) / 1000
  );

  const bid = bidOrderCalcAmount;
  const ask = askOrderCalcAmount;
  const max = Math.max(...bid, ...ask);
  const bidWidth = bid.map((item) => (item / max) * 100);
  const askWidth = ask.map((item) => (item / max) * 100);

  useEffect(() => {
    // Connect to the WebSocket server
    orderBookSocketRef.current = new WebSocket(orderBookSocketUrl);

    // Event listener for when the connection is open
    orderBookSocketRef.current.onopen = (event: Event) => {
      console.log("WebSocket connection opened:", event);
    };

    // Event listener for when a message is received from the server
    orderBookSocketRef.current.onmessage = (event: MessageEvent) => {
      const data = JSON.parse(event.data);
      const bidOrders = data.bid_orders;
      const askOrders = data.ask_orders;
      setBidOrders(bidOrders);
      setAskOrders(askOrders);

      // Handle the received data (price_bid and price_ask)
      console.log("Received data:", data);
    };

    // Event listener for any errors that occur
    orderBookSocketRef.current.onerror = (event: Event) => {
      console.error("WebSocket error:", event);
    };

    // Event listener for when the connection is closed
    orderBookSocketRef.current.onclose = (event: CloseEvent) => {
      console.log("WebSocket connection closed:", event);
    };

    // Clean up the WebSocket connection when the component unmounts

    return () => {
      orderBookSocketRef.current?.close();
    };
  }, []);

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
          {askOrdersPrice.map((item, index) => {
            const styling = {
              "--calculated-width": `${askWidth[index]}%`,
            };
            return (
              <div
                className={`${styles.chartRowItem} ${styles.chartRowItemAsk}`}
                // @ts-ignore
                style={styling}
              >
                <div className={styles.chartRowItemPrice}>${item[0]}</div>
                <div className={styles.chartRowItemSize}>{item[1] / 1000}</div>
                <div className={styles.chartRowItemAmount}>
                  ${askOrderCalcAmount[index]}
                </div>
              </div>
            );
          })}
          <div className={styles.currentPriceRow}>
            <div className={styles.currentPriceBid}>
              ${bidPrice} <BiSolidUpArrow />
            </div>
            <div className={styles.currentPriceAsk}>
              ${askPrice} <BiSolidDownArrow />
            </div>
          </div>
          {bidOrdersPrice.map((item, index) => {
            const styling = {
              "--calculated-width": `${bidWidth[index]}%`,
            };
            return (
              <div
                className={`${styles.chartRowItem} ${styles.chartRowItemBid}`}
                // @ts-ignore
                style={styling}
              >
                <div className={styles.chartRowItemPrice}>${item[0]}</div>
                <div className={styles.chartRowItemSize}>{item[1] / 1000}</div>
                <div className={styles.chartRowItemAmount}>
                  ${bidOrderCalcAmount[index]}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MarketDepthChart;
