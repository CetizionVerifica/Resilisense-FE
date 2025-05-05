import {COMPANIES_SORTING, COMPANIES_SEARCH} from './types'

export function companySorting(sortField, order) {
  return {
    type: COMPANIES_SORTING,
    sortField,
    order,
  }
}

export function companySearch(searchField, query) {
  return {
    type: COMPANIES_SEARCH,
    searchField,
    query,
  }
}
