import styles from "./index.module.css";
import heroImage from "./../../Assets/hero.png";
import ButtonLoader from "../ButtonLoader";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const handleButtonClick = () => {
    navigate("/trade");
  };

  useEffect(() => {
    setLoading(true);
    setInterval(() => {
      setLoading(false);
    }, 1000);
  }, []);

  return (
    <div className={styles.container}>
      {loading ? (
        <ButtonLoader size={50} />
      ) : (
        <div className={styles.topContainer}>
          <img src={heroImage} alt="" />
          <div className={styles.heroText}>
            <div className={styles.header}>Futures Trading, Decentralized</div>
            <div className={styles.text}>
              ZeroDayFutures is a DeFi trading platform that let's you trade
              perpetuals that expire in 24hrs, in addition to Market, Limit and
              Margin Trading. Our instant settlement algorithm can handle
              settlement of multiple positions within seconds.
            </div>
            <button onClick={handleButtonClick}>Trade Now</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Hero;
