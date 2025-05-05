import {values} from 'lodash'
import {generateKeys, generateLocalization} from '../../common/utils'
import {countries, permission} from '../../common/enum'
import {TextField, SelectField} from 'redux-form-antd'
import MultiSelect from '../utility/multipleSelect'

const agencyFields = generateLocalization('agencyFields', generateKeys({

  name: {
    value: 'name',
    label: 'Name',
    component: TextField,
    required: true,
    orderby: 0,
    validate: v => (v ? '' : 'Required'),
  },
  email: {
    value: 'email',
    label: 'Email',
    component: TextField,
    required: true,
    orderby: 2,
    validate: v => {
      if (!v) {
        return 'Required'
      } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(v)) {
        return 'Invalid email address'
      }
      return ''
    },
  },
  date: {
    value: 'date',
    label: 'Date',
    component: TextField,
    required: true,
    orderby: 3,
    validate: v => (v ? '' : 'Required'),
  },
  numberOfUser: {
    value: 'numberOfUser',
    label: 'Number of Users',
    component: TextField,
    orderby: 2,
  },
  numberOfProject: {
    value: 'numberOfProject',
    label: 'Number of Projects',
    component: TextField,
    orderby: 3,
    validate: v => (v ? '' : 'Required'),
  },
  numberOfCompany: {
    value: 'numberOfCompany',
    label: 'Number of Companies',
    component: TextField,
    orderby: 3,
    validate: v => (v ? '' : 'Required'),
  },
  updatedBy: {
    value: 'updatedBy',
    label: 'Update by user',
    component: TextField,
    orderby: 3,
    validate: v => (v ? '' : 'Required'),
  },

}))

const updateAgencyFields = generateLocalization('updateAgencyFields', generateKeys({

  name: {
    value: 'name',
    label: 'Name',
    component: TextField,
    disabled: true,
    required: true,
    orderby: 0,
    iseditable: true,
    validate: v => (v ? '' : 'Required'),
  },
  email: {
    value: 'email',
    label: 'Email',
    disabled: true,
    component: TextField,
    required: true,
    orderby: 2,
    iseditable: true,
    validate: v => {
      if (!v) {
        return 'Required'
      } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(v)) {
        return 'Invalid email address'
      }
      return ''
    },
  },
  date: {
    value: 'date',
    label: 'Date',
    component: TextField,
    disabled: true,
    required: true,
    orderby: 0,
    iseditable: true,
    validate: v => (v ? '' : 'Required'),
  },
  updatedBy: {
    value: 'updatedBy',
    label: 'Updated By',
    component: TextField,
    disabled: true,
    required: true,
    orderby: 0,
    iseditable: true,
    validate: v => (v ? '' : 'Required'),
  },
  users: {
    value: 'users',
    label: 'Users',
    width: '100%',
    component: MultiSelect,
    notFoundContent: 'Not Found',
  },
  companies: {
    value: 'companies',
    label: 'Companies',
    width: '100%',
    component: MultiSelect,
    notFoundContent: 'Not Found',
  },
  projects: {
    value: 'projects',
    label: 'projects',
    width: '100%',
    component: MultiSelect,
    notFoundContent: 'Not Found',
  },
}))

export { agencyFields, updateAgencyFields}
