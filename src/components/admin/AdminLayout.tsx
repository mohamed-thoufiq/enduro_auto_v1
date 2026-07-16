import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { LayoutDashboard, Package, ShoppingBag, Upload, Briefcase, LogOut, Menu, X, ChevronRight } from 'lucide-react'
import clsx from 'clsx'
import { useAuth, AuthProvider } from '@/hooks/useAuth'

const NAV = [
  { href: '/admin',          label: 'Dashboard',  icon: LayoutDashboard },
  { href: '/admin/products', label: 'Products',   icon: Package },
  { href: '/admin/orders',   label: 'Orders',     icon: ShoppingBag },
  { href: '/admin/import',   label: 'Import',     icon: Upload },
  { href: '/admin/brands',   label: 'Brands',     icon: Briefcase },
]

function Sidebar({ open, setOpen }: { open: boolean; setOpen: (v: boolean) => void }) {
  const { pathname } = useLocation()
  const { admin, logout } = useAuth()

  return (
    <>
      {open && <div className="fixed inset-0 bg-black/40 z-20 lg:hidden" onClick={() => setOpen(false)} />}
      <aside className={clsx('fixed left-0 top-0 bottom-0 z-30 flex flex-col w-60 text-white transition-transform duration-200', 'lg:translate-x-0', open ? 'translate-x-0' : '-translate-x-full')} style={{ background: '#1E3A5F' }}>
        <div className="flex items-center justify-between h-16 px-5 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-white/20 rounded-lg flex items-center justify-center"><span className="text-xs font-bold">AP</span></div>
            <span className="font-semibold text-sm">AutoParts Admin</span>
          </div>
          <button className="lg:hidden p-1" onClick={() => setOpen(false)}><X size={18} /></button>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-0.5">
          {NAV.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || (href !== '/admin' && pathname.startsWith(href))
            return (
              <Link key={href} to={href} onClick={() => setOpen(false)}
                className={clsx('flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors', active ? 'bg-white/20 font-medium' : 'text-white/70 hover:bg-white/10 hover:text-white')}>
                <Icon size={17} />{label}
                {active && <ChevronRight size={13} className="ml-auto" />}
              </Link>
            )
          })}
        </nav>
        <div className="px-4 py-4 border-t border-white/10">
          <p className="text-xs text-white/50 mb-0.5">Logged in as</p>
          <p className="text-sm font-medium text-white truncate">{admin?.name || admin?.email}</p>
          <button onClick={logout} className="mt-3 flex items-center gap-2 text-xs text-white/60 hover:text-white transition-colors">
            <LogOut size={13} /> Sign out
          </button>
        </div>
      </aside>
    </>
  )
}

function AdminGuard({ children }: { children: React.ReactNode }) {
  const { admin, loading } = useAuth()
  const { pathname } = useLocation()
  const navigate = useNavigate()

  if (loading) return <div className="flex items-center justify-center min-h-screen"><div className="w-8 h-8 rounded-full border-2 border-gray-200 border-t-blue-600 animate-spin" /></div>

  if (!admin && pathname !== '/auth/login') {
    navigate('/auth/login')
    return null
  }
  return <>{children}</>
}

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  return (
    <AuthProvider>
      <AdminGuard>
        <div className="min-h-screen bg-gray-50">
          <Sidebar open={open} setOpen={setOpen} />
          <div className="lg:hidden flex items-center h-14 px-4 bg-white border-b border-gray-200 sticky top-0 z-10">
            <button onClick={() => setOpen(true)} className="p-1.5 rounded-lg hover:bg-gray-100"><Menu size={20} /></button>
            <span className="ml-3 font-semibold text-sm text-gray-900">AutoParts Admin</span>
          </div>
          <main className="lg:pl-60">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">{children}</div>
          </main>
        </div>
      </AdminGuard>
    </AuthProvider>
  )
}
