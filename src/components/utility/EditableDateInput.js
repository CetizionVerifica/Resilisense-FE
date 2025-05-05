import React, {Component} from 'react'
import moment from 'moment'
import basicStyle from '../../common/basicStyle'
import {Icon, DatePicker, Form, Row, Col, Button} from 'antd'
const FormItem = Form.Item
const dateFormat = 'DD/MM/YYYY'
class EditableDateInput extends Component {
    state = {
      input: this.props.input,
      value: this.props.initialValue,
      title: this.props.title,
      type: this.props.type,
      editable: false,
      meta: this.props.meta,
    }
    handleChange = (value) => {
      const {input} = this.state
      input.onChange(moment(value).unix())
      this.setState({value: moment(value).unix()})
    }
    cancel = () => {
      this.setState(prveState => ({value: prveState.value, editable: false}))

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
      const {value, title, editable, type, meta: {touched, error}} = this.state
      const dateValue = parseFloat(value) ? moment.unix(parseFloat(value)).format(dateFormat) : null
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
                      <DatePicker
                        type={type}
                        value={dateValue ?
                          moment(dateValue, dateFormat) :
                          moment(new Date(), dateFormat)
                        }
                        onChange={this.handleChange}
                        format={dateFormat}
                      />
                    </Col>
                    <Col span={12}>
                      <Button onClick={this.check} style={{marginRight: 5}}>Save</Button>
                      <Button onClick={this.check}>cancel</Button>
                    </Col>
                  </Row>
                </FormItem>
              </div>
              :
              <div className="editable-cell-text-wrapper">
                {title} <span style={greyColor} >
                  {dateValue}
                </span>
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

export default EditableDateInput

