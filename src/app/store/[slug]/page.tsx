
"use client";

import * as React from 'react';
import { useState } from 'react';
import { useParams } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  Search, User, MapPin, 
  ChevronRight, Globe, Zap, SearchIcon,
  Store, Loader2, Star, MessageSquare, Sparkles, Clock, Calendar
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

  const merchantQuery = useMemoFirebase(() => query(
    collection(db, 'merchants'), 
    where('slug', '==', slug), 
    limit(1)
  ), [db, slug]);
  const { data: merchantData, isLoading } = useCollection(merchantQuery);
  const merchant = merchantData?.[0];

  const primaryColor = merchant?.settings?.primaryColor || "#3b82f6";

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white font-body selection:bg-primary overflow-x-hidden">
      {/* Header Premium */}
      <header className="px-6 h-20 flex items-center border-b border-white/5 sticky top-0 z-50 bg-black/80 backdrop-blur-xl">
        <div className="container max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-10">
             <Link href={`/store/${slug}`} className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg flex items-center justify-center text-white font-black italic text-xs" style={{ backgroundColor: primaryColor }}>M</div>
                <span className="font-black italic tracking-tighter text-xl text-white uppercase">MercadoFacil</span>
             </Link>
             <nav className="hidden md:flex items-center gap-8">
                <Link href="#" className="text-sm font-bold text-white uppercase tracking-tighter">Início</Link>
                <Link href="#" className="text-sm font-bold uppercase tracking-tighter border-b-2 pb-1" style={{ color: primaryColor, borderColor: primaryColor }}>Procurar</Link>
                <Link href={`/store/${slug}/profile`} className="text-sm font-bold text-white/60 hover:text-white uppercase tracking-tighter transition-colors">Meus Agendamentos</Link>
             </nav>
          </div>
          <div className="flex items-center gap-6">
             <Button variant="ghost" className="rounded-full bg-white/5 hover:bg-white/10 h-10 px-6 gap-2 border border-white/10" asChild>
                <Link href="/login"><User className="h-4 w-4" /> <span className="font-bold text-xs uppercase">Entrar</span></Link>
             </Button>
          </div>
        </div>
      </header>

      <main className="container max-w-6xl mx-auto px-6 pt-16 pb-32 space-y-16">
        {/* Saudação e Hero */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
           <div className="space-y-6">
              <Badge className="border-none font-black italic text-[10px] uppercase px-4 py-1.5 rounded-full" style={{ backgroundColor: `${primaryColor}20`, color: primaryColor }}>
                 💎 ATENDIMENTO DE ELITE ATIVADO
              </Badge>
              <h2 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter leading-[0.9]">
                 Reserve sua <br/>experiência <br/><span style={{ color: primaryColor }}>agora.</span>
              </h2>
              <p className="text-slate-500 font-medium text-lg italic max-w-md">
                 Agendamentos online, histórico de serviços e cashback exclusivo na {merchant?.name || 'sua loja favorita'}.
              </p>
           </div>
           
           <div className="relative group">
              <div className="absolute -inset-4 rounded-[50px] blur-3xl opacity-20" style={{ backgroundColor: primaryColor }}></div>
              <Card className="relative bg-white/5 border-white/10 rounded-[50px] overflow-hidden aspect-video shadow-2xl">
                 <img 
                  src={merchant?.bannerUrl || `https://picsum.photos/seed/${slug}/800/600`} 
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" 
                 />
                 <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
                 <div className="absolute bottom-8 left-8 right-8 flex justify-between items-end">
                    <div>
                       <Badge className="bg-primary text-white border-none font-black italic text-[10px] mb-2 uppercase" style={{ backgroundColor: primaryColor }}>UNIDADE VERIFICADA</Badge>
                       <h3 className="text-3xl font-black italic uppercase">{merchant?.name}</h3>
                       <p className="text-xs font-bold text-slate-400 flex items-center gap-2 mt-1 uppercase">
                          <MapPin className="h-3 w-3" /> {merchant?.contact?.address || 'Localização de Elite'}
                       </p>
                    </div>
                    <Button className="h-14 rounded-2xl px-8 font-black italic gap-2 shadow-xl" style={{ backgroundColor: primaryColor }} asChild>
                       <Link href={`/store/${slug}/book`}>RESERVAR <ChevronRight className="h-5 w-5" /></Link>
                    </Button>
                 </div>
              </Card>
           </div>
        </div>

        {/* Busca e Categorias */}
        <div className="space-y-8 pt-12">
           <div className="relative group max-w-3xl">
              <SearchIcon className="absolute left-6 top-1/2 -translate-y-1/2 h-6 w-6 text-slate-500 group-focus-within:text-primary transition-colors" />
              <Input 
                className="h-20 w-full bg-white/5 border-2 border-white/10 rounded-[35px] px-16 font-black text-xl focus:ring-0 outline-none transition-all" 
                style={{ borderColor: searchTerm ? primaryColor : 'rgba(255,255,255,0.1)' }}
                placeholder="Procurar por serviços ou produtos..." 
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
           </div>

           <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
              {["Todos", "Cabelo", "Barba", "Estética", "Pacotes", "Combos"].map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={cn(
                    "flex items-center gap-2 px-8 py-4 rounded-2xl whitespace-nowrap transition-all font-black italic text-xs uppercase tracking-tighter border",
                    selectedCategory === cat 
                      ? "text-white border-primary shadow-lg shadow-primary/20" 
                      : "bg-white/5 text-slate-400 border-white/5 hover:bg-white/10"
                  )}
                  style={{ 
                    backgroundColor: selectedCategory === cat ? primaryColor : 'transparent',
                    borderColor: selectedCategory === cat ? primaryColor : 'rgba(255,255,255,0.05)'
                  }}
                >
                  {cat}
                </button>
              ))}
           </div>
        </div>

        {/* Seção de Social Proof / Reviews */}
        <div className="py-12 space-y-8">
           <div className="flex items-center gap-4">
              <h3 className="text-[10px] font-black uppercase text-slate-500 tracking-[0.3em]">O que dizem sobre nós</h3>
              <div className="h-px flex-1 bg-white/5"></div>
           </div>
           
           <div className="grid md:grid-cols-3 gap-6">
              {[
                { name: "Carlos A.", comment: "Melhor experiência de agendamento que já tive. O sistema de cashback realmente funciona!", rating: 5 },
                { name: "Mariana S.", comment: "O ambiente é incrível e o atendimento impecável. Faço questão de voltar sempre.", rating: 5 },
                { name: "Ricardo O.", comment: "Prático, rápido e direto ao ponto. Recomendo para quem busca agilidade.", rating: 4 }
              ].map((review, i) => (
                <Card key={i} className="bg-white/5 border-white/5 p-8 rounded-[40px] space-y-4 hover:bg-white/10 transition-all group">
                   <div className="flex gap-1">
                      {[...Array(review.rating)].map((_, i) => <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />)}
                   </div>
                   <p className="text-sm font-medium text-slate-400 italic leading-relaxed group-hover:text-white transition-colors">"{review.comment}"</p>
                   <div className="flex items-center gap-3 pt-4">
                      <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center font-black text-[10px]" style={{ color: primaryColor }}>{review.name[0]}</div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{review.name}</span>
                   </div>
                </Card>
              ))}
           </div>
        </div>

        {/* Footer de Ação Final */}
        <div className="pt-20 text-center">
           <Card className="bg-slate-900 border-none rounded-[60px] p-12 md:p-20 relative overflow-hidden">
              <div className="relative z-10 space-y-8 max-w-2xl mx-auto">
                 <h3 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter leading-none">Faça parte do <br/><span style={{ color: primaryColor }}>nosso clube.</span></h3>
                 <p className="text-slate-400 text-lg italic">Ganhe 5% de cashback em todos os serviços e produtos acumulando pontos para trocas exclusivas.</p>
                 <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button className="h-16 px-12 rounded-3xl font-black italic text-xl shadow-2xl" style={{ backgroundColor: primaryColor }} asChild>
                       <Link href="/login">CRIAR MINHA CONTA</Link>
                    </Button>
                    <Button variant="outline" className="h-16 px-12 rounded-3xl font-black italic text-xl border-white/10 hover:bg-white/5" asChild>
                       <Link href={`/store/${slug}/book`}>RESERVAR AGORA</Link>
                    </Button>
                 </div>
              </div>
              <Sparkles className="absolute -bottom-10 -right-10 h-64 w-64 opacity-5 rotate-12" />
              <Zap className="absolute -top-10 -left-10 h-64 w-64 opacity-5 -rotate-12" />
           </Card>
        </div>
      </main>

      <footer className="border-t border-white/5 py-20 px-6 bg-slate-950">
         <div className="container max-w-6xl mx-auto grid md:grid-cols-4 gap-16">
            <div className="space-y-6">
               <h4 className="font-black italic text-xl uppercase tracking-tighter">MercadoFacil</h4>
               <p className="text-slate-500 text-sm leading-relaxed font-medium">A plataforma definitiva para agendamentos de elite. Performance, segurança e exclusividade em cada clique.</p>
            </div>
            <div className="md:col-span-3 flex flex-col md:flex-row justify-between items-end gap-8">
               <div className="flex gap-6 text-[10px] font-black uppercase text-slate-500">
                  <Link href="#" className="hover:text-white">Termos de Uso</Link>
                  <Link href="#" className="hover:text-white">Privacidade</Link>
                  <Link href="#" className="hover:text-white">Ajuda</Link>
               </div>
               <p className="text-[10px] font-black uppercase text-slate-700 tracking-[0.3em]">© 2024 MERCADO ÁGIL HYPER-SAAS v3.2</p>
            </div>
         </div>
      </footer>
    </div>
  );
}
