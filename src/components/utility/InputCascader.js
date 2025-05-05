import React, {PureComponent} from 'react'
import {Form, Cascader} from 'antd'
const FormItem = Form.Item
const getValidateStatus = (touched, error, warning, valid) => {
  if (touched) {
    if (error) return 'error'
    if (warning) return 'warning'
    if (valid) return 'success'
  }
  return ''
}
class InputCascader extends PureComponent {
  getRenderedComponent() {
    return this.componentRef
  }

  initComponentRef = r => {
    this.componentRef = r
  };

  render() {
    const {label, labelCol, wrapperCol, extra,
      hasFeedback = true, colon, required,
      input: {onChange, value},
      meta: {error, touched, warning, valid},
      options,
      ...rest


    } = this.props
    return (
      <FormItem
        label={label}
        ref={this.initComponentRef}
        wrapperCol={wrapperCol}
        labelCol={labelCol}
        help={touched && (error || warning)}
        hasFeedback={hasFeedback}
        extra={extra}
        validateStatus={getValidateStatus(touched, error, warning, valid)}
        colon={colon}
        {...rest}
        required={required}
      >
        <Cascader
          key={1}

          options={options}
          onChange={(value, selectedOptions) => onChange(value, selectedOptions)}
          style={{width: '100%'}}
          value={value}
        />

      </FormItem>
    )
  }
}

export default InputCascader
