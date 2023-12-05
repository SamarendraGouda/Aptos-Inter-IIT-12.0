import React from "react";
import styles from "./index.module.css";
import { Table } from "antd";
import type { ColumnsType, TableProps } from "antd/es/table";
import explorer from "../../Assets/redirect.svg";

enum Status {
  SUCCESS = "SUCCESS",
  FAILED = "FAILED",
}

enum Types {
  MARKET = "Market",
  LIMIT = "Limit",
  STOP = "Stop",
  STOP_LIMIT = "Stop Limit",
}

interface DataType {
  key: React.Key;
  time: string;
  logo?: any;
  name: string;
  amount: number;
  price: string;
  type: Types;
  status: Status;
  high_24h: string;
  low_24h: string;
  volume_24h: string;
  openInterest: string;
}

const USDC_LOGO =
  "https://s2.coinmarketcap.com/static/img/coins/64x64/3408.png";
const APT_LOGO =
  "https://s2.coinmarketcap.com/static/img/coins/64x64/21794.png";

const columns: ColumnsType<DataType> = [
  {
    title: "Timestamp",
    dataIndex: "time",
  },
  {
    title: "Token",
    dataIndex: "name",
    render: (text, record) => (
      <div className={styles.tableItem}>
        <img src={record.logo} alt={record.name} />
        <span>{text}</span>
      </div>
    ),
  },
  {
    title: "Amount",
    dataIndex: "amount",
  },
  {
    title: "Transaction Status",
    dataIndex: "status",
    render: (text, record) => (
      <div
        className={text === Status.SUCCESS ? styles.sideLong : styles.sideShort}
      >
        <span>{text}</span>
      </div>
    ),
  },
  {
    title: "Explorer",
    dataIndex: "time",
    render: (text, record) => (
      <div className={styles.tableItem}>
        <img src={explorer} alt={record.name} />
        <span>View on Explorer</span>
      </div>
    ),
  },
];

const data = [
  {
    key: "1",
    time: "2021-04-01 12:00:00",
    logo: USDC_LOGO,
    name: "USDC",
    price: "2058.8",
    amount: 200,
    type: Types.MARKET,
    status: Status.SUCCESS,
    change_24h: "+3.27%",
    high_24h: "2059.0",
    low_24h: "2058.8",
    volume_24h: "$1.80M",
    openInterest: "$179.0M",
  },
  {
    key: "2",
    time: "2021-04-01 12:00:00",
    logo: APT_LOGO,
    name: "APT",
    price: "2058.8",
    amount: 200,
    type: Types.MARKET,
    status: Status.SUCCESS,
    change_24h: "-3.27%",
    high_24h: "2059.0",
    low_24h: "2058.8",
    volume_24h: "$1.80M",
    openInterest: "$179.0M",
  },
  {
    key: "3",
    time: "2021-04-01 12:00:00",
    logo: USDC_LOGO,
    name: "USDC",
    price: "2058.8",
    amount: 200,
    type: Types.MARKET,
    status: Status.SUCCESS,
    change_24h: "+3.27%",
    high_24h: "2059.0",
    low_24h: "2058.8",
    volume_24h: "$1.80M",
    openInterest: "$179.0M",
  },
  {
    key: "1",
    time: "2021-04-01 12:00:00",
    logo: USDC_LOGO,
    name: "USDC",
    price: "2058.8",
    amount: 200,
    type: Types.MARKET,
    status: Status.FAILED,
    change_24h: "+3.27%",
    high_24h: "2059.0",
    low_24h: "2058.8",
    volume_24h: "$1.80M",
    openInterest: "$179.0M",
  },
  {
    key: "2",
    time: "2021-04-01 12:00:00",
    logo: APT_LOGO,
    name: "APT",
    price: "2058.8",
    amount: 200,
    type: Types.MARKET,
    status: Status.SUCCESS,
    change_24h: "-3.27%",
    high_24h: "2059.0",
    low_24h: "2058.8",
    volume_24h: "$1.80M",
    openInterest: "$179.0M",
  },
  {
    key: "3",
    time: "2021-04-01 12:00:00",
    logo: USDC_LOGO,
    name: "USDC",
    price: "2058.8",
    amount: 200,
    type: Types.MARKET,
    status: Status.SUCCESS,
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

const DepositsTable: React.FC = () => (
  <Table
    columns={columns}
    dataSource={data}
    onChange={onChange}
    className={styles.table}
  />
);

export default DepositsTable;
