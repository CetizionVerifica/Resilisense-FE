import {COMPLETED_PROJECT_SORTING, COMPLETED_PROJECT_SEARCH, COMPLETED_PROJECT_SELECTED_TAB} from './types'

export function completedProjectSorting(sortField, order) {
  return {
    type: COMPLETED_PROJECT_SORTING,
    sortField,
    order,
  }
}

export function completedProjectSearch(searchField, query) {
  return {
    type: COMPLETED_PROJECT_SEARCH,
    searchField,
    query,
  }
}

export function completedProjectSelectTab(tab) {
  return {
    type: COMPLETED_PROJECT_SELECTED_TAB,
    payload: tab,
  }
}
