import { motion } from 'framer-motion'
import { FiShoppingBag } from 'react-icons/fi'
import { fadeInUp } from '../../lib/animations'
import FloatingProducts from './FloatingProducts'
import FeatureCards from './FeatureCards'
import SocialProof from './SocialProof'

interface LeftPanelProps {
  mode: 'login' | 'register'
}

export default function LeftPanel({ mode }: LeftPanelProps) {
  const heading = mode === 'login' ? 'Welcome Back' : 'Join ShopIQ'
  const subheading =
    mode === 'login'
      ? 'Sign in to access your personalized shopping experience with premium products.'
      : 'Create your account and discover thousands of premium products curated just for you.'

  return (
    <div className="lg:w-[45%] relative flex flex-col justify-between p-6 sm:p-8 md:p-10 lg:p-12 min-h-[50vh] lg:min-h-screen overflow-y-auto">
      <motion.div variants={fadeInUp} initial="initial" animate="animate" className="flex items-center gap-2.5 mb-6 lg:mb-10">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#EF4444] to-[#DC2626] flex items-center justify-center shadow-lg shadow-[#EF4444]/25">
          <FiShoppingBag className="text-white" size={20} />
        </div>
        <span className="text-xl font-bold text-white tracking-tight">ShopIQ</span>
      </motion.div>

      <div className="flex-1 flex flex-col justify-center">
        <motion.h1
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] mb-4 tracking-tight"
        >
          <span className="bg-gradient-to-r from-white via-white to-gray-400 bg-clip-text text-transparent">
            {heading}
          </span>
        </motion.h1>
        <motion.p
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          className="text-gray-400 text-sm md:text-base max-w-md mb-6 lg:mb-10 leading-relaxed"
        >
          {subheading}
        </motion.p>

        <motion.div
          variants={fadeInUp}
          initial="initial"
          animate="animate"
        >
          <FloatingProducts />
        </motion.div>
      </div>

      <div className="hidden lg:block space-y-6 mt-8">
        <FeatureCards />
        <SocialProof />
      </div>
    </div>
  )
}
