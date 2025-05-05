import {LOAD_ACTION_AND_KPI, ACTION_AND_KPI_SORTING, ACTION_AND_KPI_SEARCH} from './types'

export function actionAndKPISorting(sortField, order) {
  return {
    type: ACTION_AND_KPI_SORTING,
    sortField,
    order,
  }
}

export function actionAndKPISearch(searchField, query) {
  return {
    type: ACTION_AND_KPI_SEARCH,
    searchField,
    query,
  }
}

export function loadActionAndKPI(data) {
  return {
    type: LOAD_ACTION_AND_KPI,
    data,
  }
}

