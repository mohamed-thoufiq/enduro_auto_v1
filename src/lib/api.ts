// src/lib/api.ts

// --- MOCK STORAGE ENGINES ---
// Persists modifications across browser refreshes so your mockup admin features work dynamically!
const getStored = <T>(key: string, fallback: T): T => {
  const item = localStorage.getItem(key);
  return item ? JSON.parse(item) : fallback;
};

const setStored = <T>(key: string, data: T): void => {
  localStorage.setItem(key, JSON.stringify(data));
};

// --- CORE TYPINGS ---
export interface AdminUser  { id: number; email: string; name: string; role: string }
export interface Make       { id: number; name: string; models: Model[] }
export interface Model      { id: number; name: string; makeId: number; make?: Make }
export interface YearRange  { id: number; yearFrom: number; yearTo: number }
export interface Fitment    { id: number; model: Model & { make: Make }; yearRange: YearRange; notes?: string }
export interface FitmentInput { make: string; model: string; yearFrom: string; yearTo: string; notes?: string }
export interface Product {
  id: number; sku: string; oemNumber?: string; name: string; description?: string
  price: string; stockStatus: 'IN_STOCK'|'OUT_OF_STOCK'|'BACKORDER'
  status: 'ON'|'OFF'; imageUrls: string[]; features: string[]; manualOverride: boolean
  createdAt: string; updatedAt: string; fitments: Fitment[]
}
export interface Brand      { id: number; name: string; logoUrl: string; websiteUrl?: string; sortOrder: number; isActive: boolean }
export interface Customer   { id: number; name: string; email: string; phone: string; shippingAddress: Address }
export interface Address    { line1: string; line2?: string; city: string; state: string; pincode: string; country?: string }
export interface OrderItem  { id: number; skuSnapshot: string; quantity: number; priceAtPurchase: string; product?: Pick<Product,'name'|'sku'|'imageUrls'> }
export interface Order {
  id: number; orderId: string; customer: Customer; items: OrderItem[]
  totalPrice: string; taxAmount: string; orderStatus: string; paymentStatus: string
  transactionId?: string; paymentMethod?: string; shippingAddress: Address
  notes?: string; createdAt: string; updatedAt: string
}
export interface OrderStats { totalOrders: number; pendingOrders: number; confirmedOrders: number; totalRevenue: string }
export interface PaginatedResponse<T> { data: T[]; meta: { total: number; page: number; limit: number; pages: number } }
export interface CreateOrderInput  { customerData: { name: string; email: string; phone: string; shippingAddress: Address }; items: { sku: string; quantity: number }[]; paymentMethod?: string }
export interface RazorpayOrderResponse { orderId: string; rzpOrderId: string; amount: number; currency: string; key: string; prefill: any }
export interface VerifyPaymentInput { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string; internalOrderId: number }

// --- MOCK INITIAL SEED DATA ---
const INITIAL_PRODUCTS: Product[] = [
  {
    id: 101,
    sku: "BRK-CER-992",
    oemNumber: "OEM-45012-XYZ",
    name: "Premium Ceramic Brake Pads Set",
    description: "Ultra-low dust ceramic formulation providing superior stopping power for performance vehicles.",
    price: "4500.00",
    stockStatus: "IN_STOCK",
    status: "ON",
    imageUrls: ["https://brakeperformance.com/_next/image?url=https%3A%2F%2Fbrakeperformance.com%2Fapi%2Fadmin%2Fbase_product_images%2F33%2Ffile%2F1763669735%3Fimage%3D1&w=1080&q=75"],
    features: ["Quiet braking", "Low dust", "High heat tolerance"],
    manualOverride: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    fitments: []
  },
  {
    id: 102,
    sku: "OIL-5W40-SYN",
    oemNumber: "OEM-77891-ABC",
    name: "Full Synthetic Engine Oil 5W-40",
    description: "Advanced wear protection technology optimized for modern high-performance turbocharged engines.",
    price: "3200.00",
    stockStatus: "IN_STOCK",
    status: "ON",
    imageUrls: ["https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?q=80&w=400"],
    features: ["10,000-mile defense", "Sludge control protection", "Cold start fluidity"],
    manualOverride: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    fitments: []
  }
];

