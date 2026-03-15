"use client";

import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Store, ShieldCheck, ShoppingCart, ArrowRight, Zap, Globe, 
  BarChart3, Star, CheckCircle2, Smartphone, Sparkles, 
  Terminal, Activity, Cpu, MousePointer2, Monitor, Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

export default function LandingPage() {
  const [storeName, setStoreName] = useState("");
  const [latency, setLatency] = useState(42);
  const [socialProof, setSocialProof] = useState<{name: string, city: string} | null>(null);
  const [aiStep, setAiStep] = useState(0); 
  const [isMagicAnimating, setIsMagicAnimating] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const aiSectionRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    const interval = setInterval(() => {
      setLatency(prev => Math.max(38, Math.min(52, prev + (Math.random() > 0.5 ? 1 : -1))));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const proofs = [
      { name: "Pizzaria do Giovanni", city: "São Paulo" },
      { name: "Moda Carioca", city: "Rio de Janeiro" },
      { name: "Burger do Chef", city: "Curitiba" }
    ];
    let index = 0;
    const interval = setInterval(() => {
      setSocialProof(proofs[index]);
      setTimeout(() => setSocialProof(null), 4000);
      index = (index + 1) % proofs.length;
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const handleMagicClick = () => {
    if (!storeName) {
      toast({ title: "Ops!", description: "Digite o nome da sua loja para ver a mágica.", variant: "destructive" });
      return;
    }
    setIsMagicAnimating(true);
    setLoading(true);
    
    // Simulation of magic generation
    setTimeout(() => {
      setLoading(false);
      if (aiSectionRef.current) {
        aiSectionRef.current.scrollIntoView({ behavior: 'smooth' });
      }
      toast({ title: "Preview Gerado!", description: "Veja abaixo como sua loja pode ficar com IA." });
    }, 1500);
  };

  return (
    <div className="flex flex-col min-h-screen font-body selection:bg-primary selection:text-white">
      <div className={cn(
        "fixed bottom-6 left-6 z-[100] transition-all duration-500 transform",
        socialProof ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0 pointer-events-none"
      )}>
        <div className="bg-white/90 backdrop-blur-md border border-slate-200 p-4 rounded-2xl shadow-2xl flex items-center gap-4">
          <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center text-green-600">
             <CheckCircle2 className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-black text-slate-900 leading-none">Nova Loja Ativada!</p>
            <p className="text-[10px] font-bold text-slate-500 mt-1">
              <span className="text-primary">{socialProof?.name}</span> em plano <span className="text-primary font-black">Pro</span>
            </p>
          </div>
        </div>
      </div>

      <header className="px-4 lg:px-6 h-20 flex items-center border-b bg-white/70 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto flex items-center">
          <Link className="flex items-center justify-center gap-3 group" href="#">
            <div className="bg-primary p-2 rounded-xl text-white group-hover:rotate-12 transition-transform">
              <Store className="h-6 w-6" />
            </div>
            <span className="text-2xl font-black tracking-tighter text-slate-900">MERCADO ÁGIL</span>
          </Link>
          <nav className="ml-auto flex items-center gap-8">
            <Link className="text-sm font-bold text-slate-500 hover:text-primary transition-colors hidden lg:block" href="/login">
              Entrar
            </Link>
            <div className="hidden lg:flex items-center gap-2 bg-slate-100 px-3 py-1 rounded-full text-[10px] font-black text-slate-400">
               <Monitor className="h-3 w-3" /> Desktop App v2.9
            </div>
            <Button className="rounded-full px-6 font-black italic bg-slate-900 text-white shadow-lg shadow-slate-200" asChild>
              <Link href="/login">Criar Minha Loja</Link>
            </Button>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <section className="w-full py-16 md:py-24 bg-gradient-to-b from-blue-50/50 to-white overflow-hidden">
          <div className="container px-4 md:px-6 mx-auto grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-10">
              <div className="space-y-6">
                <div className="inline-flex items-center rounded-full px-4 py-1.5 text-xs font-black bg-primary/10 text-primary uppercase tracking-widest border border-primary/20">
                  <Monitor className="h-3 w-3 mr-2 animate-pulse" /> Agora com Versão para Computador
                </div>
                <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-slate-900 leading-[0.9] italic">
                  Sua Loja em <span className="text-primary not-italic">Segundos.</span>
                </h1>
                <p className="text-slate-500 text-lg md:text-xl font-medium max-w-lg leading-relaxed">
                  A única plataforma Multi-Device que libera o seu delivery em minutos. Planos de Free a Enterprise.
                </p>
              </div>

              <div className="space-y-4">
                <div className="relative max-w-md">
                   <Input 
                    placeholder="Nome da sua futura loja..." 
                    className="h-16 rounded-2xl border-2 border-slate-100 bg-white px-6 font-black text-lg focus:border-primary transition-all pr-40"
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                   />
                   <Button 
                    onClick={handleMagicClick}
                    disabled={loading}
                    className="absolute right-2 top-2 bottom-2 h-12 px-6 rounded-xl font-black italic gap-2 shadow-xl shadow-primary/20"
                   >
                      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Ver Mágica <Zap className="h-4 w-4 fill-current" /></>}
                   </Button>
                </div>
                <div className="inline-flex items-center gap-4 bg-slate-900 p-2 pr-4 rounded-xl text-white shadow-2xl">
                   <div className="bg-green-500 p-1.5 rounded-lg">
                      <Terminal className="h-4 w-4" />
                   </div>
                   <div className="flex gap-4 font-mono text-[10px] font-bold uppercase tracking-widest">
                      <span className="flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse"></span> {latency}ms Latency</span>
                      <span className="text-slate-500">|</span>
                      <span className="text-primary">Desktop App Ready</span>
                   </div>
                </div>
              </div>
            </div>

            <div className="relative flex justify-center perspective-[1000px]">
              <div className={cn(
                "w-[320px] h-[640px] bg-slate-800 rounded-[50px] border-[12px] border-slate-900 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)] relative overflow-hidden transition-all duration-700 transform hover:rotate-y-12",
                isMagicAnimating && "ring-8 ring-primary ring-opacity-50 scale-105"
              )}>
                <div className="absolute top-0 left-1/2 -translate-x-1/2 h-6 w-24 bg-slate-900 rounded-b-2xl z-20"></div>
                <div className="absolute inset-0 bg-slate-50 flex flex-col pt-10">
                   <div className="h-32 bg-primary/20 relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                      <div className="absolute bottom-4 left-4 h-12 w-12 rounded-xl bg-white shadow-lg"></div>
                   </div>
                   <div className="p-4 space-y-2">
                      <p className="text-xs font-black uppercase text-primary tracking-widest">Aberto agora</p>
                      <h3 className="text-xl font-black italic text-slate-800 truncate">
                        {storeName || "Nome da Sua Loja"}
                      </h3>
                      <div className="flex gap-1">
                         <div className="h-1.5 w-12 bg-slate-200 rounded-full"></div>
                         <div className="h-1.5 w-8 bg-slate-200 rounded-full"></div>
                      </div>
                   </div>
                   <div className="flex gap-2 px-4 overflow-hidden mt-4">
                      {[1,2,3].map(i => (
                        <div key={i} className="h-8 min-w-[60px] bg-white rounded-lg border border-slate-100 shrink-0"></div>
                      ))}
                   </div>
                   <div className="grid grid-cols-2 gap-3 p-4">
                      {[1,2,3,4].map(i => (
                        <div key={i} className="bg-white rounded-2xl p-2 shadow-sm border border-slate-100 space-y-2">
                           <div className="h-20 w-full bg-slate-100 rounded-xl"></div>
                           <div className="h-2 w-12 bg-slate-200 rounded-full"></div>
                           <div className="h-2 w-8 bg-primary/20 rounded-full"></div>
                        </div>
                      ))}
                   </div>
                </div>
              </div>
              <div className="absolute -z-10 w-[400px] h-[400px] bg-primary/20 blur-[100px] rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-50"></div>
            </div>
          </div>
        </section>

        <section ref={aiSectionRef} className="py-24 bg-slate-900 text-white overflow-hidden scroll-mt-20">
           <div className="container px-4 md:px-6 mx-auto">
              <div className="grid lg:grid-cols-2 gap-20 items-center">
                 <div className="space-y-8">
                    <div className="space-y-4">
                       <div className="bg-primary/20 text-primary inline-flex p-3 rounded-2xl">
                          <Sparkles className="h-8 w-8" />
                       </div>
                       <h2 className="text-4xl md:text-6xl font-black italic tracking-tighter">O Segredo da nossa <span className="text-primary">Mágica.</span></h2>
                       <p className="text-slate-400 text-lg leading-relaxed max-w-md">
                          Nossa IA transforma esboços e nomes em anúncios profissionais de alto nível. Teste grátis por 30 dias no plano <span className="text-white font-black italic underline decoration-primary underline-offset-4">Free.</span>
                       </p>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                       <div className="p-6 bg-slate-800 rounded-3xl border border-white/5 space-y-2">
                          <p className="text-xs font-black text-primary uppercase">Free</p>
                          <p className="text-lg font-black italic">R$ 0</p>
                          <p className="text-[10px] font-bold text-slate-500">30 Dias de Teste</p>
                       </div>
                       <div className="p-6 bg-primary/10 rounded-3xl border border-primary/20 space-y-2">
                          <p className="text-xs font-black text-primary uppercase">Pro</p>
                          <p className="text-lg font-black italic">R$ 150</p>
                          <p className="text-[10px] font-bold text-slate-500">Completo + Desktop</p>
                       </div>
                       <div className="p-6 bg-slate-800 rounded-3xl border border-white/5 space-y-2">
                          <p className="text-xs font-black text-primary uppercase">Pro II</p>
                          <p className="text-lg font-black italic">R$ 300</p>
                          <p className="text-[10px] font-bold text-slate-500">Escalável & Global</p>
                       </div>
                    </div>

                    <Button 
                      onClick={() => {
                        setAiStep(1);
                        setTimeout(() => setAiStep(2), 2000);
                      }}
                      className="h-16 px-8 rounded-2xl font-black text-lg gap-3 bg-white text-slate-900 hover:bg-slate-100 transition-all"
                    >
                      {aiStep === 0 && "Simular Geração IA"}
                      {aiStep === 1 && "Processando Visão..."}
                      {aiStep === 2 && "Resultado Final!"}
                      <MousePointer2 className="h-5 w-5" />
                    </Button>
                 </div>

                 <div className="relative">
                    <div className="bg-slate-800 rounded-[40px] p-8 border border-white/10 shadow-3xl relative overflow-hidden">
                       <div className="aspect-video rounded-3xl overflow-hidden relative border-4 border-slate-700">
                          {aiStep === 0 && (
                            <div className="w-full h-full relative group">
                               <img src="https://picsum.photos/seed/raw/800/600?grayscale" className="w-full h-full object-cover blur-[2px]" alt="Raw Product" />
                               <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                  <Badge className="bg-red-500 text-white font-black border-none uppercase tracking-widest text-[8px]">Foto Original (Smartphone)</Badge>
                               </div>
                            </div>
                          )}
                          {aiStep === 1 && (
                            <div className="w-full h-full flex items-center justify-center bg-slate-900">
                               <div className="h-20 w-20 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                               <div className="absolute inset-0 bg-primary/10 animate-pulse"></div>
                            </div>
                          )}
                          {aiStep === 2 && (
                            <div className="w-full h-full relative animate-in zoom-in-95 duration-700">
                               <img src="https://picsum.photos/seed/final/800/600" className="w-full h-full object-cover" alt="AI Enhanced" />
                               <div className="absolute top-4 right-4 bg-green-500 text-white px-4 py-1 rounded-full text-[10px] font-black tracking-widest animate-bounce">
                                  GERADO POR IA
                               </div>
                            </div>
                          )}
                       </div>
                       
                       <div className="mt-8 space-y-4">
                          <div className="flex gap-2">
                             <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Texto Persuasivo Automatizado</p>
                          </div>
                          <div className="min-h-[80px] bg-slate-900/50 p-6 rounded-2xl border border-white/5 font-medium italic text-sm text-slate-300">
                             {aiStep === 2 ? (
                               `Delicie-se com o novo ${storeName || 'Produto'}. Qualidade premium, entrega rápida e o melhor preço da região. Peça agora!`
                             ) : (
                               aiStep === 1 ? "Otimizando para vendas..." : "Aguardando processamento..."
                             )}
                          </div>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        </section>

        <section className="w-full py-24 bg-white overflow-hidden">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="text-center mb-20 space-y-4">
              <h2 className="text-4xl font-black tracking-tight sm:text-6xl text-slate-900 italic">Multi-Platform Ready.</h2>
              <p className="text-slate-500 text-xl font-medium max-w-2xl mx-auto italic opacity-70">Sua loja em todo lugar: Celular, Web e Desktop.</p>
            </div>
            <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
              {[
                { title: "Dashboard Desktop", desc: "Aplicação nativa para PC/Mac focada em gestão de balcão ultra-rápida.", icon: Monitor, color: "primary" },
                { title: "App Mobile PWA", desc: "Instalação instantânea no celular do cliente sem necessidade de App Store.", icon: Smartphone, color: "accent" },
                { title: "Gestão Master", desc: "Controle todas as suas unidades em uma interface imersiva e integrada.", icon: ShieldCheck, color: "blue-600" }
              ].map((feat, i) => (
                <div key={i} className="group perspective-[1000px]">
                  <div className="flex flex-col items-center space-y-6 text-center p-12 rounded-[40px] border bg-slate-50/30 transition-all duration-500 transform-gpu group-hover:rotate-x-6 group-hover:-rotate-y-6 group-hover:scale-105 group-hover:shadow-3xl group-hover:bg-white group-hover:border-primary/20 relative overflow-hidden">
                    <div className={cn("p-6 rounded-[24px] transition-colors bg-opacity-10", feat.color.includes('-') ? feat.color : `bg-${feat.color}`, feat.color.includes('-') ? `text-${feat.color.replace('bg-','')}` : `text-${feat.color}`, "group-hover:bg-primary group-hover:text-white")}>
                      <feat.icon className="h-10 w-10" />
                    </div>
                    <h3 className="text-2xl font-black italic">{feat.title}</h3>
                    <p className="text-slate-500 font-medium leading-relaxed">
                      {feat.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="w-full py-20 px-4 border-t bg-slate-50 overflow-hidden relative">
        <div className="container mx-auto grid md:grid-cols-4 gap-16 relative z-10">
          <div className="space-y-6">
             <Link className="flex items-center gap-3 group" href="#">
              <div className="bg-primary p-2 rounded-xl text-white">
                <Store className="h-6 w-6" />
              </div>
              <span className="text-2xl font-black tracking-tighter text-slate-900 uppercase">MERCADO ÁGIL</span>
            </Link>
            <p className="text-sm text-slate-500 font-medium leading-relaxed">
              Redefinindo o comércio digital com Inteligência Artificial e performance Multi-Unit.
            </p>
          </div>
          <div>
            <h4 className="font-black text-xs uppercase tracking-widest text-slate-400 mb-8 italic">Dashboards</h4>
            <div className="space-y-4">
               <Link href="/login" className="block p-4 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all">
                  <p className="text-[10px] font-black uppercase text-primary mb-1">Entrar no Painel</p>
                  <p className="text-xs font-bold text-slate-700">Acesso Restrito</p>
               </Link>
            </div>
          </div>
        </div>
        <div className="container mx-auto border-t mt-20 pt-10 flex flex-col sm:flex-row justify-between items-center gap-8 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
          <p>© 2024 MERCADO ÁGIL TECNOLOGIA. PLATFORM VERSION 2.9 - ENTERPRISE EDITION.</p>
        </div>
      </footer>
    </div>
  );
}
