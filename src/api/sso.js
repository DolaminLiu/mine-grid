import api from './index'
import { axios } from '@/utils/request'

export function getRoleMenu (parameter) {
  return axios({
    url: api.RoleMenu,
    method: 'post',
    data: parameter
  })
}
