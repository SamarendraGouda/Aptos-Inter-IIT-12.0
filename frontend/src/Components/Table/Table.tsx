import React from "react";
import styles from "./Table.module.css";
import { Table } from "antd";
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

const BITCOIN_LOGO =
  "https://s2.coinmarketcap.com/static/img/coins/64x64/1.png";
const ETHEREUM_LOGO =
  "https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png";
const TETHER_LOGO =
  "https://s2.coinmarketcap.com/static/img/coins/64x64/825.png";

const columns: ColumnsType<DataType> = [
  {
    title: "Trading Pair",
    dataIndex: "name",
    render: (text, record) => (
      <div className={styles.tableItem}>
        <img src={record.logo} alt={record.name} />
        <span>{text}</span>
      </div>
    ),
  },
  {
    title: "Price",
    dataIndex: "price",
  },
  {
    title: "24H Change",
    dataIndex: "change_24h",
    render: (text, record) => (
      <div
        className={
          text.includes("+") ? styles.changePositive : styles.changeNegative
        }
      >
        <span>{text}</span>
      </div>
    ),
  },
  {
    title: "24H High",
    dataIndex: "high_24h",
  },
  {
    title: "24H Low",
    dataIndex: "low_24h",
  },
  {
    title: "24H Volume",
    dataIndex: "volume_24h",
  },
  {
    title: "Open Interest",
    dataIndex: "openInterest",
  },
  {
    title: "Action",
    dataIndex: "name",
    render: (text, record) => (
      <button
        className={styles.tradeButton}
        onClick={() => {
          console.log(record);
        }}
      >
        Trade
      </button>
    ),
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
    change_24h: "-3.27%",
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
    change_24h: "-3.27%",
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

const DashboardTable: React.FC = () => (
  <Table
    columns={columns}
    dataSource={data}
    onChange={onChange}
    className={styles.table}
  />
);

export default DashboardTable;
