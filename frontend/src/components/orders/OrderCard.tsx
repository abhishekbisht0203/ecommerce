import { memo } from 'react'
import { motion } from 'framer-motion'
import { FiEye, FiChevronRight, FiBox } from 'react-icons/fi'
import OrderStatusBadge from './OrderStatusBadge'
import type { Order } from '../../types/order'

interface Props {
  order: Order
  index: number
}

function OrderCardInner({ order, index }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="md:hidden rounded-2xl bg-white/90 backdrop-blur-sm
                 shadow-[0_2px_20px_-4px_rgba(124,58,237,0.06)]
                 border border-purple-100/40 p-4"
    >
      {/* Top Row: Order ID + Status */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-bold text-gray-900">#{order.id}</span>
        <OrderStatusBadge status={order.status} />
      </div>

      {/* Product */}
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center flex-shrink-0">
          <FiBox className="w-5 h-5 text-purple-600" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-900 truncate">{order.product}</p>
          <p className="text-xs text-gray-400">Qty: {order.quantity}</p>
        </div>
      </div>

      {/* Bottom Row: Total + Actions */}
      <div className="flex items-center justify-between pt-3 border-t border-purple-100/30">
        <span className="text-lg font-bold text-green-600">₹{parseFloat(order.total).toFixed(2)}</span>
        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="w-9 h-9 rounded-full bg-white border border-purple-100
                       flex items-center justify-center text-gray-400 hover:text-purple-600
                       transition-all duration-200"
            aria-label="View order details"
          >
            <FiEye className="w-4 h-4" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="w-9 h-9 rounded-full bg-purple-50 border border-purple-100
                       flex items-center justify-center text-purple-600
                       transition-all duration-200"
            aria-label="Order details"
          >
            <FiChevronRight className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}

const OrderCard = memo(OrderCardInner)
export default OrderCard
