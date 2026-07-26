import { motion } from 'framer-motion'
import { FiTrash2 } from 'react-icons/fi'
import type { CartItem } from '../../types/cart'
import QuantitySelector from './QuantitySelector'

interface CartItemCardProps {
  item: CartItem
  onIncrease: () => void
  onDecrease: () => void
  onRemove: () => void
}

export default function CartItemCard({
  item,
  onIncrease,
  onDecrease,
  onRemove,
}: CartItemCardProps) {
  const originalPrice = item.discountPercentage > 0
    ? item.price / (1 - item.discountPercentage / 100)
    : item.price

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -80, scale: 0.95 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="group relative bg-white rounded-2xl border border-gray-100 p-4 sm:p-5 shadow-sm hover:shadow-md hover:border-purple-100 transition-all duration-300"
    >
      <div className="flex items-start gap-4 sm:gap-6">
        {/* Image */}
        <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden bg-gradient-to-br from-purple-50 to-pink-50 shrink-0">
          <img
            src={item.thumbnail || '/images/fallback.jpg'}
            alt={item.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            loading="lazy"
          />
          {item.discountPercentage > 0 && (
            <span className="absolute top-1.5 left-1.5 text-[10px] font-bold text-white bg-[#EF4444] px-1.5 py-0.5 rounded-md shadow-sm">
              -{Math.round(item.discountPercentage)}%
            </span>
          )}
        </div>

        {/* Details */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 text-sm sm:text-base leading-snug line-clamp-2">
            {item.title}
          </h3>

          <div className="flex items-center gap-2 mt-2">
            <span className="text-base sm:text-lg font-bold text-gray-900">
              ₹{item.price.toFixed(2)}
            </span>
            {item.discountPercentage > 0 && (
              <span className="text-xs sm:text-sm text-gray-400 line-through">
                ₹{originalPrice.toFixed(2)}
              </span>
            )}
          </div>

          <div className="flex items-center gap-3 mt-3">
            <QuantitySelector
              quantity={item.quantity}
              stock={item.stock}
              onIncrease={onIncrease}
              onDecrease={onDecrease}
            />
            <span className="text-sm font-semibold text-[#7C3AED]">
              ₹{(item.price * item.quantity).toFixed(2)}
            </span>
          </div>
        </div>

        {/* Remove */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onRemove}
          className="p-2 rounded-lg text-gray-300 hover:text-[#EF4444] hover:bg-red-50 transition-colors shrink-0"
          aria-label="Remove item"
        >
          <FiTrash2 size={18} />
        </motion.button>
      </div>
    </motion.div>
  )
}
