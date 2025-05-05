import {generateKeys, generateLocalization} from '../../../common/utils'
import {SelectField, TextField} from 'redux-form-antd'
const supplierFields = generateLocalization('supplierFields', generateKeys({
  supplierEmail: {
    value: 'supplierEmail',
    label: 'Supplier email',
    sizeHalf: false,    
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
    sizeHalf: false,    
    component: SelectField,
    showSearch: true,
    notFoundContent: 'Not Found',
    enterButton: 'Search',
    options: [],
    warn: v => (v && v.length > 2 ? '' : 'too short'),
    validate: v => (v ? '' : 'Required'),
  },
  // projectName: {
  //   value: 'projectYear',
  //   label: 'Project',
  //   component: SelectField,
  //   showSearch: true,
  //   notFoundContent: 'Not Found',
  //   enterButton: 'Search',
  //   options: [],
  //   warn: v => (v && v.length > 2 ? '' : 'too short'),
  //   validate: v => (v ? '' : 'Required'),
  // },
  projectYear: {
    value: 'projectYear',
    label: 'Year',
    component: SelectField,
    showSearch: true,
    notFoundContent: 'Not Found',
    enterButton: 'Search',
    options: [],
    warn: v => (v && v.length > 2 ? '' : 'too short'),
    validate: v => (v ? '' : 'Required'),
  },


}))

export {supplierFields}
