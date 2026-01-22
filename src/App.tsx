import { BrowserRouter, Routes, Route } from 'react-router-dom'
import {
  HomePage,
  ProductsPage,
  ProductFormPage,
  CategoriesPage,
  CategoryProductsPage,
  SellPage,
  SalesPage,
  BottlesPage
} from '@/pages'

export function App() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/products/new" element={<ProductFormPage />} />
        <Route path="/products/:id" element={<ProductFormPage />} />
        <Route path="/categories" element={<CategoriesPage />} />
        <Route path="/categories/:categoryId" element={<CategoryProductsPage />} />
        <Route path="/sell" element={<SellPage />} />
        <Route path="/sales" element={<SalesPage />} />
        <Route path="/bottles" element={<BottlesPage />} />
      </Routes>
    </BrowserRouter>
  )
}
