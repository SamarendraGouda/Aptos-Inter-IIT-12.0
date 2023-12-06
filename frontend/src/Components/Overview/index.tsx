import React, { useEffect, useState } from "react";
import styles from "./index.module.css";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut, Pie } from "react-chartjs-2";
import ButtonLoader from "../ButtonLoader";
import { Modal } from "antd";
import close from "./../../Assets/close.svg";
import api from "../../api/api";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import toast, { Toaster } from "react-hot-toast";

import axios from "axios";

ChartJS.register(ArcElement, Tooltip, Legend);

enum Tab {
  USDC = "USDC",
  APT = "APT",
}

export const AptosLogo =
  "https://s2.coinmarketcap.com/static/img/coins/64x64/21794.png";
const UsdcLogo = "https://s2.coinmarketcap.com/static/img/coins/64x64/3408.png";
const PRICE_URL = "https://api.binance.com/api/v3/ticker/price?symbol=APTUSDT";

//@ts-ignore
const DepositModal = ({ visible, setVisible }) => {
  const { account } = useWallet();
  const [loading, setLoading] = useState<boolean>(false);
  const [depositeAmount, setDepositeAmount] = useState<number>(0);
  const handleClickDeposit = async () => {
    setLoading(true);
    const userAddress = account?.address;
    const data = {
      address: userAddress,
      coin: "USDC",
      value: depositeAmount,
      transaction_type: "Credit",
    };
    try {
      const response = await api.post("/users/wallet/", data);
      console.log(response);
      toast.success("Deposit successful", {
        style: {
          borderRadius: "8px",
          background: "#16182E",
          color: "#fff",
          padding: "20px 24px",
        },
      });
      setDepositeAmount(0);
    } catch (e) {
      console.log(e);
      toast.error("Deposit failed", {
        style: {
          borderRadius: "8px",
          background: "#16182E",
          color: "#fff",
          padding: "20px 24px",
        },
      });
      setDepositeAmount(0);
    }
    setTimeout(() => {
      setLoading(false);
      setVisible(false);
    }, 500);
  };
  return (
    <Modal
      visible={visible}
      onOk={() => {}}
      onCancel={() => setVisible(false)}
      footer={null}
      closeIcon={<img src={close} alt="" />}
    >
      <div className={styles.modalContainer}>
        <div className={styles.modalTitle}>Deposit</div>
        <div className={styles.modalContent}>
          <div className={styles.modalContentItem}>
            <input
              className={styles.modalContentItemInput}
              placeholder="0 USDC"
              value={depositeAmount}
              onChange={(e) => setDepositeAmount(Number(e.target.value))}
            />
            <img src={UsdcLogo} alt="" />
          </div>
        </div>
        <div className={styles.modalButtonGroup}>
          <button
            className={styles.modalDepositButton}
            onClick={() => handleClickDeposit()}
          >
            {loading ? <ButtonLoader /> : "Deposit"}
          </button>
        </div>
      </div>
    </Modal>
  );
};

//@ts-ignore
const WithdrawModal = ({ visible, setVisible }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const { account } = useWallet();
  const [withdrawAmount, setWithdrawAmount] = useState<number>(0);
  const handleClickWithdraw = async () => {
    setLoading(true);
    const userAddress = account?.address;
    const data = {
      address: userAddress,
      coin: "USDC",
      value: withdrawAmount,
      transaction_type: "Credit",
    };
    try {
      const response = await api.post("/users/wallet/", data);
      console.log(response);
      toast.success("Withdraw successful", {
        style: {
          borderRadius: "8px",
          background: "#16182E",
          color: "#fff",
          padding: "20px 24px",
        },
      });
      setWithdrawAmount(0);
    } catch (e) {
      console.log(e);
      toast.error("Withdraw failed", {
        style: {
          borderRadius: "8px",
          background: "#16182E",
          color: "#fff",
          padding: "20px 24px",
        },
      });
      setWithdrawAmount(0);
    }
    setTimeout(() => {
      setLoading(false);
      setVisible(false);
    }, 500);
  };
  return (
    <Modal
      visible={visible}
      onOk={() => {}}
      onCancel={() => setVisible(false)}
      footer={null}
      closeIcon={<img src={close} alt="" />}
    >
      <div className={styles.modalContainer}>
        <div className={styles.modalTitle}>Withdraw</div>
        <div className={styles.modalContent}>
          <div className={styles.modalContentItem}>
            <input
              className={styles.modalContentItemInput}
              placeholder="0 USDC"
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(Number(e.target.value))}
            />
            <img src={UsdcLogo} alt="" />
          </div>
        </div>
        <div className={styles.modalButtonGroup}>
          <button
            className={styles.modalDepositButton}
            onClick={() => handleClickWithdraw()}
          >
            {loading ? <ButtonLoader /> : "Withdraw"}
          </button>
        </div>
      </div>
    </Modal>
  );
};

