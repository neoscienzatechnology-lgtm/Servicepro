import { Outlet, Link, useLocation } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import {
  LayoutDashboard,
  Calendar,
  Users,
  Wrench,
  FileText,
  Settings,
  LogOut,
  Menu,
  X,
} from 'lucide-react'
import { useState } from 'react'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Agendamentos', href: '/appointments', icon: Calendar },
  { name: 'Clientes', href: '/customers', icon: Users },
  { name: 'Técnicos', href: '/technicians', icon: Wrench },
  { name: 'Faturas', href: '/invoices', icon: FileText },
  { name: 'Serviços', href: '/services', icon: Settings },
]

export default function DashboardLayout() {
  const location = useLocation()
  const { user, logout } = useAuthStore()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar for mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
          <div className="fixed inset-y-0 left-0 flex flex-col w-64 bg-white">
            <div className="flex items-center justify-between h-16 px-4 bg-primary-600">
              <span className="text-white text-xl font-bold">ServiceFlow Pro</span>
              <button onClick={() => setSidebarOpen(false)} className="text-white">
                <X className="h-6 w-6" />
              </button>
            </div>
            <nav className="flex-1 px-2 py-4 space-y-1">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                      isActive
                        ? 'bg-primary-100 text-primary-700'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <item.icon className="mr-3 h-5 w-5" />
                    {item.name}
                  </Link>
                )
              })}
            </nav>
          </div>
        </div>
      )}

      {/* Sidebar for desktop */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-grow bg-white border-r border-gray-200">
          <div className="flex items-center h-16 px-4 bg-primary-600">
            <span className="text-white text-xl font-bold">ServiceFlow Pro</span>
          </div>
          <nav className="flex-1 px-2 py-4 space-y-1">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                    isActive
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              )
            })}
          </nav>
          <div className="flex-shrink-0 p-4 border-t border-gray-200">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-700">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
              <button
                onClick={logout}
                className="ml-2 p-2 text-gray-400 hover:text-gray-600"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar for mobile */}
        <div className="sticky top-0 z-10 flex h-16 bg-white border-b border-gray-200 lg:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="px-4 text-gray-500 focus:outline-none"
          >
            <Menu className="h-6 w-6" />
          </button>
          <div className="flex-1 flex items-center px-4">
            <span className="text-lg font-semibold">ServiceFlow Pro</span>
          </div>
        </div>

        {/* Page content */}
        <main className="py-6 px-4 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
