import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiLock, FiTag } from 'react-icons/fi'

interface OrderSummaryProps {
  subtotal: number
  tax: number
  shipping: number
  total: number
  discount: number
  itemCount: number
}

export default function OrderSummary({
  subtotal,
  tax,
  shipping,
  total,
  discount,
  itemCount,
}: OrderSummaryProps) {
  const [coupon, setCoupon] = useState('')

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="sticky top-24 bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-7"
    >
      <h3 className="text-lg font-bold text-gray-900 mb-6">Order Summary</h3>

      <div className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-500">Subtotal ({itemCount} items)</span>
          <span className="font-medium text-gray-900">₹{subtotal.toFixed(2)}</span>
        </div>

        {discount > 0 && (
          <div className="flex justify-between">
            <span className="text-gray-500">Discount</span>
            <span className="font-medium text-green-600">-₹{discount.toFixed(2)}</span>
          </div>
        )}

        <div className="flex justify-between">
          <span className="text-gray-500">Tax (5%)</span>
          <span className="font-medium text-gray-900">₹{tax.toFixed(2)}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-500">Shipping</span>
          {shipping === 0 ? (
            <span className="font-medium text-green-600">FREE</span>
          ) : (
            <span className="font-medium text-gray-900">₹{shipping.toFixed(2)}</span>
          )}
        </div>
      </div>

      {/* Coupon */}
      <div className="mt-5 flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50/50 px-3 py-2">
        <FiTag className="text-gray-400 shrink-0" size={16} />
        <input
          type="text"
          value={coupon}
          onChange={(e) => setCoupon(e.target.value)}
          placeholder="Enter coupon code"
          className="flex-1 bg-transparent text-sm text-gray-700 placeholder:text-gray-400 outline-none"
        />
        <button className="text-xs font-semibold text-[#7C3AED] hover:text-[#6D28D9] transition-colors">
          Apply
        </button>
      </div>

      <div className="border-t border-gray-100 mt-5 pt-5">
        <div className="flex justify-between items-baseline">
          <span className="text-base font-bold text-gray-900">Total</span>
          <motion.span
            key={total}
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            className="text-xl font-bold text-gray-900"
          >
            ₹{total.toFixed(2)}
          </motion.span>
        </div>
      </div>

      <Link to="/checkout">
        <motion.button
          whileHover={{ scale: 1.02, boxShadow: '0 8px 30px rgba(124,58,237,0.25)' }}
          whileTap={{ scale: 0.98 }}
          className="relative mt-6 w-full overflow-hidden rounded-xl bg-gradient-to-r from-[#7C3AED] to-[#EC4899] px-6 py-3.5 font-semibold text-white shadow-lg"
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            animate={{ x: ['-200%', '200%'] }}
            transition={{ repeat: Infinity, duration: 2.5, ease: 'linear', repeatDelay: 1 }}
          />
          <span className="relative z-10 flex items-center justify-center gap-2">
            Proceed to Checkout
            <span className="text-lg">&rarr;</span>
          </span>
        </motion.button>
      </Link>

      <div className="flex items-center justify-center gap-1.5 mt-4 text-xs text-gray-400">
        <FiLock size={12} />
        <span>Secure checkout</span>
      </div>

      {/* Benefits */}
      <div className="mt-6 grid grid-cols-2 gap-2">
        {[
          { icon: '🚚', label: 'Free Shipping' },
          { icon: '🔒', label: 'Secure Payment' },
          { icon: '↩️', label: 'Easy Returns' },
          { icon: '💬', label: '24/7 Support' },
        ].map((b) => (
          <div
            key={b.label}
            className="flex items-center gap-2 rounded-xl bg-gray-50/70 px-3 py-2.5 text-xs text-gray-600"
          >
            <span>{b.icon}</span>
            <span>{b.label}</span>
          </div>
        ))}
      </div>
    </motion.div>
  )
}
