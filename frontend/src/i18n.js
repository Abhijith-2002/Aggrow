import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "../public/locales/en.json";
import hi from "../public/locales/hi.json";
import ml from "../public/locales/ml.json";

const savedLanguage = localStorage.getItem('language') || 'en';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      hi: { translation: hi },
      ml: { translation: ml },
    },
    lng: savedLanguage,
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false // This is important for React Router applications
    }
  });

// Add a language change listener
i18n.on('languageChanged', (lng) => {
  localStorage.setItem('language', lng);
});

export default i18n;
