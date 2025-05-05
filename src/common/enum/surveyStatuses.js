import {generateKeys, generateLocalization} from '../utils'

const surveyStatuses = generateLocalization('surveyStatuses', generateKeys({
  open: {
    value: 'open',
    label: 'Open',
  },
  closed: {
    value: 'closed',
    label: 'Closed',
  },

}))

export {surveyStatuses}
