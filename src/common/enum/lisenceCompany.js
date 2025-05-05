import {generateKeys, generateLocalization} from '../utils'
const lisenceCompany = generateLocalization('annualReviewQuestions.title', generateKeys({
  gap: {
    value: 'gap',
    label: 'Gap Analysis',
  },
  humanRights: {
    value: 'materiality',
    label: 'Materiality Assessment',
  },
  labour: {
    value: 'actions',
    label: 'Actions & KPIs',
  },
}))

export {lisenceCompany}
