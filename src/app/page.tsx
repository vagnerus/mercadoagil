
"use client";

import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Store, ShieldCheck, ShoppingCart, ArrowRight, Zap, Globe, 
  BarChart3, Star, CheckCircle2, Smartphone, Sparkles, 
  Terminal, Activity, Cpu, MousePointer2, Monitor, Loader2,
  Scissors, Stethoscope, Wrench, Dog, GraduationCap, HeartHandshake,
  ShoppingBag, Car, Camera, Calendar, Wallet, Plus, Dumbbell, PartyPopper, Gavel,
  Utensils
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

const SEGMENTS = [
  { id: 'BEAUTY', label: 'Barbearia & Estética', icon: Scissors, color: 'bg-pink-500' },
  { id: 'RESTAURANT', label: 'Gastronomia & Food', icon: Utensils, color: 'bg-orange-600' },
  { id: 'RETAIL', label: 'Lojas & Varejo', icon: ShoppingBag, color: 'bg-blue-500' },
  { id: 'HEALTH', label: 'Saúde & Clínicas', icon: Stethoscope, color: 'bg-emerald-500' },
  { id: 'FITNESS', label: 'Academias & Studios', icon: Dumbbell, color: 'bg-orange-500' },
  { id: 'EVENTS', label: 'Eventos & Festas', icon: PartyPopper, color: 'bg-purple-500' },
  { id: 'PROFESSIONAL', label: 'Consultoria & Jurídico', icon: Gavel, color: 'bg-indigo-500' },
  { id: 'AUTO', label: 'Automotivo & Oficina', icon: Car, color: 'bg-slate-700' },
  { id: 'PET', label: 'Pets & Veterinária', icon: Dog, color: 'bg-yellow-600' },
  { id: 'EDUCATION', label: 'Escolas & Cursos', icon: GraduationCap, color: 'bg-blue-800' },
];

