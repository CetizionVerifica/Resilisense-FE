import React, {Component} from 'react'
import basicStyle from '../../common/basicStyle'
import {Icon, Input, Form, Row, Col, Button} from 'antd'
const FormItem = Form.Item
class EditableInput extends Component {
    state = {
      input: this.props.input,
      value: this.props.initialValue,
      title: this.props.title,
      type: this.props.type,
      editable: false,
      meta: this.props.meta,
      initialValue: this.props.initialValue,
    }
    handleChange = (e) => {
      const value = e.target.value
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
      const {value, title, editable, input, type, meta: {touched, error}} = this.state
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
                      <Input
                        {...input}
                        value={value}
                        type={type}
                        onChange={this.handleChange}
                        onPressEnter={this.check}
                      />
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

export default EditableInput

