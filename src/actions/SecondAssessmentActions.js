import {SECOND_ASSESSMENT_PROJECT_SORTING, SECOND_ASSESSMENT_PROJECT_SEARCH, SECOND_ASSESSMENT_PROJECT_SELECTED_TAB} from './types'

export function secondAssessmentSorting(sortField, order) {
  return {
    type: SECOND_ASSESSMENT_PROJECT_SORTING,
    sortField,
    order,
  }
}

export function secondAssessmentSearch(searchField, query) {
  return {
    type: SECOND_ASSESSMENT_PROJECT_SEARCH,
    searchField,
    query,
  }
}

export function secondAssessmentSelectTab(tab) {
  return {
    type: SECOND_ASSESSMENT_PROJECT_SELECTED_TAB,
    payload: tab,
  }
}
