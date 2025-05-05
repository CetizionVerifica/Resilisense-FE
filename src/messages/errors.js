import {defineMessages} from 'react-intl'
export const errorsMessages = defineMessages({
  required: {
    id: 'required', // login no email and/or password entry
    defaultMessage: 'Required',
  },
  invalidEmailAddress: {
    id: 'invalidEmailAddress',
    defaultMessage: 'Invalid Email Address',
  },
  badLoginInfo: {
    id: 'badLoginInfo',
    defaultMessage: 'Bad login info',
  },
})
