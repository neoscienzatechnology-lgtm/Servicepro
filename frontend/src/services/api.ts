import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add auth token to requests
api.interceptors.request.use(
  (config) => {
    // Try both locations: localStorage.token and auth-storage from Zustand
    let token = localStorage.getItem('token')
    
    // If not found, try to get from Zustand persist storage
    if (!token) {
      const authStorage = localStorage.getItem('auth-storage')
      if (authStorage) {
        try {
          const parsed = JSON.parse(authStorage)
          token = parsed?.state?.token
        } catch (e) {
          console.error('Error parsing auth-storage:', e)
        }
      }
    }
    
    console.log('🔑 Token encontrado:', token ? `${token.substring(0, 20)}...` : 'NENHUM')
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
      console.log('✅ Header Authorization adicionado')
    } else {
      console.log('❌ Token não encontrado - redirecionando para login')
    }
    
    return config
  },
  (error) => Promise.reject(error)
)

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api
