import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { fetchProduct } from '../services/dummyjson'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'
import { ProductDetailSkeleton } from '../components/Skeleton'
import { FiHeart, FiStar } from 'react-icons/fi'
import toast from 'react-hot-toast'
import type { DummyProduct } from '../types/product'

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>()
  const { addToCart } = useCart()
  const { isWishlisted, toggle } = useWishlist()
  const [product, setProduct] = useState<DummyProduct | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedImage, setSelectedImage] = useState(0)

  useEffect(() => {
    if (!id) return
    const productId: string = id
    let cancelled = false
    async function load() {
      setLoading(true)
      setError('')
      setSelectedImage(0)
      try {
        const data = await fetchProduct(parseInt(productId, 10))
        if (!cancelled) setProduct(data)
      } catch {
        if (!cancelled) setError('Failed to load product details')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [id])

  const handleAddToCart = async () => {
    if (!product) return
    try {
      await addToCart(product)
      toast.success('Added to Cart!')
    } catch {
      toast.error('Failed to add to cart')
    }
  }

  if (loading) return <ProductDetailSkeleton />

  if (error) {
    return (
      <div className="text-center py-20 text-red-500">
        <p>{error}</p>
        <Link to="/" className="mt-4 inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
          Back to Shop
        </Link>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="text-center py-20 text-gray-500">
        <p className="text-xl">Product not found</p>
        <Link to="/" className="mt-4 inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
          Back to Shop
        </Link>
      </div>
    )
  }

  const discountedPrice = (product.price * (1 - product.discountPercentage / 100)).toFixed(2)
  const images = product.images.length > 0 ? product.images : [product.thumbnail]
  const wishlisted = isWishlisted(product.id)

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <Link to="/" className="text-blue-600 hover:underline mb-6 inline-block">&larr; Back to products</Link>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <img
            src={images[selectedImage] || product.thumbnail || '/images/fallback.jpg'}
            alt={product.title}
            className="w-full h-96 object-cover rounded-lg shadow-lg"
          />
          {images.length > 1 && (
            <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`shrink-0 w-20 h-20 rounded border-2 overflow-hidden ${i === selectedImage ? 'border-blue-600' : 'border-transparent'}`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">{product.title}</h1>
          {product.brand && (
            <p className="text-sm text-gray-400 uppercase tracking-wide mb-2">{product.brand}</p>
          )}
          <div className="flex items-center gap-2 mb-2">
            <div className="flex text-yellow-500">
              {[...Array(5)].map((_, i) => (
                <FiStar key={i} className={`w-4 h-4 ${i < Math.round(product.rating) ? 'fill-current' : ''}`} />
              ))}
            </div>
            <span className="text-sm text-gray-500">({product.rating.toFixed(1)})</span>
          </div>
          <p className="text-gray-600 mb-4 leading-relaxed">{product.description}</p>

          <div className="flex items-center gap-3 mb-4">
            <p className="text-3xl font-bold text-blue-600">₹{discountedPrice}</p>
            <p className="text-lg text-gray-400 line-through">₹{product.price.toFixed(2)}</p>
            {product.discountPercentage > 0 && (
              <span className="text-sm font-semibold text-red-500 bg-red-50 px-2 py-1 rounded-full">
                {Math.round(product.discountPercentage)}% OFF
              </span>
            )}
          </div>

          <div className="space-y-2 mb-6 text-sm">
            <p><span className="font-medium text-gray-700">Category:</span> <span className="text-gray-600 capitalize">{product.category.replace('-', ' ')}</span></p>
            {product.sku && <p><span className="font-medium text-gray-700">SKU:</span> <span className="text-gray-600">{product.sku}</span></p>}
            <p>
              <span className="font-medium text-gray-700">Availability:</span>{' '}
              <span className={product.stock > 0 ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
                {product.availabilityStatus} ({product.stock} units)
              </span>
            </p>
            {product.shippingInformation && (
              <p><span className="font-medium text-gray-700">Shipping:</span> <span className="text-gray-600">{product.shippingInformation}</span></p>
            )}
            {product.warrantyInformation && (
              <p><span className="font-medium text-gray-700">Warranty:</span> <span className="text-gray-600">{product.warrantyInformation}</span></p>
            )}
            {product.returnPolicy && (
              <p><span className="font-medium text-gray-700">Return Policy:</span> <span className="text-gray-600">{product.returnPolicy}</span></p>
            )}
          </div>

          <div className="flex space-x-4">
            <button onClick={handleAddToCart} className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition font-medium">
              Add to Cart
            </button>
            <button
              onClick={() => toggle(product.id)}
              className={`p-3 rounded-lg border transition ${wishlisted ? 'text-red-500 border-red-500' : 'text-gray-600 border-gray-300 hover:border-red-500'}`}
            >
              <FiHeart className={`w-6 h-6 ${wishlisted ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
