import { motion } from 'framer-motion'
import { cardSlideIn } from '../../lib/animations'

interface AuthCardProps {
  children: React.ReactNode
}

export default function AuthCard({ children }: AuthCardProps) {
  return (
    <motion.div
      variants={cardSlideIn}
      initial="initial"
      animate="animate"
      className="w-full max-w-md mx-auto"
    >
      <div className="relative">
        <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-b from-white/10 via-white/5 to-transparent opacity-50 pointer-events-none" />
        <div className="relative bg-white/[0.04] backdrop-blur-2xl rounded-2xl border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.3)] p-8 md:p-10">
          {children}
        </div>
      </div>
    </motion.div>
  )
}
