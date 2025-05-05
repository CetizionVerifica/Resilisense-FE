import {LOAD_STAKEHOLDER, STAKEHOLDER_SORTING, STAKEHOLDER_SEARCH} from '../actions/types'

export function stakeholderSorting(sortField, order) {
  return {
    type: STAKEHOLDER_SORTING,
    sortField,
    order,
  }
}

export function stakeholderSearch(searchField, query) {
  return {
    type: STAKEHOLDER_SEARCH,
    searchField,
    query,
  }
}


export function loadStakeholder(data) {
  return {
    type: LOAD_STAKEHOLDER,
    data,
  }
}
