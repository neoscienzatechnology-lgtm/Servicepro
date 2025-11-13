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
        console.log('🔐 Iniciando login com NOVO endpoint de debug...')
        
        // PRIMEIRO: Limpar TUDO
        localStorage.clear()
        console.log('🧹 localStorage limpo completamente')
        
        // USAR ENDPOINT DE DEBUG que gera token NOVO garantido
        const response = await api.post('/auth/debug-login', { email, password })
        console.log('✅ Resposta do servidor:', response.data)
        const { token, user } = response.data
        
        console.log('🔑 Novo token recebido:', token.substring(0, 50) + '...')
        
        localStorage.setItem('token', token)
        console.log('💾 Token salvo no localStorage.token')
        
        set({ user, token, isAuthenticated: true })
        console.log('✅ Estado atualizado - isAuthenticated:', true, 'user:', user.email)
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
