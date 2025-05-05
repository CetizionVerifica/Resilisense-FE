import {generateKeys, generateLocalization} from '../../../common/utils'
import {SelectField, TextField} from 'redux-form-antd'
const partnerFields = generateLocalization('partnerFields', generateKeys({
  partnerEmail: {
    value: 'partnerEmail',
    label: 'Client email',
    component: TextField,
    validate: v => {
      if (!v) {
        return 'Required'
      } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(v)) {
        return 'Invalid email address'
      }
      return ''
    },
  },
  companyName: {
    value: 'companyId',
    label: 'Company',
    component: SelectField,
    showSearch: true,
    notFoundContent: 'Not Found',
    enterButton: 'Search',
    options: [],
    warn: v => (v && v.length > 2 ? '' : 'too short'),
    validate: v => (v ? '' : 'Required'),
  },
  projectName: {
    value: 'projectName',
    label: 'Project',
    component: SelectField,
    showSearch: true,
    notFoundContent: 'Not Found',
    enterButton: 'Search',
    options: [],
    warn: v => (v && v.length > 2 ? '' : 'too short'),
    validate: v => (v ? '' : 'Required'),
  },
  // projectYear: {
  //   value: 'projectYear',
  //   label: 'Year',
  //   component: SelectField,
  //   showSearch: true,
  //   notFoundContent: 'Not Found',
  //   enterButton: 'Search',
  //   options: [],
  //   warn: v => (v && v.length > 2 ? '' : 'too short'),
  //   validate: v => (v ? '' : 'Required'),
  // },


}))

export {partnerFields}
