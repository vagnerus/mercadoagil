
export type PlanType = 'Free' | 'Pro' | 'Pro II';
export type UserRole = 'SUPER_ADMIN' | 'MERCHANT_ADMIN' | 'MERCHANT_STAFF';
export type MerchantSegment = 'RESTAURANT' | 'RETAIL' | 'SERVICE' | 'GROCERY' | 'PHARMACY' | 'BEAUTY' | 'HEALTH' | 'AUTO' | 'PET' | 'EDUCATION' | 'MAINTENANCE';

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
  royaltiesPaid: number;
  franchiseGroup?: string;
  platformUserId: string;
  settings?: {
    currency: string;
    language: string;
    enableWallet: boolean;
    enableCashback: boolean;
    cashbackPercentage: number;
    appointmentInterval: number; // minutes
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
    name: 'Barbearia do Zé',
    slug: 'barbearia-ze',
    segment: 'BEAUTY',
    logoUrl: 'https://picsum.photos/seed/barber/200/200',
    bannerUrl: 'https://picsum.photos/seed/barber-banner/1200/400',
    planId: 'p_pro',
    planName: 'Pro',
    status: 'active',
    createdAt: '2024-01-01',
    mrr: 150.00,
    royaltiesPaid: 1240.50,
    franchiseGroup: 'Rede Classic',
    platformUserId: 'u1',
    settings: {
      currency: 'BRL',
      language: 'pt-BR',
      enableWallet: true,
      enableCashback: true,
      cashbackPercentage: 5,
      appointmentInterval: 30
    }
  },
  {
    id: 'm2',
    name: 'Moda Carioca',
    slug: 'moda-carioca',
    segment: 'RETAIL',
    logoUrl: 'https://picsum.photos/seed/fashion/200/200',
    bannerUrl: 'https://picsum.photos/seed/fashion-banner/1200/400',
    planId: 'p_pro2',
    planName: 'Pro II',
    status: 'active',
    createdAt: '2024-02-15',
    mrr: 300.00,
    royaltiesPaid: 850.00,
    franchiseGroup: 'Independente',
    platformUserId: 'u2'
  }
];

export interface Service {
  id: string;
  merchantId: string;
  name: string;
  description: string;
  duration: number; // minutes
  price: number;
  commission: number; // percentage
  categoryId: string;
  imageUrl?: string;
}

export const MOCK_SERVICES: Service[] = [
  { id: 's1', merchantId: 'm1', name: 'Corte Degradê', description: 'Corte moderno com acabamento na navalha.', duration: 45, price: 45.00, commission: 40, categoryId: 'cat1' },
  { id: 's2', merchantId: 'm1', name: 'Barba Terapia', description: 'Toalha quente e massagem facial.', duration: 30, price: 35.00, commission: 40, categoryId: 'cat1' },
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
    name: 'Pomada Modeladora',
    description: 'Efeito matte de longa duração.',
    price: 35.90,
    costPrice: 14.50,
    imageUrl: 'https://picsum.photos/seed/wax/400/300',
    isAvailable: true,
    stock: 15,
    minStock: 5
  }
];

export type OrderStatus = 'new' | 'preparing' | 'delivering' | 'finished' | 'cancelled' | 'scheduled';

export interface Order {
  id: string;
  merchantId: string;
  customerName: string;
  customerPhone: string;
  address?: string;
  total: number;
  status: OrderStatus;
  createdAt: string;
  orderType: 'delivery' | 'pickup' | 'appointment';
  scheduledTime?: string;
  items: { id: string; productId?: string; serviceId?: string; productName: string; quantity: number; price: number; }[];
}

export const MOCK_STAFF = [
  { id: 'st1', name: 'Ricardo Barber', role: 'Master Barber', avatar: 'https://i.pravatar.cc/150?u=st1', performanceScore: 98, ordersHandled: 450 },
  { id: 'st2', name: 'Ana Estética', role: 'Esteticista', avatar: 'https://i.pravatar.cc/150?u=st2', performanceScore: 95, ordersHandled: 1200 },
];

export const MOCK_CATEGORIES = [
  { id: 'cat1', merchantId: 'm1', name: 'Cabelo & Barba' },
];
