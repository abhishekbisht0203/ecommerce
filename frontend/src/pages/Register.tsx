import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiUser, FiMail, FiLock } from 'react-icons/fi'
import { GoogleLogin } from '@react-oauth/google'
import toast from 'react-hot-toast'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'
import AnimatedBackground from '../components/auth/AnimatedBackground'
import LeftPanel from '../components/auth/LeftPanel'
import AuthCard from '../components/auth/AuthCard'
import PremiumInput from '../components/auth/PremiumInput'
import PremiumButton from '../components/auth/PremiumButton'
import PasswordStrengthIndicator from '../components/auth/PasswordStrengthIndicator'
import { fadeInUp, staggerContainer } from '../lib/animations'

export default function Register() {
  const navigate = useNavigate()
  const { checkAuth, googleLogin } = useAuth()
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    rpassword: '',
  })
  const [agree, setAgree] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const newErrors: Record<string, string> = {}
    if (!form.username.trim()) newErrors.username = 'Full name is required'
    if (!form.email.trim()) newErrors.email = 'Email is required'
    if (!form.password) newErrors.password = 'Password is required'
    if (form.password !== form.rpassword)
      newErrors.rpassword = 'Passwords do not match'
    if (!agree) newErrors.agree = 'You must agree to the terms'
    setErrors(newErrors)

    if (Object.keys(newErrors).length > 0) return

    setLoading(true)
    try {
      const res = await api.post('/register/', {
        username: form.username,
        email: form.email,
        password: form.password,
      })
      if (res.data.success) {
        if (res.data.token) {
          localStorage.setItem('auth_token', res.data.token)
        }
        toast.success(res.data.message || 'Account created successfully!')
        await checkAuth()
        navigate(res.data.redirect || '/')
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || err.response?.data?.error || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      await googleLogin(credentialResponse.credential)
      toast.success('Account created successfully!')
      navigate('/')
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Google signup failed')
    }
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-surface">
      <AnimatedBackground />

      <div className="relative z-10 flex flex-col lg:flex-row min-h-screen">
        <LeftPanel mode="register" />

        <div className="lg:w-[55%] flex items-center justify-center p-4 sm:p-6 md:p-8 lg:p-12 py-12 lg:py-0">
          <AuthCard>
            <motion.div
              variants={staggerContainer}
              initial="initial"
              animate="animate"
              className="space-y-5"
            >
              <motion.div variants={fadeInUp} className="text-center">
                <h2 className="text-2xl md:text-3xl font-bold text-white">
                  Create Account
                </h2>
                <p className="text-gray-400 mt-2 text-sm">
                  Join millions of premium shoppers
                </p>
              </motion.div>

              <motion.div variants={fadeInUp}>
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={() => toast.error('Google signup failed')}
                  theme="outline"
                  size="large"
                  text="signup_with"
                  shape="rectangular"
                  width={undefined}
                />
              </motion.div>

              <motion.div variants={fadeInUp} className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-surface px-4 text-gray-500">
                    OR SIGN UP WITH EMAIL
                  </span>
                </div>
              </motion.div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <motion.div variants={fadeInUp}>
                  <PremiumInput
                    id="reg-name"
                    label="Full Name"
                    value={form.username}
                    onChange={(v) => setForm({ ...form, username: v })}
                    icon={<FiUser size={18} />}
                    error={errors.username}
                    autoComplete="name"
                  />
                </motion.div>

                <motion.div variants={fadeInUp}>
                  <PremiumInput
                    id="reg-email"
                    label="Email Address"
                    type="email"
                    value={form.email}
                    onChange={(v) => setForm({ ...form, email: v })}
                    icon={<FiMail size={18} />}
                    error={errors.email}
                    autoComplete="email"
                  />
                </motion.div>

                <motion.div variants={fadeInUp}>
                  <PremiumInput
                    id="reg-password"
                    label="Password"
                    type="password"
                    value={form.password}
                    onChange={(v) => setForm({ ...form, password: v })}
                    icon={<FiLock size={18} />}
                    showPasswordToggle
                    error={errors.password}
                    autoComplete="new-password"
                  />
                  <PasswordStrengthIndicator password={form.password} />
                </motion.div>

                <motion.div variants={fadeInUp}>
                  <PremiumInput
                    id="reg-confirm"
                    label="Confirm Password"
                    type="password"
                    value={form.rpassword}
                    onChange={(v) => setForm({ ...form, rpassword: v })}
                    icon={<FiLock size={18} />}
                    showPasswordToggle
                    error={errors.rpassword}
                    autoComplete="new-password"
                  />
                </motion.div>

                <motion.div variants={fadeInUp}>
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <div className="relative mt-0.5">
                      <input
                        type="checkbox"
                        checked={agree}
                        onChange={(e) => setAgree(e.target.checked)}
                        className="sr-only"
                      />
                      <div
                        className={`w-4 h-4 rounded border transition-all duration-300 flex items-center justify-center ${
                          agree
                            ? 'bg-[#EF4444] border-[#EF4444]'
                            : 'border-white/20 group-hover:border-white/40'
                        }`}
                      >
                        {agree && (
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
                    <span className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors leading-5">
                      I agree to the{' '}
                      <button
                        type="button"
                        onClick={() =>
                          toast('Terms & Conditions page coming soon')
                        }
                        className="text-[#EF4444] hover:text-[#DC2626]"
                      >
                        Terms & Conditions
                      </button>{' '}
                      and{' '}
                      <button
                        type="button"
                        onClick={() =>
                          toast('Privacy Policy page coming soon')
                        }
                        className="text-[#EF4444] hover:text-[#DC2626]"
                      >
                        Privacy Policy
                      </button>
                    </span>
                  </label>
                  {errors.agree && (
                    <motion.p
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-xs text-red-400 mt-1"
                    >
                      {errors.agree}
                    </motion.p>
                  )}
                </motion.div>

                <motion.div variants={fadeInUp}>
                  <PremiumButton loading={loading} type="submit">
                    Create Account
                  </PremiumButton>
                </motion.div>
              </form>

              <motion.p
                variants={fadeInUp}
                className="text-center text-sm text-gray-500"
              >
                Already have an account?{' '}
                <Link
                  to="/login"
                  className="text-[#EF4444] hover:text-[#DC2626] font-medium transition-colors"
                >
                  Sign in
                </Link>
              </motion.p>
            </motion.div>
          </AuthCard>
        </div>
      </div>
    </div>
  )
}