export default function LandingPage() {
  const [storeName, setStoreName] = useState("");
  const [selectedSegment, setSelectedSegment] = useState(SEGMENTS[0]);
  const [latency, setLatency] = useState(42);
  const [socialProof, setSocialProof] = useState<{name: string, segment: string} | null>(null);
  const [loading, setLoading] = useState(false);
  
  const { toast } = useToast();

  useEffect(() => {
    const interval = setInterval(() => {
      setLatency(prev => Math.max(38, Math.min(52, prev + (Math.random() > 0.5 ? 1 : -1))));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const proofs = [
      { name: "Barbearia do Zé", segment: "Beleza" },
      { name: "Clínica Vida", segment: "Saúde" },
      { name: "Fit Hub Center", segment: "Fitness" },
      { name: "Eventos Master", segment: "Eventos" }
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
      toast({ title: "Quase lá!", description: "Dê um nome ao seu projeto para ver a mágica.", variant: "destructive" });
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      window.location.href = '/login';
    }, 1500);
  };

  const isService = !['RETAIL', 'RESTAURANT'].includes(selectedSegment.id);

  return (
    <div className="flex flex-col min-h-screen font-body selection:bg-primary selection:text-white bg-white">
      {/* Social Proof Toast */}
      <div className={cn(
        "fixed bottom-6 left-6 z-[100] transition-all duration-500 transform",
        socialProof ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0 pointer-events-none"
      )}>
        <div className="bg-white/95 backdrop-blur-md border border-slate-200 p-4 rounded-3xl shadow-2xl flex items-center gap-4">
          <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center text-primary animate-pulse">
             <CheckCircle2 className="h-6 w-6" />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Novo Parceiro</p>
            <p className="text-xs font-bold text-slate-900 mt-1">
              <span className="text-primary">{socialProof?.name}</span> ({socialProof?.segment}) ativado.
            </p>
          </div>
        </div>
      </div>

      <header className="px-4 lg:px-6 h-20 flex items-center border-b bg-white/70 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto flex items-center">
          <Link className="flex items-center justify-center gap-3 group" href="#">
            <div className="bg-primary p-2 rounded-xl text-white group-hover:rotate-12 transition-transform shadow-lg shadow-primary/20">
              <Store className="h-6 w-6" />
            </div>
            <span className="text-2xl font-black tracking-tighter text-slate-900 uppercase italic">MERCADO ÁGIL</span>
          </Link>
          <nav className="ml-auto flex items-center gap-8">
            <Link className="text-sm font-bold text-slate-500 hover:text-primary transition-colors hidden lg:block" href="/login">
              Entrar no Painel
            </Link>
            <Button className="rounded-full px-8 h-12 font-black italic bg-slate-900 text-white shadow-xl hover:scale-105 transition-transform" asChild>
              <Link href="/login">Criar minha Conta</Link>
            </Button>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {/* Segment Selector - Floating Bar */}
        <section className="bg-slate-50 border-b py-4 overflow-x-auto no-scrollbar scroll-smooth">
           <div className="container mx-auto px-4 flex gap-4 min-w-max">
              {SEGMENTS.map((seg) => (
                <button
                  key={seg.id}
                  onClick={() => setSelectedSegment(seg)}
                  className={cn(
                    "flex items-center gap-2 px-6 py-3 rounded-2xl whitespace-nowrap transition-all font-black italic text-xs uppercase tracking-tighter",
                    selectedSegment.id === seg.id 
                      ? "bg-primary text-white shadow-lg shadow-primary/20 scale-105" 
                      : "bg-white text-slate-400 border hover:bg-slate-100"
                  )}
                >
                  <seg.icon className="h-4 w-4" />
                  {seg.label}
                </button>
              ))}
           </div>
        </section>

        <section className="w-full py-16 md:py-24 bg-gradient-to-b from-blue-50/30 to-white overflow-hidden">
          <div className="container px-4 md:px-6 mx-auto grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-10">
              <div className="space-y-6">
                <Badge className="rounded-full px-4 py-1.5 bg-primary/10 text-primary border-primary/20 font-black italic uppercase tracking-widest text-[10px]">
                  <Sparkles className="h-3 w-3 mr-2" /> Inteligência Multi-Vertical ativada
                </Badge>
                <h1 className="text-5xl md:text-8xl font-black tracking-tighter text-slate-900 leading-[0.85] italic">
                  O Seu Negócio <br/>em <span className="text-primary not-italic">Segundos.</span>
                </h1>
                <p className="text-slate-500 text-lg md:text-xl font-medium max-w-lg leading-relaxed italic">
                  A única plataforma que gera uma estrutura de {selectedSegment.label} completa com um clique. De agendamentos a estoque real.
                </p>
              </div>

              <div className="space-y-4">
                <div className="relative max-w-md">
                   <input 
                    placeholder="Nome do seu negócio..." 
                    className="w-full h-20 rounded-[30px] border-4 border-slate-100 bg-white px-8 font-black text-xl focus:border-primary transition-all pr-44 outline-none shadow-2xl"
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                   />
                   <Button 
                    onClick={handleMagicClick}
                    disabled={loading}
                    className="absolute right-3 top-3 bottom-3 h-14 px-8 rounded-2xl font-black italic gap-2 shadow-xl shadow-primary/20 text-white text-lg"
                   >
                      {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <>GERAR PROJETO <ArrowRight className="h-5 w-5" /></>}
                   </Button>
                </div>
                <div className="flex items-center gap-6 text-[10px] font-black text-slate-400 uppercase tracking-widest px-4">
                   <span className="flex items-center gap-2"><div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div> {latency}ms Latency</span>
                   <span className="flex items-center gap-2"><Zap className="h-3 w-3 text-primary" /> Auto-Provisionamento</span>
                   <span className="flex items-center gap-2"><Globe className="h-3 w-3" /> Multi-Tenant</span>
                </div>
              </div>
            </div>

            <div className="relative flex justify-center perspective-[1500px]">
              <div className="w-[340px] h-[680px] bg-slate-900 rounded-[60px] border-[14px] border-slate-900 shadow-[0_60px_120px_-30px_rgba(0,0,0,0.4)] relative overflow-hidden transition-all duration-1000 transform-gpu rotate-y-12">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 h-7 w-32 bg-slate-900 rounded-b-3xl z-30"></div>
                
                <div className="absolute inset-0 bg-slate-50 flex flex-col pt-12">
                   <div className="px-6 py-4 flex justify-between items-center border-b">
                      <div className="flex items-center gap-2">
                         <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-black italic text-xs">
                            {storeName ? storeName[0].toUpperCase() : 'M'}
                         </div>
                         <span className="font-black text-slate-800 text-sm truncate max-w-[120px] uppercase italic">{storeName || "Minha Loja"}</span>
                      </div>
                      <ShoppingCart className="h-4 w-4 text-slate-400" />
                   </div>

                   <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50">
                      <div className="h-32 w-full bg-slate-200 rounded-3xl relative overflow-hidden group">
                         <img src={`https://picsum.photos/seed/${selectedSegment.id}/400/300`} className="w-full h-full object-cover" />
                         <div className="absolute inset-0 bg-black/20"></div>
                         <div className="absolute bottom-3 left-4">
                            <Badge className="bg-primary text-white border-none font-black italic text-[8px] uppercase tracking-widest">Destaque de Hoje</Badge>
                         </div>
                      </div>

                      <div className="space-y-4">
                         <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
                            {isService ? 'Agende seu Horário' : 'Sugestões para você'}
                         </h3>
                         
                         <div className="grid grid-cols-2 gap-4">
                            {[1,2,3,4].map(i => (
                              <div key={i} className="bg-white p-3 rounded-[28px] shadow-sm border border-slate-100 space-y-3">
                                 <div className="h-20 w-full bg-slate-100 rounded-2xl overflow-hidden">
                                    <img src={`https://picsum.photos/seed/${selectedSegment.id}${i}/200/200`} className="w-full h-full object-cover" />
                                 </div>
                                 <div className="flex justify-between items-center">
                                    <span className="font-black text-[10px] text-slate-900">R$ 45,90</span>
                                    {isService ? <Calendar className="h-3 w-3 text-primary" /> : <Plus className="h-3 w-3 text-primary" />}
                                 </div>
                              </div>
                            ))}
                         </div>
                      </div>
                   </div>

                   <div className="p-6 bg-white border-t rounded-t-[40px] shadow-2xl">
                      <Button className="w-full h-14 rounded-2xl font-black italic bg-slate-900 text-primary text-sm shadow-xl shadow-primary/10 flex justify-between px-6">
                         <span>{isService ? 'RESERVAR AGORA' : 'VER CARRINHO'}</span>
                         <ArrowRight className="h-4 w-4" />
                      </Button>
                   </div>
                </div>
              </div>
              <div className="absolute -z-10 w-[500px] h-[500px] bg-primary/20 blur-[120px] rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-60"></div>
            </div>
          </div>
        </section>

        {/* 50 Functions Grid */}
        <section className="py-24 bg-slate-900 text-white overflow-hidden scroll-mt-20">
           <div className="container px-4 md:px-6 mx-auto">
              <div className="text-center mb-20 space-y-4">
                 <h2 className="text-4xl md:text-7xl font-black italic tracking-tighter uppercase leading-none">
                    Engenharia de <span className="text-primary not-italic">Elite.</span>
                 </h2>
                 <p className="text-slate-400 font-bold max-w-2xl mx-auto uppercase text-xs tracking-[0.3em]">
                    150+ Funcionalidades extraordinárias distribuídas em 15 verticais
                 </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                 {[
                   { icon: Camera, label: "AI Vision Scan", desc: "Inventário visual" },
                   { icon: Activity, label: "Predictive IA", desc: "Previsão de venda" },
                   { icon: Wallet, label: "Cashback Pro", desc: "Fidelização 2.0" },
                   { icon: Globe, label: "Custom Domain", desc: "Branding total" },
                   { icon: Zap, label: "Fleet Hub", desc: "Logística própria" },
                   { icon: Star, label: "Sentiment AI", desc: "Análise de reviews" },
                   { icon: Smartphone, label: "Waiter App", desc: "Lançamento em mesa" },
                   { icon: Monitor, label: "PDV Cloud", desc: "Checkout balcão" },
                   { icon: HeartHandshake, label: "Loyalty Tier", desc: "Bronze a Gold" },
                   { icon: ShieldCheck, label: "Fraud Fingerprint", desc: "Segurança total" },
                   { icon: BarChart3, label: "Heatmap Pro", desc: "Zonas de calor" },
                   { icon: Cpu, label: "Scalable Infra", desc: "Saúde de cluster" }
                 ].map((func, i) => (
                   <div key={i} className="group cursor-default">
                      <div className="p-6 bg-white/5 border border-white/10 rounded-[35px] hover:bg-primary transition-all duration-500 flex flex-col items-center text-center space-y-4 hover:scale-105 hover:-rotate-3">
                         <func.icon className="h-8 w-8 text-primary group-hover:text-white" />
                         <div className="space-y-1">
                            <p className="font-black italic text-[10px] uppercase tracking-tighter">{func.label}</p>
                            <p className="text-[8px] font-bold text-slate-500 uppercase group-hover:text-white/60">{func.desc}</p>
                         </div>
                      </div>
                   </div>
                 ))}
              </div>

              <div className="mt-20 flex flex-col md:flex-row justify-center items-center gap-10">
                 <div className="p-8 bg-white/5 rounded-[45px] border border-dashed border-white/20 max-w-sm text-center">
                    <p className="text-primary font-black italic text-3xl">99.9%</p>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-2">Uptime SLA Enterprise</p>
                 </div>
                 <div className="p-8 bg-white/5 rounded-[45px] border border-dashed border-white/20 max-w-sm text-center">
                    <p className="text-primary font-black italic text-3xl">15ms</p>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-2">Latência Global Edge</p>
                 </div>
              </div>
           </div>
        </section>
      </main>

      <footer className="w-full py-20 px-4 border-t bg-slate-50">
        <div className="container mx-auto grid md:grid-cols-4 gap-16">
          <div className="space-y-6">
             <Link className="flex items-center gap-3 group" href="#">
              <div className="bg-primary p-2 rounded-xl text-white shadow-lg shadow-primary/20">
                <Store className="h-6 w-6" />
              </div>
              <span className="text-2xl font-black tracking-tighter text-slate-900 uppercase italic">MERCADO ÁGIL</span>
            </Link>
            <p className="text-sm text-slate-500 font-medium leading-relaxed italic">
              A infraestrutura definitiva de comércio e serviços unificados. Escala global, performance local.
            </p>
          </div>
          <div className="md:col-span-3 flex flex-col justify-between items-end">
             <div className="flex gap-4">
                <div className="h-12 w-12 rounded-2xl bg-white border flex items-center justify-center text-slate-400 hover:text-primary transition-colors cursor-pointer"><Smartphone className="h-6 w-6" /></div>
                <div className="h-12 w-12 rounded-2xl bg-white border flex items-center justify-center text-slate-400 hover:text-primary transition-colors cursor-pointer"><Monitor className="h-6 w-6" /></div>
                <div className="h-12 w-12 rounded-2xl bg-white border flex items-center justify-center text-slate-400 hover:text-primary transition-colors cursor-pointer"><Globe className="h-6 w-6" /></div>
             </div>
             <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mt-10">
                © 2024 MERCADO ÁGIL TECNOLOGIAS LTD. <br/>EDITION V3.2.0-ULTRA-HYPER-SAAS
             </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
