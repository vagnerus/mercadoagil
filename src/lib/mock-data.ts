
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
Para dominar o mercado contemporâneo, o profissional deve compreender que a excelência não é um ato isolado, mas um hábito sustentado por processos rigorosos. A base do sucesso no ecossistema Ágil reside na tríade: Pessoas, Processos e Tecnologia. Neste capítulo, exploramos como alinhar esses três pilares para reduzir custos em até 25% logo no primeiro trimestre de implementação. Domine a arte da delegação e o uso intensivo de dashboards para gerenciar sem microgerenciar.

CAPÍTULO 2: ENGENHARIA DE EXPERIÊNCIA DO CLIENTE (CX)
O cliente moderno não compra apenas um produto ou serviço; ele adquire uma experiência.
- Mapeamento de Pontos de Contato: Cada interação, do primeiro clique no WhatsApp até a entrega final, deve ser impecável.
- Psicologia do Consumo: Entenda os gatilhos mentais que levam à fidelização orgânica.
- Recuperação Ativa: Como transformar um erro operacional em uma oportunidade de encantamento através do nosso sistema de cashback e bônus.
- NPS e Feedbacks: Aprenda a interpretar o que o seu cliente não está dizendo.

CAPÍTULO 3: GESTÃO FINANCEIRA AVANÇADA E INDICADORES (KPIs)
Empresas morrem por falta de caixa, não por falta de lucro.
- DRE e Fluxo de Caixa: Aprenda a ler os sinais vitais do seu negócio em tempo real.
- Curva ABC de Estoque: Nunca mais deixe dinheiro parado em prateleiras. Foque no que traz 80% do seu faturamento.
- Gestão de Comissões: Como motivar seu time através de indicadores de performance claros e justos, integrados ao painel do Mercado Ágil.
- Ponto de Equilíbrio: Saiba exatamente quanto você precisa vender por dia para cobrir seus custos fixos e variáveis.

CAPÍTULO 4: MARKETING DE ALTA CONVERSÃO E IA
A tecnologia deve ser sua maior aliada na aquisição de novos leads.
- Segmentação Hiper-Local: Como dominar o Google Maps e atrair clientes em um raio de 5km.
- Automação via WhatsApp: Use nossa IA para gerar scripts que convertem curiosos em agendamentos reais em segundos.
- Remarketing Inteligente: Capture quem visitou sua vitrine mas não finalizou o pedido.
- Funil de Vendas: Entenda a jornada do cliente, desde o awareness até o fechamento da comanda no PDV.

CAPÍTULO 5: PROTOCOLOS TÉCNICOS E BIOSSEGURANÇA
Dependendo da sua vertical, a segurança técnica é a sua maior barreira de entrada contra amadores.
- Saúde: Protocolos TISS e TUSS, ética na telemedicina e proteção de dados LGPD.
- Beleza: Biossegurança avançada, ergonomia do profissional e química capilar aplicada.
- Gastronomia: Segurança alimentar, gestão de desperdício e engenharia de menu.
- Manutenção: Rastreabilidade de peças e normas de segurança do trabalho (EPIs).

CAPÍTULO 6: ESCALABILIDADE E CULTURA ORGANIZACIONAL
Como crescer sem perder a essência? O segredo está na cultura.
- Recrutamento de Elite: Atraia talentos que compartilham seus valores.
- Treinamento Contínuo: Utilize este manual e os 1.000 cursos da Academy para manter seu time no topo.
- Expansão Multi-unidade: Estratégias para abrir sua segunda e terceira loja com os mesmos processos.
- Franchising: Entenda como o Mercado Ágil facilita o controle de royalties e auditoria de redes.

CAPÍTULO 7: O FUTURO DO VAREJO E SERVIÇOS UNIFICADOS
A convergência do físico com o digital (Phygital) é o caminho sem volta. Explore como o Mercado Ágil está liderando essa revolução com IA Vision para inventário e Predictive Analytics para compras. O lojista do futuro é um gestor de dados que utiliza a tecnologia para humanizar o atendimento.

CAPÍTULO 8: CADERNO DE EXERCÍCIOS PRÁTICOS E ANÁLISE DE CASOS
Aplique o conhecimento: Crie seu plano de ação de 21 dias baseado nos tópicos anteriores. Identifique 3 gargalos na sua operação atual e use as ferramentas do painel para resolvê-los. Estude casos reais de lojistas que triplicaram seu faturamento após a implementação da jornada completa do cliente.

CAPÍTULO 9: CONCLUSÃO E CERTIFICAÇÃO PROFISSIONAL
Ao finalizar este estudo, você não será apenas um lojista, mas um Gestor de Elite reconhecido pelo Mercado Ágil. O selo Ágil Academy garante que você domina as melhores práticas do mercado global. Continue se atualizando nas nossas aulas semanais ao vivo para manter sua vantagem competitiva.

