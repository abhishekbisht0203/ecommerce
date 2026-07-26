import { useRef, useState, useEffect } from 'react'
import { FiStar } from 'react-icons/fi'
import { useAnimatedCounter } from '../../hooks/useAnimatedCounter'

const avatars = ['JD', 'AK', 'SM', 'RL', 'CT']

export default function SocialProof() {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          observer.disconnect()
        }
      },
      { threshold: 0.3 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  const customers = useAnimatedCounter(50000, 2500, inView)
  const orders = useAnimatedCounter(1000000, 3000, inView)
  const rating = useAnimatedCounter(49, 1500, inView)

  return (
    <div ref={ref} className="space-y-3">
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <FiStar key={i} className="text-yellow-400" size={13} fill="currentColor" />
        ))}
        <span className="text-white font-bold ml-1.5 text-sm">
          {inView ? (rating / 10).toFixed(1) : '0.0'}
        </span>
        <span className="text-gray-500 text-xs">/5.0</span>
      </div>

      <div className="flex items-center gap-3 text-xs">
        <div>
          <span className="text-white font-semibold">{customers.toLocaleString()}</span>
          <span className="text-gray-500 ml-1">Happy Customers</span>
        </div>
        <div className="w-px h-3 bg-white/10" />
        <div>
          <span className="text-white font-semibold">{orders.toLocaleString()}</span>
          <span className="text-gray-500 ml-1">Orders</span>
        </div>
      </div>

      <div className="flex items-center -space-x-1.5">
        {avatars.map((initials, i) => (
          <div
            key={i}
            className="w-6 h-6 rounded-full border-2 border-surface bg-gradient-to-br from-gray-600 to-gray-800 flex items-center justify-center text-[7px] font-medium text-gray-300"
          >
            {initials}
          </div>
        ))}
        <span className="text-[9px] text-gray-500 ml-2">Trusted worldwide</span>
      </div>
    </div>
  )
}