const INITIAL_BRANDS: Brand[] = [
  { id: 1, name: "Brembo", logoUrl: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?q=80&w=150", sortOrder: 1, isActive: true },
  { id: 2, name: "Castrol", logoUrl: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?q=80&w=150", sortOrder: 2, isActive: true }
];

const INITIAL_ORDERS: Order[] = [
  {
    id: 8831,
    orderId: "ENDURO-2026-001",
    customer: {
      id: 501,
      name: "Mohamed Thoufiq",
      email: "thoufiq@example.com",
      phone: "+91 98765 43210",
      shippingAddress: { line1: "123 Main St", city: "Chennai", state: "Tamil Nadu", pincode: "600001", country: "India" }
    },
    items: [
      {
        id: 1,
        skuSnapshot: "BRK-CER-992",
        quantity: 1,
        priceAtPurchase: "4500.00",
        product: { name: "Premium Ceramic Brake Pads Set", sku: "BRK-CER-992", imageUrls: ["https://images.unsplash.com/photo-1486006920555-c77dce18193b?q=80&w=400"] }
      }
    ],
    totalPrice: "4500.00",
    taxAmount: "810.00",
    orderStatus: "PENDING",
    paymentStatus: "PAID",
    shippingAddress: { line1: "123 Main St", city: "Chennai", state: "Tamil Nadu", pincode: "600001", country: "India" },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// --- SIMULATED CLIENT UTILITY LAYER ---
const delay = (ms = 300) => new Promise(res => setTimeout(res, ms));

function log(method: string, url: string, data: unknown) {
  if (import.meta.env.MODE !== 'development') return;
  if (typeof window !== 'undefined' && (window as any).__debug) {
    ;(window as any).__debug.log({
      type: 'api',
      label: `[MOCK] ${method} ${url} → Success`,
      duration: 15,
      payload: data,
    });
  }
}

// --- FAKE API EXPORTS ---

export const authApi = {
  login: async (email: string, password: string) => {
    await delay(500);
    const mockUser: AdminUser = { id: 1, email, name: "Thoufiq (Admin)", role: "admin" };
    localStorage.setItem('admin_token', 'mock_frontend_jwt_token');
    log('POST', '/auth/login', { token: 'mock_frontend_jwt_token', admin: mockUser });
    return { token: 'mock_frontend_jwt_token', admin: mockUser };
  },
  me: async () => {
    await delay(100);
    const token = localStorage.getItem('admin_token');
    if (!token) throw new Error("Unauthorized mock context");
    const mockUser: AdminUser = { id: 1, email: "admin@enduro.com", name: "Thoufiq (Admin)", role: "admin" };
    return mockUser;
  },
  changePassword: async (currentPassword: string, newPassword: string) => {
    await delay(300);
    return { success: true };
  }
};

export const productsApi = {
  list: async (params?: Record<string, string | number>) => {
    await delay(300);
    const products = getStored<Product[]>('mock_products', INITIAL_PRODUCTS);
    const result: PaginatedResponse<Product> = {
      data: products,
      meta: { total: products.length, page: 1, limit: 10, pages: 1 }
    };
    log('GET', '/products', result);
    return result;
  },
  get: async (id: number) => {
    await delay(150);
    const products = getStored<Product[]>('mock_products', INITIAL_PRODUCTS);
    const prod = products.find(p => p.id === Number(id));
    if (!prod) throw new Error("Product not found");
    return prod;
  },
  getBySku: async (sku: string) => {
    await delay(150);
    const products = getStored<Product[]>('mock_products', INITIAL_PRODUCTS);
    const prod = products.find(p => p.sku === sku);
    if (!prod) throw new Error("Product not found");
    return prod;
  },
  create: async (data: Partial<Product>) => {
    await delay(400);
    const products = getStored<Product[]>('mock_products', INITIAL_PRODUCTS);
    const newProd: Product = {
      id: Date.now(),
      sku: data.sku || `SKU-${Date.now()}`,
      oemNumber: data.oemNumber || '',
      name: data.name || 'Unnamed Mock Product',
      description: data.description || '',
      price: data.price || '0.00',
      stockStatus: data.stockStatus || 'IN_STOCK',
      status: data.status || 'ON',
      imageUrls: data.imageUrls || ["https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=400"],
      features: data.features || [],
      manualOverride: data.manualOverride || false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      fitments: []
    };
    products.push(newProd);
    setStored('mock_products', products);
    return newProd;
  },
  update: async (id: number, data: Partial<Product>) => {
    await delay(400);
    const products = getStored<Product[]>('mock_products', INITIAL_PRODUCTS);
    const index = products.findIndex(p => p.id === Number(id));
    if (index === -1) throw new Error("Product not found");
    
    products[index] = { ...products[index], ...data, updatedAt: new Date().toISOString() };
    setStored('mock_products', products);
    return { data: products[index] };
  },
  delete: async (id: number) => {
    await delay(300);
    let products = getStored<Product[]>('mock_products', INITIAL_PRODUCTS);
    products = products.filter(p => p.id !== Number(id));
    setStored('mock_products', products);
    return { success: true };
  },
  addFitment: async (id: number, data: FitmentInput) => {
    await delay(200);
    const products = getStored<Product[]>('mock_products', INITIAL_PRODUCTS);
    const index = products.findIndex(p => p.id === Number(id));
    if (index === -1) throw new Error("Product not found");
    
    const newFitment: Fitment = {
      id: Date.now(),
      model: { id: Date.now(), name: data.model, makeId: 1, make: { id: 1, name: data.make, models: [] } },
      yearRange: { id: Date.now(), yearFrom: Number(data.yearFrom), yearTo: Number(data.yearTo) },
      notes: data.notes
    };
    products[index].fitments.push(newFitment);
    setStored('mock_products', products);
    return newFitment;
  },
  deleteFitment: async (id: number, fitmentId: number) => {
    await delay(200);
    const products = getStored<Product[]>('mock_products', INITIAL_PRODUCTS);
    const index = products.findIndex(p => p.id === Number(id));
    if (index !== -1) {
      products[index].fitments = products[index].fitments.filter(f => f.id !== fitmentId);
      setStored('mock_products', products);
    }
    return { success: true };
  },
  getCatalogMakes: async () => [{ id: 1, name: "Maruti Suzuki", models: [] }, { id: 2, name: "Hyundai", models: [] }],
  getCatalogYears: async () => [2022, 2023, 2024, 2025, 2026]
};

export const ordersApi = {
  list: async (params?: Record<string, string>) => {
    await delay(300);
    const orders = getStored<Order[]>('mock_orders', INITIAL_ORDERS);
    return {
      data: orders,
      meta: { total: orders.length, page: 1, limit: 10, pages: 1 }
    };
  },
  get: async (id: number) => {
    await delay(150);
    const orders = getStored<Order[]>('mock_orders', INITIAL_ORDERS);
    const order = orders.find(o => o.id === Number(id));
    if (!order) throw new Error("Order not found");
    return order;
  },
  update: async (id: number, data: Partial<Order>) => {
    await delay(300);
    const orders = getStored<Order[]>('mock_orders', INITIAL_ORDERS);
    const index = orders.findIndex(o => o.id === Number(id));
    if (index === -1) throw new Error("Order not found");
    orders[index] = { ...orders[index], ...data, updatedAt: new Date().toISOString() };
    setStored('mock_orders', orders);
    return orders[index];
  },
  stats: async () => {
    await delay(200);
    const orders = getStored<Order[]>('mock_orders', INITIAL_ORDERS);
    return {
      totalOrders: orders.length,
      pendingOrders: orders.filter(o => o.orderStatus === 'PENDING').length,
      confirmedOrders: orders.filter(o => o.orderStatus === 'CONFIRMED' || o.orderStatus === 'DELIVERED').length,
      totalRevenue: orders.reduce((sum, o) => sum + parseFloat(o.totalPrice), 0).toFixed(2)
    };
  },
  invoiceUrl: (id: number) => `https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf`
};

export const paymentsApi = {
  createOrder: async (data: CreateOrderInput) => {
    await delay(400);
    return {
      orderId: `MOCK_INT_ORD_${Date.now()}`,
      rzpOrderId: `rzp_live_${Date.now()}`,
      amount: parseFloat(data.items.length ? '450000' : '0'),
      currency: "INR",
      key: "rzp_test_mockKey",
      prefill: { name: data.customerData.name }
    };
  },
  verify: async (data: VerifyPaymentInput) => {
    await delay(300);
    // Push checkout data directly into local storage mock state to make testing natural
    const orders = getStored<Order[]>('mock_orders', INITIAL_ORDERS);
    const newOrder: Order = {
      id: data.internalOrderId || Date.now(),
      orderId: `ENDURO-2026-${Date.now().toString().slice(-4)}`,
      customer: { id: Date.now(), name: "Guest Checkout", email: "guest@enduro.com", phone: "9999999999", shippingAddress: { line1: "Mock Street Address", city: "Chennai", state: "Tamil Nadu", pincode: "600001" } },
      items: [],
      totalPrice: "4500.00",
      taxAmount: "0.00",
      orderStatus: "PENDING",
      paymentStatus: "PAID",
      transactionId: data.razorpay_payment_id,
      paymentMethod: "Razorpay (Mocked)",
      shippingAddress: { line1: "Mock Street Address", city: "Chennai", state: "Tamil Nadu", pincode: "600001" },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    orders.push(newOrder);
    setStored('mock_orders', orders);
    return { success: true, orderId: newOrder.orderId };
  }
};

export const brandsApi = {
  list: async (includeInactive = false) => {
    await delay(200);
    const brands = getStored<Brand[]>('mock_brands', INITIAL_BRANDS);
    return includeInactive ? brands : brands.filter(b => b.isActive);
  },
  create: async (formData: FormData) => {
    await delay(400);
    const brands = getStored<Brand[]>('mock_brands', INITIAL_BRANDS);
    const name = (formData.get('name') as string) || 'New Brand';
    const newBrand: Brand = {
      id: Date.now(),
      name,
      logoUrl: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?q=80&w=150",
      sortOrder: brands.length + 1,
      isActive: true
    };
    brands.push(newBrand);
    setStored('mock_brands', brands);
    return newBrand;
  },
  update: async (id: number, formData: FormData) => {
    await delay(400);
    const brands = getStored<Brand[]>('mock_brands', INITIAL_BRANDS);
    const index = brands.findIndex(b => b.id === Number(id));
    if (index === -1) throw new Error("Brand not found");
    if (formData.has('name')) brands[index].name = formData.get('name') as string;
    setStored('mock_brands', brands);
    return brands[index];
  },
  delete: async (id: number) => {
    await delay(200);
    let brands = getStored<Brand[]>('mock_brands', INITIAL_BRANDS);
    brands = brands.filter(b => b.id !== Number(id));
    setStored('mock_brands', brands);
    return { success: true };
  }
};

export const importApi = {
  excel: async (formData: FormData) => {
    await delay(1000);
    return { success: true, message: "Mock excel records parsed into memory." };
  },
  images: async (formData: FormData) => {
    await delay(1000);
    return { success: true, message: "Mock product images unpacked successfully." };
  },
  templateUrl: () => `https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf`
};