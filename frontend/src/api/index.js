import axios from 'axios'

const api = axios.create({ baseURL: '/api' })

api.interceptors.request.use(config => {
  const token = localStorage.getItem('access_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  res => res,
  async err => {
    const original = err.config
    if (err.response?.status === 401 && !original._retry) {
      original._retry = true
      try {
        const refresh = localStorage.getItem('refresh_token')
        const { data } = await axios.post('/api/auth/token/refresh/', { refresh })
        localStorage.setItem('access_token', data.access)
        original.headers.Authorization = `Bearer ${data.access}`
        return api(original)
      } catch {
        localStorage.clear()
        window.location.href = '/login'
      }
    }
    return Promise.reject(err)
  }
)

export default api

export const authApi = {
  register:       d => api.post('/auth/register/', d),
  login:          d => api.post('/auth/login/', d),
  logout:         d => api.post('/auth/logout/', d),
  profile:        () => api.get('/auth/profile/'),
  updateProfile:  d => api.patch('/auth/profile/', d),
  changePassword: d => api.put('/auth/change-password/', d),
}

export const propertyApi = {
  list:           p      => api.get('/properties/', { params: p }),
  get:            id     => api.get(`/properties/${id}/`),
  create:         d      => api.post('/properties/', d),
  update:         (id,d) => api.patch(`/properties/${id}/`, d),
  delete:         id     => api.delete(`/properties/${id}/`),
  featured:       ()     => api.get('/properties/featured/'),
  myListings:     ()     => api.get('/properties/my_listings/'),
  recommended:    ()     => api.get('/properties/recommended/'),
  uploadImage:    (id,f) => api.post(`/properties/${id}/images/`, f, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  deleteImage:    id     => api.delete(`/properties/images/${id}/`),
  favorites:      ()     => api.get('/properties/favorites/'),
  addFavorite:    pid    => api.post('/properties/favorites/', { property: pid }),
  removeFavorite: id     => api.delete(`/properties/favorites/${id}/`),
}

export const bookingApi = {
  list:   ()      => api.get('/bookings/'),
  create: d       => api.post('/bookings/', d),
  update: (id, d) => api.patch(`/bookings/${id}/`, d),
  delete: id      => api.delete(`/bookings/${id}/`),
}

export const reviewApi = {
  list:   pid => api.get(`/reviews/${pid}/reviews/`),
  create: d   => api.post(`/reviews/${d.property}/reviews/`, d),
}

export const analyticsApi = {
  track:     d => api.post('/analytics/track/', d),
  dashboard: p => api.get('/analytics/dashboard/', { params: p }),
}

export const paymentApi = {
  initiate: d => api.post('/payments/initiate/', d),
  list:     () => api.get('/payments/'),
}
