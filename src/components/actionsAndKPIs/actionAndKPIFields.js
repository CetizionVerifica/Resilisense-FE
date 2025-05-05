import React, {PureComponent} from 'react'
import {Form, Cascader} from 'antd'
import {generateKeys, generateLocalization, coreSubjectOptions} from '../../common/utils'
import {TextField, TextAreaField} from 'redux-form-antd'
const FormItem = Form.Item

class InputCascader extends PureComponent {
  getRenderedComponent() {
    return this.componentRef
  }

  initComponentRef = r => {
    this.componentRef = r
  };

  render() {
    const {label, labelCol, wrapperCol, help, extra,
      validateStatus, hasFeedback = true, colon, required,
      input: {onChange},
      ...rest

    } = this.props
    return (
      <FormItem
        label={label}
        ref={this.initComponentRef}
        wrapperCol={wrapperCol}
        labelCol={labelCol}
        help={help}
        hasFeedback={hasFeedback}
        extra={extra}
        validateStatus={validateStatus}
        colon={colon}
        required={required}
      >
        <Cascader
          key={1}
          {...rest}
          options={coreSubjectOptions}
          onChange={(value, selectedOptions) => onChange(value, selectedOptions)}
          style={{width: '100%'}}
        />

      </FormItem>
    )
  }
}


const actionAndKPIFields = generateLocalization('actionAndKPI', generateKeys({

  issueOfInterest: {
    name: 'issueOfInterest',
    label: 'Issue of Interest',
    type: 'text',
    showSearch: true,
    notFoundContent: 'Not Found',
    component: InputCascader,
    orderby: 0,
    ref: 'coreSubject',
    withRef: true,
    required: true,
    group: 'company',
    validate: v => (v ? '' : 'Required'),
  },
  majorIssues: {
    name: 'majorIssues',
    label: 'Major issues identified through Gap Analysis',
    group: 'company',
  },
  action: {
    name: 'action',
    label: 'Action',
    type: 'text',
    component: TextAreaField,
    autosize: {
      minRows: 2,
      maxRows: 6,
    },
    inputType: 'textField',
    orderby: 1,
    required: true,
    iseditable: true,
    group: 'company',
    validate: v => (v ? '' : 'Required'),
  },
  kpi: {
    name: 'kpi',
    label: 'KPI',
    type: 'text',
    component: TextAreaField,
    autosize: {
      minRows: 2,
      maxRows: 6,
    },
    inputType: 'textField',
    orderby: 2,
    group: 'company',
    required: true,
    iseditable: true,
    validate: v => (v ? '' : 'Required'),
  },
  baselinePerformance: {
    name: 'baselinePerformance',
    label: 'Current Performance',
    component: TextField,
    orderby: 3,
    required: true,
    iseditable: false,
    inputType: 'textField',
    group: 'company',
    validate: v => (v ? '' : 'Required'),
    normalize: (value) => {
      const match = value && value.match(/(\d+\.?\d{0,2})/)
      return match ? match[1] : ''
    },
  },
  targetPerformanceBase: {
    name: 'targetPerformance', // CSR-101
    // name: 'targetPerformanceBase', CSR-101
    label: 'Target Performance',
    component: TextField,
    orderby: 3,
    required: true,
    iseditable: false,
    inputType: 'textField',
    group: 'company',
    validate: v => (v ? '' : 'Required'),
    normalize: (value) => {
      const match = value && value.match(/(\d+\.?\d{0,2})/)
      return match ? match[1] : ''
    },
  },
  performance: {
    name: 'performance',
    label: 'Performance',
    component: TextField,
    orderby: 3,
    required: true,
    iseditable: false,
    group: 'project',
    inputType: 'textField',
    validate: v => (v ? '' : 'Required'),
    normalize: (value) => {
      const match = value && value.match(/(\d+\.?\d{0,2})/)
      return match ? match[1] : ''
    },
  },
  targetPerformance: {
    name: 'targetPerformance',
    label: 'Target Performance',
    component: TextField,
    orderby: 3,
    group: 'project',
    required: true,
    iseditable: false,
    inputType: 'textField',
    validate: v => (v ? '' : 'Required'),
    normalize: (value) => {
      const match = value && value.match(/(\d+\.?\d{0,2})/)
      return match ? match[1] : ''
    },
  },

}))

export {actionAndKPIFields}
