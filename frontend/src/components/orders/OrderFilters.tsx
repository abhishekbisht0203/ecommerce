import { memo } from 'react'
import { motion } from 'framer-motion'
import { FiFilter } from 'react-icons/fi'
import type { OrderStatus } from '../../types/order'

interface Props {
  activeFilter: OrderStatus | 'All'
  sortBy: string
  onFilterChange: (filter: OrderStatus | 'All') => void
  onSortChange: (sort: string) => void
}

const filters: (OrderStatus | 'All')[] = ['All', 'Pending', 'Delivered', 'Cancelled']

const sortOptions = [
  { value: 'newest', label: 'Newest' },
  { value: 'oldest', label: 'Oldest' },
  { value: 'amount-desc', label: 'Highest Amount' },
  { value: 'amount-asc', label: 'Lowest Amount' },
]

function OrderFiltersInner({ activeFilter, sortBy, onFilterChange, onSortChange }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6"
    >
      {/* Filter Pills */}
      <div className="flex items-center gap-2 flex-wrap" role="group" aria-label="Order status filters">
        {filters.map((filter) => (
          <motion.button
            key={filter}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onFilterChange(filter)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300
              ${activeFilter === filter
                ? 'bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-lg shadow-purple-500/20'
                : 'bg-white/70 backdrop-blur-sm text-gray-600 hover:text-gray-900 border border-purple-100/50 hover:border-purple-200 shadow-sm'
              }`}
            aria-pressed={activeFilter === filter}
            aria-label={`Filter by ${filter}`}
          >
            {filter === 'All' ? 'All Orders' : filter}
          </motion.button>
        ))}
      </div>

      {/* Sort + Filter Icon */}
      <div className="flex items-center gap-3">
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          className="px-4 py-2 rounded-full text-sm font-medium bg-white/70 backdrop-blur-sm
                     border border-purple-100/50 text-gray-700
                     shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-300
                     transition-all duration-200 cursor-pointer"
          aria-label="Sort orders"
        >
          {sortOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="p-2.5 rounded-full bg-white/70 backdrop-blur-sm border border-purple-100/50
                     text-gray-500 hover:text-purple-600 shadow-sm
                     transition-all duration-200"
          aria-label="Filter options"
        >
          <FiFilter className="w-4 h-4" />
        </motion.button>
      </div>
    </motion.div>
  )
}

const OrderFilters = memo(OrderFiltersInner)
export default OrderFilters
