import {generateKeys, generateLocalization} from '../utils'

const responseStatuses = generateLocalization('responseStatuses', generateKeys({
  notResponded: {
    value: 'not_responded',
    label: 'Not Responded',
  },
  partiallyResponded: {
    value: 'partially_responded',
    label: 'Partially Responded',
  },
  completelyResponded: {
    value: 'completely_responded',
    label: 'Completed',
  },

}))

export {responseStatuses}
