import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { Sale, Category } from '@/types'
import { formatCurrency, formatShortDate } from './format'

interface SalesByCategory {
  categoryName: string
  sales: Sale[]
  total: number
}

export function generateDailySalesPDF(
  sales: Sale[],
  categories: Category[]
): void {
  const doc = new jsPDF()
  const today = new Date()

  doc.setFontSize(20)
  doc.text('Reporte de Ventas del Día', 105, 20, { align: 'center' })
  
  doc.setFontSize(12)
  doc.text(`Fecha: ${formatShortDate(today)}`, 105, 30, { align: 'center' })

  const salesByCategory: SalesByCategory[] = categories
    .map((category) => {
      const categorySales = sales.filter((s) => s.categoryId === category.id)
      return {
        categoryName: category.name,
        sales: categorySales,
        total: categorySales.reduce((sum, s) => sum + s.total, 0)
      }
    })
    .filter((group) => group.sales.length > 0)

  let yPosition = 45

  salesByCategory.forEach((group) => {
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.text(group.categoryName, 14, yPosition)
    yPosition += 5

    autoTable(doc, {
      startY: yPosition,
      head: [['Producto', 'Cantidad', 'Precio Unit.', 'Total']],
      body: group.sales.map((sale) => [
        sale.productName,
        sale.quantity.toString(),
        formatCurrency(sale.unitPrice),
        formatCurrency(sale.total)
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

  const grandTotal = sales.reduce((sum, s) => sum + s.total, 0)
  
  doc.setFontSize(16)
  doc.setFont('helvetica', 'bold')
  doc.text(`TOTAL DEL DÍA: ${formatCurrency(grandTotal)}`, 105, yPosition, { align: 'center' })

  doc.save(`ventas-${formatShortDate(today)}.pdf`)
}
