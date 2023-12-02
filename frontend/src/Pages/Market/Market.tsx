import React from "react";
import Navbar from "./../../Components/Navbar/Navbar";
import DashboardTable from "./../../Components/Table/Table";
import TopCardGroup from "./../../Layouts/TopCardGroup/TopCardGroup";

const Market = () => {
  return (
    <>
      <Navbar />
      <TopCardGroup />
      <DashboardTable />
    </>
  );
};

export default Market;
