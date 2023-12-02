import React from "react";
import styles from "./Navbar.module.css";
import wallet from "./../../Assets/wallet.svg";
import avatar from "./../../Assets/avatar.svg";

import { useDispatch, useSelector } from "react-redux";
import { setAuth } from "../../Store/authSlice";

import { Link } from "react-router-dom";

const Navbar = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state: any) => state.user);

  const getAptosWallet = () => {
    if ("aptos" in window) {
      return window.aptos;
    } else {
      return null;
    }
  };
  
  const aptosWallet = getAptosWallet();

  const connectWallet = async () => {
    try {
      const response = await aptosWallet.connect();
      const account = await aptosWallet.account();
      dispatch(setAuth({ user: account }));
    } catch (error) {
      // { code: 4001, message: "User rejected the request."}
    }
  };

  return (
    <div className={styles.navbar}>
      <div className={styles.navListLeft}>
        <div className={styles.navItem}>
          <Link to="/market">Market</Link>
        </div>
        <div className={styles.navItem}>
          <Link to="/trade">Trade</Link>
        </div>
        <div className={styles.navItem}>
          <Link to="/portfolio">Portfolio</Link>
        </div>
      </div>
      <div className={styles.navListRight}>
        {!user ? (
          <div className={styles.wallet} onClick={() => connectWallet()}>
            <img src={wallet} alt="wallet" />
            Connect Wallet
          </div>
        ) : (
          <div className={styles.user}>
            <img src={avatar} alt="user" />
            <span>{`${user?.address?.slice(0, 6)}...${user?.address?.slice(
              -4
            )}`}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
