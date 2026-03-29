
"use client";

import * as React from 'react';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Video, Sparkles, Loader2, Play, Download, 
  ArrowLeft, Camera, Share2, Wand2, Monitor, 
  LayoutDashboard, ShoppingBag, List, Settings, Zap
} from "lucide-react";
import Link from 'next/link';
import { useToast } from "@/hooks/use-toast";
import { generateProductVideo } from "@/ai/flows/generate-product-video-flow";

export default function CreativeStudio({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = React.use(params);
  const [isGenerating, setIsGenerating] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [productName, setProductName] = useState("");
  const { toast } = useToast();

  const handleGenerateVideo = async () => {
    if (!productName) {
      toast({ title: "Atenção", description: "Dê um nome ao produto para o roteiro da IA.", variant: "destructive" });
      return;
    }

    setIsGenerating(true);
    setVideoUrl(null);

    try {
      // Usando uma imagem de exemplo para o protótipo
      const placeholderImg = "https://picsum.photos/seed/product/800/600";
      
      const result = await generateProductVideo({
        productName,
        productImage: placeholderImg
      });

      setVideoUrl(result.videoUrl);
      toast({ title: "Vídeo Gerado!", description: "Sua campanha cinematográfica está pronta." });
    } catch (error: any) {
      toast({ 
        title: "Erro na Geração", 
        description: error.message || "A engine Veo 2 está ocupada. Tente novamente.", 
        variant: "destructive" 
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-950 text-white font-body">
      <aside className="w-64 border-r border-white/10 bg-black hidden lg:flex flex-col sticky top-0 h-screen">
        <div className="p-6">
          <Link href={`/merchant/${slug}/dashboard`} className="flex items-center gap-2 font-black text-xl italic tracking-tighter text-primary uppercase">MERCADO ÁGIL</Link>
        </div>
        <nav className="flex-1 px-4 space-y-2">
          <Link href={`/merchant/${slug}/dashboard`} className="flex items-center gap-3 px-4 py-2.5 text-slate-400 hover:bg-white/5 rounded-xl transition-colors font-medium">
            <LayoutDashboard className="h-5 w-5" /> Dashboard
          </Link>
          <Link href={`/merchant/${slug}/creative-studio`} className="flex items-center gap-3 px-4 py-2.5 bg-primary/10 text-primary rounded-xl font-bold">
            <Video className="h-5 w-5" /> Creative Studio IA
          </Link>
          <Link href={`/merchant/${slug}/catalog`} className="flex items-center gap-3 px-4 py-2.5 text-slate-400 hover:bg-white/5 rounded-xl transition-colors font-medium">
            <List className="h-5 w-5" /> Catálogo
          </Link>
        </nav>
      </aside>

      <main className="flex-1 p-4 lg:p-12 overflow-y-auto">
        <header className="mb-12 space-y-2">
          <div className="flex items-center gap-2 mb-4">
             <Badge className="bg-primary text-white border-none font-black italic px-4 py-1 rounded-full text-[10px]">VEV 2.0 ENGINE</Badge>
             <Badge className="bg-white/10 text-slate-400 border-none font-black text-[10px]">TECNOLOGIA VEO</Badge>
          </div>
          <h1 className="text-4xl lg:text-6xl font-black tracking-tighter italic uppercase">Creative <span className="text-primary not-italic">Studio IA</span></h1>
          <p className="text-slate-500 font-medium text-lg italic max-w-2xl">Transforme fotos estáticas em vídeos cinematográficos de alta conversão para suas redes sociais.</p>
        </header>

        <div className="grid lg:grid-cols-12 gap-12">
           <div className="lg:col-span-5 space-y-8">
              <Card className="bg-white/5 border-white/10 rounded-[40px] p-8 space-y-8">
                 <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">1. Nome do Produto</label>
                    <input 
                      value={productName}
                      onChange={(e) => setProductName(e.target.value)}
                      placeholder="Ex: Hambúrguer Artesanal Supremo"
                      className="w-full h-16 bg-white/5 border-none rounded-2xl px-6 font-bold text-lg focus:ring-2 ring-primary outline-none"
                    />
                 </div>

                 <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-2">2. Foto de Referência</label>
                    <div className="aspect-video rounded-3xl bg-black/40 border-2 border-dashed border-white/10 flex flex-col items-center justify-center text-center p-6 group hover:border-primary/40 transition-colors cursor-pointer">
                       <Camera className="h-10 w-10 text-slate-700 mb-4 group-hover:text-primary transition-colors" />
                       <p className="text-xs font-bold text-slate-500 uppercase">Clique para subir a foto</p>
                       <p className="text-[8px] text-slate-600 mt-2">Formatos: JPG, PNG • Max 5MB</p>
                    </div>
                 </div>

                 <Button 
                  onClick={handleGenerateVideo}
                  disabled={isGenerating}
                  className="w-full h-20 bg-primary hover:bg-primary/90 text-white rounded-[35px] font-black italic text-xl shadow-2xl shadow-primary/20 gap-3"
                 >
                    {isGenerating ? (
                      <><Loader2 className="h-6 w-6 animate-spin" /> CRIANDO CINEMATIC...</>
                    ) : (
                      <><Wand2 className="h-6 w-6" /> GERAR VÍDEO IA</>
                    )}
                 </Button>
              </Card>

              <div className="p-8 bg-slate-900 rounded-[40px] border border-white/5 space-y-4">
                 <div className="h-10 w-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary">
                    <Zap className="h-5 w-5" />
                 </div>
                 <h3 className="font-black italic uppercase text-sm">Como funciona?</h3>
                 <p className="text-xs text-slate-500 leading-relaxed font-medium">Nossa IA analisa a geometria do produto na foto e simula um movimento de câmera orbital em 4K, aplicando iluminação volumétrica dinâmica para deixar o item irresistível.</p>
              </div>
           </div>

           <div className="lg:col-span-7">
              <Card className="bg-black border-white/10 rounded-[50px] overflow-hidden aspect-[9/16] lg:aspect-video relative shadow-3xl flex items-center justify-center group">
                 {videoUrl ? (
                   <>
                    <video key={videoUrl} className="w-full h-full object-cover" controls autoPlay loop>
                       <source src={videoUrl} type="video/mp4" />
                    </video>
                    <div className="absolute top-8 right-8 flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                       <Button size="icon" className="h-12 w-12 rounded-full bg-white text-black hover:bg-primary hover:text-white shadow-xl"><Download className="h-5 w-5" /></Button>
                       <Button size="icon" className="h-12 w-12 rounded-full bg-white text-black hover:bg-primary hover:text-white shadow-xl"><Share2 className="h-5 w-5" /></Button>
                    </div>
                   </>
                 ) : (
                   <div className="text-center space-y-6 max-w-sm px-8">
                      <div className="h-24 w-24 bg-white/5 rounded-full flex items-center justify-center mx-auto border border-white/5">
                         <Play className="h-10 w-10 text-slate-800" />
                      </div>
                      <h3 className="text-xl font-black italic uppercase text-slate-700">Preview do Comercial</h3>
                      <p className="text-xs font-bold text-slate-800 uppercase tracking-widest">O vídeo gerado aparecerá aqui pronto para download em 9:16 ou 16:9.</p>
                   </div>
                 )}
                 
                 {isGenerating && (
                   <div className="absolute inset-0 bg-black/80 backdrop-blur-md flex flex-col items-center justify-center text-center p-12">
                      <div className="relative h-24 w-24 mb-8">
                         <Loader2 className="h-full w-full animate-spin text-primary opacity-20" />
                         <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-8 w-8 text-primary animate-pulse" />
                      </div>
                      <h3 className="text-2xl font-black italic uppercase tracking-tighter animate-pulse">Renderizando Magia...</h3>
                      <p className="text-slate-500 text-sm mt-4 italic">"Estamos movendo os fótons para criar a cena perfeita. Isso leva cerca de 30 a 60 segundos."</p>
                   </div>
                 )}
              </Card>
           </div>
        </div>
      </main>
    </div>
  );
}
