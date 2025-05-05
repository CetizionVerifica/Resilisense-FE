import {MATERIALITY_SELECTED_STAKEHOLDER} from '../actions/types'

export function selectStakeholder(id) {
  return {
    type: MATERIALITY_SELECTED_STAKEHOLDER,
    payload: id,
  }
}
