
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

const VIDEO_SAMPLES = [
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4"
];

// Biblioteca de 500 Cursos para o AVA (Totalmente Gratuitos para Lojistas)
const generateCourses = () => {
  const categories = ["Varejo", "Beleza", "Gestão", "Marketing", "Saúde", "Tecnologia"];
  const courses = [];
  
  for (let i = 1; i <= 500; i++) {
    const cat = categories[Math.floor(Math.random() * categories.length)];
    const topic = getCourseTopic(i);
    const videoUrl = VIDEO_SAMPLES[i % VIDEO_SAMPLES.length];
    
    courses.push({
      id: `c${i}`,
      title: `Curso Especialista ${i}: ${topic}`,
      description: `Treinamento intensivo sobre ${topic}. Este curso foi desenvolvido para acelerar os resultados do seu negócio no Mercado Ágil, focando em métricas reais e implementação prática. Através deste conteúdo, você aprenderá técnicas validadas para otimizar sua operação e escalar suas vendas de forma consistente.`,
      category: cat,
      duration: `${Math.floor(Math.random() * 30) + 10}h`,
      lessons: Math.floor(Math.random() * 20) + 10,
      rating: (Math.random() * (5 - 4.2) + 4.2).toFixed(1),
      price: 0,
      thumb: `https://picsum.photos/seed/course${i}/400/250`,
      modules: [
        {
          title: "Módulo 1: Fundamentos Estratégicos",
          lessons: [
            { id: `c${i}l1`, title: `Introdução ao ${topic}`, videoUrl: videoUrl, duration: "12:45" },
            { id: `c${i}l2`, title: "Mentalidade de Crescimento Exponencial", videoUrl: videoUrl, duration: "18:20" },
            { id: `c${i}l3`, title: "Mapeamento de Processos Atuais", videoUrl: videoUrl, duration: "22:15" }
          ]
        },
        {
          title: "Módulo 2: Prática e Execução Ágil",
          lessons: [
            { id: `c${i}l4`, title: "Configuração de Ferramentas de Automação", videoUrl: videoUrl, duration: "28:30" },
            { id: `c${i}l5`, title: "Primeiros Resultados e Ajustes Finos", videoUrl: videoUrl, duration: "35:00" },
            { id: `c${i}l6`, title: "Escalabilidade e Delegação", videoUrl: videoUrl, duration: "24:10" }
          ]
        }
      ],
      materials: [
        { title: `Guia Completo: ${topic}`, type: "PDF", size: "4.8MB", url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf" },
        { title: "Planilha de Gestão Financeira v3.2", type: "XLSX", size: "2.1MB", url: "https://file-examples.com/wp-content/uploads/2017/02/file_example_XLSX_10.xlsx" },
        { title: "Checklist de Implementação Diária", type: "PDF", size: "1.2MB", url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf" }
      ],
      syllabus: [
        `Introdução profunda ao universo de ${topic}`,
        "Configuração passo a passo do Ecossistema Ágil",
        "Estratégias avançadas de atração de clientes qualificados",
        "Retenção, Fidelização e Recompra Automática",
        "Análise de Big Data e Tomada de Decisão com IA"
      ]
    });
  }
  return courses;
};

const getCourseTopic = (i: number) => {
  const topics = [
    "Vendas de Alto Impacto", "Design de Experiência do Cliente", "Gestão de Crises e Reputação", "Marketing Viral no TikTok", 
    "Liderança Ágil para Equipes", "Análise de Dados e BI Pro", "Atendimento VIP e Encantamento", "Finanças Estratégicas para MEI",
    "Estética Avançada e Biossegurança", "Corte Europeu Masculino", "Colorimetria Real Aplicada", "Manicure Russa e Nail Art",
    "Google Ads para Negócios Locais", "Copywriting Persuasivo com IA", "SEO Dominante para Lojas", "Instagram para Negócios 2024",
    "Primeiros Socorros no Estabelecimento", "Nutrição Clínica Funcional", "Gestão Hospitalar Eficiente", "Ética na Saúde Digital",
    "JavaScript Moderno para Lojistas", "React do Zero ao Painel", "Cloud Computing para Pequenos Negócios", "Segurança Digital e LGPD",
    "Roteirização Inteligente de Entregas", "Controle de Estoque Inteligente", "Curva ABC na Prática Real", "Fidelização 2.0 e Cashback",
    "Escala de Franquias e Multitenancy", "Processos Operacionais Padrão", "Venda Consultiva de Serviços", "Psicologia do Consumidor Moderno"
  ];
  return topics[i % topics.length];
};

export const COURSE_LIBRARY = generateCourses();
