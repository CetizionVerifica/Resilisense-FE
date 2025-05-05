import {LOAD_STAKEHOLDER, STAKEHOLDER_SORTING, STAKEHOLDER_SEARCH} from '../actions/types'
const initialstate = {
  sort: '',
  order: 'asc',
  search: '',
  query: '',
  record: {},
}
export default function(state = initialstate, action) {
  switch (action.type) {
    case STAKEHOLDER_SORTING:
      return {...state, sort: action.sortField, order: action.order}
    case STAKEHOLDER_SEARCH:
      return {...state, search: action.searchField, query: action.query}
    case LOAD_STAKEHOLDER:
      return {...state, record: action.data}
    default:
      return state
  }
}
