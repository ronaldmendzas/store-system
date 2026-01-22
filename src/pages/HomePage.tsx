import { Package, Tags, ShoppingCart, Wine, FileText, AlertTriangle, ClipboardList } from 'lucide-react'
import { PageLayout } from '@/components/layout/PageLayout'
import { MenuCard } from '@/components/layout/MenuCard'
import { useProducts, useBottleLoans, useSales, useOrders } from '@/hooks'
import { formatCurrency } from '@/utils'

export function HomePage() {
  const { lowStockProducts } = useProducts()
  const { loans } = useBottleLoans()
  const { todayTotal } = useSales()
  const { pendingCount } = useOrders()

  return (
    <PageLayout title="🏪 Mi Tienda" showBack={false}>
      {/* Stats de ventas */}
      <div className="stats-card success mb-4">
        <p className="text-secondary text-base mb-1">Ventas de hoy</p>
        <p className="text-3xl font-bold text-green">{formatCurrency(todayTotal)}</p>
      </div>

      {/* Alerta de stock bajo */}
      {lowStockProducts.length > 0 && (
        <div className="stats-card warning mb-4 flex items-center gap-4 text-left">
          <div className="w-12 h-12 rounded-xl gradient-orange flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="text-white" size={24} />
          </div>
          <div>
            <p className="font-bold text-primary">¡Stock bajo!</p>
            <p className="text-secondary text-sm">{lowStockProducts.length} producto(s) por agotarse</p>
          </div>
        </div>
      )}

      {/* Menú principal */}
      <div className="space-y-4">
        <MenuCard
          title="Productos"
          description="Ver y gestionar productos"
          icon={Package}
          to="/products"
          gradient="gradient-blue"
          alert={lowStockProducts.length}
        />

        <MenuCard
          title="Categorías"
          description="Organizar por categorías"
          icon={Tags}
          to="/categories"
          gradient="gradient-purple"
        />

        <MenuCard
          title="Vender"
          description="Registrar ventas"
          icon={ShoppingCart}
          to="/sell"
          gradient="gradient-green"
        />

        <MenuCard
          title="Pedidos"
          description={pendingCount > 0 ? `${pendingCount} pedido(s) pendiente(s)` : "Lista de reposición"}
          icon={ClipboardList}
          to="/orders"
          gradient="gradient-cyan"
          alert={pendingCount > 0 ? pendingCount : undefined}
        />

        <MenuCard
          title="Botellas Prestadas"
          description={`${loans.length} pendiente(s)`}
          icon={Wine}
          to="/bottles"
          gradient="gradient-orange"
          alert={loans.length > 0 ? loans.length : undefined}
        />

        <MenuCard
          title="Ventas de la Semana"
          description="Historial y reporte PDF"
          icon={FileText}
          to="/sales"
          gradient="gradient-teal"
        />
      </div>
    </PageLayout>
  )
}
