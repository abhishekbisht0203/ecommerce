import { useEffect, useRef, useState, useCallback } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FiUser, FiPackage, FiHeart, FiShoppingCart, FiPlus,
  FiLogOut, FiChevronRight, FiLogIn, FiUserPlus, FiX
} from 'react-icons/fi'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'
import { useWishlist } from '../../context/WishlistContext'

interface AccountDropdownProps {
  isOpen: boolean
  onClose: () => void
}

function getInitials(name: string) {
  return name.charAt(0).toUpperCase()
}

function Ripple({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const [ripples, setRipples] = useState<{ x: number; y: number; id: number }[]>([])
  const ref = useRef<HTMLButtonElement>(null)
  const idRef = useRef(0)

  const handleClick = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const id = idRef.current++
    setRipples((prev) => [...prev, { x, y, id }])
    setTimeout(() => setRipples((prev) => prev.filter((r) => r.id !== id)), 600)
  }, [])

  return (
    <button ref={ref} onClick={handleClick} className={`relative overflow-hidden ${className}`}>
      {children}
      {ripples.map((r) => (
        <span
          key={r.id}
          className="absolute pointer-events-none rounded-full bg-white/30 animate-ripple"
          style={{ left: r.x - 8, top: r.y - 8, width: 16, height: 16 }}
        />
      ))}
    </button>
  )
}

const dropdownVariants = {
  hidden: { opacity: 0, scale: 0.94, y: -12, filter: 'blur(6px)' },
  visible: {
    opacity: 1, scale: 1, y: 0, filter: 'blur(0px)',
    transition: { type: 'spring' as const, duration: 0.35, bounce: 0.15 },
  },
  exit: {
    opacity: 0, scale: 0.94, y: -10, filter: 'blur(4px)',
    transition: { duration: 0.15, ease: 'easeIn' as const },
  },
}

const sheetVariants = {
  hidden: { y: '100%' },
  visible: {
    y: 0,
    transition: { type: 'spring' as const, duration: 0.4, bounce: 0.25 },
  },
  exit: {
    y: '100%',
    transition: { duration: 0.2, ease: 'easeIn' as const },
  },
}

const itemVariants = {
  hidden: { opacity: 0, x: -12 },
  visible: (i: number) => ({
    opacity: 1, x: 0,
    transition: { delay: i * 0.035, duration: 0.2, ease: 'easeOut' as const },
  }),
}

