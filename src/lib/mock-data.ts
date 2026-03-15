
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
  "Beleza": `ESTUDO TÉCNICO APROFUNDADO EM ESTÉTICA E BELEZA - MANUAL COMPLETO

CAPÍTULO 1: BIOFÍSICA CAPILAR E FISIOLOGIA DO FIO
O profissional de elite deve compreender que o cabelo é uma estrutura complexa composta por 90% de queratina e 10% de lipídios, pigmentos e água. No salão de alta performance, o diagnóstico capilar não é uma sugestão, é o primeiro passo obrigatório. Você deve analisar a porosidade (capacidade de absorver água), a elasticidade (capacidade de esticar e voltar sem quebrar) e a textura (fino, médio ou grosso) antes de qualquer procedimento químico. A estrutura do fio é dividida em três partes principais:
1. Medula: O núcleo central, nem sempre presente em todos os fios.
2. Córtex: A camada intermediária onde residem a cor e a força mecânica. É aqui que ocorrem as transformações químicas permanentes.
3. Cutícula: A camada externa, em forma de escamas, que protege a integridade do fio. Quando as cutículas estão seladas, o brilho é máximo.

CAPÍTULO 2: BIOSSEGURANÇA E HIGIENE OPERACIONAL AVANÇADA
A biossegurança é a base da confiança do cliente. Todo material perfurocortante deve ser descartado em coletores amarelos (Descarpack). Materiais metálicos, como alicates e espátulas, devem passar por um processo rigoroso de três etapas:
- Lavagem com detergente enzimático.
- Secagem total para evitar oxidação.
- Esterilização em autoclave (121°C por 30 min ou 134°C por 15 min).
Lembre-se: O uso de EPIs (Equipamentos de Proteção Individual) como luvas de nitrilo, máscaras de alta filtragem e aventais impermeáveis protege tanto o profissional quanto o cliente de contaminações cruzadas e dermatites de contato.

CAPÍTULO 3: VISAGISMO E DESIGN DE IMAGEM PERSONALIZADA
Visagismo é a arte de criar uma imagem personalizada que revela as qualidades do cliente e esconde imperfeições. No Mercado Ágil, ensinamos o Visagismo 3D, que analisa:
- Formato do Rosto: Oval, redondo, quadrado, retangular ou coração.
- Linhas de Expressão: Linhas retas transmitem força e seriedade; linhas curvas transmitem suavidade e acolhimento.
- Temperamento: Através da análise das feições, o profissional pode sugerir cortes que equilibrem a personalidade do cliente (ex: suavizar um rosto muito angular com camadas leves).

CAPÍTULO 4: GESTÃO E FIDELIZAÇÃO DE ALTO IMPACTO (LTV)
Um salão lucrativo foca no LTV (Life Time Value). Através do sistema de agendamento online do Mercado Ágil, você pode reduzir o no-show em até 40%. A estratégia consiste em:
- Envio de lembretes automáticos via WhatsApp 24h antes.
- Programas de Cashback: Devolva 5% do valor para que o cliente use no próximo serviço.
- Histórico do Cliente: Saiba exatamente qual cor ou técnica foi usada na última visita para oferecer uma experiência personalizada e consistente.

CAPÍTULO 5: COLORIMETRIA E QUÍMICA DE TRANSFORMAÇÃO
Dominar o círculo cromático é essencial para neutralizar tons indesejados (laranja com azul, amarelo com roxo). Aprenda a técnica de pré-pigmentação para cobrir cabelos brancos 100% e como utilizar os diferentes volumes de água oxigenada (10, 20, 30 ou 40 vol) para cada objetivo de clareamento ou depósito de pigmento.

CAPÍTULO 6: TRATAMENTOS TERAPÊUTICOS E TRICOLOGIA
A terapia capilar é a nova fronteira da lucratividade. Identifique patologias comuns como dermatite seborreica, alopecia androgenética e eflúvio telógeno. Ofereça protocolos de argiloterapia, alta frequência e vacuoterapia como diferenciais competitivos para atrair clientes que buscam saúde integral, além da estética momentânea.`,

  "Varejo": `MANUAL INTEGRAL DE OPERAÇÕES NO VAREJO MODERNO - ESTRATÉGIA E EXECUÇÃO

CAPÍTULO 1: PSICOLOGIA DO CONSUMIDOR E NEUROMARKETING APLICADO
O consumidor moderno decide uma compra em frações de segundos no PDV. O Visual Merchandising (VM) deve guiar o olhar do cliente através do 'Caminho do Ouro'. Regras fundamentais:
- Exposição na Altura dos Olhos: Coloque aqui os produtos de maior margem de lucro.
- Zona de Checkout: Itens de conveniência e baixo valor para vendas por impulso.
- Iluminação e Som: Use luzes quentes para áreas de aconchego e luzes brancas para áreas de decisão técnica. A trilha sonora deve acompanhar o ritmo de movimento da loja.

CAPÍTULO 2: GESTÃO DE ESTOQUE INTELIGENTE E CURVA ABC PRO
Dinheiro parado na prateleira é dinheiro perdendo valor. Aplique a Curva ABC rigorosamente para otimizar seu capital de giro:
- Grupo A (20% dos itens): Geram 80% do faturamento. Monitoramento diário, nunca podem faltar.
- Grupo B (30% dos itens): Giro médio. Recomposição mensal.
- Grupo C (50% dos itens): Geram apenas 5% do faturamento. Avalie descontinuar ou fazer promoções 'queima de estoque' para liberar espaço.

CAPÍTULO 3: PREVENÇÃO DE PERDAS, RUPTURA E AUDITORIA DE ATIVOS
A ruptura de estoque (cliente quer comprar e não tem) é a maior causa oculta de perda de lucro. Use o AI Vision Scan do painel Mercado Ágil para realizar inventários cíclicos sem fechar a loja. Audite lotes semanalmente para evitar:
- Produtos vencidos.
- Avarias por manuseio incorreto.
- Furtos internos ou externos.
O controle rígido aumenta sua margem líquida média em até 5% ao ano.

CAPÍTULO 4: LOGÍSTICA DE ÚLTIMA MILHA (LAST MILE) E ENTREGAS
A experiência de entrega é a última impressão da sua marca. No Mercado Ágil, utilize o Fleet Hub para roteirizar entregas por proximidade geográfica. Isso reduz custos de combustível e aumenta a produtividade dos seus entregadores. Ofereça 'Frete Grátis' apenas para pedidos acima do seu Ticket Médio para incentivar o cliente a comprar mais itens.

CAPÍTULO 5: CRM, ATENDIMENTO E EXPERIÊNCIA DO CLIENTE OMNICHANNEL
O cliente não diferencia mais o físico do digital. Ele quer comprar online e trocar na loja, ou ver na loja e receber em casa. Use o CRM integrado para conhecer o histórico de compras e preferências. Envie mensagens de WhatsApp personalizadas em datas especiais ou quando chegar uma coleção que combina com o perfil dele.

CAPÍTULO 6: INDICADORES DE PERFORMANCE E BUSINESS INTELLIGENCE (KPIs)
Acompanhe os números reais do seu varejo:
- GMROI: Margem Bruta sobre Investimento em Estoque.
- Conversão de Loja: Quantas pessoas entraram vs. Quantas compraram.
- PA (Peças por Atendimento): Quantidade média de itens no carrinho.
Dados reais permitem ajustes rápidos na estratégia de compras e marketing.`,

  "Gestão": `CURSO EXECUTIVO EM GESTÃO DE NEGÓCIOS E ALTA PERFORMANCE EMPRESARIAL

CAPÍTULO 1: ENGENHARIA FINANCEIRA: FLUXO DE CAIXA, DRE E EBITDA
Gerenciar é tomar decisões baseadas em evidências numéricas, não em intuição.
- Fluxo de Caixa: Mostra a sua liquidez (capacidade de pagar boletos hoje).
- DRE (Demonstrativo de Resultado do Exercício): Mostra se o negócio é lucrativo no papel.
- EBITDA: O lucro operacional antes de juros e impostos.
Entenda que faturamento alto não significa lucro. Um negócio pode faturar 1 milhão e estar quebrando se a margem de contribuição estiver errada.

CAPÍTULO 2: OS 4 KPIs CRÍTICOS QUE TODO DONO DEVE MONITORAR
Para ter um negócio sob controle, você precisa olhar diariamente para:
1. Ticket Médio: Valor total de vendas / número de pedidos.
2. CAC (Custo de Aquisição): Investimento em marketing / novos clientes.
3. Churn Rate: Quantos clientes você perdeu para a concorrência.
4. ROI: Retorno sobre o investimento feito em novas ferramentas ou estoque.

CAPÍTULO 3: LIDERANÇA DE EQUIPES, PROCESSOS E CULTURA (SOPs)
Contrate pelo caráter e atitude, treine a habilidade técnica. Crie SOPs (Standard Operating Procedures) ou Manuais de Processos para cada função. Quando o processo é claro, a equipe performa melhor e você, dono, ganha liberdade. Use o Painel Staff do Mercado Ágil para medir o score de performance individual e recompensar os melhores talentos.

CAPÍTULO 4: PLANEJAMENTO ESTRATÉGICO E ESCALA (GROWTH HACKING)
Defina metas anuais e quebre-as em metas semanais atingíveis. A escala vem através da repetição de processos que dão certo. Se a sua primeira unidade é lucrativa e roda sem você, você está pronto para o modelo de franquias ou para abrir uma nova filial em outra região.

CAPÍTULO 5: NEGOCIAÇÃO E GESTÃO DE FORNECEDORES (VENDORS)
Use o IA Negotiator do painel para analisar os preços de mercado e garantir que você está comprando bem. Lembre-se: o lucro de um produto começa na hora em que você o compra, e não apenas na hora da venda.

CAPÍTULO 6: GESTÃO DE RISCO, RESERVA E CONTINUIDADE DO NEGÓCIO
Tenha sempre uma reserva de emergência equivalente a 6 meses de custos fixos. A estabilidade financeira te dá poder de negociação e permite que você aproveite as crises do mercado para comprar concorrentes ou novos ativos por preços menores.`,

  "Marketing": `MÁQUINA DE VENDAS: ESTRATÉGIAS AVANÇADAS DE MARKETING DIGITAL E GROWTH

CAPÍTULO 1: TRÁFEGO PAGO LOCAL E GEOLOCALIZAÇÃO ESTRATÉGICA
Para negócios físicos, o Google Maps é o canal de aquisição n° 1. Mantenha seu Perfil de Empresa atualizado com fotos reais e boas avaliações. No Meta Ads (Instagram/Facebook), anuncie em um raio de 5km ao redor do seu CEP para garantir que quem vê o anúncio pode realmente ir até você. Configure o Facebook Pixel ID no painel Mercado Ágil para rastrear quem clicou e não comprou.

CAPÍTULO 2: CONTEÚDO IA, STORYTELLING E AUTORIDADE DE MARCA
Use a IA para gerar descrições persuasivas (copywriting) e roteiros para vídeos curtos. O Instagram Reels gera alcance orgânico (novas pessoas), enquanto os Stories geram conexão e venda direta (clientes atuais). Mostre os bastidores, a chegada de mercadoria e resolva as dúvidas frequentes para construir prova social e autoridade no seu nicho.

CAPÍTULO 3: WHATSAPP MARKETING, CRM E AUTOMAÇÃO DE FUNIL
O WhatsApp é a maior ferramenta de fechamento de vendas do Brasil.
- Use scripts persuasivos para converter orçamentos em vendas.
- Ative as automações de recuperação de carrinho abandonado do Mercado Ágil.
- Não envie spam; entregue valor, convites para eventos exclusivos e cupons personalizados para a sua base fiel.

CAPÍTULO 4: BRANDING E PROPOSTA ÚNICA DE VALOR (UVP)
Por que o cliente deve escolher você e não o vizinho mais barato? Defina sua UVP. Pode ser o atendimento ultra-personalizado, a curadoria exclusiva de itens ou a velocidade de entrega. Branding não é um logo bonito, é a promessa que você faz e cumpre em cada atendimento.

CAPÍTULO 5: OTIMIZAÇÃO DE CONVERSÃO (CRO) E JORNADA DO CLIENTE
Mapeie os pontos de atrito no seu site ou loja física. Se o checkout demora demais, você perde venda. Teste diferentes cores de botões, fotos de ângulos diversos e descrições técnicas detalhadas para aumentar a confiança do comprador.

CAPÍTULO 6: INFLUENCERS LOCAIS E CO-MARKETING
A micro-influência da sua cidade ou bairro muitas vezes traz mais ROI do que grandes celebridades. Faça parcerias com perfis que falem diretamente com o seu público-alvo geográfico e crie cupons de desconto exclusivos para a audiência deles.`,

  "Saúde": `GESTÃO PROFISSIONAL DE SAÚDE, TELEMEDICINA E ÉTICA CLÍNICA

CAPÍTULO 1: LGPD, SEGURANÇA DA INFORMAÇÃO E PRIVACIDADE DO PACIENTE
Dados de saúde são classificados como 'dados sensíveis' pela Lei Geral de Proteção de Dados. No Mercado Ágil, utilizamos criptografia AES-256 de nível bancário.
- Nunca compartilhe sua senha de acesso.
- Certifique-se de que todos os Termos de Consentimento Livre e Esclarecido (TCLE) estão assinados digitalmente e armazenados no Prontuário Eletrônico (PEP).

CAPÍTULO 2: PRONTUÁRIO ELETRÔNICO (PEP) E HISTÓRICO CLÍNICO INTEGRADO
O prontuário é o documento jurídico-médico mais importante da sua jornada. Registre cada detalhe: sintomas relatados, hipóteses diagnósticas (CID-10), prescrições medicamentosas e orientações pós-consulta. Um prontuário bem preenchido é a sua melhor defesa profissional e garante que qualquer profissional da sua rede possa continuar o tratamento com excelência.

CAPÍTULO 3: FATURAMENTO TISS/TUSS E GESTÃO DE CONVÊNIOS MÉDICOS
Evite glosas (não recebimento) conhecendo as regras das operadoras de saúde. A tabela TUSS padroniza os códigos de procedimentos. No painel, audite as guias antes de gerar o lote XML para garantir o recebimento em dia e manter a saúde financeira da sua clínica.

CAPÍTULO 4: TELEMEDICINA NA PRÁTICA E HUMANIZAÇÃO DIGITAL
A tecnologia deve ser uma ponte, não um muro. A telemedicina amplia o acesso à saúde para áreas remotas ou pacientes com mobilidade reduzida. Use o Consultório Virtual integrado para consultas remotas com vídeo em HD, mantendo a mesma ética e acolhimento do consultório físico.

CAPÍTULO 5: GESTÃO DE AGENDA, NO-SHOW E FILA DE ESPERA
Otimize o tempo precioso dos especialistas. Use as confirmações automáticas via WhatsApp do Mercado Ágil para reduzir faltas. Mantenha uma 'Lista de Espera Inteligente' para preencher rapidamente horários que vagaram por cancelamentos inesperados.

CAPÍTULO 6: MARKETING MÉDICO E AUTORIDADE TÉCNICA ÉTICA
Atraia pacientes pela confiança. Produza conteúdos educativos que ajudem a população a prevenir doenças. Respeite sempre as resoluções dos conselhos profissionais (CFM, COFEN, etc.) sobre publicidade na área da saúde.`,

  "Tecnologia": `TRANSFORMAÇÃO DIGITAL, INFRAESTRUTURA CLOUD E FUTURO DO VAREJO

CAPÍTULO 1: INFRAESTRUTURA CLOUD E ESCALABILIDADE AUTOMÁTICA
O Mercado Ágil roda em uma estrutura de microsserviços na nuvem. Isso significa que se o seu site recebe 100 ou 1 milhão de visitas simultâneas, os servidores se expandem automaticamente para suportar a carga. Você não precisa se preocupar com queda de sistema no Black Friday ou em datas de pico.

CAPÍTULO 2: AUTOMAÇÃO DE PROCESSOS OPERACIONAIS (ROBOTIC PROCESS AUTOMATION)
O tempo é o seu ativo mais escasso. Automatize tudo o que for repetitivo:
- Emissão de notas fiscais (NFC-e / NF-e).
- Baixa de estoque via API.
- Conciliação bancária automática via Webhooks de PIX.
Cada processo automatizado libera horas da sua equipe para focar em estratégia e inovação real.

CAPÍTULO 3: INTELIGÊNCIA ARTIFICIAL (IA) APLICADA AO DIA A DIA DO LOJISTA
A IA não vai te substituir, mas quem usa IA vai substituir quem não usa.
- Modelos de Linguagem: Para criar descrições otimizadas para SEO.
- Visão Computacional: Para contar estoque visualmente via câmera.
- Análise Preditiva: Para prever quanto você vai vender no próximo mês baseado no histórico dos últimos 2 anos.

CAPÍTULO 4: CIBERSEGURANÇA E CONTINUIDADE DOS NEGÓCIOS
O backup é o seu seguro de vida digital. No Mercado Ágil, realizamos snapshots de dados a cada 60 minutos. Proteja sua rede interna contra Phishing e ataques de Engenharia Social. Use autenticação em dois fatores (2FA) em todas as suas contas corporativas.

CAPÍTULO 5: DESENVOLVIMENTO NO-CODE, LOW-CODE E CUSTOMIZAÇÃO
Você não precisa de uma equipe de TI para ter uma vitrine exclusiva. Use as ferramentas de arrastar e soltar do painel para personalizar cores, banners e fluxos de checkout. A tecnologia Low-Code democratiza o acesso a sistemas que antes custariam centenas de milhares de reais.

CAPÍTULO 6: INTERNET DAS COISAS (IOT) E O NOVO VAREJO FÍSICO
Sensores de movimento para contar fluxo de loja, etiquetas eletrônicas de preço que mudam sozinhas e monitoramento de temperatura para produtos perecíveis. A tecnologia de hardware integrada ao seu painel Mercado Ágil traz o controle total do mundo físico para a palma da sua mão.`
};

