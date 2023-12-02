import React from "react";
import styles from "./TopCard.module.css";

interface ValueProps {
  name: string;
  value: string;
  change: string;
}

interface TopCardProps {
  title: string;
  value: ValueProps[];
  color: string;
  icon: string;
}

const TopCard: React.FC<TopCardProps> = ({ title, value, color, icon }) => {
  return (
    <div className={styles.topCard}>
      <div className={styles.topCardTitle}>
        <img src={icon} alt="icon" />
        <span>{title}</span>
      </div>
      <div className={styles.topCardValue}>
        {value.map((item: any) => (
          <div className={styles.valueRow}>
            <div className={styles.name}>{item.name}</div>
            <div className={styles.value}>{item.value}</div>
            <div className={styles.change}>{item.change}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopCard;
