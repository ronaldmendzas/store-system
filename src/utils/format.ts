export function formatCurrency(amount: number): string {
  return `Bs. ${amount.toFixed(2)}`
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString('es-BO', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

export function formatShortDate(date: Date): string {
  return date.toLocaleDateString('es-BO', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}
