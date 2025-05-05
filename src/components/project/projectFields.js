import {generateKeys, generateLocalization, generateYears} from '../../common/utils'
import {SelectField, TextField} from 'redux-form-antd'
const newProject = generateLocalization('newProject', generateKeys({

  companyName: {
    value: 'companyId',
    label: 'Company Name',
    component: SelectField,
    showSearch: true,
    disabled: true,
    notFoundContent: 'Not Found',
    enterButton: 'Search',
    options: [],
    warn: v => (v && v.length > 2 ? '' : 'too short'),
    validate: v => (v ? '' : 'Required'),
  },
  projectName: {
    value: 'title',
    label: 'Project Name',
    component: TextField,
    validate: v => (v ? '' : 'Required'),
  },
  projectYear: {
    value: 'year',
    label: 'Project Year',
    component: SelectField,
    showSearch: true,
    notFoundContent: 'Not Found',
    enterButton: 'Search',
    options: generateYears(),
    warn: v => (v && v.length > 2 ? '' : 'too short'),
    validate: v => (v ? '' : 'Required'),
  },
  numberOfEmployees: {
    value: 'numberOfEmployees',
    label: 'Number of Employees',
    type: 'number',
    component: TextField,
    validate: v => (v ? '' : 'Required'),
  },

}))

export {newProject}
