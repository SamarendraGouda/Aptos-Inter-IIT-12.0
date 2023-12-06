import React from "react";
import styles from "./index.module.css";
import { Table } from "antd";
import {
  BITCOIN_LOGO,
  ETHEREUM_LOGO,
  TETHER_LOGO,
} from "../../constants/constants";
import type { ColumnsType, TableProps } from "antd/es/table";

enum Sides {
  LONG = "LONG",
  SHORT = "SHORT",
}

interface DataType {
  key: React.Key;
  time: string;
  logo?: any;
  name: string;
  amount: number;
  price: string;
  filled: string;
  size: string;
  side: Sides;
  margin: string;
  leverage: string;
}

const columns: ColumnsType<DataType> = [
  {
    title: "Timestamp",
    dataIndex: "time",
  },
  {
    title: "Pair",
    dataIndex: "name",
    render: (text, record) => (
      <div className={styles.tableItem}>
        <img src={record.logo} alt={record.name} />
        <span>{text}</span>
      </div>
    ),
  },
  {
    title: "Side",
    dataIndex: "side",
    render: (text, record) => (
      <div className={text === Sides.LONG ? styles.sideLong : styles.sideShort}>
        <span>{text}</span>
      </div>
    ),
  },
  {
    title: "Filled/Size",
    dataIndex: "size",
    render: (text, record) => (
      <div className={styles.tableItem}>
        <span>{record.filled}</span>
        <span>/</span>
        <span>{text}</span>
      </div>
    ),
  },
  {
    title: "Price",
    dataIndex: "price",
  },
  {
    title: "Margin",
    dataIndex: "margin",
  },
  {
    title: "Leverage",
    dataIndex: "leverage",
  },
];

const data = [
  {
    key: "1",
    time: "2021-04-01 12:00:00",
    logo: BITCOIN_LOGO,
    name: "BTC/USDC",
    price: "2058.8",
    amount: 200,
    filled: "205.8",
    size: "215.8",
    side: Sides.LONG,
    margin: "205.8",
    leverage: "10x",
  },
  {
    key: "2",
    time: "2021-04-01 12:00:00",
    logo: ETHEREUM_LOGO,
    name: "ETH/USDC",
    price: "2058.8",
    amount: 200,
    filled: "205.8",
    size: "215.8",
    side: Sides.SHORT,
    margin: "205.8",
    leverage: "10x",
  },
  {
    key: "3",
    time: "2021-04-01 12:00:00",
    logo: TETHER_LOGO,
    name: "USDT/USDC",
    price: "2058.8",
    amount: 200,
    filled: "205.8",
    size: "215.8",
    side: Sides.LONG,
    margin: "205.8",
    leverage: "10x",
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

const OrdersTable: React.FC = () => (
  <Table
    columns={columns}
    dataSource={data}
    onChange={onChange}
    className={styles.table}
  />
);

export default OrdersTable;
