'use server';
/**
 * @fileOverview Flow para geração de campanhas de marketing personalizadas.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const MarketingCampaignInputSchema = z.object({
  merchantName: z.string(),
  promotionGoal: z.string().describe('Ex: Liquidar estoque, Atrair novos clientes, Lançamento'),
  featuredProducts: z.array(z.string()),
  couponCode: z.string().optional(),
});
export type MarketingCampaignInput = z.infer<typeof MarketingCampaignInputSchema>;

const MarketingCampaignOutputSchema = z.object({
  whatsappMessage: z.string().describe('Mensagem formatada para WhatsApp com emojis.'),
  instagramCaption: z.string().describe('Legenda para post no Instagram com hashtags.'),
  emailSubject: z.string().describe('Assunto chamativo para e-mail marketing.'),
});
export type MarketingCampaignOutput = z.infer<typeof MarketingCampaignOutputSchema>;

export async function generateMarketingCampaign(input: MarketingCampaignInput): Promise<MarketingCampaignOutput> {
  return marketingCampaignFlow(input);
}

const marketingCampaignPrompt = ai.definePrompt({
  name: 'marketingCampaignPrompt',
  input: {schema: MarketingCampaignInputSchema},
  output: {schema: MarketingCampaignOutputSchema},
  prompt: `Você é um especialista em Marketing Digital para E-commerce.
Crie uma campanha de marketing para a loja "{{{merchantName}}}".

Objetivo da Campanha: {{{promotionGoal}}}
Produtos em Destaque: {{#each featuredProducts}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
{{#if couponCode}}Cupom de Desconto: {{{couponCode}}}{{/if}}

Gere 3 peças de conteúdo:
1. Uma mensagem de WhatsApp envolvente com emojis.
2. Uma legenda de Instagram com hashtags relevantes.
3. Um assunto de e-mail que gere alta taxa de abertura.

O tom deve ser persuasivo e adequado ao público brasileiro.`,
});

const marketingCampaignFlow = ai.defineFlow(
  {
    name: 'marketingCampaignFlow',
    inputSchema: MarketingCampaignInputSchema,
    outputSchema: MarketingCampaignOutputSchema,
  },
  async (input) => {
    const {output} = await marketingCampaignPrompt(input);
    return output!;
  }
);
