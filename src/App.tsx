import { BrowserRouter, Routes, Route } from 'react-router-dom'
import {
  HomePage,
  ProductsPage,
  ProductFormPage,
  CategoriesPage,
  SellPage,
  SalesPage,
  BottlesPage
} from '@/pages'

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/products/new" element={<ProductFormPage />} />
        <Route path="/products/:id" element={<ProductFormPage />} />
        <Route path="/categories" element={<CategoriesPage />} />
        <Route path="/sell" element={<SellPage />} />
        <Route path="/sales" element={<SalesPage />} />
        <Route path="/bottles" element={<BottlesPage />} />
      </Routes>
    </BrowserRouter>
  )
}
