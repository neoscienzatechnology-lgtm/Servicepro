import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import api from '../services/api'

export interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  role: 'admin' | 'technician' | 'customer'
  company?: string
}

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  register: (data: any) => Promise<void>
  logout: () => void
  updateUser: (user: User) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      login: async (email: string, password: string) => {
        const response = await api.post('/auth/login', { email, password })
        const { token, user } = response.data
        
        localStorage.setItem('token', token)
        set({ user, token, isAuthenticated: true })
      },

      register: async (data: any) => {
        const response = await api.post('/auth/register', data)
        const { token, user } = response.data
        
        localStorage.setItem('token', token)
        set({ user, token, isAuthenticated: true })
      },

      logout: () => {
        localStorage.removeItem('token')
        set({ user: null, token: null, isAuthenticated: false })
      },

      updateUser: (user: User) => {
        set({ user })
      },
    }),
    {
      name: 'auth-storage',
    }
  )
)
