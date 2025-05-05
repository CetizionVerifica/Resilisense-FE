import {generateKeys, generateLocalization} from '../../common/utils'

const surveyFields = generateLocalization('surveyFields', generateKeys({
  title: {
    value: 'title',
    label: 'Title',
  },
  createdDate: {
    value: 'createdDate',
    label: 'Created Date',
  },
  modifiedDate: {
    value: 'modifiedDate',
    label: 'Modified Date',
  },
  project: {
    value: 'project',
    label: 'Project',
  },
  year: {
    value: 'year',
    label: 'Year',
  },
  company: {
    value: 'company',
    label: 'Company',
  },
  status: {
    value: 'status',
    label: 'Status',
  },
  sendDate: {
    value: 'sendDate',
    label: 'Send Date',
  },
  reminderSendDate: {
    value: 'reminderSendDate',
    label: 'Reminder Send Date',
  },
  closeDate: {
    value: 'closeDate',
    label: 'Close Date',
  },
  email: {
    value: 'email',
    label: 'Email',
  },
  name: {
    value: 'name',
    label: 'Name',
  },
  jobPosition: {
    value: 'jobPosition',
    label: 'Job Position',
  },
  phone: {
    value: 'phone',
    label: 'Phone',
  },
  responseDate: {
    value: 'responseDate',
    label: 'Response Date',
  },
  class: {
    value: 'class',
    label: 'Class',
  },
}))

export {surveyFields}
