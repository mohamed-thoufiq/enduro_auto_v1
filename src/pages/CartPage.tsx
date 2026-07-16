import { useCart } from '@/context/CartContext'
import { ShopNavbar } from '@/components/shop/ShopNavbar'
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function CartPage() {
  const { items, updateQty, removeItem, subtotal, itemCount } = useCart()

  if (itemCount === 0) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <ShopNavbar />
        <main className="max-w-3xl mx-auto pt-40 px-6 text-center">
          <div className="bg-white p-12 rounded-3xl border border-gray-200 shadow-sm">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300"><ShoppingBag size={40} /></div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h1>
            <p className="text-gray-500 mb-8">Looks like you haven't added any parts to your order yet.</p>
            <Link to="/shop" className="inline-flex items-center gap-2 px-8 py-4 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-all">Continue Shopping</Link>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      <ShopNavbar />
      <main className="max-w-7xl mx-auto pt-28 px-6">
        <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tighter mb-8">Review Your Order <span className="text-red-600">({itemCount})</span></h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-4">
            {items.map(item => (
              <div key={item.product.id} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex gap-6 items-center">
                <div className="w-24 h-24 bg-gray-50 rounded-xl relative flex-shrink-0">
                  <img src={item.product.imageUrls?.[0] || '/placeholder.webp'} alt={item.product.name} className="w-full h-full object-contain p-2" />
                </div>
                <div className="flex-1">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{item.product.sku}</p>
                  <h3 className="font-bold text-gray-900 mb-4">{item.product.name}</h3>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center border border-gray-100 rounded-lg bg-gray-50 overflow-hidden">
                      <button onClick={() => updateQty(item.product.id, item.quantity - 1)} className="p-2 hover:bg-gray-200 transition-colors"><Minus size={14} /></button>
                      <span className="w-10 text-center text-sm font-bold">{item.quantity}</span>
                      <button onClick={() => updateQty(item.product.id, item.quantity + 1)} className="p-2 hover:bg-gray-200 transition-colors"><Plus size={14} /></button>
                    </div>
                    <button onClick={() => removeItem(item.product.id)} className="text-gray-400 hover:text-red-600 transition-colors"><Trash2 size={18} /></button>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-black text-gray-900">₹{(parseFloat(item.product.price) * item.quantity).toLocaleString('en-IN')}</p>
                </div>
              </div>
            ))}
          </div>

          <aside className="lg:col-span-1">
            <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm sticky top-28 space-y-6">
              <h3 className="font-bold text-gray-900 uppercase tracking-wider text-sm border-b border-gray-100 pb-4">Order Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm"><span className="text-gray-500">Subtotal</span><span className="font-bold">₹{subtotal.toLocaleString('en-IN')}</span></div>
                <div className="flex justify-between text-sm"><span className="text-gray-500">Shipping</span><span className="text-green-600 font-bold uppercase text-[10px]">Free Express</span></div>
              </div>
              <div className="pt-6 border-t border-gray-100 flex justify-between items-baseline">
                <span className="text-lg font-black uppercase text-gray-900">Total</span>
                <span className="text-2xl font-black text-red-600">₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              <Link to="/checkout" className="w-full flex items-center justify-center gap-3 py-4 bg-gray-900 hover:bg-black text-white rounded-xl font-bold transition-all group">
                Proceed to Checkout <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </aside>
        </div>
      </main>
    </div>
  )
}
