import { motion } from 'framer-motion'
import { FiLoader, FiArrowRight } from 'react-icons/fi'

interface PremiumButtonProps {
  children: React.ReactNode
  onClick?: (e: React.MouseEvent) => void
  loading?: boolean
  disabled?: boolean
  type?: 'button' | 'submit'
}

export default function PremiumButton({
  children,
  onClick,
  loading = false,
  disabled = false,
  type = 'submit',
}: PremiumButtonProps) {
  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      whileHover={
        !disabled && !loading
          ? { scale: 1.02, boxShadow: '0 8px 30px rgba(239, 68, 68, 0.3)' }
          : {}
      }
      whileTap={!disabled && !loading ? { scale: 0.98 } : {}}
      className="group relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-[#EF4444] to-[#DC2626] px-6 py-3.5 font-semibold text-white shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
      <span className="relative z-10 flex items-center justify-center gap-2">
        {loading ? (
          <FiLoader className="animate-spin text-xl" />
        ) : (
          <>
            {children}
            <FiArrowRight className="text-lg transition-transform duration-300 group-hover:translate-x-1" />
          </>
        )}
      </span>
    </motion.button>
  )
}
