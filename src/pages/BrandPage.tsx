// src/pages/BrandsPage.tsx
import { useState, useMemo } from 'react'
import { ShopNavbar } from '@/components/shop/ShopNavbar'
import { Footer } from '@/components/shop/Footer'
import { FloatingContactBubble } from '@/components/shop/FloatingBubble'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, ShieldCheck, ExternalLink, Award, Sparkles, AlertCircle } from 'lucide-react'

// Dummy dynamic brands data matching the premium dark theme
const BRANDS_DATA = [
  {
    id: 'brembo',
    name: 'Brembo',
    logo: '/brands/brembo.svg',
    category: 'OEM',
    description: 'World leader in design and manufacture of high-performance braking systems.',
    specialty: 'Brakes & Rotors',
    origin: 'Italy',
    isPremium: true,
  },
  {
    id: 'bosch',
    name: 'Bosch',
    logo: '/brands/bosch.svg',
    category: 'OEM',
    description: 'Elite German precision engineering for electrical, filters, and fuel systems.',
    specialty: 'Engine Parts & Electronics',
    origin: 'Germany',
    isPremium: true,
  },
  {
    id: 'bilstein',
    name: 'Bilstein',
    logo: '/brands/bilstein.svg',
    category: 'Aftermarket',
    description: 'Premier gas-pressure shock absorbers and high-end suspension systems.',
    specialty: 'Suspension & Handling',
    origin: 'Germany',
    isPremium: true,
  },
  {
    id: 'kn-filters',
    name: 'K&N Filters',
    logo: '/brands/kn.svg',
    category: 'Aftermarket',
    description: 'Industry benchmark for reusable performance air filters and intake components.',
    specialty: 'Premium Filters',
    origin: 'USA',
    isPremium: false,
  },
  {
    id: 'denso',
    name: 'Denso',
    logo: '/brands/denso.svg',
    category: 'OEM',
    description: 'Global pioneer in automotive thermal, powertrain, and electronic parts control systems.',
    specialty: 'Spark Plugs & Electronics',
    origin: 'Japan',
    isPremium: true,
  },
  {
    id: 'ngk',
    name: 'NGK Spark Plugs',
    logo: '/brands/ngk.svg',
    category: 'OEM',
    description: 'Unmatched ignition technology, producing world-class spark plugs and oxygen sensors.',
    specialty: 'Ignition Systems',
    origin: 'Japan',
    isPremium: false,
  },
  {
    id: 'motul',
    name: 'Motul',
    logo: '/brands/motul.svg',
    category: 'Aftermarket',
    description: 'Specialty high-performance synthetic lubricants engineered for track and street racing.',
    specialty: 'Engine Oils & Lubricants',
    origin: 'France',
    isPremium: false,
  },
  {
    id: 'mann-filter',
    name: 'Mann Filter',
    logo: '/brands/mann.svg',
    category: 'OEM',
    description: 'Premium filtration engineering offering original equipment fitment reliability.',
    specialty: 'Engine Filters',
    origin: 'Germany',
    isPremium: false,
  }
]

