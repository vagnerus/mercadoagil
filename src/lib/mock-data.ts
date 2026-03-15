
export type PlanType = 'Free' | 'Basic' | 'Pro';
export type UserRole = 'Admin' | 'Chef' | 'Waiter' | 'Manager';

export interface StaffMember {
  id: string;
  name: string;
  role: UserRole;
  email: string;
  avatar: string;
}

export interface Merchant {
  id: string;
  name: string;
  slug: string;
  logoUrl: string;
  bannerUrl: string;
  plan: PlanType;
  isOpen: boolean;
  themeColor: string;
  status: 'active' | 'blocked';
  createdAt: string;
  mrr: number; // Monthly Recurring Revenue para o Master Admin
}

export interface Category {
  id: string;
  merchantId: string;
  name: string;
}

export interface ProductVariation {
  id: string;
  name: string;
  price: number;
}

export interface Product {
  id: string;
  merchantId: string;
  categoryId: string;
  name: string;
  description: string;
  price: number;
  costPrice?: number;
  imageUrl: string;
  isAvailable: boolean;
  stock?: number;
  tags?: string[]; // ['Vegano', 'Sem Glúten', 'Pimenta']
  rating?: number;
  salesCount?: number;
}

export type OrderStatus = 'new' | 'preparing' | 'delivering' | 'finished' | 'cancelled';

export interface Order {
  id: string;
  merchantId: string;
  customerName: string;
  customerPhone: string;
  address: string;
  total: number;
  status: OrderStatus;
  createdAt: string;
  items: OrderItem[];
}

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}

export interface Coupon {
  id: string;
  code: string;
  discount: number;
  type: 'fixed' | 'percent';
  expiryDate?: string;
  usageLimit?: number;
  currentUsage?: number;
}

export interface AuditLog {
  id: string;
  user: string;
  action: string;
  timestamp: string;
  details: string;
}

export const MOCK_MERCHANTS: Merchant[] = [
  {
    id: 'm1',
    name: 'Burger King do Zé',
    slug: 'burger-ze',
    logoUrl: 'https://picsum.photos/seed/logo1/200/200',
    bannerUrl: 'https://picsum.photos/seed/banner1/1200/400',
    plan: 'Pro',
    isOpen: true,
    themeColor: '#28A1DB',
    status: 'active',
    createdAt: '2023-10-01',
    mrr: 149.00
  },
  {
    id: 'm2',
    name: 'Pizza Express',
    slug: 'pizza-express',
    logoUrl: 'https://picsum.photos/seed/logo2/200/200',
    bannerUrl: 'https://picsum.photos/seed/banner2/1200/400',
    plan: 'Basic',
    isOpen: true,
    themeColor: '#FF5733',
    status: 'active',
    createdAt: '2023-11-15',
    mrr: 79.00
  }
];

export const MOCK_STAFF: StaffMember[] = [
  { id: 's1', name: 'Ricardo Chef', role: 'Chef', email: 'ricardo@burger.com', avatar: 'https://i.pravatar.cc/150?u=s1' },
  { id: 's2', name: 'Ana Gerente', role: 'Manager', email: 'ana@burger.com', avatar: 'https://i.pravatar.cc/150?u=s2' },
  { id: 's3', name: 'Lucas Garçom', role: 'Waiter', email: 'lucas@burger.com', avatar: 'https://i.pravatar.cc/150?u=s3' },
];

export const MOCK_AUDIT_LOGS: AuditLog[] = [
  { id: 'l1', user: 'Ana Gerente', action: 'Alteração de Preço', timestamp: '2024-03-20 14:30', details: 'X-Tudo Monstro de R$ 32,90 para R$ 35,90' },
  { id: 'l2', user: 'Ricardo Chef', action: 'Item Indisponível', timestamp: '2024-03-20 12:15', details: 'Coca-Cola 2L marcada como fora de estoque' },
];

export const MOCK_CATEGORIES: Category[] = [
  { id: 'c1', merchantId: 'm1', name: 'Hambúrgueres' },
  { id: 'c2', merchantId: 'm1', name: 'Bebidas' },
  { id: 'c3', merchantId: 'm2', name: 'Pizzas Salgadas' },
  { id: 'c4', merchantId: 'm2', name: 'Pizzas Doces' },
];

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'p1',
    merchantId: 'm1',
    categoryId: 'c1',
    name: 'X-Tudo Monstro',
    description: 'Pão, carne de 180g, bacon, ovo, queijo, presunto, alface e tomate.',
    price: 35.90,
    costPrice: 14.50,
    imageUrl: 'https://picsum.photos/seed/burger1/400/300',
    isAvailable: true,
    stock: 5,
    rating: 4.8,
    salesCount: 1240,
    tags: ['Pimenta']
  },
  {
    id: 'p2',
    merchantId: 'm1',
    categoryId: 'c2',
    name: 'Coca-Cola 2L',
    description: 'Gelada e refrescante.',
    price: 12.00,
    costPrice: 6.20,
    imageUrl: 'https://picsum.photos/seed/coke/400/300',
    isAvailable: true,
    stock: 50,
    rating: 5.0,
    salesCount: 3500
  },
  {
    id: 'p3',
    merchantId: 'm1',
    categoryId: 'c1',
    name: 'Smash Ágil',
    description: 'Dois blends prensados, queijo cheddar derretido e molho especial.',
    price: 24.90,
    costPrice: 9.80,
    imageUrl: 'https://picsum.photos/seed/smash/400/300',
    isAvailable: true,
    stock: 12,
    rating: 4.9,
    salesCount: 890,
    tags: ['Vegano']
  }
];

export const MOCK_ORDERS: Order[] = [
  {
    id: 'o1',
    merchantId: 'm1',
    customerName: 'João Silva',
    customerPhone: '(11) 98888-7777',
    address: 'Rua das Flores, 123, São Paulo - SP',
    total: 47.90,
    status: 'new',
    createdAt: new Date().toISOString(),
    items: [
      { id: 'oi1', productId: 'p1', productName: 'X-Tudo Monstro', quantity: 1, price: 35.90 },
      { id: 'oi2', productId: 'p2', productName: 'Coca-Cola 2L', quantity: 1, price: 12.00 }
    ]
  },
  {
    id: 'o2',
    merchantId: 'm1',
    customerName: 'Maria Santos',
    customerPhone: '(11) 97777-6666',
    address: 'Av. Paulista, 1000, São Paulo - SP',
    total: 24.90,
    status: 'preparing',
    createdAt: new Date(Date.now() - 15 * 60000).toISOString(),
    items: [
      { id: 'oi3', productId: 'p3', productName: 'Smash Ágil', quantity: 1, price: 24.90 }
    ]
  }
];

export const MOCK_COUPONS: Coupon[] = [
  { id: 'cp1', code: 'PRIMEIRACOMPRA', discount: 10, type: 'percent', expiryDate: '2025-12-31', usageLimit: 100, currentUsage: 45 },
  { id: 'cp2', code: 'DEZOFF', discount: 10, type: 'fixed', expiryDate: '2025-06-30', usageLimit: 50, currentUsage: 12 }
];
