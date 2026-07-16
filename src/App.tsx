import { Routes, Route, Navigate } from 'react-router-dom'
import { CartProvider } from '@/context/CartContext'

// Public pages
import HomePage from '@/pages/HomePage'
import AboutPage from '@/pages/AboutPage'
import ShopPage from '@/pages/ShopPage'
import BrandsPage from './pages/BrandPage'
import ProductDetailPage from '@/pages/ProductDetailPage'
import CartPage from '@/pages/CartPage'
import CheckoutPage from '@/pages/CheckoutPage'
import LoginPage from '@/pages/LoginPage'

// Admin pages
import AdminDashboard from '@/pages/admin/AdminDashboard'
import AdminProductsPage from '@/pages/admin/AdminProductsPage'
import AdminOrdersPage from '@/pages/admin/AdminOrdersPage'
import AdminOrderDetailPage from '@/pages/admin/AdminOrderDetailPage'
import AdminProductEditPage from '@/pages/admin/AdminProductEditPage'
import AdminBrandsPage from '@/pages/admin/AdminBrandsPage'
import AdminImportPage from '@/pages/admin/AdminImportPage'

export default function App() {
  return (
    <CartProvider>
      <Routes>
        {/* Public */}
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/brands" element={<BrandsPage />} />
        <Route path="/shop" element={<ShopPage />} />
        <Route path="/shop/:id" element={<ProductDetailPage />} />
        <Route path="/shop/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/auth/login" element={<LoginPage />} />

        {/* Admin */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/products" element={<AdminProductsPage />} />
        <Route path="/admin/products/edit" element={<AdminProductEditPage />} />
        <Route path="/admin/orders" element={<AdminOrdersPage />} />
        <Route path="/admin/orders/:id" element={<AdminOrderDetailPage />} />
        <Route path="/admin/brands" element={<AdminBrandsPage />} />
        <Route path="/admin/import" element={<AdminImportPage />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </CartProvider>
  )
}
