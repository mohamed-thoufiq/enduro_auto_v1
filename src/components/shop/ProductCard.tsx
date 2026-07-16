import { ShoppingCart } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { Product } from '@/lib/api'
import { StockBadge } from '@/components/ui'
import { useCart } from '@/context/CartContext'

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart()
  const outOfStock = product.stockStatus === 'OUT_OF_STOCK'
  const img = product.imageUrls?.[0] || '/placeholder.webp'

  return (
    <Link to={`/shop/${product.id}`}
      className="group bg-white border border-gray-200 rounded-2xl overflow-hidden flex flex-col transition-all hover:shadow-xl hover:shadow-gray-200/50 hover:-translate-y-1 cursor-pointer">
      <div className="relative aspect-square bg-gray-50 p-6 flex items-center justify-center">
        <img src={img} alt={product.name} className="object-contain w-full h-full p-8 transition-transform duration-500 group-hover:scale-105" />
        <div className="absolute top-3 left-3"><StockBadge status={product.stockStatus} /></div>
      </div>
      <div className="p-5 flex flex-col flex-1">
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{product.sku}</span>
        <h3 className="text-sm font-semibold text-gray-900 leading-tight line-clamp-2 mb-4 group-hover:text-red-600 transition-colors">{product.name}</h3>
        {product.oemNumber && (
          <p className="text-[11px] text-gray-500 mb-4 bg-gray-100 inline-block px-2 py-1 rounded self-start">OEM: {product.oemNumber}</p>
        )}
        <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
          <span className="text-lg font-bold text-gray-900">₹{parseFloat(product.price).toLocaleString('en-IN')}</span>
          <button onClick={e => { e.preventDefault(); e.stopPropagation(); addItem(product) }} disabled={outOfStock}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 text-white text-xs font-bold hover:bg-red-700 disabled:bg-gray-200 disabled:text-gray-400 transition-all z-10">
            <ShoppingCart size={16} /> Add
          </button>
        </div>
      </div>
    </Link>
  )
}
