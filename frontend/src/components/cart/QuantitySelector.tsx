import { motion } from 'framer-motion'
import { FiMinus, FiPlus } from 'react-icons/fi'

interface QuantitySelectorProps {
  quantity: number
  stock: number
  onIncrease: () => void
  onDecrease: () => void
}

export default function QuantitySelector({
  quantity,
  stock,
  onIncrease,
  onDecrease,
}: QuantitySelectorProps) {
  return (
    <div className="inline-flex items-center rounded-full border border-gray-200 bg-white/90 backdrop-blur-sm shadow-sm">
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={onDecrease}
        disabled={quantity <= 1}
        className="p-2.5 rounded-l-full text-gray-500 hover:text-[#EF4444] hover:bg-red-50 disabled:text-gray-300 disabled:hover:bg-transparent disabled:cursor-not-allowed transition-colors"
        aria-label="Decrease quantity"
      >
        <FiMinus size={16} />
      </motion.button>
      <div className="overflow-hidden px-3 min-w-[2.5rem] text-center">
        <motion.span
          key={quantity}
          initial={{ y: -12, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 12, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="block font-semibold text-gray-900 text-sm"
        >
          {quantity}
        </motion.span>
      </div>
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={onIncrease}
        disabled={quantity >= stock}
        className="p-2.5 rounded-r-full text-gray-500 hover:text-[#22C55E] hover:bg-green-50 disabled:text-gray-300 disabled:hover:bg-transparent disabled:cursor-not-allowed transition-colors"
        aria-label="Increase quantity"
      >
        <FiPlus size={16} />
      </motion.button>
    </div>
  )
}
