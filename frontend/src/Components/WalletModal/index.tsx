import React, { useEffect } from "react";
import styles from "./index.module.css";
import { Modal } from "antd";
import avatar from "./../../Assets/avatar.svg";
import copy from "./../../Assets/copy.svg";
import explorer from "./../../Assets/redirect.svg";
import close from "./../../Assets/close.svg";
import petra from "../../Assets/petra.svg";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { CoinClient, AptosClient, MaybeHexString } from "aptos";
import axios from "axios";
import { AptosLogo } from "../Overview";

const NODE_URL = "https://fullnode.devnet.aptoslabs.com";
const PRICE_URL = "https://api.binance.com/api/v3/ticker/price?symbol=APTUSDT";

//@ts-ignore
const BalanceCard = ({ balance }) => {
  const [balanceUsd, setBalanceUsd] = React.useState<any>();
  useEffect(() => {
    const interval = setInterval(() => {
      axios.get(PRICE_URL).then((response) => {
        const price = response.data.price;
        const balanceUsd = (balance * Number(price)).toPrecision(5);
        setBalanceUsd(balanceUsd);
      });
    }, 1000);
    return () => clearInterval(interval);
  });
  return (
    <div className={styles.balanceItem}>
      <div className={styles.balanceTitle}>
        <img
          src={AptosLogo}
          alt="wallet"
          style={{
            width: "36px",
            height: "36px",
          }}
        />
        <div className={styles.balanceName}>APT</div>
        <img src={explorer} alt="explorer" />
      </div>
      <div className={styles.balanceValue}>
        <div className={styles.balanceAmount}>{balance}</div>
        <div className={styles.balanceAmountUsd}>{`$${balanceUsd}`}</div>
      </div>
    </div>
  );
};

//@ts-ignore
const WalletModal = ({ visible, setVisible }) => {
  const { account } = useWallet();
  const client = new AptosClient(NODE_URL);
  const coinClient = new CoinClient(client);
  const [balance, setBalance] = React.useState(0);

  const getWalletBalance = async () => {
    if (!account) return 0;
    const balance = await coinClient.checkBalance(
      account?.address as MaybeHexString
    );
    return balance;
  };
  const Balance = Promise.resolve(getWalletBalance()).then((value) => {
    const balance = (Number(BigInt(value).toString()) / 10 ** 8).toPrecision(5);
    setBalance(Number(balance));
  });

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
          <div className={styles.addressText}>{`${account?.address?.slice(
            0,
            6
          )}...${account?.address.slice(-5, -1)}`}</div>
          <div className={styles.addressCopy}>
            <img src={copy} alt="copy" />
          </div>
          <div className={styles.explorer}>
            <img src={explorer} alt="explorer" />
          </div>
        </div>
        <div className={styles.balance}>
          <BalanceCard balance={balance} />
        </div>
        <div className={styles.footer}>
          Connected with <img src={petra} alt="wallet" />
        </div>
      </div>
    </Modal>
  );
};

export default WalletModal;
