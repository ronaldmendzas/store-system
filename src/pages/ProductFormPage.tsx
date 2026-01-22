import { useState, useEffect } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { Plus, Minus, Save } from 'lucide-react'
import { PageLayout } from '@/components/layout/PageLayout'
import { Button, Input, Select, ImageUpload, Loading } from '@/components/ui'
import { useCategories, useProducts } from '@/hooks'
import { productService } from '@/services'
import { ProductFormData } from '@/types'

export function ProductFormPage() {
  const navigate = useNavigate()
  const { id } = useParams()
  const [searchParams] = useSearchParams()
  const isEditing = !!id
  const preselectedCategoryId = searchParams.get('category') || ''

  const { categories, loading: loadingCategories } = useCategories()
  const { products, loading: loadingProducts } = useProducts()

  const [form, setForm] = useState<ProductFormData>({
    name: '',
    price: 0,
    description: '',
    imageUrl: '',
    quantity: 0,
    categoryId: preselectedCategoryId,
    alertLimit: 5
  })
  const [saving, setSaving] = useState(false)

  // Actualizar categoryId cuando se carga desde URL
  useEffect(() => {
    if (preselectedCategoryId && !isEditing) {
      setForm(prev => ({ ...prev, categoryId: preselectedCategoryId }))
    }
  }, [preselectedCategoryId, isEditing])

  useEffect(() => {
    if (isEditing && !loadingProducts) {
      const product = products.find((p) => p.id === id)
      if (product) {
        setForm({
          name: product.name,
          price: product.price,
          description: product.description,
          imageUrl: product.imageUrl,
          quantity: product.quantity,
          categoryId: product.categoryId,
          alertLimit: product.alertLimit
        })
      }
    }
  }, [id, isEditing, products, loadingProducts])

  const updateField = <K extends keyof ProductFormData>(
    field: K,
    value: ProductFormData[K]
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const adjustQuantity = (amount: number) => {
    setForm((prev) => ({
      ...prev,
      quantity: Math.max(0, prev.quantity + amount)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.categoryId || form.price <= 0) {
      alert('Por favor completa los campos obligatorios')
      return
    }

    setSaving(true)
    try {
      if (isEditing) {
        await productService.update(id, form)
      } else {
        await productService.create(form)
      }
      // Si venía de una categoría, volver ahí; si no, ir a productos
      if (preselectedCategoryId) {
        navigate(`/categories/${preselectedCategoryId}`, { replace: true })
      } else {
        navigate('/products', { replace: true })
      }
    } catch {
      alert('Error al guardar el producto')
    } finally {
      setSaving(false)
    }
  }

  if (loadingCategories || (isEditing && loadingProducts)) {
    return <PageLayout title="Cargando..."><Loading /></PageLayout>
  }

  return (
    <PageLayout title={isEditing ? '✏️ Editar Producto' : '➕ Nuevo Producto'}>
      <form onSubmit={handleSubmit}>
        <ImageUpload
          value={form.imageUrl}
          onChange={(url) => updateField('imageUrl', url)}
        />

        <Input
          label="Nombre del Producto *"
          id="name"
          value={form.name}
          onChange={(e) => updateField('name', e.target.value)}
          placeholder="Ej: Coca Cola 2L"
          required
        />

        <Input
          label="Precio (Bs.) *"
          id="price"
          type="number"
          step="0.5"
          min="0"
          value={form.price || ''}
          onChange={(e) => updateField('price', parseFloat(e.target.value) || 0)}
          placeholder="0.00"
          required
        />

        <Select
          label="Categoría *"
          id="category"
          value={form.categoryId}
          onChange={(e) => updateField('categoryId', e.target.value)}
          options={categories.map((c) => ({ value: c.id, label: c.name }))}
          required
        />

        <div className="mb-4">
          <label className="block text-base font-bold mb-2">
            Cantidad en Stock
          </label>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => adjustQuantity(-1)}
              className="btn-circle sell"
              style={{ width: '56px', height: '56px' }}
            >
              <Minus size={28} />
            </button>
            <input
              type="number"
              value={form.quantity || ''}
              onChange={(e) => updateField('quantity', parseInt(e.target.value) || 0)}
              placeholder="0"
              className="flex-1 py-4 px-4 text-2xl text-center font-bold
                border-2 rounded-xl bg-secondary border-color"
            />
            <button
              type="button"
              onClick={() => adjustQuantity(1)}
              className="btn-circle add"
              style={{ width: '56px', height: '56px' }}
            >
              <Plus size={28} />
            </button>
          </div>
        </div>

        <Input
          label="Alerta cuando queden menos de:"
          id="alertLimit"
          type="number"
          min="0"
          value={form.alertLimit || ''}
          onChange={(e) => updateField('alertLimit', parseInt(e.target.value) || 0)}
          placeholder="5"
        />

        <Input
          label="Descripción (opcional)"
          id="description"
          value={form.description}
          onChange={(e) => updateField('description', e.target.value)}
          placeholder="Ej: Bebida refrescante..."
        />

        <Button
          type="submit"
          fullWidth
          size="large"
          disabled={saving}
          className="mt-6"
        >
          <Save className="mr-2" size={24} />
          {saving ? 'Guardando...' : 'Guardar Producto'}
        </Button>
      </form>
    </PageLayout>
  )
}
