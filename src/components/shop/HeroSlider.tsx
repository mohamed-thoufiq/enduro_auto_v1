// src/components/shop/HeroSlider.tsx
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'

const slides = [
  { image: '/hero/car-1.jpg', title: 'Genuine Spare Parts Supplier', subtitle: 'High-quality components for your vehicles. Trusted Seller in Dubai.' },
  { image: '/hero/car-2.jpg', title: 'For All Of Your Vehicles', subtitle: 'From engine components to body parts, we have it all in stock.' },
]

export function HeroSlider() {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => setCurrent(prev => (prev === slides.length - 1 ? 0 : prev + 1)), 6000)
    return () => clearInterval(timer)
  }, [])

  // Dispatches a global custom event to open the universal floating bubble modal
  const handleContactClick = () => {
    window.dispatchEvent(new CustomEvent('open-global-contact'))
  }

  return (
    <section className="relative h-[100dvh] w-full overflow-hidden bg-black">
      <AnimatePresence mode="wait">
        <motion.div key={current} initial={{ opacity: 0, scale: 1.1 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1.5 }} className="absolute inset-0">
          <div className="absolute inset-0 bg-cover bg-[70%_center] md:bg-center" style={{ backgroundImage: `url(${slides[current].image})` }} />
          <div className="absolute inset-0 bg-black/50 md:bg-gradient-to-r md:from-black/80 md:via-black/40 md:to-transparent" />
        </motion.div>
      </AnimatePresence>

      <div className="relative z-10 flex h-full items-center max-w-[1400px] mx-auto px-6 md:px-8 lg:px-12">
        <div className="max-w-2xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} key={`content-${current}`} transition={{ delay: 0.5, duration: 0.8 }}>
            <span className="inline-block text-red-600 font-bold uppercase tracking-widest text-xs md:text-sm mb-3 md:mb-4">Premium Quality</span>
            <h1 className="text-4xl md:text-7xl font-black text-white leading-[1.1] mb-5 md:mb-6 uppercase italic break-words">
              {slides[current].title.split(' ').map((word, i) =>
                word.toLowerCase() === 'supplier'
                  ? <span key={i} className="text-red-600"> {word}</span>
                  : ` ${word}`
              )}
            </h1>
            <p className="text-gray-300 text-base md:text-xl mb-8 md:mb-10 max-w-lg leading-relaxed">{slides[current].subtitle}</p>
            
            <div className="flex flex-row flex-wrap items-center gap-3 md:gap-4">
              <Link 
                to="/shop" 
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2.5 md:px-8 md:py-4 rounded-full font-bold uppercase tracking-tighter transition-all text-center text-xs md:text-base whitespace-nowrap"
              >
                Browse Collection
              </Link>
              
              <button 
                onClick={handleContactClick}
                className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/20 px-4 py-2.5 md:px-8 md:py-4 rounded-full font-bold uppercase tracking-tighter transition-all text-center text-xs md:text-base cursor-pointer whitespace-nowrap"
              >
                Contact Expert
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 flex gap-3">
        {slides.map((_, i) => (
          <button key={i} onClick={() => setCurrent(i)} className={`h-1.5 transition-all duration-500 rounded-full ${current === i ? 'w-10 bg-red-600' : 'w-5 bg-white/30'}`} />
        ))}
      </div>
    </section>
  )
}