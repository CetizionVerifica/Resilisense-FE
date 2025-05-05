import {BREADCRUMB, LOCALE_SWITCH, AGENCY_SWITCH, SET_PENDING_SUPPLIER_REQUEST, SET_PENDING_PARTNER_REQUEST, UNAUTH_USER, SELECTED_MENU} from '../actions/types'
import {loadMessages} from '../messagesHelpers'
const messages = loadMessages({addLocales: true})
const initialstate = {
  locale: undefined,
  agency: undefined,
  pendingSupplierRequests: 0,
  pendingPartnerRequests: 0,
  breadcrumb: [{name: 'Home', link: '/'}],
  messages: messages,
  selectedMenu: ['performance']
}

export default function(state = initialstate, action) {
  switch (action.type) {
    case LOCALE_SWITCH: {
      return {...state, locale: action.payload}
    }
    case AGENCY_SWITCH: {
      return {...state, agency: action.payload}
    }
    case SET_PENDING_SUPPLIER_REQUEST: {
      return {...state, pendingSupplierRequests: action.payload}
    }
    case SET_PENDING_PARTNER_REQUEST: {
      return {...state, pendingPartnerRequests: action.payload}
    }
    case UNAUTH_USER:
      return {...state, agency: undefined}
    case BREADCRUMB:
      return {...state, breadcrumb: action.payload}
    case SELECTED_MENU:
      return {...state, selectedMenu: action.payload}
    default:
      return state
  }
}