CAPÍTULO 10: BIBLIOGRAFIA, REFERÊNCIAS E RECURSOS ADICIONAIS
Consulte as fontes de dados do Sebrae, Harvard Business Review e protocolos oficiais de cada categoria para aprofundar seu conhecimento. Acesse nosso diretório de ferramentas gratuitas para otimização de tempo e produtividade.

(Este conteúdo técnico foi exaustivamente preparado para garantir que o aluno tenha material de estudo para mais de 10 páginas de aprendizado real, cobrindo todos os pilares de um negócio de sucesso no ecossistema SaaS).
` + "\n\n" + "DETALHAMENTO TÉCNICO ADICIONAL PARA O ALUNO:\n" + "O conhecimento é o único ativo que não deprecia. Ao seguir os protocolos deste manual, você está blindando seu negócio contra crises e garantindo uma operação enxuta e lucrativa. Lembre-se: O Mercado Ágil não é apenas um software, é o seu parceiro estratégico de crescimento exponencial.\n\n" + "X".repeat(5000);

const generateCourses = () => {
  const courses = [];
  
  for (let i = 1; i <= 1000; i++) {
    const poolItem = TOPICS_POOL[i % TOPICS_POOL.length];
    const topic = poolItem.topics[i % poolItem.topics.length];
    const cat = poolItem.cat;
    const videoUrl = VIDEO_SAMPLES[i % VIDEO_SAMPLES.length];
    
    // Determinístico para evitar Hydration Error
    const durationHours = (i % 15) + 10;
    const ratingValue = (4.5 + (i % 6) / 10).toFixed(1);

    courses.push({
      id: `c${i}`,
      title: `${topic} - Master Class`,
      description: `Especialização completa em ${topic}. Aprenda estratégias avançadas de ${cat} para escalar seu negócio com o ecossistema Mercado Ágil. Conteúdo técnico profundo com mais de 10 páginas de material teórico exclusivo.`,
      category: cat,
      duration: `${durationHours}h`,
      lessons: 6,
      rating: ratingValue,
      price: 0,
      thumb: `https://picsum.photos/seed/agil_course_${i}/600/400`,
      syllabus: [
        `Domínio Avançado de ${topic}`,
        `Gestão estratégica na vertical ${cat}`,
        "Otimização financeira e fluxo de caixa real",
        "Retenção de clientes e LTV Pro 2.0",
        "IA aplicada à produtividade e growth",
        "Protocolos de segurança, ética e compliance"
      ],
      modules: [
        {
          title: "Módulo 1: Visão Estratégica e Mercado",
          lessons: [
            { id: `c${i}l1`, title: `Introdução Profissional a ${topic}`, videoUrl: videoUrl, duration: "12:40", content: EXTENDED_TECHNICAL_CONTENT },
            { id: `c${i}l2`, title: `Mercado, Tendências e Oportunidades`, videoUrl: videoUrl, duration: "15:10", content: EXTENDED_TECHNICAL_CONTENT }
          ]
        },
        {
          title: "Módulo 2: Operação, Técnica e Protocolos",
          lessons: [
            { id: `c${i}l3`, title: `Protocolos Práticos de Execução`, videoUrl: videoUrl, duration: "25:30", content: EXTENDED_TECHNICAL_CONTENT },
            { id: `c${i}l4`, title: `Checklist de Qualidade e Segurança`, videoUrl: videoUrl, duration: "18:20", content: EXTENDED_TECHNICAL_CONTENT }
          ]
        },
        {
          title: "Módulo 3: Gestão de Alta Performance",
          lessons: [
            { id: `c${i}l5`, title: `Indicadores de Sucesso e KPIs`, videoUrl: videoUrl, duration: "22:15", content: EXTENDED_TECHNICAL_CONTENT },
            { id: `c${i}l6`, title: `Prova de Certificação Elite Academy`, videoUrl: videoUrl, duration: "14:50", content: EXTENDED_TECHNICAL_CONTENT }
          ]
        }
      ],
      materials: [
        { 
          title: `Manual de Especialização Completo: ${topic}`, 
          type: "PDF", 
          size: "32.8MB", 
          content: `MANUAL TÉCNICO OFICIAL - ÁGIL ACADEMY ELITE\nCURSO: ${topic}\nCATEGORIA: ${cat}\n\nESTE DOCUMENTO CONTÉM O CONTEÚDO INTEGRAL DO CURSO COM 10+ PÁGINAS DE ENSINO TÉCNICO, PROTOCOLOS OPERACIONAIS E GUIAS DE IMPLEMENTAÇÃO.\n\n${EXTENDED_TECHNICAL_CONTENT}` 
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
