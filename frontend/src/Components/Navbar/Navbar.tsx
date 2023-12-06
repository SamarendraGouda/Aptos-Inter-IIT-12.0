import React from "react";
import styles from "./Navbar.module.css";
import wallet from "./../../Assets/wallet.svg";
import WalletModal from "../WalletModal";
import "@aptos-labs/wallet-adapter-ant-design/dist/index.css";

import { Link } from "react-router-dom";
import { WalletSelector } from "@aptos-labs/wallet-adapter-ant-design";

const Navbar = () => {
  const [visible, setVisible] = React.useState(false);

  return (
    <div className={styles.navbar}>
      <div className={styles.navListLeft}>
        <div className={styles.navItem}>
          <Link to="/">Home</Link>
        </div>
        <div className={styles.navItem}>
          <Link to="/market">Market</Link>
        </div>
        <div className={styles.navItem}>
          <Link to="/trade">Trade</Link>
        </div>
        <div className={styles.navItem}>
          <Link to="/portfolio">Portfolio</Link>
        </div>
        <div className={styles.navItem}>
          <Link to="/history">History</Link>
        </div>
      </div>
      <div className={styles.navListRight}>
        <div onClick={() => setVisible(true)}>
          <img src={wallet} alt="wallet" />
        </div>
        <WalletSelector />
      </div>
      <WalletModal visible={visible} setVisible={setVisible} />
    </div>
  );
};

export default Navbar;
