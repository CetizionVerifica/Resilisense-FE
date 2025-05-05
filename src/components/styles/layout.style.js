import styled from 'styled-components'
//import {palette} from 'styled-theme'
//import {borderRadius} from '../../common/styleUtils'

const Layouts = ComponentName => styled(ComponentName)`

  top: 0px;
  position: absolute;
  right: ${props => (props['data-rtl'] === 'rtl' ? '200px' : '0')};
  left: ${props => (props['data-rtl'] === 'rtl' ? '0' : '200px')};
  bottom: 0px;
  overflow: hidden;

`

export default Layouts
