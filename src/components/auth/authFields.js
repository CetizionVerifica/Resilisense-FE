import React from 'react'
import {TextField} from 'redux-form-antd'
import {Icon} from 'antd'
import {generateKeys, generateLocalization} from '../../common/utils'

const signinFields = generateLocalization('signinFields', generateKeys({
  email: {
    value: 'email',
    placeholder: 'Email',
    type: 'email',
    component: TextField,
    orderby: 0,
    prefix: <Icon type="user" style={{color: 'rgba(0,0,0,.25)'}} />,
    warn: v => (v && v.length > 2 ? '' : 'too short'),
    validate: v => {
      if (!v) {
        return 'Required'
      } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(v)) {
        return 'Invalid email address'
      }
      return ''
    },
  },
  password: {
    value: 'password',
    placeholder: 'Password',
    type: 'password',
    autoComplete: '',
    component: TextField,
    orderby: 1,
    prefix: <Icon type="lock" style={{color: 'rgba(0,0,0,.25)'}} />,
    validate: v => (v ? '' : 'Required'),
  },
}))

const forgotFields = generateLocalization('signupFields', generateKeys({
  email: {
    value: 'email',
    placeholder: 'Email',
    type: 'email',
    component: TextField,
    orderby: 0,
    prefix: <Icon type="user" style={{color: 'rgba(0,0,0,.25)'}} />,
    warn: v => (v && v.length > 2 ? '' : 'too short'),
    validate: v => {
      if (!v) {
        return 'Required'
      } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(v)) {
        return 'Invalid email address'
      }
      return ''
    },
  }
}))

const signupFields = generateLocalization('signupFields', generateKeys({
  email: {
    value: 'email',
    placeholder: 'Email',
    type: 'email',
    component: TextField,
    orderby: 0,
    prefix: <Icon type="user" style={{color: 'rgba(0,0,0,.25)'}} />,
    warn: v => (v && v.length > 2 ? '' : 'too short'),
    validate: v => {
      if (!v) {
        return 'Required'
      } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(v)) {
        return 'Invalid email address'
      }
      return ''
    },
  },
  password: {
    value: 'password',
    placeholder: 'Password',
    type: 'password',
    autoComplete: '',
    component: TextField,
    orderby: 1,
    prefix: <Icon type="lock" style={{color: 'rgba(0,0,0,.25)'}} />,
    validate: v => (v ? '' : 'Required'),
  },
}))

export {signinFields, signupFields, forgotFields}