export default function BrandsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState<'All' | 'OEM' | 'Aftermarket'>('All')

  // Performance-optimized filtering & searching
  const filteredBrands = useMemo(() => {
    return BRANDS_DATA.filter(brand => {
      const matchesSearch = brand.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            brand.specialty.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = activeCategory === 'All' || brand.category === activeCategory
      return matchesSearch && matchesCategory
    })
  }, [searchQuery, activeCategory])

  // Framer motion wrapper layout configurations
  const staggerContainer = {
    animate: { transition: { staggerChildren: 0.08 } }
  }

  const fadeInUp = {
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  }

  return (
    <div className="bg-[#0a0a0a] min-h-screen text-gray-100 flex flex-col font-sans overflow-x-hidden">
      <ShopNavbar />

      {/* Hero Intro Header Section */}
      <section className="relative pt-44 pb-24 overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 bg-gradient-to-br from-red-600/10 via-transparent to-transparent" />
        <div className="absolute top-10 right-20 w-[600px] h-[600px] bg-red-600/5 rounded-full blur-[180px]" />
        
        <div className="relative max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 text-center md:text-left">
          <motion.span 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block text-red-500 font-black uppercase tracking-[0.3em] text-xs mb-4"
          >
            Authorized Partners
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="text-4xl md:text-7xl font-black text-white uppercase italic tracking-tighter leading-[0.95] mb-6"
          >
            Our Elite <span className="text-red-600">Brands</span> & Partners
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-gray-400 text-base md:text-lg max-w-2xl leading-relaxed font-medium mx-auto md:mx-0"
          >
            We partner strictly with top-tier Original Equipment Manufacturers (OEM) and leading global aftermarket brands to bring you engineering precision and zero-defect components.
          </motion.p>
        </div>
      </section>

      {/* Interactive Brand Filter & Search Bar Area */}
      <section className="bg-[#0e0e0e] border-b border-white/5 py-6 sticky top-16 z-30 shadow-md">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row gap-4 items-center justify-between">
          
          {/* Quick Category Filters */}
          <div className="flex gap-2 w-full md:w-auto overflow-x-auto no-scrollbar py-1">
            {(['All', 'OEM', 'Aftermarket'] as const).map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer flex-shrink-0 ${
                  activeCategory === cat 
                    ? 'bg-red-600 text-white shadow-lg shadow-red-600/15'
                    : 'bg-white/5 hover:bg-white/10 border border-white/5 text-gray-400 hover:text-white'
                }`}
              >
                {cat === 'All' ? 'All Brands' : `${cat} Partners`}
              </button>
            ))}
          </div>

          {/* Elastic Search Bar */}
          <div className="relative w-full md:max-w-md">
            <Search className="absolute left-4 top-3.5 text-gray-500" size={16} />
            <input 
              type="text"
              placeholder="Search e.g. Brembo, Bosch..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#151515] border border-white/5 rounded-full pl-11 pr-5 py-3 text-sm font-bold placeholder:text-gray-600 focus:border-red-600 outline-none transition-all text-white"
            />
          </div>
        </div>
      </section>

      {/* Brands Grid Section */}
      <section className="py-20 flex-1 relative">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          
          <AnimatePresence mode="popLayout">
            {filteredBrands.length > 0 ? (
              <motion.div 
                layout
                initial="initial"
                whileInView="animate"
                viewport={{ once: true, margin: "-50px" }}
                variants={staggerContainer}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8"
              >
                {filteredBrands.map((brand) => (
                  <motion.div
                    layout
                    key={brand.id}
                    variants={fadeInUp}
                    whileHover={{ y: -6 }}
                    className="relative group bg-[#111111] border border-white/5 p-6 rounded-3xl hover:border-red-600/30 transition-all duration-300 flex flex-col justify-between"
                  >
                    {/* Top Accent Badges */}
                    <div className="flex items-center justify-between mb-8">
                      <span className="bg-white/5 border border-white/5 text-gray-400 text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
                        {brand.category}
                      </span>
                      {brand.isPremium && (
                        <span className="flex items-center gap-1 text-[9px] font-black uppercase tracking-widest text-red-500">
                          <Award size={12} /> Certified
                        </span>
                      )}
                    </div>

                    {/* Dynamic Brand Logo & Info (Fallbacks safely back to stylised text if physical logos are loading) */}
                    <div className="mb-6">
                      <div className="h-16 flex items-center justify-start mb-6">
                        {brand.logo ? (
                          <div className="text-3xl font-black italic tracking-tighter text-white uppercase group-hover:text-red-600 transition-colors">
                            {brand.name}
                          </div>
                        ) : (
                          <div className="text-2xl font-black italic text-gray-500 uppercase">{brand.name}</div>
                        )}
                      </div>
                      
                      <p className="text-gray-400 text-xs md:text-sm leading-relaxed mb-4 min-h-[48px]">
                        {brand.description}
                      </p>
                    </div>

                    {/* Card Footer Specifications */}
                    <div className="border-t border-white/5 pt-4 mt-auto flex items-center justify-between">
                      <div>
                        <p className="text-[8px] font-black uppercase tracking-widest text-gray-500 mb-0.5">Specialization</p>
                        <p className="text-xs font-bold text-gray-300">{brand.specialty}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[8px] font-black uppercase tracking-widest text-gray-500 mb-0.5">Origin</p>
                        <p className="text-xs font-bold text-gray-300">{brand.origin}</p>
                      </div>
                    </div>

                    {/* Subtle Red Highlight Border Slide Effect */}
                    <div className="absolute bottom-0 left-6 right-6 h-[2px] w-0 bg-red-600 transition-all duration-500 group-hover:w-[calc(100%-3rem)]" />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              // Empty search state
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-24 bg-[#111111] border border-white/5 rounded-3xl"
              >
                <AlertCircle className="text-red-500 mx-auto mb-4" size={32} />
                <p className="text-gray-400 font-bold text-sm uppercase tracking-widest">
                  No registered partners matched your search query.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Brand Partnership Verification Certificate Banner */}
      <section className="bg-[#0a0a0a] pb-24">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#111111] border border-white/5 rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center gap-8 justify-between">
            <div className="flex items-start gap-5">
              <div className="p-4 bg-red-600/10 border border-red-500/20 text-red-500 rounded-2xl flex-shrink-0">
                <ShieldCheck size={28} />
              </div>
              <div>
                <h3 className="text-xl md:text-2xl font-black uppercase italic tracking-tight text-white mb-2">Are you an OEM Brand Partner?</h3>
                <p className="text-gray-400 text-xs md:text-sm max-w-xl leading-relaxed">
                  We constantly expand our component matrix to add new certified fitments. Contact our commercial pipeline to feature your catalogs on our distribution network.
                </p>
              </div>
            </div>
            
            <button 
              onClick={() => window.dispatchEvent(new CustomEvent('open-global-contact'))}
              className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-full font-black uppercase text-xs tracking-widest transition-all text-center flex items-center gap-2 select-none active:scale-95 shadow-lg shadow-red-600/10 cursor-pointer"
            >
              Partner With Us <ExternalLink size={14} />
            </button>
          </div>
        </div>
      </section>

      <Footer />
      <FloatingContactBubble />
    </div>
  )
}