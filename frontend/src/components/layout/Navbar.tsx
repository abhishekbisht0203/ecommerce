import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'
import { useWishlist } from '../../context/WishlistContext'
import { fetchCategories, searchProducts } from '../../services/dummyjson'
import { useDebounce } from '../../hooks/useDebounce'
import { FiSearch, FiHeart, FiShoppingCart, FiUser, FiMenu, FiX } from 'react-icons/fi'
import Logo from '../Logo'
import AccountDropdown from './AccountDropdown'
import type { Category, DummyProduct } from '../../types/product'

export default function Navbar() {
  const { user } = useAuth()
  const { count: cartCount } = useCart()
  const { count: wishlistCount } = useWishlist()
  const location = useLocation()
  const [search, setSearch] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [suggestions, setSuggestions] = useState<DummyProduct[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [searching, setSearching] = useState(false)
  const navigate = useNavigate()
  const searchRef = useRef<HTMLDivElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const debouncedSearch = useDebounce(search, 300)

  useEffect(() => {
    fetchCategories().then(setCategories)
  }, [])

  useEffect(() => {
    if (debouncedSearch.trim().length < 2) {
      setSuggestions([])
      setSearching(false)
      return
    }
    let cancelled = false
    async function load() {
      setSearching(true)
      try {
        const data = await searchProducts(debouncedSearch.trim(), 5)
        if (!cancelled) setSuggestions(data.products)
      } catch {
        if (!cancelled) setSuggestions([])
      } finally {
        if (!cancelled) setSearching(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [debouncedSearch])

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  useEffect(() => {
    if (!dropdownOpen) return
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    const timer = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside)
    }, 0)
    return () => {
      clearTimeout(timer)
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [dropdownOpen])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (search.trim()) {
      navigate(`/product?q=${encodeURIComponent(search.trim())}`)
      setShowSuggestions(false)
    }
  }

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/'
    if (path.startsWith('/category/')) return location.pathname === path
    return location.pathname.startsWith(path)
  }

  return (
    <header className="sticky top-0 z-[60] w-full bg-white/70 backdrop-blur-xl shadow-sm">
      <nav className="flex items-center justify-between px-4 lg:px-10 py-3">
        <Logo />

        <ul className="hidden lg:flex items-center space-x-1 text-sm font-medium">
          {[
            { name: 'Home', path: '/' },
            ...categories.slice(0, 6).map((cat) => ({ name: cat.name, path: `/category/${cat.slug}` })),
          ].map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`relative px-3 py-2 rounded-lg transition-all duration-200 ${
                  isActive(item.path)
                    ? 'text-black bg-gray-100'
                    : 'text-gray-600 hover:text-black hover:bg-gray-50'
                }`}
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2 lg:gap-3">
          <div className="relative hidden sm:block" ref={searchRef}>
            <form onSubmit={handleSearch}>
              <input
                type="search"
                placeholder="Search products..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setShowSuggestions(true) }}
                onFocus={() => setShowSuggestions(true)}
                className="w-40 lg:w-56 xl:w-72 px-4 py-2 pl-10 rounded-full border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-gray-400 text-sm text-black placeholder-gray-400 transition-all"
              />
              <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              {search && (
                <button
                  type="button"
                  onClick={() => { setSearch(''); setSuggestions([]); setShowSuggestions(false) }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear search"
                >
                  <FiX className="w-4 h-4" />
                </button>
              )}
            </form>
            {showSuggestions && debouncedSearch.trim().length >= 2 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border z-50 max-h-80 overflow-y-auto">
                {searching ? (
                  <div className="p-5 text-center text-sm text-gray-500">
                    <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto" />
                  </div>
                ) : suggestions.length > 0 ? (
                  suggestions.map((p) => (
                    <Link
                      key={p.id}
                      to={`/product/${p.id}`}
                      onClick={() => { setShowSuggestions(false); setSearch('') }}
                      className="flex items-center gap-3 p-3 hover:bg-gray-50 border-b last:border-b-0 transition-colors"
                    >
                      <img src={p.thumbnail} alt={p.title} className="w-10 h-10 object-cover rounded-lg" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-800 truncate">{p.title}</p>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-black">
                            ₹{(p.price * (1 - p.discountPercentage / 100)).toFixed(2)}
                          </span>
                          {p.discountPercentage > 0 && (
                            <span className="text-xs text-gray-400 line-through">₹{p.price.toFixed(2)}</span>
                          )}
                        </div>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="p-5 text-center">
                    <p className="text-sm text-gray-500">No products found</p>
                    <p className="text-xs text-gray-400 mt-1">Try a different search term</p>
                  </div>
                )}
                <Link
                  to={`/product?q=${encodeURIComponent(debouncedSearch.trim())}`}
                  onClick={() => { setShowSuggestions(false); setSearch('') }}
                  className="block p-3 text-center text-sm text-black hover:bg-gray-50 font-semibold border-t transition-colors"
                >
                  View all results &rarr;
                </Link>
              </div>
            )}
          </div>

          <Link
            to="/wishlist"
            className="relative p-2.5 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Wishlist"
          >
            <FiHeart className="text-lg text-gray-700" />
            {wishlistCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 inline-flex items-center justify-center w-4.5 h-4.5 text-[10px] font-bold text-white bg-[#E53E3E] rounded-full">
                {wishlistCount > 9 ? '9+' : wishlistCount}
              </span>
            )}
          </Link>

          <Link
            to="/cart"
            className="relative p-2.5 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Cart"
          >
            <FiShoppingCart className="text-lg text-gray-700" />
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 inline-flex items-center justify-center w-4.5 h-4.5 text-[10px] font-bold text-white bg-black rounded-full">
                {cartCount > 9 ? '9+' : cartCount}
              </span>
            )}
          </Link>

          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className={`relative p-2.5 rounded-full transition-all duration-200 ${
                dropdownOpen
                  ? 'bg-purple-100 text-purple-600 shadow-sm'
                  : 'hover:bg-gray-100 text-gray-700'
              }`}
              aria-label="Account"
              aria-expanded={dropdownOpen}
              aria-haspopup="true"
            >
              {user ? (
                <span className="w-5 h-5 flex items-center justify-center text-xs font-bold">
                  {user.username.charAt(0).toUpperCase()}
                </span>
              ) : (
                <FiUser className="w-5 h-5" />
              )}
            </button>
            <AccountDropdown
              isOpen={dropdownOpen}
              onClose={() => setDropdownOpen(false)}
            />
          </div>

          <button
            onClick={() => setMenuOpen(true)}
            className="lg:hidden p-2.5 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Open menu"
          >
            <FiMenu className="w-5 h-5 text-gray-700" />
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[70]" onClick={() => setMenuOpen(false)}>
          <aside
            className="absolute right-0 w-72 h-full bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-5 border-b">
              <Logo />
              <button onClick={() => setMenuOpen(false)} className="p-2 rounded-full hover:bg-gray-100" aria-label="Close menu">
                <FiX className="w-5 h-5 text-gray-700" />
              </button>
            </div>
            <form onSubmit={(e) => { handleSearch(e); setMenuOpen(false) }} className="relative p-4 border-b">
              <input
                type="search"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-4 py-2.5 pl-10 rounded-full border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black/10 text-sm text-black"
              />
              <FiSearch className="absolute left-7 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            </form>
            <ul className="py-3 overflow-y-auto max-h-[calc(100vh-200px)]">
              {[
                { name: 'Home', path: '/' },
                ...categories.map((cat) => ({ name: cat.name, path: `/category/${cat.slug}` })),
              ].map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`block px-5 py-3 text-sm font-medium transition-colors ${
                      isActive(item.path)
                        ? 'text-black bg-gray-50 border-l-2 border-black'
                        : 'text-gray-600 hover:text-black hover:bg-gray-50'
                    }`}
                    onClick={() => setMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      )}
    </header>
  )
}
