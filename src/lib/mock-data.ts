
export type PlanType = 'Free' | 'Pro' | 'Pro II' | 'Enterprise' | 'Ultra';
export type UserRole = 'SUPER_ADMIN' | 'MERCHANT_ADMIN' | 'MERCHANT_STAFF';
export type MerchantSegment = 'RESTAURANT' | 'RETAIL' | 'SERVICE' | 'GROCERY' | 'PHARMACY' | 'BEAUTY' | 'HEALTH' | 'AUTO' | 'PET' | 'EDUCATION' | 'MAINTENANCE' | 'FITNESS' | 'EVENTS' | 'PROFESSIONAL';

export interface PlatformUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  merchantId?: string;
  merchantSlug?: string;
  isActive: boolean;
}

export interface Plan {
  id: string;
  name: string;
  price: number;
  durationDays?: number;
  features: string[];
  maxStaff: number;
  billing: 'mensal';
}

export interface Merchant {
  id: string;
  name: string;
  slug: string;
  segment: MerchantSegment;
  logoUrl: string;
  bannerUrl: string;
  planId: string;
  planName: string;
  status: 'active' | 'blocked' | 'expired' | 'pending_approval' | 'rejected';
  createdAt: string;
  mrr: number;
  royaltiesPaid: number;
  franchiseGroup?: string;
  platformUserId: string;
  legal?: {
    razaoSocial: string;
    cnpj: string;
    inscricaoEstadual?: string;
    regimeTributario: string;
  };
  contact?: {
    address: string;
    whatsapp: string;
    email: string;
    instagram?: string;
  };
  operation?: {
    workingHours: string;
    chairs: number;
    delayTolerance: number;
    cancellationPolicy: string;
  };
  financial?: {
    bankAccount: string;
    pixKey: string;
    creditFee: number;
    debitFee: number;
  };
  settings?: {
    currency: string;
    language: string;
    enableWallet: boolean;
    enableCashback: boolean;
    cashbackPercentage: number;
    appointmentInterval: number;
    whatsapp?: string;
    enableAutoNotify?: boolean;
    facebookPixel?: string;
    googleAnalytics?: string;
    primaryColor?: string;
  }
}

export const SYSTEM_PLANS: Plan[] = [
  { id: 'p_free', name: 'Free (Verificado)', price: 0, features: ['Acesso Básico', '1 Profissional', 'Auditoria Master Obrigatória'], maxStaff: 1, billing: 'mensal' },
  { id: 'p_1prof', name: 'Elite 1 Profissional', price: 59.90, features: ['Suporte Standard', 'IA Gerativa', 'Recibos PDF'], maxStaff: 1, billing: 'mensal' },
  { id: 'p_5prof', name: 'Premium 5 Prof.', price: 99.90, features: ['Gestão de Comissões', 'Marketing IA', 'Relatórios Pro'], maxStaff: 5, billing: 'mensal' },
  { id: 'p_15prof', name: 'Enterprise 15 Prof.', price: 189.90, features: ['Multi-unidades', 'Suporte VIP 1h', 'API Privada'], maxStaff: 15, billing: 'mensal' },
  { id: 'p_ultra', name: 'Ultra Ilimitado', price: 299.90, features: ['White Label', 'Consultoria BI', 'Gerente de Conta'], maxStaff: 100, billing: 'mensal' }
];

export const MOCK_MERCHANTS: Merchant[] = [];
export const MOCK_SERVICES = [
  { id: 's1', name: 'Corte Degradê Master', price: 45.00, duration: 30, category: 'Cabelo' },
  { id: 's2', name: 'Barboterapia Elite', price: 35.00, duration: 25, category: 'Barba' },
  { id: 's3', name: 'Corte + Barba Combo', price: 70.00, duration: 50, category: 'Pacotes' },
];
export const MOCK_PRODUCTS: any[] = [
  { id: 'p1', name: 'Pomada Modeladora Matte', price: 45.00, imageUrl: 'https://picsum.photos/seed/wax/200/200', category: 'Finalizadores', stock: 45 },
  { id: 'p2', name: 'Óleo para Barba Premium', price: 35.00, imageUrl: 'https://picsum.photos/seed/oil/200/200', category: 'Cuidados', stock: 20 },
];
export const MOCK_STAFF: any[] = [];

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
  scheduledProfessional?: string;
  items: any[];
}

export interface Service {
  id: string;
  name: string;
  price: number;
  duration: number;
  category: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  category: string;
  stock: number;
}

export const MOCK_COUPONS = [
  { id: 'c1', code: 'BEMVINDO10', discount: 10, type: 'percent' },
  { id: 'c2', code: 'PROMO20', discount: 20, type: 'fixed' },
];

export const COURSE_LIBRARY: any[] = [
  {
    id: 'c1',
    title: 'Mestre da Barboterapia',
    category: 'Beleza',
    thumb: 'https://picsum.photos/seed/course1/800/450',
    lessons: 12,
    duration: '4h 20m',
    rating: 4.9,
    description: 'Aprenda as técnicas mais avançadas de toalha quente, massagem facial e hidratação de barba com ozônio.',
    modules: [
      {
        title: 'Introdução e Teoria',
        lessons: [
          { id: 'l1', title: 'Fundamentos da Barboterapia', duration: '15:00', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4', content: 'A barboterapia é uma técnica que une o barbear tradicional com tratamentos de relaxamento...' }
        ]
      }
    ],
    materials: [
      { title: 'Manual Técnico de Barboterapia v3.2', type: 'PDF', size: '12MB', content: 'Este manual contém todas as diretrizes para a execução perfeita do serviço...' }
    ]
  }
];
