import { createSlice } from "@reduxjs/toolkit";

type UserHasProfileState = {
  value: boolean;
};

const initialState: UserHasProfileState = {
  value: true,
};

const userHasProfileSlice = createSlice({
  name: "userHasProfile",
  initialState: initialState,
  reducers: {
    setUserHasProfile: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const { setUserHasProfile } = userHasProfileSlice.actions;

export default userHasProfileSlice.reducer;
