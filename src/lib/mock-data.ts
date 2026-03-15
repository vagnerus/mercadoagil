
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
CONTEÚDO TÉCNICO AVANÇADO - MÓDULO DE ESPECIALIZAÇÃO ÁGIL ACADEMY

INTRODUÇÃO E FUNDAMENTOS DO SETOR
O desenvolvimento de competências de elite exige um compromisso inabalável com a fundamentação teórica e a prática deliberada. Neste manual, exploramos os pilares que sustentam as operações de sucesso no mercado global contemporâneo. A análise de mercado demonstra que empresas que investem em educação corporativa contínua possuem um LTV (Life Time Value) 35% superior aos concorrentes diretos.

CAPÍTULO 1: ENGENHARIA DE PROCESSOS E EFICIÊNCIA OPERACIONAL
A base de qualquer negócio escalável é o processo. Sem processos claros, a empresa depende da genialidade individual, o que torna o crescimento impossível.
- Mapeamento de Jornada: Identifique cada ponto de contato do cliente.
- Otimização de Gargalos: Use a teoria das restrições para identificar onde a sua operação perde dinheiro.
- Automação de Rotinas: No Mercado Ágil, a tecnologia deve trabalhar para o humano, e não o contrário. Utilize gatilhos automáticos para emissão de notas e controle de estoque.

CAPÍTULO 2: PSICOLOGIA APLICADA AO CONSUMO E VENDAS
Vender não é um ato de persuasão vazia, mas sim de resolução de problemas complexos.
- Gatilhos Mentais de Autoridade: Como se posicionar como o maior especialista do seu bairro.
- Neurociência no PDV: A influência das cores, sons e aromas na decisão de compra irracional.
- Rapport e Espelhamento: Técnicas de comunicação para criar conexão imediata com novos leads.

CAPÍTULO 3: GESTÃO FINANCEIRA DE ALTA PERFORMANCE
Números não mentem. O dono do negócio deve dominar os demonstrativos básicos.
- DRE Gerencial: Entenda sua margem de contribuição por item vendido.
- EBITDA e Valuation: Como preparar sua empresa para ser vendida ou atrair investidores.
- Gestão de Capital de Giro: A importância de não imobilizar todo o caixa em estoque de baixo giro.

CAPÍTULO 4: MARKETING DE GROWTH E AQUISIÇÃO DE CLIENTES
O marketing digital mudou. Hoje, a segmentação hiper-local é o segredo para negócios físicos.
- Estratégias de Tráfego Pago: Como investir R$ 10,00 por dia e atrair clientes qualificados.
- SEO para Negócios Locais: Dominando o Google Maps e as buscas por proximidade.
- Criação de Conteúdo com IA: Use o Gemini para gerar roteiros que convertem em segundos.

CAPÍTULO 5: LIDERANÇA, CULTURA E GESTÃO DE TALENTOS
Uma empresa é feita de pessoas. Como atrair, treinar e reter os melhores profissionais?
- Recrutamento por Valores: Competência se ensina, caráter é inato.
- Feedback 360°: A cultura da transparência radical.
- Planos de Carreira e Meritocracia: Como motivar seu time através de indicadores de performance reais (Score Ágil).

CAPÍTULO 6: TECNOLOGIA COMO ALAVANCA DE ESCALA
O uso de infraestrutura cloud e microserviços permite que seu negócio opere 24/7 sem quedas.
- Segurança da Informação: Proteção de dados sensíveis e conformidade com a LGPD.
- APIs e Ecossistemas: Como conectar sua loja com as maiores ferramentas de logística do mundo.
- IA Vision: O futuro do inventário através do reconhecimento de imagem.

CAPÍTULO 7: ÉTICA PROFISSIONAL E RESPONSABILIDADE SOCIAL
O lucro com propósito é o único sustentável a longo prazo. Implemente práticas de governança e sustentabilidade que ressoem com a nova geração de consumidores conscientes.

CAPÍTULO 8: ESTUDO DE CASOS DE SUCESSO GLOBAL
Analisaremos como grandes redes aplicam os conceitos de padronização e escalabilidade para dominar mercados continentais.

CAPÍTULO 9: ROTEIRO DE IMPLEMENTAÇÃO PRÁTICA (NEXT STEPS)
Não adianta ter o conhecimento sem a execução. Siga o checklist de 21 dias para transformar sua operação baseada neste curso.

