import { motion } from 'framer-motion'
import FloatingParticles from './FloatingParticles'

export default function AnimatedBackground() {
  return (
    <div className="fixed inset-0 bg-surface overflow-hidden">
      <motion.div
        className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full"
        style={{
          background:
            'radial-gradient(circle at center, rgba(239,68,68,0.12) 0%, rgba(239,68,68,0.04) 30%, transparent 70%)',
        }}
        animate={{ x: [0, 80, 0], y: [0, -60, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] rounded-full"
        style={{
          background:
            'radial-gradient(circle at center, rgba(220,38,38,0.1) 0%, rgba(220,38,38,0.03) 40%, transparent 70%)',
        }}
        animate={{ x: [0, -50, 0], y: [0, 40, 0], scale: [1, 1.15, 1] }}
        transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-[-10%] left-[20%] w-[50%] h-[50%] rounded-full"
        style={{
          background:
            'radial-gradient(circle at center, rgba(239,68,68,0.08) 0%, transparent 60%)',
        }}
        animate={{ x: [0, 60, 0], y: [0, -40, 0], scale: [1, 1.2, 1] }}
        transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
      />
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: [
            'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px)',
            'linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
          ].join(', '),
          backgroundSize: '80px 80px',
        }}
      />
      <FloatingParticles />
    </div>
  )
}
