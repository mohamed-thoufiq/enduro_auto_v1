import { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ShoppingCart, User, Menu, X, Info } from 'lucide-react'
import { useCart } from '@/context/CartContext'
import { motion, AnimatePresence } from 'framer-motion'

export function ShopNavbar() {
  const { itemCount } = useCart()
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  
  // 1. State to manage the "coming soon" toast visibility
  const [showLoginToast, setShowLoginToast] = useState(false)
  
  const location = useLocation()
  const pathname = location.pathname
  const isHomePage = pathname === '/'

  const [pillStyles, setPillStyles] = useState({ left: 0, width: 0, opacity: 0 })
  const containerRef = useRef<HTMLDivElement>(null)

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'About Us', href: '/about' },
    { name: 'Products', href: '/shop' },
    { name: 'Brands', href: '/brands' },
  ]

  // Automatically hide toast after 3 seconds
  useEffect(() => {
    if (showLoginToast) {
      const timer = setTimeout(() => setShowLoginToast(false), 3000)
      return () => clearTimeout(timer)
    }
  }, [showLoginToast])

  useEffect(() => {
    if (!containerRef.current) return
    const activeLink = containerRef.current.querySelector(`[data-path="${pathname}"]`) as HTMLElement
    if (activeLink) {
      setPillStyles({ left: activeLink.offsetLeft, width: activeLink.offsetWidth, opacity: 1 })
    } else {
      setPillStyles(prev => ({ ...prev, opacity: 0 }))
    }
  }, [pathname])

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50)
    if (isHomePage) {
      handleScroll()
      window.addEventListener('scroll', handleScroll)
    } else {
      setIsScrolled(true)
    }
    return () => window.removeEventListener('scroll', handleScroll)
  }, [isHomePage])

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => { document.body.style.overflow = 'unset' }
  }, [mobileOpen])

  const menuVariants = {
  closed: {
    opacity: 0,
    y: -20,
    scaleY: 0.95,
    transition: { 
      duration: 0.3, 
      ease: [0.16, 1, 0.3, 1] as const, // Added as const
      when: "afterChildren" 
    }
  },
  opened: {
    opacity: 1,
    y: 0,
    scaleY: 1,
    transition: { 
      type: "spring", 
      duration: 0.5, 
      bounce: 0.1, 
      when: "beforeChildren", 
      staggerChildren: 0.08 
    }
  }
}

const linkVariants = {
  closed: { opacity: 0, x: -16, scale: 0.98 },
  opened: { 
    opacity: 1, 
    x: 0, 
    scale: 1, 
    transition: { 
      duration: 0.3, 
      ease: "easeOut" as const // ADDED 'as const' HERE to fix the error!
    } 
  }
}
  return (
    <>
      <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        isHomePage && !isScrolled
          ? 'bg-transparent py-5 border-b border-transparent shadow-none'
          : 'bg-[#111111]/95 backdrop-blur-md py-3 border-b border-white/10 shadow-lg'
      }`}>
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="relative h-12 w-auto">
                <img src="/logo-gear.svg" alt="Enduro Auto Parts" className="h-full w-auto object-contain brightness-110" />
              </div>
              <span className="hidden sm:block text-xl font-black tracking-tighter uppercase italic text-white">
                Enduro<span className="text-red-600">Auto</span>
              </span>
            </Link>

            {/* PC Nav Links */}
            <div ref={containerRef} className="hidden lg:flex items-center gap-1 bg-white/5 backdrop-blur-md rounded-full px-2 py-1 border border-white/10 relative">
              <div className="absolute top-1 bottom-1 bg-red-600 rounded-full transition-all duration-200 ease-out z-0 pointer-events-none"
                style={{ left: `${pillStyles.left}px`, width: `${pillStyles.width}px`, opacity: pillStyles.opacity }} />
              {navLinks.map(link => {
                const isActive = pathname === link.href
                return (
                  <Link key={link.name} to={link.href} data-path={link.href}
                    className={`px-5 py-2 text-sm font-medium transition-colors duration-300 relative z-10 rounded-full ${isActive ? 'text-white' : 'text-gray-300 hover:text-white'}`}>
                    {link.name}
                  </Link>
                )
              })}
            </div>

            {/* Global Action Icons */}
            <div className="flex items-center gap-4 text-white">
              
              {/* 2. Added onClick trigger to User button */}
              <button 
                onClick={() => setShowLoginToast(true)}
                className="hover:text-red-500 cursor-pointer transition-colors p-1 outline-none focus:text-red-500"
                aria-label="User Account Login"
              >
                <User size={20} />
              </button>

              <Link to="/shop/cart" className="relative hover:text-red-500 transition-colors">
                <ShoppingCart size={20} />
                {itemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-600 text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">{itemCount}</span>
                )}
              </Link>
              
              <button 
                className="lg:hidden p-1 text-gray-300 hover:text-white focus:outline-none cursor-pointer" 
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label="Toggle menu"
              >
                <div className="relative w-6 h-6 flex items-center justify-center">
                  <AnimatePresence mode="wait">
                    {mobileOpen ? (
                      <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                        <X size={24} />
                      </motion.div>
                    ) : (
                      <motion.div key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                        <Menu size={24} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Universal Animated Drawer Panel */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div 
              initial="closed"
              animate="opened"
              exit="closed"
              variants={menuVariants}
              style={{ originY: 0 }}
              className="lg:hidden absolute top-full left-0 w-full bg-[#111111] border-b border-white/10 shadow-2xl overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-red-600/[0.03] to-transparent pointer-events-none" />
              
              <div className="relative z-10 px-4 pt-4 pb-8 space-y-2 flex flex-col max-h-[85vh] overflow-y-auto">
                {navLinks.map(link => {
                  const isActive = pathname === link.href
                  return (
                    <motion.div key={link.name} variants={linkVariants}>
                      <Link 
                        to={link.href} 
                        onClick={() => setMobileOpen(false)}
                        className={`px-5 py-3.5 rounded-xl text-base font-black uppercase tracking-wider transition-all flex items-center justify-between group active:scale-[0.99] ${
                          isActive 
                            ? 'bg-red-600 text-white shadow-lg shadow-red-600/10' 
                            : 'text-gray-300 hover:bg-white/5 hover:text-white'
                        }`}
                      >
                        <span>{link.name}</span>
                        <span className={`text-xs transition-transform duration-300 ${isActive ? 'text-white opacity-80 translate-x-0' : 'text-gray-500 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0'}`}>
                          ➔
                        </span>
                      </Link>
                    </motion.div>
                  )
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* 3. Premium Animated Toast Notification Alert */}
      <AnimatePresence>
        {showLoginToast && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: -20, x: '-50%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="fixed top-24 left-1/2 z-[9999] w-[calc(100%-2rem)] max-w-sm bg-zinc-900/95 border border-zinc-800 rounded-2xl p-4 shadow-2xl flex items-center gap-3.5 text-white backdrop-blur-md"
          >
            <div className="bg-red-600/10 border border-red-500/20 text-red-500 p-2 rounded-xl flex-shrink-0">
              <Info size={18} />
            </div>
            <div className="text-left flex-1 min-w-0">
              <h4 className="text-sm font-black uppercase tracking-tight text-white mb-0.5">Account Portal</h4>
              <p className="text-xs text-zinc-400 truncate">Log in feature coming soon!</p>
            </div>
            <button 
              onClick={() => setShowLoginToast(false)}
              className="text-zinc-500 hover:text-white text-xs px-2 py-1 rounded transition-colors"
            >
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}