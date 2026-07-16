// src/pages/ShopPage.tsx
import { useEffect, useState, useCallback } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { Filter, Search, ChevronDown, LayoutGrid, List, ShoppingCart, ArrowRight, AlertTriangle } from 'lucide-react'
import { ShopNavbar } from '@/components/shop/ShopNavbar'
import { FloatingContactBubble } from '@/components/shop/FloatingBubble'
import { ProductCard } from '@/components/shop/ProductCard'
import { Pagination, PageSpinner } from '@/components/ui'
import { productsApi, type Product, type Make } from '@/lib/api'
import { Footer } from '@/components/shop/Footer'
import { useCart } from '@/hooks/useCart'
import { motion, AnimatePresence } from 'framer-motion'

export default function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  const { items, subtotal } = useCart()

  const [products, setProducts] = useState<Product[]>([])
  const [meta, setMeta] = useState({ total: 0, page: 1, pages: 1 })
  const [makes, setMakes] = useState<Make[]>([])
  const [years, setYears] = useState<number[]>([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  
  // Mobile responsive states
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const [showMaintenancePopup, setShowMaintenancePopup] = useState(true)

  const skuQ  = searchParams.get('sku') || ''
  const makeQ  = searchParams.get('make') || ''
  const modelQ = searchParams.get('model') || ''
  const yearQ  = searchParams.get('year') || ''
  const pageQ  = Number(searchParams.get('page') || '1')

  const selectedMake = makes.find(m => m.name === makeQ)
  const modelOptions = selectedMake?.models || []

  function setParam(key: string, value: string) {
    const p = new URLSearchParams(searchParams.toString())
    if (value) p.set(key, value); else p.delete(key)
    if (key !== 'page') p.delete('page')
    setSearchParams(p)
  }

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const params: Record<string, string | number> = { page: pageQ, limit: 24 }
      if (skuQ) params.sku = skuQ
      if (makeQ) params.make = makeQ
      if (modelQ) params.model = modelQ
      if (yearQ) params.year = yearQ
      const res = await productsApi.list(params)
      setProducts(res.data)
      setMeta({ total: res.meta.total, page: res.meta.page, pages: res.meta.pages })
    } finally { setLoading(false) }
  }, [skuQ, makeQ, modelQ, yearQ, pageQ])

  useEffect(() => { load() }, [load])
  useEffect(() => {
    productsApi.getCatalogMakes().then(setMakes)
    productsApi.getCatalogYears().then(setYears)
  }, [])

  // Lock scroll when maintenance popup is active
  useEffect(() => {
    if (showMaintenancePopup) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => { document.body.style.overflow = 'unset' }
  }, [showMaintenancePopup])

  return (
    <div className="bg-gray-50 min-h-screen text-gray-900 flex flex-col font-sans overflow-x-hidden">
      <ShopNavbar />

      {/* Horizontal Category Pill Bar */}
      <section className="pt-24 pb-4 bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex items-center gap-2 md:gap-3 overflow-x-auto py-2 no-scrollbar">
            {['All Parts', 'Brakes', 'Engine', 'Filters', 'Suspension', 'Body'].map(cat => (
              <button key={cat} onClick={() => setParam('sku', cat === 'All Parts' ? '' : cat.substring(0,2).toUpperCase())}
                className={`flex-shrink-0 px-5 py-2.5 rounded-full text-[9px] md:text-[10px] uppercase tracking-widest font-black transition-all border ${
                  (cat === 'All Parts' && !skuQ) || skuQ === cat.substring(0,2).toUpperCase()
                    ? 'bg-red-600 border-red-600 text-white shadow-lg shadow-red-600/20'
                    : 'bg-white border-gray-200 text-gray-400 hover:border-red-600 hover:text-red-600'
                }`}>{cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-10 flex-1 w-full">
        {/* Mobile Filter Toggle Button */}
        <div className="lg:hidden mb-4">
          <button 
            onClick={() => setMobileFiltersOpen(true)}
            className="w-full bg-white border border-gray-200 rounded-2xl py-3.5 px-5 flex items-center justify-center gap-2 text-xs font-black uppercase tracking-wider text-gray-900 shadow-sm active:scale-98 transition-all"
          >
            <Filter size={14} className="text-red-600" /> Filter & Search Parts
          </button>
        </div>

        <div className="flex flex-col lg:grid lg:grid-cols-[260px,1fr] gap-6 md:gap-10 items-start">
          
          {/* Desktop Sidebar Filters */}
          <aside className="hidden lg:block w-full sticky top-48">
            <div className="bg-white rounded-3xl border border-gray-200 p-8 shadow-sm space-y-8">
              <div className="flex items-center justify-between border-b border-gray-50 pb-4">
                <h3 className="text-sm font-black text-gray-900 uppercase tracking-tighter flex items-center gap-2"><Filter size={16} className="text-red-600" /> Filter Parts</h3>
                {(skuQ || makeQ || modelQ || yearQ) && (
                  <button onClick={() => setSearchParams({})} className="text-[10px] font-bold text-red-600 uppercase tracking-widest hover:underline">Reset</button>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Part SKU</label>
                <div className="relative">
                  <Search className="absolute left-4 top-3.5 text-gray-300" size={14} />
                  <input className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm font-bold focus:bg-white focus:border-red-600 outline-none transition-all placeholder:font-medium" placeholder="Search e.g. BR-10" value={skuQ} onChange={e => setParam('sku', e.target.value)} />
                </div>
              </div>
              <div className="space-y-4">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Fitment Finder</p>
                {[
                  { label: 'Year', val: yearQ, options: years, key: 'year' },
                  { label: 'Make', val: makeQ, options: makes.map(m => m.name), key: 'make' },
                  { label: 'Model', val: modelQ, options: modelOptions.map(m => m.name), key: 'model', disabled: !makeQ },
                ].map(filter => (
                  <div key={filter.key} className="relative">
                    <select className="w-full appearance-none bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold cursor-pointer focus:border-red-600 outline-none disabled:opacity-30 transition-all"
                      value={filter.val} disabled={filter.disabled}
                      onChange={e => { setParam(filter.key, e.target.value); if(filter.key === 'make') setParam('model', '') }}>
                      <option value="">Select {filter.label}</option>
                      {filter.options.map((opt: any) => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                    <ChevronDown className="absolute right-4 top-4 text-gray-400 pointer-events-none" size={14} />
                  </div>
                ))}
              </div>
            </div>
          </aside>

          {/* Catalog Content Area */}
          <div className="space-y-6 md:space-y-8 w-full flex-1">
            <div className="flex items-center justify-between bg-white px-5 py-3.5 md:px-6 md:py-4 rounded-2xl border border-gray-200 shadow-sm">
              <p className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-widest">Found <span className="text-gray-900 font-black">{meta.total}</span> Quality Parts</p>
              <div className="flex gap-2">
                <button onClick={() => setViewMode('grid')} className={`p-2 rounded-xl transition-all ${viewMode === 'grid' ? 'bg-gray-900 text-white shadow-lg shadow-gray-900/10' : 'text-gray-300 hover:bg-gray-100'}`}><LayoutGrid size={15}/></button>
                <button onClick={() => setViewMode('list')} className={`p-2 rounded-xl transition-all ${viewMode === 'list' ? 'bg-gray-900 text-white shadow-lg shadow-gray-900/10' : 'text-gray-300 hover:bg-gray-100'}`}><List size={15}/></button>
              </div>
            </div>

            {loading ? <div className="py-20 flex justify-center"><PageSpinner /></div> : (
              <>
                <motion.div 
                  layout 
                  className={`grid ${viewMode === 'grid' ? 'grid-cols-2 md:grid-cols-3 gap-4 md:gap-6' : 'grid-cols-1 gap-4'}`}
                >
                  {products.map(p => (
                    <motion.div layout key={p.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }}>
                      <ProductCard product={p} />
                    </motion.div>
                  ))}
                </motion.div>
                
                {products.length === 0 && (
                  <div className="text-center py-16 md:py-20 bg-white rounded-3xl border-2 border-dashed border-gray-100">
                    <p className="text-gray-400 font-bold text-xs uppercase tracking-widest">No parts found matching your filter</p>
                  </div>
                )}
              </>
            )}
            <div className="pt-4">
              <Pagination page={meta.page} pages={meta.pages} onChange={p => setParam('page', String(p))} />
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <FloatingContactBubble />

      {/* Floating Checkout Bar */}
      {items.length > 0 && (
        <div className="fixed bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 z-40 w-[calc(100%-2rem)] max-w-sm md:max-w-md px-2">
          <button onClick={() => navigate('/checkout')}
            className="w-full bg-gray-900 text-white px-5 py-3.5 md:px-8 md:py-4 rounded-2xl shadow-2xl flex items-center justify-between hover:scale-102 transition-all group active:scale-98 border border-white/10">
            <div className="flex items-center gap-3 border-r border-white/10 pr-4 md:pr-6">
              <div className="relative">
                <ShoppingCart size={18} className="text-red-500" />
                <span className="absolute -top-1.5 -right-1.5 bg-red-600 text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center border border-gray-900">{items.length}</span>
              </div>
              <div className="text-left">
                <p className="text-[7px] font-black uppercase tracking-widest text-gray-400 leading-none mb-1">View Cart</p>
                <p className="text-xs md:text-sm font-black tracking-tighter leading-none">₹{subtotal.toLocaleString('en-IN')}</p>
              </div>
            </div>
            <span className="text-[10px] md:text-xs font-black uppercase tracking-widest flex items-center gap-1.5 group-hover:text-red-500 transition-colors pl-2">Checkout <ArrowRight size={12} /></span>
          </button>
        </div>
      )}

      {/* --- RESPONSIVE MOBILE FILTERS DRAWER PANEL --- */}
      <AnimatePresence>
        {mobileFiltersOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex justify-end">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileFiltersOpen(false)}
              className="absolute inset-0 bg-black/50 backdrop-blur-xs"
            />
            {/* Drawer Content */}
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="relative w-full max-w-[320px] bg-white h-full shadow-2xl flex flex-col p-6 z-10 text-gray-900"
            >
              <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-6">
                <h3 className="text-xs font-black uppercase tracking-wider flex items-center gap-2"><Filter size={14} className="text-red-600" /> Filter Options</h3>
                <button 
                  onClick={() => setMobileFiltersOpen(false)}
                  className="p-1.5 hover:bg-gray-100 rounded-full text-gray-500"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-6 flex-1 overflow-y-auto pr-1">
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Part SKU</label>
                  <div className="relative">
                    <Search className="absolute left-4 top-3 text-gray-300" size={14} />
                    <input className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-xs font-bold outline-none" placeholder="Search sku..." value={skuQ} onChange={e => setParam('sku', e.target.value)} />
                  </div>
                </div>

                <div className="space-y-4">
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Fitment Finder</p>
                  {[
                    { label: 'Year', val: yearQ, options: years, key: 'year' },
                    { label: 'Make', val: makeQ, options: makes.map(m => m.name), key: 'make' },
                    { label: 'Model', val: modelQ, options: modelOptions.map(m => m.name), key: 'model', disabled: !makeQ },
                  ].map(filter => (
                    <div key={filter.key} className="relative">
                      <select className="w-full appearance-none bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs font-bold cursor-pointer disabled:opacity-30"
                        value={filter.val} disabled={filter.disabled}
                        onChange={e => { setParam(filter.key, e.target.value); if(filter.key === 'make') setParam('model', '') }}>
                        <option value="">Select {filter.label}</option>
                        {filter.options.map((opt: any) => <option key={opt} value={opt}>{opt}</option>)}
                      </select>
                      <ChevronDown className="absolute right-4 top-3.5 text-gray-400 pointer-events-none" size={12} />
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-gray-100 pt-4 mt-6 space-y-3">
                {(skuQ || makeQ || modelQ || yearQ) && (
                  <button 
                    onClick={() => { setSearchParams({}); setMobileFiltersOpen(false) }}
                    className="w-full border border-red-500/20 text-red-600 py-3 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-red-50"
                  >
                    Reset All Filters
                  </button>
                )}
                <button 
                  onClick={() => setMobileFiltersOpen(false)}
                  className="w-full bg-gray-900 text-white py-3 rounded-xl text-xs font-bold uppercase tracking-wider"
                >
                  Apply Filters
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- DYNAMIC FORCE MAINTENANCE POPUP MODAL --- */}
      <AnimatePresence>
        {showMaintenancePopup && (
          <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
            {/* Absolute blurred backdrop cover */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 bg-[#0a0a0ad0] backdrop-blur-md"
            />
            
            {/* Maintenance Warning Card */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.92, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              className="relative w-full max-w-md bg-[#111111] border border-white/5 rounded-3xl p-6 md:p-8 shadow-2xl text-center text-white"
            >
              <div className="mx-auto w-16 h-16 bg-red-600/10 border border-red-500/20 text-red-500 rounded-2xl flex items-center justify-center mb-6 animate-pulse">
                <AlertTriangle size={30} />
              </div>

              <span className="text-[10px] font-black uppercase tracking-[0.25em] text-red-500 mb-2 inline-block">System Upgrade</span>
              <h3 className="text-2xl font-black uppercase italic tracking-tighter mb-4">E-commerce Work In Progress</h3>
              
              <p className="text-gray-400 text-sm leading-relaxed mb-8">
                Our checkout integration pipeline is currently undergoing scheduled engineering maintenance to incorporate local database upgrades. You can preview our catalog fully, but instant order generation is temporarily offline.
              </p>

              <div className="space-y-3">
                <button 
                  onClick={() => setShowMaintenancePopup(false)}
                  className="w-full bg-red-600 hover:bg-red-700 text-white py-3.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all active:scale-95 cursor-pointer shadow-lg shadow-red-600/15"
                >
                  Browse Catalog Model
                </button>
                <button 
                  onClick={() => {
                    setShowMaintenancePopup(false);
                    // Dispatches a global event to launch direct support contacts
                    setTimeout(() => window.dispatchEvent(new CustomEvent('open-global-contact')), 100);
                  }}
                  className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 py-3.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all cursor-pointer"
                >
                  Contact Parts Engineer
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}