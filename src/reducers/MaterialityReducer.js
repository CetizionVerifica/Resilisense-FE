import {MATERIALITY_SELECTED_STAKEHOLDER} from '../actions/types'
const initialstate = {
  selectedStakeholder: '',
}
export default function(state = initialstate, action) {
  //console.log(action)
  switch (action.type) {
    case MATERIALITY_SELECTED_STAKEHOLDER:
      return {...state, selectedStakeholder: action.payload}
    default:
      return state
  }
}
