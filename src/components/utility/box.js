import React from 'react'
import BoxTitleWrapper from './boxTitle'
import {BoxWrapper} from './box.style'

export default props => (
  <BoxWrapper {...props} className="isoBoxWrapper">
    <BoxTitleWrapper title={props.title} subtitle={props.subtitle} />
    {props.children}
  </BoxWrapper>
)
