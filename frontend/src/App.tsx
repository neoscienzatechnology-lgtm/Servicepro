import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './store/authStore'

// Layouts
import DashboardLayout from './components/layouts/DashboardLayout'
import AuthLayout from './components/layouts/AuthLayout'

// Pages
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import Dashboard from './pages/Dashboard'
import Appointments from './pages/Appointments'
import Customers from './pages/Customers'
import Technicians from './pages/Technicians'
import Invoices from './pages/Invoices'
import Services from './pages/Services'
import Settings from './pages/Settings'

function App() {
  const { isAuthenticated, user } = useAuthStore()
  
  console.log('🔍 App - isAuthenticated:', isAuthenticated)
  console.log('👤 App - user:', user)

  return (
    <>
      <Router>
        <Routes>
          {/* Auth Routes */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" />} />
            <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/dashboard" />} />
          </Route>

          {/* Protected Routes */}
          <Route element={isAuthenticated ? <DashboardLayout /> : <Navigate to="/login" />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/appointments" element={<Appointments />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/technicians" element={<Technicians />} />
            <Route path="/invoices" element={<Invoices />} />
            <Route path="/services" element={<Services />} />
            <Route path="/settings" element={<Settings />} />
          </Route>

          {/* Default Route */}
          <Route path="/" element={<Navigate to="/dashboard" />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
