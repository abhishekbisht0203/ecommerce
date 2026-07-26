import { memo } from 'react'
import { Link } from 'react-router-dom'
import { FiHeart, FiEye, FiShoppingBag } from 'react-icons/fi'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { useWishlist } from '../context/WishlistContext'
import { useCart } from '../context/CartContext'
import toast from 'react-hot-toast'
import type { DummyProduct } from '../types/product'

interface Props {
  product: DummyProduct
  index?: number
}

function ProductCardInner({ product, index = 0 }: Props) {
  const { user } = useAuth()
  const { isWishlisted, toggle } = useWishlist()
  const { addToCart } = useCart()
  const wishlisted = isWishlisted(product.id)

  const handleAddToCart = async () => {
    if (!user) {
      window.location.href = '/login'
      return
    }
    try {
      await addToCart(product)
      toast.success('Added to Cart!')
    } catch {
      toast.error('Failed to add to cart')
    }
  }

  const discountedPrice = (product.price * (1 - product.discountPercentage / 100)).toFixed(2)
  const inStock = product.stock > 0
  const hasDiscount = product.discountPercentage > 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="relative group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
    >
      <Link to={`/product/${product.id}`}>
        <div className="relative overflow-hidden aspect-square bg-gray-100">
          <img
            src={product.thumbnail || '/images/fallback.jpg'}
            alt={product.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            loading="lazy"
          />
          {hasDiscount && (
            <span className="absolute top-2 left-2 bg-[#E53E3E] text-white text-xs font-bold px-2.5 py-1 rounded-full z-10">
              {Math.round(product.discountPercentage)}% OFF
            </span>
          )}
          {!inStock && (
            <span className="absolute top-2 right-2 bg-gray-900/80 text-white text-xs font-medium px-2.5 py-1 rounded-full z-10">
              Out of Stock
            </span>
          )}
        </div>
      </Link>

      <div className="p-3 md:p-4">
        <Link to={`/product/${product.id}`}>
          <h3 className="text-sm md:text-base font-semibold text-gray-800 truncate">{product.title}</h3>
        </Link>
        {product.brand && (
          <p className="text-xs text-gray-400 uppercase tracking-wide truncate mt-0.5">{product.brand}</p>
        )}
        <p className="text-xs text-gray-500 capitalize mt-0.5">{product.category.replace('-', ' ')}</p>

        <div className="flex items-center gap-1 mt-1.5">
          <div className="flex text-yellow-400 text-xs">
            {[...Array(5)].map((_, i) => (
              <svg key={i} className={`w-3 h-3 ${i < Math.round(product.rating) ? 'fill-current' : 'fill-gray-200'}`} viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <span className="text-xs text-gray-400">({product.rating.toFixed(1)})</span>
        </div>

        <div className="flex items-center gap-2 mt-2">
          <span className="text-base md:text-lg font-bold text-gray-900">₹{discountedPrice}</span>
          {hasDiscount && (
            <span className="text-xs text-gray-400 line-through">₹{product.price.toFixed(2)}</span>
          )}
        </div>

        <div className="flex items-center gap-1.5 mt-2">
          <span className={`w-2 h-2 rounded-full ${inStock ? 'bg-green-500' : 'bg-red-500'}`} />
          <span className={`text-xs font-medium ${inStock ? 'text-green-600' : 'text-red-600'}`}>
            {inStock ? `${product.stock} in stock` : 'Out of stock'}
          </span>
        </div>
      </div>

      <motion.div
        initial={false}
        whileHover={{ opacity: 1 }}
        className="absolute inset-0 flex items-center justify-center bg-black/5 backdrop-blur-[2px] opacity-0 transition-opacity duration-300 rounded-xl pointer-events-none group-hover:pointer-events-auto"
      >
        <div className="flex flex-col items-center gap-3" onClick={(e) => e.preventDefault()}>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => toggle(product.id)}
            className={`p-2.5 bg-white rounded-full shadow-lg ${wishlisted ? 'text-red-500' : 'text-gray-600 hover:text-red-500'}`}
            aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <FiHeart className={`w-5 h-5 ${wishlisted ? 'fill-current' : ''}`} />
          </motion.button>
          <Link to={`/product/${product.id}`}>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2.5 bg-white rounded-full shadow-lg text-gray-600 hover:text-blue-600"
              aria-label="Quick view"
            >
              <FiEye className="w-5 h-5" />
            </motion.button>
          </Link>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleAddToCart}
            className="px-4 py-2.5 bg-black text-white rounded-full font-medium text-sm shadow-lg hover:bg-gray-800 flex items-center gap-1.5"
          >
            <FiShoppingBag className="w-4 h-4" />
            Add to Cart
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  )
}

const ProductCard = memo(ProductCardInner)
export default ProductCard
