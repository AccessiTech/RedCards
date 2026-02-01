import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "reduxjs-toolkit-persist";
import storage from "reduxjs-toolkit-persist/lib/storage";
import autoMergeLevel2 from "reduxjs-toolkit-persist/lib/stateReconciler/autoMergeLevel2";
import { combineReducers } from "@reduxjs/toolkit";

// Import slices
import userReducer from "../slices/userSlice";
import resourcesReducer from "../slices/resourcesSlice";
import translationReducer from "../slices/translationSlice";

// Persist configuration
const persistConfig = {
  key: "redcards",
  storage,
  stateReconciler: autoMergeLevel2,
  whitelist: ["user", "resources", "translation"], // Only persist these reducers
};

// Combine reducers
const rootReducer = combineReducers({
  user: userReducer,
  resources: resourcesReducer,
  translation: translationReducer,
});

// Create persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore redux-persist actions
        ignoredActions: [
          "persist/PERSIST",
          "persist/REHYDRATE",
          "persist/PAUSE",
          "persist/PURGE",
          "persist/REGISTER",
        ],
      },
    }),
  devTools: process.env.NODE_ENV !== "production",
});

// Create persistor
export const persistor = persistStore(store);
