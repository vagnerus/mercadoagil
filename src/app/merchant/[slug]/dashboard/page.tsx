
"use client";

import * as React from 'react';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  ShoppingBag, Package, DollarSign, Clock, LayoutDashboard, List, Settings, 
  TrendingUp, BrainCircuit, Activity, Zap, Users, Monitor, 
  Calendar, Scissors, Wallet, Globe, Plus, LogOut, ShieldCheck,
  ChevronRight, ArrowRight, Loader2
} from "lucide-react";
import Link from 'next/link';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where, limit } from 'firebase/firestore';
import { useToast } from "@/hooks/use-toast";

export default function MerchantDashboard({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = React.use(params);
  const db = useFirestore();
  const { toast } = useToast();
  
  // Buscar os dados do Merchant baseado no slug no Firestore
  const merchantQuery = useMemoFirebase(() => query(
    collection(db, 'merchants'), 
    where('slug', '==', slug),
    limit(1)
  ), [db, slug]);

  const { data: merchantData, isLoading: loadingMerchant } = useCollection(merchantQuery);
  const merchant = merchantData?.[0];

  const stats = [
    { title: "Vendas Hoje", value: "R$ 0,00", icon: DollarSign, color: "text-green-600", bg: "bg-green-100", trend: "0%" },
    { title: "Ticket Médio", value: "R$ 0,00", icon: TrendingUp, color: "text-blue-600", bg: "bg-blue-100", trend: "0%" },
    { title: "Atividade", value: "Normal", icon: Activity, color: "text-purple-600", bg: "bg-purple-100", trend: "Live" },
    { title: "Pendentes", value: "0", icon: Clock, color: "text-orange-600", bg: "bg-orange-100", trend: "Clean" },
  ];

  const isBeauty = merchant?.segment === 'BEAUTY' || merchant?.segment === 'HEALTH';
  const isFood = merchant?.segment === 'RESTAURANT';

  if (loadingMerchant) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 space-y-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="font-black italic text-slate-400 uppercase tracking-widest">Carregando Painel Lojista...</p>
      </div>
    );
  }

  if (!merchant && !loadingMerchant) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-8 text-center">
        <ShieldCheck className="h-16 w-16 text-slate-200 mb-4" />
        <h1 className="text-2xl font-black italic text-slate-900">Instância não encontrada</h1>
        <p className="text-slate-500 mt-2">Certifique-se de que o subdomínio está correto no Painel Master.</p>
        <Button asChild className="mt-6 rounded-xl"><Link href="/admin/tenants">Voltar ao Master Admin</Link></Button>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50 font-body">
      <aside className="w-64 border-r bg-white hidden lg:flex flex-col sticky top-0 h-screen">
        <div className="p-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-primary p-1.5 rounded-lg shadow-sm">
              <Package className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-lg text-slate-800 tracking-tight italic uppercase">MERCADO ÁGIL</span>
          </Link>
        </div>
        <nav className="flex-1 px-4 space-y-2 overflow-y-auto no-scrollbar">
          <Link href={`/merchant/${slug}/dashboard`} className="flex items-center gap-3 px-4 py-2.5 bg-primary/10 text-primary rounded-xl font-bold">
            <LayoutDashboard className="h-5 w-5" /> Dashboard
          </Link>
          
          {isBeauty && (
            <>
              <Link href={`/merchant/${slug}/appointments`} className="flex items-center gap-3 px-4 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl font-medium"><Calendar className="h-5 w-5" /> Agenda Global</Link>
              <Link href={`/merchant/${slug}/services`} className="flex items-center gap-3 px-4 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl font-medium"><Scissors className="h-5 w-5" /> Serviços</Link>
              <Link href={`/merchant/${slug}/staff`} className="flex items-center gap-3 px-4 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl font-medium"><Users className="h-5 w-5" /> Profissionais</Link>
            </>
          )}

          {isFood && (
            <>
              <Link href={`/merchant/${slug}/orders`} className="flex items-center gap-3 px-4 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl font-medium"><ShoppingBag className="h-5 w-5" /> Pedidos/KDS</Link>
              <Link href={`/merchant/${slug}/waiter`} className="flex items-center gap-3 px-4 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl font-medium"><Monitor className="h-5 w-5" /> App Garçom</Link>
            </>
          )}

          {!isBeauty && !isFood && (
            <Link href={`/merchant/${slug}/catalog`} className="flex items-center gap-3 px-4 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl font-medium"><List className="h-5 w-5" /> Catálogo</Link>
          )}

          <Link href={`/merchant/${slug}/pdv`} className="flex items-center gap-3 px-4 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl font-medium"><Monitor className="h-5 w-5 text-primary" /> PDV Cloud</Link>
          <Link href={`/merchant/${slug}/finance`} className="flex items-center gap-3 px-4 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors font-medium"><Wallet className="h-5 w-5" /> Financeiro</Link>
          <Link href={`/merchant/${slug}/settings`} className="flex items-center gap-3 px-4 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors font-medium"><Settings className="h-5 w-5" /> Configurações</Link>
        </nav>
        <div className="p-4 border-t">
          <Button variant="ghost" className="w-full justify-start text-slate-500 gap-2" asChild><Link href="/login"><LogOut className="h-4 w-4" /> Sair</Link></Button>
        </div>
      </aside>

      <main className="flex-1 p-8">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter italic">Painel {merchant?.segment || 'Enterprise'}</h1>
            <p className="text-slate-500 font-medium">Bem-vindo, {merchant?.name || 'Lojista'}.</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="rounded-xl h-12 gap-2" asChild>
              <Link href={`/store/${slug}`} target="_blank"><Globe className="h-4 w-4" /> Ver Vitrine</Link>
            </Button>
            <Button className="bg-primary rounded-2xl h-12 gap-2 shadow-xl shadow-primary/20 font-black italic px-8">
              <BrainCircuit className="h-5 w-5" /> Consultoria IA
            </Button>
          </div>
        </header>

        <div className="grid gap-6 md:grid-cols-4 mb-8">
          {stats.map((stat, i) => (
            <Card key={i} className="border-none shadow-sm rounded-3xl overflow-hidden group hover:scale-[1.02] transition-transform">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className={`${stat.bg} p-3 rounded-2xl`}><stat.icon className={`h-6 w-6 ${stat.color}`} /></div>
                  <div className="text-[10px] font-black uppercase text-slate-400">{stat.trend}</div>
                </div>
                <div className="mt-4">
                  <p className="text-xs font-black text-slate-400 uppercase">{stat.title}</p>
                  <p className="text-2xl font-black text-slate-900 mt-1 italic tracking-tight">{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
           <Card className="border-none shadow-sm rounded-[40px] p-10 bg-slate-900 text-white relative overflow-hidden">
              <div className="relative z-10 space-y-6">
                 <h2 className="text-2xl font-black italic uppercase tracking-tighter">Status da Operação</h2>
                 <div className="flex items-center gap-4 p-6 bg-white/5 rounded-3xl border border-white/10">
                    <div className="h-12 w-12 rounded-full bg-green-500/20 flex items-center justify-center text-green-500 animate-pulse">
                       <Activity className="h-6 w-6" />
                    </div>
                    <div>
                       <p className="font-black italic text-lg uppercase">Online & Aberto</p>
                       <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Sua loja está recebendo {isBeauty ? 'agendamentos' : 'pedidos'}.</p>
                    </div>
                 </div>
                 <Button className="w-full h-14 bg-white text-slate-900 font-black italic rounded-2xl hover:bg-slate-100">
                    Gerenciar Expediente
                 </Button>
              </div>
              <Zap className="absolute -bottom-10 -right-10 h-40 w-40 opacity-5" />
           </Card>

           <Card className="border-none shadow-sm rounded-[40px] p-10 bg-white">
              <h2 className="text-2xl font-black italic uppercase tracking-tighter mb-6">Sugestões Growth</h2>
              <div className="space-y-4">
                 <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10 flex items-center justify-between group cursor-pointer hover:bg-primary/10 transition-colors">
                    <div className="flex items-center gap-3">
                       <Badge className="bg-primary text-white border-none h-8 w-8 flex items-center justify-center rounded-lg p-0"><TrendingUp className="h-4 w-4" /></Badge>
                       <p className="text-sm font-bold text-slate-700">Aumentar ticket médio em 15%</p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-slate-300 group-hover:translate-x-1 transition-transform" />
                 </div>
                 <div className="p-4 bg-accent/5 rounded-2xl border border-accent/10 flex items-center justify-between group cursor-pointer hover:bg-accent/10 transition-colors">
                    <div className="flex items-center gap-3">
                       <Badge className="bg-accent text-white border-none h-8 w-8 flex items-center justify-center rounded-lg p-0"><Users className="h-4 w-4" /></Badge>
                       <p className="text-sm font-bold text-slate-700">Recuperar clientes inativos</p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-slate-300 group-hover:translate-x-1 transition-transform" />
                 </div>
              </div>
           </Card>
        </div>
      </main>
    </div>
  );
}
