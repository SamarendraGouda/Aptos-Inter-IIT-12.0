import { configureStore } from "@reduxjs/toolkit";
import user from "./authSlice";

const store = configureStore({
  reducer: {
    user,
  },
});

export default store;
