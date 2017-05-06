import axios from 'axios'

import * as getParams from './getParams'

axios.defaults.headers['X-Requested-With'] = 'XMLHttpRequest'
const config = {
  headers: {
    'X-CSRF-Token': document.querySelector('head [name=csrf-token]').content
  }
}

// ============================================= GET
export const getWorks = (target) => axios.get(`/admin/${target}s`,  {}, config)

// ============================================= UPDATE
export const updateAdminRequest = (data) => {
  const params = getParams.updateAdmin(data)
  return axios.put("/admin", params, config)
}

export const updateWorkRequest = (target, data, id) => {
  const params = getParams.updateWork[target](data)
  return axios.put(`/admin/${target}s/${id}`, params, config)
}

// ============================================= CREATE
export const createWorkRequest = (target, data) => {
  const params = getParams.createWork[target](data)
  return axios.post(`/admin/${target}s`, params, config)
}

// ============================================= DESTROY
export const destroyWorkRequest = (target, id) => (
  axios.delete(`/admin/${target}s/${id}`, config)
)

// ============================================= UPLOAD
const configWithUploadProgress = (target) => ({
  ...config,
  targetField: target,
  onUploadProgress: (progressEvent) => {
    const output = document.getElementById(`progress-${target}`)
    if (output) {
      const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
      output.value = percentCompleted
      output.innerHTML = percentCompleted
    }
  }
})

export const uploadFileRequest = (file, fileType, target) => (
  axios.post(`/admin/uploads/${fileType}`, file, configWithUploadProgress(target))
)
