
"use client";

import * as React from 'react';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  Search, User, MapPin, 
  ChevronRight, Globe, Zap, SearchIcon,
  Store, Loader2, Star, MessageSquare, Sparkles, Clock, Calendar,
  ArrowRight, Heart, Gift, ShoppingCart, Scissors, Ticket, Bot, ShieldCheck
} from "lucide-react";
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where, limit } from 'firebase/firestore';
import Link from 'next/link';
import { cn } from "@/lib/utils";

export default function StoreFront() {
  const params = useParams();
  const slug = params?.slug as string;
  const db = useFirestore();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [showAiConcierge, setShowAiConcierge] = useState(false);

  const merchantQuery = useMemoFirebase(() => query(
    collection(db, 'merchants'), 
    where('slug', '==', slug), 
    limit(1)
  ), [db, slug]);
  const { data: merchantData, isLoading } = useCollection(merchantQuery);
  const merchant = merchantData?.[0];

  const primaryColor = merchant?.settings?.primaryColor || "#3b82f6";

  useEffect(() => {
    const timer = setTimeout(() => setShowAiConcierge(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white font-body selection:bg-primary overflow-x-hidden">
      {/* Navbar Premium */}
      <header className="px-6 h-20 flex items-center border-b border-white/5 sticky top-0 z-[60] bg-black/80 backdrop-blur-2xl">
        <div className="container max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-10">
             <Link href={`/store/${slug}`} className="flex items-center gap-2 group">
                <div className="h-10 w-10 rounded-2xl flex items-center justify-center text-white font-black italic text-sm shadow-lg group-hover:scale-110 transition-transform" style={{ backgroundColor: primaryColor }}>M</div>
                <span className="font-black italic tracking-tighter text-2xl text-white uppercase">Mercado<span style={{ color: primaryColor }}>Facil</span></span>
             </Link>
             <nav className="hidden lg:flex items-center gap-8">
                <Link href="#" className="text-[10px] font-black uppercase tracking-widest text-white border-b-2 pb-1" style={{ borderColor: primaryColor }}>Home</Link>
                <Link href="#" className="text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white transition-colors">Serviços</Link>
                <Link href="#" className="text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white transition-colors">Produtos</Link>
                <Link href={`/store/${slug}/profile`} className="text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white transition-colors">Fidelidade</Link>
             </nav>
          </div>
          <div className="flex items-center gap-4">
             <Button variant="ghost" size="icon" className="rounded-2xl bg-white/5 hover:bg-white/10 text-white relative">
                <ShoppingCart className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-primary rounded-full text-[8px] flex items-center justify-center font-black" style={{ backgroundColor: primaryColor }}>0</span>
             </Button>
             <Button className="rounded-2xl h-11 px-6 font-black italic text-xs uppercase shadow-xl" style={{ backgroundColor: primaryColor }} asChild>
                <Link href="/login">ENTRAR / CRIAR CONTA</Link>
             </Button>
          </div>
        </div>
      </header>

      <main className="container max-w-6xl mx-auto px-6 pt-12 pb-32 space-y-24">
        {/* Hero Section Ultra Premium */}
        <section className="grid lg:grid-cols-2 gap-16 items-center">
           <div className="space-y-10 animate-in fade-in slide-in-from-left-10 duration-1000">
              <div className="space-y-4">
                 <Badge className="border-none font-black italic text-[9px] uppercase px-5 py-2 rounded-full tracking-widest" style={{ backgroundColor: `${primaryColor}20`, color: primaryColor }}>
                    <ShieldCheck className="h-3 w-3 mr-2 inline" /> Atendimento Master Verificado
                 </Badge>
                 <h2 className="text-6xl md:text-8xl font-black italic uppercase tracking-tighter leading-[0.85]">
                    Sua melhor <br/>versão em <br/><span style={{ color: primaryColor }}>minutos.</span>
                 </h2>
              </div>
              <p className="text-slate-400 font-medium text-xl italic max-w-md leading-relaxed">
                 Agende online na <b>{merchant?.name}</b> e ganhe 5% de cashback em cada serviço. O futuro do seu cuidado pessoal está aqui.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                 <Button className="h-16 px-10 rounded-[30px] font-black italic text-lg shadow-2xl hover:scale-105 transition-all" style={{ backgroundColor: primaryColor }} asChild>
                    <Link href={`/store/${slug}/book`}>RESERVAR AGORA <ArrowRight className="h-5 w-5 ml-2" /></Link>
                 </Button>
                 <Button variant="outline" className="h-16 px-10 rounded-[30px] font-black italic text-lg border-white/10 hover:bg-white/5 bg-transparent">
                    VER CARDÁPIO
                 </Button>
              </div>
              <div className="flex items-center gap-8 pt-4">
                 <div className="flex -space-x-3">
                    {[1,2,3,4].map(i => <div key={i} className="h-10 w-10 rounded-full border-4 border-[#050505] bg-slate-800 overflow-hidden"><img src={`https://picsum.photos/seed/user${i}/100/100`} /></div>)}
                 </div>
                 <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">+1.2k clientes ativos</p>
              </div>
           </div>
           
           <div className="relative group animate-in zoom-in-95 duration-1000">
              <div className="absolute -inset-10 rounded-[60px] blur-[100px] opacity-20 transition-all group-hover:opacity-40" style={{ backgroundColor: primaryColor }}></div>
              <div className="relative aspect-[4/5] lg:aspect-square rounded-[60px] overflow-hidden border border-white/10 shadow-3xl bg-slate-900">
                 <img 
                  src={merchant?.bannerUrl || `https://picsum.photos/seed/${slug}/1000/1000`} 
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
                 />
                 <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
                 
                 {/* Floating Info Card */}
                 <div className="absolute top-10 right-10 bg-black/60 backdrop-blur-xl p-6 rounded-[35px] border border-white/10 space-y-4 animate-bounce-slow">
                    <div className="flex items-center gap-3">
                       <div className="h-10 w-10 rounded-2xl bg-primary flex items-center justify-center" style={{ backgroundColor: primaryColor }}>
                          <Gift className="h-5 w-5 text-white" />
                       </div>
                       <div>
                          <p className="text-[10px] font-black text-white uppercase italic">Clube de Vantagens</p>
                          <p className="text-xs font-bold text-slate-400">Cashback Ativo</p>
                       </div>
                    </div>
                 </div>

                 <div className="absolute bottom-12 left-12 right-12 space-y-4">
                    <div className="flex gap-2">
                       <Badge className="bg-white/10 backdrop-blur-md text-white border-none font-black italic text-[8px] uppercase">WIFI GRÁTIS</Badge>
                       <Badge className="bg-white/10 backdrop-blur-md text-white border-none font-black italic text-[8px] uppercase">OPEN BAR</Badge>
                    </div>
                    <h3 className="text-4xl font-black italic uppercase tracking-tighter">{merchant?.name}</h3>
                    <div className="flex items-center gap-4 text-slate-400 text-sm font-bold uppercase tracking-widest">
                       <span className="flex items-center gap-2"><MapPin className="h-4 w-4" style={{ color: primaryColor }} /> {merchant?.contact?.address?.split(',')[0]}</span>
                       <span className="flex items-center gap-2"><Star className="h-4 w-4 fill-yellow-400 text-yellow-400" /> 4.9</span>
                    </div>
                 </div>
              </div>
           </div>
        </section>

        {/* Busca Inteligente IA */}
        <section className="space-y-10 pt-12">
           <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-white/5 pb-8">
              <div className="space-y-2">
                 <h3 className="text-[10px] font-black uppercase text-primary tracking-[0.4em] italic" style={{ color: primaryColor }}>Explorar Experiências</h3>
                 <h2 className="text-4xl font-black italic uppercase tracking-tighter">O que vamos <span className="text-white/40">fazer hoje?</span></h2>
              </div>
              <div className="flex gap-3">
                 <Button variant="ghost" className="rounded-2xl bg-white/5 border border-white/5 font-black italic text-[10px] uppercase h-12 px-6">Todos</Button>
                 <Button variant="ghost" className="rounded-2xl border border-white/5 font-black italic text-[10px] uppercase h-12 px-6">Em Destaque</Button>
              </div>
           </div>

           <div className="relative group max-w-4xl mx-auto">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary to-accent rounded-[40px] opacity-20 blur-xl group-focus-within:opacity-40 transition-opacity" style={{ backgroundImage: `linear-gradient(to right, ${primaryColor}, #8b5cf6)` }}></div>
              <SearchIcon className="absolute left-8 top-1/2 -translate-y-1/2 h-7 w-7 text-slate-500 group-focus-within:text-white transition-colors" />
              <Input 
                className="h-24 w-full bg-slate-900/80 backdrop-blur-xl border-2 border-white/5 rounded-[40px] px-20 font-black text-2xl focus:ring-0 outline-none transition-all placeholder:text-slate-700" 
                style={{ borderColor: searchTerm ? primaryColor : 'rgba(255,255,255,0.05)' }}
                placeholder="Cabelo, barba, massagem, combos..." 
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
              <Button className="absolute right-4 top-4 bottom-4 px-8 rounded-3xl font-black italic text-sm shadow-xl" style={{ backgroundColor: primaryColor }}>BUSCAR AGORA</Button>
           </div>
        </section>

        {/* Grid de Serviços de Elite */}
        <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
           {[
             { id: 's1', name: "Corte Master", price: 45, time: 30, desc: "Corte com visagismo, lavagem e finalização premium." },
             { id: 's2', name: "Combo Barba & Cabelo", price: 80, time: 60, desc: "A experiência completa com toalha quente e massagem." },
             { id: 's3', name: "Barboterapia", price: 40, time: 30, desc: "Tratamento de pele, hidratação e barbear clássico." }
           ].map((s, i) => (
             <Card key={i} className="bg-white/5 border-white/5 rounded-[45px] overflow-hidden group hover:bg-white/10 transition-all duration-500 border-b-8 shadow-2xl" style={{ borderBottomColor: primaryColor }}>
                <div className="h-48 overflow-hidden relative">
                   <img src={`https://picsum.photos/seed/service${i}/600/400`} className="w-full h-full object-cover opacity-40 group-hover:opacity-100 transition-all duration-700 group-hover:scale-110" />
                   <div className="absolute top-6 left-6">
                      <Badge className="bg-black/60 backdrop-blur-md text-white border-none font-black italic text-[10px] px-4 py-1.5 rounded-full">+10 pts</Badge>
                   </div>
                </div>
                <CardContent className="p-10 space-y-6">
                   <div className="space-y-2">
                      <h4 className="text-2xl font-black italic uppercase tracking-tighter group-hover:text-primary transition-colors" style={{ color: primaryColor }}>{s.name}</h4>
                      <p className="text-sm font-medium text-slate-500 italic leading-relaxed">{s.desc}</p>
                   </div>
                   <div className="flex items-center justify-between pt-4 border-t border-white/5">
                      <div className="space-y-1">
                         <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Valor do Investimento</p>
                         <p className="text-3xl font-black italic text-white">R$ {s.price.toFixed(2)}</p>
                      </div>
                      <div className="text-right">
                         <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest flex items-center gap-1 justify-end"><Clock className="h-3 w-3" /> {s.time} min</p>
                         <Button size="sm" className="mt-2 rounded-xl font-black italic text-[10px] h-9 px-4" style={{ backgroundColor: primaryColor }} asChild>
                            <Link href={`/store/${slug}/book`}>RESERVAR</Link>
                         </Button>
                      </div>
                   </div>
                </CardContent>
             </Card>
           ))}
        </section>

        {/* Club Membership Section */}
        <section className="pt-20">
           <Card className="bg-slate-900 border-none rounded-[60px] p-12 md:p-24 relative overflow-hidden text-center md:text-left">
              <div className="grid md:grid-cols-2 gap-16 items-center relative z-10">
                 <div className="space-y-10">
                    <div className="space-y-4">
                       <Badge className="bg-primary/20 text-primary border-none font-black italic text-[10px] px-6 py-2 rounded-full uppercase" style={{ color: primaryColor }}>CLUBE DE ELITE MERCADOFACIL</Badge>
                       <h3 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter leading-[0.9]">Transforme <br/>cortes em <br/><span style={{ color: primaryColor }}>Créditos.</span></h3>
                    </div>
                    <div className="grid gap-6">
                       <div className="flex items-start gap-4">
                          <div className="h-8 w-8 rounded-full bg-white/5 flex items-center justify-center shrink-0"><CheckCircle2 className="h-5 w-5 text-green-500" /></div>
                          <p className="text-slate-400 font-medium italic"><b>5% de Cashback</b> em todos os serviços executados.</p>
                       </div>
                       <div className="flex items-start gap-4">
                          <div className="h-8 w-8 rounded-full bg-white/5 flex items-center justify-center shrink-0"><CheckCircle2 className="h-5 w-5 text-green-500" /></div>
                          <p className="text-slate-400 font-medium italic"><b>Indique e Ganhe:</b> R$ 10,00 por amigo indicado.</p>
                       </div>
                       <div className="flex items-start gap-4">
                          <div className="h-8 w-8 rounded-full bg-white/5 flex items-center justify-center shrink-0"><CheckCircle2 className="h-5 w-5 text-green-500" /></div>
                          <p className="text-slate-400 font-medium italic"><b>Fila Fast-Pass:</b> Prioridade em cancelamentos.</p>
                       </div>
                    </div>
                    <Button className="h-20 w-full sm:w-auto px-16 rounded-[35px] font-black italic text-xl shadow-3xl hover:scale-105 transition-all" style={{ backgroundColor: primaryColor }}>QUERO ME TORNAR VIP AGORA</Button>
                 </div>
                 <div className="hidden md:flex justify-center">
                    <div className="h-[500px] w-full bg-white/5 rounded-[60px] border border-white/10 relative p-10 overflow-hidden shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-700">
                       <div className="space-y-10">
                          <div className="flex justify-between items-center">
                             <Ticket className="h-10 w-10 text-primary" style={{ color: primaryColor }} />
                             <span className="font-black italic text-slate-500">MERCADOFACIL GOLD</span>
                          </div>
                          <div className="space-y-4">
                             <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Saldo na Carteira</p>
                             <p className="text-6xl font-black italic tracking-tighter">R$ 124,50</p>
                          </div>
                          <div className="pt-10 border-t border-white/5 space-y-6">
                             <p className="text-xs font-bold text-slate-400">ÚLTIMO USO: HÁ 2 DIAS</p>
                             <div className="flex items-center gap-4 bg-black/40 p-4 rounded-3xl">
                                <Zap className="h-6 w-6 text-primary" style={{ color: primaryColor }} />
                                <p className="text-[10px] font-black italic">VOCÊ ESTÁ NO TOP 5% DE CLIENTES</p>
                             </div>
                          </div>
                       </div>
                       <div className="absolute -bottom-10 -right-10 h-48 w-48 rounded-full blur-[80px] opacity-30" style={{ backgroundColor: primaryColor }}></div>
                    </div>
                 </div>
              </div>
              <Sparkles className="absolute -bottom-20 -right-20 h-[400px] w-[400px] opacity-[0.03] rotate-12" />
           </Card>
        </section>
      </main>

      {/* AI Concierge Chat Bubble */}
      <div className={cn(
        "fixed bottom-8 right-8 z-[100] transition-all duration-1000 transform",
        showAiConcierge ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"
      )}>
         <div className="relative group">
            <div className="absolute -inset-4 bg-primary rounded-full blur-2xl opacity-20 animate-pulse" style={{ backgroundColor: primaryColor }}></div>
            <button className="h-20 w-20 rounded-[30px] shadow-3xl border-4 border-white flex items-center justify-center relative overflow-hidden transition-all hover:scale-110 active:scale-95 group" style={{ backgroundColor: primaryColor }}>
               <Bot className="h-10 w-10 text-white" />
               <div className="absolute top-0 right-0 h-6 w-6 bg-red-500 rounded-full border-4 border-white flex items-center justify-center animate-bounce">
                  <span className="text-[8px] font-black text-white">1</span>
               </div>
            </button>
            <div className="absolute right-24 bottom-4 bg-white p-5 rounded-[25px] rounded-br-none shadow-3xl text-slate-900 w-64 opacity-0 group-hover:opacity-100 transition-all pointer-events-none border border-slate-100">
               <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-1" style={{ color: primaryColor }}>IA Concierge</p>
               <p className="text-xs font-bold italic leading-relaxed">"Olá! Notei que você curte cortes degradê. Temos um horário especial hoje às 16h com o Ricardo. Quer reservar?"</p>
            </div>
         </div>
      </div>

      <footer className="border-t border-white/5 py-32 px-6 bg-black">
         <div className="container max-w-6xl mx-auto grid md:grid-cols-4 gap-24">
            <div className="space-y-8">
               <Link href={`/store/${slug}`} className="flex items-center gap-2">
                  <div className="h-10 w-10 rounded-2xl flex items-center justify-center text-white font-black italic text-sm" style={{ backgroundColor: primaryColor }}>M</div>
                  <span className="font-black italic tracking-tighter text-2xl text-white uppercase">MercadoFacil</span>
               </Link>
               <p className="text-slate-500 text-sm leading-relaxed font-medium italic">A plataforma definitiva para agendamentos de elite. Performance, segurança e exclusividade em cada clique.</p>
               <div className="flex gap-4">
                  <div className="h-12 w-12 rounded-2xl bg-white/5 flex items-center justify-center text-slate-500 hover:text-white transition-colors cursor-pointer border border-white/5"><Globe className="h-5 w-5" /></div>
                  <div className="h-12 w-12 rounded-2xl bg-white/5 flex items-center justify-center text-slate-500 hover:text-white transition-colors cursor-pointer border border-white/5"><MessageSquare className="h-5 w-5" /></div>
               </div>
            </div>
            <div className="md:col-span-3 grid grid-cols-2 sm:grid-cols-3 gap-12">
               <div className="space-y-6">
                  <h4 className="text-[10px] font-black uppercase text-white tracking-[0.3em]">Plataforma</h4>
                  <nav className="flex flex-col gap-4 text-slate-500 font-bold text-xs uppercase tracking-widest">
                     <Link href="#" className="hover:text-primary transition-colors">Sobre Nós</Link>
                     <Link href="#" className="hover:text-primary transition-colors">Serviços</Link>
                     <Link href="#" className="hover:text-primary transition-colors">Unidades</Link>
                  </nav>
               </div>
               <div className="space-y-6">
                  <h4 className="text-[10px] font-black uppercase text-white tracking-[0.3em]">Ajuda</h4>
                  <nav className="flex flex-col gap-4 text-slate-500 font-bold text-xs uppercase tracking-widest">
                     <Link href="#" className="hover:text-primary transition-colors">Privacidade</Link>
                     <Link href="#" className="hover:text-primary transition-colors">Termos</Link>
                     <Link href="#" className="hover:text-primary transition-colors">Contato</Link>
                  </nav>
               </div>
               <div className="space-y-6">
                  <h4 className="text-[10px] font-black uppercase text-white tracking-[0.3em]">Admin</h4>
                  <nav className="flex flex-col gap-4 text-slate-500 font-bold text-xs uppercase tracking-widest">
                     <Link href="/login" className="hover:text-primary transition-colors">Painel Lojista</Link>
                     <Link href="/login" className="hover:text-primary transition-colors">Master Admin</Link>
                  </nav>
               </div>
            </div>
         </div>
         <div className="container max-w-6xl mx-auto pt-24 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
            <p className="text-[9px] font-black uppercase text-slate-700 tracking-[0.4em]">© 2024 MERCADO ÁGIL HYPER-SAAS v3.2.0-ULTRA-ELITE</p>
            <Badge variant="outline" className="border-white/10 text-slate-500 font-black italic px-6 py-2 rounded-full text-[8px] uppercase">INFRAESTRUTURA SP-SOUTH-1 STABLE</Badge>
         </div>
      </footer>
    </div>
  );
}
