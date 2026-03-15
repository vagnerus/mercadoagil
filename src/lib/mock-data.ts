
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
  "Beleza": `O mercado de beleza e estética exige precisão técnica e um profundo conhecimento da fisiologia humana aplicada à estética.

CAPÍTULO 1: FISIOLOGIA DO CABELO E PELE
O profissional de elite deve compreender que o cabelo é composto por 90% de queratina e 10% de lipídios e água. No salão, o diagnóstico capilar é o primeiro passo para o sucesso. Analise a porosidade, elasticidade e textura antes de qualquer procedimento químico.

CAPÍTULO 2: BIOSSEGURANÇA E HIGIENE
A biossegurança não é opcional. Todo material perfurocortante deve ser descartado em coletores específicos. Alicates e espátulas de metal devem passar por autoclave a 121°C por 30 minutos ou 134°C por 15 minutos. A higiene do ambiente transmite confiança e evita contaminações biológicas.

CAPÍTULO 3: VISAGISMO E DESIGN
Visagismo é a arte de criar uma imagem personalizada que revela as qualidades do cliente. Use as linhas retas para transmitir força e poder, ou linhas curvas para delicadeza e suavidade. O corte de cabelo deve equilibrar o formato do rosto (oval, redondo, quadrado ou coração).

CAPÍTULO 4: GESTÃO E FIDELIZAÇÃO
Um salão lucrativo foca no LTV (Life Time Value). Use o sistema de agendamento online do Mercado Ágil para reduzir o no-show em até 40%. Envie lembretes automáticos via WhatsApp e ofereça programas de cashback para garantir o retorno do cliente a cada 20 dias.`,

  "Varejo": `Vender produtos hoje requer uma estratégia omnichannel, unindo a conveniência do digital com a experiência do físico.

CAPÍTULO 1: PSICOLOGIA DO CONSUMIDOR
O consumidor decide comprar em frações de segundos. O Visual Merchandising (VM) deve guiar o olhar do cliente. Coloque os produtos de alta margem na altura dos olhos e os produtos de conveniência próximos ao checkout para vendas por impulso.

CAPÍTULO 2: GESTÃO DE ESTOQUE INTELIGENTE
Dinheiro na prateleira é dinheiro perdendo valor. Aplique a Curva ABC:
- Grupo A: 20% dos itens que geram 80% do faturamento. Monitoramento diário.
- Grupo B: 30% dos itens com giro médio.
- Grupo C: 50% dos itens que geram apenas 5% do faturamento. Liquide-os.

CAPÍTULO 3: PREVENÇÃO DE PERDAS E AUDITORIA
A ruptura de estoque é a maior causa de perda de vendas. Use leitores de código de barras e o AI Vision Scan do Mercado Ágil para inventários rápidos. Audite os lotes semanalmente para evitar produtos vencidos ou avariados.

CAPÍTULO 4: EXPERIÊNCIA E LOGÍSTICA
A entrega é a última impressão que o cliente tem. No Mercado Ágil, use o Fleet Hub para roteirizar entregas por proximidade, reduzindo custos de combustível e tempo de espera. O cliente satisfeito compra novamente.`,

  "Gestão": `Gerenciar é tomar decisões baseadas em dados, não em palpites.

CAPÍTULO 1: FLUXO DE CAIXA E DRE
O Fluxo de Caixa mostra a liquidez, enquanto o DRE mostra a lucratividade. Um negócio pode ter dinheiro no caixa mas estar operando no prejuízo se as margens estiverem erradas. Acompanhe o EBITDA mensalmente para entender a saúde real da operação.

CAPÍTULO 2: INDICADORES (KPIs)
Os 4 KPIs que você deve monitorar todo dia:
1. Ticket Médio: Quanto cada cliente gasta em média.
2. Taxa de Conversão: Quantos visitantes se tornam compradores.
3. CAC: Quanto custa adquirir um novo cliente.
4. Churn: Quantos clientes você está perdendo.

CAPÍTULO 3: LIDERANÇA E PROCESSOS
Contrate pelo caráter, treine a habilidade. Crie Manuais de Processos (SOPs) para cada função. Quando o processo é claro, a equipe performa melhor e o dono ganha liberdade. Use o Painel Staff para medir o score de performance de cada colaborador.

CAPÍTULO 4: PLANEJAMENTO E ESCALA
Defina metas anuais e quebre-as em metas semanais. A escala vem através da repetição de processos bem sucedidos. Se sua primeira unidade é lucrativa e processualizada, você está pronto para o modelo de franquias.`,

  "Marketing": `Marketing de elite é sobre atenção e conversão em canais onde seu público está.

CAPÍTULO 1: TRÁFEGO PAGO LOCAL
Para negócios físicos, o Google Maps é o canal n° 1. Configure seu Perfil de Empresa e invista em anúncios geolocalizados. No Meta Ads, use o raio de 5km ao redor da sua loja para não desperdiçar verba com quem mora longe.

CAPÍTULO 2: CONTEÚDO E AUTORIDADE
No Instagram, o Reels gera alcance e os Stories geram conexão. Mostre os bastidores, o cuidado com os produtos e o depoimento de clientes reais. A confiança é a moeda do novo marketing.

CAPÍTULO 3: WHATSAPP MARKETING IA
O WhatsApp é a ferramenta de fechamento mais poderosa do Brasil. Use scripts de venda persuasivos e automações de recuperação de carrinho. Não seja um spammer; entregue valor e ofertas exclusivas para quem já comprou de você.

CAPÍTULO 4: BRANDING E DIFERENCIAÇÃO
Por que o cliente deve comprar de você e não do vizinho? Defina sua Proposta Única de Valor (UVP). Pode ser o atendimento ultra-rápido, a curadoria de produtos ou a experiência sensorial no ponto de venda.`,

  "Saúde": `A gestão na saúde exige conformidade rigorosa e foco absoluto na segurança do paciente.

CAPÍTULO 1: LGPD E SEGURANÇA DE DADOS
Dados de saúde são classificados como dados sensíveis pela Lei Geral de Proteção de Dados. O Mercado Ágil utiliza criptografia AES-256. Nunca compartilhe senhas e certifique-se de que o consentimento do paciente está assinado digitalmente.

CAPÍTULO 2: PRONTUÁRIO ELETRÔNICO (PEP)
O prontuário é o documento jurídico mais importante da clínica. Registre cada detalhe: sintomas, hipóteses diagnósticas (CID), prescrições e orientações pós-consulta. Um prontuário bem preenchido é a sua melhor defesa profissional.

CAPÍTULO 3: FATURAMENTO TISS/TUSS
Evite glosas médicas conhecendo as regras das operadoras. A tabela TUSS padroniza os procedimentos. Audite as guias antes do envio em lote via XML para garantir o recebimento pontual.

CAPÍTULO 4: HUMANIZAÇÃO E TELEMEDICINA
A tecnologia deve servir ao humano. A telemedicina amplia o acesso, mas exige uma plataforma estável e segura. Use o Consultório Virtual da Ágil Academy para consultas remotas integradas ao prontuário, garantindo a mesma qualidade do presencial.`,

  "Tecnologia": `A tecnologia é a espinha dorsal de qualquer negócio escalável no século XXI.

CAPÍTULO 1: INFRAESTRUTURA E CLOUD
A nuvem permite que você acesse os dados da sua loja de qualquer lugar do mundo. Entenda o conceito de escalabilidade: se o seu site recebe 100 ou 100.000 visitas, a infraestrutura deve se adaptar automaticamente para não cair.

CAPÍTULO 2: AUTOMAÇÃO DE PROCESSOS
O tempo é o recurso mais escasso. Automatize tarefas repetitivas: disparo de notas fiscais, atualização de estoque e conciliação bancária. Cada processo automatizado libera horas da sua equipe para focar em estratégia e vendas.

CAPÍTULO 3: INTELIGÊNCIA ARTIFICIAL (IA)
A IA não vai substituir o lojista, mas o lojista que usa IA vai substituir o que não usa. Use modelos de linguagem para criar descrições de produtos, legendas de posts e até para analisar tendências de compras futuras baseadas no seu histórico.

CAPÍTULO 4: SEGURANÇA E CONTINUIDADE
Backup é seguro de vida. Tenha redundância de dados e planos de recuperação de desastres. Proteja sua rede contra ataques de força bruta e eduque sua equipe sobre o perigo do Phishing.`
};

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
