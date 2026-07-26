import { memo } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiShoppingBag, FiGift } from 'react-icons/fi'

function PromotionBannerInner() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="relative overflow-hidden rounded-2xl mt-8
                 bg-gradient-to-br from-purple-600 via-purple-500 to-pink-500
                 shadow-xl shadow-purple-500/20"
    >
      {/* Decorative elements */}
      <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/10 blur-2xl" />
      <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full bg-pink-400/20 blur-xl" />
      <div className="absolute top-1/2 left-1/4 w-20 h-20 rounded-full bg-white/5 blur-lg" />

      <div className="relative flex flex-col sm:flex-row items-center gap-6 p-6 md:p-8">
        {/* Gift Icon */}
        <motion.div
          initial={{ rotate: -10, scale: 0.8 }}
          animate={{ rotate: 0, scale: 1 }}
          transition={{ delay: 0.7, type: 'spring', stiffness: 100 }}
          className="w-16 h-16 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center flex-shrink-0
                     shadow-inner shadow-white/10"
        >
          <FiGift className="w-8 h-8 text-white" />
        </motion.div>

        {/* Text */}
        <div className="flex-1 text-center sm:text-left">
          <h3 className="text-xl font-bold text-white">Prices may change!</h3>
          <p className="text-purple-100 text-sm mt-1">
            Add items to your cart now to lock in today&apos;s best prices.
          </p>
        </div>

        {/* CTA Button */}
        <Link to="/">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-purple-700
                       font-semibold text-sm shadow-lg
                       hover:shadow-xl hover:bg-purple-50
                       transition-all duration-300"
            aria-label="Continue shopping"
          >
            <FiShoppingBag className="w-4 h-4" />
            Continue Shopping
          </motion.button>
        </Link>
      </div>
    </motion.div>
  )
}

const PromotionBanner = memo(PromotionBannerInner)
export default PromotionBanner
