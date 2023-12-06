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
}

type DepositsTableProps = {
  data: DataType[]; // Assuming DataType is the type for the data array
};

const USDC_LOGO =
  "https://s2.coinmarketcap.com/static/img/coins/64x64/3408.png";
const APT_LOGO =
  "https://s2.coinmarketcap.com/static/img/coins/64x64/21794.png";

const columns: ColumnsType<DataType> = [
  {
    title: "Timestamp",
    dataIndex: "timestamp",
  },
  {
    title: "Token",
    dataIndex: "coin",
    render: (text, record) => (
      <div className={styles.tableItem}>
        <img src={text === "USDC" ? USDC_LOGO : APT_LOGO} alt={record.name} />
        <span>{text}</span>
      </div>
    ),
  },
  {
    title: "Amount",
    dataIndex: "amount",
  },
  // {
  //   title: "Transaction Status",
  //   dataIndex: "status",
  //   render: (text, record) => (
  //     <div
  //       className={text === Status.SUCCESS ? styles.sideLong : styles.sideShort}
  //     >
  //       <span>{text}</span>
  //     </div>
  //   ),
  // },
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

const onChange: TableProps<DataType>["onChange"] = (
  pagination,
  filters,
  sorter,
  extra
) => {
  console.log("params", pagination, filters, sorter, extra);
};

const DepositsTable: React.FC<DepositsTableProps> = ({ data }) => (
  <Table
    columns={columns}
    dataSource={data}
    onChange={onChange}
    className={styles.table}
  />
);

export default DepositsTable;
