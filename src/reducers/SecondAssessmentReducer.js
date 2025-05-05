import {
  SECOND_ASSESSMENT_PROJECT_SORTING,
  SECOND_ASSESSMENT_PROJECT_SEARCH,
  SECOND_ASSESSMENT_PROJECT_SELECTED_TAB,
} from '../actions/types'
const initialstate = {
  sort: '',
  order: 'asc',
  search: '',
  query: '',
  selectedTab: '1',

}
export default function(state = initialstate, action) {
  switch (action.type) {
    case SECOND_ASSESSMENT_PROJECT_SORTING:
      return {...state, sort: action.sortField, order: action.order}
    case SECOND_ASSESSMENT_PROJECT_SEARCH:
      return {...state, search: action.searchField, query: action.query}
    case SECOND_ASSESSMENT_PROJECT_SELECTED_TAB:
      return {...state, selectedTab: action.payload}
    default:
      return state
  }
}
