import {generateKeys, generateLocalization} from '../utils'
const issueLevel = generateLocalization('issueLevel', generateKeys({
  level1: {
    value: 'level1',
    label: 'Minor',
    level: 1,
    color: '#77d88b',
  },
  level2: {
    value: 'level2',
    label: 'Minor',
    level: 2,
    color: '#c6e0b3',
  },
  level3: {
    value: 'level3',
    label: 'Minor',
    level: 3,
    color: '#ffd967',
  },
  level4: {
    value: 'level4',
    label: 'Minor',
    level: 4,
    color: '#feb92c',
  },
  level5: {
    value: 'level5',
    label: 'Minor',
    level: 5,
    color: '#fe9221',
  },
  level6: {
    value: 'level6',
    label: 'Major',
    level: 6,
    color: '#fd6c1c',
  },
  level7: {
    value: 'level7',
    label: 'Major',
    level: 7,
    color: '#fd2600',
  },
  level8: {
    value: 'level8',
    label: 'Major',
    level: 8,
    color: '#df1f00',
  },
  level9: {
    value: 'level9',
    label: 'Major',
    level: 9,
    color: '#c00700',
  },

}))

const issueChartColor = generateLocalization('issueChartColor', generateKeys({
  level1: {
    value: 'level1',
    label: 'Very Good (80 - 100)',
    level: 1,
    color: '#77d88b',
  },
  level2: {
    value: 'level2',
    label: 'Good (60 - 80)',
    level: 2,
    color: '#c6e0b3',
  },
  level3: {
    value: 'level3',
    label: 'Neutral (40 - 60)',
    level: 3,
    color: '#ffd967',
  },
  level4: {
    value: 'level4',
    label: 'Poor (20 - 40)',
    level: 4,
    color: '#fe9221',
  },
  level5: {
    value: 'level5',
    label: 'Very Poor (0 - 20)',
    level: 5,
    color: '#c00700',
  },

}))

export {issueLevel, issueChartColor}
