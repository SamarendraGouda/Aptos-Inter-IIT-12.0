import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isWalletConnected: false,
  user: null,
};

export const AuthSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setAuth: (state, action) => {
      const { user } = action.payload;
      if (user === null) {
        state.isWalletConnected = false;
      } else {
        state.user = user;
        state.isWalletConnected = true;
      }
    },
    setLogout: (state, action) => {
      state.isWalletConnected = false;
      state.user = null;
    },
  },
});

export const { setAuth, setLogout } = AuthSlice.actions;

export default AuthSlice.reducer;
