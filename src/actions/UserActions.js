import axios from 'axios'
import {message} from 'antd'

export const sendSupplierRequest = (email, companyName) => {
  axios.post('/api/supplier_request', {email, companyName}, {
    headers: {authorization: localStorage.getItem('token')}, // eslint-disable-line
  }).then(({message}) => {

    return message

  }).catch(() => {
    message.error('There was an error with your request.')
  })
}

export const firstAssessmentNotification = (companyName) => {
  axios.post('/api/first_assessment_notify', {companyName}, {
    headers: {authorization: localStorage.getItem('token')}, // eslint-disable-line
  }).then(({message}) => {

    return message

  }).catch(() => {
    message.error('There was an error with your request.')
  })
}

export const firstAssessmentCompleted = (email, companyName) => {
  axios.post('/api/first_assessment_completed', {email, companyName}, {
    headers: {authorization: localStorage.getItem('token')}, // eslint-disable-line
  }).then(({message}) => {

    return message

  }).catch(() => {
    message.error('There was an error with your request.')
  })
}

export const finalAssessmentNotification = (companyName) => {
  axios.post('/api/final_assessment_notify', {companyName}, {
    headers: {authorization: localStorage.getItem('token')}, // eslint-disable-line
  }).then(({message}) => {

    return message

  }).catch(() => {
    message.error('There was an error with your request.')
  })
}

export const finalAssessmentCompleted = (email, companyName, projectId) => {
  axios.post('/api/final_assessment_completed', {email, companyName, projectId}, {
    headers: {authorization: localStorage.getItem('token')}, // eslint-disable-line
  }).then(({message}) => {

    return message

  }).catch(() => {
    message.error('There was an error with your request.')
  })
}
