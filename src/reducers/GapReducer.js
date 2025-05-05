import {AUTH_USER, UNAUTH_USER, FETCH_MESSAGE, AUTH_ERROR, FETCH_USER} from '../actions/types'
const initialstate = {
  authenticated: false,
  currentUser: null,
  errorMessage: false,
}
export default function(state = initialstate, action) {
  // console.log(action)
  switch (action.type) {
    case AUTH_USER:
      return {...state, error: '', authenticated: true}
    case UNAUTH_USER:
      return {...state, error: '', authenticated: false}
    case AUTH_ERROR:
      return {...state, error: '', errorMessage: action.payload}
    case FETCH_MESSAGE:
      return {...state, message: action.payload}
    case FETCH_USER:
      return {...state, currentUser: action.payload, authenticated: true}
    default:
      return state
  }
}
