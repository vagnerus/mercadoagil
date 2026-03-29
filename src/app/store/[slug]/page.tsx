
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
  Store, Loader2
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
  const [selectedCategory, setSelectedCategory] = useState("Nome");

  const merchantQuery = useMemoFirebase(() => query(
    collection(db, 'merchants'), 
    where('slug', '==', slug), 
    limit(1)
  ), [db, slug]);
  const { data: merchantData, isLoading } = useCollection(merchantQuery);
  const merchant = merchantData?.[0];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white font-body selection:bg-primary">
      {/* Header Premium */}
      <header className="px-6 h-20 flex items-center border-b border-white/5 sticky top-0 z-50 bg-black/80 backdrop-blur-xl">
        <div className="container max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-10">
             <Link href={`/store/${slug}`} className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-white font-black italic text-xs">M</div>
                <span className="font-black italic tracking-tighter text-xl text-white uppercase">MercadoFacil</span>
             </Link>
             <nav className="hidden md:flex items-center gap-8">
                <Link href="#" className="text-sm font-bold text-white uppercase tracking-tighter">Início</Link>
                <Link href="#" className="text-sm font-bold text-primary uppercase tracking-tighter border-b-2 border-primary pb-1">Procurar</Link>
                <Link href={`/store/${slug}/profile`} className="text-sm font-bold text-white/60 hover:text-white uppercase tracking-tighter transition-colors">Os Meus Agendamentos</Link>
             </nav>
          </div>
          <div className="flex items-center gap-6">
             <div className="flex items-center gap-2 text-white/60">
                <Zap className="h-4 w-4" />
                <span className="text-[10px] font-black uppercase tracking-widest hidden sm:inline">PT-BR</span>
             </div>
             <Button variant="ghost" className="rounded-full bg-white/5 hover:bg-white/10 h-10 px-6 gap-2 border border-white/10" asChild>
                <Link href="/login"><User className="h-4 w-4" /> <span className="font-bold text-xs uppercase">Entrar</span></Link>
             </Button>
          </div>
        </div>
      </header>

      <main className="container max-w-6xl mx-auto px-6 pt-16 space-y-12">
        {/* Saudação */}
        <div className="space-y-1">
           <h2 className="text-3xl font-black italic uppercase tracking-tighter">Seja bem-vindo(a)</h2>
           <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest">{new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
        </div>

        {/* Busca Central */}
        <div className="space-y-6">
           <div className="relative group">
              <SearchIcon className="absolute left-6 top-1/2 -translate-y-1/2 h-6 w-6 text-slate-500 group-focus-within:text-primary transition-colors" />
              <Input 
                className="h-20 w-full bg-white/5 border-2 border-white/10 rounded-[30px] px-16 font-black text-xl focus:border-primary focus:ring-0 outline-none transition-all" 
                placeholder="Procurar pelo nome..." 
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
           </div>

           <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
              {[
                { label: "Nome", icon: Store },
                { label: "Cidade", icon: MapPin },
                { label: "Próximas", icon: Globe }
              ].map(cat => (
                <button
                  key={cat.label}
                  onClick={() => setSelectedCategory(cat.label)}
                  className={cn(
                    "flex items-center gap-2 px-8 py-4 rounded-2xl whitespace-nowrap transition-all font-black italic text-xs uppercase tracking-tighter border",
                    selectedCategory === cat.label 
                      ? "bg-primary text-white border-primary shadow-lg shadow-primary/20" 
                      : "bg-white/5 text-slate-400 border-white/5 hover:bg-white/10"
                  )}
                >
                  <cat.icon className="h-4 w-4" />
                  {cat.label}
                </button>
              ))}
           </div>
        </div>

        {/* Resultados */}
        {(!searchTerm && !merchant) ? (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-6">
             <div className="h-40 w-40 rounded-full bg-white/5 border-2 border-dashed border-white/10 flex items-center justify-center animate-pulse">
                <Search className="h-16 w-16 text-slate-700" />
             </div>
             <div className="space-y-2">
                <h3 className="text-2xl font-black italic uppercase tracking-tighter">Encontre um estabelecimento</h3>
                <p className="text-slate-500 font-medium text-sm max-w-sm">Procure pelo nome ou cidade do estabelecimento para realizar seu agendamento de elite.</p>
             </div>
          </div>
        ) : (
          <div className="grid gap-6 animate-in fade-in slide-in-from-bottom-4">
             <h3 className="text-[10px] font-black uppercase text-slate-500 tracking-[0.3em]">Resultados Encontrados</h3>
             {merchant && (
               <Card className="bg-white/5 border-white/10 rounded-[40px] overflow-hidden hover:bg-white/10 transition-all cursor-pointer group">
                  <div className="flex flex-col md:flex-row items-center">
                     <div className="h-48 w-full md:w-72 overflow-hidden shrink-0">
                        <img src={merchant?.bannerUrl || `https://picsum.photos/seed/${slug}/600/400`} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
                     </div>
                     <div className="p-10 flex-1 flex flex-col md:flex-row justify-between items-center gap-8">
                        <div className="text-center md:text-left space-y-2">
                           <Badge className="bg-primary text-white border-none font-black italic uppercase text-[8px] tracking-widest">VERIFICADO</Badge>
                           <h4 className="text-3xl font-black italic uppercase tracking-tighter leading-none">{merchant?.name}</h4>
                           <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest flex items-center gap-2 justify-center md:justify-start">
                              <MapPin className="h-3 w-3" /> {merchant?.contact?.address || 'Localização não definida'}
                           </p>
                        </div>
                        <Button className="h-16 px-12 bg-primary text-white rounded-3xl font-black italic text-lg shadow-xl shadow-primary/20 hover:scale-105 transition-transform" asChild>
                           <Link href={`/store/${slug}/book`}>RESERVAR AGORA <ChevronRight className="ml-2 h-5 w-5" /></Link>
                        </Button>
                     </div>
                  </div>
               </Card>
             )}
          </div>
        )}
      </main>

      <footer className="mt-32 border-t border-white/5 py-20 px-6">
         <div className="container max-w-6xl mx-auto grid md:grid-cols-4 gap-16">
            <div className="space-y-6">
               <h4 className="font-black italic text-xl uppercase tracking-tighter">MercadoFacil</h4>
               <p className="text-slate-500 text-sm leading-relaxed font-medium">A plataforma definitiva para agendamentos de elite. Performance, segurança e exclusividade.</p>
            </div>
            <div className="md:col-span-3 flex justify-end items-end">
               <p className="text-[10px] font-black uppercase text-slate-700 tracking-[0.3em]">© 2024 MERCADO ÁGIL HYPER-SAAS v3.2</p>
            </div>
         </div>
      </footer>
    </div>
  );
}
