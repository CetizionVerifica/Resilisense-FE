import {generateKeys, generateLocalization} from '../utils'
const criteriaValues = generateLocalization('criteriaValues', generateKeys({
  valueY: {
    value: 1,
    label: 'Yes',
    group: 'fileAssessmentCriteria',
    orderby: 0,
  },
  valueN: {
    value: 0,
    label: 'No',
    group: 'fileAssessmentCriteria',
    orderby: 1,
  },
}))

export {criteriaValues}
