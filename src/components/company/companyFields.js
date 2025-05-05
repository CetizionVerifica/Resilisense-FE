import {values} from 'lodash'
import {generateKeys, generateLocalization} from '../../common/utils'
import {countries} from '../../common/enum/countries'
import {lisenceCompany} from '../../common/enum/lisenceCompany'
import {SelectField, TextField, TextAreaField} from 'redux-form-antd'
import {companySectorTypes} from '../../common/enum/companySectors'
import InputCascader from '../utility/InputCascader'
import MultiSelect from '../utility/multipleSelect'

// import TextArea from 'antd/lib/input/TextArea'
const required = value => value ? undefined : 'Required'
const strengPassword = value => value && /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/.test(value) ? undefined : 'Required at least one number one symbol, and at least 8 characters'

const companyInformation = generateLocalization('companyInformation', generateKeys({

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
  // percentageServiceProduct: {
  //   value: 'percentageServiceProduct',
  //   label: 'What percentage of your products/services are for this client',
  //   component: TextField,
  //   addonAfter: '%',
  //   type: 'number',
  //   required: true,
  //   validate: v => (v ? '' : 'Required'),
  //   orderby: 2,
  // },
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
  },
  fax: {
    value: 'fax',
    label: 'Fax',
    component: TextField,
    orderby: 5,
  },
 

}))


const contactPerson = generateLocalization('contactPerson', generateKeys({

  personName: {
    value: 'personName',
    label: 'Contact Name',
    component: TextField,
    orderby: 0,
    required: true,
    validate: v => (v ? '' : 'Required'),
  },
  jobPosition: {
    value: 'jobPosition',
    label: 'Job position',
    component: TextField,
    orderby: 1,
    required: true,
    validate: v => (v ? '' : 'Required'),
  },
  personEmail: {
    value: 'personEmail',
    label: 'Contact Email',
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
  personPhone: {
    value: 'personPhone',
    label: 'Contact Phone',
    component: TextField,
    orderby: 3,
  },
  personExtetion: {
    value: 'personExtetion',
    label: 'Extension',
    type: 'number',
    component: TextField,
    orderby: 4,
  },
  personFax: {
    value: 'personFax',
    label: 'Fax',
    component: TextField,
    orderby: 5,
  },
  password: {
    value: 'password',
    label: 'Password',
    type: 'password',
    component: TextField,
    orderby: 6,
    required: true,
    validate: [required, strengPassword],
  },


}))

const internalEmailTemplates = generateLocalization('internalEmailTemplates', generateKeys({

  internalEmailTemplate: {

    value: 'internalEmailTemplate',
    label: 'Internal Email Template',
    component: TextAreaField,
    orderby: 0,
    required: true,
    validate: v => (v ? '' : 'Required'),
  },
  internalReminderEmailTemplate: {
    value: 'internalReminderEmailTemplate',
    label: 'Internal Reminder Email Template',
    component: TextAreaField,
    orderby: 1,
    required: true,
    validate: v => (v ? '' : 'Required'),
  },

}))

const externalEmailTemplates = generateLocalization('externalEmailTemplates', generateKeys({

  externalEmailTemplate: {
    value: 'externalEmailTemplate',
    label: 'External Email Template',
    component: TextAreaField,
    orderby: 0,
    required: true,
    validate: v => (v ? '' : 'Required'),
  },
  externalReminderEmailTemplate: {

    value: 'externalReminderEmailTemplate',
    label: 'External Reminder Email Template',
    component: TextAreaField,
    orderby: 1,
    required: true,
    validate: v => (v ? '' : 'Required'),
  },

}))


export {companyInformation, contactPerson, internalEmailTemplates, externalEmailTemplates}
