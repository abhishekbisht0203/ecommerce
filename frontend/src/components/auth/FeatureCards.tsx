import { motion } from 'framer-motion'
import { FiShield, FiTruck, FiRefreshCw, FiHeadphones, FiAward, FiCheckCircle } from 'react-icons/fi'

const features = [
  { icon: FiShield, title: 'Secure Payments', description: '256-bit encrypted' },
  { icon: FiTruck, title: 'Fast Delivery', description: 'Free shipping over $50' },
  { icon: FiRefreshCw, title: 'Easy Returns', description: '30-day return policy' },
  { icon: FiHeadphones, title: '24/7 Support', description: 'Round the clock help' },
  { icon: FiAward, title: 'Premium Brands', description: 'Top quality assured' },
  { icon: FiCheckCircle, title: '100% Genuine', description: 'Authentic products' },
]

export default function FeatureCards() {
  return (
    <div className="grid grid-cols-3 gap-2.5">
      {features.map((feature, i) => (
        <motion.div
          key={feature.title}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.06, duration: 0.4 }}
          whileHover={{ y: -3, scale: 1.02 }}
          className="group relative rounded-xl border border-white/10 bg-white/[0.03] p-2.5 backdrop-blur-sm transition-all duration-300 hover:border-[#EF4444]/30 hover:bg-white/[0.06] hover:shadow-[0_0_20px_rgba(239,68,68,0.08)]"
        >
          <div className="mb-1.5 flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-[#EF4444]/20 to-[#DC2626]/20 text-[#EF4444]">
            <feature.icon size={14} />
          </div>
          <h4 className="text-[11px] font-semibold text-white/90 mb-0.5">{feature.title}</h4>
          <p className="text-[9px] text-gray-500 leading-tight">{feature.description}</p>
        </motion.div>
      ))}
    </div>
  )
}
