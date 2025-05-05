import {generateKeys, generateLocalization} from '../utils'
const impact = generateLocalization('impact', generateKeys({
  low: {
    value: 'Low',
    label: 'Low',
    group: 'flaggingCriteria',
    orderby: 0,
  },
  medium: {
    value: 'Medium',
    label: 'Medium',
    group: 'flaggingCriteria',
    orderby: 1,
  },
  high: {
    value: 'High',
    label: 'High',
    group: 'flaggingCriteria',
    orderby: 1,
  },
}))

export {impact}
