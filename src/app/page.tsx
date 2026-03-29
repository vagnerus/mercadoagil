
"use client";

import * as React from 'react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Store, ShieldCheck, ShoppingCart, ArrowRight, Zap, Globe, 
  BarChart3, Star, CheckCircle2, Smartphone, Sparkles, 
  Activity, Cpu, Monitor, Loader2,
  Scissors, Stethoscope, ShoppingBag, Car, Camera,
  Plus, Dumbbell, PartyPopper, Gavel, Utensils, GraduationCap, Dog,
  Wallet, Trophy, Users, Heart, MessageSquare, Clock, ArrowUpRight, Flame
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

const PRICING = [
  { 
    name: 'Starter Pro', 
    price: '59,90', 
    desc: 'Para profissionais autônomos e MEI.',
    features: ['1 Profissional', 'Agenda Digital', 'WhatsApp Notifier', 'PDV Cloud Básico']
  },
  { 
    name: 'Enterprise Elite', 
    price: '189,90', 
    desc: 'Para redes e unidades de alto fluxo.',
    features: ['Até 15 Profissionais', 'IA Business Advisor', 'LMS Ágil Academy', 'Gestão Financeira DRE', 'Suporte VIP 1h'],
    popular: true
  },
  { 
    name: 'White Label Ultra', 
    price: '499,90', 
    desc: 'Para franqueadoras e grandes grupos.',
    features: ['Ilimitado', 'Domínio Próprio', 'Consultoria de BI Mensal', 'API de Integração', 'App Customizado']
  }
];

