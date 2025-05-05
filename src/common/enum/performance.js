import {generateKeys, generateLocalization} from '../utils'
const performanceView = generateLocalization('performanceView', generateKeys({
  performance: {
    value: 'performanceValue',
    label: 'Performance',
    orderby: 0,
    color: 'blue',
  },
  relevance: {
    value: 'relevanceValue',
    label: 'Relevance',
    orderby: 1,
    color: 'orange',
  },
  // relevanceWeight: {
  //   value: 'relevanceWeightValue',
  //   label: 'Weight',
  //   orderby: 2,
  //   color: 'green',
  // },
  // weightValue: {
  //   value: 'WeightValue',
  //   label: 'Weighted Performance',
  //   orderby: 3,
  //   color: 'cyan',
  // },

}))

export {performanceView}
