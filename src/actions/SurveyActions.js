import axios from 'axios'
import {message} from 'antd'

export const refreshSurveys = async (fileId) => {
  try {
    const { message } = await axios.get('/api/surveys', {
      headers: { authorization: localStorage.getItem('token') }, // eslint-disable-line
    })
    return message
  } catch (message) {
    message.error('There was an error with your request. (refreshSurveys)')
  }
}

// maybe not working
export const sendSurvey = async (agency, project, internal, external) => {
  try {
    const { message } = await axios.post('/api/surveys/send', { agency, project, internal, external }, {
      headers: { authorization: localStorage.getItem('token') }, // eslint-disable-line    
    })
    return message
  } catch (error) {
    message.error('There was an error with your request. (sendSurvey)')
  }
}

export const sendReminder = async projectSurveyId => {
  try {
    const { message } = await axios.post(`/api/surveys/${projectSurveyId}/send`, null, {
      headers: { authorization: localStorage.getItem('token') }, // eslint-disable-line    
    })
    return message
  } catch (error) {
    message.error('There was an error with your request. (sendReminder)')
  }
}

export const closeSurvey = async projectSurveyId => {
  try {
    const { message } = await axios.post(`/api/surveys/${projectSurveyId}/close`, null, {
      headers: { authorization: localStorage.getItem('token') }, // eslint-disable-line    
    })
    return message
  } catch (error) {
    message.error('You can not close the survey.')
  }
}
