import { memo } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiHeart, FiShoppingBag } from 'react-icons/fi'

function EmptyStateInner() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="text-center max-w-md"
      >
        {/* Floating Heart Illustration */}
        <motion.div
          animate={{
            y: [0, -10, 0],
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="relative inline-flex mb-6"
        >
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-purple-100 to-pink-100
                          flex items-center justify-center shadow-xl shadow-purple-200/50">
            <FiHeart className="w-12 h-12 text-pink-400" />
          </div>
          {/* Floating mini hearts */}
          <motion.div
            animate={{ y: [0, -15, 0], opacity: [0, 0.5, 0] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
            className="absolute -top-2 -right-2"
          >
            <FiHeart className="w-4 h-4 text-pink-300" />
          </motion.div>
          <motion.div
            animate={{ y: [0, -12, 0], opacity: [0, 0.4, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, delay: 1 }}
            className="absolute -bottom-1 -left-3"
          >
            <FiHeart className="w-3 h-3 text-purple-300" />
          </motion.div>
        </motion.div>

        {/* Heading */}
        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3">
          Your Wishlist is Empty
        </h2>

        {/* Subheading */}
        <p className="text-gray-500 text-lg mb-8 leading-relaxed">
          Start exploring amazing products and save your favorites here!
        </p>

        {/* CTA Button */}
        <Link to="/">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="relative overflow-hidden inline-flex items-center gap-2.5 px-8 py-4
                       rounded-xl text-base font-semibold text-white
                       bg-gradient-to-r from-purple-600 to-pink-500
                       shadow-lg shadow-purple-500/25 hover:shadow-xl hover:shadow-purple-500/30
                       transition-all duration-300"
            aria-label="Continue shopping"
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -skew-x-12"
              initial={{ x: '-100%' }}
              animate={{ x: '400%' }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            />
            <FiShoppingBag className="w-5 h-5" />
            Continue Shopping
          </motion.button>
        </Link>
      </motion.div>
    </div>
  )
}

const EmptyState = memo(EmptyStateInner)
export default EmptyState
