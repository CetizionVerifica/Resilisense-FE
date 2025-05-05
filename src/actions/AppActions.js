import {mapValues, isEmpty} from 'lodash'
import {updateIntl} from 'react-intl-redux'
import {languagesJson} from './../common/utils'
import {BREADCRUMB, LOCALE_SWITCH, AGENCY_SWITCH, SET_PENDING_SUPPLIER_REQUEST, SET_PENDING_PARTNER_REQUEST, SELECTED_MENU} from './types'

export const breadcrumbUpdate = (breadcrumb) => {
  return {
    type: BREADCRUMB,
    payload: breadcrumb,
  }
}
export const setSelectedMenu = (selectedMenu) => {
  return {
    type: SELECTED_MENU,
    payload: selectedMenu
  }
}



const standardizeLocale = (locale) => {
  switch (locale) {
    // case 'no' : return 'nb'
    case 'ph' : return 'fil'
    default: return locale
  }
}

// export const localeSwitchFail = () => {
//   return {
//     type: ALERT_ERROR,
//     payload: auth.failedLocaleSwitch,
//   }
// }

export function languageSwitch(locale) {

  if (isEmpty(locale)) {
    locale = 'en'
  }
  const languages = mapValues(languagesJson, (val, key) => {
    return {
      locale,
      key: val,
    }
  })

  return (dispatch) => {
    dispatch(updateIntl({
      defaultLocale: standardizeLocale(locale),
      locale: standardizeLocale(locale),
      messages: {...languages.en.key.messages, ...languages[standardizeLocale(locale)].key.messages},
    }))
    dispatch({type: LOCALE_SWITCH, payload: locale})
  }
}


export const localeSwitch = (locale = 'en') => {
  return (dispatch) => {
    dispatch(languageSwitch(locale))
  }
}

export const agencySwitch = (agency) => {
  return (dispatch) => {
    dispatch({type: AGENCY_SWITCH, payload: agency})
  }
}

export const setPendingSupplierRequest = (pendingRequests) => {
  return (dispatch) => {
    dispatch({type: SET_PENDING_SUPPLIER_REQUEST, payload: pendingRequests})
  }
}

export const setPendingPartnerRequest = (pendingRequests) => {
  return (dispatch) => {
    dispatch({type: SET_PENDING_PARTNER_REQUEST, payload: pendingRequests})
  }
}