export default function LandingPage() {
  const [storeName, setStoreName] = useState("");
  const [selectedSegment, setSelectedSegment] = useState(SEGMENTS[0]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

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

  return (
    <div className="flex flex-col min-h-screen font-body selection:bg-primary selection:text-white bg-white dark:bg-slate-950">
      <header className="px-4 lg:px-6 h-20 flex items-center border-b bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto flex items-center">
          <Link className="flex items-center justify-center gap-3 group" href="#">
            <div className="bg-primary p-2 rounded-xl text-white group-hover:rotate-12 transition-transform shadow-lg">
              <Store className="h-6 w-6" />
            </div>
            <span className="text-2xl font-black tracking-tighter text-slate-900 dark:text-white uppercase italic">MERCADO ÁGIL</span>
          </Link>
          <nav className="ml-auto flex items-center gap-8">
            <Link className="text-sm font-bold text-slate-500 hover:text-primary transition-colors hidden lg:block" href="/login">Entrar</Link>
            <Button className="rounded-full px-8 h-12 font-black italic bg-slate-900 dark:bg-white dark:text-slate-900 text-white shadow-xl hover:scale-105 transition-transform" asChild>
              <Link href="/login">Criar Conta Enterprise</Link>
            </Button>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {/* Segment Slider */}
        <section className="bg-slate-50 dark:bg-slate-900/50 border-b py-4 overflow-x-auto no-scrollbar scroll-smooth">
           <div className="container mx-auto px-4 flex gap-4 min-w-max">
              {SEGMENTS.map((seg) => (
                <button
                  key={seg.id}
                  onClick={() => setSelectedSegment(seg)}
                  className={cn(
                    "flex items-center gap-2 px-6 py-3 rounded-2xl whitespace-nowrap transition-all font-black italic text-xs uppercase tracking-tighter",
                    selectedSegment.id === seg.id 
                      ? "bg-primary text-white shadow-lg shadow-primary/20 scale-105" 
                      : "bg-white dark:bg-slate-800 text-slate-400 border dark:border-slate-700 hover:bg-slate-100"
                  )}
                >
                  <seg.icon className="h-4 w-4" />
                  {seg.label}
                </button>
              ))}
           </div>
        </section>

        {/* Hero Section */}
        <section className="w-full py-16 md:py-32 bg-gradient-to-b from-blue-50/30 dark:from-primary/5 to-white dark:to-slate-950 overflow-hidden">
          <div className="container px-4 md:px-6 mx-auto grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-10">
              <div className="space-y-6">
                <Badge className="rounded-full px-4 py-1.5 bg-primary/10 text-primary border-primary/20 font-black italic uppercase tracking-widest text-[10px]">
                  <Sparkles className="h-3 w-3 mr-2" /> Infraestrutura Global v3.2
                </Badge>
                <h1 className="text-5xl md:text-8xl font-black tracking-tighter text-slate-900 dark:text-white leading-[0.85] italic">
                  O Seu Negócio <br/>Pronto para <span className="text-primary not-italic">Vencer.</span>
                </h1>
                <p className="text-slate-500 dark:text-slate-400 text-lg md:text-xl font-medium max-w-lg leading-relaxed italic">
                  Gere uma infraestrutura de <b>{selectedSegment.label}</b> completa em segundos. Multi-tenant, IA nativa e PDV unificado.
                </p>
              </div>

              <div className="space-y-4">
                <div className="relative max-w-md">
                   <input 
                    placeholder="Nome do seu negócio..." 
                    className="w-full h-20 rounded-[30px] border-4 border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 px-8 font-black text-xl focus:border-primary transition-all pr-44 outline-none shadow-2xl text-slate-900 dark:text-white"
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                   />
                   <Button 
                    onClick={handleMagicClick}
                    disabled={loading}
                    className="absolute right-3 top-3 bottom-3 h-14 px-8 rounded-2xl font-black italic gap-2 shadow-xl shadow-primary/20 text-white text-lg"
                   >
                      {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <>GERAR <ArrowRight className="h-5 w-5" /></>}
                   </Button>
                </div>
                <div className="flex items-center gap-6 text-[10px] font-black text-slate-400 uppercase tracking-widest px-4">
                   <span className="flex items-center gap-2"><div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div> Latência 15ms</span>
                   <span className="flex items-center gap-2"><Zap className="h-3 w-3 text-primary" /> Auto-Provisionamento</span>
                   <span className="flex items-center gap-2"><Globe className="h-3 w-3" /> Multi-Tenant</span>
                </div>
              </div>
            </div>

            <div className="relative flex justify-center perspective-[1500px] hidden lg:flex">
              <div className="w-[340px] h-[680px] bg-slate-900 rounded-[60px] border-[14px] border-slate-900 shadow-[0_60px_120px_-30px_rgba(0,0,0,0.4)] relative overflow-hidden transition-all duration-1000 transform-gpu rotate-y-12">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 h-7 w-32 bg-slate-900 rounded-b-3xl z-30"></div>
                <div className="absolute inset-0 bg-slate-50 flex flex-col pt-12">
                   <div className="px-6 py-4 flex justify-between items-center border-b">
                      <div className="flex items-center gap-2">
                         <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-black italic text-xs">M</div>
                         <span className="font-black text-slate-800 text-sm truncate uppercase italic">{storeName || "Minha Loja"}</span>
                      </div>
                      <ShoppingCart className="h-4 w-4 text-slate-400" />
                   </div>
                   <div className="flex-1 overflow-y-auto p-6 space-y-6">
                      <div className="h-32 w-full bg-slate-200 rounded-3xl relative overflow-hidden">
                         <img src={`https://picsum.photos/seed/${selectedSegment.id}/400/300`} className="w-full h-full object-cover" />
                      </div>
                      <div className="space-y-4">
                         <h3 className="text-[10px] font-black uppercase text-slate-400">Sugestões de Hoje</h3>
                         <div className="grid grid-cols-2 gap-4">
                            {[1,2].map(i => (
                              <div key={i} className="bg-white p-3 rounded-[28px] shadow-sm border border-slate-100 space-y-3">
                                 <div className="h-20 w-full bg-slate-100 rounded-2xl overflow-hidden">
                                    <img src={`https://picsum.photos/seed/${selectedSegment.id}${i}/200/200`} className="w-full h-full object-cover" />
                                 </div>
                                 <p className="font-black text-[10px] text-slate-900 text-center">R$ 45,90</p>
                              </div>
                            ))}
                         </div>
                      </div>
                   </div>
                   <div className="p-6 bg-white border-t rounded-t-[40px] shadow-2xl">
                      <Button className="w-full h-14 rounded-2xl font-black italic bg-slate-900 text-white text-sm">RESERVAR AGORA</Button>
                   </div>
                </div>
              </div>
              <div className="absolute -z-10 w-[500px] h-[500px] bg-primary/20 blur-[120px] rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
            </div>
          </div>
        </section>

        {/* Professional Grid */}
        <section className="py-24 bg-white dark:bg-slate-950">
           <div className="container px-4 md:px-6 mx-auto">
              <div className="text-center mb-20 space-y-4">
                 <h2 className="text-4xl md:text-7xl font-black italic tracking-tighter uppercase leading-none dark:text-white">Engenharia de <span className="text-primary not-italic">Elite.</span></h2>
                 <p className="text-slate-400 font-bold max-w-2xl mx-auto uppercase text-xs tracking-[0.3em]">150+ Funcionalidades extraordinárias para escala global</p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                 {[
                   { icon: Camera, label: "AI Vision Scan", desc: "Inventário visual" },
                   { icon: Activity, label: "Predictive IA", desc: "Previsão de venda" },
                   { icon: Wallet, label: "Cashback Pro", desc: "Fidelização 2.0" },
                   { icon: Globe, label: "Custom Domain", desc: "Branding total" },
                   { icon: Zap, label: "Fleet Hub", desc: "Logística própria" },
                   { icon: Star, label: "Sentiment AI", desc: "Análise de reviews" }
                 ].map((func, i) => (
                   <div key={i} className="p-6 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-[35px] hover:bg-primary transition-all flex flex-col items-center text-center space-y-4 group">
                      <func.icon className="h-8 w-8 text-primary group-hover:text-white transition-colors" />
                      <div className="space-y-1">
                         <p className="font-black italic text-[10px] uppercase dark:text-white group-hover:text-white">{func.label}</p>
                         <p className="text-[8px] font-bold text-slate-500 uppercase">{func.desc}</p>
                      </div>
                   </div>
                 ))}
              </div>
           </div>
        </section>

        {/* Pricing Section */}
        <section className="py-24 bg-slate-50 dark:bg-slate-900/30">
           <div className="container px-4 mx-auto">
              <div className="text-center mb-16 space-y-4">
                 <h2 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter dark:text-white">Planos de <span className="text-primary not-italic">Licenciamento</span></h2>
                 <p className="text-slate-500 font-medium italic">A estrutura certa para cada estágio da sua operação.</p>
              </div>
              <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                 {PRICING.map((plan, i) => (
                   <Card key={i} className={cn(
                     "p-10 rounded-[45px] border-4 flex flex-col h-full relative overflow-hidden transition-all hover:scale-105",
                     plan.popular ? "border-primary bg-white dark:bg-slate-900 shadow-2xl" : "border-transparent bg-white/50 dark:bg-slate-900/50"
                   )}>
                      {plan.popular && <Badge className="absolute top-6 right-6 bg-primary text-white font-black italic">MAIS VENDIDO</Badge>}
                      <div className="space-y-6 flex-1">
                         <div>
                            <h3 className="text-xl font-black italic uppercase dark:text-white">{plan.name}</h3>
                            <p className="text-xs font-medium text-slate-400 mt-1 italic">{plan.desc}</p>
                         </div>
                         <div className="flex items-baseline gap-1">
                            <span className="text-[10px] font-black text-slate-400 uppercase">R$</span>
                            <span className="text-5xl font-black italic tracking-tighter dark:text-white">{plan.price}</span>
                            <span className="text-[10px] font-black text-slate-400 uppercase">/mês</span>
                         </div>
                         <div className="space-y-4">
                            {plan.features.map((f, j) => (
                              <div key={j} className="flex items-center gap-3 text-xs font-bold text-slate-600 dark:text-slate-400 italic">
                                 <CheckCircle2 className="h-4 w-4 text-green-500" /> {f}
                              </div>
                            ))}
                         </div>
                      </div>
                      <Button className={cn(
                        "w-full h-16 rounded-2xl font-black italic mt-10 text-lg shadow-xl",
                        plan.popular ? "bg-primary text-white" : "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                      )} asChild><Link href="/login">COMEÇAR AGORA</Link></Button>
                   </Card>
                 ))}
              </div>
           </div>
        </section>

        {/* Testimonials */}
        <section className="py-24 bg-white dark:bg-slate-950">
           <div className="container px-4 mx-auto text-center space-y-16">
              <h2 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter dark:text-white">Confiança de <span className="text-primary not-italic">Lojistas</span></h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                 {[
                   { name: "Carlos Oliveira", store: "Rede Barbearia Elite", content: "Aumentamos nossa retenção em 40% com o Cashback Pro da Mercado Ágil." },
                   { name: "Dra. Ana Luiza", store: "Clínica Saúde Vital", content: "O PEP criptografado e a telemedicina integrada transformaram minha clínica." },
                   { name: "Fernando Souza", store: "Hamburgueria do Porto", content: "O KDS e o app do garçom reduziram os erros de cozinha a quase zero." }
                 ].map((t, i) => (
                   <Card key={i} className="p-8 rounded-[40px] bg-slate-50 dark:bg-slate-900 border-none text-left space-y-6">
                      <div className="flex gap-1 text-yellow-400"><Star className="h-4 w-4 fill-current" /><Star className="h-4 w-4 fill-current" /><Star className="h-4 w-4 fill-current" /><Star className="h-4 w-4 fill-current" /><Star className="h-4 w-4 fill-current" /></div>
                      <p className="text-slate-600 dark:text-slate-400 font-medium italic leading-relaxed">"{t.content}"</p>
                      <div className="flex items-center gap-4 pt-4 border-t border-slate-200 dark:border-slate-800">
                         <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-black italic"> {t.name[0]} </div>
                         <div>
                            <p className="text-sm font-black italic dark:text-white">{t.name}</p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase">{t.store}</p>
                         </div>
                      </div>
                   </Card>
                 ))}
              </div>
           </div>
        </section>
      </main>

      <footer className="w-full py-20 px-4 border-t bg-slate-50 dark:bg-slate-900">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-3">
             <div className="bg-primary p-2 rounded-xl text-white"><Store className="h-6 w-6" /></div>
             <span className="text-xl font-black tracking-tighter text-slate-900 dark:text-white uppercase italic">MERCADO ÁGIL</span>
          </div>
          <p className="text-[10px] font-black uppercase text-slate-400">© 2024 MERCADO ÁGIL TECNOLOGIAS LTD. v3.2.0-ULTRA-HYPER-SAAS</p>
        </div>
      </footer>
    </div>
  );
}
