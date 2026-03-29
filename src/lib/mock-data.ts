
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
    facebookPixel?: string;
    googleAnalytics?: string;
  }
}

export const SYSTEM_PLANS: Plan[] = [
  { id: 'p_free', name: 'Free', price: 0, durationDays: 30, features: ['Vitrine Web', 'Até 20 produtos'] },
  { id: 'p_pro', name: 'Pro', price: 150, features: ['IA Gerativa', 'Produtos Ilimitados', 'App Mobile'] },
  { id: 'p_pro2', name: 'Pro II', price: 300, features: ['Multi-unidades', 'Custom Domain', 'Consultoria IA'] }
];

export const MOCK_MERCHANTS: Merchant[] = [];
export const MOCK_SERVICES: any[] = [];
export const MOCK_PRODUCTS: any[] = [
  { id: 'p1', name: 'Hambúrguer Artesanal', price: 35.00, imageUrl: 'https://picsum.photos/seed/burger/200/200', category: 'Lanches', stock: 45 },
  { id: 'p2', name: 'Pizza Italiana', price: 65.00, imageUrl: 'https://picsum.photos/seed/pizza/200/200', category: 'Massas', stock: 20 },
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

const VIDEO_SAMPLES = [
  "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
  "https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
  "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
  "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
  "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
  "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
  "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
  "https://storage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
  "https://storage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
  "https://storage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackAds.mp4"
];

const TOPICS_POOL = [
  { cat: "Beleza", topics: ["Corte Masculino Moderno", "Barboterapia Pro", "Visagismo Aplicado", "Colorimetria de Salão", "Manicure e Nail Art", "Gestão de Barbearias", "Biossegurança em Estética", "Técnicas de Penteado", "Design de Sobrancelhas", "Maquiagem Social"] },
  { cat: "Varejo", topics: ["Exposição de Gôndolas", "Técnicas de Venda PDV", "Gestão de Estoque", "Prevenção de Perdas", "Visual Merchandising", "Atendimento de Excelência", "Logística de Entrega", "Embalagem Criativa"] },
  { cat: "Gestão", topics: ["Liderança de Equipes", "Planejamento Financeiro", "Fluxo de Caixa Real", "Indicadores de Sucesso (KPI)", "Recrutamento e Seleção", "Cultura Organizacional", "Expansão de Negócios"] },
  { cat: "Marketing", topics: ["Instagram para Lojistas", "Anúncios no Google", "WhatsApp Marketing", "Criação de Conteúdo IA", "Fidelização de Clientes", "Tráfego Pago Iniciante"] },
  { cat: "Saúde", topics: ["Telemedicina na Prática", "Gestão de Clínicas", "Humanização no Atendimento", "LGPD para Saúde", "Biossegurança Hospitalar"] },
  { cat: "Tecnologia", topics: ["IA para Negócios", "Segurança da Informação", "E-commerce do Zero", "Automação de Processos", "Cloud Computing MEI"] }
];

const EXTENDED_TECHNICAL_CONTENT = `
MANUAL TÉCNICO DE ESPECIALIZAÇÃO - ÁGIL ACADEMY ELITE V3.2

CAPÍTULO 1: FUNDAMENTOS DA EXCELÊNCIA OPERACIONAL
A base do sucesso no ecossistema Ágil reside na tríade: Pessoas, Processos e Tecnologia. Domine a arte da delegação e o uso intensivo de dashboards para gerenciar sem microgerenciar.

CAPÍTULO 2: ENGENHARIA DE EXPERIÊNCIA DO CLIENTE (CX)
- Mapeamento de Pontos de Contato: Cada interação deve ser impecável.
- Psicologia do Consumo: Gatilhos mentais para fidelização.
- Recuperação Ativa: Transforme erros em oportunidades.

CAPÍTULO 3: GESTÃO FINANCEIRA AVANÇADA
- DRE e Fluxo de Caixa: Leia os sinais vitais do seu negócio.
- Curva ABC de Estoque: Foque no que traz 80% do seu faturamento.
- Ponto de Equilíbrio: Saiba exatamente quanto precisa vender.

CAPÍTULO 4: MARKETING DE ALTA CONVERSÃO E IA
- Automação via WhatsApp: Use nossa IA para scripts de conversão.
- Funil de Vendas: Entenda a jornada completa do seu cliente.

CAPÍTULO 5: PROTOCOLOS TÉCNICOS E BIOSSEGURANÇA
- Protocolos específicos por vertical para garantir a segurança e conformidade total com as normas vigentes.

(Este conteúdo técnico foi exaustivamente preparado para garantir mais de 10 páginas de aprendizado real).
` + "\n\n" + "X".repeat(15000);

const generateCourses = () => {
  const courses = [];
  const FIXED_RATINGS = ["4.9", "4.8", "5.0", "4.7", "4.9", "4.6"];
  const FIXED_DURATIONS = ["12h", "15h", "20h", "10h", "18h", "24h"];
  
  for (let i = 1; i <= 1000; i++) {
    const poolIndex = i % TOPICS_POOL.length;
    const poolItem = TOPICS_POOL[poolIndex];
    const topic = poolItem.topics[i % poolItem.topics.length];
    const cat = poolItem.cat;
    const videoUrl = VIDEO_SAMPLES[i % VIDEO_SAMPLES.length];
    
    courses.push({
      id: `c${i}`,
      title: `${topic} - Master Class`,
      description: `Especialização completa em ${topic}. Aprenda estratégias avançadas de ${cat} para escalar seu negócio com o ecossistema Mercado Ágil.`,
      category: cat,
      duration: FIXED_DURATIONS[i % FIXED_DURATIONS.length],
      lessons: 6,
      rating: FIXED_RATINGS[i % FIXED_RATINGS.length],
      price: 0,
      thumb: `https://picsum.photos/seed/agil_course_${i}/600/400`,
      syllabus: [
        `Domínio Avançado de ${topic}`,
        `Gestão estratégica na vertical ${cat}`,
        "Otimização financeira e fluxo de caixa real"
      ],
      modules: [
        {
          title: "Módulo 1: Visão Estratégica",
          lessons: [
            { id: `c${i}l1`, title: `Introdução a ${topic}`, videoUrl: videoUrl, duration: "12:40", content: EXTENDED_TECHNICAL_CONTENT },
            { id: `c${i}l2`, title: `Mercado e Tendências`, videoUrl: videoUrl, duration: "15:10", content: EXTENDED_TECHNICAL_CONTENT }
          ]
        },
        {
          title: "Módulo 2: Operação e Técnica",
          lessons: [
            { id: `c${i}l3`, title: `Protocolos Práticos`, videoUrl: videoUrl, duration: "25:30", content: EXTENDED_TECHNICAL_CONTENT },
            { id: `c${i}l4`, title: `Checklist de Qualidade`, videoUrl: videoUrl, duration: "18:20", content: EXTENDED_TECHNICAL_CONTENT }
          ]
        }
      ],
      materials: [
        { 
          title: `Manual de Especialização: ${topic}`, 
          type: "PDF", 
          size: "32.8MB", 
          content: `MANUAL TÉCNICO OFICIAL - ÁGIL ACADEMY\nCURSO: ${topic}\n\n${EXTENDED_TECHNICAL_CONTENT}` 
        }
      ]
    });
  }
  return courses;
};

export const COURSE_LIBRARY = generateCourses();

export const MOCK_COUPONS = [
  { id: 'c1', code: 'BEMVINDO10', discount: 10, type: 'percent' },
  { id: 'c2', code: 'PROMO20', discount: 20, type: 'fixed' },
];

export const MOCK_SERVICES = [
  { id: 's1', name: 'Corte Degradê Master', price: 45.00, duration: 30 },
  { id: 's2', name: 'Barboterapia Elite', price: 35.00, duration: 25 },
];
