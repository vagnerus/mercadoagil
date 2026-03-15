
'use server';
/**
 * @fileOverview Flow para consultoria de negócios baseada em dados de vendas com correção de sintaxe.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const BusinessAdvisorInputSchema = z.object({
  merchantName: z.string(),
  salesData: z.array(z.object({
    date: z.string(),
    total: z.number(),
    itemCount: z.number()
  })),
  topProducts: z.array(z.object({
    name: z.string(),
    quantity: z.number()
  }))
});
export type BusinessAdvisorInput = z.infer<typeof BusinessAdvisorInputSchema>;

const BusinessAdvisorOutputSchema = z.object({
  summary: z.string().describe('Resumo geral da performance.'),
  advice: z.array(z.string()).describe('Lista de conselhos estratégicos.'),
  sentiment: z.string().describe('Sentimento geral do negócio (ex: Otimista, Alerta).'),
});
export type BusinessAdvisorOutput = z.infer<typeof BusinessAdvisorOutputSchema>;

export async function getBusinessAdvice(input: BusinessAdvisorInput): Promise<BusinessAdvisorOutput> {
  return businessAdvisorFlow(input);
}

const businessAdvisorPrompt = ai.definePrompt({
  name: 'businessAdvisorPrompt',
  input: {schema: BusinessAdvisorInputSchema},
  output: {schema: BusinessAdvisorOutputSchema},
  prompt: `Você é um consultor sênior de e-commerce e varejo para a plataforma Mercado Ágil.
Sua missão é analisar os dados da loja "{{{merchantName}}}" e fornecer insights valiosos.

Dados de Vendas Recentes:
{{#each salesData}}
- Data: {{{this.date}}}, Valor: R$ {{{this.total}}}, Itens: {{{this.itemCount}}}
{{/each}}

Produtos Mais Vendidos:
{{#each topProducts}}
- {{{this.name}}} ({{{this.quantity}}} unidades)
{{/each}}

Por favor, forneça um resumo profissional, uma lista de 3 conselhos práticos para aumentar o faturamento e defina o sentimento do negócio.`,
});

const businessAdvisorFlow = ai.defineFlow(
  {
    name: 'businessAdvisorFlow',
    inputSchema: BusinessAdvisorInputSchema,
    outputSchema: BusinessAdvisorOutputSchema,
  },
  async (input) => {
    const {output} = await businessAdvisorPrompt(input);
    return output!;
  }
);
