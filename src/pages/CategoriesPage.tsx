import { useState } from 'react'
import { Plus, Trash2, FolderOpen, Edit } from 'lucide-react'
import { PageLayout } from '@/components/layout/PageLayout'
import { Button, Input, Modal, Loading, ConfirmDialog } from '@/components/ui'
import { useCategories } from '@/hooks'
import { categoryService } from '@/services'
import { Category } from '@/types'

export function CategoriesPage() {
  const { categories, loading } = useCategories()
  const [showModal, setShowModal] = useState(false)
  const [categoryName, setCategoryName] = useState('')
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [deleteCategory, setDeleteCategory] = useState<Category | null>(null)
  const [saving, setSaving] = useState(false)

  const openCreateModal = () => {
    setEditingCategory(null)
    setCategoryName('')
    setShowModal(true)
  }

  const openEditModal = (category: Category) => {
    setEditingCategory(category)
    setCategoryName(category.name)
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setEditingCategory(null)
    setCategoryName('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!categoryName.trim()) return

    setSaving(true)
    try {
      if (editingCategory) {
        await categoryService.update(editingCategory.id, { name: categoryName.trim() })
      } else {
        await categoryService.create({ name: categoryName.trim() })
      }
      closeModal()
    } catch {
      alert('Error al guardar la categoría')
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
        onClick={openCreateModal}
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
              <div className="flex gap-2">
                <button
                  onClick={() => openEditModal(category)}
                  className="p-3 bg-blue-100 rounded-xl hover:bg-blue-200"
                  title="Editar categoría"
                >
                  <Edit size={24} className="text-blue-600" />
                </button>
                <button
                  onClick={() => setDeleteCategory(category)}
                  className="p-3 bg-red-100 rounded-xl hover:bg-red-200"
                  title="Eliminar categoría"
                >
                  <Trash2 size={24} className="text-red-600" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        isOpen={showModal}
        onClose={closeModal}
        title={editingCategory ? 'Editar Categoría' : 'Nueva Categoría'}
      >
        <form onSubmit={handleSubmit}>
          <Input
            label="Nombre de la categoría"
            id="categoryName"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            placeholder="Ej: Bebidas, Dulces, Botanas..."
            autoFocus
          />
          <Button
            type="submit"
            fullWidth
            size="large"
            disabled={saving || !categoryName.trim()}
          >
            {saving ? 'Guardando...' : editingCategory ? 'Guardar Cambios' : 'Crear Categoría'}
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
