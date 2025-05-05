import {LOAD_ACTION_AND_KPI, ACTION_AND_KPI_SORTING, ACTION_AND_KPI_SEARCH} from '../actions/types'
const initialstate = {
  sort: '',
  order: 'asc',
  search: '',
  query: '',
  record: {},
}
export default function(state = initialstate, action) {
  switch (action.type) {
    case ACTION_AND_KPI_SORTING:
      return {...state, sort: action.sortField, order: action.order}
    case ACTION_AND_KPI_SEARCH:
      return {...state, search: action.searchField, query: action.query}
    case LOAD_ACTION_AND_KPI:
      return {...state, record: action.data}
    default:
      return state
  }
}
