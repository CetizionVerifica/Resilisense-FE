import styled from 'styled-components'
import {palette} from 'styled-theme'
import {
  transition,
  borderRadius,
} from '../../common/styleUtils'

const InputSearchWrapper = ComponentName => styled(ComponentName)`
  &.ant-input-affix-wrapper {
    .ant-input {
      width: 100%;
      cursor: text;
      font-size: 13px;
      line-height: 1.5;
      color: ${palette('text', 1)};
      background-color: #fff;
      background-image: none;
      border: 1px solid ${palette('border', 0)};
      ${borderRadius('4px')};
      ${transition()};

      &:focus {
        border-color: ${palette('primary', 0)};
      }

      &.ant-input-lg {
        height: 42px;
        padding: 6px 10px;
      }

      &.ant-input-sm {
        padding: 1px 10px;
        height: 30px;
      }

      &::-webkit-input-placeholder {
        color: ${palette('grayscale', 0)};
      }

      &:-moz-placeholder {
        color: ${palette('grayscale', 0)};
      }

      &::-moz-placeholder {
        color: ${palette('grayscale', 0)};
      }
      &:-ms-input-placeholder {
        color: ${palette('grayscale', 0)};
      }
    }

    .ant-input-suffix {
      right: ${props => (props['data-rtl'] === 'rtl' ? 'inherit' : '0px')};
      left: ${props => (props['data-rtl'] === 'rtl' ? '7px' : 'inherit')};
    }

    .ant-input-ant-input-prefix {
      right: ${props => (props['data-rtl'] === 'rtl' ? '7px' : 'inherit')};
      left: ${props => (props['data-rtl'] === 'rtl' ? 'inherit' : '7px')};
    }

    .ant-input-search-icon {
      color: ${palette('grayscale', 0)};

      &:hover {
        color: ${palette('primary', 0)};
      }
    }
  }
`


export {InputSearchWrapper}
