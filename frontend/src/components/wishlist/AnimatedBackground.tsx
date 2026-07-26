import { memo } from 'react'

function AnimatedBackgroundInner() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Base color */}
      <div className="absolute inset-0 bg-[#F8FAFC]" />

      {/* Lavender gradient */}
      <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full
                      bg-gradient-to-br from-purple-200/40 via-purple-100/20 to-transparent blur-3xl" />

      {/* Pink radial glow */}
      <div className="absolute top-1/3 -right-40 w-[500px] h-[500px] rounded-full
                      bg-radial-gradient from-pink-200/30 to-transparent blur-3xl"
           style={{ background: 'radial-gradient(circle, rgba(236,72,153,0.15) 0%, transparent 70%)' }} />

      {/* Purple mesh gradient */}
      <div className="absolute -bottom-40 left-1/3 w-[700px] h-[500px] rounded-full
                      bg-gradient-to-r from-purple-200/20 via-pink-100/20 to-purple-200/20 blur-3xl" />

      {/* Additional soft glow */}
      <div className="absolute top-2/3 left-1/4 w-[400px] h-[400px] rounded-full
                      bg-gradient-to-bl from-purple-100/20 to-transparent blur-3xl" />
    </div>
  )
}

const AnimatedBackground = memo(AnimatedBackgroundInner)
export default AnimatedBackground
