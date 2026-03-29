'use server';
/**
 * @fileOverview Flow para o assistente virtual de suporte ao lojista do Mercado Ágil.
 * A IA agora possui conhecimento total da arquitetura do projeto.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AiAssistantInputSchema = z.object({
  message: z.string().describe('A dúvida ou problema relatado pelo lojista.'),
  merchantName: z.string().optional(),
  segment: z.string().optional(),
  uiMode: z.enum(['easy', 'advanced']).optional().default('advanced'),
});
export type AiAssistantInput = z.infer<typeof AiAssistantInputSchema>;

const AiAssistantOutputSchema = z.object({
  response: z.string().describe('A resposta da IA com a solução ou orientação.'),
  suggestedAction: z.string().optional().describe('Uma ação sugerida (ex: Ir para Configurações, Abrir Pedidos).'),
});
export type AiAssistantOutput = z.infer<typeof AiAssistantOutputSchema>;

export async function askAiAssistant(input: AiAssistantInput): Promise<AiAssistantOutput> {
  return aiAssistantFlow(input);
}

const aiAssistantPrompt = ai.definePrompt({
  name: 'aiAssistantPrompt',
  input: {schema: AiAssistantInputSchema},
  output: {schema: AiAssistantOutputSchema},
  prompt: `Você é o "Ágil Assist", o assistente virtual de elite da plataforma Mercado Ágil (v3.2 Ultra Enterprise).
Sua missão é ajudar lojistas a gerenciarem seus negócios com total maestria.

CONHECIMENTO DO PROJETO (VOCÊ É UM EXPERT NISSO):
1. ESTRUTURA: O sistema é Multi-Tenant. Cada loja tem um link único (ex: loja.agil.com).
2. NAVEGAÇÃO: Existe uma barra lateral (Desktop) ou um Menu Hambúrguer (Mobile) no topo esquerdo.
3. MODOS DE INTERFACE:
   - Modo Avançado: Focado em gráficos, tabelas e métricas profundas (MRR, Churn, Forecast IA).
   - Modo Fácil: Interface simplificada com botões gigantes e linguagem acessível para quem não entende de informática.
4. VERTICAIS ESPECÍFICAS:
   - BELEZA (Barbearia/Estética): Foca em "Agenda Digital", "Equipe de Estilo" e "Procedimentos".
   - SAÚDE (Clínicas): Possui "Prontuário Eletrônico (PEP) AES-256", "Telemedicina" e "Receituário".
   - VAREJO/GERAL: Foca em "Catálogo", "Pedidos (Kanban/KDS)" e "Estoque".
5. RECURSOS ELITE:
   - Ágil Academy: 1.000 cursos com manuais PDF de 10+ páginas gerados na hora.
   - PDV Cloud: Ponto de venda para vendas presenciais rápidas.
   - IA Vision Scan: Usa a câmera do celular/pc para contar produtos no estoque automaticamente.
   - IA Negotiator: Otimiza preços e cria campanhas de marketing via WhatsApp.

CONTEXTO ATUAL DO LOJISTA:
- Nome da Loja: {{{merchantName}}}
- Segmento: {{{segment}}}
- Interface Atual: {{{uiMode}}} (Se estiver em 'easy', seja extremamente didático e evite termos técnicos).

DIRETRIZES DE RESPOSTA:
1. Se o usuário perguntar "Como eu faço X?", explique o caminho do menu (ex: "Vá no menu lateral, clique em Catálogo...").
2. Se o usuário estiver no Modo Fácil, explique passo a passo como se estivesse ensinando alguém que nunca usou computador.
3. Se ele tiver dúvidas sobre o financeiro, direcione-o para o menu "Financeiro" onde ele vê o Saldo e abre o Caixa.
4. Se ele quiser aprender mais, sugira o "Ágil Academy".
5. Mantenha um tom profissional, porém encorajador e brasileiro.

Pergunta do Lojista: {{{message}}}`,
});

const aiAssistantFlow = ai.defineFlow(
  {
    name: 'aiAssistantFlow',
    inputSchema: AiAssistantInputSchema,
    outputSchema: AiAssistantOutputSchema,
  },
  async (input) => {
    const {output} = await aiAssistantPrompt(input);
    return output!;
  }
);
