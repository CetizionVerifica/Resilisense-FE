import {generateKeys, generateLocalization} from '../utils'
const materialityGroup = generateLocalization('materialityGroup', generateKeys({
  groupA: {
    value: 3,
    label: 'Class A: Of critical importance to company\'s operations',
    orderby: 0,
  },
  groupB: {
    value: 2,
    label: 'Class B: Of average importance to company\'s operations',
    orderby: 0,
  },
  groupC: {
    value: 1,
    label: 'Class C: Of minor importance to company\'s operations',
    orderby: 0,
  },

}))

export {materialityGroup}
