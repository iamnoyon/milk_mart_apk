import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  id: null,
  name: "",
  email: "",
  role: "",
  profileImageUrl: "",
  profile_image: "",
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

    setProfileImageUrl: (state, action) => {
      state.profileImageUrl = action.payload;
      state.profile_image = action.payload;
    },

    clearUser: () => {
      return initialState;
    },

    clearToken: (state) => {
      state.token = null;
    },
  },
});

export const { setUser, setToken, setProfileImageUrl, clearUser, clearToken } =
  userSlice.actions;

export default userSlice.reducer;