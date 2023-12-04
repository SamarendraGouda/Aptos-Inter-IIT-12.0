import React from "react";
import styles from "./index.module.css";
import { Modal } from "antd";
import avatar from "./../../Assets/avatar.svg";
import copy from "./../../Assets/copy.svg";
import explorer from "./../../Assets/redirect.svg";
import close from "./../../Assets/close.svg";
import petra from "../../Assets/petra.svg";

const BalanceCard = () => {
  return (
    <div className={styles.balanceItem}>
      <div className={styles.balanceTitle}>
        <img src={avatar} alt="wallet" />
        <div className={styles.balanceName}>ETH</div>
        <img src={explorer} alt="explorer" />
      </div>
      <div className={styles.balanceValue}>
        <div className={styles.balanceAmount}>0.000000</div>
        <div className={styles.balanceAmountUsd}>$0.00</div>
      </div>
    </div>
  );
};

//@ts-ignore
const WalletModal = ({ visible, setVisible }) => {
  return (
    <Modal
      visible={visible}
      onOk={() => setVisible(false)}
      onCancel={() => setVisible(false)}
      closeIcon={<img src={close} alt="close" />}
      okButtonProps={{ style: { display: "none" } }}
      cancelButtonProps={{ style: { display: "none" } }}
    >
      <div className={styles.container}>
        <div className={styles.address}>
          <img src={avatar} alt="wallet" />
          <div className={styles.addressText}>0x123...567</div>
          <div className={styles.addressCopy}>
            <img src={copy} alt="copy" />
          </div>
          <div className={styles.explorer}>
            <img src={explorer} alt="explorer" />
          </div>
        </div>
        <div className={styles.balance}>
          <BalanceCard />
          <BalanceCard />
        </div>
        <div className={styles.footer}>
          Connected with <img src={petra} alt="wallet" />
        </div>
      </div>
    </Modal>
  );
};

export default WalletModal;
