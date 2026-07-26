import { memo, useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { FiPackage, FiDollarSign, FiClock, FiCheckCircle } from 'react-icons/fi'

interface StatItem {
  icon: typeof FiPackage
  label: string
  value: number
  prefix?: string
  gradient: string
  iconBg: string
  iconColor: string
}

interface Props {
  totalOrders: number
  totalSpent: number
  pendingCount: number
  deliveredCount: number
}

function AnimatedCounter({ value, prefix = '' }: { value: number; prefix?: string }) {
  const [display, setDisplay] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })

  useEffect(() => {
    if (!isInView) return
    const duration = 1200
    const steps = 30
    const increment = value / steps
    let current = 0
    let step = 0
    const timer = setInterval(() => {
      step++
      current = Math.min(Math.round(increment * step), value)
      setDisplay(current)
      if (step >= steps) clearInterval(timer)
    }, duration / steps)
    return () => clearInterval(timer)
  }, [isInView, value])

  return <span ref={ref}>{prefix}{display.toLocaleString('en-IN')}</span>
}

function OrderStatsRowInner({ totalOrders, totalSpent, pendingCount, deliveredCount }: Props) {
  const stats: StatItem[] = [
    {
      icon: FiPackage,
      label: 'Total Orders',
      value: totalOrders,
      gradient: 'from-purple-500/10 via-purple-400/5 to-transparent',
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600',
    },
    {
      icon: FiDollarSign,
      label: 'Total Spent',
      value: Math.round(totalSpent),
      prefix: '₹',
      gradient: 'from-emerald-500/10 via-emerald-400/5 to-transparent',
      iconBg: 'bg-emerald-100',
      iconColor: 'text-emerald-600',
    },
    {
      icon: FiClock,
      label: 'Pending Orders',
      value: pendingCount,
      gradient: 'from-amber-500/10 via-amber-400/5 to-transparent',
      iconBg: 'bg-amber-100',
      iconColor: 'text-amber-600',
    },
    {
      icon: FiCheckCircle,
      label: 'Delivered Orders',
      value: deliveredCount,
      gradient: 'from-blue-500/10 via-blue-400/5 to-transparent',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
    },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 mb-8">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 + i * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          whileHover={{ y: -4, transition: { duration: 0.2 } }}
          className="relative overflow-hidden rounded-2xl bg-white/80 backdrop-blur-sm
                     shadow-[0_2px_20px_-4px_rgba(124,58,237,0.06)]
                     border border-purple-100/40
                     hover:shadow-[0_8px_30px_-8px_rgba(124,58,237,0.15)]
                     transition-all duration-300 group"
        >
          <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-60 group-hover:opacity-100 transition-opacity duration-300`} />
          <div className="relative p-4 md:p-5">
            <div className="flex items-start justify-between mb-3">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 + i * 0.08, type: 'spring', stiffness: 200 }}
                className={`w-10 h-10 rounded-xl ${stat.iconBg} flex items-center justify-center shadow-sm`}
              >
                <stat.icon className={`w-5 h-5 ${stat.iconColor}`} />
              </motion.div>
              <motion.div
                animate={{ y: [0, -3, 0] }}
                transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                className="w-8 h-8 rounded-full bg-white/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <span className="text-xs">📊</span>
              </motion.div>
            </div>
            <p className="text-2xl md:text-3xl font-bold text-gray-900">
              <AnimatedCounter value={stat.value} prefix={stat.prefix || ''} />
            </p>
            <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
          </div>
        </motion.div>
      ))}
    </div>
  )
}

const OrderStatsRow = memo(OrderStatsRowInner)
export default OrderStatsRow
