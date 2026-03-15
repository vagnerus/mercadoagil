
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
  "Beleza": "O mercado de beleza e estética é um dos que mais cresce no Brasil. O segredo do sucesso reside na combinação entre técnica apurada e atendimento humanizado. Para um profissional de elite, entender a anatomia capilar e facial é apenas o começo. O visagismo, por exemplo, permite que o profissional crie uma imagem que reflita a personalidade do cliente, aumentando drasticamente o valor percebido do serviço.\n\nNeste curso, abordaremos profundamente o uso de ferramentas profissionais, a importância da biossegurança para evitar contaminações e como fidelizar clientes através de uma experiência sensorial completa. Higiene, precisão e ética são os pilares que transformam um salão em uma referência local.",
  "Varejo": "Vender produtos é uma ciência exata misturada com psicologia comportamental. O varejo moderno exige que o lojista domine desde a Curva ABC de estoque até o Visual Merchandising. Entender o comportamento do consumidor no ponto de venda (PDV) pode aumentar suas vendas em até 40% apenas com a reorganização das gôndolas.\n\nEste treinamento detalha como gerenciar o giro de estoque para evitar rupturas ou excessos, como aplicar precificação psicológica e como treinar sua equipe de vendas para realizar o 'upsell' de forma natural e lucrativa. O sucesso no varejo é medido pelo lucro líquido e pela taxa de retorno do cliente.",
  "Gestão": "Gestão eficiente é o coração de qualquer negócio escalável. Muitos empreendedores falham não por falta de vendas, mas por falta de controle financeiro. O domínio do Fluxo de Caixa, do DRE (Demonstrativo de Resultados) e do Capital de Giro é obrigatório para quem deseja crescer sem quebrar.\n\nAlém dos números, a gestão de pessoas é o que sustenta a operação. Aprender a contratar, motivar e reter talentos é o maior diferencial competitivo de um gestor moderno. Neste material, exploramos rotinas administrativas que economizam horas de trabalho e como utilizar indicadores de desempenho (KPIs) para tomar decisões baseadas em dados, não em palpites.",
  "Marketing": "No cenário digital atual, quem não é visto não é lembrado. O marketing para negócios locais e e-commerce evoluiu para o marketing de comunidade. Dominar o algoritmo do Instagram e do Google é essencial para atrair tráfego qualificado para sua loja.\n\nExploraremos como criar conteúdo que engaja, o uso de Inteligência Artificial para acelerar a produção de posts e como configurar campanhas de tráfego pago que realmente trazem retorno sobre o investimento (ROI). Copywriting, ou a arte da escrita persuasiva, é a habilidade que transformará seus seguidores em compradores fiéis. O marketing moderno é relacional e constante.",
  "Saúde": "A gestão na área da saúde exige um equilíbrio delicado entre eficiência operacional e conformidade ética e legal. Com a implementação da LGPD, o cuidado com os dados dos pacientes tornou-se uma prioridade técnica. O Prontuário Eletrônico (PEP) não é apenas uma ferramenta de registro, mas um ativo de segurança para o médico e para o paciente.\n\nNeste curso, detalhamos como otimizar o fluxo da recepção para reduzir o no-show, como implementar a telemedicina de forma segura e como realizar o faturamento de convênios sem glosas. O atendimento humanizado, aliado à tecnologia de ponta, é o que garante a sustentabilidade de clínicas e consultórios no longo prazo.",
  "Tecnologia": "A tecnologia é a infraestrutura que permite a escala. Para um lojista, entender o básico de Cloud Computing, Integrações de APIs e Automação de Processos pode significar a sobrevivência do negócio. A transformação digital não é mais uma opção, é um requisito básico.\n\nAbordaremos como proteger as informações da sua empresa contra ataques cibernéticos, como escolher as melhores ferramentas No-Code para automatizar tarefas repetitivas e como utilizar a Análise de Dados (BI) para prever tendências de mercado. A tecnologia deve trabalhar para você, liberando seu tempo para o que realmente importa: a estratégia do seu negócio."
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
      title: `${topic} - Masterclass Profissional`,
      description: `Este treinamento completo em ${topic} foi estruturado por especialistas para capacitar lojistas que buscam a excelência. Você aprenderá os fundamentos teóricos e a aplicação prática imediata, utilizando as ferramentas do ecossistema Mercado Ágil.`,
      category: cat,
      duration: `${Math.floor(Math.random() * 10) + 5}h`,
      lessons: 6,
      rating: (Math.random() * (5 - 4.7) + 4.7).toFixed(1),
      price: 0,
      thumb: `https://picsum.photos/seed/agil_course_${i}/600/400`,
      modules: [
        {
          title: "Módulo 1: Fundamentos e Estratégia",
          lessons: [
            { id: `c${i}l1`, title: `Introdução Profissional a ${topic}`, videoUrl: videoUrl, duration: "12:20", content: `Bem-vindo ao início da sua jornada em ${topic}. Neste capítulo, entenderemos por que esta habilidade é crucial para o seu faturamento hoje.\n\n${baseContent.substring(0, 300)}...` },
            { id: `c${i}l2`, title: `Análise de Mercado e Oportunidades`, videoUrl: videoUrl, duration: "15:45", content: `O mercado atual está em constante mudança. Para se destacar em ${cat}, você precisa identificar nichos inexplorados e gaps de atendimento.\n\nFocar na experiência do cliente é o primeiro passo para a diferenciação.` }
          ]
        },
        {
          title: "Módulo 2: Execução Técnica e Prática",
          lessons: [
            { id: `c${i}l3`, title: `Técnicas Avançadas Passo a Passo`, videoUrl: videoUrl, duration: "25:30", content: `Agora vamos para a parte prática. Como implementar ${topic} no seu dia a dia operacional?\n\n1. Preparação do ambiente.\n2. Execução técnica com precisão.\n3. Controle de qualidade final.` },
            { id: `c${i}l4`, title: `Estudos de Caso de Alta Performance`, videoUrl: videoUrl, duration: "20:00", content: `Veja como outras lojas do Mercado Ágil aplicaram estes conceitos e obtiveram resultados expressivos em menos de 30 dias.` }
          ]
        },
        {
          title: "Módulo 3: Otimização e Escala",
          lessons: [
            { id: `c${i}l5`, title: `Métricas de Sucesso e KPI`, videoUrl: videoUrl, duration: "18:15", content: `O que não é medido não é gerenciado. Aprenda quais números você deve acompanhar para garantir que seu investimento em ${topic} está trazendo retorno real.` },
            { id: `c${i}l6`, title: `Conclusão e Plano de Ação`, videoUrl: videoUrl, duration: "10:50", content: `Parabéns por chegar até aqui. Seu próximo passo é baixar o material de apoio e aplicar o checklist de implementação hoje mesmo.` }
          ]
        }
      ],
      materials: [
        { 
          title: `Guia Completo: ${topic}`, 
          type: "PDF", 
          size: "5.4MB", 
          content: `MANUAL DIDÁTICO OFICIAL - ÁGIL ACADEMY\n\nCURSO: ${topic}\nCATEGORIA: ${cat}\n\nCONTEÚDO TEÓRICO COMPLETO:\n\n${baseContent}\n\nDETALHAMENTO TÉCNICO:\nNo decorrer deste guia, exploramos as nuances de ${topic}. É fundamental que o aluno pratique cada conceito em seu painel operacional. O Mercado Ágil fornece a tecnologia, mas o conhecimento é o que direciona o uso dessas ferramentas para o lucro.\n\nRECOMENDAÇÕES FINAIS:\n- Revise este material mensalmente.\n- Compartilhe as lições com sua equipe de frente.\n- Utilize os dashboards de BI para validar os resultados aprendidos.`
        },
        { 
          title: `Checklist de Implementação - ${topic}`, 
          type: "PDF", 
          size: "1.2MB", 
          content: `CHECKLIST OPERACIONAL - ${topic}\n\n[ ] PASSO 1: Auditoria do processo atual.\n[ ] PASSO 2: Configuração das ferramentas de automação no Mercado Ágil.\n[ ] PASSO 3: Treinamento prático da equipe.\n[ ] PASSO 4: Definição de metas de conversão.\n[ ] PASSO 5: Acompanhamento de KPIs na primeira semana.\n\nEste checklist foi desenhado para garantir que você não pule etapas críticas para o seu sucesso.`
        }
      ],
      syllabus: [
        `Domínio das melhores práticas de ${topic}`,
        `Estratégias de escala para o setor de ${cat}`,
        "Redução de desperdício operacional",
        "Aumento do LTV (Life Time Value) do cliente",
        "Uso de IA para suporte e vendas"
      ]
    });
  }
  return courses;
};

export const COURSE_LIBRARY = generateCourses();
