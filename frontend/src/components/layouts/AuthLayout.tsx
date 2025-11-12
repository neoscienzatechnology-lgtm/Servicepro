import { Outlet } from 'react-router-dom'

export default function AuthLayout() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary-600">ServiceFlow Pro</h1>
          <p className="text-gray-600 mt-2">Sistema de Gestão para Profissionais</p>
        </div>
        <Outlet />
      </div>
    </div>
  )
}
