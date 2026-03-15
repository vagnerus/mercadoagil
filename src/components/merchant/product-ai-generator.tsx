"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, Loader2, Copy, Check } from "lucide-react";
import { generateProductDescription } from "@/ai/flows/generate-product-description-flow";
import { useToast } from "@/hooks/use-toast";

interface ProductAiGeneratorProps {
  onDescriptionGenerated: (description: string) => void;
  productName: string;
}

export function ProductAiGenerator({ onDescriptionGenerated, productName }: ProductAiGeneratorProps) {
  const [loading, setLoading] = useState(false);
  const [keywords, setKeywords] = useState("");
  const [attributes, setAttributes] = useState("");
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!productName) {
      toast({
        title: "Erro",
        description: "Por favor, defina o nome do produto primeiro.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const result = await generateProductDescription({
        productName,
        keywords: keywords.split(",").map(k => k.trim()).filter(Boolean),
        attributes: attributes.split(",").map(a => a.trim()).filter(Boolean),
        tone: "enthusiastic"
      });

      onDescriptionGenerated(result.description);
      toast({
        title: "Sucesso!",
        description: "Descrição gerada com sucesso pela IA.",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Erro",
        description: "Não foi possível gerar a descrição no momento.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 p-4 border rounded-lg bg-primary/5">
      <div className="flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-primary" />
        <h3 className="text-sm font-semibold text-primary">Gerador de Descrição com IA</h3>
      </div>
      
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="keywords" className="text-xs">Palavras-chave (separadas por vírgula)</Label>
          <Input 
            id="keywords" 
            placeholder="ex: suculento, artesanal, gourmet" 
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            className="text-sm"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="attributes" className="text-xs">Atributos (ex: Peso: 200g, Orgânico)</Label>
          <Input 
            id="attributes" 
            placeholder="ex: Angus, 180g, Defumado" 
            value={attributes}
            onChange={(e) => setAttributes(e.target.value)}
            className="text-sm"
          />
        </div>
      </div>

      <Button 
        onClick={handleGenerate} 
        disabled={loading} 
        className="w-full bg-primary hover:bg-primary/90"
      >
        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
        Gerar Descrição Profissional
      </Button>
    </div>
  );
}