CAPÍTULO 10: CONCLUSÃO E CERTIFICAÇÃO PROFISSIONAL
O encerramento desta jornada acadêmica marca apenas o início da sua nova fase como gestor de elite. O certificado Ágil Academy é reconhecido como um selo de excelência operacional no ecossistema de delivery e varejo.

(Este texto se repete para garantir a densidade de páginas necessária para o estudo profundo do aluno).
` + "\n".repeat(10) + "CONTEÚDO ADICIONAL DE REVISÃO TÉCNICA E PROTOCOLOS OPERACIONAIS ESPECÍFICOS PARA CADA MÓDULO DO CURSO ESCOLHIDO.\n" + "X".repeat(2000);

const generateCourses = () => {
  const courses = [];
  
  for (let i = 1; i <= 1000; i++) {
    const poolItem = TOPICS_POOL[i % TOPICS_POOL.length];
    const topic = poolItem.topics[i % poolItem.topics.length];
    const cat = poolItem.cat;
    const videoUrl = VIDEO_SAMPLES[i % VIDEO_SAMPLES.length];
    
    // Tornar determinístico para evitar erros de hidratação
    const durationHours = (i % 15) + 10;
    const ratingValue = (4.5 + (i % 6) / 10).toFixed(1);

    courses.push({
      id: `c${i}`,
      title: `${topic} - Especialização Master`,
      description: `Este treinamento completo em ${topic} foi estruturado para capacitar profissionais de alto nível. Com carga horária de ${durationHours}h, o curso aborda desde fundamentos teóricos até protocolos operacionais avançados. Ideal para lojistas que buscam excelência no ecossistema Mercado Ágil.`,
      category: cat,
      duration: `${durationHours}h`,
      lessons: 6,
      rating: ratingValue,
      price: 0,
      thumb: `https://picsum.photos/seed/agil_course_${i}/600/400`,
      syllabus: [
        `Domínio integral de ${topic}`,
        `Estratégias de escala baseadas na vertical ${cat}`,
        "Redução comprovada de custos operacionais",
        "Aumento da satisfação e retenção do cliente (LTV)",
        "Uso avançado de IA para ganho de produtividade",
        "Conformidade técnica e ética total"
      ],
      modules: [
        {
          title: "Módulo 1: Visão Estratégica e Mercado",
          lessons: [
            { id: `c${i}l1`, title: `Fundamentos de ${topic}`, videoUrl: videoUrl, duration: "12:40", content: EXTENDED_TECHNICAL_CONTENT },
            { id: `c${i}l2`, title: `Análise de Oportunidades em ${cat}`, videoUrl: videoUrl, duration: "15:10", content: EXTENDED_TECHNICAL_CONTENT }
          ]
        },
        {
          title: "Módulo 2: Operação e Protocolos",
          lessons: [
            { id: `c${i}l3`, title: `Execução Prática no PDV`, videoUrl: videoUrl, duration: "25:30", content: EXTENDED_TECHNICAL_CONTENT },
            { id: `c${i}l4`, title: `Checklist de Qualidade Ágil`, videoUrl: videoUrl, duration: "18:20", content: EXTENDED_TECHNICAL_CONTENT }
          ]
        },
        {
          title: "Módulo 3: Gestão, BI e Escala",
          lessons: [
            { id: `c${i}l5`, title: `Dashboard e KPIs de Sucesso`, videoUrl: videoUrl, duration: "22:15", content: EXTENDED_TECHNICAL_CONTENT },
            { id: `c${i}l6`, title: `Plano de Expansão e Prova Final`, videoUrl: videoUrl, duration: "14:50", content: EXTENDED_TECHNICAL_CONTENT }
          ]
        }
      ],
      materials: [
        { 
          title: `Manual de Treinamento Integral: ${topic}`, 
          type: "PDF", 
          size: "24.5MB", 
          content: `MANUAL TÉCNICO OFICIAL - ÁGIL ACADEMY\nCURSO: ${topic}\n\nCONTEÚDO DIDÁTICO INTEGRAL PARA ESTUDO E CONSULTA:\n\n${EXTENDED_TECHNICAL_CONTENT}` 
        },
        { 
          title: `Guia de Implementação Operacional`, 
          type: "PDF", 
          size: "8.2MB", 
          content: `GUIA PRÁTICO DE EXECUÇÃO\n\nEste documento contém o roteiro passo a passo para aplicar os conceitos de ${topic} no seu negócio hoje mesmo.\n\n${EXTENDED_TECHNICAL_CONTENT}`
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
