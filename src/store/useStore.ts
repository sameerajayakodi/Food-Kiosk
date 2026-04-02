import { create } from 'zustand';
import { mockProducts } from '../data/mockProducts';
import type { CartItem, Employee, Order, OrderStatus, Product } from '../types';
import { generateOrderId } from '../utils/helpers';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface AppStore {
  // Products
  products: Product[];
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;

  // Employees
  employees: Employee[];
  addEmployee: (employee: Omit<Employee, 'id'>) => void;
  updateEmployee: (id: string, updates: Partial<Employee>) => void;
  deleteEmployee: (id: string) => void;
  topUpEmployeePoints: (id: string, amount: number) => void;

  // Cart (for POS)
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;

  // Orders
  orders: Order[];
  placeOrder: () => Order | null;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  markOrderPaid: (orderId: string) => void;
  getOrderById: (orderId: string) => Order | undefined;
  getOrdersByDate: (date: string) => Order[];
  getDailySalesTotal: (date: string) => number;

  // Toast notifications
  toasts: Toast[];
  addToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
}

const mockEmployees: Employee[] = [
  {
    id: 'emp-001',
    name: 'Kasun Perera',
    email: 'kasun@restaurant.com',
    phone: '555-0101',
    position: 'Manager',
    joinDate: '2023-01-15',
    salary: 50000,
    points: 1200,
    active: true,
  },
  {
    id: 'emp-002',
    name: 'Nisansala Fernando',
    email: 'nisansala@restaurant.com',
    phone: '555-0102',
    position: 'Cook',
    joinDate: '2023-02-20',
    salary: 45000,
    points: 850,
    active: true,
  },
  {
    id: 'emp-003',
    name: 'Dinesh Silva',
    email: 'dinesh@restaurant.com',
    phone: '555-0103',
    position: 'Cashier',
    joinDate: '2023-03-10',
    salary: 28000,
    points: 2500,
    active: true,
  },
  {
    id: 'emp-004',
    name: 'Tharuka Senanayake',
    email: 'tharuka@restaurant.com',
    phone: '555-0104',
    position: 'Cook',
    joinDate: '2023-04-05',
    salary: 32000,
    points: 0,
    active: true,
  },
];

export const useStore = create<AppStore>((set, get) => ({
  // Products
  products: [...mockProducts],

  addProduct: (product) => {
    const id = `prod-${Date.now()}`;
    set((state) => ({
      products: [...state.products, { ...product, id }],
    }));
    get().addToast('Product added successfully!', 'success');
  },

  updateProduct: (id, updates) => {
    set((state) => ({
      products: state.products.map((p) =>
        p.id === id ? { ...p, ...updates } : p
      ),
    }));
    get().addToast('Product updated successfully!', 'success');
  },

  deleteProduct: (id) => {
    set((state) => ({
      products: state.products.filter((p) => p.id !== id),
    }));
    get().addToast('Product deleted.', 'info');
  },

  // Employees
  employees: [...mockEmployees],

  addEmployee: (employee) => {
    const id = `emp-${Date.now()}`;
    set((state) => ({
      employees: [...state.employees, { ...employee, id }],
    }));
    get().addToast('Employee added successfully!', 'success');
  },

  updateEmployee: (id, updates) => {
    set((state) => ({
      employees: state.employees.map((e) =>
        e.id === id ? { ...e, ...updates } : e
      ),
    }));
    get().addToast('Employee updated!', 'success');
  },

  deleteEmployee: (id) => {
    set((state) => ({
      employees: state.employees.filter((e) => e.id !== id),
    }));
    get().addToast('Employee deleted.', 'info');
  },

  topUpEmployeePoints: (id, amount) => {
    set((state) => ({
      employees: state.employees.map((e) =>
        e.id === id ? { ...e, points: (e.points || 0) + amount } : e
      ),
    }));
    get().addToast(`Added ${amount} points successfully!`, 'success');
  },

  // Cart
  cart: [],

  addToCart: (product) => {
    set((state) => {
      const existing = state.cart.find((item) => item.product.id === product.id);
      if (existing) {
        return {
          cart: state.cart.map((item) =>
            item.product.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        };
      }
      return { cart: [...state.cart, { product, quantity: 1 }] };
    });
  },

  removeFromCart: (productId) => {
    set((state) => ({
      cart: state.cart.filter((item) => item.product.id !== productId),
    }));
  },

  updateCartQuantity: (productId, quantity) => {
    if (quantity <= 0) {
      get().removeFromCart(productId);
      return;
    }
    set((state) => ({
      cart: state.cart.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      ),
    }));
  },

  clearCart: () => set({ cart: [] }),

  getCartTotal: () => {
    return get().cart.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );
  },

  // Orders
  orders: [],

  placeOrder: () => {
    const { cart, clearCart, addToast } = get();
    if (cart.length === 0) return null;

    const total = cart.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );

    const order: Order = {
      id: generateOrderId(),
      items: cart.map((item) => ({
        product: item.product,
        quantity: item.quantity,
      })),
      total,
      status: 'Pending',
      timestamp: new Date().toISOString(),
      paymentStatus: 'unpaid',
    };

    set((state) => ({ 
      orders: [order, ...state.orders],
    }));
    
    clearCart();
    addToast(`Order ${order.id} placed successfully!`, 'success');
    return order;
  },

  updateOrderStatus: (orderId, status) => {
    set((state) => ({
      orders: state.orders.map((o) =>
        o.id === orderId ? { ...o, status } : o
      ),
    }));
    get().addToast(`Order ${orderId} → ${status}`, 'info');
  },

  markOrderPaid: (orderId) => {
    set((state) => ({
      orders: state.orders.map((o) =>
        o.id === orderId ? { ...o, paymentStatus: 'paid' } : o
      ),
    }));
  },

  getOrderById: (orderId) => {
    return get().orders.find((o) => o.id === orderId);
  },

  getOrdersByDate: (date: string) => {
    return get().orders.filter((o) => o.timestamp.startsWith(date));
  },

  getDailySalesTotal: (date: string) => {
    return get()
      .getOrdersByDate(date)
      .filter((o) => o.paymentStatus === 'paid')
      .reduce((total, o) => total + o.total, 0);
  },

  // Toasts
  toasts: [],

  addToast: (message, type = 'info') => {
    const id = `toast-${Date.now()}`;
    set((state) => ({
      toasts: [...state.toasts, { id, message, type }],
    }));
    setTimeout(() => get().removeToast(id), 4000);
  },

  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    }));
  },
}));
