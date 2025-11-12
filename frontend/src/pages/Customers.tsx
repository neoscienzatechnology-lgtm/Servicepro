import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Users, Plus, X, Edit2, Trash2, Phone, Mail, MapPin } from 'lucide-react'
import api from '../services/api'
import { toast } from 'react-hot-toast'

export default function Customers() {
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    address: { street: '', city: '', state: '', zipCode: '' }, notes: ''
  })
  
  const queryClient = useQueryClient()
  const { data: customersData, isLoading } = useQuery({
    queryKey: ['customers'],
    queryFn: async () => (await api.get('/customers')).data
  })

  const customers = Array.isArray(customersData) ? customersData : []

  const createMutation = useMutation({
    mutationFn: (data: any) => api.post('/customers', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] })
      toast.success('Cliente criado!')
      handleClose()
    }
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: any) => api.put(`/customers/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] })
      toast.success('Cliente atualizado!')
      handleClose()
    }
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/customers/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] })
      toast.success('Cliente removido!')
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

  const handleEdit = (customer: any) => {
    setEditingId(customer._id)
    setFormData({
      firstName: customer.firstName, lastName: customer.lastName,
      email: customer.email, phone: customer.phone,
      address: customer.addresses[0] || { street: '', city: '', state: '', zipCode: '' },
      notes: customer.notes || ''
    })
    setShowModal(true)
  }

  const handleClose = () => {
    setShowModal(false)
    setEditingId(null)
    setFormData({ firstName: '', lastName: '', email: '', phone: '', address: { street: '', city: '', state: '', zipCode: '' }, notes: '' })
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
          <Users className="h-8 w-8" />Clientes
        </h1>
        <button onClick={() => setShowModal(true)} className="bg-primary-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-primary-700">
          <Plus className="h-5 w-5" />Novo Cliente
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {customers.map((c: any) => (
          <div key={c._id} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold">{c.firstName} {c.lastName}</h3>
              <div className="flex gap-2">
                <button onClick={() => handleEdit(c)} className="text-blue-600"><Edit2 className="h-4 w-4" /></button>
                <button onClick={() => confirm('Remover cliente?') && deleteMutation.mutate(c._id)} className="text-red-600"><Trash2 className="h-4 w-4" /></button>
              </div>
            </div>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center gap-2"><Mail className="h-4 w-4" /><span>{c.email}</span></div>
              <div className="flex items-center gap-2"><Phone className="h-4 w-4" /><span>{c.phone}</span></div>
              {c.addresses[0] && <div className="flex items-start gap-2"><MapPin className="h-4 w-4 mt-0.5" /><span>{c.addresses[0].street}, {c.addresses[0].city}</span></div>}
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">{editingId ? 'Editar' : 'Novo'} Cliente</h2>
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
              </div>
              <div><label className="block text-sm font-medium mb-1">Endereço</label>
                <input required placeholder="Rua" value={formData.address.street} onChange={e => setFormData({...formData, address: {...formData.address, street: e.target.value}})} className="w-full border rounded-lg px-3 py-2 mb-2" />
                <div className="grid grid-cols-3 gap-2">
                  <input required placeholder="Cidade" value={formData.address.city} onChange={e => setFormData({...formData, address: {...formData.address, city: e.target.value}})} className="w-full border rounded-lg px-3 py-2" />
                  <input required placeholder="Estado" value={formData.address.state} onChange={e => setFormData({...formData, address: {...formData.address, state: e.target.value}})} className="w-full border rounded-lg px-3 py-2" />
                  <input required placeholder="CEP" value={formData.address.zipCode} onChange={e => setFormData({...formData, address: {...formData.address, zipCode: e.target.value}})} className="w-full border rounded-lg px-3 py-2" />
                </div>
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
