import { motion } from 'framer-motion'

interface PasswordStrengthIndicatorProps {
  password: string
}

interface Strength {
  score: number
  label: string
  color: string
  width: string
}

function getStrength(password: string): Strength {
  let score = 0
  if (password.length >= 8) score++
  if (password.length >= 12) score++
  if (/[A-Z]/.test(password)) score++
  if (/[a-z]/.test(password)) score++
  if (/[0-9]/.test(password)) score++
  if (/[^A-Za-z0-9]/.test(password)) score++

  const maxScore = 6
  const percent = Math.min((score / maxScore) * 100, 100)

  if (score <= 1) return { score, label: 'Weak', color: '#EF4444', width: `${Math.max(percent, 8)}%` }
  if (score <= 2) return { score, label: 'Fair', color: '#F59E0B', width: `${percent}%` }
  if (score <= 4) return { score, label: 'Good', color: '#3B82F6', width: `${percent}%` }
  return { score, label: 'Strong', color: '#10B981', width: `${percent}%` }
}

export default function PasswordStrengthIndicator({
  password,
}: PasswordStrengthIndicatorProps) {
  if (!password) return null

  const strength = getStrength(password)

  return (
    <div className="mt-2 space-y-1.5">
      <div className="h-1 w-full overflow-hidden rounded-full bg-white/10">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: strength.width }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="h-full rounded-full transition-shadow duration-300"
          style={{
            backgroundColor: strength.color,
            boxShadow: `0 0 8px ${strength.color}40`,
          }}
        />
      </div>
      <p className="text-xs" style={{ color: strength.color }}>
        {strength.label}
      </p>
    </div>
  )
}
