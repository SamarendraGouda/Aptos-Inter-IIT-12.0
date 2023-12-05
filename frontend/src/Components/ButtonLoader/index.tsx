import React from "react";
import styles from "./index.module.css";
import { CircularProgress } from "@mui/material";

const ButtonLoader = () => {
  return (
    <CircularProgress
      sx={{
        color: "#fff",
        width: "20px !important",
        height: "20px !important",
        margin: "auto",
        display: "block",
      }}
    />
  );
};

export default ButtonLoader;