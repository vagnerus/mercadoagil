
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
  merchantSlug?: string;
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
    appointmentInterval: number;
    whatsapp?: string;
    enableAutoNotify?: boolean;
  }
}

export const SYSTEM_PLANS: Plan[] = [
  { id: 'p_free', name: 'Free', price: 0, durationDays: 30, features: ['Vitrine Web', 'Até 20 produtos'] },
  { id: 'p_pro', name: 'Pro', price: 150, features: ['IA Gerativa', 'Produtos Ilimitados', 'App Mobile'] },
  { id: 'p_pro2', name: 'Pro II', price: 300, features: ['Multi-unidades', 'Custom Domain', 'Consultoria IA'] }
];

export const MOCK_MERCHANTS: Merchant[] = [];
export const MOCK_SERVICES: any[] = [];
export const MOCK_PRODUCTS: any[] = [];
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

// Biblioteca de 500 Cursos para o AVA (R$ 25 cada)
const generateCourses = () => {
  const categories = ["Varejo", "Beleza", "Gestão", "Marketing", "Saúde", "Tecnologia"];
  const courses = [];
  
  for (let i = 1; i <= 500; i++) {
    const cat = categories[Math.floor(Math.random() * categories.length)];
    courses.push({
      id: `c${i}`,
      title: `Curso Especialista ${i}: ${getCourseTopic(i)}`,
      description: `Domine as técnicas avançadas de ${getCourseTopic(i)} com este treinamento intensivo focado em resultados reais para o seu negócio no Mercado Ágil.`,
      category: cat,
      duration: `${Math.floor(Math.random() * 30) + 10}h`,
      lessons: Math.floor(Math.random() * 20) + 10,
      rating: (Math.random() * (5 - 4.2) + 4.2).toFixed(1),
      price: 25.00,
      thumb: `https://picsum.photos/seed/course${i}/400/250`,
      syllabus: [
        "Introdução e Mentalidade",
        "Ferramentas e Processos",
        "Estratégias Avançadas",
        "Estudo de Caso Real",
        "Certificação e Próximos Passos"
      ]
    });
  }
  return courses;
};

const getCourseTopic = (i: number) => {
  const topics = [
    "Vendas de Alto Impacto", "Design de Experiência", "Gestão de Crises", "Marketing no TikTok", 
    "Liderança Ágil", "Análise de Dados Pro", "Atendimento VIP", "Finanças para MEI",
    "Estética Avançada", "Corte Europeu", "Colorimetria Real", "Manicure Russa",
    "Google Ads Local", "Copywriting IA", "SEO para Lojas", "Instagram para Negócios",
    "Primeiros Socorros", "Nutrição Clínica", "Gestão Hospitalar", "Ética na Saúde",
    "JavaScript Moderno", "React do Zero", "Cloud Computing", "Segurança Digital",
    "Roteirização de Entregas", "Controle de Estoque", "Curva ABC na Prática", "Fidelização 2.0",
    "Escala de Franquias", "Processos Operacionais", "Venda Consultiva", "Psicologia do Consumidor"
  ];
  return topics[i % topics.length];
};

export const COURSE_LIBRARY = generateCourses();
