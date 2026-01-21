import { useMemo } from 'react'
import { Download, ShoppingBag } from 'lucide-react'
import { PageLayout } from '@/components/layout/PageLayout'
import { Button, Loading } from '@/components/ui'
import { useSales, useCategories } from '@/hooks'
import { formatCurrency, formatDate, generateWeeklySalesPDF, getWeekRange } from '@/utils'

export function SalesPage() {
  const { weekSales, weekTotal, todayTotal, loading } = useSales()
  const { categories } = useCategories()
  const week = useMemo(() => getWeekRange(), [])

  const handleDownloadPDF = () => {
    if (weekSales.length === 0) {
      alert('No hay ventas esta semana para generar el reporte')
      return
    }
    generateWeeklySalesPDF(weekSales, categories)
  }

  if (loading) return <PageLayout title="Ventas"><Loading /></PageLayout>

  return (
    <PageLayout title="📊 Ventas">
      {/* Info de la semana */}
      <div className="stats-card info mb-4">
        <p className="text-base">Semana: {week.label}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="stats-card success">
          <p className="text-sm text-secondary">Hoy</p>
          <p className="text-2xl font-bold text-green">{formatCurrency(todayTotal)}</p>
        </div>
        <div className="stats-card" style={{ background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.15) 0%, rgba(124, 58, 237, 0.1) 100%)', border: '2px solid rgba(168, 85, 247, 0.3)' }}>
          <p className="text-sm text-secondary">Semana</p>
          <p className="text-2xl font-bold" style={{ color: '#a855f7' }}>{formatCurrency(weekTotal)}</p>
        </div>
      </div>

      <Button fullWidth size="large" variant="primary" onClick={handleDownloadPDF} className="mb-6">
        <Download className="mr-2" size={24} />
        Descargar PDF
      </Button>

      <h2 className="text-lg font-bold mb-4 text-primary">Ventas esta semana ({weekSales.length})</h2>

      {weekSales.length === 0 ? (
        <div className="text-center py-12 text-secondary">
          <ShoppingBag size={64} className="mx-auto mb-4 opacity-30" />
          <p className="text-xl">No hay ventas</p>
          <p className="text-base">Las ventas aparecerán aquí</p>
        </div>
      ) : (
        <div className="space-y-3">
          {weekSales.map((sale) => (
            <div key={sale.id} className="product-item">
              <div className="min-w-0 flex-1">
                <h3 className="font-bold truncate">{sale.productName}</h3>
                <p className="text-secondary text-sm">
                  {sale.quantity} × {formatCurrency(sale.unitPrice)}
                </p>
                <p className="text-sm text-muted">{formatDate(sale.createdAt)}</p>
              </div>
              <p className="text-xl font-bold text-green flex-shrink-0">{formatCurrency(sale.total)}</p>
            </div>
          ))}
        </div>
      )}
    </PageLayout>
  )
}
