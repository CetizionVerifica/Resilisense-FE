import {find, keys, values, filter} from 'lodash'
import {coreSubjectNames} from './coreSubjectNames'
import {issueOfInterest} from './issueOfInterest'

export function generateKeys(obj) {
  for (let key of keys(obj)) {
    obj[key].key = key
  }
  return obj
}

export function generateLocalization(name, obj) {
  for (let key of keys(obj)) {
    obj[key].localization = {
      id: `enum.${name}.${key}`,
      defaultMessage: obj[key].labelWeb || obj[key].label,
    }
  }

  return obj
}

export function findEnum(enums, value, field = 'value') {
  return find(enums, (o) => o[field] === value)
}


export function generateYears() {
  const max = new Date().getFullYear(), min = max - 20
  const years = []
  for (let i = max; i >= min; i--) {
    const opt = {}
    opt.value = i
    opt.label = i
    years.push(opt)
  }
  return years
}

export function levelColor(divder, performance) {
  if (performance === 100) {
    return 1
  }

  const init = 100 / divder
  const value = Math.floor((performance / init))
  if (value === 0) {
    return divder
  } else if (value > divder) {
    return 1
  } else {
    return divder - value
  }

}

export const coreSubjectOptions = values(coreSubjectNames).map(coreSubject => {
  return {
    value: coreSubject.value,
    label: coreSubject.label,
    children: values(filter(issueOfInterest, {coreSubject: coreSubject.key})).map(issue => {
      return {
        value: issue.value,
        label: issue.label,
      }
    }),
  }
})

export const languagesJson = {
  en: {
    locale: require('react-intl/locale-data/en'),
    messages: require('../translations/en.json'),
  },
  ar: {
    locale: require('react-intl/locale-data/ar'),
    messages: require('../translations/ar.json'),
  },
  // cs: {
  //   locale: require('react-intl/locale-data/cs'),
  //   messages: require('../translations/cs.json'),
  // },
  de: {
    locale: require('react-intl/locale-data/de'),
    messages: require('../translations/de.json'),
  },
  // es: {
  //   locale: require('react-intl/locale-data/es'),
  //   messages: require('../translations/es.json'),
  // },
  fr: {
    locale: require('react-intl/locale-data/fr'),
    messages: require('../translations/fr.json'),
  },
  // it: {
  //   locale: require('react-intl/locale-data/it'),
  //   messages: require('../translations/it.json'),
  // },
  // ko: {
  //   locale: require('react-intl/locale-data/ko'),
  //   messages: require('../translations/ko.json'),
  // },
  // no: {
  //   locale: require('react-intl/locale-data/no'),
  //   messages: require('../translations/no.json'),
  // },
  ro: {
    locale: require('react-intl/locale-data/ro'),
    messages: require('../translations/ro.json'),
  },
  // ru: {
  //   locale: require('react-intl/locale-data/ru'),
  //   messages: require('../translations/ru.json'),
  // },

  // tr: {
  //   locale: require('react-intl/locale-data/tr'),
  //   messages: require('../translations/tr.json'),
  // },
  // zh: {
  //   locale: require('react-intl/locale-data/zh'),
  //   messages: require('../translations/zh.json'),
  // },

}
