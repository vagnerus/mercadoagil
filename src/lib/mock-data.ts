
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
  { cat: "Beleza", topics: ["Corte Masculino Moderno", "Barboterapia Pro", "Visagismo Aplicado", "Colorimetria de Salão", "Manicure e Nail Art", "Gestão de Barbearias", "Biossegurança em Estética", "Técnicas de Penteado", "Design de Sobrancelhas", "Maquiagem Social", "Mega Hair de Queratina", "Tratamento de Queda Capilar", "Marketing para Estética", "Vendas de Pacotes de Estética", "Harmonização Capilar"] },
  { cat: "Varejo", topics: ["Exposição de Gôndolas", "Técnicas de Venda PDV", "Gestão de Estoque", "Prevenção de Perdas", "Visual Merchandising", "Atendimento de Excelência", "Logística de Entrega", "Embalagem Criativa", "Curva ABC na Prática", "Compras Estratégicas", "Gestão de E-commerce", "Experiência do Consumidor", "Inovação no Varejo Físico", "Sistemas de ERP para Lojas", "Treinamento de Equipe de Venda"] },
  { cat: "Gestão", topics: ["Liderança de Equipes", "Planejamento Financeiro", "Fluxo de Caixa Real", "Indicadores de Sucesso (KPI)", "Recrutamento e Seleção", "Cultura Organizacional", "Expansão de Negócios", "Gestão de Conflitos", "Negociação com Fornecedores", "Empreendedorismo Ágil", "Modelagem de Negócios Canvas", "Estratégia de Crescimento SaaS", "Auditoria Interna", "Controladoria para Pequenas Empresas", "Gestão de Tempo para Donos"] },
  { cat: "Marketing", topics: ["Instagram para Lojistas", "Anúncios no Google", "WhatsApp Marketing", "Criação de Conteúdo IA", "Fidelização de Clientes", "Tráfego Pago Iniciante", "Branding e Identidade", "Copywriting de Vendas", "Marketing de Guerrilha", "SEO para Negócios Locais", "E-mail Marketing Eficaz", "Gestão de Tráfego Avançado", "Marketing de Influência Local", "Automação de Marketing", "Growth Hacking para Lojas"] },
  { cat: "Saúde", topics: ["Telemedicina na Prática", "Gestão de Clínicas", "Humanização no Atendimento", "LGPD para Saúde", "Biossegurança Hospitalar", "Marketing Médico Ético", "Financeiro para Consultórios", "Novas Tecnologias em Saúde", "Prontuário Digital", "Experiência do Paciente", "Gestão de Convênios TISS", "Faturamento Médico Sem Erros", "Administração de Clínicas Odontológicas", "Fisioterapia e Gestão", "Psicologia: Carreira e Consultório"] },
  { cat: "Tecnologia", topics: ["IA para Negócios", "Segurança da Informação", "E-commerce do Zero", "Automação de Processos", "Cloud Computing MEI", "Ferramentas No-Code", "Análise de Dados BI", "Transformação Digital", "Suporte Técnico Pro", "Desenvolvimento Web Básico", "Inteligência Artificial Generativa", "Blockchain para Logística", "Cibersegurança para E-commerce", "Internet das Coisas no Varejo", "Big Data para Decisão"] }
];

