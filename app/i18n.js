import i18n from 'i18next';
import { reactI18nextModule } from 'react-i18next';

import translationJA from './locales/ja/translation.json';
import translationEN from './locales/en/translation.json';

// the translations
const resources = {
  ja_JP: {
    translation: translationJA
  },
  en_US: {
    translation: translationEN
  }
};

i18n
  .use(reactI18nextModule) // passes i18n down to react-i18next
  .init({
    resources,
    lng: 'ja_JP',

    keySeparator: false, // we do not use keys in form messages.welcome

    interpolation: {
      escapeValue: false // react already safes from xss
    }
  });

export default i18n;