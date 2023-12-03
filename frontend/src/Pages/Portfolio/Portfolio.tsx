import React from "react";
import Navbar from "../../Components/Navbar/Navbar";
import Overview from "../../Components/Overview";
import AssetTable from "../../Components/AssetTable";

const Portfolio = () => {
  return (
    <div>
      <Navbar />
      <Overview />
      <AssetTable />
    </div>
  );
};

export default Portfolio;