const Overview = () => {
  const { account } = useWallet();
  const [selectedTab, setSelectedTab] = useState<Tab>(Tab.USDC);
  const [loading, setLoading] = useState<boolean>(false);
  const [balances, setBalances] = useState<any[]>([]);
  const [aptPrice, setAptPrice] = useState<number>(0);
  const [depositModalVisible, setDepositeModalVisible] =
    useState<boolean>(false);
  const [withdrawModalVisible, setWithdrawModalVisible] =
    useState<boolean>(false);

  const handleChangeTab = (tab: Tab) => {
    setSelectedTab(tab);
  };

  const handleDepositModal = () => {
    setDepositeModalVisible(true);
  };

  const handleWithdrawModal = () => {
    setWithdrawModalVisible(true);
  };

  const handleFaucet = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success("Faucet successful, Deposited 100USDC!", {
        style: {
          borderRadius: "8px",
          background: "#16182E",
          color: "#fff",
          padding: "20px 24px",
        },
      });
    }, 2000);
  };

  const fetchBalance = async () => {
    const userAddress = account?.address;
    const balance = api.get(
      `/users/wallet/?user_address=${userAddress as string}`
    );
    return balance;
  };

  const accountBalance = balances[0]?.value * aptPrice + balances[1]?.value;

  useEffect(() => {
    if (!account) return;
    (async () => {
      try {
        const balance = await fetchBalance();
        setBalances(balance?.data?.wallets);
      } catch (e) {
        console.log(e);
      }
    })();
  }, [account?.address]);

  useEffect(() => {
    (async () => {
      try {
        const price = await axios.get(PRICE_URL);
        setAptPrice(price?.data?.price);
      } catch (e) {
        console.log(e);
      }
    })();
  }, []);

  const totalValue = accountBalance;

  const data = {
    datasets: [
      {
        label: "My First Dataset",
        data: [300, accountBalance, 50],
        backgroundColor: ["#6802DD", "#D1AAFF", "#AAD6FF"],
        hoverOffset: 4,
        borderWidth: 0,
      },
    ],
  };

  const PieData = {
    datasets: [
      {
        label: "My First Dataset",
        data: [70, 30],
        backgroundColor: ["#6802DD", "#D1AAFF"],
        hoverOffset: 4,
        borderWidth: 0,
      },
    ],
  };

  return (
    <>
      <div>
        <Toaster position="bottom-right" reverseOrder={false} />
      </div>
      <div className={styles.overviewContainer}>
        <div className={styles.leftContainer}>
          <header className={styles.header}>Overview</header>
          <div className={styles.chartBody}>
            <Doughnut data={data} className={styles.chart} />
            <div className={styles.chartInfo}>
              <div className={styles.chartInfoItem}>
                <div className={styles.chartInfoItemTitle}>Total Value</div>
                <div className={styles.chartInfoItemValue}>
                  ${totalValue || 0.0}
                </div>
                <div className={styles.legends}>
                  <div className={styles.legend}>
                    <div className={styles.legendColor1}></div>
                    <div className={styles.legendText}>In Position</div>
                  </div>
                  <div className={styles.legend}>
                    <div className={styles.legendColor3}></div>
                    <div className={styles.legendText}>In Order</div>
                  </div>
                  <div className={styles.legend}>
                    <div className={styles.legendColor2}></div>
                    <div className={styles.legendText}>Account Bal.</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.rightContainer}>
          <div className={styles.topContainer}>
            <div className={styles.coinBalances}>
              <div
                className={
                  selectedTab === Tab.USDC
                    ? styles.usdcBalance
                    : styles.aptBalance
                }
                onClick={() => handleChangeTab(Tab.USDC)}
              >
                <div className={styles.name}>
                  <img src={UsdcLogo} alt="" />
                  USDC
                </div>
                <div className={styles.balances}>
                  <div className={styles.balance}>
                    {balances[1]?.value || 0.0}
                  </div>
                  <div className={styles.value}>
                    ${balances[1]?.value || 0.0}
                  </div>
                </div>
              </div>
              <div
                className={
                  selectedTab === Tab.APT
                    ? styles.usdcBalance
                    : styles.aptBalance
                }
                onClick={() => handleChangeTab(Tab.APT)}
              >
                <div className={styles.name}>
                  <img src={AptosLogo} alt="" />
                  APT
                </div>
                <div className={styles.balances}>
                  <div className={styles.balance}>
                    {balances[0]?.value || 0.0}
                  </div>
                  <div className={styles.value}>
                    ${balances[0]?.value * aptPrice || 0.0}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.bottomContainer}>
            <div className={styles.accountContainer}>
              <div className={styles.accountStats}>
                <div className={styles.accountTitle}>Account Balance</div>
                <div className={styles.accountItemValue}>
                  ${accountBalance || 0.0}
                </div>
              </div>
              <div className={styles.buttonGroup}>
                <button
                  className={styles.depositButton}
                  onClick={() => handleFaucet()}
                >
                  {loading ? <ButtonLoader /> : "Faucet"}
                </button>
                <button
                  className={styles.depositButton}
                  onClick={() => handleDepositModal()}
                >
                  Deposit
                </button>
                <button
                  className={styles.withdrawButton}
                  onClick={() => handleWithdrawModal()}
                >
                  Withdraw
                </button>
              </div>
            </div>
            <div className={styles.inUseContainer}>
              <div className={styles.accountStats}>
                <div className={styles.accountTitle}>In Use</div>
                <div className={styles.accountItemValue}>$0.00</div>
              </div>
              <div className={styles.buttonGroup}>
                <div className={styles.inUseChart}>
                  <Pie data={PieData} className={styles.pieChart} />
                  <div className={styles.inUseLegends}>
                    <div className={styles.legend}>
                      <div className={styles.legendColor1}></div>
                      <div className={styles.legendText}>In Position</div>
                    </div>
                    <div className={styles.legend}>
                      <div className={styles.legendColor2}></div>
                      <div className={styles.legendText}>In Order</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <DepositModal
          visible={depositModalVisible}
          setVisible={setDepositeModalVisible}
        />
        <WithdrawModal
          visible={withdrawModalVisible}
          setVisible={setWithdrawModalVisible}
        />
      </div>
    </>
  );
};

export default Overview;
