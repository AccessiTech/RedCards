import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  language: null, // User's preferred language (null = auto-detect)
  region: null, // User's selected region for Rapid Response Network
  installedPWA: false, // Whether user has installed PWA
  lastVisit: null, // Last visit timestamp
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setLanguage: (state, action) => {
      state.language = action.payload;
    },
    setRegion: (state, action) => {
      state.region = action.payload;
    },
    setInstalledPWA: (state, action) => {
      state.installedPWA = action.payload;
    },
    updateLastVisit: (state) => {
      state.lastVisit = new Date().toISOString();
    },
    resetUser: () => initialState,
  },
});

export const {
  setLanguage,
  setRegion,
  setInstalledPWA,
  updateLastVisit,
  resetUser,
} = userSlice.actions;

export default userSlice.reducer;
