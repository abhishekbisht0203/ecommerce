import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchAllProducts } from '../services/dummyjson'
import { useWishlist } from '../context/WishlistContext'
import ProductCard from '../components/ProductCard'
import { ProductGridSkeleton } from '../components/Skeleton'
import { FiHeart } from 'react-icons/fi'
import type { DummyProduct } from '../types/product'

export default function Wishlist() {
  const { ids } = useWishlist()
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

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6">My Wishlist</h1>
        <ProductGridSkeleton count={4} />
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="max-w-4xl mx-auto py-8 text-center">
        <FiHeart className="text-6xl text-pink-400 mx-auto mb-4" />
        <p className="text-xl text-gray-600">Your Wishlist is Empty</p>
        <Link to="/" className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700">
          Continue Shopping
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">My Wishlist ({products.length})</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}
