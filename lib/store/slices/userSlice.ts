import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  token: string | null;
  userInfo: {
    id: string | null;
    email: string | null;
    name: string | null;
    // Add other user fields as needed
  } | null;
  isAuthenticated: boolean;
}

const initialState: UserState = {
  token: null,
  userInfo: null,
  isAuthenticated: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{
        token: string;
        userInfo: UserState["userInfo"];
      }>
    ) => {
      state.token = action.payload.token;
      state.userInfo = action.payload.userInfo;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.token = null;
      state.userInfo = null;
      state.isAuthenticated = false;
    },
    updateUserInfo: (
      state,
      action: PayloadAction<Partial<UserState["userInfo"]>>
    ) => {
      if (state.userInfo) {
        state.userInfo = { ...state.userInfo, ...action.payload };
      }
    },
  },
});

export const { setCredentials, logout, updateUserInfo } = userSlice.actions;
export default userSlice.reducer;
