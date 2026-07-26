import { memo } from 'react'
import { motion } from 'framer-motion'
import { FiShoppingBag, FiBell, FiShare2, FiShield, FiArrowRight } from 'react-icons/fi'
import type { DummyProduct } from '../../types/product'

interface Props {
  products: DummyProduct[]
  onMoveAllToCart: () => void
}

function WishlistSummaryInner({ products, onMoveAllToCart }: Props) {
  const totalValue = products.reduce((sum, p) => {
    const discounted = p.price * (1 - p.discountPercentage / 100)
    return sum + discounted
  }, 0)

  const totalSavings = products.reduce((sum, p) => {
    const discounted = p.price * (1 - p.discountPercentage / 100)
    return sum + (p.price - discounted)
  }, 0)

  const features = [
    { icon: FiBell, title: 'Price Drop Alerts', desc: 'Get notified when prices drop' },
    { icon: FiShoppingBag, title: 'Easy Checkout', desc: 'Move items to cart anytime' },
    { icon: FiShare2, title: 'Share Wishlist', desc: 'Share with friends & family' },
    { icon: FiShield, title: 'Secure & Private', desc: 'Your wishlist is always safe' },
  ]

  return (
    <motion.aside
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="lg:sticky lg:top-24 self-start"
    >
      <div className="rounded-2xl bg-white/90 backdrop-blur-sm
                      shadow-[0_2px_20px_-4px_rgba(124,58,237,0.08)]
                      border border-purple-100/50 overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-purple-100/50">
          <h2 className="text-lg font-bold text-gray-900">Wishlist Summary</h2>
          <p className="text-sm text-gray-500 mt-0.5">{products.length} item{products.length !== 1 ? 's' : ''} saved</p>
        </div>

        {/* Stats */}
        <div className="p-5 space-y-3">
          <div className="flex items-center justify-between py-2">
            <span className="text-sm text-gray-500">Total Items</span>
            <span className="text-sm font-semibold text-gray-900">{products.length}</span>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-sm text-gray-500">Wishlist Value</span>
            <span className="text-sm font-semibold text-gray-900">₹{totalValue.toFixed(2)}</span>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-sm text-gray-500">Total Savings</span>
            <span className="text-sm font-semibold text-green-600">₹{totalSavings.toFixed(2)}</span>
          </div>
        </div>

        {/* Move All to Cart Button */}
        <div className="px-5 pb-5">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onMoveAllToCart}
            disabled={products.length === 0}
            className="relative overflow-hidden w-full py-3.5 rounded-xl text-sm font-semibold text-white
                       bg-gradient-to-r from-purple-600 to-pink-500
                       shadow-lg shadow-purple-500/25 hover:shadow-xl hover:shadow-purple-500/30
                       disabled:opacity-50 disabled:cursor-not-allowed
                       flex items-center justify-center gap-2
                       transition-all duration-300"
            aria-label="Move all to cart"
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -skew-x-12"
              initial={{ x: '-100%' }}
              animate={{ x: '400%' }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 4 }}
            />
            <FiShoppingBag className="w-4 h-4" />
            Move All to Cart
            <FiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </motion.button>
        </div>

        {/* Feature Cards */}
        <div className="px-5 pb-5 space-y-2">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + i * 0.08 }}
              className="flex items-center gap-3 p-3 rounded-xl bg-purple-50/50 hover:bg-purple-50 transition-colors duration-200"
            >
              <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
                <feature.icon className="w-4 h-4 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800">{feature.title}</p>
                <p className="text-xs text-gray-400">{feature.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.aside>
  )
}

const WishlistSummary = memo(WishlistSummaryInner)
export default WishlistSummary
