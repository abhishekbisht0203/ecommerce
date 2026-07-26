import { useEffect, useState, useCallback } from 'react'
import { fetchAllProducts } from '../services/dummyjson'
import { useWishlist } from '../context/WishlistContext'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import type { DummyProduct } from '../types/product'
import { ProductGridSkeleton } from '../components/Skeleton'
import AnimatedBackground from '../components/wishlist/AnimatedBackground'
import WishlistHeader from '../components/wishlist/WishlistHeader'
import WishlistCard from '../components/wishlist/WishlistCard'
import WishlistSummary from '../components/wishlist/WishlistSummary'
import PromotionBanner from '../components/wishlist/PromotionBanner'
import EmptyState from '../components/wishlist/EmptyState'
import toast from 'react-hot-toast'

export default function Wishlist() {
  const { ids, count, fetchWishlist } = useWishlist()
  const { user } = useAuth()
  const { addToCart } = useCart()
  const [products, setProducts] = useState<DummyProduct[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (ids.length === 0) {
      setProducts([])
      setLoading(false)
      return
    }
    let cancelled = false
    async function load() {
      setLoading(true)
      try {
        const all = await fetchAllProducts()
        if (!cancelled) {
          setProducts(all.filter((p) => ids.includes(p.id)))
        }
      } catch {
        if (!cancelled) setProducts([])
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [ids])

  const handleClearAll = useCallback(() => {
    localStorage.setItem('wishlist', '[]')
    fetchWishlist()
    setProducts([])
    toast.success('Wishlist cleared')
  }, [fetchWishlist])

  const handleShare = useCallback(async () => {
    const text = `Check out my ShopIQ wishlist! I have ${count} saved items.`
    if (navigator.share) {
      try {
        await navigator.share({ title: 'My ShopIQ Wishlist', text })
      } catch {
        // user cancelled
      }
    } else {
      await navigator.clipboard.writeText(text)
      toast.success('Wishlist link copied!')
    }
  }, [count])

  const handleMoveAllToCart = useCallback(() => {
    if (!user) {
      window.location.href = '/login'
      return
    }
    products.forEach((product) => addToCart(product))
    toast.success(`Added ${products.length} item${products.length !== 1 ? 's' : ''} to cart!`)
  }, [user, products, addToCart])

  if (loading) {
    return (
      <div className="min-h-screen py-8">
        <AnimatedBackground />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <div className="h-12 w-64 bg-gradient-to-r from-purple-200 to-pink-200 rounded-xl animate-pulse" />
            <div className="h-5 w-48 bg-gray-200 rounded-lg mt-3 animate-pulse" />
          </div>
          <ProductGridSkeleton count={4} />
        </div>
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <>
        <AnimatedBackground />
        <EmptyState />
      </>
    )
  }

  return (
    <>
      <AnimatedBackground />
      <div className="min-h-screen py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <WishlistHeader
            count={count}
            onClear={handleClearAll}
            onShare={handleShare}
          />

          {/* Main Content: Products + Summary */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8">
            {/* Product Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
              {products.map((product, index) => (
                <WishlistCard key={product.id} product={product} index={index} />
              ))}
            </div>

            {/* Sticky Summary */}
            <WishlistSummary
              products={products}
              onMoveAllToCart={handleMoveAllToCart}
            />
          </div>

          {/* Promotion Banner */}
          <PromotionBanner />
        </div>
      </div>
    </>
  )
}
