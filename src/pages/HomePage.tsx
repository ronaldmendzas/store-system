import { Package, Tags, ShoppingCart, Wine, FileText, AlertTriangle } from 'lucide-react'
import { PageLayout } from '@/components/layout/PageLayout'
import { MenuCard } from '@/components/layout/MenuCard'
import { useProducts, useBottleLoans, useSales } from '@/hooks'
import { formatCurrency } from '@/utils'

export function HomePage() {
  const { lowStockProducts } = useProducts()
  const { loans } = useBottleLoans()
  const { todayTotal } = useSales()

  return (
    <PageLayout title="🏪 Mi Tienda" showBack={false}>
      <div className="mb-6 bg-green-100 rounded-2xl p-4">
        <p className="text-lg text-green-800">Ventas de hoy</p>
        <p className="text-3xl font-bold text-green-600">{formatCurrency(todayTotal)}</p>
      </div>

      {lowStockProducts.length > 0 && (
        <div className="mb-6 bg-red-100 rounded-2xl p-4 flex items-center gap-4">
          <AlertTriangle className="w-10 h-10 text-red-500" />
          <div>
            <p className="text-lg font-bold text-red-800">¡Productos con poco stock!</p>
            <p className="text-red-600">{lowStockProducts.length} producto(s) necesitan reposición</p>
          </div>
        </div>
      )}

      <div className="grid gap-4">
        <MenuCard
          title="Productos"
          description="Ver y gestionar productos"
          icon={Package}
          to="/products"
          color="bg-blue-500 hover:bg-blue-600"
          alert={lowStockProducts.length}
        />

        <MenuCard
          title="Categorías"
          description="Organizar por categorías"
          icon={Tags}
          to="/categories"
          color="bg-purple-500 hover:bg-purple-600"
        />

        <MenuCard
          title="Vender"
          description="Registrar una venta"
          icon={ShoppingCart}
          to="/sell"
          color="bg-green-500 hover:bg-green-600"
        />

        <MenuCard
          title="Botellas Prestadas"
          description={`${loans.length} pendiente(s)`}
          icon={Wine}
          to="/bottles"
          color="bg-orange-500 hover:bg-orange-600"
          alert={loans.length > 0 ? loans.length : undefined}
        />

        <MenuCard
          title="Ventas del Día"
          description="Historial y reporte PDF"
          icon={FileText}
          to="/sales"
          color="bg-teal-500 hover:bg-teal-600"
        />
      </div>
    </PageLayout>
  )
}
