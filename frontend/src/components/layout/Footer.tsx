import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FiMail, FiPhone, FiMapPin, FiArrowRight } from 'react-icons/fi'
import { FaFacebookF, FaInstagram, FaTwitter, FaLinkedinIn, FaYoutube } from 'react-icons/fa'
import { fetchCategories } from '../../services/dummyjson'
import Logo from '../Logo'
import type { Category } from '../../types/product'
import toast from 'react-hot-toast'

export default function Footer() {
  const [categories, setCategories] = useState<Category[]>([])
  const [email, setEmail] = useState('')

  useEffect(() => {
    fetchCategories().then((cats) => setCategories(cats.slice(0, 8)))
  }, [])

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      toast.success('Subscribed to newsletter!')
      setEmail('')
    }
  }

  return (
    <footer className="bg-[#0F0F0F] text-white mt-20">
      <div className="max-w-screen-xl mx-auto px-4 md:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">
          <div className="lg:col-span-1">
            <Logo className="mb-4 [&_span]:text-white" />
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Premium eCommerce platform offering curated products from top brands. Shop smart with ShopIQ.
            </p>
            <div className="flex gap-3">
              {[FaFacebookF, FaInstagram, FaTwitter, FaLinkedinIn, FaYoutube].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-gray-400 hover:bg-[#E53E3E] hover:text-white transition-all duration-300"
                  aria-label={`Social link ${i + 1}`}
                >
                  <Icon className="text-sm" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider mb-4 text-gray-300">Quick Links</h4>
            <ul className="space-y-2.5">
              {[
                { name: 'Home', path: '/' },
                { name: 'Shop All', path: '/product' },
                { name: 'New Arrivals', path: '/product?sort=newest' },
                { name: 'Best Sellers', path: '/product?sort=rating' },
                { name: 'Deals', path: '/product?sort=discount' },
              ].map((item) => (
                <li key={item.name}>
                  <Link to={item.path} className="text-sm text-gray-400 hover:text-white transition-colors">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider mb-4 text-gray-300">Categories</h4>
            <ul className="space-y-2.5">
              {categories.map((cat) => (
                <li key={cat.slug}>
                  <Link
                    to={`/category/${cat.slug}`}
                    className="text-sm text-gray-400 hover:text-white transition-colors capitalize"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider mb-4 text-gray-300">Support</h4>
            <ul className="space-y-2.5">
              {['FAQ', 'Shipping Info', 'Returns & Exchanges', 'Contact Us', 'Size Guide'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider mb-4 text-gray-300">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm text-gray-400">
                <FiMail className="w-4 h-4 mt-0.5 shrink-0" />
                <a href="mailto:abhishekbisht0203@gmail.com" className="hover:text-white transition-colors">abhishekbisht0203@gmail.com</a>
              </li>
              <li className="flex items-start gap-3 text-sm text-gray-400">
                <FiPhone className="w-4 h-4 mt-0.5 shrink-0" />
                <a href="tel:+917456849590" className="hover:text-white transition-colors">+91 7456849590</a>
              </li>
              <li className="flex items-start gap-3 text-sm text-gray-400">
                <FiMapPin className="w-4 h-4 mt-0.5 shrink-0" />
                <span>Dist. Nainital, Uttarakhand, India 263001</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h4 className="text-base font-bold mb-2">Subscribe to our newsletter</h4>
              <p className="text-sm text-gray-400">Get the latest updates on new products and upcoming sales</p>
            </div>
            <form onSubmit={handleNewsletter} className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="flex-1 px-4 py-2.5 rounded-lg bg-white/10 border border-white/20 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#E53E3E] transition-colors"
              />
              <button
                type="submit"
                className="px-5 py-2.5 bg-[#E53E3E] text-white rounded-lg hover:bg-[#D03030] transition-colors flex items-center gap-1"
              >
                <FiArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} ShopIQ. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
