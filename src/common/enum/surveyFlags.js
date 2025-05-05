import React from 'react'
import {generateKeys, generateLocalization} from '../utils'

const surveyFlags = generateLocalization('surveyFlags', generateKeys({
  internal: {
    value: 'internal',
    labelTab: <span>Internal Survey</span>,
    label: 'Internal Survey',
  },
  external: {
    value: 'external',
    labelTab: <span>External Survey</span>,
    label: 'External Survey',
  },

}))

export {surveyFlags}
