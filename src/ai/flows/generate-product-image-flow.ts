'use server';
/**
 * @fileOverview Flow para geração de imagens de produtos usando Imagen 4.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateProductImageInputSchema = z.object({
  productName: z.string().describe('Nome do produto para o qual gerar a imagem.'),
  style: z.string().optional().describe('Estilo da foto (ex: studio, rústico, minimalista).'),
});
export type GenerateProductImageInput = z.infer<typeof GenerateProductImageInputSchema>;

const GenerateProductImageOutputSchema = z.object({
  imageUrl: z.string().describe('Data URI da imagem gerada.'),
});
export type GenerateProductImageOutput = z.infer<typeof GenerateProductImageOutputSchema>;

export async function generateProductImage(input: GenerateProductImageInput): Promise<GenerateProductImageOutput> {
  return generateProductImageFlow(input);
}

const generateProductImageFlow = ai.defineFlow(
  {
    name: 'generateProductImageFlow',
    inputSchema: GenerateProductImageInputSchema,
    outputSchema: GenerateProductImageOutputSchema,
  },
  async (input) => {
    const prompt = `A professional commercial food photograph of ${input.productName}, ${input.style || 'studio lighting, high resolution, appetizing, clean background'}. 4k resolution, bokeh effect.`;
    
    const { media } = await ai.generate({
      model: 'googleai/imagen-4.0-fast-generate-001',
      prompt: prompt,
    });

    if (!media || !media.url) {
      throw new Error('Falha ao gerar imagem');
    }

    return { imageUrl: media.url };
  }
);
