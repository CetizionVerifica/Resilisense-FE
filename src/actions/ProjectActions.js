import {PROJECT_SORTING, PROJECT_SEARCH, PROJECT_SELECTED_TAB} from './types'

export function projectSorting(sortField, order) {
  return {
    type: PROJECT_SORTING,
    sortField,
    order,
  }
}

export function projectSearch(searchField, query) {
  return {
    type: PROJECT_SEARCH,
    searchField,
    query,
  }
}

export function projectSelectTab(tab) {
  return {
    type: PROJECT_SELECTED_TAB,
    payload: tab,
  }
}
