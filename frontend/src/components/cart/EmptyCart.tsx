import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiShoppingBag } from 'react-icons/fi'

export default function EmptyCart() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4">
      <motion.div
        animate={{ y: [0, -12, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center"
      >
        <FiShoppingBag className="text-gray-300" size={44} />
      </motion.div>
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-6 text-center">
        Your cart is empty
      </h2>
      <p className="text-gray-500 mt-2 text-center max-w-sm">
        Looks like you haven&apos;t added anything to your cart yet. Browse our collection and find something you love!
      </p>
      <Link to="/">
        <motion.button
          whileHover={{ scale: 1.03, boxShadow: '0 8px 30px rgba(124,58,237,0.25)' }}
          whileTap={{ scale: 0.97 }}
          className="mt-8 bg-gradient-to-r from-[#7C3AED] to-[#EC4899] text-white px-8 py-3 rounded-xl font-semibold shadow-lg"
        >
          Continue Shopping
        </motion.button>
      </Link>
    </div>
  )
}
