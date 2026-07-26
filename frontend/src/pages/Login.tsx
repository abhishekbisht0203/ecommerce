import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiUser, FiLock } from 'react-icons/fi'
import { FcGoogle } from 'react-icons/fc'
import { FaApple } from 'react-icons/fa'
import { FiGithub } from 'react-icons/fi'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import AnimatedBackground from '../components/auth/AnimatedBackground'
import LeftPanel from '../components/auth/LeftPanel'
import AuthCard from '../components/auth/AuthCard'
import PremiumInput from '../components/auth/PremiumInput'
import PremiumButton from '../components/auth/PremiumButton'
import { fadeInUp, staggerContainer } from '../lib/animations'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<{ username?: string; password?: string }>({})

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const newErrors: typeof errors = {}
    if (!username.trim()) newErrors.username = 'Enter your username or email'
    if (!password) newErrors.password = 'Enter your password'
    setErrors(newErrors)

    if (Object.keys(newErrors).length > 0) return

    setLoading(true)
    try {
      await login(username, password, remember)
      toast.success('Welcome back!')
      navigate('/')
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Invalid credentials')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-surface">
      <AnimatedBackground />

      <div className="relative z-10 flex flex-col lg:flex-row min-h-screen">
        <LeftPanel mode="login" />

        <div className="lg:w-[55%] flex items-center justify-center p-4 sm:p-6 md:p-8 lg:p-12">
          <AuthCard>
            <motion.div
              variants={staggerContainer}
              initial="initial"
              animate="animate"
              className="space-y-6"
            >
              <motion.div variants={fadeInUp} className="text-center">
                <h2 className="text-2xl md:text-3xl font-bold text-white">Sign In</h2>
                <p className="text-gray-400 mt-2 text-sm">Welcome back to ShopIQ</p>
              </motion.div>

              <motion.div
                variants={fadeInUp}
                className="flex gap-3"
              >
                {[
                  { icon: FcGoogle, label: 'Google', key: 'google' },
                  { icon: FaApple, label: 'Apple', key: 'apple' },
                  { icon: FiGithub, label: 'GitHub', key: 'github' },
                ].map(({ icon: Icon, label, key }) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => toast(`${label} login coming soon`)}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 text-gray-400 hover:text-white"
                    aria-label={`Sign in with ${label}`}
                  >
                    <Icon size={18} />
                    <span className="text-xs font-medium hidden sm:inline">{label}</span>
                  </button>
                ))}
              </motion.div>

              <motion.div variants={fadeInUp} className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-surface px-4 text-gray-500">OR CONTINUE WITH EMAIL</span>
                </div>
              </motion.div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <motion.div variants={fadeInUp}>
                  <PremiumInput
                    id="login-username"
                    label="Username / Email"
                    value={username}
                    onChange={setUsername}
                    icon={<FiUser size={18} />}
                    error={errors.username}
                    autoComplete="username"
                  />
                </motion.div>

                <motion.div variants={fadeInUp}>
                  <PremiumInput
                    id="login-password"
                    label="Password"
                    type="password"
                    value={password}
                    onChange={setPassword}
                    icon={<FiLock size={18} />}
                    showPasswordToggle
                    error={errors.password}
                    autoComplete="current-password"
                  />
                </motion.div>

                <motion.div
                  variants={fadeInUp}
                  className="flex items-center justify-between"
                >
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={remember}
                        onChange={(e) => setRemember(e.target.checked)}
                        className="sr-only"
                      />
                      <div
                        className={`w-4 h-4 rounded border transition-all duration-300 flex items-center justify-center ${
                          remember
                            ? 'bg-[#EF4444] border-[#EF4444]'
                            : 'border-white/20 group-hover:border-white/40'
                        }`}
                      >
                        {remember && (
                          <svg
                            viewBox="0 0 12 12"
                            className="w-3 h-3 text-white"
                          >
                            <path
                              d="M2.5 6l2.5 2.5 4.5-5"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        )}
                      </div>
                    </div>
                    <span className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
                      Remember me
                    </span>
                  </label>
                  <Link
                    to="/password-reset"
                    className="text-sm text-[#EF4444] hover:text-[#DC2626] transition-colors"
                  >
                    Forgot password?
                  </Link>
                </motion.div>

                <motion.div variants={fadeInUp}>
                  <PremiumButton loading={loading} type="submit">
                    Sign In
                  </PremiumButton>
                </motion.div>
              </form>

              <motion.p
                variants={fadeInUp}
                className="text-center text-sm text-gray-500"
              >
                Don&apos;t have an account?{' '}
                <Link
                  to="/register"
                  className="text-[#EF4444] hover:text-[#DC2626] font-medium transition-colors"
                >
                  Create account
                </Link>
              </motion.p>
            </motion.div>
          </AuthCard>
        </div>
      </div>
    </div>
  )
}
