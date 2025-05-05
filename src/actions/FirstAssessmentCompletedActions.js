import {
  FIRST_ASSESSMENT_COMPLETED_PROJECT_SORTING,
  FIRST_ASSESSMENT_COMPLETED_PROJECT_SEARCH,
  FIRST_ASSESSMENT_COMPLETED_PROJECT_SELECTED_TAB} from './types'

export function firstAssessmentCompletedSorting(sortField, order) {
  return {
    type: FIRST_ASSESSMENT_COMPLETED_PROJECT_SORTING,
    sortField,
    order,
  }
}

export function firstAssessmentCompletedSearch(searchField, query) {
  return {
    type: FIRST_ASSESSMENT_COMPLETED_PROJECT_SEARCH,
    searchField,
    query,
  }
}

export function firstAssessmentCompletedSelectTab(tab) {
  return {
    type: FIRST_ASSESSMENT_COMPLETED_PROJECT_SELECTED_TAB,
    payload: tab,
  }
}
