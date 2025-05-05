import React, {Component, useState, useEffect } from 'react'
import {Link} from 'react-router-dom'
import moment from 'moment'
import {injectIntl} from 'react-intl'
import ImageCellView from './imageCell'
import {Icon, Input, Popconfirm, Select, Tag, Progress} from 'antd'
const Option = Select.Option

const DateCell = data => {
  return (<p>{moment.unix(data > 1000000000000 ? data / 1000 : data).format('Do MMM YYYY')}</p>)
}
const ImageCell = src => <ImageCellView src={src} />
const LinkCell = (link, href) => <a href={href || '#'}>{link}</a>
const TextCell = text => <p>{text}</p>
const TagCell = (color, msg) => <Tag color={color}>{msg}</Tag>
const IconCell = actions => actions.map(action => {
  return (
    <Icon
      key={action.key}
      type={action.icon}
      className="isoEditIcon"
      style={{color: action.iconColor || '#08c'}}
    />
  )
})
const ActionCell = actions => actions.map(action => {
  return (
    <Link
      to={action.link}
      onClick={action.onClick}
      key={action.key}
      style={{textAlign: 'center', marginRight: 30}}
    >
      <Icon
        type={action.icon}
        className="isoEditIcon"
        style={{color: action.iconColor || '#08c'}}
      />
    </Link>

  )
})
const NewTabCell = actions => actions.map(action => {
  return (
    <a
      href={action.link}
      target="_blank"
      key={action.key}
      style={{textAlign: 'center', marginRight: 30}}
    >
      <Icon
        type={action.icon}
        className="isoEditIcon"
        style={{color: action.iconColor || '#08c'}}
      />
    </a>

  )
})
const ProgressCell = progress => {
  return (
    <div>
      <Progress percent={progress} format={percent => percent + '%'} />
    </div>
  )
}
//backgroundColor: find(options, {value: 0}).color
const DropdownCell = injectIntl((props) => {
  const {callBack, options, defaultValue, intl: {formatMessage}, disabled, allowClear} = props
  const [value, setValue] = useState(defaultValue)
  useEffect(() => {
    setValue(props.defaultValue)
  }, [props.defaultValue])
  return (
    <div>
      <Select
        defaultValue={value}
        value={value}
        style={{width: 200}}
        disabled={disabled}
        allowClear={allowClear}
        onChange={(value) => {
          setValue(value)
          callBack(value)
        }}
      >
        {options.map(option => (<Option value={option.value}
          key={option.key} style={{backgroundColor: option.color || '#fff'}}
        >{formatMessage(option.localization)}</Option>))}
      </Select>
    </div>
  )
})

const EditableCell = ({editable, value, onChange}) => (
  <div>
    {editable
      ? <Input style={{margin: '-5px 0'}} value={value} onChange={e => onChange(e.target.value)} />
      : value
    }
  </div>
)

class EditableCellAction extends Component {
  constructor(props) {
    super(props)
    this.handleChange = this.handleChange.bind(this)
    this.check = this.check.bind(this)
    this.edit = this.edit.bind(this)
    this.state = {
      value: this.props.value,
      editable: false,
    }
  }
  handleChange(event) {
    const value = event.target.value
    this.setState({value})
  }
  check() {
    this.setState({editable: false})
    if (this.props.onChange) {
      this.props.onChange(
        this.state.value,
        this.props.columnsKey,
        this.props.index,
      )
    }
  }
  edit() {
    this.setState({editable: true})
  }
  cancel(key) {
    const newData = [...this.state.data]
    const target = newData.filter(item => key === item.key)[0]
    if (target) {
      Object.assign(target, this.cacheData.filter(item => key === item.key)[0])
      delete target.editable
      this.setState({data: newData})
    }
  }
  render() {
    const {value, editable} = this.state
    const {index, onSaveCell} = this.props
    return (
      <div className="editable-row-operations">
        {
          editable ?
            <span>
              <a onClick={() => onSaveCell(value)}>Save</a>
              <Popconfirm title="Sure to cancel?" onConfirm={() =>
                this.cancel(index)}
              >
                <a>Cancel</a>
              </Popconfirm>
            </span>
            : <a onClick={() => this.edit(index)}>Edit</a>
        }
      </div>
    )
  }
}
class DeleteCell extends Component {
  render() {
    const {index, onDeleteCell} = this.props
    return (
      <Popconfirm
        title="Sure to delete?"
        okText="DELETE"
        cancelText="No"
        onConfirm={() => onDeleteCell(index)}
      >
        <a><Icon type="delete" className="isoEditIcon" /></a>
      </Popconfirm>
    )
  }
}


export {
  DateCell,
  ImageCell,
  LinkCell,
  IconCell,
  TextCell,
  EditableCell,
  EditableCellAction,
  ActionCell,
  NewTabCell,
  DropdownCell,
  TagCell,
  DeleteCell,
  ProgressCell,
}
