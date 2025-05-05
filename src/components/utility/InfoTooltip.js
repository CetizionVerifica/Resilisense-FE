import React from 'react'
import {Popover, Icon} from 'antd'

export default props => {
  const placementValue = props.placement || 'left'
  return (
    <Popover content={props.content} placement={placementValue} title={props.title} trigger="click">
      <Icon type="info-circle-o" style={{fontSize: 20, cursor: 'pointer'}} />
    </Popover>
  )
}
