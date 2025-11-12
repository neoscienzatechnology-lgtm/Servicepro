import { useQuery } from '@tanstack/react-query'
import { Calendar, Users, DollarSign, Wrench, TrendingUp, Clock } from 'lucide-react'
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import api from '../services/api'
import { format, startOfMonth, endOfMonth } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export default function Dashboard() {
  const { data: appointmentsData } = useQuery({
    queryKey: ['appointments'],
    queryFn: async () => (await api.get('/appointments')).data
  })

  const { data: invoicesData } = useQuery({
    queryKey: ['invoices'],
    queryFn: async () => (await api.get('/invoices')).data
  })

  const { data: customersData } = useQuery({
    queryKey: ['customers'],
    queryFn: async () => (await api.get('/customers')).data
  })

  const { data: techniciansData } = useQuery({
    queryKey: ['technicians'],
    queryFn: async () => (await api.get('/technicians')).data
  })

  const appointments = Array.isArray(appointmentsData) ? appointmentsData : []
  const invoices = Array.isArray(invoicesData) ? invoicesData : []
  const customers = Array.isArray(customersData) ? customersData : []
  const technicians = Array.isArray(techniciansData) ? techniciansData : []

  const today = new Date()
  const monthStart = startOfMonth(today)
  const monthEnd = endOfMonth(today)

  const todayAppointments = appointments.filter((apt: any) => 
    new Date(apt.scheduledDate).toDateString() === today.toDateString()
  )

  const monthRevenue = invoices
    .filter((inv: any) => {
      const date = new Date(inv.issueDate)
      return date >= monthStart && date <= monthEnd
    })
    .reduce((sum: number, inv: any) => sum + inv.total, 0)

  const paidInvoices = invoices.filter((inv: any) => inv.status === 'paid').length
  const pendingInvoices = invoices.filter((inv: any) => inv.status === 'pending').length

  const statusData = [
    { name: 'Agendados', value: appointments.filter((a: any) => a.status === 'scheduled').length, color: '#3B82F6' },
    { name: 'Concluídos', value: appointments.filter((a: any) => a.status === 'completed').length, color: '#10B981' },
    { name: 'Cancelados', value: appointments.filter((a: any) => a.status === 'cancelled').length, color: '#EF4444' },
  ]

  const revenueData = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(today)
    date.setDate(date.getDate() - (6 - i))
    const dayInvoices = invoices.filter((inv: any) => 
      new Date(inv.issueDate).toDateString() === date.toDateString()
    )
    return {
      name: format(date, 'dd/MM'),
      valor: dayInvoices.reduce((sum: number, inv: any) => sum + inv.total, 0)
    }
  })

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Agendamentos Hoje</p>
              <p className="text-3xl font-bold text-gray-900">{todayAppointments.length}</p>
            </div>
            <div className="bg-blue-100 rounded-full p-3">
              <Calendar className="h-8 w-8 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total de Clientes</p>
              <p className="text-3xl font-bold text-gray-900">{customers.length}</p>
            </div>
            <div className="bg-green-100 rounded-full p-3">
              <Users className="h-8 w-8 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Receita do Mês</p>
              <p className="text-3xl font-bold text-gray-900">R$ {monthRevenue.toFixed(2)}</p>
            </div>
            <div className="bg-purple-100 rounded-full p-3">
              <DollarSign className="h-8 w-8 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Técnicos Ativos</p>
              <p className="text-3xl font-bold text-gray-900">{technicians.length}</p>
            </div>
            <div className="bg-orange-100 rounded-full p-3">
              <Wrench className="h-8 w-8 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Receita dos Últimos 7 Dias
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => `R$ ${Number(value).toFixed(2)}`} />
              <Legend />
              <Line type="monotone" dataKey="valor" stroke="#8B5CF6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Status dos Agendamentos
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={statusData} cx="50%" cy="50%" labelLine={false} label={(entry) => entry.name} outerRadius={80} fill="#8884d8" dataKey="value">
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Próximos Agendamentos</h2>
          <div className="space-y-3">
            {appointments.length === 0 ? (
              <p className="text-gray-500 text-center py-4">Nenhum agendamento</p>
            ) : (
              appointments.slice(0, 5).map((apt: any) => (
                <div key={apt._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">{apt.customer?.firstName} {apt.customer?.lastName}</p>
                    <p className="text-sm text-gray-600">{apt.service?.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{format(new Date(apt.scheduledDate), 'dd/MM/yyyy', { locale: ptBR })}</p>
                    <p className="text-sm text-gray-600">{apt.startTime}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Faturas Recentes</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <span className="font-medium">Pagas</span>
              <span className="text-lg font-bold text-green-600">{paidInvoices}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
              <span className="font-medium">Pendentes</span>
              <span className="text-lg font-bold text-yellow-600">{pendingInvoices}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <span className="font-medium">Total de Faturas</span>
              <span className="text-lg font-bold text-blue-600">{invoices.length}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
