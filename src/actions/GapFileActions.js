import axios from 'axios'
import {message} from 'antd'

export const deleteFileRequest = (fileId) => {
  return axios.delete(`/api/file/${fileId}/`, {
    headers: {authorization: localStorage.getItem('token')}, // eslint-disable-line
  }).then(({message}) => {

    return message

  }).catch(() => {
    message.error('There was an error with your request.')
  })
}
