import React from "react";
import Navbar from "../../Components/Navbar/Navbar";
import LiquidityCard from "../../Components/LiquidityCard";

import { Provider, Network } from "aptos";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { Button } from "antd";

const Earn = () => {
  const provider = new Provider(Network.DEVNET);
  const { account, signAndSubmitTransaction } = useWallet();

  const [accountHasList, setAccountHasList] = React.useState(false);
  const [tasks, setTasks] = React.useState<any[]>();
  const [transactionInProgress, setTransactionInProgress] =
    React.useState(false);

  console.log("accountHasList", accountHasList);
  console.log("tasks", tasks);

  const moduleAddress =
    "0x4883a56da66d5f2e33917e2c69743c3aee41ed9ab515a5327c16452a54531a84";

  const fetchList = async () => {
    if (!account) return [];
    try {
      const todoListResource = await provider.getAccountResource(
        account?.address,
        `${moduleAddress}::todolist::TodoList`
      );
      setAccountHasList(true);
      // tasks table handle
      const tableHandle = (todoListResource as any).data.tasks.handle;
      // tasks table counter
      const taskCounter = (todoListResource as any).data.task_counter;

      let tasks = [];
      let counter = 1;
      while (counter <= taskCounter) {
        const tableItem = {
          key_type: "u64",
          value_type: `${moduleAddress}::todolist::Task`,
          key: `${counter}`,
        };
        const task = await provider.getTableItem(tableHandle, tableItem);
        tasks.push(task);
        counter++;
      }
      // set tasks in local state
      setTasks(tasks);
    } catch (e: any) {
      setAccountHasList(false);
    }
  };

  const addNewList = async () => {
    if (!account) return [];
    setTransactionInProgress(true);
    // build a transaction payload to be submited
    const payload = {
      type: "entry_function_payload",
      function: `${moduleAddress}::todolist::create_list`,
      type_arguments: [],
      arguments: [],
    };
    try {
      // sign and submit transaction to chain
      const response = await signAndSubmitTransaction(payload);
      // wait for transaction
      await provider.waitForTransaction(response.hash);
      setAccountHasList(true);
    } catch (error: any) {
      setAccountHasList(false);
    } finally {
      setTransactionInProgress(false);
    }
  };

  return (
    <>
      <Navbar />
      <LiquidityCard />
      <Button onClick={() => fetchList()}>Fetch List</Button>
      <Button onClick={() => addNewList()} loading={transactionInProgress}>
        Add New List
      </Button>
    </>
  );
};

export default Earn;
