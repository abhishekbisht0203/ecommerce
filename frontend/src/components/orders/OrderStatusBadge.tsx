import { memo } from 'react'
import { motion } from 'framer-motion'

interface Props {
  status: string
}

const statusConfig: Record<string, { bg: string; text: string; dot: string; icon: string }> = {
  Pending: {
    bg: 'bg-amber-50 border-amber-200',
    text: 'text-amber-700',
    dot: 'bg-amber-500',
    icon: '⏳',
  },
  Shipped: {
    bg: 'bg-blue-50 border-blue-200',
    text: 'text-blue-700',
    dot: 'bg-blue-500',
    icon: '🚚',
  },
  Delivered: {
    bg: 'bg-green-50 border-green-200',
    text: 'text-green-700',
    dot: 'bg-green-500',
    icon: '✅',
  },
  Cancelled: {
    bg: 'bg-red-50 border-red-200',
    text: 'text-red-700',
    dot: 'bg-red-500',
    icon: '❌',
  },
}

function OrderStatusBadgeInner({ status }: Props) {
  const config = statusConfig[status] || {
    bg: 'bg-gray-50 border-gray-200',
    text: 'text-gray-700',
    dot: 'bg-gray-500',
    icon: '📋',
  }

  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border ${config.bg} ${config.text}`}
    >
      <motion.span
        className={`w-1.5 h-1.5 rounded-full ${config.dot}`}
        animate={{ opacity: [1, 0.4, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
      {config.icon} {status}
    </motion.span>
  )
}

const OrderStatusBadge = memo(OrderStatusBadgeInner)
export default OrderStatusBadge
