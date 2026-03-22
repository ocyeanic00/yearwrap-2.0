import api from './api'

export const recapService = {
  generate: (year) => api.post('/recap/generate', { year }),
  getByYear: (year) => api.get(`/recap/${year}`)
}
