
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

// Biblioteca de 50 Cursos para o AVA
export const COURSE_LIBRARY = [
  // VAREJO & VENDAS
  { id: 'c1', title: "Técnicas de Fechamento de Vendas", category: "Varejo", duration: "12h", lessons: 8, rating: 4.9, thumb: "https://picsum.photos/seed/v1/400/250" },
  { id: 'c2', title: "Gestão de Estoque Avançada", category: "Varejo", duration: "20h", lessons: 15, rating: 4.8, thumb: "https://picsum.photos/seed/v2/400/250" },
  { id: 'c3', title: "Visual Merchandising Pro", category: "Varejo", duration: "8h", lessons: 6, rating: 4.7, thumb: "https://picsum.photos/seed/v3/400/250" },
  { id: 'c4', title: "Psicologia do Consumidor", category: "Varejo", duration: "15h", lessons: 10, rating: 4.9, thumb: "https://picsum.photos/seed/v4/400/250" },
  { id: 'c5', title: "Prevenção de Perdas e Furtos", category: "Varejo", duration: "6h", lessons: 4, rating: 4.5, thumb: "https://picsum.photos/seed/v5/400/250" },
  { id: 'c6', title: "Atendimento de Excelência no PDV", category: "Varejo", duration: "10h", lessons: 7, rating: 5.0, thumb: "https://picsum.photos/seed/v6/400/250" },
  { id: 'c7', title: "Logística E-commerce", category: "Varejo", duration: "18h", lessons: 12, rating: 4.6, thumb: "https://picsum.photos/seed/v7/400/250" },
  { id: 'c8', title: "Liderança de Equipes de Loja", category: "Varejo", duration: "22h", lessons: 14, rating: 4.8, thumb: "https://picsum.photos/seed/v8/400/250" },
  
  // BELEZA & ESTÉTICA
  { id: 'c9', title: "Masterclass: Degradê Perfeito", category: "Beleza", duration: "10h", lessons: 12, rating: 5.0, thumb: "https://picsum.photos/seed/b1/400/250" },
  { id: 'c10', title: "Colorimetria Avançada", category: "Beleza", duration: "25h", lessons: 20, rating: 4.9, thumb: "https://picsum.photos/seed/b2/400/250" },
  { id: 'c11', title: "Design de Sobrancelhas Pro", category: "Beleza", duration: "8h", lessons: 6, rating: 4.7, thumb: "https://picsum.photos/seed/b3/400/250" },
  { id: 'c12', title: "Visagismo e Barbearia Moderna", category: "Beleza", duration: "15h", lessons: 10, rating: 4.8, thumb: "https://picsum.photos/seed/b4/400/250" },
  { id: 'c13', title: "Biossegurança em Salões", category: "Beleza", duration: "5h", lessons: 3, rating: 4.9, thumb: "https://picsum.photos/seed/b5/400/250" },
  { id: 'c14', title: "Estética Facial: Limpeza Profunda", category: "Beleza", duration: "12h", lessons: 8, rating: 4.6, thumb: "https://picsum.photos/seed/b6/400/250" },
  { id: 'c15', title: "Manicure e Nail Art", category: "Beleza", duration: "20h", lessons: 15, rating: 4.7, thumb: "https://picsum.photos/seed/b7/400/250" },
  { id: 'c16', title: "Gestão Financeira para Salões", category: "Beleza", duration: "14h", lessons: 9, rating: 4.8, thumb: "https://picsum.photos/seed/b8/400/250" },

  // GESTÃO & NEGÓCIOS
  { id: 'c17', title: "Finanças para Não Financeiros", category: "Gestão", duration: "16h", lessons: 11, rating: 4.9, thumb: "https://picsum.photos/seed/g1/400/250" },
  { id: 'c18', title: "Plano de Negócios Escalável", category: "Gestão", duration: "30h", lessons: 25, rating: 4.7, thumb: "https://picsum.photos/seed/g2/400/250" },
  { id: 'c19', title: "Recrutamento e Seleção Eficaz", category: "Gestão", duration: "12h", lessons: 8, rating: 4.8, thumb: "https://picsum.photos/seed/g3/400/250" },
  { id: 'c20', title: "Produtividade e Gestão de Tempo", category: "Gestão", duration: "8h", lessons: 5, rating: 5.0, thumb: "https://picsum.photos/seed/g4/400/250" },
  { id: 'c21', title: "Inteligência Emocional no Trabalho", category: "Gestão", duration: "10h", lessons: 7, rating: 4.9, thumb: "https://picsum.photos/seed/g5/400/250" },
  { id: 'c22', title: "Legislação Trabalhista para PME", category: "Gestão", duration: "20h", lessons: 14, rating: 4.5, thumb: "https://picsum.photos/seed/g6/400/250" },
  { id: 'c23', title: "Customer Success Avançado", category: "Gestão", duration: "15h", lessons: 10, rating: 4.8, thumb: "https://picsum.photos/seed/g7/400/250" },
  { id: 'c24', title: "Como Abrir uma Franquia", category: "Gestão", duration: "25h", lessons: 18, rating: 4.7, thumb: "https://picsum.photos/seed/g8/400/250" },

  // MARKETING DIGITAL
  { id: 'c25', title: "Tráfego Pago para Negócios Locais", category: "Marketing", duration: "20h", lessons: 15, rating: 5.0, thumb: "https://picsum.photos/seed/m1/400/250" },
  { id: 'c26', title: "Copywriting de Alta Conversão", category: "Marketing", duration: "12h", lessons: 9, rating: 4.9, thumb: "https://picsum.photos/seed/m2/400/250" },
  { id: 'c27', title: "SEO: Domine o Google", category: "Marketing", duration: "18h", lessons: 12, rating: 4.8, thumb: "https://picsum.photos/seed/m3/400/250" },
  { id: 'c28', title: "Social Media Strategy", category: "Marketing", duration: "15h", lessons: 10, rating: 4.7, thumb: "https://picsum.photos/seed/m4/400/250" },
  { id: 'c29', title: "E-mail Marketing Automático", category: "Marketing", duration: "10h", lessons: 7, rating: 4.6, thumb: "https://picsum.photos/seed/m5/400/250" },
  { id: 'c30', title: "Criação de Conteúdo com IA", category: "Marketing", duration: "14h", lessons: 11, rating: 5.0, thumb: "https://picsum.photos/seed/m6/400/250" },
  { id: 'c31', title: "Marketing de Influência", category: "Marketing", duration: "8h", lessons: 6, rating: 4.5, thumb: "https://picsum.photos/seed/m7/400/250" },
  { id: 'c32', title: "Branding e Identidade Visual", category: "Marketing", duration: "22h", lessons: 16, rating: 4.9, thumb: "https://picsum.photos/seed/m8/400/250" },

  // SAÚDE & BEM-ESTAR
  { id: 'c33', title: "LGPD aplicada à Saúde", category: "Saúde", duration: "10h", lessons: 7, rating: 4.9, thumb: "https://picsum.photos/seed/s1/400/250" },
  { id: 'c34', title: "Gestão de Clínicas Médicas", category: "Saúde", duration: "30h", lessons: 22, rating: 4.8, thumb: "https://picsum.photos/seed/s2/400/250" },
  { id: 'c35', title: "Faturamento TISS/TUSS", category: "Saúde", duration: "25h", lessons: 18, rating: 4.7, thumb: "https://picsum.photos/seed/s3/400/250" },
  { id: 'c36', title: "Atendimento Humanizado", category: "Saúde", duration: "12h", lessons: 9, rating: 5.0, thumb: "https://picsum.photos/seed/s4/400/250" },
  { id: 'c37', title: "Telemedicina e Ética Digital", category: "Saúde", duration: "8h", lessons: 5, rating: 4.9, thumb: "https://picsum.photos/seed/s5/400/250" },
  { id: 'c38', title: "Primeiros Socorros na Empresa", category: "Saúde", duration: "15h", lessons: 10, rating: 4.8, thumb: "https://picsum.photos/seed/s6/400/250" },
  { id: 'c39', title: "Nutrição Aplicada ao Bem-Estar", category: "Saúde", duration: "20h", lessons: 14, rating: 4.6, thumb: "https://picsum.photos/seed/s7/400/250" },
  { id: 'c40', title: "Psicologia no Ambiente de Trabalho", category: "Saúde", duration: "18h", lessons: 12, rating: 4.7, thumb: "https://picsum.photos/seed/s8/400/250" },

  // TECNOLOGIA & INOVAÇÃO
  { id: 'c41', title: "Introdução à Inteligência Artificial", category: "Tecnologia", duration: "40h", lessons: 30, rating: 5.0, thumb: "https://picsum.photos/seed/t1/400/250" },
  { id: 'c42', title: "Automação de Processos com No-Code", category: "Tecnologia", duration: "25h", lessons: 18, rating: 4.9, thumb: "https://picsum.photos/seed/t2/400/250" },
  { id: 'c43', title: "Segurança da Informação Básica", category: "Tecnologia", duration: "12h", lessons: 8, rating: 4.8, thumb: "https://picsum.photos/seed/t3/400/250" },
  { id: 'c44', title: "Análise de Dados com Excel/BI", category: "Tecnologia", duration: "35h", lessons: 25, rating: 4.7, thumb: "https://picsum.photos/seed/t4/400/250" },
  { id: 'c45', title: "Blockchain e o Futuro do Dinheiro", category: "Tecnologia", duration: "15h", lessons: 10, rating: 4.6, thumb: "https://picsum.photos/seed/t5/400/250" },
  { id: 'c46', title: "Metodologias Ágeis: Scrum e Kanban", category: "Tecnologia", duration: "20h", lessons: 14, rating: 4.9, thumb: "https://picsum.photos/seed/t6/400/250" },
  { id: 'c47', title: "Design UX/UI para Conversão", category: "Tecnologia", duration: "28h", lessons: 20, rating: 4.8, thumb: "https://picsum.photos/seed/t7/400/250" },
  { id: 'c48', title: "Cloud Computing para Empresas", category: "Tecnologia", duration: "18h", lessons: 12, rating: 4.7, thumb: "https://picsum.photos/seed/t8/400/250" },
  { id: 'c49', title: "Cibersegurança Avançada", category: "Tecnologia", duration: "50h", lessons: 40, rating: 4.9, thumb: "https://picsum.photos/seed/t9/400/250" },
  { id: 'c50', title: "Machine Learning Masterclass", category: "Tecnologia", duration: "60h", lessons: 45, rating: 5.0, thumb: "https://picsum.photos/seed/t10/400/250" },
];
