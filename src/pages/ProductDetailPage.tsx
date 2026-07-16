import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ShopNavbar } from '@/components/shop/ShopNavbar'
import { Footer } from '@/components/shop/Footer'
import { FloatingContactBubble } from '@/components/shop/FloatingBubble'
import { StockBadge, PageSpinner } from '@/components/ui'
import { productsApi, type Product } from '@/lib/api'
import { useCart } from '@/hooks/useCart'
import { ShoppingCart, ArrowLeft } from 'lucide-react'

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { addItem } = useCart()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedImg, setSelectedImg] = useState(0)

  useEffect(() => {
    if (!id) return
    productsApi.get(Number(id))
      .then(setProduct)
      .catch(() => navigate('/shop'))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <div className="bg-gray-50 min-h-screen flex flex-col"><ShopNavbar /><div className="flex-1 flex items-center justify-center"><PageSpinner /></div></div>
  if (!product) return null

  const outOfStock = product.stockStatus === 'OUT_OF_STOCK'
  const imgs = product.imageUrls?.length ? product.imageUrls : ['/placeholder.webp']

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <ShopNavbar />
      <main className="max-w-7xl mx-auto px-6 pt-32 pb-20 w-full flex-1">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-400 hover:text-gray-900 mb-8 transition-colors text-sm font-medium">
          <ArrowLeft size={16} /> Back
        </button>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div>
            <div className="aspect-square bg-white rounded-3xl border border-gray-200 flex items-center justify-center p-12 mb-4">
              <img src={imgs[selectedImg]} alt={product.name} className="w-full h-full object-contain" />
            </div>
            {imgs.length > 1 && (
              <div className="flex gap-3 flex-wrap">
                {imgs.map((img, i) => (
                  <button key={i} onClick={() => setSelectedImg(i)} className={`w-20 h-20 rounded-2xl border-2 overflow-hidden bg-white flex items-center justify-center p-2 transition-all ${i === selectedImg ? 'border-red-600' : 'border-gray-200 hover:border-gray-300'}`}>
                    <img src={img} alt={`View ${i+1}`} className="w-full h-full object-contain" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <StockBadge status={product.stockStatus} />
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{product.sku}</span>
              </div>
              <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tight mb-2">{product.name}</h1>
              {product.oemNumber && <p className="text-sm text-gray-400 bg-gray-100 inline-block px-3 py-1 rounded-lg">OEM: {product.oemNumber}</p>}
            </div>

            <div className="text-4xl font-black text-gray-900">₹{parseFloat(product.price).toLocaleString('en-IN')}</div>

            {product.description && <p className="text-gray-600 leading-relaxed">{product.description}</p>}

            {product.features?.length > 0 && (
              <div>
                <h3 className="font-bold text-gray-900 mb-3 uppercase text-sm tracking-wider">Features</h3>
                <ul className="space-y-2">
                  {product.features.map((f, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-gray-600"><span className="w-1.5 h-1.5 bg-red-600 rounded-full flex-shrink-0" />{f}</li>
                  ))}
                </ul>
              </div>
            )}

            {product.fitments?.length > 0 && (
              <div>
                <h3 className="font-bold text-gray-900 mb-3 uppercase text-sm tracking-wider">Compatible Vehicles</h3>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {product.fitments.map(f => (
                    <div key={f.id} className="text-sm bg-white border border-gray-100 rounded-xl px-4 py-3">
                      <span className="font-medium text-gray-900">{f.model.make.name} {f.model.name}</span>
                      <span className="text-gray-400 ml-2">({f.yearRange.yearFrom}–{f.yearRange.yearTo})</span>
                      {f.notes && <span className="text-gray-400 ml-2 text-xs">· {f.notes}</span>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button onClick={() => addItem(product)} disabled={outOfStock}
              className="w-full py-4 bg-red-600 hover:bg-red-700 disabled:bg-gray-200 disabled:text-gray-400 text-white rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-all active:scale-95">
              <ShoppingCart size={20} /> {outOfStock ? 'Out of Stock' : 'Add to Cart'}
            </button>
          </div>
        </div>
      </main>
      <Footer />
      <FloatingContactBubble />
    </div>
  )
}
