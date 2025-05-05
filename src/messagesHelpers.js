import {addLocaleData} from 'react-intl'
import {mapValues} from 'lodash'
import {languagesJson} from './common/utils'

export function loadMessages(options) {

  const {
    includeDefault = false,
    addLocales = false,
  } = options || {}

  // MESSAGES
  const messages = {}
  if (includeDefault) {
    const _default = require('./translations/en.json')
    messages._default = descriptorsToMessages(_default)
  }


  const languages = mapValues(languagesJson, (val, key) => {
    return {
      locale: key,
      key: val,
    }
  })

  // ADD DESCRIPTORS
  Object.keys(languages).forEach((lang) => {
    messages[lang] = descriptorsToMessages(languages[lang].key.messages)
  })

  // ADD LOCALES
  if (addLocales) {

    Object.keys(languages).forEach((lang) => {

      addLocaleData(languages[lang].key.locale)
    })
    //addLocaleData(en)
  }
  return messages
}

function removeDuplicates(sortedMessages) {
  let previousValue = {}, messages = []

  sortedMessages.forEach((currentValue) => {
    if (previousValue.id !== currentValue.id) {
      messages.push(currentValue)
      previousValue = currentValue
    } else if (previousValue.defaultMessage !== currentValue.defaultMessage) {
      // eslint-disable-next-line no-console
      console.warn(`Found duplicate translation id ${previousValue.id} with different message`)
    }
  })
  return messages
}

/**
 * Transforms react-intl messages to javascript code
 *
 * @param {Object[]} messages - array of messages in form {id, defaultMessage}
 * @returns {String} - full javascript code, such as in messages/_default.js
 */

export function messagesToCode(messages) {
  messages.sort((a, b) => a.id.localeCompare(b.id))
  messages = removeDuplicates(messages)
  const messagesString = JSON
    .stringify(messages, ['id', 'defaultMessage'], 2)
    // Add trailing commas.
    .replace(/\n {2}\}/g, ',\n  }')
    .replace(/\}\n\]/g, '},\n]')

  return `/* eslint-disable max-len, semi, quote-props, quotes */
export default ${messagesString};
`
}

/*
 * Exports to json format containing one object where properties are message ids and values are default messages
 */
export function exportToJson(messages) {
  const obj = {}
  messages.forEach((message) => (obj[message.id] = message.defaultMessage))

  return JSON.stringify(obj, null, 2)
}

export const diff = (a, b) => a.filter((item) => b.indexOf(item) === -1)

function descriptorsToMessages(messages) {
  const formatedMessages = {}
  Object.keys(messages).forEach((msg) => {
    formatedMessages[msg] = msg
  })

  return formatedMessages
}

function generateEnumLocalization(object) {
  let result = []
  if (object == null || typeof object !== 'object') {
    return result
  }

  for (let enumKey in object) {
    if (object.hasOwnProperty(enumKey)) {
      const enumValue = object[enumKey]
      if (enumValue.localization) {
        result.push(enumValue.localization)
      }
    }
  }

  return result
}

export function generateFromEnums(enumerations) {
  let result = []
  for (let enumName in enumerations) {
    if (enumerations.hasOwnProperty(enumName)) {
      const object = enumerations[enumName]
      result.push(...generateEnumLocalization(object))
    }
  }

  return result
}
