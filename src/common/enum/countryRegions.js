import {generateKeys, generateLocalization} from '../utils'

const regions = generateLocalization('regions', generateKeys({
  europe: {
    value: 'europe',
    label: 'Europe',
  },
  arabStates: {
    value: 'arabStates',
    label: 'Arab States',
  },
  asiaAndPacific: {
    value: 'asiaAndPacific',
    label: 'Asia & Pacific',
  },
  southLatinAmerica: {
    value: 'southLatinAmerica',
    label: 'South/Latin America',
  },
  africa: {
    value: 'africa',
    label: 'Africa',
  },
  northAmerica: {
    value: 'northAmerica',
    label: 'North America',
  },
}))

export {regions}
