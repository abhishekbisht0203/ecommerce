import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import { motion, AnimatePresence } from 'framer-motion'
import type { DummyProduct } from '../types/product'

interface Props {
  products: DummyProduct[]
}

export default function HeroSlider({ products }: Props) {
  const [current, setCurrent] = useState(0)
  const slides = products.slice(0, 5)

  const next = useCallback(() => setCurrent((p) => (p + 1) % slides.length), [slides.length])
  const prev = useCallback(() => setCurrent((p) => (p - 1 + slides.length) % slides.length), [slides.length])

  useEffect(() => {
    if (slides.length === 0) return
    const timer = setInterval(next, 5000)
    return () => clearInterval(timer)
  }, [next, slides.length])

  if (slides.length === 0) return null

  const slide = slides[current]
  const discount = Math.round(slide.discountPercentage)

  return (
    <div className="relative w-full z-10 mb-8">
      <div className="relative h-56 overflow-hidden rounded-2xl md:h-[65vh] bg-gray-200">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.7, ease: 'easeInOut' }}
            className="absolute inset-0"
          >
            <img
              src={slide.thumbnail}
              alt={slide.title}
              className="w-full h-full object-cover"
              loading={current === 0 ? 'eager' : 'lazy'}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent" />
          </motion.div>
        </AnimatePresence>

        <div className="absolute inset-0 flex items-center">
          <div className="px-6 md:px-12 lg:px-16 max-w-xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={`text-${current}`}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                {discount > 0 && (
                  <span className="inline-block bg-[#E53E3E] text-white text-xs md:text-sm font-bold px-3 py-1 rounded-full mb-3">
                    {discount}% OFF
                  </span>
                )}
                <h2 className="text-white text-2xl md:text-4xl lg:text-5xl font-extrabold leading-tight mb-2">
                  {slide.title}
                </h2>
                <p className="text-white/80 text-sm md:text-base line-clamp-2 mb-4 max-w-lg">
                  {slide.description}
                </p>
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-white text-xl md:text-3xl font-bold">
                    ₹{(slide.price * (1 - slide.discountPercentage / 100)).toFixed(2)}
                  </span>
                  {discount > 0 && (
                    <span className="text-white/60 line-through text-sm md:text-lg">
                      ₹{slide.price.toFixed(2)}
                    </span>
                  )}
                </div>
                <Link
                  to={`/product/${slide.id}`}
                  className="inline-flex items-center gap-2 bg-white text-black font-semibold px-6 py-2.5 md:px-8 md:py-3 rounded-full hover:bg-gray-100 transition-all hover:scale-105"
                >
                  Shop Now
                  <FiChevronRight className="w-4 h-4" />
                </Link>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      <div className="absolute z-30 flex -translate-x-1/2 bottom-4 left-1/2 space-x-2.5">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
              i === current ? 'bg-white w-6' : 'bg-white/50 hover:bg-white/70'
            }`}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>

      <button
        onClick={prev}
        className="absolute top-0 left-0 z-30 flex items-center justify-center h-full px-2 md:px-4 cursor-pointer group focus:outline-none"
        aria-label="Previous slide"
      >
        <span className="inline-flex items-center justify-center w-9 h-9 md:w-11 md:h-11 rounded-full bg-white/20 backdrop-blur-sm group-hover:bg-white/40 transition-all">
          <FiChevronLeft className="w-4 h-4 md:w-5 md:h-5 text-white" />
        </span>
      </button>
      <button
        onClick={next}
        className="absolute top-0 right-0 z-30 flex items-center justify-center h-full px-2 md:px-4 cursor-pointer group focus:outline-none"
        aria-label="Next slide"
      >
        <span className="inline-flex items-center justify-center w-9 h-9 md:w-11 md:h-11 rounded-full bg-white/20 backdrop-blur-sm group-hover:bg-white/40 transition-all">
          <FiChevronRight className="w-4 h-4 md:w-5 md:h-5 text-white" />
        </span>
      </button>
    </div>
  )
}
