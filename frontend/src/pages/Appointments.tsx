import { useState } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Calendar, Plus, X } from 'lucide-react'
import api from '../services/api'
import { toast } from 'react-hot-toast'

interface Appointment {
  _id: string
  customer: { _id: string; firstName: string; lastName: string }
  technician?: { _id: string; firstName: string; lastName: string }
  service: { _id: string; name: string }
  scheduledDate: string
  startTime: string
  endTime: string
  status: string
  address: { street: string; city: string; state: string }
}

export default function Appointments() {
  const [showModal, setShowModal] = useState(false)
  const [selectedDate, setSelectedDate] = useState('')
  const [formData, setFormData] = useState({
    customerId: '',
    technicianId: '',
    serviceId: '',
    scheduledDate: '',
    startTime: '09:00',
    endTime: '10:00',
    notes: '',
    address: { street: '', city: '', state: '', zipCode: '' }
  })
  
  const queryClient = useQueryClient()

  const { data: appointmentsData } = useQuery({
    queryKey: ['appointments'],
    queryFn: async () => {
      const { data } = await api.get('/appointments')
      return data
    }
  })

  const { data: customersData } = useQuery({
    queryKey: ['customers'],
    queryFn: async () => {
      const { data } = await api.get('/customers')
      return data
    }
  })

  const { data: techniciansData } = useQuery({
    queryKey: ['technicians'],
    queryFn: async () => {
      const { data } = await api.get('/technicians')
      return data
    }
  })

  const { data: servicesData } = useQuery({
    queryKey: ['services'],
    queryFn: async () => {
      const { data } = await api.get('/services')
      return data
    }
  })

  const appointments = Array.isArray(appointmentsData) ? appointmentsData : []
  const customers = Array.isArray(customersData) ? customersData : []
  const technicians = Array.isArray(techniciansData) ? techniciansData : []
  const services = Array.isArray(servicesData) ? servicesData : []

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      return await api.post('/appointments', data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] })
      toast.success('Agendamento criado com sucesso!')
      setShowModal(false)
      resetForm()
    },
    onError: () => {
      toast.error('Erro ao criar agendamento')
    }
  })

  const events = appointments.map((apt: Appointment) => ({
    id: apt._id,
    title: `${apt.customer?.firstName} - ${apt.service?.name}`,
    start: `${apt.scheduledDate.split('T')[0]}T${apt.startTime}`,
    end: `${apt.scheduledDate.split('T')[0]}T${apt.endTime}`,
    backgroundColor: apt.status === 'completed' ? '#10B981' : apt.status === 'cancelled' ? '#EF4444' : '#3B82F6'
  }))

  const handleDateClick = (info: any) => {
    setSelectedDate(info.dateStr)
    setFormData({ ...formData, scheduledDate: info.dateStr })
    setShowModal(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    createMutation.mutate(formData)
  }

  const resetForm = () => {
    setFormData({
      customerId: '',
      technicianId: '',
      serviceId: '',
      scheduledDate: '',
      startTime: '09:00',
      endTime: '10:00',
      notes: '',
      address: { street: '', city: '', state: '', zipCode: '' }
    })
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Agendamentos</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Calendar className="h-6 w-6" />
            Calendário
          </h2>
          <button
            onClick={() => setShowModal(true)}
            className="bg-primary-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-primary-700"
          >
            <Plus className="h-5 w-5" />
            Novo Agendamento
          </button>
        </div>

        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="timeGridWeek"
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
          }}
          locale="pt-br"
          events={events}
          dateClick={handleDateClick}
          editable={true}
          selectable={true}
          selectMirror={true}
          dayMaxEvents={true}
          weekends={true}
          slotMinTime="07:00:00"
          slotMaxTime="20:00:00"
          height="auto"
        />
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Novo Agendamento</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-700">
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Cliente</label>
                  <select
                    required
                    value={formData.customerId}
                    onChange={(e) => setFormData({ ...formData, customerId: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2"
                  >
                    <option value="">Selecione um cliente</option>
                    {customers.map((c: any) => (
                      <option key={c._id} value={c._id}>{c.firstName} {c.lastName}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Técnico</label>
                  <select
                    value={formData.technicianId}
                    onChange={(e) => setFormData({ ...formData, technicianId: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2"
                  >
                    <option value="">Selecione um técnico</option>
                    {technicians.map((t: any) => (
                      <option key={t._id} value={t._id}>{t.firstName} {t.lastName}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Serviço</label>
                  <select
                    required
                    value={formData.serviceId}
                    onChange={(e) => setFormData({ ...formData, serviceId: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2"
                  >
                    <option value="">Selecione um serviço</option>
                    {services.map((s: any) => (
                      <option key={s._id} value={s._id}>{s.name} - R$ {s.price}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Data</label>
                  <input
                    type="date"
                    required
                    value={formData.scheduledDate}
                    onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Hora Início</label>
                  <input
                    type="time"
                    required
                    value={formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Hora Fim</label>
                  <input
                    type="time"
                    required
                    value={formData.endTime}
                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Endereço</label>
                <input
                  type="text"
                  required
                  placeholder="Rua, número"
                  value={formData.address.street}
                  onChange={(e) => setFormData({ ...formData, address: { ...formData.address, street: e.target.value } })}
                  className="w-full border rounded-lg px-3 py-2 mb-2"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    required
                    placeholder="Cidade"
                    value={formData.address.city}
                    onChange={(e) => setFormData({ ...formData, address: { ...formData.address, city: e.target.value } })}
                    className="w-full border rounded-lg px-3 py-2"
                  />
                  <input
                    type="text"
                    required
                    placeholder="Estado"
                    value={formData.address.state}
                    onChange={(e) => setFormData({ ...formData, address: { ...formData.address, state: e.target.value } })}
                    className="w-full border rounded-lg px-3 py-2"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Observações</label>
                <textarea
                  rows={3}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2"
                  placeholder="Detalhes adicionais..."
                />
              </div>

              <div className="flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={createMutation.isPending}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
                >
                  {createMutation.isPending ? 'Criando...' : 'Criar Agendamento'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
