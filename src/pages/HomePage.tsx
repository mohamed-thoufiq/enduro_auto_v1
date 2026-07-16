import { useEffect, useState } from 'react'
import { ShopNavbar } from '@/components/shop/ShopNavbar'
import { FloatingContactBubble } from '@/components/shop/FloatingBubble'
import { HeroSlider } from '@/components/shop/HeroSlider'
import { MostSoldParts } from '@/components/shop/MostSoldParts'
import { TeamSection } from '@/components/shop/TeamSection'
import { Footer } from '@/components/shop/Footer'
import { DebugOverlay } from '@/components/debug/DebugOverlay'

const API =(import.meta as any).VITE_API_URL || 'http://localhost:4000/api'

export default function HomePage() {
  const [brands, setBrands] = useState<any[]>([])

  useEffect(() => {
    fetch(`${API}/brands`).then(r => r.ok ? r.json() : []).then(setBrands).catch(() => {})
  }, [])

  return (
    <>
      <ShopNavbar />
      <HeroSlider />
      <TeamSection />
      <MostSoldParts />

      {brands.length > 0 && (
        <section className="bg-[#0a0a0a] border-y border-white/5 py-16 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 mb-10">
            <p className="text-center text-[30px] text-red-500 italic font-bold uppercase tracking-[0.2em]">Official Partners & Trusted Brands</p>
          </div>
          <div className="relative flex overflow-hidden marquee-mask">
            <div className="flex animate-marquee whitespace-nowrap items-center">
              <div className="flex items-center gap-24 pr-24">
                {brands.map((b: any) => (
                  <div key={`${b.id}-1`} className="flex-shrink-0 w-48 flex justify-center group">
                    <img src={b.logoUrl} alt={b.name} className="h-24 w-auto object-contain transition-all duration-500 transform group-hover:scale-110 group-hover:brightness-125" />
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-24 pr-24">
                {brands.map((b: any) => (
                  <div key={`${b.id}-2`} className="flex-shrink-0 w-48 flex justify-center group">
                    <img src={b.logoUrl} alt={b.name} className="h-24 w-auto object-contain transition-all duration-500 transform group-hover:scale-110 group-hover:brightness-125" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      <Footer />
      <FloatingContactBubble />
      <DebugOverlay />
    </>
  )
}
