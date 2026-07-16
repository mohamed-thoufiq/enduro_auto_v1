import { useEffect, useState } from 'react'
import { ShopNavbar } from '@/components/shop/ShopNavbar'
import { Footer } from '@/components/shop/Footer'
import { FloatingContactBubble } from '@/components/shop/FloatingBubble'
import { ShieldCheck, Truck, Award, Users, Eye, Compass, Target, ShieldAlert } from 'lucide-react'
import { TeamSection } from '@/components/shop/TeamSection'
// 1. Import motion components
import { motion } from 'framer-motion'

const iconMap: Record<string, any> = { ShieldCheck, Truck, Award, Users }

export default function AboutPage() {
  const [settings] = useState<any>({})

  const heroTitle    = settings.about_hero_title    || 'Built on Trust. Driven by Quality.'
  const heroSubtitle = settings.about_hero_subtitle || 'Your most trusted source for genuine high-performance automotive components.'
  const storyTitle   = settings.about_story_title   || 'Our Legacy'
  const storyBody    = settings.about_story_body    || 'Established with a vision to redefine the automotive supply landscape, we have grown into a premier provider of precision-engineered components.'
  const mission      = settings.about_mission       || 'To deliver genuine, high-quality automotive parts with uncompromised speed, absolute reliability, and expert technical support.'
  const vision       = settings.about_vision        || 'To become the global benchmark for automotive parts distribution, recognized for digital innovation, supply chain integrity, and elite customer trust.'
  const companyDesc  = settings.company_description || 'Every component passing through our facility undergoes stringent quality benchmarks to guarantee optimal tolerance, fitment, and structural integrity.'

  let stats: { value: string; label: string }[] = []
  try { stats = JSON.parse(settings.about_stats || '[]') } catch {
    stats = [
      { value: '15K+', label: 'Active SKU Catalog' }, { value: '99.8%', label: 'Fitment Accuracy' },
      { value: '100%', label: 'Genuine Components' }, { value: '24/7', label: 'Expert Support' },
    ]
  }

  // 2. Define Animation Blueprint Configurations
  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } }
  }

  const staggerContainer = {
    animate: { transition: { staggerChildren: 0.12 } }
  }

  return (
    <div className="bg-[#0a0a0a] min-h-screen text-gray-100 flex flex-col font-sans overflow-x-hidden">
      <ShopNavbar />

      {/* Hero Section */}
      <section className="relative pt-44 pb-28 overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 bg-gradient-to-br from-red-600/10 via-transparent to-transparent" />
        <div className="absolute top-10 right-20 w-[600px] h-[600px] bg-red-600/5 rounded-full blur-[180px]" />
        
        {/* Animated Text + Logo Container */}
        <motion.div 
          initial="initial"
          animate="animate"
          variants={staggerContainer}
          className="relative max-w-[1400px] mx-auto px-6 lg:px-8 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-12"
        >
          {/* Left Text Block */}
          <div className="max-w-4xl z-10 flex-1">
            <motion.span 
              variants={fadeInUp}
              className="inline-block text-red-500 font-black uppercase tracking-[0.3em] text-xs mb-4"
            >
              Who We Are
            </motion.span>
            <motion.h1 
              variants={fadeInUp}
              className="text-4xl md:text-8xl font-black text-white uppercase italic tracking-tighter leading-[0.9] mb-8"
            >
              {heroTitle}
            </motion.h1>
            <motion.p 
              variants={fadeInUp}
              className="text-gray-400 text-lg md:text-xl max-w-2xl leading-relaxed font-medium"
            >
              {heroSubtitle}
            </motion.p>
          </div>

          {/* Right Logo Placement Container: Premium 3D rotation entry */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.7, rotate: -45 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            className="flex flex-shrink-0 items-center justify-center w-40 h-40 sm:w-48 sm:h-48 md:w-80 md:h-80 relative z-10 mx-auto lg:mx-0 lg:mr-12 select-none mt-4 lg:mt-0 group"
          >
            {/* Ambient background glow ring */}
            <div className="absolute inset-0 bg-red-600/10 rounded-full blur-2xl opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
            <img 
              src="/logo-gear.svg" 
              alt="Enduro Auto Parts" 
              className="h-full w-auto object-contain brightness-110 drop-shadow-[0_0_30px_rgba(220,38,38,0.2)] transform transition-transform duration-700 hover:rotate-6 hover:scale-105" 
            />
          </motion.div>
        </motion.div>
      </section>

      {/* Scroll-triggered content wrapper using viewport boundaries */}
      <motion.div
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, margin: "-100px" }}
        variants={staggerContainer}
      >
        {/* Stats Section */}
        {stats.length > 0 && (
          <section className="bg-red-600 relative z-10 shadow-xl py-10">
            <div className="max-w-[1400px] mx-auto px-6 lg:px-8">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                {stats.map((stat, i) => (
                  <motion.div 
                    key={i} 
                    variants={fadeInUp}
                    className="text-center border-r last:border-r-0 border-white/10"
                  >
                    <p className="text-3xl md:text-5xl font-black text-white italic tracking-tight">{stat.value}</p>
                    <p className="text-red-100 text-xs font-bold uppercase tracking-widest mt-2">{stat.label}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Story Section */}
        <section className="py-28 relative border-b border-white/5">
          <div className="max-w-[1400px] mx-auto px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-start">
              <motion.div variants={fadeInUp} className="space-y-6">
                <span className="inline-block text-red-500 font-black uppercase tracking-[0.25em] text-xs">{storyTitle}</span>
                <h2 className="text-3xl md:text-6xl font-black text-white uppercase italic tracking-tighter leading-none">The Driving Force<br />Behind Absolute Quality.</h2>
                <div className="h-1 w-24 bg-red-600 rounded-full my-6" />
                <p className="text-gray-300 text-base md:text-lg leading-relaxed">{storyBody}</p>
                {companyDesc && <p className="text-gray-400 text-sm md:text-base leading-relaxed">{companyDesc}</p>}
              </motion.div>
              
              <div className="grid grid-cols-1 gap-6">
                {[
                  { icon: Compass, title: 'Our Mission', body: mission, bg: Target },
                  { icon: Target, title: 'Our Vision', body: vision, bg: Eye },
                ].map((card, i) => (
                  <motion.div 
                    key={i}
                    variants={fadeInUp}
                    whileHover={{ scale: 1.02 }}
                    className="bg-[#111111] border border-white/5 rounded-3xl p-6 md:p-8 relative overflow-hidden group hover:border-red-600/30 transition-all duration-300"
                  >
                    <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity"><card.bg size={120} className="text-red-600" /></div>
                    <div className="flex items-start gap-4 md:gap-5">
                      <div className="p-3 bg-red-600/10 rounded-2xl text-red-500 flex-shrink-0"><card.icon size={24} /></div>
                      <div>
                        <h3 className="text-base md:text-lg font-black uppercase tracking-wider text-white mb-2 md:mb-3">{card.title}</h3>
                        <p className="text-gray-400 text-xs md:text-sm leading-relaxed">{card.body}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Benchmarks Section */}
        <section className="py-28 bg-[#0d0d0d] relative border-b border-white/5">
          <div className="max-w-[1400px] mx-auto px-6 lg:px-8">
            <motion.div variants={fadeInUp} className="text-center max-w-3xl mx-auto mb-16 md:mb-20">
              <span className="text-red-500 text-xs font-black uppercase tracking-[0.25em] mb-4 inline-block">Benchmarks</span>
              <h2 className="text-3xl md:text-5xl font-black text-white uppercase italic tracking-tighter">Our Core Foundations</h2>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              {[
                { icon: 'ShieldCheck', title: '100% Genuine Track', desc: 'Sourced directly from verified OEM and Tier-1 manufacturers globally with absolute transparency certification.' },
                { icon: 'Truck', title: 'Express Distribution', desc: 'Next-day turnaround and optimized logistics pipelines ensuring your operation faces minimal downtime.' },
                { icon: 'Award', title: 'Certified Fitment', desc: 'Precision-mapped data matrices validating exact engineering cross-references before dispatch.' },
              ].map((value, i) => {
                const CustomIcon = iconMap[value.icon] || ShieldAlert
                return (
                  <motion.div 
                    key={i} 
                    variants={fadeInUp}
                    whileHover={{ y: -6 }}
                    className="bg-[#111111] border border-white/5 p-6 md:p-8 rounded-3xl hover:border-white/10 transition-all group"
                  >
                    <div className="text-red-500 mb-6 bg-[#0a0a0a] w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center border border-white/5 group-hover:bg-red-600 group-hover:text-white transition-colors duration-300">
                      <CustomIcon size={24} />
                    </div>
                    <h3 className="text-lg md:text-xl font-black uppercase tracking-tight text-white mb-2 md:mb-3">{value.title}</h3>
                    <p className="text-gray-400 text-xs md:text-sm leading-relaxed">{value.desc}</p>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </section>
      </motion.div>

      <TeamSection />

      {/* Bottom CTA Block */}
      <section className="bg-[#0a0a0a] py-24 border-t border-white/5">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-8">
          <div className="bg-[#111111] border border-white/5 rounded-3xl p-8 md:p-14 flex flex-col lg:flex-row items-center justify-between gap-8">
            <div>
              <h3 className="text-2xl md:text-4xl font-black text-white uppercase italic tracking-tighter mb-3">Need Help Finding a Fitment?</h3>
              <p className="text-gray-400 max-w-xl text-xs md:text-sm leading-relaxed">Our mechanical consulting division is standing by to cross-reference OEM parts and verify exact chassis compatibility.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto flex-shrink-0">
              <a href="/contact" className="bg-red-600 hover:bg-red-700 text-white px-6 py-3.5 md:px-10 md:py-4 rounded-full font-black uppercase text-xs tracking-widest transition-all text-center shadow-lg shadow-red-600/10 active:scale-95">Contact Technical Support</a>
              <a href="/shop" className="bg-white/5 hover:bg-white/10 border border-white/10 text-white px-6 py-3.5 md:px-10 md:py-4 rounded-full font-black uppercase text-xs tracking-widest transition-all text-center active:scale-95">Launch Parts Catalog</a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <FloatingContactBubble />
    </div>
  )
}