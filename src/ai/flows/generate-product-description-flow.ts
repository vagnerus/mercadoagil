'use server';
/**
 * @fileOverview This file contains the Genkit flow for generating product descriptions using AI.
 *
 * - generateProductDescription - A function that handles the AI-powered product description generation process.
 * - GenerateProductDescriptionInput - The input type for the generateProductDescription function.
 * - GenerateProductDescriptionOutput - The return type for the generateProductDescription function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateProductDescriptionInputSchema = z.object({
  productName: z.string().describe('The name of the product.'),
  keywords: z.array(z.string()).describe('A list of keywords related to the product to include in the description.'),
  attributes: z.array(z.string()).describe('Key features or selling points of the product (e.g., "Material: Leather", "Color: Red", "Weight: 200g").'),
  targetAudience: z.string().optional().describe('The target audience for this product (e.g., "young adults", "eco-conscious consumers").'),
  tone: z.string().optional().describe('The desired tone for the description (e.g., "enthusiastic", "professional", "friendly").'),
});
export type GenerateProductDescriptionInput = z.infer<typeof GenerateProductDescriptionInputSchema>;

const GenerateProductDescriptionOutputSchema = z.object({
  description: z.string().describe('The generated, attractive, and optimized product description.'),
});
export type GenerateProductDescriptionOutput = z.infer<typeof GenerateProductDescriptionOutputSchema>;

export async function generateProductDescription(input: GenerateProductDescriptionInput): Promise<GenerateProductDescriptionOutput> {
  return generateProductDescriptionFlow(input);
}

const generateProductDescriptionPrompt = ai.definePrompt({
  name: 'generateProductDescriptionPrompt',
  input: {schema: GenerateProductDescriptionInputSchema},
  output: {schema: GenerateProductDescriptionOutputSchema},
  prompt: `Você é um copywriter de marketing especializado em criar descrições de produtos atraentes e otimizadas para e-commerce. Seu objetivo é escrever uma descrição de produto persuasiva que destaque os benefícios e recursos do produto, adaptada para as informações fornecidas.

Nome do Produto: {{{productName}}}
Palavras-chave: {{#each keywords}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
Atributos/Principais Características: {{#each attributes}}- {{{this}}}
{{/each}}
{{#if targetAudience}}Público-Alvo: {{{targetAudience}}}
{{/if}}{{#if tone}}Tom Desejado: {{{tone}}}
{{/if}}

Por favor, gere uma descrição de produto detalhada, envolvente e otimizada para SEO em português. Foque em destacar os pontos de venda exclusivos e como o produto beneficia o cliente. O resultado deve ser apenas a descrição do produto, sem frases introdutórias ou conclusivas.`,
});

const generateProductDescriptionFlow = ai.defineFlow(
  {
    name: 'generateProductDescriptionFlow',
    inputSchema: GenerateProductDescriptionInputSchema,
    outputSchema: GenerateProductDescriptionOutputSchema,
  },
  async (input) => {
    const {output} = await generateProductDescriptionPrompt(input);
    return output!;
  }
);
