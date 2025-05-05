import {values} from 'lodash'
import {generateKeys, generateLocalization} from '../../common/utils'
import {countries, permission} from '../../common/enum'
import {TextField, SelectField} from 'redux-form-antd'
import MultiSelect from '../utility/multipleSelect'
import {companySectorTypes} from '../../common/enum/companySectors'
import InputCascader from '../utility/InputCascader'
import {lisenceCompany} from '../../common/enum/lisenceCompany'

const userFields = generateLocalization('userFields', generateKeys({

  name: {
    value: 'name',
    label: 'Name',
    component: TextField,
    required: true,
    orderby: 0,
    iseditable: true,
    validate: v => (v ? '' : 'Required'),
  },
  organisation: {
    value: 'organisation',
    label: 'Organisation',
    component: TextField,
    // required: false,
    orderby: 1,
    iseditable: true,
    // validate: v => (v ? '' : 'Required'),
  },
  jobPosition: {
    value: 'jobPosition',
    label: 'Job position',
    component: TextField,
    required: true,
    orderby: 1,
    iseditable: true,
    validate: v => (v ? '' : 'Required'),
  },
  email: {
    value: 'email',
    label: 'Email',
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
  permission: {
    value: 'permission',
    label: 'Permission',
    component: SelectField,
    width: '100%',
    required: true,
    options: values(permission),
    validate: v => (v ? '' : 'Required'),
    filterOption: (input, option) =>
      option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0,
  },
  phone: {
    value: 'phone',
    label: 'Phone',
    component: TextField,
    required: true,
    orderby: 3,
    iseditable: true,
    validate: v => (v ? '' : 'Required'),
  },
  extension: {
    value: 'extension',
    label: 'Extension',
    component: TextField,
    iseditable: true,
    required: false,
    orderby: 4,
  },
  fax: {
    value: 'personFax',
    label: 'Fax',
    component: TextField,
    required: false,
    iseditable: true,
    orderby: 5,
  },
  comments: {
    value: 'comments',
    label: 'Comments',
    component: TextField,
    orderby: 0,
  },

}))
const required = value => value ? undefined : 'Required'
const minValue = min => value =>
  value && value.length < min ? `Must be at least ${min}` : undefined
const passwordsMatch = (value, allValues) =>
  value !== allValues.newPassword ? 'Passwords don\'t match' : undefined
const minValue6 = minValue(5)
const strengPassword = value => value && /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/.test(value) ? undefined : 'Required at least one number one symbol, and at least 8 characters'

const newPasswordFields = generateLocalization('newPasswordFields', generateKeys({
  newPassword: {
    ref: 'password',
    value: 'newPassword',
    label: 'New Password',
    component: TextField,
    required: true,
    orderby: 3,
    type: 'password',
    iseditable: true,
    validate: [required, strengPassword],
  },
  retypepassword: {
    ref: 'retypepassword',
    value: 'retypepassword',
    label: 'Retype New Password',
    component: TextField,
    required: true,
    orderby: 3,
    type: 'password',
    iseditable: true,
    validate: [required, strengPassword, passwordsMatch],
  },
}))

const changePasswordFields = generateLocalization('changePasswordFields', generateKeys({

  oldPassword: {
    ref: 'password',
    value: 'oldpassword',
    label: 'Current Password',
    component: TextField,
    required: true,
    orderby: 3,
    type: 'password',
    iseditable: true,
    validate: [required],
  },
  newPassword: {
    ref: 'password',
    value: 'newPassword',
    label: 'New Password',
    component: TextField,
    required: true,
    orderby: 3,
    type: 'password',
    iseditable: true,
    validate: [required, strengPassword],
  },
  retypepassword: {
    ref: 'retypepassword',
    value: 'retypepassword',
    label: 'Retype New Password',
    component: TextField,
    required: true,
    orderby: 3,
    type: 'password',
    iseditable: true,
    validate: [required, strengPassword, passwordsMatch],
  },


}))
const agencyFields = generateLocalization('agencyFields', generateKeys({

  name: {
    value: 'name',
    label: 'Name',
    component: TextField,
    required: true,
    orderby: 0,
    validate: v => (v ? '' : 'Required'),
  },
  descriptions: {
    value: 'descriptions',
    label: 'Descriptions',
    component: TextField,
    required: true,
    orderby: 1,
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
  phone: {
    value: 'personPhone',
    label: 'Phone',
    component: TextField,
    required: true,
    orderby: 3,
    validate: v => (v ? '' : 'Required'),
  },
  website: {
    value: 'website',
    label: 'Website',
    component: TextField,
    addonBefore: 'http://',
    orderby: 2,
  },
  country: {
    value: 'country',
    label: 'Country',
    component: SelectField,
    orderby: 3,
    showSearch: true,
    notFoundContent: 'Not Found',
    enterButton: 'Search',
    required: true,
    validate: v => (v ? '' : 'Required'),
    options: values(countries),
    filterOption: (input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0,
  },


}))

const updateUserFields = generateLocalization('updateUserFields', generateKeys({

  name: {
    value: 'name',
    label: 'Name',
    component: TextField,
    required: true,
    orderby: 0,
    iseditable: true,
    validate: v => (v ? '' : 'Required'),
  },
  jobPosition: {
    value: 'jobPosition',
    label: 'Job position',
    component: TextField,
    required: true,
    orderby: 1,
    iseditable: true,
    validate: v => (v ? '' : 'Required'),
  },
  email: {
    value: 'email',
    label: 'Email',
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
  phone: {
    value: 'phone',
    label: 'Phone',
    component: TextField,
    required: true,
    orderby: 3,
    iseditable: true,
    validate: v => (v ? '' : 'Required'),
  },
  
  sectorType: {
    value: 'sectorType',
    label: 'Sector / Industry',
    showSearch: true,
    notFoundContent: 'Not Found',
    enterbutton: 'Search',
    component: InputCascader,
    width: '100%',
    required: true,
    hideonedit: 'true',
    options: companySectorTypes,
    validate: v => (v ? '' : 'Required'),
    filterOption: (input, option) =>
      option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0,
  },
  serviceProductInfo: {
    value: 'serviceProductInfo',
    label: 'Further details on product/service',
    component: TextField,
    required: true,
    validate: v => (v ? '' : 'Required'),
    orderby: 2,
  },
  agencies: {
    value: 'agencies',
    label: 'Agencies',
    width: '100%',
    component: MultiSelect,
    notFoundContent: 'Not Found',
    required: true,
    
  },
  companies: {
    value: 'companies',
    label: 'Companies',
    width: '100%',
    component: MultiSelect,
    notFoundContent: 'Not Found',
    required: true,
  },
  website: {
    value: 'website',
    label: 'Website',
    component: TextField,
    orderby: 4,
    iseditable: true,
  },
  country: {
    value: 'country',
    label: 'Country',
    component: SelectField,
    orderby: 3,
    showSearch: true,
    notFoundContent: 'Not Found',
    enterButton: 'Search',
    options: values(countries),
    filterOption: (input, option) =>
      option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0,
  },
  lisence: {
    value: 'lisence',
    label: 'Licence',
    width: '100%',
    component: MultiSelect,
    notFoundContent: 'Not Found',
    options: values(lisenceCompany),
  },
 
  active: {
    value: 'active',
    label: 'Active',
    component: SelectField,
    width: '100%',
    required: true,
    options: [{ label: 'True', value: 'true'}, { label: 'False', value: 'false'}],
    validate: v => (v ? '' : 'Required'),
  }
}))


const addUserFields = generateLocalization('addUserFields', generateKeys({

  name: {
    value: 'name',
    label: 'Name',
    component: TextField,
    orderby: 0,
    required: true,
    warn: v => (v && v.length > 2 ? '' : 'too short'),
    validate: v => (v ? '' : 'Required'),
  },
  users: {
    value: 'users',
    label: 'Users',
    component: TextField,
    disabled: true,
  },
  email: {
    value: 'email',
    label: 'Email',
    component: TextField,
    orderby: 1,
    required: true,
    validate: v => {
      if (!v) {
        return 'Required'
      } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(v)) {
        return 'Invalid email address'
      }
      return ''
    },
  },
  password: {
    value: 'password',
    label: 'Password',
    type: 'password',
    component: TextField,
    orderby: 6,
    required: true,
    iseditable: true,
    validate: [required, strengPassword],
  },
  sectorType: {
    value: 'sectorType',
    label: 'Sector / Industry',
    showSearch: true,
    notFoundContent: 'Not Found',
    enterbutton: 'Search',
    component: InputCascader,
    width: '100%',
    required: true,
    hideonedit: 'true',
    options: companySectorTypes,
    validate: v => (v ? '' : 'Required'),
    filterOption: (input, option) =>
      option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0,
  },
  serviceProductInfo: {
    value: 'serviceProductInfo',
    label: 'Further details on product/service',
    component: TextField,
    required: true,
    validate: v => (v ? '' : 'Required'),
    orderby: 2,
  },
  agencies: {
    value: 'agencies',
    label: 'Agencies',
    width: '100%',
    component: MultiSelect,
    notFoundContent: 'Not Found',
    required: true,
  },
  companies: {
    value: 'companies',
    label: 'Companies',
    width: '100%',
    component: MultiSelect,
    notFoundContent: 'Not Found',
    required: true,
  },
  website: {
    value: 'website',
    label: 'Website',
    component: TextField,
    addonbefore: 'http://',
    orderby: 2,
  },
  country: {
    value: 'country',
    label: 'Country',
    component: SelectField,
    orderby: 3,
    showSearch: true,
    notFoundContent: 'Not Found',
    enterButton: 'Search',
    options: values(countries),
    filterOption: (input, option) =>
      option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0,
  },
  lisence: {
    value: 'lisence',
    label: 'Licence',
    width: '100%',
    component: MultiSelect,
    notFoundContent: 'Not Found',
    options: values(lisenceCompany),
  },
  phone: {
    value: 'phone',
    label: 'Phone',
    component: TextField,
    orderby: 4,
  }

  

}))


export {userFields, agencyFields, changePasswordFields, newPasswordFields, updateUserFields,addUserFields}