const CATEGORY_CONTENT: Record<string, string> = {
  "Beleza": `O mercado de beleza e estética é um dos pilares da economia brasileira, movendo bilhões anualmente. Este curso aprofunda o conhecimento técnico e estratégico necessário para se destacar.

CONTEÚDO TÉCNICO AVANÇADO:
1. ANATOMIA E FISIOLOGIA: Compreender a estrutura do fio de cabelo, as camadas da pele e como os produtos químicos interagem com o organismo. A saúde do cliente é a prioridade zero.
2. BIOSSEGURANÇA: Protocolos rigorosos de esterilização, uso de EPIs e prevenção de contaminação cruzada. Um salão seguro é um salão lucrativo.
3. TÉCNICAS DE CORTE E VISAGISMO: O visagismo não é apenas sobre estética, mas sobre identidade. Aprenda a ler o formato do rosto e a personalidade do cliente para sugerir o corte que eleva a autoestima.
4. GESTÃO DE ESTOQUE E PRODUTOS: Como evitar o desperdício de colorações e insumos. O controle por gramatura pode salvar até 15% do seu lucro mensal.
5. MARKETING DE RELACIONAMENTO: Fidelizar um cliente custa 5x menos que atrair um novo. Use o WhatsApp para lembretes de retorno e promoções de aniversariantes.

Este manual serve como guia definitivo para a excelência na prestação de serviços de beleza e estética. A técnica deve estar sempre acompanhada de um atendimento humanizado e uma gestão financeira impecável.`,

  "Varejo": `Vender produtos no século XXI exige uma integração perfeita entre o físico e o digital. O varejo moderno é omnichannel e focado na experiência.

MÓDULOS DE CONHECIMENTO:
1. PSICOLOGIA DO CONSUMIDOR: Entenda o caminho que o cliente faz desde que entra na loja até o checkout. O uso de cores, sons e aromas influencia diretamente na decisão de compra.
2. CURVA ABC E ESTOQUE: Não deixe dinheiro parado na prateleira. Foque nos produtos 'A' (80% do faturamento) e liquide os produtos 'C'.
3. VISUAL MERCHANDISING: A vitrine é o convite da sua loja. Aprenda técnicas de exposição que aumentam o ticket médio naturalmente.
4. PREVENÇÃO DE PERDAS: Furtos, quebras e vencimentos são inimigos do lucro. Implemente sistemas de auditoria diária.
5. LOGÍSTICA E LAST MILE: Entregas rápidas e baratas são o maior diferencial competitivo. Otimize suas rotas de entrega.

O sucesso no varejo é medido pelo Giro de Estoque e pela Margem de Contribuição. Este curso ensina a dominar esses indicadores para garantir a saúde do seu negócio.`,

  "Gestão": `Gestão é a arte de organizar recursos para atingir objetivos. Para um lojista, gestão é o que diferencia o sobrevivente do vencedor.

ESTRUTURA DE GESTÃO ELITE:
1. FLUXO DE CAIXA E DRE: Você precisa saber exatamente para onde cada centavo está indo. O regime de caixa e o regime de competência devem ser dominados.
2. LIDERANÇA E RH: Pessoas felizes vendem mais. Aprenda a contratar por valores e treinar por competências.
3. PLANEJAMENTO ESTRATÉGICO: Onde sua loja estará daqui a 2 anos? Defina metas SMART e acompanhe-as semanalmente.
4. CONTROLADORIA: Auditoria de notas fiscais, impostos e taxas bancárias. Pequenos erros administrativos podem gerar grandes multas.
5. EXPANSÃO E ESCALA: Quando é a hora de abrir a segunda unidade? Aprenda a analisar a viabilidade de novos investimentos.

Este treinamento é o braço direito do empreendedor moderno. Sem dados, você é apenas mais uma pessoa com uma opinião. Gerencie com números.`,

  "Marketing": `Marketing não é apenas postar no Instagram. É uma ciência de aquisição e retenção de demanda.

PILARE DO CRESCIMENTO:
1. TRÁFEGO PAGO: Google Ads e Meta Ads são máquinas de vendas se usados corretamente. Aprenda a definir seu público-alvo por comportamento e geolocalização.
2. COPYWRITING: A arte da escrita persuasiva. Suas legendas e mensagens devem resolver uma dor do cliente ou realizar um desejo.
3. MARKETING DE CONTEÚDO: Gere valor antes de pedir a venda. Eduque seu cliente sobre como usar seus produtos ou serviços.
4. CRM E WHATSAPP: O poder dos dados. Tenha uma lista de clientes organizada e faça campanhas de recompra automáticas.
5. BRANDING: O que as pessoas dizem de você quando você não está na sala. Construa uma marca forte e reconhecível.

O marketing digital nivela o jogo. Uma pequena loja pode competir com grandes redes se tiver uma estratégia inteligente e constante.`,

  "Saúde": `Gerenciar na saúde é lidar com vidas e com uma regulação complexa. Segurança e confiança são os ativos mais caros.

PROTOCOLO DE GESTÃO EM SAÚDE:
1. COMPLIANCE E LGPD: O sigilo médico e a proteção de dados sensíveis são obrigatórios. Entenda as penalidades e como se proteger.
2. PRONTUÁRIO ELETRÔNICO (PEP): Mais que um registro, uma ferramenta de decisão. O histórico completo melhora o diagnóstico e a segurança jurídica.
3. FATURAMENTO E TISS/TUSS: Reduza as glosas médicas entendendo profundamente os códigos e prazos das operadoras de saúde.
4. EXPERIÊNCIA DO PACIENTE: Do agendamento online à sala de espera. O paciente avalia a clínica como um todo, não apenas o ato médico.
5. TELEMEDICINA: Como realizar consultas remotas com segurança, ética e validade jurídica.

A saúde 4.0 exige tecnologia integrada para que o profissional possa focar no que realmente importa: o cuidado com o paciente.`,

  "Tecnologia": `A tecnologia é a infraestrutura invisível que sustenta o mundo moderno. Para o comércio, ela é o motor da eficiência.

MANUAL DE TECNOLOGIA APLICADA:
1. CIBERSEGURANÇA: Proteja sua loja contra ataques de ransomware e roubo de dados de cartões.
2. CLOUD COMPUTING: Por que usar a nuvem? Escalabilidade, segurança e acesso global aos dados do seu negócio.
3. AUTOMAÇÃO E IA: Como usar robôs para responder chats e IAs para prever o estoque futuro.
4. DESENVOLVIMENTO NO-CODE: Crie soluções internas sem precisar de programadores caros.
5. DATA SCIENCE: Transforme montanhas de dados em decisões claras. O BI (Business Intelligence) é o futuro da gestão.

Não existe mais negócio "fora da tecnologia". Entender o básico da infraestrutura digital é requisito para qualquer gestor de sucesso.`
};

