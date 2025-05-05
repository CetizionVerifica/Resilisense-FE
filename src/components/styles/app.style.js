import styled from 'styled-components'
import {palette, font} from 'styled-theme'

const AppHolder = styled.div`
  font-family: ${font('primary', 0)};

  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
  a,
  p,
  li,
  input,
  textarea,
  span,
  div,
  img,
  svg {
    &::selection {
      background: ${palette('primary', 0)};
      color: #fff;
    }
  }
  

`

export default AppHolder
