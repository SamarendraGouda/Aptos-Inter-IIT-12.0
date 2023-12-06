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
  price: string;
  type: Types;
  side: Sides;
  high_24h: string;
  low_24h: string;
  volume_24h: string;
  openInterest: string;
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
    title: "Type",
    dataIndex: "type",
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
    title: "Size",
    dataIndex: "volume_24h",
  },
  {
    title: "Price",
    dataIndex: "openInterest",
  },
  {
    title: "Trade Value",
    dataIndex: "openInterest",
  },
  {
    title: "Fees",
    dataIndex: "openInterest",
  },
];

const data = [
  {
    key: "1",
    time: "2021-04-01 12:00:00",
    logo: BITCOIN_LOGO,
    name: "BTC/USDC",
    price: "2058.8",
    type: Types.MARKET,
    side: Sides.LONG,
    change_24h: "+3.27%",
    high_24h: "2059.0",
    low_24h: "2058.8",
    volume_24h: "$1.80M",
    openInterest: "$179.0M",
  },
  {
    key: "2",
    time: "2021-04-01 12:00:00",
    logo: ETHEREUM_LOGO,
    name: "ETH/USDC",
    price: "2058.8",
    type: Types.MARKET,
    side: Sides.LONG,
    change_24h: "-3.27%",
    high_24h: "2059.0",
    low_24h: "2058.8",
    volume_24h: "$1.80M",
    openInterest: "$179.0M",
  },
  {
    key: "3",
    time: "2021-04-01 12:00:00",
    logo: TETHER_LOGO,
    name: "USDT/USDC",
    price: "2058.8",
    type: Types.MARKET,
    side: Sides.LONG,
    change_24h: "+3.27%",
    high_24h: "2059.0",
    low_24h: "2058.8",
    volume_24h: "$1.80M",
    openInterest: "$179.0M",
  },
  {
    key: "1",
    time: "2021-04-01 12:00:00",
    logo: BITCOIN_LOGO,
    name: "BTC/USDC",
    price: "2058.8",
    type: Types.MARKET,
    side: Sides.SHORT,
    change_24h: "+3.27%",
    high_24h: "2059.0",
    low_24h: "2058.8",
    volume_24h: "$1.80M",
    openInterest: "$179.0M",
  },
  {
    key: "2",
    time: "2021-04-01 12:00:00",
    logo: ETHEREUM_LOGO,
    name: "ETH/USDC",
    price: "2058.8",
    type: Types.MARKET,
    side: Sides.LONG,
    change_24h: "-3.27%",
    high_24h: "2059.0",
    low_24h: "2058.8",
    volume_24h: "$1.80M",
    openInterest: "$179.0M",
  },
  {
    key: "3",
    time: "2021-04-01 12:00:00",
    logo: TETHER_LOGO,
    name: "USDT/USDC",
    price: "2058.8",
    type: Types.MARKET,
    side: Sides.LONG,
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

const TradesTable: React.FC = () => (
  <Table
    columns={columns}
    dataSource={data}
    onChange={onChange}
    className={styles.table}
  />
);

export default TradesTable;
