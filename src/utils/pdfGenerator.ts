import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { Sale, Category } from '@/types'
import { formatCurrency, formatShortDate } from './format'

interface ProductSummary {
  productName: string
  totalQuantity: number
  unitPrice: number
  totalAmount: number
}

interface SalesByCategory {
  categoryName: string
  products: ProductSummary[]
  total: number
}

function getWeekRange(): { start: Date; end: Date; label: string } {
  const today = new Date()
  const dayOfWeek = today.getDay()
  const start = new Date(today)
  start.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1))
  start.setHours(0, 0, 0, 0)
  const end = new Date(start)
  end.setDate(start.getDate() + 6)
  end.setHours(23, 59, 59, 999)
  return {
    start,
    end,
    label: `${formatShortDate(start)} - ${formatShortDate(end)}`
  }
}

// Agrupa ventas por producto para un reporte limpio
function groupSalesByProduct(sales: Sale[]): Map<string, ProductSummary> {
  const productMap = new Map<string, ProductSummary>()
  
  for (const sale of sales) {
    const existing = productMap.get(sale.productId)
    if (existing) {
      existing.totalQuantity += sale.quantity
      existing.totalAmount += sale.total
    } else {
      productMap.set(sale.productId, {
        productName: sale.productName,
        totalQuantity: sale.quantity,
        unitPrice: sale.unitPrice,
        totalAmount: sale.total
      })
    }
  }
  
  return productMap
}

export function generateWeeklySalesPDF(
  sales: Sale[],
  categories: Category[]
): void {
  const doc = new jsPDF()
  const week = getWeekRange()

  doc.setFontSize(20)
  doc.text('Reporte de Ventas Semanal', 105, 20, { align: 'center' })
  
  doc.setFontSize(12)
  doc.text(`Semana: ${week.label}`, 105, 30, { align: 'center' })

  // Agrupar ventas por categoría y luego por producto
  const salesByCategory: SalesByCategory[] = categories
    .map((category) => {
      const categorySales = sales.filter((s) => s.categoryId === category.id)
      const productMap = groupSalesByProduct(categorySales)
      const products = Array.from(productMap.values())
        .filter(p => p.totalQuantity > 0) // Solo productos con cantidad positiva
      
      return {
        categoryName: category.name,
        products,
        total: products.reduce((sum, p) => sum + p.totalAmount, 0)
      }
    })
    .filter((group) => group.products.length > 0)

  let yPosition = 45

  salesByCategory.forEach((group) => {
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.text(group.categoryName, 14, yPosition)
    yPosition += 5

    autoTable(doc, {
      startY: yPosition,
      head: [['Producto', 'Cantidad', 'Precio Unit.', 'Total']],
      body: group.products.map((product) => [
        product.productName,
        product.totalQuantity.toString(),
        formatCurrency(product.unitPrice),
        formatCurrency(product.totalAmount)
      ]),
      foot: [[
        'Subtotal ' + group.categoryName,
        '',
        '',
        formatCurrency(group.total)
      ]],
      theme: 'striped',
      headStyles: { fillColor: [59, 130, 246] },
      footStyles: { fillColor: [229, 231, 235], textColor: [0, 0, 0], fontStyle: 'bold' }
    })

    yPosition = (doc as jsPDF & { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 15
  })

  const grandTotal = salesByCategory.reduce((sum, g) => sum + g.total, 0)
  
  doc.setFontSize(16)
  doc.setFont('helvetica', 'bold')
  doc.text(`TOTAL DE LA SEMANA: ${formatCurrency(grandTotal)}`, 105, yPosition, { align: 'center' })

  doc.save(`ventas-semana-${formatShortDate(week.start)}.pdf`)
}

// También exportar la función para obtener rango de semana
export { getWeekRange }
