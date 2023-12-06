import React from "react";
import { CircularProgress } from "@mui/material";

//@ts-ignore
const ButtonLoader = (props) => {
  return (
    <CircularProgress
      sx={{
        color: "#fff",
        width: "20px",
        height: "20px",
        margin: "auto",
        display: "block",
      }}
      size={props.size}
    />
  );
};

export default ButtonLoader;