// Gerador de Conteúdo Didático Realista para 1000 Cursos
const generateCourses = () => {
  const courses = [];
  
  for (let i = 1; i <= 1000; i++) {
    const poolItem = TOPICS_POOL[i % TOPICS_POOL.length];
    const topic = poolItem.topics[i % poolItem.topics.length];
    const cat = poolItem.cat;
    const videoUrl = VIDEO_SAMPLES[i % VIDEO_SAMPLES.length];
    const baseContent = CATEGORY_CONTENT[cat];
    
    courses.push({
      id: `c${i}`,
      title: `${topic} - Masterclass Profissional`,
      description: `Este treinamento completo em ${topic} foi estruturado por especialistas para capacitar lojistas que buscam a excelência. Você aprenderá os fundamentos teóricos e a aplicação prática imediata, utilizando as ferramentas do ecossistema Mercado Ágil. Com mais de 10 horas de conteúdo estruturado, este é o guia definitivo para o seu setor.`,
      category: cat,
      duration: `${Math.floor(Math.random() * 15) + 10}h`,
      lessons: 10,
      rating: (Math.random() * (5 - 4.8) + 4.8).toFixed(1),
      price: 0,
      thumb: `https://picsum.photos/seed/agil_course_${i}/600/400`,
      modules: [
        {
          title: "Módulo 1: Fundamentos e Visão Estratégica",
          lessons: [
            { id: `c${i}l1`, title: `Introdução Profissional a ${topic}`, videoUrl: videoUrl, duration: "15:20", content: `Nesta aula inaugural, exploraremos a importância vital de ${topic} para o mercado atual. Discutiremos como a evolução tecnológica e as mudanças no comportamento do consumidor exigem um novo posicionamento do lojista.\n\nCONTEÚDO DA LIÇÃO:\n${baseContent}\n\nO objetivo aqui é estabelecer as bases sólidas para o seu crescimento.` },
            { id: `c${i}l2`, title: `Análise de Mercado e Oportunidades`, videoUrl: videoUrl, duration: "18:45", content: `Identificar nichos e gaps de mercado é a chave para a diferenciação. Nesta lição, aprenderemos técnicas de análise de concorrência e mapeamento de personas para o setor de ${cat}.\n\nESTUDO DE CASO:\nComo empresas líderes utilizam ${topic} para dominar seu território geográfico e digital.` }
          ]
        },
        {
          title: "Módulo 2: Execução Técnica e Processos",
          lessons: [
            { id: `c${i}l3`, title: `Técnicas Passo a Passo de Execução`, videoUrl: videoUrl, duration: "28:30", content: `Mão na massa. Vamos configurar cada ferramenta e processo necessário para implementar ${topic} na sua rotina diária.\n\nCHECKLIST DE EXECUÇÃO:\n1. Preparação da Infraestrutura.\n2. Configuração de parâmetros no Painel Ágil.\n3. Teste de qualidade inicial.\n4. Treinamento da equipe de frente.` },
            { id: `c${i}l4`, title: `Estudos de Caso de Alta Performance`, videoUrl: videoUrl, duration: "22:00", content: `Análise profunda de lojistas que implementaram ${topic} e obtiveram ROI acima de 300%. Veremos o que eles fizeram de diferente e como você pode replicar esses sucessos hoje.` }
          ]
        },
        {
          title: "Módulo 3: Métricas, KPI e Escala",
          lessons: [
            { id: `c${i}l5`, title: `Gestão Baseada em Dados (BI)`, videoUrl: videoUrl, duration: "25:15", content: `O que não pode ser medido não pode ser melhorado. Aprenda a ler os dashboards do Mercado Ágil focados em ${topic}.\n\nKPIs CRÍTICOS:\n- Taxa de Conversão.\n- LTV (Life Time Value).\n- CAC (Custo de Aquisição).\n- NPS (Satisfação do Cliente).` },
            { id: `c${i}l6`, title: `Plano de Ação e Certificação`, videoUrl: videoUrl, duration: "12:50", content: `Conclusão da jornada teórica. Definiremos o seu plano de ação para os próximos 30 dias para garantir que o conhecimento se transforme em lucro real no seu caixa.` }
          ]
        }
      ],
      materials: [
        { 
          title: `Guia Completo: ${topic}`, 
          type: "PDF", 
          size: "8.4MB", 
          content: `MANUAL TÉCNICO OFICIAL - ÁGIL ACADEMY\n\nCURSO: ${topic}\nÁREA: ${cat}\n\nCONTEÚDO TEÓRICO INTEGRAL:\n\n${baseContent}\n\nDETALHAMENTO DOS PROCESSOS:\nEste guia foi estruturado para ser sua bíblia operacional. Recomendamos a leitura diária durante a fase de implementação. O Mercado Ágil fornece a camada de software, mas este documento fornece a camada de inteligência de negócio.\n\nRECOMENDAÇÕES:\n- Imprima este material para consulta rápida no PDV ou consultório.\n- Use os quadros de anotação para registrar insights da sua equipe.\n- Revise as métricas mensalmente.`
        },
        { 
          title: `Checklist de Implementação - ${topic}`, 
          type: "PDF", 
          size: "2.1MB", 
          content: `CHECKLIST OPERACIONAL - IMPLEMENTAÇÃO IMEDIATA\n\nCURSO: ${topic}\n\nPasso 1: Auditoria de Processos Atuais (Dia 1-2).\nPasso 2: Treinamento Técnico da Equipe (Dia 3-5).\nPasso 3: Ativação das Ferramentas no Painel Ágil (Dia 6).\nPasso 4: Lançamento para Clientes Selecionados (Dia 7-10).\nPasso 5: Análise de Resultados e Ajustes (Dia 15).\n\nEste roteiro foi validado por mais de 5.000 lojistas parceiros.`
        },
        { 
          title: `Planilha de Gestão e KPIs`, 
          type: "PDF", 
          size: "1.5MB", 
          content: `MODELO DE ACOMPANHAMENTO DE RESULTADOS\n\nNesta área, você encontra os campos para preenchimento de faturamento, custos e ROI especificamente para ${topic}. O monitoramento deve ser feito via painel, mas este documento serve para sua reunião semanal de diretoria.`
        }
      ],
      syllabus: [
        `Domínio total das melhores práticas de ${topic}`,
        `Estratégias de escala e crescimento para ${cat}`,
        "Redução drástica de perdas operacionais",
        "Aumento comprovado do LTV do cliente",
        "Uso de Inteligência Artificial para otimização de tempo",
        "Conformidade total com LGPD e normas setoriais"
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
