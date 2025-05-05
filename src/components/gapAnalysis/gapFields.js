import {generateKeys, generateLocalization} from '../../common/utils'
import {TextAreaField} from 'redux-form-antd'


const gapFields = generateLocalization('gapFields', generateKeys({

  note: {
    value: 'note',
    label: 'Note',
    component: TextAreaField,
    orderby: 0,
    required: true,
    validate: v => (v ? '' : 'Required'),
  },

}))

export {gapFields}
