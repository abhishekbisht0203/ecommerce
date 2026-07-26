import { motion } from 'framer-motion'

interface ShippingProgressProps {
  subtotal: number
  threshold?: number
}

export default function ShippingProgress({
  subtotal,
  threshold = 150,
}: ShippingProgressProps) {
  const remaining = Math.max(threshold - subtotal, 0)
  const progress = Math.min((subtotal / threshold) * 100, 100)
  const isFree = subtotal >= threshold

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.15 }}
      className={`rounded-2xl p-5 border ${
        isFree
          ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200'
          : 'bg-gradient-to-r from-purple-50 to-pink-50 border-purple-100'
      }`}
    >
      {isFree ? (
        <div className="flex items-center gap-3">
          <span className="text-2xl">🎉</span>
          <div>
            <p className="font-semibold text-green-700">Congratulations!</p>
            <p className="text-sm text-green-600">You've unlocked FREE shipping on this order!</p>
          </div>
        </div>
      ) : (
        <>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">🚚</span>
            <p className="text-sm text-gray-600">
              Add <span className="font-bold text-[#7C3AED]">₹{remaining.toFixed(2)}</span> more to unlock{' '}
              <span className="font-semibold text-green-600">FREE Shipping</span>
            </p>
          </div>
          <div className="h-2.5 bg-white/80 rounded-full overflow-hidden shadow-inner">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
              className="relative h-full rounded-full bg-gradient-to-r from-[#7C3AED] to-[#EC4899]"
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                animate={{ x: ['-100%', '100%'] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'linear', repeatDelay: 1 }}
              />
            </motion.div>
          </div>
          <p className="text-xs text-gray-400 mt-1.5 text-right">{Math.round(progress)}%</p>
        </>
      )}
    </motion.div>
  )
}
