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

 
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </CartProvider>
  )
}
