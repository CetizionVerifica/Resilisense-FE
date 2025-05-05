import {generateKeys, generateLocalization} from './utils'
const uploadedDocuments = generateLocalization('gapAnalysisQuestions', generateKeys({
  uploadedDocuments: {
    value: 'uploadedDocuments',
    label: 'Documentation Upload',
    orderby: 1,
  },
}))

export {uploadedDocuments}
