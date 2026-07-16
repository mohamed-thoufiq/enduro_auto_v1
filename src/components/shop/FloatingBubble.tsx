// src/components/shop/FloatingBubble.tsx
// 1. Imported useEffect to listen for global events
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Phone } from 'lucide-react'

// Fetch dynamic contact numbers from Vite environment variables with fallback configurations
const WA_NUM = import.meta.env.VITE_WHATSAPP_NUMBER || '919840000000'
const TEL_NUM = import.meta.env.VITE_CALL_NUMBER || '+914423000000'
const WA_MSG = encodeURIComponent(import.meta.env.VITE_WHATSAPP_MESSAGE || 'Hi! I need help finding a spare part.')
const WA_URL = `https://wa.me/${WA_NUM.replace(/\D/g, '')}?text=${WA_MSG}`

export function FloatingContactBubble() {
  const [open, setOpen] = useState(false)

  // 2. Added the event handler to slide open the modal globally on trigger
  useEffect(() => {
    const handleOpen = () => setOpen(true)
    window.addEventListener('open-global-contact', handleOpen)
    return () => window.removeEventListener('open-global-contact', handleOpen)
  }, [])

  return (
    <>
      {/* 1. Floating Action Trigger Button */}
      <div className="fixed bottom-6 right-5 z-40 flex flex-col items-end gap-3">
        <button 
          onClick={() => setOpen(o => !o)} 
          aria-label="Contact us"
          className="w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-105 cursor-pointer relative animate-[bounce_3s_infinite_1s]"
          style={{ 
            background: '#25D366', 
            transform: open ? 'rotate(45deg)' : 'rotate(0deg)', 
            transition: 'transform 0.25s ease' 
          }}
        >
          {open ? <CloseSvg /> : <WaIcon size={28} />}
        </button>
      </div>

      {/* 2. Universal Glassmorphic Backdrop Contact Window */}
      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-50 flex items-end justify-end p-6 md:p-12 pointer-events-none">
            {/* Click-outside backdrop wrapper - closes modal when clicking outside the card */}
            <div 
              className="absolute inset-0 pointer-events-auto bg-black/40 backdrop-blur-xs" 
              onClick={() => setOpen(false)} 
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 50 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              className="relative w-full max-w-md bg-zinc-950/95 border border-zinc-800 rounded-3xl p-6 shadow-2xl pointer-events-auto text-white backdrop-blur-md"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-zinc-800 pb-4 mb-5">
                <div>
                  <h3 className="text-lg font-bold uppercase tracking-tight">Direct Support</h3>
                  <p className="text-xs text-zinc-400">Average response time: &lt; 5 minutes</p>
                </div>
                <button 
                  onClick={() => setOpen(false)}
                  className="p-2 hover:bg-zinc-850 rounded-full text-zinc-400 hover:text-white transition-colors cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {/* Actionable Channels */}
              <div className="space-y-3">
                {/* WhatsApp Support Link */}
                <a 
                  href={WA_URL} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 bg-emerald-600/10 hover:bg-emerald-600/20 border border-emerald-500/20 p-4 rounded-2xl transition-all group"
                >
                  <div className="bg-[#25D366] p-2.5 rounded-xl text-white">
                    <WaIcon size={20} />
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-sm text-white">WhatsApp Chat</p>
                    <p className="text-xs text-emerald-400">Instantly text our parts engineer</p>
                  </div>
                </a>

                {/* Direct Phone Call Link */}
                <a 
                  href={`tel:${TEL_NUM}`} 
                  className="flex items-center gap-4 bg-red-600/10 hover:bg-red-600/20 border border-red-500/20 p-4 rounded-2xl transition-all group"
                >
                  <div className="bg-red-600 p-2.5 rounded-xl text-white">
                    <Phone size={20} />
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-sm text-white">Direct Phone Call</p>
                    <p className="text-xs text-red-400">{TEL_NUM}</p>
                  </div>
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}

// SVG Components
function WaIcon({ size = 22, color = "white" }: { size?: number; color?: string }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      className="inline-block"
    >
      <path 
        d="M12.004 2C6.48 2 2 6.48 2 12.004c0 1.824.49 3.54 1.34 5.01L2 22l5.16-1.33c1.47.82 3.14 1.33 4.84 1.33 5.52 0 10.004-4.48 10.004-10.004C22.008 6.48 17.524 2 12.004 2z" 
        fill={color === "green" ? "#25D366" : color} 
      />
      <path 
        d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.16-.17.2-.35.22-.64.08-.3-.15-1.26-.46-2.39-1.47-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.08-.15-.67-1.61-.92-2.21-.24-.58-.49-.5-.67-.51-.17-.01-.37-.01-.57-.01-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.07 2.88 1.21 3.07.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.69.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35z" 
        fill={color === "green" ? "white" : "black"} 
      />
    </svg>
  )
}

function CloseSvg() {
  return (
    <svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <path d="M18 6L6 18M6 6l12 12" stroke="white" strokeWidth={2.5} strokeLinecap="round"/>
    </svg>
  )
}