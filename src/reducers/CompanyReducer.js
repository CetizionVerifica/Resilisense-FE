import {COMPANIES_SORTING, COMPANIES_SEARCH} from '../actions/types'
const initialstate = {
  sort: '',
  order: 'asc',
  search: '',
  query: '',

}
export default function(state = initialstate, action) {
  switch (action.type) {
    case COMPANIES_SORTING:
      return {...state, sort: action.sortField, order: action.order}
    case COMPANIES_SEARCH:
      return {...state, search: action.searchField, query: action.query}
    default:
      return state
  }
}
