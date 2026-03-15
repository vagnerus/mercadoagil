
'use server';
/**
 * @fileOverview Flow para geração de vídeos promocionais de produtos usando Veo 2.
 */

import {ai} from '@/ai/genkit';
import {googleAI} from '@genkit-ai/google-genai';
import {z} from 'genkit';

const GenerateProductVideoInputSchema = z.object({
  productName: z.string().describe('Nome do produto para o vídeo.'),
  productImage: z.string().describe('Data URI da imagem do produto.'),
});
export type GenerateProductVideoInput = z.infer<typeof GenerateProductVideoInputSchema>;

const GenerateProductVideoOutputSchema = z.object({
  videoUrl: z.string().describe('Data URI do vídeo gerado (MP4).'),
});
export type GenerateProductVideoOutput = z.infer<typeof GenerateProductVideoOutputSchema>;

export async function generateProductVideo(input: GenerateProductVideoInput): Promise<GenerateProductVideoOutput> {
  return generateProductVideoFlow(input);
}

const generateProductVideoFlow = ai.defineFlow(
  {
    name: 'generateProductVideoFlow',
    inputSchema: GenerateProductVideoInputSchema,
    outputSchema: GenerateProductVideoOutputSchema,
  },
  async (input) => {
    // Usando Veo 2 para animar a foto do produto
    let { operation } = await ai.generate({
      model: googleAI.model('veo-2.0-generate-001'),
      prompt: [
        { text: `Create a professional 5-second cinematic food commercial for ${input.productName}. The camera should slowly rotate around the dish shown in the image. High quality, delicious lighting.` },
        { media: { url: input.productImage, contentType: 'image/jpeg' } }
      ],
      config: {
        durationSeconds: 5,
        aspectRatio: '16:9',
      },
    });

    if (!operation) throw new Error('Falha ao iniciar geração de vídeo');

    // Polling simplificado para o protótipo
    let attempts = 0;
    while (!operation.done && attempts < 12) {
      await new Promise(r => setTimeout(r, 5000));
      operation = await ai.checkOperation(operation);
      attempts++;
    }

    if (!operation.done) throw new Error('A geração do vídeo está demorando mais que o esperado. Tente novamente em instantes.');

    const videoPart = operation.output?.message?.content.find(p => !!p.media);
    if (!videoPart?.media?.url) throw new Error('Falha ao obter URL do vídeo');

    // Para o protótipo, retornamos a URL do media part
    // Em produção, você baixaria e converteria para base64 se necessário
    return { videoUrl: videoPart.media.url };
  }
);
