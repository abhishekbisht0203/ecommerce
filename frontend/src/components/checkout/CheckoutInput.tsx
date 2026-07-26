import { useState, type InputHTMLAttributes, type SelectHTMLAttributes } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface BaseProps {
  label: string
  icon?: React.ReactNode
  error?: string
}

type InputFieldProps = BaseProps & InputHTMLAttributes<HTMLInputElement>
type SelectFieldProps = BaseProps & SelectHTMLAttributes<HTMLSelectElement> & { children: React.ReactNode }

export function CheckoutInput({ label, icon, error, className = '', ...props }: InputFieldProps) {
  const [focused, setFocused] = useState(false)
  const hasValue = typeof props.value === 'string' ? props.value.length > 0 : !!props.value

  return (
    <div className="relative">
      <div
        className={`relative flex items-center rounded-xl border-2 transition-all ${
          error
            ? 'border-red-300 bg-red-50/30'
            : focused
              ? 'border-purple-400 bg-white shadow-[0_0_0_3px_#7C3AED15]'
              : 'border-gray-200 bg-gray-50/50 hover:border-gray-300'
        }`}
      >
        {icon && (
          <span className={`pl-3.5 ${focused ? 'text-purple-500' : 'text-gray-400'} transition-colors`}>
            {icon}
          </span>
        )}
        <div className="relative flex-1">
          <input
            {...props}
            onFocus={(e) => { setFocused(true); props.onFocus?.(e) }}
            onBlur={(e) => { setFocused(false); props.onBlur?.(e) }}
            className={`w-full bg-transparent pt-4 pb-2 ${icon ? 'pl-2' : 'pl-3.5'} pr-3.5 text-sm text-gray-900 outline-none border-none focus:ring-0 ${className}`}
          />
          <label
            className={`absolute left-0 ${icon ? 'left-2' : 'left-3.5'} transition-all pointer-events-none ${
              focused || hasValue
                ? 'text-[10px] -translate-y-2.5 text-purple-600 font-medium'
                : 'text-sm translate-y-0 text-gray-400 top-1/2 -translate-y-1/2'
            }`}
            style={{ top: focused || hasValue ? '8px' : '50%' }}
          >
            {label}
          </label>
        </div>
      </div>
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -4, height: 0 }}
            className="text-[11px] text-red-500 mt-1 ml-1"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}

export function CheckoutSelect({ label, icon, error, children, className = '', ...props }: SelectFieldProps) {
  const [focused, setFocused] = useState(false)

  return (
    <div className="relative">
      <div
        className={`relative flex items-center rounded-xl border-2 transition-all ${
          error
            ? 'border-red-300 bg-red-50/30'
            : focused
              ? 'border-purple-400 bg-white shadow-[0_0_0_3px_#7C3AED15]'
              : 'border-gray-200 bg-gray-50/50 hover:border-gray-300'
        }`}
      >
        {icon && (
          <span className={`pl-3.5 ${focused ? 'text-purple-500' : 'text-gray-400'} transition-colors`}>
            {icon}
          </span>
        )}
        <div className="relative flex-1">
          <select
            {...props}
            onFocus={(e) => { setFocused(true); props.onFocus?.(e as any) }}
            onBlur={(e) => { setFocused(false); props.onBlur?.(e as any) }}
            className={`w-full bg-transparent pt-4 pb-2 ${icon ? 'pl-2' : 'pl-3.5'} pr-3.5 text-sm text-gray-900 outline-none border-none focus:ring-0 appearance-none ${className}`}
          >
            {children}
          </select>
          <label
            className={`absolute left-0 ${icon ? 'left-2' : 'left-3.5'} transition-all pointer-events-none text-[10px] -translate-y-2.5 text-purple-600 font-medium`}
            style={{ top: '8px' }}
          >
            {label}
          </label>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -4, height: 0 }}
            className="text-[11px] text-red-500 mt-1 ml-1"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}
