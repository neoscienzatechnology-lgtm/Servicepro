import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { FileText, Plus, X, Download, CheckCircle } from 'lucide-react'
import api from '../services/api'
import { toast } from 'react-hot-toast'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

export default function Invoices() {
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({
    appointmentId: '', customerId: '', items: [{ description: '', quantity: 1, unitPrice: 0 }], notes: ''
  })
  
  const queryClient = useQueryClient()
  const { data: invoicesData } = useQuery({
    queryKey: ['invoices'],
    queryFn: async () => (await api.get('/invoices')).data
  })

  const { data: appointmentsData } = useQuery({
    queryKey: ['appointments'],
    queryFn: async () => (await api.get('/appointments')).data
  })

  const invoices = Array.isArray(invoicesData) ? invoicesData : []
  const appointments = Array.isArray(appointmentsData) ? appointmentsData : []

  const createMutation = useMutation({
    mutationFn: (data: any) => api.post('/invoices', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] })
      toast.success('Fatura criada!')
      handleClose()
    }
  })

  const payMutation = useMutation({
    mutationFn: ({ id, data }: any) => api.post(`/invoices/${id}/pay`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] })
      toast.success('Pagamento registrado!')
    }
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    createMutation.mutate(formData)
  }

  const handleClose = () => {
    setShowModal(false)
    setFormData({ appointmentId: '', customerId: '', items: [{ description: '', quantity: 1, unitPrice: 0 }], notes: '' })
  }

  const addItem = () => {
    setFormData({ ...formData, items: [...formData.items, { description: '', quantity: 1, unitPrice: 0 }] })
  }

  const updateItem = (index: number, field: string, value: any) => {
    const items = [...formData.items]
    items[index] = { ...items[index], [field]: value }
    setFormData({ ...formData, items })
  }

  const generatePDF = (invoice: any) => {
    const doc = new jsPDF()
    doc.setFontSize(20)
    doc.text('FATURA', 105, 20, { align: 'center' })
    doc.setFontSize(10)
    doc.text(`Número: ${invoice.invoiceNumber}`, 20, 40)
    doc.text(`Data: ${new Date(invoice.issueDate).toLocaleDateString('pt-BR')}`, 20, 46)
    doc.text(`Cliente: ${invoice.customer?.firstName} ${invoice.customer?.lastName}`, 20, 52)
    
    const tableData = invoice.items.map((item: any) => [
      item.description,
      item.quantity,
      `R$ ${item.unitPrice.toFixed(2)}`,
      `R$ ${(item.quantity * item.unitPrice).toFixed(2)}`
    ])

    autoTable(doc, {
      startY: 60,
      head: [['Descrição', 'Qtd', 'Valor Unit.', 'Total']],
      body: tableData,
    })

    const finalY = (doc as any).lastAutoTable.finalY
    doc.text(`Subtotal: R$ ${invoice.subtotal.toFixed(2)}`, 150, finalY + 10)
    doc.text(`Total: R$ ${invoice.total.toFixed(2)}`, 150, finalY + 20)
    doc.text(`Status: ${invoice.status === 'paid' ? 'PAGO' : 'PENDENTE'}`, 150, finalY + 30)

    doc.save(`fatura-${invoice.invoiceNumber}.pdf`)
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
          <FileText className="h-8 w-8" />Faturas
        </h1>
        <button onClick={() => setShowModal(true)} className="bg-primary-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-primary-700">
          <Plus className="h-5 w-5" />Nova Fatura
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Número</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cliente</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ações</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {invoices.map((inv: any) => (
              <tr key={inv._id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{inv.invoiceNumber}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">{inv.customer?.firstName} {inv.customer?.lastName}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">{new Date(inv.issueDate).toLocaleDateString('pt-BR')}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold">R$ {inv.total.toFixed(2)}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs rounded-full ${inv.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    {inv.status === 'paid' ? 'Pago' : 'Pendente'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <button onClick={() => generatePDF(inv)} className="text-blue-600 hover:text-blue-800 mr-3">
                    <Download className="h-4 w-4 inline" /> PDF
                  </button>
                  {inv.status === 'pending' && (
                    <button onClick={() => payMutation.mutate({ id: inv._id, data: { method: 'cash', amount: inv.total } })} className="text-green-600 hover:text-green-800">
                      <CheckCircle className="h-4 w-4 inline" /> Pagar
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Nova Fatura</h2>
              <button onClick={handleClose}><X className="h-6 w-6" /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium mb-1">Agendamento</label>
                  <select value={formData.appointmentId} onChange={e => setFormData({...formData, appointmentId: e.target.value})} className="w-full border rounded-lg px-3 py-2">
                    <option value="">Selecione</option>
                    {appointments.map((apt: any) => (
                      <option key={apt._id} value={apt._id}>{apt.customer?.firstName} - {new Date(apt.scheduledDate).toLocaleDateString('pt-BR')}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Itens</label>
                {formData.items.map((item, idx) => (
                  <div key={idx} className="grid grid-cols-4 gap-2 mb-2">
                    <input required placeholder="Descrição" value={item.description} onChange={e => updateItem(idx, 'description', e.target.value)} className="col-span-2 border rounded-lg px-3 py-2" />
                    <input required type="number" placeholder="Qtd" value={item.quantity} onChange={e => updateItem(idx, 'quantity', Number(e.target.value))} className="border rounded-lg px-3 py-2" />
                    <input required type="number" step="0.01" placeholder="Valor" value={item.unitPrice} onChange={e => updateItem(idx, 'unitPrice', Number(e.target.value))} className="border rounded-lg px-3 py-2" />
                  </div>
                ))}
                <button type="button" onClick={addItem} className="text-blue-600 text-sm">+ Adicionar Item</button>
              </div>
              <div><label className="block text-sm font-medium mb-1">Observações</label>
                <textarea rows={3} value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} className="w-full border rounded-lg px-3 py-2" />
              </div>
              <div className="flex gap-3 justify-end">
                <button type="button" onClick={handleClose} className="px-4 py-2 border rounded-lg">Cancelar</button>
                <button type="submit" className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">Criar Fatura</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
