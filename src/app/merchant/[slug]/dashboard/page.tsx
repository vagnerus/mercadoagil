
"use client";

import * as React from 'react';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  ShoppingBag, Package, DollarSign, Clock, LayoutDashboard, List, Settings, 
  TrendingUp, BrainCircuit, Activity, Zap, Users, Monitor, 
  Calendar, Scissors, Wallet, Globe, Plus, LogOut, ShieldCheck
} from "lucide-react";
import Link from 'next/link';
import { useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { useToast } from "@/hooks/use-toast";

export default function MerchantDashboard({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = React.use(params);
  const db = useFirestore();
  
  // No mundo real, buscaríamos o merchantId associado ao slug via query ou auth.
  // Para o protótipo, vamos assumir que o sistema busca o merchant ativo.
  const [merchant, setMerchant] = useState<any>(null);

  const stats = [
    { title: "Vendas Hoje", value: "R$ 0,00", icon: DollarSign, color: "text-green-600", bg: "bg-green-100", trend: "0%" },
    { title: "Ticket Médio", value: "R$ 0,00", icon: TrendingUp, color: "text-blue-600", bg: "bg-blue-100", trend: "0%" },
    { title: "Atividade", value: "Normal", icon: Activity, color: "text-purple-600", bg: "bg-purple-100", trend: "Live" },
    { title: "Pendentes", value: "0", icon: Clock, color: "text-orange-600", bg: "bg-orange-100", trend: "Clean" },
  ];

  const isBeauty = merchant?.segment === 'BEAUTY' || merchant?.segment === 'HEALTH';
  const isFood = merchant?.segment === 'RESTAURANT';

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

          <Link href={`/merchant/${slug}/catalog`} className="flex items-center gap-3 px-4 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl font-medium"><List className="h-5 w-5" /> Catálogo</Link>
          <Link href={`/merchant/${slug}/pdv`} className="flex items-center gap-3 px-4 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl font-medium"><Monitor className="h-5 w-5 text-primary" /> PDV Cloud</Link>
          <Link href={`/merchant/${slug}/finance`} className="flex items-center gap-3 px-4 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl font-medium"><Wallet className="h-5 w-5" /> Financeiro</Link>
          <Link href={`/merchant/${slug}/settings`} className="flex items-center gap-3 px-4 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl font-medium"><Settings className="h-5 w-5" /> Configurações</Link>
        </nav>
        <div className="p-4 border-t">
          <Button variant="ghost" className="w-full justify-start text-slate-500 gap-2" asChild><Link href="/login"><LogOut className="h-4 w-4" /> Sair</Link></Button>
        </div>
      </aside>

      <main className="flex-1 p-8">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter italic">Painel Enterprise</h1>
            <p className="text-slate-500 font-medium">Gestão inteligente para o seu negócio.</p>
          </div>
          <Button className="bg-primary rounded-2xl h-12 gap-2 shadow-xl shadow-primary/20 font-black italic px-8">
            <BrainCircuit className="h-5 w-5" /> Consultoria IA
          </Button>
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

        <div className="p-20 text-center bg-white rounded-[40px] border-2 border-dashed border-slate-200">
           <Activity className="h-12 w-12 text-slate-200 mx-auto mb-4" />
           <h2 className="text-xl font-black italic text-slate-400 uppercase">Aguardando Lançamentos</h2>
           <p className="text-sm font-medium text-slate-400 max-w-xs mx-auto mt-2">Seus dados de faturamento e agendamentos aparecerão aqui assim que a operação começar.</p>
        </div>
      </main>
    </div>
  );
}
