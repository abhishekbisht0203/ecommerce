import { motion } from 'framer-motion'
import type { CartItem } from '../../types/cart'
import { FiTruck, FiPackage } from 'react-icons/fi'

interface OrderSummaryCardProps {
  items: CartItem[]
  subtotal: number
  shipping: number
  tax: number
  total: number
}

const FREE_SHIPPING_THRESHOLD = 150

export default function OrderSummaryCard({ items, subtotal, shipping, tax, total }: OrderSummaryCardProps) {
  const progress = Math.min((subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100)
  const remaining = FREE_SHIPPING_THRESHOLD - subtotal

  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100 overflow-hidden sticky top-6"
    >
      <div className="p-5 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <FiPackage className="w-5 h-5 text-purple-600" />
          <h2 className="text-lg font-semibold text-gray-900">Order Summary</h2>
        </div>
        {subtotal > 0 && subtotal < FREE_SHIPPING_THRESHOLD && (
          <div className="mt-3">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="text-gray-500">
                <FiTruck className="w-3.5 h-3.5 inline mr-1 text-purple-500" />
                Add ₹{remaining.toFixed(2)} for free shipping
              </span>
              <span className="text-purple-600 font-medium">{Math.round(progress)}%</span>
            </div>
            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
              />
            </div>
          </div>
        )}
        {subtotal >= FREE_SHIPPING_THRESHOLD && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-3 flex items-center gap-1.5 text-xs text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg"
          >
            <FiTruck className="w-3.5 h-3.5" />
            <span className="font-medium">You've earned free shipping!</span>
          </motion.div>
        )}
      </div>

      <div className="p-5 space-y-4 max-h-64 overflow-y-auto custom-scrollbar">
        {items.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="flex items-center gap-3"
          >
            <div className="h-14 w-14 bg-gray-50 rounded-xl flex items-center justify-center border border-gray-100 flex-shrink-0">
              <img src={item.thumbnail} alt={item.title} className="h-10 w-10 object-contain" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-800 truncate">{item.title}</p>
              <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
            </div>
            <p className="text-sm font-semibold text-gray-900 whitespace-nowrap">
              ₹{(item.price * item.quantity).toFixed(2)}
            </p>
          </motion.div>
        ))}
      </div>

      <div className="border-t border-gray-100 p-5 space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Subtotal</span>
          <span className="text-gray-900 font-medium">₹{subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Shipping</span>
          <span className={`font-medium ${shipping === 0 ? 'text-emerald-600' : 'text-gray-900'}`}>
            {shipping === 0 ? 'FREE' : `₹${shipping.toFixed(2)}`}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Tax (5%)</span>
          <span className="text-gray-900 font-medium">₹{tax.toFixed(2)}</span>
        </div>
        <div className="border-t border-gray-200 pt-3 flex justify-between items-baseline">
          <span className="text-base font-semibold text-gray-900">Total</span>
          <span className="text-xl font-bold text-purple-700">₹{total.toFixed(2)}</span>
        </div>
      </div>
    </motion.div>
  )
}
