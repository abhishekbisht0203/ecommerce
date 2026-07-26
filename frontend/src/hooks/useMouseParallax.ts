import { useState, useEffect, useCallback } from 'react'

interface ParallaxValues {
  x: number
  y: number
}

export function useMouseParallax(sensitivity: number = 20): ParallaxValues {
  const [position, setPosition] = useState<ParallaxValues>({ x: 0, y: 0 })

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      const x = ((e.clientX - window.innerWidth / 2) / window.innerWidth) * sensitivity
      const y = ((e.clientY - window.innerHeight / 2) / window.innerHeight) * sensitivity
      setPosition({ x, y })
    },
    [sensitivity]
  )

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [handleMouseMove])

  return position
}
