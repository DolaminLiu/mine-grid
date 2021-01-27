import api from './index'
import { axios } from '@/utils/request'

export function Login (parameter) {
  return axios({
    url: api.Login,
    method: 'post',
    data: parameter
  })
}