const generateCourses = () => {
  const courses = [];
  
  for (let i = 1; i <= 1000; i++) {
    const poolItem = TOPICS_POOL[i % TOPICS_POOL.length];
    const topic = poolItem.topics[i % poolItem.topics.length];
    const cat = poolItem.cat;
    const videoUrl = VIDEO_SAMPLES[i % VIDEO_SAMPLES.length];
    const baseContent = CATEGORY_CONTENT[cat];
    
    const durationHours = (i % 15) + 10;
    const ratingValue = (4.5 + (i % 6) / 10).toFixed(1);

    courses.push({
      id: `c${i}`,
      title: `${topic} - Masterclass Profissional`,
      description: `Este treinamento completo em ${topic} foi estruturado por especialistas de mercado para capacitar lojistas que buscam a excelência operacional. Você aprenderá desde os fundamentos teóricos até a aplicação prática imediata utilizando as ferramentas do ecossistema Mercado Ágil. Este é o guia definitivo para o seu setor.`,
      category: cat,
      duration: `${durationHours}h`,
      lessons: 10,
      rating: ratingValue,
      price: 0,
      thumb: `https://picsum.photos/seed/agil_course_${i}/600/400`,
      modules: [
        {
          title: "Módulo 1: Fundamentos e Visão Estratégica",
          lessons: [
            { id: `c${i}l1`, title: `Introdução Profissional a ${topic}`, videoUrl: videoUrl, duration: "15:20", content: `Nesta lição inaugural, mergulharemos na importância vital de ${topic} para o sucesso do seu negócio no cenário atual.\n\nCONTEÚDO TÉCNICO:\n${baseContent}\n\nO objetivo é estabelecer as bases sólidas para sua expansão.` },
            { id: `c${i}l2`, title: `Análise de Cenário e Oportunidades`, videoUrl: videoUrl, duration: "18:45", content: `Entender os gaps do mercado local é a chave para a diferenciação. Analisaremos como empresas líderes aplicam ${topic} para dominar seu setor e como você pode replicar esses modelos de sucesso.` }
          ]
        },
        {
          title: "Módulo 2: Protocolos de Execução e Processos",
          lessons: [
            { id: `c${i}l3`, title: `Técnicas de Execução Passo a Passo`, videoUrl: videoUrl, duration: "28:30", content: `Agora vamos para a prática. Configuraremos cada ferramenta necessária para implementar ${topic} no seu dia a dia operacional.\n\nCHECKLIST:\n1. Auditoria da infraestrutura atual.\n2. Parametrização no Painel Mercado Ágil.\n3. Treinamento da equipe de linha de frente.` },
            { id: `c${i}l4`, title: `Estudos de Caso e ROI Real`, videoUrl: videoUrl, duration: "22:00", content: `Veremos exemplos reais de lojistas que, ao dominar ${topic}, aumentaram sua margem líquida significativamente. Veremos os erros comuns a evitar.` }
          ]
        },
        {
          title: "Módulo 3: Métricas, Gestão e Certificação",
          lessons: [
            { id: `c${i}l5`, title: `Gestão por Indicadores (Dashboards)`, videoUrl: videoUrl, duration: "25:15", content: `Aprenda a ler os dados que o Mercado Ágil gera sobre ${topic}. O que não é medido não pode ser gerenciado.\n\nINDICADORES CHAVE:\n- Conversão Direta.\n- NPS Segmentado.\n- Eficiência de Custo.` },
            { id: `c${i}l6`, title: `Plano de Ação e Prova Final`, videoUrl: videoUrl, duration: "12:50", content: `Conclusão da jornada. Definiremos seu roadmap para os próximos 30 dias. Ao final desta lição, o Quiz de certificação será liberado.` }
          ]
        }
      ],
      materials: [
        { 
          title: `Manual Oficial de Treinamento: ${topic}`, 
          type: "PDF", 
          size: "15.8MB", 
          content: `GUIA TÉCNICO INSTITUCIONAL - ÁGIL ACADEMY\n\nCURSO: ${topic}\nMODALIDADE: EAD / ELITE\n\nESTE É O SEU MATERIAL DE REFERÊNCIA INTEGRAL. ABAIXO, O CONTEÚDO TEÓRICO COMPLETO PARA ESTUDO E REVISÃO:\n\n${baseContent}\n\nORIENTAÇÕES ADICIONAIS:\n- Este manual deve ser lido na íntegra para a realização da prova de certificação.\n- Utilize os quadros de anotações para registrar ideias de implementação no seu PDV.\n- Consulte as tabelas técnicas sempre que houver dúvida em processos operacionais.`
        },
        { 
          title: `Checklist de Implantação Rápida`, 
          type: "PDF", 
          size: "5.2MB", 
          content: `ROTEIRO DE IMPLEMENTAÇÃO - ${topic}\n\nSiga estes passos cronológicos para ver resultados em até 7 dias:\n\nPasso 1: Diagnóstico Situacional (Dia 1).\nPasso 2: Configuração de Software (Dia 2).\nPasso 3: Briefing com a Equipe (Dia 3).\nPasso 4: Teste em Lote Reduzido (Dia 4).\nPasso 5: Lançamento Público (Dia 5).\n\nA metodologia Ágil Academy foi testada e aprovada por mais de 10.000 empreendedores.`
        }
      ],
      syllabus: [
        `Domínio integral de ${topic}`,
        `Estratégias de escala baseadas na vertical ${cat}`,
        "Redução comprovada de custos operacionais",
        "Aumento da satisfação e retenção do cliente (LTV)",
        "Uso avançado de IA para ganho de produtividade",
        "Conformidade técnica e ética total"
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
