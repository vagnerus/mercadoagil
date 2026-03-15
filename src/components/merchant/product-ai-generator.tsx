"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sparkles, Loader2, Image as ImageIcon } from "lucide-react";
import { generateProductDescription } from "@/ai/flows/generate-product-description-flow";
import { generateProductImage } from "@/ai/flows/generate-product-image-flow";
import { useToast } from "@/hooks/use-toast";

interface ProductAiGeneratorProps {
  onDescriptionGenerated: (description: string) => void;
  onImageGenerated?: (imageUrl: string) => void;
  productName: string;
}

export function ProductAiGenerator({ onDescriptionGenerated, onImageGenerated, productName }: ProductAiGeneratorProps) {
  const [loadingText, setLoadingText] = useState(false);
  const [loadingImage, setLoadingImage] = useState(false);
  const [keywords, setKeywords] = useState("");
  const [attributes, setAttributes] = useState("");
  const { toast } = useToast();

  const handleGenerateDescription = async () => {
    if (!productName) {
      toast({ title: "Erro", description: "Defina o nome do produto primeiro.", variant: "destructive" });
      return;
    }

    setLoadingText(true);
    try {
      const result = await generateProductDescription({
        productName,
        keywords: keywords.split(",").map(k => k.trim()).filter(Boolean),
        attributes: attributes.split(",").map(a => a.trim()).filter(Boolean),
        tone: "enthusiastic"
      });
      onDescriptionGenerated(result.description);
      toast({ title: "Sucesso!", description: "Descrição gerada com IA." });
    } catch (error) {
      toast({ title: "Erro", description: "Falha na geração da descrição.", variant: "destructive" });
    } finally {
      setLoadingText(false);
    }
  };

  const handleGenerateImage = async () => {
    if (!productName) {
      toast({ title: "Erro", description: "Defina o nome do produto primeiro.", variant: "destructive" });
      return;
    }

    setLoadingImage(true);
    try {
      const result = await generateProductImage({ productName, style: "gourmet photography" });
      if (onImageGenerated) onImageGenerated(result.imageUrl);
      toast({ title: "Sucesso!", description: "Imagem gerada com IA." });
    } catch (error) {
      toast({ title: "Erro", description: "Falha na geração da imagem.", variant: "destructive" });
    } finally {
      setLoadingImage(false);
    }
  };

  return (
    <div className="space-y-4 p-4 border rounded-2xl bg-primary/5 border-primary/20">
      <div className="flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-primary" />
        <h3 className="text-sm font-bold text-primary uppercase tracking-tight">Assistente de Criação IA</h3>
      </div>
      
      <div className="grid gap-4">
        <div className="space-y-2">
          <Label htmlFor="keywords" className="text-xs font-bold text-slate-500 uppercase">Palavras-chave</Label>
          <Input 
            id="keywords" 
            placeholder="ex: suculento, defumado" 
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            className="text-sm bg-white"
          />
        </div>
      </div>

      <div className="flex gap-2">
        <Button 
          onClick={handleGenerateDescription} 
          disabled={loadingText} 
          className="flex-1 bg-white border-primary/20 text-primary hover:bg-primary/10 transition-colors"
          variant="outline"
        >
          {loadingText ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
          Texto IA
        </Button>
        <Button 
          onClick={handleGenerateImage} 
          disabled={loadingImage} 
          className="flex-1 bg-primary text-white hover:bg-primary/90 shadow-lg shadow-primary/20"
        >
          {loadingImage ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImageIcon className="mr-2 h-4 w-4" />}
          Foto IA
        </Button>
      </div>
    </div>
  );
}