function MenuItem({
  icon: Icon,
  label,
  to,
  onClick,
  danger,
  className = '',
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  to?: string
  onClick?: () => void
  danger?: boolean
  className?: string
}) {
  const content = (
    <motion.div
      className={`group relative flex items-center gap-3 px-4 py-2.5 mx-2 rounded-xl cursor-pointer
        transition-all duration-200 select-none
        ${danger
          ? 'text-red-500 hover:bg-red-50 hover:text-red-600'
          : 'text-gray-700 hover:bg-purple-50 hover:text-purple-700'
        } ${className}`}
      whileHover={{ x: 2, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
    >
      <span className={`flex-shrink-0 w-5 h-5 transition-transform duration-200
        ${danger ? 'group-hover:scale-110' : 'group-hover:scale-110 group-hover:-translate-x-0.5'}`}
      >
        <Icon className={`w-full h-full ${danger ? '' : ''}`} />
      </span>
      <span className="flex-1 text-sm font-medium">{label}</span>
      <FiChevronRight className={`w-3.5 h-3.5 text-gray-300 transition-all duration-200
        ${danger
          ? 'group-hover:translate-x-0.5 group-hover:text-red-400'
          : 'opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 group-hover:text-purple-400'
        }`} />
    </motion.div>
  )

  if (to) {
    return <Link to={to} onClick={onClick}>{content}</Link>
  }
  return <div onClick={onClick}>{content}</div>
}

function QuickActionCard({
  icon: Icon,
  label,
  count,
  to,
  color,
  onClick,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  count: number
  to: string
  color: string
  onClick?: () => void
}) {
  const content = (
    <motion.div
      className={`relative flex flex-col items-center justify-center gap-1 py-3 px-2 rounded-2xl cursor-pointer
        transition-all duration-200 border border-transparent ${color}`}
      whileHover={{ y: -2, scale: 1.02 }}
      whileTap={{ scale: 0.96 }}
      onClick={onClick}
    >
      <Icon className="w-5 h-5 text-gray-700" />
      <span className="text-lg font-bold text-gray-900 tabular-nums">{count}</span>
      <span className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">{label}</span>
    </motion.div>
  )

  return <Link to={to}>{content}</Link>
}

function LoggedOutView({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.1, duration: 0.25 }}
      className="flex flex-col items-center px-6 py-8 text-center"
    >
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-4 shadow-lg shadow-purple-200">
        <FiUser className="w-8 h-8 text-white" />
      </div>
      <h3 className="text-lg font-bold text-gray-900 mb-1">Welcome to ShopIQ</h3>
      <p className="text-sm text-gray-500 mb-6 max-w-[240px] leading-relaxed">
        Sign in to save your wishlist, orders and cart.
      </p>
      <div className="w-full space-y-3">
        <Link to="/login" onClick={onClose}>
          <Ripple className="w-full py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-500 text-white text-sm font-semibold shadow-lg shadow-purple-200/50 hover:shadow-xl hover:shadow-purple-300/50 transition-shadow duration-300 active:scale-[0.98]">
            <span className="flex items-center justify-center gap-2">
              <FiLogIn className="w-4 h-4" />
              Sign In
            </span>
          </Ripple>
        </Link>
        <Link to="/register" onClick={onClose}>
          <Ripple className="w-full py-2.5 rounded-2xl border-2 border-purple-200 text-purple-700 text-sm font-semibold hover:bg-purple-50 hover:border-purple-300 transition-all duration-300 active:scale-[0.98]">
            <span className="flex items-center justify-center gap-2">
              <FiUserPlus className="w-4 h-4" />
              Create Account
            </span>
          </Ripple>
        </Link>
      </div>
      <div className="relative w-full mt-6 mb-2">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-100" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-white px-3 text-[11px] text-gray-400 uppercase tracking-wider">Continue as Guest</span>
        </div>
      </div>
    </motion.div>
  )
}

function LoggedInView({
  user,
  cartCount,
  wishlistCount,
  onClose,
  onLogout,
}: {
  user: { id: number; username: string; email: string }
  cartCount: number
  wishlistCount: number
  onClose: () => void
  onLogout: () => void
}) {
  const [loggingOut, setLoggingOut] = useState(false)

  const handleLogout = async () => {
    setLoggingOut(true)
    try {
      await onLogout()
    } finally {
      setLoggingOut(false)
      onClose()
    }
  }

  const menuItems = [
    { icon: FiPackage, label: 'My Orders', to: '/orders' },
    { icon: FiHeart, label: 'Wishlist', to: '/wishlist' },
    { icon: FiShoppingCart, label: 'Cart', to: '/cart' },
    { icon: FiPlus, label: 'Add Product', to: '/add-product' },
  ]

  const quickActions = [
    { icon: FiPackage, label: 'Orders', count: 0, to: '/orders', color: 'hover:bg-blue-50 hover:border-blue-100' },
    { icon: FiHeart, label: 'Wishlist', count: wishlistCount, to: '/wishlist', color: 'hover:bg-red-50 hover:border-red-100' },
    { icon: FiShoppingCart, label: 'Cart', count: cartCount, to: '/cart', color: 'hover:bg-amber-50 hover:border-amber-100' },
  ]

  return (
    <div className="flex flex-col">
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05, duration: 0.25 }}
        className="flex flex-col items-center pt-6 pb-4 px-6 bg-gradient-to-b from-purple-50/50 to-transparent"
      >
        <div className="relative mb-3">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-amber-500 p-[2px] shadow-lg shadow-purple-200">
            <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
              <span className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-purple-600 to-pink-500">
                {getInitials(user.username)}
              </span>
            </div>
          </div>
          <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 border-2 border-white rounded-full">
            <span className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-50" />
          </span>
        </div>
        <h3 className="text-base font-bold text-gray-900">{user.username}</h3>
        <p className="text-xs text-gray-500 mt-0.5">{user.email}</p>
        <span className="mt-2 inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-semibold bg-gradient-to-r from-amber-50 to-orange-50 text-amber-700 border border-amber-200/50">
          <FiUser className="w-3 h-3" />
          Verified Customer
        </span>
      </motion.div>

      <div className="px-6 pb-4">
        <div className="grid grid-cols-3 gap-2">
          {quickActions.map((action, i) => (
            <motion.div
              key={action.label}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 + i * 0.04, duration: 0.2 }}
            >
              <QuickActionCard {...action} onClick={onClose} />
            </motion.div>
          ))}
        </div>
      </div>

      <div className="border-t border-gray-100 pt-1 pb-1">
        {menuItems.map((item, i) => (
          <motion.div
            key={item.label}
            custom={i}
            variants={itemVariants}
            initial="hidden"
            animate="visible"
          >
            <MenuItem icon={item.icon} label={item.label} to={item.to} onClick={onClose} />
          </motion.div>
        ))}
      </div>

      <div className="border-t border-gray-100 pt-1 pb-2">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25, duration: 0.2 }}
        >
          <MenuItem
            icon={FiLogOut}
            label={loggingOut ? 'Logging out...' : 'Logout'}
            onClick={handleLogout}
            danger
          />
        </motion.div>
      </div>
    </div>
  )
}

