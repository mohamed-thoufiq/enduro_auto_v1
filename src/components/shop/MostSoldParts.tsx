// src/components/shop/MostSoldParts.tsx
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Disc, Filter, Settings, Zap, ArrowRight } from 'lucide-react'

const topCategories = [
  { label: 'Brakes & Rotors', sku: 'BR', icon: Disc, description: 'High-performance stopping power' },
  { label: 'Premium Filters', sku: 'FL', icon: Filter, description: 'Engine protection & efficiency' },
  { label: 'Engine Parts', sku: 'EP', icon: Settings, description: 'Core components & electronics' },
  { label: 'Suspension', sku: 'SU', icon: Zap, description: 'Handling & ride comfort' },
]

export function MostSoldParts() {
  return (
    <section className="bg-[#0a0a0a] py-16 md:py-20 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[300px] h-[300px] md:w-[500px] md:h-[500px] bg-red-600/5 rounded-full blur-[80px] md:blur-[120px] -z-10" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Responsive Header Row */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 md:mb-12 gap-4">
          <div>
            <span className="text-red-600 font-bold uppercase tracking-[0.2em] text-[10px] md:text-xs mb-2 block">
              Popular Categories
            </span>
            <h2 className="text-2xl md:text-4xl font-black text-white uppercase italic tracking-tighter">
              Parts we sell <span className="text-red-600">most.</span>
            </h2>
          </div>
          <Link 
            to="/shop" 
            className="group inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-xs md:text-sm font-bold uppercase tracking-widest self-start sm:self-auto"
          >
            View All Catalog{" "}
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Responsive Grid: 2-columns on mobile, 4-columns on desktop */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {topCategories.map((item, index) => (
            <motion.div 
              key={item.sku} 
              initial={{ opacity: 0, y: 15 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              viewport={{ once: true, margin: "-50px" }} 
              transition={{ delay: index * 0.08, duration: 0.5 }}
            >
              <Link 
                to={`/shop?sku=${item.sku}`} 
                className="relative group block bg-[#111111] border border-white/5 rounded-xl md:rounded-2xl p-5 md:p-8 hover:bg-[#161616] transition-all duration-300 overflow-hidden h-full"
              >
                {/* Large Background Icon (Hidden on mobile to save processing power and maintain contrast) */}
                <div className="absolute -right-4 -top-4 text-white/[0.01] group-hover:text-red-600/[0.03] transition-colors hidden sm:block">
                  <item.icon size={120} strokeWidth={1} />
                </div>

                <div className="relative z-10 flex flex-col h-full justify-between">
                  <div>
                    {/* Compact Icon Badge */}
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl bg-white/5 flex items-center justify-center mb-4 md:mb-6 group-hover:bg-red-600 group-hover:text-white transition-all duration-500 text-red-600">
                      <item.icon className="w-5 h-5 md:w-6 md:h-6" strokeWidth={1.5} />
                    </div>

                    <h3 className="text-sm md:text-xl font-bold text-white mb-1.5 md:mb-2 uppercase italic tracking-tight line-clamp-1">
                      {item.label}
                    </h3>
                    <p className="text-gray-500 text-xs md:text-sm leading-relaxed mb-4 md:mb-6 line-clamp-2 sm:line-clamp-none">
                      {item.description}
                    </p>
                  </div>

                  {/* Clean Touch Indicator: Fully visible on mobile, animated hover on desktop */}
                  <div className="flex items-center gap-1.5 text-[10px] md:text-xs font-black uppercase tracking-widest text-red-600 lg:opacity-0 lg:group-hover:opacity-100 lg:translate-y-2 lg:group-hover:translate-y-0 transition-all duration-300 mt-auto">
                    Explore Now <ArrowRight size={12} />
                  </div>
                </div>

                {/* Bottom Red Accent Line */}
                <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-red-600 transition-all duration-500 group-hover:w-full" />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}