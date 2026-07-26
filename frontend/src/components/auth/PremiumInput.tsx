import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiEye, FiEyeOff } from 'react-icons/fi'

interface PremiumInputProps {
  id: string
  label: string
  type?: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  error?: string
  success?: boolean
  icon?: React.ReactNode
  showPasswordToggle?: boolean
  disabled?: boolean
  autoComplete?: string
}

export default function PremiumInput({
  id,
  label,
  type = 'text',
  value,
  onChange,
  placeholder = '',
  error,
  success = false,
  icon,
  showPasswordToggle = false,
  disabled = false,
  autoComplete,
}: PremiumInputProps) {
  const [isFocused, setIsFocused] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const isActive = isFocused || value.length > 0
  const inputType = showPasswordToggle && showPassword ? 'text' : type

  return (
    <div className="relative">
      <div
        className={`relative flex items-center rounded-xl border transition-all duration-300 ${
          error
            ? 'border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.15)]'
            : success
              ? 'border-green-500/50'
              : isFocused
                ? 'border-[#EF4444]/50 shadow-[0_0_20px_rgba(239,68,68,0.1)]'
                : 'border-white/10 hover:border-white/20'
        } bg-white/5 backdrop-blur-sm`}
      >
        {icon && (
          <span
            className={`pl-4 transition-colors duration-300 ${
              isFocused ? 'text-[#EF4444]' : 'text-gray-500'
            }`}
          >
            {icon}
          </span>
        )}
        <div className="relative flex-1">
          <input
            id={id}
            type={inputType}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={isFocused ? placeholder : ''}
            disabled={disabled}
            autoComplete={autoComplete}
            className="w-full bg-transparent px-4 pt-5 pb-2 text-white outline-none placeholder:text-gray-600 disabled:opacity-50"
            aria-label={label}
            aria-invalid={!!error}
            aria-describedby={error ? `${id}-error` : undefined}
          />
          <label
            htmlFor={id}
            className={`absolute left-4 cursor-text transition-all duration-300 ${
              isActive
                ? 'top-1.5 text-[10px] font-medium text-[#EF4444]'
                : 'top-1/2 -translate-y-1/2 text-sm text-gray-500'
            }`}
          >
            {label}
          </label>
        </div>
        {showPasswordToggle && type === 'password' && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="pr-4 text-gray-500 hover:text-white transition-colors"
            tabIndex={-1}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
          </button>
        )}
      </div>
      <AnimatePresence>
        {error && (
          <motion.p
            id={`${id}-error`}
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="mt-1.5 text-xs text-red-400"
            role="alert"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}
