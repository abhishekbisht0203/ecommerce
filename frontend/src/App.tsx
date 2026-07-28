import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import { WishlistProvider } from './context/WishlistContext'
import Layout from './components/layout/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/Home'
import Cart from './pages/Cart'
import Login from './pages/Login'
import Register from './pages/Register'
import Wishlist from './pages/Wishlist'
import Checkout from './pages/Checkout'
import PaymentSuccess from './pages/PaymentSuccess'
import Orders from './pages/Orders'
import CategoryPage from './pages/CategoryPage'
import ProductListing from './pages/ProductListing'
import ProductDetail from './pages/ProductDetail'
import AddProduct from './pages/AddProduct'
import PasswordReset from './pages/PasswordReset'
import AuthCallback from './pages/AuthCallback'
import { useEffect } from 'react'

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || ''

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

export default function App() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <BrowserRouter>
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <ScrollToTop />
              <Toaster position="top-right" toastOptions={{ duration: 2000 }} />
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/password-reset" element={<PasswordReset />} />
                <Route path="/auth/callback" element={<AuthCallback />} />

                <Route element={<Layout />}>
                  <Route path="/" element={<Home />} />
                  <Route path="/product" element={<ProductListing />} />
                  <Route path="/product/:id" element={<ProductDetail />} />
                  <Route path="/category/:category" element={<CategoryPage />} />
                  <Route path="/wishlist" element={<Wishlist />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/payment/success" element={<PaymentSuccess />} />
                  <Route path="/add-product" element={<AddProduct />} />
                  <Route
                    path="/checkout"
                    element={<ProtectedRoute><Checkout /></ProtectedRoute>}
                  />
                  <Route
                    path="/orders"
                    element={<ProtectedRoute><Orders /></ProtectedRoute>}
                  />
                </Route>
              </Routes>
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </BrowserRouter>
    </GoogleOAuthProvider>
  )
}
