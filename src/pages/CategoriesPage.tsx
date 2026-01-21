import { useState } from 'react'
import { Plus, Trash2, FolderOpen } from 'lucide-react'
import { PageLayout } from '@/components/layout/PageLayout'
import { Button, Input, Modal, Loading, ConfirmDialog } from '@/components/ui'
import { useCategories } from '@/hooks'
import { categoryService } from '@/services'
import { Category } from '@/types'

export function CategoriesPage() {
  const { categories, loading } = useCategories()
  const [showModal, setShowModal] = useState(false)
  const [newCategory, setNewCategory] = useState('')
  const [deleteCategory, setDeleteCategory] = useState<Category | null>(null)
  const [saving, setSaving] = useState(false)

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newCategory.trim()) return

    setSaving(true)
    try {
      await categoryService.create({ name: newCategory.trim() })
      setNewCategory('')
      setShowModal(false)
    } catch {
      alert('Error al crear la categoría')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (deleteCategory) {
      await categoryService.delete(deleteCategory.id)
      setDeleteCategory(null)
    }
  }

  if (loading) return <PageLayout title="Categorías"><Loading /></PageLayout>

  return (
    <PageLayout title="🏷️ Categorías">
      <Button
        fullWidth
        size="large"
        onClick={() => setShowModal(true)}
        className="mb-6"
      >
        <Plus className="inline mr-2" size={28} />
        Nueva Categoría
      </Button>

      {categories.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <FolderOpen className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p className="text-xl">No hay categorías</p>
          <p className="text-lg">Crea una para organizar tus productos</p>
        </div>
      ) : (
        <div className="space-y-3">
          {categories.map((category) => (
            <div
              key={category.id}
              className="bg-white rounded-2xl p-5 shadow-sm flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <FolderOpen className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold">{category.name}</h3>
              </div>
              <button
                onClick={() => setDeleteCategory(category)}
                className="p-3 bg-red-100 rounded-xl hover:bg-red-200"
              >
                <Trash2 size={24} className="text-red-600" />
              </button>
            </div>
          ))}
        </div>
      )}

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Nueva Categoría"
      >
        <form onSubmit={handleCreate}>
          <Input
            label="Nombre de la categoría"
            id="categoryName"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="Ej: Bebidas, Dulces, Botanas..."
            autoFocus
          />
          <Button
            type="submit"
            fullWidth
            size="large"
            disabled={saving || !newCategory.trim()}
          >
            {saving ? 'Guardando...' : 'Crear Categoría'}
          </Button>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteCategory}
        title="Eliminar Categoría"
        message={`¿Seguro que quieres eliminar "${deleteCategory?.name}"? Los productos de esta categoría quedarán sin categoría.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteCategory(null)}
      />
    </PageLayout>
  )
}
