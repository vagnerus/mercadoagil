
export type PlanType = 'Free' | 'Pro' | 'Pro II';
export type UserRole = 'SUPER_ADMIN' | 'MERCHANT_ADMIN' | 'MERCHANT_STAFF';
export type MerchantSegment = 'RESTAURANT' | 'RETAIL' | 'SERVICE' | 'GROCERY' | 'PHARMACY';

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
  segment: MerchantSegment;
  logoUrl: string;
  bannerUrl: string;
  planId: string;
  planName: PlanType;
  status: 'active' | 'blocked' | 'expired';
  createdAt: string;
  mrr: number;
  franchiseGroup?: string;
  platformUserId: string;
  settings?: {
    currency: string;
    language: string;
    enableWallet: boolean;
    enableCashback: boolean;
    cashbackPercentage: number;
  }
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
    segment: 'RESTAURANT',
    logoUrl: 'https://picsum.photos/seed/logo1/200/200',
    bannerUrl: 'https://picsum.photos/seed/banner1/1200/400',
    planId: 'p_pro',
    planName: 'Pro',
    status: 'active',
    createdAt: '2024-01-01',
    mrr: 150.00,
    franchiseGroup: 'Rede Burger',
    platformUserId: 'u1',
    settings: {
      currency: 'BRL',
      language: 'pt-BR',
      enableWallet: true,
      enableCashback: true,
      cashbackPercentage: 5
    }
  }
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
  minStock?: number;
  isLoyaltyExclusive?: boolean;
  requiredTier?: 'Bronze' | 'Silver' | 'Gold';
  stockForecastDays?: number;
  variations?: { name: string; options: string[] }[];
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
    minStock: 10,
    stockForecastDays: 2,
    variations: [{ name: 'Ponto da Carne', options: ['Mal passado', 'Ao ponto', 'Bem passado'] }]
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

export const MOCK_COUPONS = [
  { id: 'cp1', code: 'PRIMEIRACOMPRA', discount: 10, type: 'percent', usageCount: 45, expiresAt: '2024-12-31' },
  { id: 'cp2', code: 'HAPPYHOUR', discount: 5, type: 'fixed', usageCount: 12, expiresAt: '2024-06-30' }
];

export const MOCK_STAFF = [
  { id: 's1', name: 'Ricardo Chef', role: 'Chef', avatar: 'https://i.pravatar.cc/150?u=s1', performanceScore: 98, ordersHandled: 450 },
  { id: 's2', name: 'Ana Gerente', role: 'Manager', avatar: 'https://i.pravatar.cc/150?u=s2', performanceScore: 95, ordersHandled: 1200 },
];

export const MOCK_AUDIT_LOGS = [
  { id: 'l1', user: 'Ana Gerente', action: 'Alteração de Preço', timestamp: '2024-03-20 14:30', details: 'X-Tudo Monstro de R$ 32,90 para R$ 35,90' },
];

export const MOCK_CATEGORIES = [
  { id: 'c1', merchantId: 'm1', name: 'Hambúrgueres' },
  { id: 'c2', merchantId: 'm1', name: 'Bebidas' },
];
