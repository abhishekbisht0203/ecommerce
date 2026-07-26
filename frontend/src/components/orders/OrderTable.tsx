import { memo } from 'react'
import { motion } from 'framer-motion'
import { FiEye, FiChevronRight, FiBox } from 'react-icons/fi'
import OrderStatusBadge from './OrderStatusBadge'
import type { Order } from '../../types/order'

interface Props {
  orders: Order[]
}

function OrderTableInner({ orders }: Props) {
  if (orders.length === 0) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="hidden md:block rounded-2xl bg-white/80 backdrop-blur-sm
                 shadow-[0_2px_20px_-4px_rgba(124,58,237,0.06)]
                 border border-purple-100/40 overflow-hidden"
    >
      <div className="overflow-x-auto">
        <table className="w-full" role="table" aria-label="Order history">
          {/* Sticky Header */}
          <thead>
            <tr className="border-b border-purple-100/50 bg-purple-50/30">
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                Order ID
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                Product
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                Qty
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                Total
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-purple-100/30">
            {orders.map((order, index) => (
              <motion.tr
                key={order.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.04, duration: 0.3 }}
                whileHover={{ backgroundColor: 'rgba(124,58,237,0.03)' }}
                className="group transition-colors duration-200"
              >
                {/* Order ID */}
                <td className="px-6 py-5">
                  <span className="text-sm font-bold text-gray-900">#{order.id}</span>
                </td>

                {/* Product */}
                <td className="px-6 py-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center flex-shrink-0 shadow-sm">
                      <FiBox className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900 line-clamp-1">{order.product}</p>
                      <p className="text-xs text-gray-400">Order #{order.id}</p>
                    </div>
                  </div>
                </td>

                {/* Quantity */}
                <td className="px-6 py-5">
                  <span className="text-sm font-medium text-gray-700">{order.quantity}</span>
                </td>

                {/* Total */}
                <td className="px-6 py-5">
                  <span className="text-base font-bold text-green-600">₹{parseFloat(order.total).toFixed(2)}</span>
                </td>

                {/* Status */}
                <td className="px-6 py-5">
                  <OrderStatusBadge status={order.status} />
                </td>

                {/* Actions */}
                <td className="px-6 py-5">
                  <div className="flex items-center justify-end gap-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="w-9 h-9 rounded-full bg-white border border-purple-100
                                 flex items-center justify-center text-gray-400 hover:text-purple-600
                                 hover:border-purple-200 hover:shadow-md
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
                                 hover:bg-purple-100 hover:shadow-md
                                 transition-all duration-200"
                      aria-label="Order details"
                    >
                      <FiChevronRight className="w-4 h-4" />
                    </motion.button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  )
}

const OrderTable = memo(OrderTableInner)
export default OrderTable
