import {generateKeys} from '../utils'
import enGB from 'antd/lib/locale-provider/en_GB'
import deDE from 'antd/lib/locale-provider/de_DE'
import frFR from 'antd/lib/locale-provider/fr_FR'
import arEG from 'antd/lib/locale-provider/ar_EG'

export const languages = generateKeys({
  // Language values MUST have exactly 2 chars (use ISO 639-1 codes)
 // ar: {
 ///   value: 'ar',
  //  label: 'Arabic',
  //  native: 'العربية',
  //  ant: arEG,
  //},
  // cs: {
  //   value: 'cs',
  //   label: 'Czech',
  //   native: 'Čeština',
  // },
  // da: {
  //   value: 'da',
  //   label: 'Danish',
  //   native: 'Dansk',
  // },
 // de: {
 //   value: 'de',
 //   label: 'German',
 //   native: 'Deutsch',
 //   ant: deDE,
 // },
  en: {
    value: 'en',
    label: 'English',
    native: 'English',
    ant: enGB,
  },
  // es: {
  //   value: 'es',
  //   label: 'Spanish',
  //   native: 'Español',
  // },
  //fr: {
  //  value: 'fr',
  //  label: 'French',
  //  native: 'Français',
  //  ant: frFR,
  //},
  // hi: {
  //   value: 'hi',
  //   label: 'Hindi',
  //   native: 'हिन्दी, हिंदी',
  // },
  // it: {
  //   value: 'it',
  //   label: 'Italian',
  //   native: 'Italiano',
  // },
  // ko: {
  //   value: 'ko',
  //   label: 'Korean',
  //   native: '한국어',
  // },

  // nl: {
  //   value: 'nl',
  //   label: 'Dutch',
  //   native: 'Nederlands',
  // },
  // no: {
  //   value: 'no',
  //   label: 'Norwegian',
  //   native: 'Norsk',
  // },
  // pl: {
  //   value: 'pl',
  //   label: 'Polish',
  //   native: 'Polski',
  // },
  // pt: {
  //   value: 'pt',
  //   label: 'Portuguese',
  //   native: 'Português',
  // },
 // ro: {
  //  value: 'ro',
   // label: 'Romanian',
  //  native: 'Română',
  //  ant: enGB,
  //},
  // ru: {
  //   value: 'ru',
  //   label: 'Russian',
  //   native: 'Русский',
  // },

  // tr: {
  //   value: 'tr',
  //   label: 'Turkish',
  //   native: 'Türkçe',
  // },
  // zh: {
  //   value: 'zh',
  //   label: 'Chinese',
  //   native: '中文',
  // },

})
