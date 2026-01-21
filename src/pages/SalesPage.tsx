import { Download, ShoppingBag } from 'lucide-react'
import { PageLayout } from '@/components/layout/PageLayout'
import { Button, Loading } from '@/components/ui'
import { useSales, useCategories } from '@/hooks'
import { formatCurrency, formatDate, generateDailySalesPDF } from '@/utils'

export function SalesPage() {
  const { todaySales, todayTotal, loading } = useSales()
  const { categories } = useCategories()

  const handleDownloadPDF = () => {
    if (todaySales.length === 0) {
      alert('No hay ventas hoy para generar el reporte')
      return
    }
    generateDailySalesPDF(todaySales, categories)
  }

  if (loading) return <PageLayout title="Ventas del Día"><Loading /></PageLayout>

  return (
    <PageLayout title="📊 Ventas del Día">
      <div className="bg-green-100 rounded-2xl p-6 mb-6">
        <p className="text-xl text-center text-green-800">Total vendido hoy:</p>
        <p className="text-4xl font-bold text-center text-green-600">{formatCurrency(todayTotal)}</p>
      </div>

      <Button
        fullWidth
        size="large"
        variant="primary"
        onClick={handleDownloadPDF}
        className="mb-6"
      >
        <Download className="inline mr-2" size={28} />
        Descargar Reporte PDF
      </Button>

      <h2 className="text-xl font-bold mb-4">Ventas de hoy ({todaySales.length})</h2>

      {todaySales.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <ShoppingBag className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p className="text-xl">No hay ventas hoy</p>
          <p className="text-lg">Las ventas aparecerán aquí</p>
        </div>
      ) : (
        <div className="space-y-3">
          {todaySales.map((sale) => (
            <div
              key={sale.id}
              className="bg-white rounded-2xl p-4 shadow-sm"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-bold">{sale.productName}</h3>
                  <p className="text-gray-500">
                    {sale.quantity} x {formatCurrency(sale.unitPrice)}
                  </p>
                  <p className="text-sm text-gray-400">{formatDate(sale.createdAt)}</p>
                </div>
                <p className="text-xl font-bold text-green-600">{formatCurrency(sale.total)}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </PageLayout>
  )
}
