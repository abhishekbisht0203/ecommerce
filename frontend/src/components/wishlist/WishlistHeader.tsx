import { memo } from 'react'
import { motion } from 'framer-motion'
import { FiShare2, FiTrash2, FiHeart } from 'react-icons/fi'

interface Props {
  count: number
  onClear: () => void
  onShare: () => void
}

function WishlistHeaderInner({ count, onClear, onShare }: Props) {
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
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          >
            <FiHeart className="w-8 h-8 text-pink-500" />
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
            <span className="bg-gradient-to-r from-purple-600 via-pink-500 to-purple-400 bg-clip-text text-transparent">
              My Wishlist
            </span>
          </h1>
        </div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-gray-500 text-lg mt-2 ml-1"
        >
          You have <span className="font-semibold text-gray-800">{count}</span> saved item{count !== 1 ? 's' : ''}
        </motion.p>
      </div>

      <div className="flex items-center gap-3 mt-4 sm:mt-0">
        <motion.button
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onShare}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium
                     bg-white/70 backdrop-blur-md border border-purple-100
                     text-purple-700 shadow-sm hover:shadow-md hover:bg-white
                     transition-all duration-300"
          aria-label="Share wishlist"
        >
          <FiShare2 className="w-4 h-4" />
          Share
        </motion.button>

        <motion.button
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onClear}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium
                     bg-white/70 backdrop-blur-md border border-red-100
                     text-red-500 shadow-sm hover:shadow-md hover:bg-white hover:border-red-200
                     transition-all duration-300"
          aria-label="Clear wishlist"
        >
          <FiTrash2 className="w-4 h-4" />
          Clear All
        </motion.button>
      </div>
    </motion.div>
  )
}

const WishlistHeader = memo(WishlistHeaderInner)
export default WishlistHeader
