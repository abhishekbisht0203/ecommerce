import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import type { Category } from '../types/product'

interface Props {
  categories: Category[]
  loading?: boolean
}

const categoryIcons: Record<string, string> = {
  beauty: '💄',
  fragrances: '🌸',
  furniture: '🪑',
  groceries: '🛒',
  'home-decoration': '🏠',
  'kitchen-accessories': '🍳',
  laptops: '💻',
  'mens-shirts': '👔',
  'mens-shoes': '👞',
  'mens-watches': '⌚',
  'mobile-accessories': '📱',
  motorcycle: '🏍️',
  'skin-care': '🧴',
  smartphones: '📱',
  'sports-accessories': '⚽',
  sunglasses: '🕶️',
  tablets: '📟',
  tops: '👕',
  vehicle: '🚗',
  'womens-bags': '👜',
  'womens-dresses': '👗',
  'womens-jewellery': '💎',
  'womens-shoes': '👠',
  'womens-watches': '⌚',
}

export default function CategoryPills({ categories, loading }: Props) {
  const location = useLocation()
  const currentCategory = location.pathname.replace('/category/', '')

  if (loading) {
    return (
      <div className="flex gap-3 overflow-x-auto pb-2 px-1 scrollbar-hide">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="shrink-0 w-24 h-10 bg-gray-200 rounded-full animate-pulse" />
        ))}
      </div>
    )
  }

  if (categories.length === 0) return null

  return (
    <nav className="flex gap-2 md:gap-3 overflow-x-auto pb-2 px-1 scrollbar-hide" aria-label="Product categories">
      <Link
        to="/product"
        className={`shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border ${
          !currentCategory || currentCategory === 'product'
            ? 'bg-black text-white border-black'
            : 'bg-white text-gray-700 border-gray-200 hover:border-gray-400 hover:shadow-sm'
        }`}
      >
        All
      </Link>
      {categories.map((cat, i) => (
        <motion.div
          key={cat.slug}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.03 }}
        >
          <Link
            to={`/category/${cat.slug}`}
            className={`shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border whitespace-nowrap ${
              currentCategory === cat.slug
                ? 'bg-black text-white border-black'
                : 'bg-white text-gray-700 border-gray-200 hover:border-gray-400 hover:shadow-sm'
            }`}
          >
            <span className="text-base">{categoryIcons[cat.slug] || '🛍️'}</span>
            {cat.name}
          </Link>
        </motion.div>
      ))}
    </nav>
  )
}
