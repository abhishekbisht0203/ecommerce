import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useMouseParallax } from '../../hooks/useMouseParallax'
import type { ProductItem } from '../../types/auth'

const defaultProducts: ProductItem[] = [
  {
    id: 1,
    title: 'Wireless Earbuds',
    image:
      'https://cdn.dummyjson.com/products/images/mobile-accessories/Wireless%20Earbuds/thumbnail.png',
    price: 199,
  },
  {
    id: 2,
    title: 'iPhone 6',
    image:
      'https://cdn.dummyjson.com/products/images/smartphones/iPhone%206/thumbnail.png',
    price: 999,
  },
  {
    id: 3,
    title: 'Classic Watch',
    image:
      'https://cdn.dummyjson.com/products/images/womens-watches/Annabelle%20Classic%20Watch/thumbnail.png',
    price: 499,
  },
  {
    id: 4,
    title: 'Chanel No. 5',
    image:
      'https://cdn.dummyjson.com/products/images/fragrances/Chanel%20Coco%20No.%205/thumbnail.png',
    price: 129,
  },
]

const positions = [
  { x: '5%', y: '15%', rotate: -6 },
  { x: '55%', y: '5%', rotate: 8 },
  { x: '15%', y: '55%', rotate: -4 },
  { x: '50%', y: '65%', rotate: 7 },
]

export default function FloatingProducts() {
  const parallax = useMouseParallax(12)
  const [products, setProducts] = useState<ProductItem[]>(defaultProducts)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(
          'https://dummyjson.com/products?limit=4&select=title,price,thumbnail'
        )
        const data = await res.json()
        if (data.products?.length >= 4) {
          setProducts(
            data.products.map((p: any) => ({
              id: p.id,
              title: p.title,
              image: p.thumbnail,
              price: p.price,
            }))
          )
        }
      } catch {
        /* use defaults */
      }
    }
    fetchProducts()
  }, [])

  return (
    <div className="relative w-full h-[280px] md:h-[360px]">
      {products.slice(0, 4).map((product, index) => (
        <motion.div
          key={product.id}
          className="absolute"
          style={{
            left: positions[index].x as any,
            top: positions[index].y as any,
          }}
          animate={{
            x: parallax.x * (index + 1) * 0.6,
            y: parallax.y * (index + 1) * 0.6,
          }}
          transition={{
            type: 'spring',
            stiffness: 25,
            damping: 12,
            mass: 0.5,
          }}
        >
          <motion.div
            className="animate-float"
            style={{
              animationDelay: `${index * 0.8}s`,
              animationDuration: `${5 + index * 0.8}s`,
            }}
          >
            <motion.div
              animate={{
                rotate: [
                  positions[index].rotate,
                  positions[index].rotate + 5,
                  positions[index].rotate,
                ],
              }}
              transition={{
                duration: 6 + index,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              whileHover={{ scale: 1.15, transition: { duration: 0.3 } }}
            >
              <div className="relative">
                <div className="absolute -inset-4 rounded-full bg-gradient-to-r from-[#EF4444]/20 to-[#DC2626]/20 blur-2xl" />
                <div
                  className={`relative rounded-2xl overflow-hidden bg-white/5 backdrop-blur-sm border border-white/10 p-2 shadow-xl ${
                    index === 0
                      ? 'w-20 h-20 md:w-28 md:h-28'
                      : index === 1
                        ? 'w-24 h-24 md:w-32 md:h-32'
                        : index === 2
                          ? 'w-16 h-16 md:w-24 md:h-24'
                          : 'w-20 h-20 md:w-28 md:h-28'
                  }`}
                >
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-full object-contain"
                    loading="lazy"
                  />
                </div>
                <p className="text-[10px] text-gray-500 mt-2 text-center truncate max-w-[80px] md:max-w-[112px]">
                  ${product.price}
                </p>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      ))}
    </div>
  )
}
