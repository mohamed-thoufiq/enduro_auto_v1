import { X, ChevronLeft, ChevronRight, AlertCircle, CheckCircle2 } from 'lucide-react'
import clsx from 'clsx'
import { Clock, XCircle, RefreshCcw } from 'lucide-react'

const getBadgeStyles = (type: string) => {
  const styles: Record<string, string> = {
    IN_STOCK: 'bg-green-500/10 text-green-500 border-green-500/20',
    OUT_OF_STOCK: 'bg-red-500/10 text-red-500 border-red-500/20',
    BACKORDER: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    PENDING: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    CONFIRMED: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    DELIVERED: 'bg-green-500/10 text-green-500 border-green-500/20',
    CANCELLED: 'bg-white/5 text-gray-500 border-white/10',
  }
  return clsx('px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest border', styles[type] || 'bg-white/5 text-gray-400 border-white/10')
}

export function StockBadge({ status }: { status: string }) {
  return <span className={getBadgeStyles(status)}>{status.replace(/_/g, ' ')}</span>
}
export function OrderStatusBadge({ status }: { status: string }) {
  return <span className={getBadgeStyles(status)}>{status}</span>
}

export function Spinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sz = { sm: 'h-4 w-4', md: 'h-8 w-8', lg: 'h-14 w-14' }[size]
  return (
    <div className={clsx('relative', sz)}>
      <div className={clsx('absolute inset-0 rounded-full border-2 border-white/5', sz)} />
      <div className={clsx('absolute inset-0 rounded-full border-2 border-t-red-600 animate-spin', sz)} />
    </div>
  )
}

export function PageSpinner() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
      <Spinner size="lg" />
      <p className="text-[10px] uppercase font-black tracking-[0.3em] text-red-600 animate-pulse">Synchronizing Inventory...</p>
    </div>
  )
}

export function Modal({ open, onClose, title, children, size = 'md' }: {
  open: boolean; onClose: () => void; title: string; children: React.ReactNode; size?: 'sm' | 'md' | 'lg' | 'xl'
}) {
  if (!open) return null
  const widths = { sm: 'max-w-sm', md: 'max-w-lg', lg: 'max-w-2xl', xl: 'max-w-4xl' }
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-md bg-black/60" onClick={onClose}>
      <div className={clsx('bg-[#111111] border border-white/10 rounded-[2rem] shadow-2xl w-full overflow-hidden', widths[size])} onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-8 border-b border-white/5">
          <h2 className="text-xl font-black text-white uppercase italic tracking-tighter">{title}</h2>
          <button onClick={onClose} className="p-2 rounded-xl bg-white/5 hover:bg-red-600 text-white transition-all"><X size={20} /></button>
        </div>
        <div className="p-8 text-gray-300">{children}</div>
      </div>
    </div>
  )
}

export function Pagination({ page, pages, onChange }: { page: number; pages: number; onChange: (p: number) => void }) {
  if (pages <= 1) return null
  return (
    <div className="flex items-center justify-center gap-2 mt-12 pb-10">
      <button onClick={() => onChange(page - 1)} disabled={page <= 1} className="p-2 border border-white/10 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 disabled:opacity-20 transition-all">
        <ChevronLeft size={20} />
      </button>
      <div className="flex items-center gap-1 px-4">
        <span className="text-sm font-bold text-white italic">PAGE {page}</span>
        <span className="text-xs text-gray-600 font-bold uppercase mx-2">OF</span>
        <span className="text-sm font-bold text-gray-400 italic">{pages}</span>
      </div>
      <button onClick={() => onChange(page + 1)} disabled={page >= pages} className="p-2 border border-white/10 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 disabled:opacity-20 transition-all">
        <ChevronRight size={20} />
      </button>
    </div>
  )
}

export function StatCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="bg-[#111111] border border-white/5 rounded-3xl p-6 hover:border-red-600/30 transition-all group">
      <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 group-hover:text-red-600 transition-colors">{label}</p>
      <p className="text-3xl font-black text-white italic tracking-tighter">{value}</p>
      {sub && <p className="text-[10px] text-gray-600 font-bold mt-2 uppercase">{sub}</p>}
    </div>
  )
}

export function Toast({ message, type = 'success', onClose }: { message: string; type?: 'success' | 'error'; onClose: () => void }) {
  return (
    <div className={clsx(
      'fixed bottom-8 left-1/2 -translate-x-1/2 z-[150] flex items-center gap-4 px-6 py-4 rounded-2xl border shadow-2xl',
      type === 'success' ? 'bg-[#0f1711] border-green-500/20 text-green-400' : 'bg-[#1a0f0f] border-red-500/20 text-red-400'
    )}>
      {type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
      <span className="text-sm font-bold uppercase italic tracking-tight">{message}</span>
      <button onClick={onClose} className="ml-2 p-1 hover:bg-white/10 rounded-lg transition-colors"><X size={16} /></button>
    </div>
  )
}

export function PayStatusBadge({ status }: { status: string }) {
  const configs: Record<string, { bg: string, text: string, icon: any }> = {
    PAID:     { bg: 'bg-green-50',  text: 'text-green-600',  icon: CheckCircle2 },
    UNPAID:   { bg: 'bg-amber-50',  text: 'text-amber-600',  icon: Clock },
    FAILED:   { bg: 'bg-red-50',    text: 'text-red-600',    icon: XCircle },
    REFUNDED: { bg: 'bg-blue-50',   text: 'text-blue-600',   icon: RefreshCcw },
  }
  const config = configs[status] || configs.UNPAID
  const Icon = config.icon
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-current/10 ${config.bg} ${config.text}`}>
      <Icon size={12} />{status}
    </span>
  )
}
