import React from "react";
import styles from "./index.module.css";

interface ValueProps {
  name?: string;
  value?: string;
  change?: string;
}

const LiquidityCard: React.FC<ValueProps> = ({ name, value, change }) => {
  return (
    <div className={styles.container}>
      <div className={styles.topContainer}>
        <div className={styles.name}>ETH/USDC</div>
        <div className={styles.value}>{value}</div>
      </div>
      <div className={styles.bottomContainer}>
        <div className={styles.subContainer}>
            <div className={styles.subName}>In Position</div>
            <div className={styles.subValue}>0.000000</div>
        </div>
      </div>
    </div>
  );
};

export default LiquidityCard;
