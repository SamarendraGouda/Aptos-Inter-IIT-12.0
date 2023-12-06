import React from "react";
import styles from "./index.module.css";

import { Table } from "antd";
import {
  BITCOIN_LOGO,
  ETHEREUM_LOGO,
  TETHER_LOGO,
} from "../../constants/constants";
import type { ColumnsType, TableProps } from "antd/es/table";

interface DataType {
  key: React.Key;
  logo?: any;
  name: string;
  price: string;
  change_24h: string;
  high_24h: string;
  low_24h: string;
  volume_24h: string;
  openInterest: string;
}

const columns: ColumnsType<DataType> = [
  {
    title: "Asset",
    dataIndex: "name",
    render: (text, record) => (
      <div className={styles.tableItem}>
        <img src={record.logo} alt={record.name} />
        <span>{text}</span>
      </div>
    ),
  },
  {
    title: "Total",
    dataIndex: "price",
  },
  {
    title: "Pair",
    dataIndex: "change_24h",
  },
  {
    title: "In Position",
    dataIndex: "high_24h",
  },
  {
    title: "In Liquidity",
    dataIndex: "low_24h",
  },
  {
    title: "In Order",
    dataIndex: "volume_24h",
  },
];

const data = [
  {
    key: "1",
    logo: BITCOIN_LOGO,
    name: "BTC/USDC",
    price: "2058.8",
    change_24h: "+3.27%",
    high_24h: "2059.0",
    low_24h: "2058.8",
    volume_24h: "$1.80M",
    openInterest: "$179.0M",
  },
  {
    key: "2",
    logo: ETHEREUM_LOGO,
    name: "ETH/USDC",
    price: "2058.8",
    change_24h: "+3.27%",
    high_24h: "2059.0",
    low_24h: "2058.8",
    volume_24h: "$1.80M",
    openInterest: "$179.0M",
  },
  {
    key: "3",
    logo: TETHER_LOGO,
    name: "USDT/USDC",
    price: "2058.8",
    change_24h: "+3.27%",
    high_24h: "2059.0",
    low_24h: "2058.8",
    volume_24h: "$1.80M",
    openInterest: "$179.0M",
  },
];

const onChange: TableProps<DataType>["onChange"] = (
  pagination,
  filters,
  sorter,
  extra
) => {
  console.log("params", pagination, filters, sorter, extra);
};

const AssetTable = () => {
  return (
    <div className={styles.tableContainer}>
      <div className={styles.tableTitle}>Asset Allocation</div>
      <Table
        columns={columns}
        dataSource={data}
        onChange={onChange}
        className={styles.table}
      />
    </div>
  );
};

export default AssetTable;
