
export type PlanType = 'Free' | 'Basic' | 'Pro';

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
  imageUrl: string;
  isAvailable: boolean;
  stock?: number;
  variations?: ProductVariation[];
  rating?: number;
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
  }
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
    imageUrl: 'https://picsum.photos/seed/burger1/400/300',
    isAvailable: true,
    stock: 5,
    rating: 4.8,
    variations: [
      { id: 'v1', name: 'Combo Médio', price: 45.90 },
      { id: 'v2', name: 'Combo Grande', price: 55.90 }
    ]
  },
  {
    id: 'p2',
    merchantId: 'm1',
    categoryId: 'c2',
    name: 'Coca-Cola 2L',
    description: 'Gelada e refrescante.',
    price: 12.00,
    imageUrl: 'https://picsum.photos/seed/coke/400/300',
    isAvailable: true,
    stock: 50,
    rating: 5.0
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
  }
];

export const MOCK_COUPONS: Coupon[] = [
  { id: 'cp1', code: 'PRIMEIRACOMPRA', discount: 10, type: 'percent' },
  { id: 'cp2', code: 'DEZOFF', discount: 10, type: 'fixed' }
];