function DropdownContent({
  user,
  cartCount,
  wishlistCount,
  onClose,
  onLogout,
}: {
  user: { id: number; username: string; email: string } | null
  cartCount: number
  wishlistCount: number
  onClose: () => void
  onLogout: () => void
}) {
  if (user) {
    return (
      <LoggedInView
        user={user}
        cartCount={cartCount}
        wishlistCount={wishlistCount}
        onClose={onClose}
        onLogout={onLogout}
      />
    )
  }
  return <LoggedOutView onClose={onClose} />
}

export default function AccountDropdown({ isOpen, onClose }: AccountDropdownProps) {
  const { user, logout } = useAuth()
  const { count: cartCount } = useCart()
  const { count: wishlistCount } = useWishlist()
  const location = useLocation()
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  useEffect(() => {
    if (!isOpen) return
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [isOpen, onClose])

  useEffect(() => {
    onClose()
  }, [location.pathname])

  useEffect(() => {
    if (isMobile && isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isMobile, isOpen])

  const handleLogout = useCallback(async () => {
    await logout()
  }, [logout])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {isMobile ? (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50"
                onClick={onClose}
                aria-hidden="true"
              />
              <motion.div
                key="mobile-sheet"
                variants={sheetVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="fixed bottom-0 left-0 right-0 z-50 max-h-[90vh] overflow-y-auto rounded-t-3xl bg-white/95 backdrop-blur-xl shadow-2xl"
                role="dialog"
                aria-modal="true"
                aria-label="Account menu"
              >
                <div className="sticky top-0 bg-white/80 backdrop-blur-sm pt-3 pb-1 flex justify-center rounded-t-3xl z-10">
                  <div className="w-10 h-1 rounded-full bg-gray-300" />
                </div>
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors z-10"
                  aria-label="Close menu"
                >
                  <FiX className="w-5 h-5 text-gray-500" />
                </button>
                <DropdownContent
                  user={user}
                  cartCount={cartCount}
                  wishlistCount={wishlistCount}
                  onClose={onClose}
                  onLogout={handleLogout}
                />
                <div className="h-6" />
              </motion.div>
            </>
          ) : (
            <motion.div
              key="desktop-dropdown"
              variants={dropdownVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="absolute right-0 top-full mt-2 w-[340px] rounded-2xl bg-white/80 backdrop-blur-xl border border-white/30 shadow-xl shadow-black/5 ring-1 ring-black/5 z-50 overflow-hidden"
              role="menu"
              aria-label="Account menu"
            >
              <DropdownContent
                user={user}
                cartCount={cartCount}
                wishlistCount={wishlistCount}
                onClose={onClose}
                onLogout={handleLogout}
              />
            </motion.div>
          )}
        </>
      )}
    </AnimatePresence>
  )
}
