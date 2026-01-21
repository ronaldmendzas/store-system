import { useState } from 'react'
import { Plus, Trash2, Wine, Check } from 'lucide-react'
import { PageLayout } from '@/components/layout/PageLayout'
import { Button, Input, Modal, Loading, ConfirmDialog } from '@/components/ui'
import { useBottleLoans } from '@/hooks'
import { bottleLoanService } from '@/services'
import { formatCurrency, formatDate } from '@/utils'
import { BottleLoan, BottleLoanFormData } from '@/types'

const initialFormData: BottleLoanFormData = {
  debtorName: '',
  bottleType: '',
  guaranteeAmount: 0
}

export function BottlesPage() {
  const { loans, loading, totalGuarantee } = useBottleLoans()
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState<BottleLoanFormData>(initialFormData)
  const [returnLoan, setReturnLoan] = useState<BottleLoan | null>(null)
  const [saving, setSaving] = useState(false)

  const updateField = <K extends keyof BottleLoanFormData>(
    field: K,
    value: BottleLoanFormData[K]
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.debtorName.trim() || !form.bottleType.trim()) {
      alert('Por favor completa los campos obligatorios')
      return
    }

    setSaving(true)
    try {
      await bottleLoanService.create(form)
      setForm(initialFormData)
      setShowModal(false)
    } catch {
      alert('Error al registrar el préstamo')
    } finally {
      setSaving(false)
    }
  }

  const handleReturn = async () => {
    if (returnLoan) {
      await bottleLoanService.markAsReturned(returnLoan.id)
      setReturnLoan(null)
    }
  }

  if (loading) return <PageLayout title="Botellas Prestadas"><Loading /></PageLayout>

  return (
    <PageLayout title="🍾 Botellas Prestadas">
      <div className="bg-orange-100 rounded-2xl p-6 mb-6">
        <p className="text-xl text-center text-orange-800">Total en garantías:</p>
        <p className="text-4xl font-bold text-center text-orange-600">{formatCurrency(totalGuarantee)}</p>
      </div>

      <Button
        fullWidth
        size="large"
        onClick={() => setShowModal(true)}
        className="mb-6"
      >
        <Plus className="inline mr-2" size={28} />
        Registrar Préstamo
      </Button>

      {loans.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <Wine className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p className="text-xl">No hay botellas prestadas</p>
          <p className="text-lg">¡Todo está en orden!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {loans.map((loan) => (
            <div
              key={loan.id}
              className="bg-white rounded-2xl p-4 shadow-sm"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-xl font-bold">{loan.debtorName}</h3>
                  <p className="text-lg text-gray-600">{loan.bottleType}</p>
                  <p className="text-lg font-bold text-orange-600">
                    Garantía: {formatCurrency(loan.guaranteeAmount)}
                  </p>
                  <p className="text-sm text-gray-400">{formatDate(loan.createdAt)}</p>
                </div>
                <button
                  onClick={() => setReturnLoan(loan)}
                  className="p-4 bg-green-100 rounded-xl hover:bg-green-200 flex-shrink-0"
                >
                  <Check size={28} className="text-green-600" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Registrar Préstamo"
      >
        <form onSubmit={handleCreate}>
          <Input
            label="Nombre del cliente *"
            id="debtorName"
            value={form.debtorName}
            onChange={(e) => updateField('debtorName', e.target.value)}
            placeholder="Ej: Don Juan, Señora María..."
            autoFocus
          />

          <Input
            label="Tipo de botella *"
            id="bottleType"
            value={form.bottleType}
            onChange={(e) => updateField('bottleType', e.target.value)}
            placeholder="Ej: Coca Cola 2L, Fanta 1L..."
          />

          <Input
            label="Dinero de garantía (Bs.)"
            id="guaranteeAmount"
            type="number"
            step="0.5"
            min="0"
            value={form.guaranteeAmount || ''}
            onChange={(e) => updateField('guaranteeAmount', parseFloat(e.target.value) || 0)}
            placeholder="0.00"
          />

          <Button
            type="submit"
            fullWidth
            size="large"
            disabled={saving}
          >
            {saving ? 'Guardando...' : 'Registrar Préstamo'}
          </Button>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!returnLoan}
        title="¿Devolvió la botella?"
        message={`¿${returnLoan?.debtorName} devolvió la botella "${returnLoan?.bottleType}"? Recuerda devolverle ${formatCurrency(returnLoan?.guaranteeAmount || 0)}`}
        onConfirm={handleReturn}
        onCancel={() => setReturnLoan(null)}
      />
    </PageLayout>
  )
}
