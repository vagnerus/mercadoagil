
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

const CATEGORY_CONTENT: Record<string, string> = {
  "Beleza": `ESTUDO TÉCNICO APROFUNDADO EM ESTÉTICA E BELEZA

CAPÍTULO 1: BIOFÍSICA CAPILAR E FISIOLOGIA
O profissional de elite deve compreender que o cabelo é composto por 90% de queratina e 10% de lipídios e água. No salão, o diagnóstico capilar é o primeiro passo para o sucesso. Analise a porosidade, elasticidade e textura antes de qualquer procedimento químico. A estrutura do fio é dividida em medula, córtex e cutícula. É no córtex que ocorrem as transformações químicas, enquanto a cutícula protege a integridade do fio.

CAPÍTULO 2: BIOSSEGURANÇA E HIGIENE OPERACIONAL
A biossegurança não é opcional. Todo material perfurocortante deve ser descartado em coletores específicos. Alicates e espátulas de metal devem passar por autoclave a 121°C por 30 minutos ou 134°C por 15 minutos. A higiene do ambiente transmite confiança e evita contaminações biológicas. Lembre-se: o uso de EPIs (luvas, máscaras e aventais) protege tanto o profissional quanto o cliente.

CAPÍTULO 3: VISAGISMO E DESIGN DE IMAGEM
Visagismo é a arte de criar uma imagem personalizada que revela as qualidades do cliente. Use as linhas retas para transmitir força e poder, ou linhas curvas para delicadeza e suavidade. O corte de cabelo deve equilibrar o formato do rosto (oval, redondo, quadrado ou coração). O visagismo 3D analisa não apenas o rosto, mas a linguagem corporal e o temperamento do cliente.

CAPÍTULO 4: GESTÃO E FIDELIZAÇÃO DE ALTO IMPACTO
Um salão lucrativo foca no LTV (Life Time Value). Use o sistema de agendamento online do Mercado Ágil para reduzir o no-show em até 40%. Envie lembretes automáticos via WhatsApp e ofereça programas de cashback para garantir o retorno do cliente a cada 20 dias. A recorrência é a alma do negócio de beleza.

CAPÍTULO 5: COLORIMETRIA AVANÇADA
Dominar o círculo cromático é essencial para neutralizar tons indesejados e criar cores vibrantes. Entenda a diferença entre cores primárias, secundárias e terciárias. Aplique a técnica de pré-pigmentação em cabelos brancos e use oxidantes de volumagem correta para cada objetivo de clareamento ou depósito de cor.

CAPÍTULO 6: TRATAMENTOS TERAPÊUTICOS
A terapia capilar está em alta. Aprenda a identificar patologias como dermatite seborreica, alopecia e excesso de oleosidade. Use óleos essenciais e argiloterapia como diferenciais competitivos para atrair clientes que buscam saúde além da estética.`,

  "Varejo": `MANUAL INTEGRAL DE OPERAÇÕES NO VAREJO MODERNO

CAPÍTULO 1: PSICOLOGIA DO CONSUMIDOR E NEUROMARKETING
O consumidor decide comprar em frações de segundos. O Visual Merchandising (VM) deve guiar o olhar do cliente através do 'Caminho do Ouro'. Coloque os produtos de alta margem na altura dos olhos e os produtos de conveniência próximos ao checkout para vendas por impulso. A iluminação e a aromatização do ambiente influenciam diretamente no tempo de permanência na loja.

CAPÍTULO 2: GESTÃO DE ESTOQUE INTELIGENTE E CURVA ABC
Dinheiro na prateleira é dinheiro perdendo valor. Aplique a Curva ABC rigorosamente:
- Grupo A: 20% dos itens que geram 80% do faturamento. Monitoramento diário e nunca pode faltar.
- Grupo B: 30% dos itens com giro médio. Recomposição mensal.
- Grupo C: 50% dos itens que geram apenas 5% do faturamento. Analise se vale a pena manter no catálogo.

CAPÍTULO 3: PREVENÇÃO DE PERDAS E AUDITORIA DE ATIVOS
A ruptura de estoque é a maior causa de perda de vendas. Use leitores de código de barras e o AI Vision Scan do Mercado Ágil para realizar inventários cíclicos rápidos. Audite os lotes semanalmente para evitar produtos vencidos, avariados ou 'itens fantasmas' no sistema. O controle rígido aumenta sua margem líquida em até 5%.

CAPÍTULO 4: LOGÍSTICA DE ÚLTIMA MILHA (LAST MILE)
A entrega é a última impressão que o cliente tem da sua marca. No Mercado Ágil, use o Fleet Hub para roteirizar entregas por proximidade geográfica, reduzindo custos de combustível e tempo de espera. Ofereça frete grátis para compras acima de um ticket médio específico para incentivar o aumento do carrinho.

CAPÍTULO 5: ATENDIMENTO E EXPERIÊNCIA DO CLIENTE
Treine sua equipe para ser consultiva, não apenas vendedora. O atendimento pós-venda é onde se constrói a marca. Use o CRM para saber o que seu cliente comprou anteriormente e ofereça produtos complementares (cross-selling).

CAPÍTULO 6: INDICADORES DE PERFORMANCE (RETAIL KPIs)
Acompanhe o GMROI (Margem Bruta sobre Investimento em Estoque), a Taxa de Conversão da Loja e o Fluxo de Pedidos Diários. Dados reais permitem ajustes rápidos na estratégia de compras e promoções.`,

  "Gestão": `CURSO EXECUTIVO EM GESTÃO DE NEGÓCIOS E ALTA PERFORMANCE

CAPÍTULO 1: ENGENHARIA FINANCEIRA: FLUXO DE CAIXA E DRE
Gerenciar é tomar decisões baseadas em números. O Fluxo de Caixa mostra a liquidez (capacidade de pagar contas hoje), enquanto o DRE mostra a lucratividade real. Entenda que faturamento não é lucro. Um negócio pode faturar milhões e estar quebrando se as margens operacionais estiverem erradas. Acompanhe o EBITDA mensalmente.

CAPÍTULO 2: KPIs CRÍTICOS E DASHBOARDS DE CONTROLE
Os 4 KPIs que você deve monitorar todo dia:
1. Ticket Médio: Valor total de vendas dividido pelo número de clientes.
2. Taxa de Conversão: Porcentagem de visitantes que efetivamente compram.
3. CAC: Custo de Aquisição de Cliente (Marketing / Novos Clientes).
4. LTV: Life Time Value (Quanto o cliente deixa de lucro durante a vida dele na loja).

CAPÍTULO 3: LIDERANÇA, PROCESSOS E CULTURA ORGANIZACIONAL
Contrate pelo caráter, treine a habilidade. Crie Manuais de Processos (SOPs) para cada função. Quando o processo é claro, a equipe performa melhor e o dono ganha liberdade. Use o Painel Staff do Mercado Ágil para medir o score de performance e recompensar os melhores talentos.

CAPÍTULO 4: PLANEJAMENTO ESTRATÉGICO E ESCALA (GROWTH)
Defina metas anuais e quebre-as em metas semanais atingíveis. A escala vem através da repetição de processos bem sucedidos. Se sua primeira unidade é lucrativa e processualizada, você está pronto para o modelo de franquias ou expansão para novas filiais.

CAPÍTULO 5: NEGOCIAÇÃO COM FORNECEDORES
Use o IA Negotiator para analisar preços de mercado e garantir as melhores condições de compra. O lucro de um produto começa na hora da compra, não na venda.

CAPÍTULO 6: GESTÃO DE CRISE E CONTINUIDADE
Tenha sempre uma reserva de emergência equivalente a 6 meses de custos fixos. A estabilidade financeira permite que você aproveite oportunidades em momentos de baixa do mercado.`,

  "Marketing": `MÁQUINA DE VENDAS: ESTRATÉGIAS DE MARKETING DIGITAL E CRESCIMENTO

CAPÍTULO 1: TRÁFEGO PAGO LOCAL E GEOLOCALIZAÇÃO
Para negócios físicos, o Google Maps é o canal n° 1. Configure seu Perfil de Empresa e invista em anúncios geolocalizados. No Meta Ads, use o raio de 5km ao redor da sua loja para não desperdiçar verba com quem mora longe. Aprenda a configurar o Pixel de rastreamento no painel Mercado Ágil para medir o retorno sobre investimento (ROAS).

CAPÍTULO 2: CONTEÚDO IA E AUTORIDADE DIGITAL
Use a Inteligência Artificial para gerar descrições persuasivas e roteiros de vídeos. No Instagram, o Reels gera alcance orgânico e os Stories geram conexão e venda direta. Mostre os bastidores, o cuidado com os produtos e o depoimento de clientes reais para construir prova social.

CAPÍTULO 3: WHATSAPP MARKETING E AUTOMAÇÃO DE VENDAS
O WhatsApp é a ferramenta de fechamento mais poderosa do Brasil. Use scripts de venda persuasivos e automações de recuperação de carrinho abandonado. Não seja um spammer; entregue valor e ofertas exclusivas para sua base de clientes fiéis.

CAPÍTULO 4: BRANDING E PROPOSTA ÚNICA DE VALOR (UVP)
Por que o cliente deve comprar de você e não do vizinho? Defina sua UVP. Pode ser o atendimento ultra-rápido, a curadoria de produtos ou a experiência sensorial no ponto de venda. Branding é o que as pessoas dizem sobre você quando você não está na sala.

CAPÍTULO 5: FUNIL DE VENDAS E CONVERSÃO
Mapeie a jornada do cliente: Descoberta, Consideração, Compra e Fidelização. Otimize cada etapa para reduzir o atrito e aumentar a conversão.

CAPÍTULO 6: INFLUENCERS LOCAIS E PARCERIAS
A micro-influência local muitas vezes traz mais ROI do que grandes celebridades. Faça parcerias com pessoas que falem diretamente com sua vizinhança.`,

  "Saúde": `GESTÃO PROFISSIONAL DE SAÚDE E TELEMEDICINA ÉTICA

CAPÍTULO 1: LGPD, ÉTICA E SEGURANÇA DE DADOS SENSÍVEIS
Dados de saúde são classificados como dados sensíveis pela Lei Geral de Proteção de Dados. No Mercado Ágil, utilizamos criptografia AES-256 de ponta a ponta. Nunca compartilhe senhas e certifique-se de que todos os termos de consentimento estão assinados digitalmente e armazenados no Prontuário Eletrônico (PEP).

CAPÍTULO 2: PRONTUÁRIO ELETRÔNICO (PEP) E HISTÓRICO CLÍNICO
O prontuário é o documento jurídico mais importante da clínica. Registre cada detalhe: sintomas, hipóteses diagnósticas (CID-10), prescrições e orientações pós-consulta. Um prontuário bem preenchido é a sua melhor defesa profissional e garante a continuidade do cuidado ao paciente.

CAPÍTULO 3: FATURAMENTO TISS/TUSS E GESTÃO DE CONVÊNIOS
Evite glosas médicas conhecendo profundamente as regras das operadoras de saúde. A tabela TUSS padroniza os procedimentos. Audite as guias antes do envio em lote via XML para garantir o recebimento pontual e o equilíbrio financeiro da clínica.

CAPÍTULO 4: HUMANIZAÇÃO NO ATENDIMENTO E TELEMEDICINA
A tecnologia deve servir ao humano, não o contrário. A telemedicina amplia o acesso à saúde, mas exige uma plataforma estável. Use o Consultório Virtual integrado para realizar consultas remotas com a mesma qualidade e segurança do atendimento presencial.

CAPÍTULO 5: GESTÃO DE AGENDA E NO-SHOW
Otimize o tempo dos profissionais de saúde. Use confirmações automáticas via WhatsApp e mantenha uma lista de espera ativa para preencher cancelamentos de última hora.

CAPÍTULO 6: MARKETING MÉDICO ÉTICO
Atraia pacientes através da autoridade técnica. Produza conteúdos informativos que eduquem a população sobre prevenção e cuidados com a saúde, respeitando sempre as resoluções do conselho profissional.`,

  "Tecnologia": `TRANSFORMAÇÃO DIGITAL E INFRAESTRUTURA PARA PEQUENOS NEGÓCIOS

CAPÍTULO 1: INFRAESTRUTURA CLOUD E ESCALABILIDADE
A nuvem permite que você acesse os dados da sua loja de qualquer lugar do mundo com segurança. Entenda que se o seu site recebe 100 ou 100.000 visitas, a infraestrutura deve se adaptar automaticamente. O Mercado Ágil utiliza servidores globais com latência reduzida via CDN.

CAPÍTULO 2: AUTOMAÇÃO DE PROCESSOS OPERACIONAIS
O tempo é o recurso mais escasso do empreendedor. Automatize tarefas repetitivas: disparo de notas fiscais, atualização de estoque volumétrico e conciliação bancária via PIX. Cada processo automatizado libera horas da sua equipe para focar em estratégia e inovação.

CAPÍTULO 3: INTELIGÊNCIA ARTIFICIAL (IA) APLICADA AO NEGÓCIO
A IA não vai substituir o lojista, mas o lojista que usa IA vai substituir o que não usa. Use modelos de linguagem para criar descrições de produtos otimizadas para SEO, legendas de posts e análise preditiva de vendas baseada no seu histórico.

CAPÍTULO 4: CIBERSEGURANÇA E CONTINUIDADE DO NEGÓCIO
Backup é o seu seguro de vida digital. Tenha redundância de dados e planos de recuperação de desastres. Proteja sua rede contra ataques de força bruta e eduque sua equipe sobre o perigo do Phishing e engenharia social.

CAPÍTULO 5: DESENVOLVIMENTO NO-CODE E LOW-CODE
Personalize sua vitrine digital sem precisar de uma equipe de programadores. Use ferramentas intuitivas para criar fluxos de trabalho que atendam às necessidades específicas do seu nicho.

CAPÍTULO 6: INTERNET DAS COISAS (IOT) NO VAREJO
Sensores de presença, etiquetas inteligentes e monitoramento de temperatura para perecíveis. A tecnologia de hardware integrada ao software traz um novo nível de controle sobre a operação física.`
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
            { id: `c${i}l1`, title: `Introdução Profissional a ${topic}`, videoUrl: videoUrl, duration: "15:20", content: `Nesta aula inaugural, exploraremos a importância vital de ${topic} para o mercado atual.\n\nCONTEÚDO DA LIÇÃO:\n${baseContent}\n\nO objetivo aqui é estabelecer as bases sólidas para o seu crescimento sustentável e profissional.` },
            { id: `c${i}l2`, title: `Análise de Mercado e Oportunidades`, videoUrl: videoUrl, duration: "18:45", content: `Identificar nichos e gaps de mercado é a chave para a diferenciação competitiva.\n\nESTUDO DE CASO:\nComo empresas líderes utilizam ${topic} para dominar seu território geográfico e digital. Vamos analisar os KPIs de sucesso e como replicar esses resultados na sua operação local.` }
          ]
        },
        {
          title: "Módulo 2: Execução Técnica e Processos",
          lessons: [
            { id: `c${i}l3`, title: `Técnicas Passo a Passo de Execução`, videoUrl: videoUrl, duration: "28:30", content: `Mão na massa. Vamos configurar cada ferramenta e processo necessário para implementar ${topic} na sua rotina diária.\n\nCHECKLIST DE EXECUÇÃO:\n1. Preparação da Infraestrutura.\n2. Configuração de parâmetros no Painel Ágil.\n3. Teste de qualidade inicial.\n4. Treinamento da equipe de frente.` },
            { id: `c${i}l4`, title: `Estudos de Caso de Alta Performance`, videoUrl: videoUrl, duration: "22:00", content: `Análise profunda de lojistas que implementaram ${topic} e obtiveram ROI acima de 300%. Veremos o que eles fizeram de diferente e como você pode replicar esses sucessos hoje mesmo.` }
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
          title: `Guia Completo de Estudo: ${topic}`, 
          type: "PDF", 
          size: "12.4MB", 
          content: `MANUAL TÉCNICO OFICIAL - ÁGIL ACADEMY\n\nCURSO: ${topic}\nÁREA: ${cat}\n\nCONTEÚDO TEÓRICO INTEGRAL:\n\n${baseContent}\n\nDETALHAMENTO DOS PROCESSOS:\nEste guia foi estruturado para ser sua bíblia operacional. Recomendamos a leitura diária durante a fase de implementação. O Mercado Ágil fornece a camada de software, mas este documento fornece a camada de inteligência de negócio.\n\nRECOMENDAÇÕES:\n- Imprima este material para consulta rápida no PDV ou consultório.\n- Use os quadros de anotação para registrar insights da sua equipe.\n- Revise as métricas mensalmente.`
        },
        { 
          title: `Checklist de Implementação - ${topic}`, 
          type: "PDF", 
          size: "4.1MB", 
          content: `CHECKLIST OPERACIONAL - IMPLEMENTAÇÃO IMEDIATA\n\nCURSO: ${topic}\n\nPasso 1: Auditoria de Processos Atuais (Dia 1-2).\nPasso 2: Treinamento Técnico da Equipe (Dia 3-5).\nPasso 3: Ativação das Ferramentas no Painel Ágil (Dia 6).\nPasso 4: Lançamento para Clientes Selecionados (Dia 7-10).\nPasso 5: Análise de Resultados e Ajustes (Dia 15).\n\nEste roteiro foi validado por mais de 5.000 lojistas parceiros.`
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
