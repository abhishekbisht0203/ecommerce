import { memo } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiArrowLeft, FiList } from 'react-icons/fi'

function OrderHeaderInner() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10"
    >
      <div>
        <div className="flex items-center gap-3">
          <motion.div
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.15, type: 'spring', stiffness: 200 }}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
              <FiList className="w-5 h-5 text-purple-600" />
            </div>
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
            <span className="bg-gradient-to-r from-purple-600 via-pink-500 to-purple-400 bg-clip-text text-transparent">
              Order History
            </span>
          </h1>
        </div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 }}
          className="text-gray-500 text-lg mt-2 ml-1"
        >
          Track and manage all your orders in one place.
        </motion.p>
      </div>

      <Link to="/">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.35 }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="group flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium
                     bg-white/70 backdrop-blur-md border border-purple-100
                     text-purple-700 shadow-sm hover:shadow-md hover:bg-white
                     transition-all duration-300"
        >
          <motion.span
            animate={{ x: [0, -4, 0] }}
            transition={{ duration: 0.3 }}
            className="group-hover:-translate-x-0.5 transition-transform"
          >
            <FiArrowLeft className="w-4 h-4" />
          </motion.span>
          Back to Dashboard
        </motion.div>
      </Link>
    </motion.div>
  )
}

const OrderHeader = memo(OrderHeaderInner)
export default OrderHeader
