import React from "react";
import styles from "./TopCardGroup.module.css";
import TopCard from "./../../Components/TopCard/TopCard";

import TopGainersIcon from "./../../Assets/badge_gainer.svg";
import TopVolumeIcon from "./../../Assets/badge_volume.svg";
import TopApyIcon from "./../../Assets/badge_apy.svg";

const data = [
  {
    name: "BTC/USDC",
    value: "$ 1,000",
    change: "+ 1.2%",
  },
  {
    name: "ETH/USDC",
    value: "$ 1,000",
    change: "+ 1.2%",
  },
  {
    name: "USDT/USDC",
    value: "$ 1,000",
    change: "+ 1.2%",
  },
];

const TopCardGroup: React.FC = () => {
  return (
    <div className={styles.cardGroup}>
      <TopCard
        title="Top Gainers"
        value={data}
        color="#E60000"
        icon={TopGainersIcon}
      />
      <TopCard
        title="Top Volume"
        value={data}
        color="#E60000"
        icon={TopVolumeIcon}
      />
      <TopCard title="Top APY" value={data} color="#E60000" icon={TopApyIcon} />
    </div>
  );
};

export default TopCardGroup;
