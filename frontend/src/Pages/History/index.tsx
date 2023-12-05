import React from "react";
import styles from "./index.module.css";
import Navbar from "../../Components/Navbar/Navbar";
import TradesTable from "../../Components/TradesTable";

enum Tabs {
  TRADES,
  ORDERS,
  DEPOSITS,
  WITHDRAWALS,
}

const History = () => {
  const [selectedTab, setSelectedTab] = React.useState(Tabs.TRADES);

  const handleTabClick = (tab: Tabs) => {
    setSelectedTab(tab);
  };
  return (
    <div>
      <Navbar />
      <div className={styles.container}>
        <div className={styles.tabs}>
          <div
            className={
              selectedTab === Tabs.TRADES ? styles.tabSelected : styles.tab
            }
            onClick={() => handleTabClick(Tabs.TRADES)}
          >
            Trades
          </div>
          <div
            className={
              selectedTab === Tabs.ORDERS ? styles.tabSelected : styles.tab
            }
            onClick={() => handleTabClick(Tabs.ORDERS)}
          >
            Orders
          </div>
          <div
            className={
              selectedTab === Tabs.DEPOSITS ? styles.tabSelected : styles.tab
            }
            onClick={() => handleTabClick(Tabs.DEPOSITS)}
          >
            Deposits
          </div>
          <div
            className={
              selectedTab === Tabs.WITHDRAWALS ? styles.tabSelected : styles.tab
            }
            onClick={() => handleTabClick(Tabs.WITHDRAWALS)}
          >
            Withdrawals
          </div>
        </div>
        <TradesTable />
      </div>
    </div>
  );
};

export default History;
