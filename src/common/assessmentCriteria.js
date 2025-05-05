import {generateKeys, generateLocalization} from './utils'
const assessmentCriteria = generateLocalization('assessmentCriteria', generateKeys({
  /* Organizational Governance */
  authentic: {
    value: 'authentic',
    label: 'Authentic',
    orderby: 0,
  },
  upToDate: {
    value: 'upToDate',
    label: 'Up To Date',
    orderby: 1,
  },
  communicated: {
    value: 'communicated',
    label: 'Communicated',
    orderby: 2,
  },
}))

export {assessmentCriteria}
