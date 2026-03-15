
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
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackAds.mp4"
];

const CATEGORIES = ["Varejo", "Beleza", "Gestão", "Marketing", "Saúde", "Tecnologia"];

const TOPICS_POOL = [
  { cat: "Beleza", topics: ["Corte Masculino Moderno", "Barboterapia Pro", "Visagismo Aplicado", "Colorimetria de Salão", "Manicure e Nail Art", "Gestão de Barbearias", "Biossegurança em Estética", "Técnicas de Penteado", "Design de Sobrancelhas", "Maquiagem Social"] },
  { cat: "Varejo", topics: ["Exposição de Gôndolas", "Técnicas de Venda PDV", "Gestão de Estoque", "Prevenção de Perdas", "Visual Merchandising", "Atendimento de Excelência", "Logística de Entrega", "Embalagem Criativa", "Curva ABC na Prática", "Compras Estratégicas"] },
  { cat: "Gestão", topics: ["Liderança de Equipes", "Planejamento Financeiro", "Fluxo de Caixa Real", "Indicadores de Sucesso (KPI)", "Recrutamento e Seleção", "Cultura Organizacional", "Expansão de Negócios", "Gestão de Conflitos", "Negociação com Fornecedores", "Empreendedorismo Ágil"] },
  { cat: "Marketing", topics: ["Instagram para Lojistas", "Anúncios no Google", "WhatsApp Marketing", "Criação de Conteúdo IA", "Fidelização de Clientes", "Tráfego Pago Iniciante", "Branding e Identidade", "Copywriting de Vendas", "Marketing de Guerrilha", "SEO para Negócios Locais"] },
  { cat: "Saúde", topics: ["Telemedicina na Prática", "Gestão de Clínicas", "Humanização no Atendimento", "LGPD para Saúde", "Biossegurança Hospitalar", "Marketing Médico Ético", "Financeiro para Consultórios", "Novas Tecnologias em Saúde", "Prontuário Digital", "Experiência do Paciente"] },
  { cat: "Tecnologia", topics: ["IA para Negócios", "Segurança da Informação", "E-commerce do Zero", "Automação de Processos", "Cloud Computing MEI", "Ferramentas No-Code", "Análise de Dados BI", "Transformação Digital", "Suporte Técnico Pro", "Desenvolvimento Web Básico"] }
];

// Gerador de Conteúdo Didático Realista
const generateCourses = () => {
  const courses = [];
  
  for (let i = 1; i <= 500; i++) {
    const poolItem = TOPICS_POOL[i % TOPICS_POOL.length];
    const topic = poolItem.topics[i % poolItem.topics.length];
    const cat = poolItem.cat;
    const videoUrl = VIDEO_SAMPLES[i % VIDEO_SAMPLES.length];
    
    courses.push({
      id: `c${i}`,
      title: `${topic} - Módulo ${Math.ceil(i/50)}`,
      description: `Este treinamento completo em ${topic} foi estruturado para capacitar lojistas e profissionais que buscam excelência operacional. Você aprenderá desde os fundamentos teóricos até a aplicação prática no dia a dia do seu negócio, utilizando as ferramentas exclusivas do ecossistema Mercado Ágil.`,
      category: cat,
      duration: `${Math.floor(Math.random() * 15) + 5}h`,
      lessons: 8,
      rating: (Math.random() * (5 - 4.5) + 4.5).toFixed(1),
      price: 0,
      thumb: `https://picsum.photos/seed/agil_course_${i}/600/400`,
      modules: [
        {
          title: "Módulo 1: Introdução e Contexto",
          lessons: [
            { id: `c${i}l1`, title: `Introdução ao Universo de ${topic}`, videoUrl: videoUrl, duration: "10:20" },
            { id: `c${i}l2`, title: `Cenário Atual do Mercado de ${cat}`, videoUrl: videoUrl, duration: "15:45" },
            { id: `c${i}l3`, title: `Preparação e Ferramentas Necessárias`, videoUrl: videoUrl, duration: "12:10" }
          ]
        },
        {
          title: "Módulo 2: Técnicas e Implementação",
          lessons: [
            { id: `c${i}l4`, title: `Técnicas Avançadas de ${topic}`, videoUrl: videoUrl, duration: "25:30" },
            { id: `c${i}l5`, title: `Estudo de Caso: Sucesso em ${cat}`, videoUrl: videoUrl, duration: "30:00" },
            { id: `c${i}l6`, title: `Evitando Erros Comuns na Prática`, videoUrl: videoUrl, duration: "18:20" }
          ]
        },
        {
          title: "Módulo 3: Escala e Resultados",
          lessons: [
            { id: `c${i}l7`, title: `Métricas de Desempenho e KPI`, videoUrl: videoUrl, duration: "22:15" },
            { id: `c${i}l8`, title: `Conclusão e Próximos Passos`, videoUrl: videoUrl, duration: "14:50" }
          ]
        }
      ],
      materials: [
        { title: `Guia de Estudo: ${topic}`, type: "PDF", size: "3.2MB", url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf" },
        { title: `Checklist de Implementação - ${cat}`, type: "PDF", size: "1.5MB", url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf" },
        { title: `Planilha de Resultados ${topic}`, type: "XLSX", size: "2.1MB", url: "https://file-examples.com/wp-content/uploads/2017/02/file_example_XLSX_10.xlsx" }
      ],
      syllabus: [
        `Domínio completo das ferramentas de ${topic}`,
        `Estratégias de diferenciação no setor de ${cat}`,
        "Redução de custos operacionais e otimização de tempo",
        "Aumento do ticket médio através de atendimento especializado",
        "Utilização de IA para acelerar processos rotineiros"
      ]
    });
  }
  return courses;
};

export const COURSE_LIBRARY = generateCourses();
