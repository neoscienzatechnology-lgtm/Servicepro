import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Wrench, Plus, X, Edit2, Trash2, Phone, Mail, Star } from 'lucide-react'
import api from '../services/api'
import { toast } from 'react-hot-toast'

export default function Technicians() {
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', phone: '', specialties: '', hourlyRate: ''
  })
  
  const queryClient = useQueryClient()
  const { data: techniciansData } = useQuery({
    queryKey: ['technicians'],
    queryFn: async () => (await api.get('/technicians')).data
  })

  const technicians = Array.isArray(techniciansData) ? techniciansData : []

  const createMutation = useMutation({
    mutationFn: (data: any) => api.post('/technicians', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['technicians'] })
      toast.success('Técnico criado!')
      handleClose()
    }
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: any) => api.put(`/technicians/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['technicians'] })
      toast.success('Técnico atualizado!')
      handleClose()
    }
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/technicians/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['technicians'] })
      toast.success('Técnico removido!')
    }
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const data = { ...formData, specialties: formData.specialties.split(',').map(s => s.trim()) }
    if (editingId) {
      updateMutation.mutate({ id: editingId, data })
    } else {
      createMutation.mutate(data)
    }
  }

  const handleEdit = (tech: any) => {
    setEditingId(tech._id)
    setFormData({
      firstName: tech.firstName, lastName: tech.lastName,
      email: tech.email, phone: tech.phone,
      specialties: tech.specialties?.join(', ') || '',
      hourlyRate: tech.hourlyRate || ''
    })
    setShowModal(true)
  }

  const handleClose = () => {
    setShowModal(false)
    setEditingId(null)
    setFormData({ firstName: '', lastName: '', email: '', phone: '', specialties: '', hourlyRate: '' })
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
          <Wrench className="h-8 w-8" />Técnicos
        </h1>
        <button onClick={() => setShowModal(true)} className="bg-primary-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-primary-700">
          <Plus className="h-5 w-5" />Novo Técnico
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {technicians.map((t: any) => (
          <div key={t._id} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold">{t.firstName} {t.lastName}</h3>
              <div className="flex gap-2">
                <button onClick={() => handleEdit(t)} className="text-blue-600"><Edit2 className="h-4 w-4" /></button>
                <button onClick={() => confirm('Remover técnico?') && deleteMutation.mutate(t._id)} className="text-red-600"><Trash2 className="h-4 w-4" /></button>
              </div>
            </div>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center gap-2"><Mail className="h-4 w-4" /><span>{t.email}</span></div>
              <div className="flex items-center gap-2"><Phone className="h-4 w-4" /><span>{t.phone}</span></div>
              {t.rating && <div className="flex items-center gap-2"><Star className="h-4 w-4 fill-yellow-400 text-yellow-400" /><span>{t.rating.average?.toFixed(1)} ({t.rating.count} avaliações)</span></div>}
              {t.specialties?.length > 0 && <div className="mt-2 flex flex-wrap gap-1">{t.specialties.map((s: string, i: number) => <span key={i} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">{s}</span>)}</div>}
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">{editingId ? 'Editar' : 'Novo'} Técnico</h2>
              <button onClick={handleClose}><X className="h-6 w-6" /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium mb-1">Nome</label>
                  <input required value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} className="w-full border rounded-lg px-3 py-2" /></div>
                <div><label className="block text-sm font-medium mb-1">Sobrenome</label>
                  <input required value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} className="w-full border rounded-lg px-3 py-2" /></div>
                <div><label className="block text-sm font-medium mb-1">Email</label>
                  <input type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full border rounded-lg px-3 py-2" /></div>
                <div><label className="block text-sm font-medium mb-1">Telefone</label>
                  <input required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full border rounded-lg px-3 py-2" /></div>
                <div><label className="block text-sm font-medium mb-1">Especialidades (separadas por vírgula)</label>
                  <input placeholder="Encanamento, Elétrica" value={formData.specialties} onChange={e => setFormData({...formData, specialties: e.target.value})} className="w-full border rounded-lg px-3 py-2" /></div>
                <div><label className="block text-sm font-medium mb-1">Taxa por Hora (R$)</label>
                  <input type="number" value={formData.hourlyRate} onChange={e => setFormData({...formData, hourlyRate: e.target.value})} className="w-full border rounded-lg px-3 py-2" /></div>
              </div>
              <div className="flex gap-3 justify-end">
                <button type="button" onClick={handleClose} className="px-4 py-2 border rounded-lg">Cancelar</button>
                <button type="submit" className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">Salvar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
