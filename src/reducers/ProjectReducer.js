import {PROJECT_SORTING, PROJECT_SEARCH, PROJECT_SELECTED_TAB} from '../actions/types'
const initialstate = {
  sort: '',
  order: 'asc',
  search: '',
  query: '',
  selectedTab: '1',

}
export default function(state = initialstate, action) {
  switch (action.type) {
    case PROJECT_SORTING:
      return {...state, sort: action.sortField, order: action.order}
    case PROJECT_SEARCH:
      return {...state, search: action.searchField, query: action.query}
    case PROJECT_SELECTED_TAB:
      return {...state, selectedTab: action.payload}
    default:
      return state
  }
}
