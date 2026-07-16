// src/components/shop/TeamSection.tsx
import { motion } from 'framer-motion'
import { Mail, Linkedin, Phone } from 'lucide-react'

const teamMembers = [
  {
    name: 'Elon Musk', // Fixed the typo from Elom -> Elon!
    role: 'Founder & CEO',
    image: '/team/ceo.jpg',
    bio: '20+ years of automotive logistics and parts sourcing expert.',
    contact: { email: 'Musk@autopart.com', phone: '+91 9876543210', linkedin: 'https://linkedin.com/in/vikram-example' },
  },
  {
    name: 'Mark Zuckerberg', // Fixed the typo from Zukerberg -> Zuckerberg!
    role: 'Head of Parts Operations',
    image: '/team/operations.jpg',
    bio: 'Oversees 10,000+ SKU inventory and quality control process.',
    contact: { email: 'mark@autopart.com', phone: '+91 9876543211', linkedin: 'https://linkedin.com/in/arun-example' },
  },
]

export function TeamSection() {
  return (
    <section className="bg-[#0a0a0a] py-16 md:py-24 border-y border-white/5 relative overflow-hidden">
      {/* Large watermark (hidden on mobile to prevent horizontal page scrolling bugs) */}
      <div className="hidden md:block absolute -bottom-20 -left-20 text-[300px] font-black italic opacity-[0.015] text-white select-none">
        AP
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Mobile-Only Centered Section Header */}
        <div className=" text-center mb-10">
          <span className="inline-block text-red-600 font-bold uppercase tracking-widest text-xs mb-2">Our Story</span>
          <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter">
            Meet Our Team
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr,2fr] gap-12 lg:gap-24 items-start">
          
          {/* Left Column (Main Story) - Collapses beautifully on mobile, sticks on desktop */}
          <div className="lg:sticky lg:top-32 max-w-lg">
            <motion.div 
              initial={{ opacity: 0, y: 15 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              viewport={{ once: true }} 
              transition={{ duration: 0.6 }}
              className="text-center lg:text-left"
            >
              <span className="hidden lg:inline-block text-red-600 font-bold uppercase tracking-widest text-sm mb-4">Our Story</span>
              <h2 className="hidden lg:block text-4xl sm:text-5xl font-black text-white leading-tight mb-8 uppercase italic">
                The Driving Force<br />Behind Our Quality.
              </h2>
              <p className="text-gray-300 text-base md:text-lg leading-relaxed mb-6">
                Founded on passion and expertise, our core team brings decades of combined experience in automotive engineering, logistics, and parts sourcing to ensure you get nothing but the best.
              </p>
              <div className="h-1 w-24 bg-red-600 rounded-full mx-auto lg:mx-0"/>
            </motion.div>
          </div>

          {/* Right Column (Team Grid) - Stacks beautifully on small screens, expands side-by-side on tablet/PC */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8 items-start">
            {teamMembers.map((member, index) => (
              <motion.div 
                key={member.name} 
                initial={{ opacity: 0, y: 30 }} 
                whileInView={{ opacity: 1, y: 0 }} 
                viewport={{ once: true, margin: "-50px" }} 
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group bg-[#111111] border border-white/5 rounded-2xl md:rounded-3xl p-5 md:p-8 hover:border-red-600/30 transition-all duration-300 lg:hover:-translate-y-1.5"
              >
                {/* Image Wrapper with Responsive Aspect Ratio */}
                <div className="relative aspect-[4/5] w-full rounded-xl md:rounded-2xl overflow-hidden mb-6 md:mb-8 border border-white/5 group-hover:border-white/10 transition-colors">
                  <img 
                    src={member.image} 
                    alt={member.name} 
                    className="w-full h-full object-cover object-center transition-transform duration-700 lg:group-hover:scale-103" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-transparent to-transparent opacity-40 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-500"/>
                </div>

                {/* Member Info */}
                <div className="mb-6 md:mb-8">
                  <h3 className="text-xl md:text-2xl font-bold text-white mb-1.5 uppercase italic">
                    {member.name}
                  </h3>
                  <p className="text-red-500 font-semibold text-xs md:text-sm mb-3 md:mb-4 tracking-wide uppercase">
                    {member.role}
                  </p>
                  <p className="text-gray-400 text-xs md:text-sm leading-relaxed line-clamp-3 sm:line-clamp-none">
                    {member.bio}
                  </p>
                </div>

                {/* Contact List */}
                <div className="space-y-3 border-t border-white/5 pt-5 md:pt-6">
                  <h4 className="text-white text-[10px] md:text-xs uppercase font-bold tracking-wider mb-3">
                    Contact Info
                  </h4>
                  {[
                    { icon: Mail, label: member.contact.email, href: `mailto:${member.contact.email}`, isEmail: true },
                    { icon: Phone, label: member.contact.phone, href: `tel:${member.contact.phone.replace(/\s+/g, '')}` },
                    { icon: Linkedin, label: 'LinkedIn Profile', href: member.contact.linkedin },
                  ].map((contact, i) => (
                    <a 
                      key={i} 
                      href={contact.href} 
                      target={contact.icon === Linkedin ? '_blank' : undefined} 
                      rel={contact.icon === Linkedin ? 'noopener noreferrer' : undefined}
                      className="flex items-center gap-3 md:gap-4 text-gray-400 hover:text-red-500 transition-colors group/link min-w-0"
                    >
                      <div className="w-8 h-8 md:w-10 md:h-10 flex flex-shrink-0 items-center justify-center rounded-lg bg-white/5 group-hover/link:bg-red-600/10 border border-white/5 transition-colors">
                        <contact.icon className="w-4 h-4 md:w-4.5 md:h-4.5" strokeWidth={2}/>
                      </div>
                      <span className={`text-xs md:text-sm font-medium truncate ${contact.isEmail ? 'break-all' : ''}`}>
                        {contact.label}
                      </span>
                    </a>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </section>
  )
}