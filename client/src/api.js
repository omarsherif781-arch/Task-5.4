import axios from 'axios'

export const api = axios.create({
  baseURL: 'http://localhost:4000/api',
  withCredentials: true
})

api.interceptors.request.use(async (config) => {
  const method = (config.method || 'get').toLowerCase()
  const changesState = ['post', 'put', 'patch', 'delete'].includes(method)
  const isPreAuthRoute = /\/auth\/(login|register)\/?$/.test(config.url || '')

  if (!changesState || isPreAuthRoute) return config

  const tokenResponse = await api.get('/csrf-token')
  const csrfToken = tokenResponse.data.csrfToken
  config.headers = config.headers || {}
  if (typeof config.headers.set === 'function') {
    config.headers.set('x-csrf-token', csrfToken)
  } else {
    config.headers['x-csrf-token'] = csrfToken
  }
  return config
})
