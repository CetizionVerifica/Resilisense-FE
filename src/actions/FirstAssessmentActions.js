import {FIRST_ASSESSMENT_PROJECT_SORTING, FIRST_ASSESSMENT_PROJECT_SEARCH, FIRST_ASSESSMENT_PROJECT_SELECTED_TAB} from './types'

export function firstAssessmentSorting(sortField, order) {
  return {
    type: FIRST_ASSESSMENT_PROJECT_SORTING,
    sortField,
    order,
  }
}

export function firstAssessmentSearch(searchField, query) {
  return {
    type: FIRST_ASSESSMENT_PROJECT_SEARCH,
    searchField,
    query,
  }
}

export function firstAssessmentSelectTab(tab) {
  return {
    type: FIRST_ASSESSMENT_PROJECT_SELECTED_TAB,
    payload: tab,
  }
}
