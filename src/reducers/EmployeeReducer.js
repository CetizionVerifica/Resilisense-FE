import {LOAD_EMPLOYEE, EMPLOYEE_SORTING, EMPLOYEE_SEARCH} from '../actions/types'
const initialstate = {
  sort: '',
  order: 'asc',
  search: '',
  query: '',
  record: {},
}
export default function(state = initialstate, action) {
  switch (action.type) {
    case EMPLOYEE_SORTING:
      return {...state, sort: action.sortField, order: action.order}
    case EMPLOYEE_SEARCH:
      return {...state, search: action.searchField, query: action.query}
    case LOAD_EMPLOYEE:
      return {...state, record: action.data}
    default:
      return state
  }
}
