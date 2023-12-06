import styles from "./NotFound.module.css";
import Navbar from "../../Components/Navbar/Navbar";

const NotFound = () => {
  return (
    <>
      <Navbar />
      <div className={styles.notFound}>
        <h1>404</h1>
        <h2>Page Not Found</h2>
      </div>
    </>
  );
};

export default NotFound;
