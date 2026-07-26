import { motion } from 'framer-motion'
import { FiArrowLeft, FiShield, FiLock } from 'react-icons/fi'

export default function CheckoutHeader() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-between mb-8"
    >
      <a
        href="/cart"
        className="flex items-center gap-2 text-gray-500 hover:text-purple-600 transition-colors group"
      >
        <FiArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        <span className="text-sm font-medium">Back to Cart</span>
      </a>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5 text-[11px] text-gray-400">
          <FiShield className="w-3.5 h-3.5" />
          <span>Secure Checkout</span>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] text-gray-400">
          <FiLock className="w-3.5 h-3.5" />
          <span>SSL Encrypted</span>
        </div>
      </div>
    </motion.div>
  )
}
