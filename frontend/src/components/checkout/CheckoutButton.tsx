import { motion } from 'framer-motion'
import { FiLock, FiLoader } from 'react-icons/fi'

interface CheckoutButtonProps {
  loading: boolean
  disabled?: boolean
  onClick: () => void
  label?: string
}

export default function CheckoutButton({ loading, disabled, onClick, label = 'Complete Payment' }: CheckoutButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      disabled={disabled || loading}
      whileHover={!(disabled || loading) ? { scale: 1.01 } : {}}
      whileTap={!(disabled || loading) ? { scale: 0.99 } : {}}
      className={`relative w-full py-3.5 px-6 rounded-xl font-semibold text-sm overflow-hidden transition-all ${
        disabled || loading
          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
          : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-[0_4px_20px_rgba(124,58,237,0.35)] hover:shadow-[0_6px_25px_rgba(124,58,237,0.45)] active:shadow-[0_2px_10px_rgba(124,58,237,0.3)]'
      }`}
    >
      {loading ? (
        <motion.span
          className="flex items-center justify-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <FiLoader className="w-4 h-4 animate-spin" />
          Processing...
        </motion.span>
      ) : (
        <span className="flex items-center justify-center gap-2">
          <FiLock className="w-4 h-4" />
          {label}
        </span>
      )}
    </motion.button>
  )
}
