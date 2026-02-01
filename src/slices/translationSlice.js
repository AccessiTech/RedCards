import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  translations: {}, // Cached translations by language code
  availableLanguages: ["en", "es", "zh-CN", "zh-TW"], // Will expand in Phase 3
  currentLanguage: "en",
  lastUpdated: null,
};

const translationSlice = createSlice({
  name: "translation",
  initialState,
  reducers: {
    setTranslations: (state, action) => {
      const { language, translations } = action.payload;
      state.translations[language] = translations;
      state.lastUpdated = new Date().toISOString();
    },
    setCurrentLanguage: (state, action) => {
      state.currentLanguage = action.payload;
    },
    addLanguage: (state, action) => {
      if (!state.availableLanguages.includes(action.payload)) {
        state.availableLanguages.push(action.payload);
      }
    },
    resetTranslations: () => initialState,
  },
});

export const {
  setTranslations,
  setCurrentLanguage,
  addLanguage,
  resetTranslations,
} = translationSlice.actions;

export default translationSlice.reducer;
