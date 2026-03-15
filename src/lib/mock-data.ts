
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

const TOPICS_POOL = [
  { cat: "Beleza", topics: ["Corte Masculino Moderno", "Barboterapia Pro", "Visagismo Aplicado", "Colorimetria de Salão", "Manicure e Nail Art", "Gestão de Barbearias", "Biossegurança em Estética", "Técnicas de Penteado", "Design de Sobrancelhas", "Maquiagem Social"] },
  { cat: "Varejo", topics: ["Exposição de Gôndolas", "Técnicas de Venda PDV", "Gestão de Estoque", "Prevenção de Perdas", "Visual Merchandising", "Atendimento de Excelência", "Logística de Entrega", "Embalagem Criativa", "Curva ABC na Prática", "Compras Estratégicas"] },
  { cat: "Gestão", topics: ["Liderança de Equipes", "Planejamento Financeiro", "Fluxo de Caixa Real", "Indicadores de Sucesso (KPI)", "Recrutamento e Seleção", "Cultura Organizacional", "Expansão de Negócios", "Gestão de Conflitos", "Negociação com Fornecedores", "Empreendedorismo Ágil"] },
  { cat: "Marketing", topics: ["Instagram para Lojistas", "Anúncios no Google", "WhatsApp Marketing", "Criação de Conteúdo IA", "Fidelização de Clientes", "Tráfego Pago Iniciante", "Branding e Identidade", "Copywriting de Vendas", "Marketing de Guerrilha", "SEO para Negócios Locais"] },
  { cat: "Saúde", topics: ["Telemedicina na Prática", "Gestão de Clínicas", "Humanização no Atendimento", "LGPD para Saúde", "Biossegurança Hospitalar", "Marketing Médico Ético", "Financeiro para Consultórios", "Novas Tecnologias em Saúde", "Prontuário Digital", "Experiência do Paciente"] },
  { cat: "Tecnologia", topics: ["IA para Negócios", "Segurança da Informação", "E-commerce do Zero", "Automação de Processos", "Cloud Computing MEI", "Ferramentas No-Code", "Análise de Dados BI", "Transformação Digital", "Suporte Técnico Pro", "Desenvolvimento Web Básico"] }
];

const CATEGORY_CONTENT: Record<string, string> = {
  "Beleza": "O mercado de beleza exige precisão técnica e atendimento humanizado. Este material cobre desde a anatomia capilar até a psicologia do visagismo. Aprenda a manipular ferramentas profissionais com segurança e a oferecer rituais de cuidado que fidelizam o cliente pelo valor agregado, não apenas pelo preço.",
  "Varejo": "Vender é uma ciência baseada em dados e psicologia do consumo. Neste guia, exploramos a curva ABC de estoque, técnicas de fechamento no PDV e como transformar a experiência de compra em um momento memorável. Descubra como a exposição correta de produtos pode aumentar suas vendas em até 40% sem investimento extra.",
  "Gestão": "Gestão eficiente é o coração de qualquer negócio escalável. Aprenda a ler seu DRE, gerenciar o capital de giro e liderar equipes de alta performance. Este material detalha rotinas administrativas essenciais para manter sua operação saudável e preparada para o crescimento multi-unidade.",
  "Marketing": "No mundo digital, quem não é visto não é lembrado. Domine o algoritmo das redes sociais, aprenda a criar anúncios que convertem e utilize a inteligência artificial para produzir conteúdo profissional em minutos. Este guia prático ensina estratégias de growth hacking para pequenos e médios negócios.",
  "Saúde": "A área da saúde exige rigor ético e conformidade total com a LGPD. Explore como a telemedicina pode ampliar seu raio de atuação, como gerenciar prontuários digitais com segurança e técnicas de acolhimento que melhoram o NPS da sua clínica ou consultório.",
  "Tecnologia": "A tecnologia é a ferramenta que automatiza o sucesso. Aprenda a integrar seu e-commerce com ERPs, descubra o poder do Cloud Computing e entenda como ferramentas No-Code podem acelerar seus processos internos. Este conteúdo desmistifica a complexidade técnica para o empreendedor."
};

// Gerador de Conteúdo Didático Realista
const generateCourses = () => {
  const courses = [];
  
  for (let i = 1; i <= 500; i++) {
    const poolItem = TOPICS_POOL[i % TOPICS_POOL.length];
    const topic = poolItem.topics[i % poolItem.topics.length];
    const cat = poolItem.cat;
    const videoUrl = VIDEO_SAMPLES[i % VIDEO_SAMPLES.length];
    const baseContent = CATEGORY_CONTENT[cat];
    
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
        { 
          title: `Guia Master: ${topic}`, 
          type: "PDF", 
          size: "4.2MB", 
          content: `${baseContent}\n\nEste guia aborda especificamente os pilares de ${topic}. Recomendamos a leitura atenta de cada capítulo e a aplicação imediata no seu painel Mercado Ágil para validar os conceitos aprendidos.`
        },
        { 
          title: `Checklist Prático - ${cat}`, 
          type: "PDF", 
          size: "1.8MB", 
          content: `CHECKLIST DE IMPLEMENTAÇÃO: ${topic}\n\n1. Auditoria inicial do processo atual.\n2. Configuração das ferramentas de automação no painel.\n3. Treinamento da equipe de linha de frente.\n4. Definição de metas de curto prazo (30 dias).\n5. Monitoramento diário via dashboard de BI.`
        },
        { 
          title: `Template de Planilha de Resultados`, 
          type: "XLSX", 
          size: "2.1MB", 
          content: `Relatório de Performance - ${topic}\n\nColunas sugeridas para sua planilha:\n- Data do Evento\n- Valor do Investimento\n- Retorno Financeiro (ROI)\n- Custo de Aquisição de Cliente (CAC)\n- Taxa de Conversão Final.`
        }
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
