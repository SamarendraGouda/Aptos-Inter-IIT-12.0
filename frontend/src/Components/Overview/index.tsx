import React, { useState } from "react";
import styles from "./index.module.css";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut, Pie } from "react-chartjs-2";
import ButtonLoader from "../ButtonLoader";
import { Modal } from "antd";
import close from "./../../Assets/close.svg";

ChartJS.register(ArcElement, Tooltip, Legend);

enum Tab {
  USDC = "USDC",
  APT = "APT",
}

export const AptosLogo =
  "https://s2.coinmarketcap.com/static/img/coins/64x64/21794.png";
const UsdcLogo = "https://s2.coinmarketcap.com/static/img/coins/64x64/3408.png";

//@ts-ignore
const DepositModal = ({ visible, setVisible }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const handleClickDeposit = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setVisible(false);
    }, 2000);
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
  const handleClickWithdraw = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setVisible(false);
    }, 2000);
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
  const [selectedTab, setSelectedTab] = useState<Tab>(Tab.USDC);
  const [loading, setLoading] = useState<boolean>(false);
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
    }, 2000);
  };
  const data = {
    datasets: [
      {
        label: "My First Dataset",
        data: [300, 50, 100],
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
    <div className={styles.overviewContainer}>
      <div className={styles.leftContainer}>
        <header className={styles.header}>Overview</header>
        <div className={styles.chartBody}>
          <Doughnut data={data} className={styles.chart} />
          <div className={styles.chartInfo}>
            <div className={styles.chartInfoItem}>
              <div className={styles.chartInfoItemTitle}>Total Value</div>
              <div className={styles.chartInfoItemValue}>$0.00</div>
              <div className={styles.legends}>
                <div className={styles.legend}>
                  <div className={styles.legendColor1}></div>
                  <div className={styles.legendText}>In Position</div>
                </div>
                <div className={styles.legend}>
                  <div className={styles.legendColor2}></div>
                  <div className={styles.legendText}>In Liquidity</div>
                </div>
                <div className={styles.legend}>
                  <div className={styles.legendColor3}></div>
                  <div className={styles.legendText}>In Order</div>
                </div>
                <div className={styles.legend}>
                  <div className={styles.legendColor4}></div>
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
                <div className={styles.balance}>0.000000</div>
                <div className={styles.value}>0.000000</div>
              </div>
            </div>
            <div
              className={
                selectedTab === Tab.APT ? styles.usdcBalance : styles.aptBalance
              }
              onClick={() => handleChangeTab(Tab.APT)}
            >
              <div className={styles.name}>
                <img src={AptosLogo} alt="" />
                APT
              </div>
              <div className={styles.balances}>
                <div className={styles.balance}>0.000000</div>
                <div className={styles.value}>0.000000</div>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.bottomContainer}>
          <div className={styles.accountContainer}>
            <div className={styles.accountStats}>
              <div className={styles.accountTitle}>Account Balance</div>
              <div className={styles.accountItemValue}>$0.00</div>
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
  );
};

export default Overview;
