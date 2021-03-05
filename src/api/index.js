import client from '@/utils/request.js'
const api = {
  Login: '/user/login',
  RoleMenu: '/role/getRoleMenu',
  datasetField: '/v1/data-screen-custom/dataset-field',
  datasetList: '/v1/data-screen-custom/dataset-list',
  addScreen: '/v1/data-screen-custom/add-screen'
}
export const datasetField = async data => client.post(api.datasetField, { data })
export const datasetList = async data => client.post(api.datasetList, { data })
export const addScreen = async data => client.post(api.addScreen, { data })
export default api
