import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  id: null,
  name: "",
  email: "",
  role: "",
  profileImageUrl: "",
  permissions: null,
  token: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      return {
        ...state,
        ...action.payload,
      };
    },

    setToken: (state, action) => {
      state.token = action.payload;
    },

    clearUser: () => {
      return initialState;
    },

    clearToken: (state) => {
      state.token = null;
    },
  },
});

export const { setUser, setToken, clearUser, clearToken } = userSlice.actions;

export default userSlice.reducer;