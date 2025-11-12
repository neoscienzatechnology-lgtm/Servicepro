import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Settings, Plus, X, Edit2, Trash2, Clock } from 'lucide-react'
import api from '../services/api'
import { toast } from 'react-hot-toast'

export default function Services() {
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: '', description: '', price: '', estimatedDuration: '', category: ''
  })
  
  const queryClient = useQueryClient()
  const { data: servicesData } = useQuery({
    queryKey: ['services'],
    queryFn: async () => (await api.get('/services')).data
  })

  const services = Array.isArray(servicesData) ? servicesData : []

  const createMutation = useMutation({
    mutationFn: (data: any) => api.post('/services', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] })
      toast.success('Serviço criado!')
      handleClose()
    }
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: any) => api.put(`/services/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] })
      toast.success('Serviço atualizado!')
      handleClose()
    }
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/services/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] })
      toast.success('Serviço removido!')
    }
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingId) {
      updateMutation.mutate({ id: editingId, data: formData })
    } else {
      createMutation.mutate(formData)
    }
  }

  const handleEdit = (service: any) => {
    setEditingId(service._id)
    setFormData({
      name: service.name, description: service.description || '',
      price: service.price, estimatedDuration: service.estimatedDuration || '',
      category: service.category || ''
    })
    setShowModal(true)
  }

  const handleClose = () => {
    setShowModal(false)
    setEditingId(null)
    setFormData({ name: '', description: '', price: '', estimatedDuration: '', category: '' })
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
          <Settings className="h-8 w-8" />Serviços
        </h1>
        <button onClick={() => setShowModal(true)} className="bg-primary-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-primary-700">
          <Plus className="h-5 w-5" />Novo Serviço
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {services.map((s: any) => (
          <div key={s._id} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold">{s.name}</h3>
                {s.category && <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded mt-1 inline-block">{s.category}</span>}
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleEdit(s)} className="text-blue-600"><Edit2 className="h-4 w-4" /></button>
                <button onClick={() => confirm('Remover serviço?') && deleteMutation.mutate(s._id)} className="text-red-600"><Trash2 className="h-4 w-4" /></button>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-4">{s.description}</p>
            <div className="flex justify-between items-center border-t pt-4">
              <span className="text-2xl font-bold text-primary-600">R$ {s.price}</span>
              {s.estimatedDuration && <div className="flex items-center gap-1 text-sm text-gray-500"><Clock className="h-4 w-4" />{s.estimatedDuration} min</div>}
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">{editingId ? 'Editar' : 'Novo'} Serviço</h2>
              <button onClick={handleClose}><X className="h-6 w-6" /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium mb-1">Nome</label>
                  <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full border rounded-lg px-3 py-2" /></div>
                <div><label className="block text-sm font-medium mb-1">Categoria</label>
                  <input value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full border rounded-lg px-3 py-2" placeholder="Encanamento, Elétrica..." /></div>
                <div><label className="block text-sm font-medium mb-1">Preço (R$)</label>
                  <input type="number" step="0.01" required value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full border rounded-lg px-3 py-2" /></div>
                <div><label className="block text-sm font-medium mb-1">Duração (minutos)</label>
                  <input type="number" value={formData.estimatedDuration} onChange={e => setFormData({...formData, estimatedDuration: e.target.value})} className="w-full border rounded-lg px-3 py-2" /></div>
              </div>
              <div><label className="block text-sm font-medium mb-1">Descrição</label>
                <textarea rows={3} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full border rounded-lg px-3 py-2" />
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
