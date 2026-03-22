import api from './api'

export const memoryService = {
  getAll: () => api.get('/memories'),
  getById: (id) => api.get(`/memories/${id}`),
  create: (data) => api.post('/memories', data),
  update: (id, data) => api.put(`/memories/${id}`, data),
  delete: (id) => api.delete(`/memories/${id}`),
  getActive: () => api.get('/memories?status=active'),
  getDeleted: () => api.get('/memories?status=deleted')
}
