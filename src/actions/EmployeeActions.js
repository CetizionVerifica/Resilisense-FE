import {LOAD_EMPLOYEE, EMPLOYEE_SORTING, EMPLOYEE_SEARCH} from './types'

export function employeeSorting(sortField, order) {
  return {
    type: EMPLOYEE_SORTING,
    sortField,
    order,
  }
}

export function employeeSearch(searchField, query) {
  return {
    type: EMPLOYEE_SEARCH,
    searchField,
    query,
  }
}

export function loadEmployee(data) {
  return {
    type: LOAD_EMPLOYEE,
    data,
  }
}
