import { Link } from 'react-router-dom'
import { Phone, Mail, MapPin, MessageSquare, Instagram, Facebook, Twitter, ShieldCheck, Truck, ArrowUpRight } from 'lucide-react'

export function Footer() {
  const currentYear = new Date().getFullYear()
  const companyName = import.meta.env.VITE_COMPANY_NAME || 'Spareparts.me'

  return (
    <footer className="bg-[#0a0a0a] border-t border-white/5 pt-20 pb-10">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          <div className="space-y-6">
            <Link to="/" className="inline-block group">
              <img src="/logo-gear.svg" alt="Enduro Auto Parts" className="h-20 w-auto object-contain mb-2" />
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">Dubai's leading supplier of genuine automotive components. We bridge the gap between world-class engineering and your vehicle.</p>
            <div className="flex gap-4">
              {[Instagram, Facebook, Twitter].map((Icon, i) => (
                <a key={i} href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-red-600 hover:text-white transition-all">
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-white text-xs font-black uppercase tracking-[0.2em] mb-8">Quick Catalog</h4>
            <ul className="space-y-4">
              {[
                { name: 'Brakes & Rotors', href: '/shop?sku=BR' },
                { name: 'Engine Components', href: '/shop?sku=EP' },
                { name: 'Filters & Service', href: '/shop?sku=FL' },
                { name: 'Suspension Kits', href: '/shop?sku=SU' },
                { name: 'New Arrivals', href: '/shop' },
              ].map(link => (
                <li key={link.name}>
                  <Link to={link.href} className="text-gray-400 hover:text-red-500 text-sm flex items-center group transition-colors">
                    {link.name}<ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 ml-1 transition-all -translate-y-1" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white text-xs font-black uppercase tracking-[0.2em] mb-8">Direct Support</h4>
            <ul className="space-y-6">
              <li className="flex items-start gap-4">
                <div className="mt-1 text-red-600"><Phone size={18} /></div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-bold mb-1">Call Us</p>
                  <a href={`tel:${import.meta.env.VITE_CALL_NUMBER}`} className="text-gray-200 hover:text-white font-medium">{import.meta.env.VITE_CALL_NUMBER || '+971 4 000 0000'}</a>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="mt-1 text-red-600"><MessageSquare size={18} /></div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-bold mb-1">WhatsApp</p>
                  <a href={`https://wa.me/${import.meta.env.VITE_WHATSAPP_NUMBER}`} className="text-gray-200 hover:text-white font-medium">Online Now (Fast Reply)</a>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="mt-1 text-red-600"><Mail size={18} /></div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-bold mb-1">Email</p>
                  <a href="mailto:support@spareparts.me" className="text-gray-200 hover:text-white font-medium">support@spareparts.me</a>
                </div>
              </li>
            </ul>
          </div>

          <div className="bg-white/5 p-8 rounded-3xl border border-white/5">
            <h4 className="text-white text-xs font-black uppercase tracking-[0.2em] mb-6">Verified Seller</h4>
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <ShieldCheck className="text-green-500" size={24} />
                <p className="text-xs text-gray-300 leading-tight"><span className="text-white font-bold block">100% Genuine Guarantee</span>Every part is verified for authenticity.</p>
              </div>
              <div className="flex items-center gap-3">
                <Truck className="text-red-600" size={24} />
                <p className="text-xs text-gray-300 leading-tight"><span className="text-white font-bold block">Global Express Shipping</span>Dubai to your door in 3-5 days.</p>
              </div>
              <Link to="/admin" className="inline-block mt-4 text-[10px] uppercase font-bold text-gray-600 hover:text-white transition-colors">Employee Dashboard Login</Link>
            </div>
          </div>
        </div>

        <div className="border-t border-white/5 mt-20 pt-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-gray-500 text-xs text-center md:text-left">© {currentYear} {companyName}. All rights reserved. <span className="mx-2">|</span> Designed for Performance.</p>
          <div className="flex items-center gap-6 opacity-30">
            <div className="h-5 w-10 bg-white/20 rounded-sm"></div>
            <div className="h-5 w-10 bg-white/20 rounded-sm"></div>
            <div className="h-5 w-10 bg-white/20 rounded-sm"></div>
          </div>
        </div>
      </div>
    </footer>
  )
}
