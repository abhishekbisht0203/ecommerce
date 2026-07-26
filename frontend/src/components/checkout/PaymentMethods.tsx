import { motion } from 'framer-motion'
import { FiCreditCard, FiSmartphone, FiGlobe } from 'react-icons/fi'
import { SiRazorpay } from 'react-icons/si'
import toast from 'react-hot-toast'

interface PaymentMethod {
  id: string
  name: string
  icon: React.ReactNode
  description: string
  functional: boolean
}

const paymentMethods: PaymentMethod[] = [
  {
    id: 'razorpay',
    name: 'Razorpay',
    icon: <SiRazorpay className="w-6 h-6" />,
    description: 'Credit/Debit Card, UPI, Net Banking, Wallet',
    functional: true,
  },
  {
    id: 'credit',
    name: 'Credit / Debit Card',
    icon: <FiCreditCard className="w-6 h-6" />,
    description: 'Visa, Mastercard, RuPay, Amex',
    functional: false,
  },
  {
    id: 'upi',
    name: 'UPI',
    icon: <FiSmartphone className="w-6 h-6" />,
    description: 'Google Pay, PhonePe, Paytm, BHIM',
    functional: false,
  },
  {
    id: 'netbanking',
    name: 'Net Banking',
    icon: <FiGlobe className="w-6 h-6" />,
    description: 'All major banks supported',
    functional: false,
  },
]

interface PaymentMethodsProps {
  selected: string | null
  onSelect: (id: string) => void
}

export default function PaymentMethods({ selected, onSelect }: PaymentMethodsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {paymentMethods.map((method, i) => {
        const isSelected = selected === method.id
        return (
          <motion.button
            key={method.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            onClick={() => {
              if (!method.functional) {
                toast('Coming soon — Razorpay recommended', { icon: '🚧' })
                return
              }
              onSelect(method.id)
            }}
            className={`relative flex items-start gap-3 p-4 rounded-xl border-2 text-left transition-all ${
              isSelected
                ? 'border-purple-500 bg-purple-50/60 shadow-[0_0_0_1px_#7C3AED20]'
                : 'border-gray-100 bg-white hover:border-purple-200 hover:shadow-sm'
            }`}
          >
            {isSelected && (
              <motion.div
                layoutId="paymentCheck"
                className="absolute top-2 right-2 w-5 h-5 bg-purple-600 rounded-full flex items-center justify-center"
              >
                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </motion.div>
            )}
            <div className={`p-2 rounded-lg ${isSelected ? 'bg-purple-100 text-purple-700' : 'bg-gray-50 text-gray-500'}`}>
              {method.icon}
            </div>
            <div className="flex-1">
              <p className={`text-sm font-semibold ${isSelected ? 'text-purple-900' : 'text-gray-800'}`}>
                {method.name}
              </p>
              <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">{method.description}</p>
            </div>
          </motion.button>
        )
      })}
    </div>
  )
}
