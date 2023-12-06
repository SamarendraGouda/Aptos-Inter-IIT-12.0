import React, { useEffect } from "react";
import styles from "./index.module.css";
import Navbar from "../../Components/Navbar/Navbar";
import TradesTable from "../../Components/TradesTable";
import DepositsTable from "../../Components/DepositesTable";
import OrdersTable from "../../Components/OrdersTable";
import api from "../../api/api";
import { useWallet } from "@aptos-labs/wallet-adapter-react";

enum Tabs {
  TRADES,
  ORDERS,
  DEPOSITS,
  WITHDRAWALS,
}

const History = () => {
  const [selectedTab, setSelectedTab] = React.useState(Tabs.TRADES);
  const [walletHistory, setWalletHistory] = React.useState([]);
  const [walletDepositeHistory, setWalletDepositeHistory] = React.useState([]);
  const [walletWithdrawalHistory, setWalletWithdrawalHistory] = React.useState(
    []
  );
  const { account } = useWallet();

  const handleTabClick = (tab: Tabs) => {
    setSelectedTab(tab);
  };

  const getWalletHistory = async () => {
    const response = await api.get(
      `/users/transaction/?user_address=${account?.address}`
    );
    return response;
  };

  useEffect(() => {
    if (!account?.address) return;
    (async () => {
      try {
        const res = await getWalletHistory();
        console.log(res);
        setWalletHistory(res?.data?.transactions);
        //filter deposit history
        const depositHistory = res?.data?.transactions.filter(
          (transaction: any) => transaction?.type === "Credit"
        );
        depositHistory.reverse();
        setWalletDepositeHistory(depositHistory);
        //filter withdrawal history
        const withdrawalHistory = res?.data?.transactions.filter(
          (transaction: any) => transaction?.type === "Debit"
        );
        withdrawalHistory.reverse();
        setWalletWithdrawalHistory(withdrawalHistory);
      } catch (err) {
        console.log(err);
      }
    })();
  }, [account?.address]);

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
        {selectedTab === Tabs.TRADES && <TradesTable />}
        {selectedTab === Tabs.ORDERS && <OrdersTable />}
        {selectedTab === Tabs.DEPOSITS && (
          <DepositsTable data={walletDepositeHistory} />
        )}
        {selectedTab === Tabs.WITHDRAWALS && (
          <DepositsTable data={walletWithdrawalHistory} />
        )}
      </div>
    </div>
  );
};

export default History;
