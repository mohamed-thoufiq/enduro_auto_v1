import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ShoppingCart, Trash2, CheckCircle, Wallet, CreditCard, MapPin, User, ShieldCheck, Loader2, ArrowRight, FileText } from 'lucide-react'
import { ShopNavbar } from '@/components/shop/ShopNavbar'
import { FloatingContactBubble } from '@/components/shop/FloatingBubble'
import { useCart } from '@/hooks/useCart'
import { paymentsApi, type CreateOrderInput } from '@/lib/api'
import { Footer } from '@/components/shop/Footer'

const TAX_RATE = 0.18

const Label = ({ children }: { children: React.ReactNode }) => (
  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1 mb-2 block">{children}</label>
)

const ErrorMessage = ({ message }: { message: string }) => (
  <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-xs font-bold uppercase tracking-widest flex items-center gap-3 border border-red-100">
    <ShieldCheck size={18} /> {message}
  </div>
)

export default function CheckoutPage() {
  const navigate = useNavigate()
  const { items, subtotal, removeItem, clearCart } = useCart()

  const taxAmount = subtotal * TAX_RATE
  const total = subtotal + taxAmount

  const [form, setForm] = useState({ name: '', email: '', phone: '', line1: '', line2: '', city: '', state: '', pincode: '', country: 'India' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState<{ msg: string; orderId: string } | null>(null)

  const patch = (field: string, value: string) => { setForm(prev => ({ ...prev, [field]: value })); if (error) setError('') }

  const validateForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!form.name || !form.email || !form.phone || !form.line1 || !form.city || !form.pincode) { setError('Please fill in all required delivery details.'); return false }
    if (!emailRegex.test(form.email)) { setError('Please enter a valid email address.'); return false }
    if (form.phone.length < 10) { setError('Please enter a valid 10-digit phone number.'); return false }
    if (!items.length) { setError('Your cart is empty.'); return false }
    return true
  }

  async function handleOrder(method: 'ONLINE' | 'COD') {
    if (!validateForm()) return
    setLoading(true); setError('')
    try {
      const payload: CreateOrderInput = {
        customerData: { name: form.name, email: form.email, phone: form.phone, shippingAddress: { ...form } },
        items: items.map(i => ({ sku: i.product.sku, quantity: i.quantity })),
      }
      if (method === 'COD') {
        const res = await paymentsApi.createOrder({ ...payload, paymentMethod: 'COD' })
        clearCart(); setSuccess({ msg: 'COD Order Placed Successfully', orderId: res.orderId })
      } else {
        const res = await paymentsApi.createOrder(payload)
        clearCart(); setSuccess({ msg: 'Online Payment Received', orderId: res.orderId })
      }
    } catch (e: any) { setError(e.message || 'Something went wrong. Please try again.')
    } finally { setLoading(false) }
  }

  if (success) {
    const invoiceUrl = `http://localhost:4000/uploads/invoices/invoice-${success.orderId}.pdf`
    return (
      <div className="bg-gray-50 min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <div className="bg-white p-12 rounded-[40px] shadow-xl max-w-md w-full border border-gray-100">
          <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6"><CheckCircle size={40} className="text-green-500" /></div>
          <h1 className="text-3xl font-black text-gray-900 uppercase mb-2">Success!</h1>
          <p className="text-gray-500 font-medium mb-8 leading-relaxed">Order ID: <span className="text-gray-900 font-bold">{success.orderId}</span><br />{success.msg}</p>
          <div className="space-y-3">
            <a href={invoiceUrl} target="_blank" rel="noopener noreferrer" className="w-full py-4 border-2 border-gray-900 text-gray-900 rounded-2xl font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-gray-50 transition-all">
              <FileText size={18} /> Download Invoice
            </a>
            <button onClick={() => navigate('/shop')} className="w-full py-4 bg-gray-900 text-white rounded-2xl font-bold uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-gray-200">Back to Shop</button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <ShopNavbar />
      <main className="max-w-7xl mx-auto px-6 pt-32 pb-20 w-full flex-1">
        <div className="mb-12">
          <h1 className="text-4xl font-black text-gray-900 tracking-tight uppercase">Checkout</h1>
          <p className="text-gray-400 font-bold uppercase text-[10px] tracking-[0.2em] mt-2">Secure Encrypted Transaction</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-7 space-y-8">
            <section className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center text-red-600"><User size={18} /></div>
                <h2 className="text-sm font-black text-gray-900 uppercase tracking-widest">Customer Information</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2"><Label>Full Name</Label><input className="input-field" placeholder="John Doe" disabled={loading} value={form.name} onChange={e => patch('name', e.target.value)} /></div>
                <div><Label>Email Address</Label><input type="email" className="input-field" placeholder="john@example.com" disabled={loading} value={form.email} onChange={e => patch('email', e.target.value)} /></div>
                <div><Label>Phone Number</Label><input type="tel" className="input-field" placeholder="98765 43210" disabled={loading} value={form.phone} onChange={e => patch('phone', e.target.value)} /></div>
              </div>
            </section>
            <section className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center text-red-600"><MapPin size={18} /></div>
                <h2 className="text-sm font-black text-gray-900 uppercase tracking-widest">Shipping Address</h2>
              </div>
              <div className="space-y-6">
                <div><Label>Street Address</Label><input className="input-field" disabled={loading} value={form.line1} onChange={e => patch('line1', e.target.value)} placeholder="House No, Street, Area" /></div>
                <div><Label>Landmark (Optional)</Label><input className="input-field" disabled={loading} value={form.line2} onChange={e => patch('line2', e.target.value)} placeholder="Near Apollo Hospital" /></div>
                <div className="grid grid-cols-2 gap-6">
                  <div><Label>City</Label><input className="input-field" disabled={loading} value={form.city} onChange={e => patch('city', e.target.value)} placeholder="Mumbai" /></div>
                  <div><Label>State</Label><input className="input-field" disabled={loading} value={form.state} onChange={e => patch('state', e.target.value)} placeholder="Maharashtra" /></div>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div><Label>Pincode</Label><input className="input-field" disabled={loading} value={form.pincode} onChange={e => patch('pincode', e.target.value)} placeholder="400001" /></div>
                  <div><Label>Country</Label><div className="input-field bg-gray-50 flex items-center text-gray-400">India</div></div>
                </div>
              </div>
            </section>
            {error && <ErrorMessage message={error} />}
          </div>

          <div className="lg:col-span-5">
            <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-md sticky top-32 space-y-8">
              <h2 className="text-sm font-black text-gray-900 uppercase tracking-widest border-b border-gray-50 pb-5">Order Summary</h2>
              <div className="space-y-5 max-h-[240px] overflow-y-auto pr-2 custom-scrollbar">
                {items.length === 0 ? <p className="text-xs font-bold text-gray-400 uppercase text-center py-4">Cart is empty</p>
                : items.map(item => (
                  <div key={item.product.id} className="flex justify-between items-start group">
                    <div className="space-y-1">
                      <p className="text-[9px] font-black text-red-600 uppercase tracking-wider">{item.product.sku}</p>
                      <h4 className="text-xs font-bold text-gray-900 leading-tight uppercase">{item.product.name}</h4>
                      <p className="text-[10px] text-gray-400 font-bold uppercase">Quantity: {item.quantity}</p>
                    </div>
                    <span className="text-sm font-black text-gray-900">₹{(parseFloat(item.product.price) * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-100 pt-6 space-y-3">
                <div className="flex justify-between text-[10px] font-bold text-gray-400 uppercase tracking-widest"><span>Subtotal</span><span className="text-gray-900 font-black">₹{subtotal.toLocaleString()}</span></div>
                <div className="flex justify-between text-[10px] font-bold text-gray-400 uppercase tracking-widest"><span>GST (18%)</span><span className="text-gray-900 font-black">₹{taxAmount.toLocaleString()}</span></div>
                <div className="flex justify-between items-center pt-6 mt-2 border-t border-gray-100">
                  <span className="text-xs font-black text-gray-900 uppercase">Total Amount</span>
                  <span className="text-3xl font-black text-red-600 tracking-tighter">₹{total.toLocaleString()}</span>
                </div>
              </div>
              <div className="space-y-3 pt-2">
                <button onClick={() => handleOrder('ONLINE')} disabled={loading || items.length === 0}
                  className="w-full py-5 bg-gray-900 text-white rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-black transition-all shadow-xl shadow-gray-200 disabled:opacity-50 disabled:cursor-not-allowed group">
                  {loading ? <Loader2 className="animate-spin" size={20} /> : <><CreditCard size={18} /> Pay Online</>}
                </button>
                <button onClick={() => handleOrder('COD')} disabled={loading || items.length === 0}
                  className="w-full py-5 border-2 border-gray-100 text-gray-900 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-gray-50 hover:border-gray-900 transition-all disabled:opacity-50">
                  <Wallet size={18} /> Cash on Delivery
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
