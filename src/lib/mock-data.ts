
export type PlanType = 'Free' | 'Pro' | 'Pro II';
export type UserRole = 'SUPER_ADMIN' | 'MERCHANT_ADMIN' | 'MERCHANT_STAFF';

export interface PlatformUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  merchantId?: string;
  isActive: boolean;
}

export interface Plan {
  id: string;
  name: PlanType;
  price: number;
  durationDays?: number;
  features: string[];
}

export interface Merchant {
  id: string;
  name: string;
  slug: string;
  logoUrl: string;
  bannerUrl: string;
  planId: string;
  planName: PlanType;
  status: 'active' | 'blocked' | 'expired';
  createdAt: string;
  mrr: number;
  franchiseGroup?: string;
  platformUserId: string;
}

export const SYSTEM_PLANS: Plan[] = [
  { 
    id: 'p_free', 
    name: 'Free', 
    price: 0, 
    durationDays: 30, 
    features: ['Vitrine Web', 'Até 20 produtos', 'Gestão de Pedidos'] 
  },
  { 
    id: 'p_pro', 
    name: 'Pro', 
    price: 150, 
    features: ['Tudo do Free', 'Produtos Ilimitados', 'IA Gerativa', 'Suporte WhatsApp', 'Desktop App'] 
  },
  { 
    id: 'p_pro2', 
    name: 'Pro II', 
    price: 300, 
    features: ['Tudo do Pro', 'Multi-unidades', 'Analytics Avançado', 'Custom Domain', 'Consultoria IA'] 
  }
];

export const MOCK_MERCHANTS: Merchant[] = [
  {
    id: 'm1',
    name: 'Burger King do Zé',
    slug: 'burger-ze',
    logoUrl: 'https://picsum.photos/seed/logo1/200/200',
    bannerUrl: 'https://picsum.photos/seed/banner1/1200/400',
    planId: 'p_pro',
    planName: 'Pro',
    status: 'active',
    createdAt: '2024-01-01',
    mrr: 150.00,
    franchiseGroup: 'Rede Burger',
    platformUserId: 'u1'
  },
  {
    id: 'm2',
    name: 'Pizza Express',
    slug: 'pizza-express',
    logoUrl: 'https://picsum.photos/seed/logo2/200/200',
    bannerUrl: 'https://picsum.photos/seed/banner2/1200/400',
    planId: 'p_free',
    planName: 'Free',
    status: 'active',
    createdAt: new Date().toISOString(),
    mrr: 0,
    franchiseGroup: 'Italian Foods',
    platformUserId: 'u2'
  }
];

export interface StaffMember {
  id: string;
  name: string;
  role: string;
  email: string;
  avatar: string;
  performanceScore: number;
  ordersHandled: number;
}

export const MOCK_STAFF: StaffMember[] = [
  { id: 's1', name: 'Ricardo Chef', role: 'Chef', email: 'ricardo@burger.com', avatar: 'https://i.pravatar.cc/150?u=s1', performanceScore: 98, ordersHandled: 450 },
  { id: 's2', name: 'Ana Gerente', role: 'Manager', email: 'ana@burger.com', avatar: 'https://i.pravatar.cc/150?u=s2', performanceScore: 95, ordersHandled: 1200 },
  { id: 's3', name: 'Lucas Garçom', role: 'Waiter', email: 'lucas@burger.com', avatar: 'https://i.pravatar.cc/150?u=s3', performanceScore: 88, ordersHandled: 310 },
];

export const MOCK_AUDIT_LOGS = [
  { id: 'l1', user: 'Ana Gerente', action: 'Alteração de Preço', timestamp: '2024-03-20 14:30', details: 'X-Tudo Monstro de R$ 32,90 para R$ 35,90' },
  { id: 'l2', user: 'Ricardo Chef', action: 'Item Indisponível', timestamp: '2024-03-20 12:15', details: 'Coca-Cola 2L marcada como fora de estoque' },
];

export const MOCK_CATEGORIES = [
  { id: 'c1', merchantId: 'm1', name: 'Hambúrgueres' },
  { id: 'c2', merchantId: 'm1', name: 'Bebidas' },
];

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
  isLoyaltyExclusive?: boolean;
  requiredTier?: 'Bronze' | 'Silver' | 'Gold';
  stockForecastDays?: number;
}

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
    stockForecastDays: 2
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
    stockForecastDays: 12
  },
  {
    id: 'p4',
    merchantId: 'm1',
    categoryId: 'c1',
    name: 'Burguer Ouro 24k',
    description: 'Edição limitada para clientes VIP. Folha de ouro comestível e trufas negras.',
    price: 149.90,
    costPrice: 85.00,
    imageUrl: 'https://picsum.photos/seed/goldburger/400/300',
    isAvailable: true,
    isLoyaltyExclusive: true,
    requiredTier: 'Gold'
  }
];

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
  items: { id: string; productId: string; productName: string; quantity: number; price: number; }[];
}

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

export const MOCK_COUPONS = [
  { id: 'cp1', code: 'PRIMEIRACOMPRA', discount: 10, type: 'percent' },
  { id: 'cp2', code: 'DEZOFF', discount: 10, type: 'fixed' }
];
