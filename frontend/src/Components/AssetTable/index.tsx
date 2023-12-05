import React from "react";
import styles from "./index.module.css";
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
    filters: [
      {
        text: "Joe",
        value: "Joe",
      },
      {
        text: "Jim",
        value: "Jim",
      },
      {
        text: "Submenu",
        value: "Submenu",
        children: [
          {
            text: "Green",
            value: "Green",
          },
          {
            text: "Black",
            value: "Black",
          },
        ],
      },
    ],
    // specify the condition of filtering result
    // here is that finding the name started with `value`
    // onFilter: (value: string, record) => record.name.indexOf(value) === 0,
    // sorter: (a, b) => a.name.length - b.name.length,
    // sortDirections: ["descend"],
  },
  {
    title: "Total",
    dataIndex: "price",
    defaultSortOrder: "descend",
    // sorter: (a, b) => a.age - b.age,
  },
  {
    title: "Pair",
    dataIndex: "change_24h",
    filters: [
      {
        text: "London",
        value: "London",
      },
      {
        text: "New York",
        value: "New York",
      },
    ],
    // onFilter: (value: string, record) => record.address.indexOf(value) === 0,
  },
  {
    title: "In Position",
    dataIndex: "high_24h",
    filters: [
      {
        text: "London",
        value: "London",
      },
      {
        text: "New York",
        value: "New York",
      },
    ],
    // onFilter: (value: string, record) => record.address.indexOf(value) === 0,
  },
  {
    title: "In Liquidity",
    dataIndex: "low_24h",
    filters: [
      {
        text: "London",
        value: "London",
      },
      {
        text: "New York",
        value: "New York",
      },
    ],
    // onFilter: (value: string, record) => record.address.indexOf(value) === 0,
  },
  {
    title: "In Order",
    dataIndex: "volume_24h",
    filters: [
      {
        text: "London",
        value: "London",
      },
      {
        text: "New York",
        value: "New York",
      },
    ],
    // onFilter: (value: string, record) => record.address.indexOf(value) === 0,
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
