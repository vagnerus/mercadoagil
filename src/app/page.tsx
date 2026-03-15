
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
  Terminal, Activity, Cpu, MousePointer2 
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function LandingPage() {
  const [storeName, setStoreName] = useState("");
  const [latency, setLatency] = useState(42);
  const [socialProof, setSocialProof] = useState<{name: string, city: string} | null>(null);
  const [aiStep, setAiStep] = useState(0); // 0: raw, 1: processing, 2: final
  const [isMagicAnimating, setIsMagicAnimating] = useState(false);
  
  const aiSectionRef = useRef<HTMLDivElement>(null);

  // Simulação de Métricas de Infra
  useEffect(() => {
    const interval = setInterval(() => {
      setLatency(prev => Math.max(38, Math.min(52, prev + (Math.random() > 0.5 ? 1 : -1))));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Simulação de Prova Social
  useEffect(() => {
    const proofs = [
      { name: "Pizzaria do Giovanni", city: "São Paulo" },
      { name: "Moda Carioca", city: "Rio de Janeiro" },
      { name: "Burger do Chef", city: "Curitiba" },
      { name: "Sushi House", city: "Belo Horizonte" }
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
    setIsMagicAnimating(true);
    setTimeout(() => setIsMagicAnimating(false), 2000);
    
    if (aiSectionRef.current) {
      aiSectionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="flex flex-col min-h-screen font-body selection:bg-primary selection:text-white">
      {/* Social Proof Popup */}
      <div className={cn(
        "fixed bottom-6 left-6 z-[100] transition-all duration-500 transform",
        socialProof ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0 pointer-events-none"
      )}>
        <div className="bg-white/90 backdrop-blur-md border border-slate-200 p-4 rounded-2xl shadow-2xl flex items-center gap-4">
          <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center text-green-600">
             <CheckCircle2 className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-black text-slate-900 leading-none">Nova Loja Criada!</p>
            <p className="text-[10px] font-bold text-slate-500 mt-1">
              <span className="text-primary">{socialProof?.name}</span> de {socialProof?.city}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <header className="px-4 lg:px-6 h-20 flex items-center border-b bg-white/70 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto flex items-center">
          <Link className="flex items-center justify-center gap-3 group" href="#">
            <div className="bg-primary p-2 rounded-xl text-white group-hover:rotate-12 transition-transform">
              <Store className="h-6 w-6" />
            </div>
            <span className="text-2xl font-black tracking-tighter text-slate-900">MERCADO ÁGIL</span>
          </Link>
          <nav className="ml-auto flex items-center gap-8">
            <Link className="text-sm font-bold text-slate-500 hover:text-primary transition-colors hidden lg:block" href="/admin/dashboard">
              Master Admin
            </Link>
            <Link className="text-sm font-bold text-slate-500 hover:text-primary transition-colors hidden lg:block" href="/merchant/burger-ze/dashboard">
              Área do Lojista
            </Link>
            <Button className="rounded-full px-6 font-black italic bg-slate-900 text-white shadow-lg shadow-slate-200" asChild>
              <Link href="/store/burger-ze">Demo Ao Vivo</Link>
            </Button>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section with Live Preview */}
        <section className="w-full py-16 md:py-24 bg-gradient-to-b from-blue-50/50 to-white overflow-hidden">
          <div className="container px-4 md:px-6 mx-auto grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-10">
              <div className="space-y-6">
                <div className="inline-flex items-center rounded-full px-4 py-1.5 text-xs font-black bg-primary/10 text-primary uppercase tracking-widest border border-primary/20">
                  <Activity className="h-3 w-3 mr-2 animate-pulse" /> Plataforma SaaS Enterprise
                </div>
                <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-slate-900 leading-[0.9] italic">
                  Sua Loja Digital em <span className="text-primary not-italic">Segundos.</span>
                </h1>
                <p className="text-slate-500 text-lg md:text-xl font-medium max-w-lg leading-relaxed">
                  A única plataforma que combina vitrine ultra-rápida com Inteligência Artificial generativa para o seu estoque.
                </p>
              </div>

              <div className="space-y-4">
                <div className="relative max-w-md">
                   <Input 
                    placeholder="Digite o nome da sua futura loja..." 
                    className="h-16 rounded-2xl border-2 border-slate-100 bg-white px-6 font-black text-lg focus:border-primary transition-all pr-40"
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                   />
                   <Button 
                    onClick={handleMagicClick}
                    className="absolute right-2 top-2 bottom-2 h-12 px-6 rounded-xl font-black italic gap-2 shadow-xl shadow-primary/20"
                   >
                      Ver Mágica <Zap className="h-4 w-4 fill-current" />
                   </Button>
                </div>
                {/* Infra Metrics Badge */}
                <div className="inline-flex items-center gap-4 bg-slate-900 p-2 pr-4 rounded-xl text-white shadow-2xl">
                   <div className="bg-green-500 p-1.5 rounded-lg">
                      <Terminal className="h-4 w-4" />
                   </div>
                   <div className="flex gap-4 font-mono text-[10px] font-bold uppercase tracking-widest">
                      <span className="flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse"></span> Response: {latency}ms</span>
                      <span className="text-slate-500">|</span>
                      <span className="text-primary">Uptime: 99.99%</span>
                   </div>
                </div>
              </div>
            </div>

            {/* Live Smartphone Mockup */}
            <div className="relative flex justify-center perspective-[1000px]">
              <div className={cn(
                "w-[320px] h-[640px] bg-slate-800 rounded-[50px] border-[12px] border-slate-900 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)] relative overflow-hidden transition-all duration-700 transform hover:rotate-y-12",
                isMagicAnimating && "ring-8 ring-primary ring-opacity-50 scale-105"
              )}>
                {/* Camera notch */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 h-6 w-24 bg-slate-900 rounded-b-2xl z-20"></div>
                
                {/* Simulated App View */}
                <div className="absolute inset-0 bg-slate-50 flex flex-col pt-10">
                   {/* Banner */}
                   <div className="h-32 bg-primary/20 relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                      <div className="absolute bottom-4 left-4 h-12 w-12 rounded-xl bg-white shadow-lg"></div>
                   </div>
                   {/* Store Info */}
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
                   {/* Categories */}
                   <div className="flex gap-2 px-4 overflow-hidden mt-4">
                      {[1,2,3].map(i => (
                        <div key={i} className="h-8 min-w-[60px] bg-white rounded-lg border border-slate-100 shrink-0"></div>
                      ))}
                   </div>
                   {/* Products */}
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
              {/* Decorative Glow */}
              <div className="absolute -z-10 w-[400px] h-[400px] bg-primary/20 blur-[100px] rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-50"></div>
            </div>
          </div>
        </section>

        {/* AI Interactive Showcase */}
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
                          Nossa IA transforma fotos de celular em anúncios profissionais de alto nível em milissegundos. Esqueça custos com estúdio.
                       </p>
                    </div>
                    
                    <div className="space-y-4">
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
                       <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Clique para ver a transformação</p>
                    </div>
                 </div>

                 <div className="relative">
                    <div className="bg-slate-800 rounded-[40px] p-8 border border-white/10 shadow-3xl relative overflow-hidden">
                       <div className="aspect-video rounded-3xl overflow-hidden relative border-4 border-slate-700">
                          {aiStep === 0 && (
                            <div className="w-full h-full relative group">
                               <img src="https://picsum.photos/seed/raw/800/600?grayscale" className="w-full h-full object-cover blur-[2px]" alt="Raw Product" />
                               <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                  <Badge className="bg-red-500 text-white font-black border-none">FOTO ORIGINAL (AMADORA)</Badge>
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
                                  ENHANCED BY IA
                               </div>
                            </div>
                          )}
                       </div>
                       
                       <div className="mt-8 space-y-4">
                          <div className="flex gap-2">
                             <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Copywriting Gerado</p>
                          </div>
                          <div className="min-h-[80px] bg-slate-900/50 p-6 rounded-2xl border border-white/5 font-medium italic text-sm text-slate-300">
                             {aiStep === 2 ? (
                               "Delicie-se com o novo Burger Gourmet. Feito com carne Angus selecionada, queijo artesanal e o toque secreto do nosso chef. Peça agora!"
                             ) : (
                               aiStep === 1 ? "Analisando ingredientes..." : "Aguardando processamento..."
                             )}
                          </div>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        </section>

        {/* 3D Tilted Features Section */}
        <section className="w-full py-24 bg-white overflow-hidden">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="text-center mb-20 space-y-4">
              <h2 className="text-4xl font-black tracking-tight sm:text-6xl text-slate-900 italic">O Futuro do E-commerce.</h2>
              <p className="text-slate-500 text-xl font-medium max-w-2xl mx-auto italic opacity-70">Tecnologia Enterprise para o pequeno lojista.</p>
            </div>
            <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
              {[
                { title: "Gestão Multi-Loja", desc: "Controle todas as suas unidades em uma interface imersiva e integrada.", icon: ShieldCheck, color: "primary" },
                { title: "Catálogo IA", desc: "Marketing profissional gerado automaticamente por nossa rede neural.", icon: Zap, color: "accent" },
                { title: "Checkout Global", desc: "A vitrine mais rápida do mercado, desenhada para máxima conversão mobile.", icon: Globe, color: "blue-600" }
              ].map((feat, i) => (
                <div key={i} className="group perspective-[1000px]">
                  <div className="flex flex-col items-center space-y-6 text-center p-12 rounded-[40px] border bg-slate-50/30 transition-all duration-500 transform-gpu group-hover:rotate-x-6 group-hover:-rotate-y-6 group-hover:scale-105 group-hover:shadow-3xl group-hover:bg-white group-hover:border-primary/20 relative overflow-hidden">
                    <div className={cn("p-6 rounded-[24px] transition-colors bg-opacity-10", `bg-${feat.color}`, `text-${feat.color}`, "group-hover:bg-primary group-hover:text-white")}>
                      <feat.icon className="h-10 w-10" />
                    </div>
                    <h3 className="text-2xl font-black italic">{feat.title}</h3>
                    <p className="text-slate-500 font-medium leading-relaxed">
                      {feat.desc}
                    </p>
                    {/* Decorative element */}
                    <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-full translate-x-12 -translate-y-12 transition-transform group-hover:translate-x-0 group-hover:translate-y-0"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Dynamic CTA */}
        <section className="w-full py-24">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="bg-slate-900 rounded-[60px] p-12 md:p-24 flex flex-col items-center text-center space-y-10 border border-white/5 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_120%,rgba(59,130,246,0.15),transparent)]"></div>
              <h2 className="text-4xl md:text-7xl font-black text-white max-w-3xl leading-[0.9] italic relative z-10">Sua jornada digital começa com um <span className="text-primary not-italic">clique.</span></h2>
              <p className="text-slate-400 text-xl max-w-xl font-medium relative z-10">Crie sua vitrine grátis hoje. Sem cartão de crédito, sem burocracia.</p>
              <div className="flex flex-col sm:flex-row gap-6 relative z-10">
                <Button size="lg" className="rounded-full px-12 py-8 text-xl font-black italic bg-primary text-white hover:scale-105 transition-transform shadow-2xl shadow-primary/30">
                  Criar Minha Loja <ArrowRight className="ml-2 h-6 w-6" />
                </Button>
                <Button variant="outline" className="rounded-full px-12 py-8 text-xl font-black italic border-white/20 text-white hover:bg-white/5">
                  Falar com Expert
                </Button>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-10 pt-10 text-xs font-black uppercase tracking-[0.2em] text-slate-500 relative z-10">
                <span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-500" /> Setup em 3 Min</span>
                <span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-500" /> IA Inclusa</span>
                <span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-500" /> Zero Taxas</span>
              </div>
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
              Redefinindo o comércio digital com Inteligência Artificial e performance de infraestrutura de elite.
            </p>
          </div>
          <div>
            <h4 className="font-black text-xs uppercase tracking-widest text-slate-400 mb-8 italic">Plataforma</h4>
            <ul className="space-y-4 text-sm font-bold text-slate-600">
              <li><Link href="#" className="hover:text-primary transition-colors">Funcionalidades</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Preços</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Enterprise</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">IA Showcase</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-black text-xs uppercase tracking-widest text-slate-400 mb-8 italic">Empresa</h4>
            <ul className="space-y-4 text-sm font-bold text-slate-600">
              <li><Link href="#" className="hover:text-primary transition-colors">Sobre Nós</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Blog</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Contato</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Carreiras</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-black text-xs uppercase tracking-widest text-slate-400 mb-8 italic">Dashboards</h4>
            <div className="space-y-4">
               <Link href="/admin/dashboard" className="block p-4 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all">
                  <p className="text-[10px] font-black uppercase text-primary mb-1">Painel Master</p>
                  <p className="text-xs font-bold text-slate-700">Controle de SaaS</p>
               </Link>
               <Link href="/merchant/burger-ze/dashboard" className="block p-4 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all">
                  <p className="text-[10px] font-black uppercase text-accent mb-1">Área do Lojista</p>
                  <p className="text-xs font-bold text-slate-700">Gestão do Negócio</p>
               </Link>
            </div>
          </div>
        </div>
        <div className="container mx-auto border-t mt-20 pt-10 flex flex-col sm:flex-row justify-between items-center gap-8 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
          <p>© 2024 MERCADO ÁGIL TECNOLOGIA. ALL RIGHTS RESERVED.</p>
          <nav className="flex gap-10">
            <Link className="hover:text-slate-900 transition-colors" href="#">TERMOS</Link>
            <Link className="hover:text-slate-900 transition-colors" href="#">PRIVACIDADE</Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
