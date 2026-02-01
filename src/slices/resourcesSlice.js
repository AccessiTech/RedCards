import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  regions: [], // Cached Rapid Response Network phone numbers
  resources: [], // Cached resource links and data
  lastUpdated: null, // Timestamp of last data fetch
};

const resourcesSlice = createSlice({
  name: "resources",
  initialState,
  reducers: {
    setRegions: (state, action) => {
      state.regions = action.payload;
      state.lastUpdated = new Date().toISOString();
    },
    setResources: (state, action) => {
      state.resources = action.payload;
      state.lastUpdated = new Date().toISOString();
    },
    updateResource: (state, action) => {
      const { id, data } = action.payload;
      const index = state.resources.findIndex((r) => r.id === id);
      if (index !== -1) {
        state.resources[index] = { ...state.resources[index], ...data };
      }
    },
    resetResources: () => initialState,
  },
});

export const { setRegions, setResources, updateResource, resetResources } =
  resourcesSlice.actions;

export default resourcesSlice.reducer;
