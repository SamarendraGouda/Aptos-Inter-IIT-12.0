export enum TransactionType {
  SEND = "SEND",
  LIQUIDATE = "LIQUIDATE",
  SETTLE = "SETTLE",
  ADDLIQUIDITY = "ADDLIQUIDITY",
  REMOVELIQUIDITY = "REMOVELIQUIDITY",
}

export interface ITransaction {
  type: TransactionType;
  from: string;
  to: string;
  amount: number;
  createdAt: Date;
}
