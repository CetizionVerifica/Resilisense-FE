import {generateKeys, generateLocalization} from '../../common/utils'
import {TextField} from 'redux-form-antd'


const stackholderFields = generateLocalization('stackholderFields', generateKeys({
  companyName: {
    value: 'companyName',
    label: 'Company',
    type: 'text',
    component: TextField,
    orderby: 0,
    required: true,
    validate: v => (v ? '' : 'Required'),
  },
  name: {
    value: 'name',
    label: 'Name',
    type: 'text',
    component: TextField,
    orderby: 0,
    required: true,
    validate: v => (v ? '' : 'Required'),
  },
  jobPosition: {
    value: 'jobPosition',
    label: 'Job position',
    type: 'text',
    component: TextField,
    orderby: 1,
    required: true,
    validate: v => (v ? '' : 'Required'),
  },
  email: {
    value: 'email',
    label: 'Email',
    type: 'email',
    component: TextField,
    orderby: 2,
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
  phone: {
    value: 'phone',
    label: 'Phone',
    component: TextField,
    orderby: 3,
    required: true,
    validate: v => (v ? '' : 'Required'),
  },
  extention: {
    value: 'extention',
    label: 'Extension',
    type: 'number',
    component: TextField,
    orderby: 4,
  },
  fax: {
    value: 'fax',
    label: 'Fax',
    component: TextField,
    orderby: 5,
  },
  /*active: {
    value: 'active',
    label: 'Active',
    type: SwitchField,
    orderby: 5,
  },*/

}))

export {stackholderFields}
