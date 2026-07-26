import { memo, useCallback, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FiShoppingBag, FiX, FiHeart } from 'react-icons/fi'
import { useAuth } from '../../context/AuthContext'
import { useWishlist } from '../../context/WishlistContext'
import { useCart } from '../../context/CartContext'
import toast from 'react-hot-toast'
import type { DummyProduct } from '../../types/product'

interface Props {
  product: DummyProduct
  index: number
}

function WishlistCardInner({ product, index }: Props) {
  const { user } = useAuth()
  const { toggle } = useWishlist()
  const { addToCart } = useCart()
  const [removing, setRemoving] = useState(false)
  const [addingToCart, setAddingToCart] = useState(false)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const cardRef = useRef<HTMLDivElement>(null)

  const discountedPrice = (product.price * (1 - product.discountPercentage / 100)).toFixed(2)
  const inStock = product.stock > 0
  const hasDiscount = product.discountPercentage > 0
  const savings = hasDiscount ? (product.price - parseFloat(discountedPrice)).toFixed(2) : '0'

  const handleRemove = useCallback(() => {
    setRemoving(true)
    setTimeout(() => toggle(product.id), 300)
  }, [toggle, product.id])

  const handleAddToCart = useCallback(async () => {
    if (!user) {
      window.location.href = '/login'
      return
    }
    setAddingToCart(true)
    try {
      await addToCart(product)
      toast.success(`${product.title} added to cart!`)
    } catch {
      toast.error('Failed to add to cart')
    } finally {
      setTimeout(() => setAddingToCart(false), 600)
    }
  }, [user, addToCart, product])

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    setMousePos({
      x: ((e.clientX - rect.left) / rect.width - 0.5) * 10,
      y: ((e.clientY - rect.top) / rect.height - 0.5) * 10,
    })
  }, [])

  const handleMouseLeave = useCallback(() => {
    setMousePos({ x: 0, y: 0 })
  }, [])

  return (
    <AnimatePresence>
      {!removing && (
        <motion.div
          ref={cardRef}
          layout
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, x: -100, scale: 0.8, transition: { duration: 0.3 } }}
          transition={{
            delay: index * 0.08,
            duration: 0.5,
            ease: [0.16, 1, 0.3, 1],
            layout: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
          }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="relative group rounded-2xl overflow-hidden
                     bg-white/90 backdrop-blur-sm
                     shadow-[0_2px_20px_-4px_rgba(124,58,237,0.08)]
                     hover:shadow-[0_8px_40px_-8px_rgba(124,58,237,0.2)]
                     border border-purple-100/50 hover:border-purple-200/80
                     transition-all duration-500"
          style={{ perspective: '1000px' }}
        >
          {/* Gradient border glow on hover */}
          <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none
                          bg-gradient-to-br from-purple-500/5 via-pink-500/5 to-purple-500/5" />

          {/* Discount Badge */}
          {hasDiscount && (
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.08 + 0.2, type: 'spring' }}
              className="absolute top-3 left-3 z-20"
            >
              <span className="inline-block px-3 py-1 rounded-full text-xs font-bold text-white
                             bg-gradient-to-r from-red-500 to-pink-500 shadow-lg shadow-red-500/25">
                {Math.round(product.discountPercentage)}% OFF
              </span>
            </motion.div>
          )}

          {/* Stock Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.08 + 0.25, type: 'spring' }}
            className={`absolute top-3 left-3 z-20 ${hasDiscount ? 'top-12' : ''}`}
          >
            {inStock ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium
                             bg-green-50 text-green-700 border border-green-200">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                In Stock
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium
                             bg-red-50 text-red-700 border border-red-200">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                Out of Stock
              </span>
            )}
          </motion.div>

          {/* Remove Button */}
          <motion.button
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.08 + 0.15, type: 'spring' }}
            whileHover={{ scale: 1.1, backgroundColor: 'rgba(239,68,68,0.1)' }}
            whileTap={{ scale: 0.9, rotate: 90 }}
            onClick={handleRemove}
            className="absolute top-3 right-3 z-20 w-8 h-8 flex items-center justify-center
                       rounded-full bg-white/80 backdrop-blur-sm shadow-sm
                       text-gray-400 hover:text-red-500
                       transition-colors duration-200"
            aria-label="Remove from wishlist"
          >
            <FiX className="w-4 h-4" />
          </motion.button>

          {/* Heart Button */}
          <motion.button
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.08 + 0.2, type: 'spring' }}
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.85 }}
            onClick={handleRemove}
            className="absolute top-3 right-14 z-20 w-9 h-9 flex items-center justify-center
                       rounded-full bg-white/80 backdrop-blur-sm shadow-sm
                       text-pink-500"
            aria-label="Remove from wishlist"
          >
            <motion.div
              animate={removing ? { scale: [1, 1.3, 0] } : { scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <FiHeart className="w-5 h-5 fill-pink-500 text-pink-500" />
            </motion.div>
          </motion.button>

          {/* Product Image */}
          <Link to={`/product/${product.id}`} className="block">
            <motion.div
              className="relative overflow-hidden aspect-[4/3] bg-gradient-to-br from-purple-50 via-pink-50 to-purple-100/50"
              style={{
                transform: `translateX(${mousePos.x}px) translateY(${mousePos.y}px)`,
              }}
              transition={{ type: 'spring', stiffness: 150, damping: 15 }}
            >
              {/* Floating glow behind image */}
              <div className="absolute inset-0 bg-gradient-to-t from-purple-200/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <motion.img
                src={product.thumbnail || '/images/fallback.jpg'}
                alt={product.title}
                loading="lazy"
                className="w-full h-full object-contain p-6 md:p-8
                           transition-transform duration-700 ease-out
                           group-hover:scale-110"
                style={{
                  filter: 'drop-shadow(0 8px 24px rgba(124,58,237,0.12))',
                }}
                whileHover={{ scale: 1.1 }}
              />

              {/* Shimmer overlay */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12"
                initial={{ x: '-100%' }}
                whileHover={{ x: '200%' }}
                transition={{ duration: 0.8, ease: 'easeInOut' }}
              />
            </motion.div>
          </Link>

          {/* Card Content */}
          <div className="p-5 pt-4">
            {/* Category */}
            <p className="text-xs font-medium text-purple-500 uppercase tracking-wider mb-1">
              {product.category.replace('-', ' ')}
            </p>

            {/* Product Name */}
            <Link to={`/product/${product.id}`}>
              <h3 className="text-lg font-bold text-gray-900 leading-snug hover:text-purple-600 transition-colors duration-200 line-clamp-1">
                {product.title}
              </h3>
            </Link>

            {/* Brand */}
            {product.brand && (
              <p className="text-sm text-gray-400 mt-0.5">{product.brand}</p>
            )}

            {/* Rating */}
            <div className="flex items-center gap-1.5 mt-2">
              <div className="flex text-yellow-400 text-xs">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-3.5 h-3.5 ${i < Math.round(product.rating) ? 'fill-current' : 'fill-gray-200'}`}
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-xs text-gray-400 font-medium">
                {product.rating.toFixed(1)}
              </span>
            </div>

            {/* Price Section */}
            <div className="flex items-baseline gap-2.5 mt-3">
              <span className="text-2xl font-bold text-gray-900">
                ₹{discountedPrice}
              </span>
              {hasDiscount && (
                <>
                  <span className="text-sm text-gray-400 line-through">
                    ₹{product.price.toFixed(2)}
                  </span>
                  <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                    Save ₹{savings}
                  </span>
                </>
              )}
            </div>

            {/* Add to Cart Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleAddToCart}
              disabled={!inStock || addingToCart}
              className={`relative overflow-hidden mt-4 w-full py-3 rounded-xl text-sm font-semibold
                         flex items-center justify-center gap-2
                         transition-all duration-300
                         ${inStock
                           ? 'bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-lg shadow-purple-500/25 hover:shadow-xl hover:shadow-purple-500/30'
                           : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                         }`}
              aria-label={inStock ? 'Add to cart' : 'Out of stock'}
            >
              {/* Shine animation */}
              {inStock && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12"
                  initial={{ x: '-100%' }}
                  animate={{ x: '300%' }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                />
              )}

              {/* Ripple effect */}
              <motion.span
                className="absolute inset-0 rounded-xl bg-white/20"
                initial={{ scale: 0, opacity: 0.5 }}
                whileTap={{ scale: 2, opacity: 0 }}
                transition={{ duration: 0.5 }}
              />

              {addingToCart ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                  />
                  Adding...
                </>
              ) : (
                <>
                  <FiShoppingBag className="w-4 h-4" />
                  {inStock ? 'Add to Cart' : 'Out of Stock'}
                </>
              )}
            </motion.button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

const WishlistCard = memo(WishlistCardInner)
export default WishlistCard
