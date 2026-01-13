import { createSlice } from "@reduxjs/toolkit";
import type { User } from "@supabase/supabase-js";

export type UserState = {
  value: User | null;
};

const initialState: UserState = {
  value: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState: initialState,
  reducers: {
    setUser: (state, action) => {
      state.value = action.payload;
    },
    clearUser: (state) => {
      state.value = null;
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;

export default userSlice.reducer;
