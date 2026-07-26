import { motion } from 'framer-motion'

interface CartHeaderProps {
  itemCount: number
}

export default function CartHeader({ itemCount }: CartHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-6"
    >
      <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
        <span className="bg-gradient-to-r from-[#7C3AED] via-[#EC4899] to-[#7C3AED] bg-clip-text text-transparent bg-[length:200%_auto] animate-[gradient-x_4s_ease_infinite]">
          Your Shopping Cart
        </span>
      </h1>
      <p className="text-gray-500 mt-1.5 text-sm sm:text-base">
        {itemCount} {itemCount === 1 ? 'item' : 'items'} in your cart
      </p>
    </motion.div>
  )
}
