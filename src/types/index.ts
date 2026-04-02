export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: Category;
  image: string;
  available: boolean;
  popular: boolean;
}

export type Category = 'Breakfast' | 'Lunch' | 'Dinner' | 'Side Dishes';

export type OrderStatus = 'Pending' | 'Preparing' | 'Ready' | 'Completed';

export interface OrderItem {
  product: Product;
  quantity: number;
}

export interface Employee {
  id: string;
  name: string;
  email: string;
  phone: string;
  position: 'Manager' | 'Cashier' | 'Cook' | 'Delivery';
  joinDate: string;
  salary: number;
  points: number;
  active: boolean;
}

export interface DailySalesReport {
  date: string;
  totalOrders: number;
  totalSales: number;
  topProduct: string;
  averageOrderValue: number;
}

export interface Order {
  id: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  timestamp: string;
  paymentStatus: 'unpaid' | 'paid';
}

export interface CartItem {
  product: Product;
  quantity: number;
}
