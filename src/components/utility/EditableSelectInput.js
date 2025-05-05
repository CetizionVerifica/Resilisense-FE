import React, {Component} from 'react'
import basicStyle from '../../common/basicStyle'

import {Icon, Select, Form, Row, Col, Button} from 'antd'
const FormItem = Form.Item
const Option = Select.Option
class EditableSelectInput extends Component {
    state = {
      input: this.props.input,
      value: this.props.initialValue,
      title: this.props.title,
      type: this.props.type,
      options: this.props.options,
      editable: false,
      meta: this.props.meta,
      initialValue: this.props.initialValue,
    }
    handleChange = (value) => {
      const {input} = this.state
      input.onChange(value)
      this.setState({value})
    }
    cancel = () => {
      this.setState({value: this.state.initialValue, editable: false})
    }
    check = () => {
      this.setState({editable: false})
      if (this.props.onSave) {
        this.props.onSave()
      }
    }
    edit = () => {
      this.setState({editable: true})
    }
    render() {
      const {value, title, editable, options, type, meta: {touched, error}} = this.state
      const {greyColor} = basicStyle
      return (
        <div className="editable-cell">

          {
            editable ?
              <div className="editable-cell-input-wrapper">
                <FormItem
                  label={title}
                  error={touched && !!error}
                >
                  <Row gutter={8}>
                    <Col span={12}>

                      <Select
                        type={type}
                        value={value}
                        onChange={this.handleChange}
                      >
                        {options && options.map(option =>
                          <Option key={option.value} value={option.value}>{option.label}</Option>)}
                      </Select>
                    </Col>
                    <Col span={12}>
                      <Button onClick={this.check} style={{marginRight: 5}}>Save</Button>
                      <Button onClick={this.cancel}>cancel</Button>
                    </Col>
                  </Row>
                </FormItem>
              </div>
              :
              <div className="editable-cell-text-wrapper">
                {title} <span style={greyColor} >{value || ' '} </span>
                <Icon
                  type="edit"
                  style={greyColor}
                  onClick={this.edit}
                />
              </div>
          }
        </div>
      )
    }
}

export default EditableSelectInput

