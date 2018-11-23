import i18n from 'i18next';
import { reactI18nextModule } from 'react-i18next';

import translationJA from './locales/ja/translation.json';
import translationEN from './locales/en/translation.json';

// the translations
const resources = {
  ja: {
    translation: translationJA
  },
  en: {
    translation: translationJA
  }
};

i18n
  .use(reactI18nextModule) // passes i18n down to react-i18next
  .init({
    resources,
    lng: 'ja',

    keySeparator: false, // we do not use keys in form messages.welcome

    interpolation: {
      escapeValue: false // react already safes from xss
    }
  });

export default i18n;