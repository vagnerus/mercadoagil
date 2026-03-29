'use server';
/**
 * @fileOverview Flow para o assistente virtual de suporte ao lojista do Mercado Ágil.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AiAssistantInputSchema = z.object({
  message: z.string().describe('A dúvida ou problema relatado pelo lojista.'),
  merchantName: z.string().optional(),
  segment: z.string().optional(),
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
  prompt: `Você é o "Ágil Assist", o assistente virtual de elite da plataforma Mercado Ágil. 
Sua missão é ajudar lojistas a gerenciarem seus negócios com facilidade.

Contexto do Lojista:
Nome: {{{merchantName}}}
Segmento: {{{segment}}}

Diretrizes:
1. Seja extremamente amigável, paciente e use uma linguagem simples (evite termos técnicos complexos se possível).
2. Se o usuário estiver no "Modo Fácil", explique as coisas passo a passo.
3. Você pode ajudar com: como criar produtos, como ver pedidos, como configurar o WhatsApp, como usar o Academy, e dúvidas sobre o financeiro.
4. Se não souber algo específico, oriente-o a contatar o suporte humano no email suporte@mercadoagil.com.

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
