
"use client";

import * as React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  ShoppingBag, Package, DollarSign, Clock, LayoutDashboard, List, Settings, 
  TrendingUp, BrainCircuit, Activity, Zap, Users, Monitor, 
  Calendar, Scissors, Wallet, Globe, LogOut, ShieldCheck,
  ChevronRight, Loader2, Stethoscope, Wrench, Dog, GraduationCap,
  ClipboardList, HeartPulse, Truck, BarChart3, Video, HeartHandshake,
  Menu
} from "lucide-react";
import Link from 'next/link';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where, limit } from 'firebase/firestore';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";

export default function MerchantDashboard({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = React.use(params);
  const db = useFirestore();
  
  const merchantQuery = useMemoFirebase(() => query(
    collection(db, 'merchants'), 
    where('slug', '==', slug),
    limit(1)
  ), [db, slug]);

  const { data: merchantData, isLoading: loadingMerchant } = useCollection(merchantQuery);
  const merchant = merchantData?.[0];

  const segment = merchant?.segment || 'RETAIL';

  const getSegmentStats = () => {
    switch (segment) {
      case 'BEAUTY':
        return [
          { title: "Agendamentos Hoje", value: "12", icon: Calendar, color: "text-blue-600", bg: "bg-blue-100", trend: "+2" },
          { title: "Cadeiras Ocupadas", value: "4", icon: Scissors, color: "text-orange-600", bg: "bg-orange-100", trend: "Normal" },
          { title: "Clientes Ativos", value: "842", icon: Users, color: "text-purple-600", bg: "bg-purple-100", trend: "+5%" },
          { title: "Faturamento Diário", value: "R$ 2.450", icon: DollarSign, color: "text-green-600", bg: "bg-green-100", trend: "+12%" },
        ];
      case 'HEALTH':
        return [
          { title: "Consultas Hoje", value: "8", icon: Calendar, color: "text-blue-600", bg: "bg-blue-100", trend: "+1" },
          { title: "Aguardando", value: "2", icon: Clock, color: "text-orange-600", bg: "bg-orange-100", trend: "Baixo" },
          { title: "Prontuários Ativos", value: "1.2k", icon: ClipboardList, color: "text-purple-600", bg: "bg-purple-100", trend: "+2%" },
          { title: "Repasse Médico", value: "R$ 8.450", icon: DollarSign, color: "text-green-600", bg: "bg-green-100", trend: "On track" },
        ];
      case 'RESTAURANT':
        return [
          { title: "Pedidos Hoje", value: "45", icon: ShoppingBag, color: "text-blue-600", bg: "bg-blue-100", trend: "+8" },
          { title: "Tempo Médio KDS", value: "14 min", icon: Clock, color: "text-orange-600", bg: "bg-orange-100", trend: "Rápido" },
          { title: "Mesas Ativas", value: "8", icon: LayoutDashboard, color: "text-purple-600", bg: "bg-purple-100", trend: "60%" },
          { title: "Ticket Médio", value: "R$ 82,50", icon: TrendingUp, color: "text-green-600", bg: "bg-green-100", trend: "+2%" },
        ];
      default:
        return [
          { title: "Vendas Hoje", value: "R$ 4.850", icon: DollarSign, color: "text-green-600", bg: "bg-green-100", trend: "+12%" },
          { title: "Pedidos Pendentes", value: "8", icon: Package, color: "text-blue-600", bg: "bg-blue-100", trend: "Ação req." },
          { title: "Estoque Baixo", value: "12 itens", icon: Activity, color: "text-red-600", bg: "bg-red-100", trend: "Alert" },
          { title: "Visitantes", value: "1.240", icon: Globe, color: "text-purple-600", bg: "bg-purple-100", trend: "+24%" },
        ];
    }
  };

  const NavLinks = ({ mobile = false }: { mobile?: boolean }) => (
    <div className={mobile ? "space-y-2" : "flex-1 px-4 space-y-2 overflow-y-auto no-scrollbar"}>
      <Link href={`/merchant/${slug}/dashboard`} className="flex items-center gap-3 px-4 py-2.5 bg-primary/10 text-primary rounded-xl font-bold">
        <LayoutDashboard className="h-5 w-5" /> Dashboard
      </Link>
      
      {segment === 'BEAUTY' && (
        <>
          <Link href={`/merchant/${slug}/appointments`} className="flex items-center gap-3 px-4 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl font-medium"><Calendar className="h-5 w-5" /> Agenda Digital</Link>
          <Link href={`/merchant/${slug}/staff`} className="flex items-center gap-3 px-4 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl font-medium"><Users className="h-5 w-5" /> Equipe de Estilo</Link>
          <Link href={`/merchant/${slug}/services`} className="flex items-center gap-3 px-4 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl font-medium"><Scissors className="h-5 w-5" /> Procedimentos</Link>
        </>
      )}

      {segment === 'HEALTH' && (
        <>
          <Link href={`/merchant/${slug}/appointments`} className="flex items-center gap-3 px-4 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl font-medium"><Calendar className="h-5 w-5" /> Consultas</Link>
          <Link href={`/merchant/${slug}/health/pep`} className="flex items-center gap-3 px-4 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl font-medium"><ClipboardList className="h-5 w-5" /> Prontuários (PEP)</Link>
          <Link href={`/merchant/${slug}/health/telemedicine`} className="flex items-center gap-3 px-4 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl font-medium"><Video className="h-5 w-5" /> Telemedicina</Link>
          <Link href={`/merchant/${slug}/staff`} className="flex items-center gap-3 px-4 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl font-medium"><Stethoscope className="h-5 w-5" /> Equipe Médica</Link>
        </>
      )}

      {segment === 'RESTAURANT' && (
        <>
          <Link href={`/merchant/${slug}/catalog`} className="flex items-center gap-3 px-4 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl font-medium"><List className="h-5 w-5" /> Cardápio KDS</Link>
          <Link href={`/merchant/${slug}/orders`} className="flex items-center gap-3 px-4 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl font-medium"><ShoppingBag className="h-5 w-5" /> Pedidos/Mesas</Link>
          <Link href={`/merchant/${slug}/waiter`} className="flex items-center gap-3 px-4 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl font-medium"><Monitor className="h-5 w-5" /> App Garçom</Link>
        </>
      )}

      <Link href={`/merchant/${slug}/finance`} className="flex items-center gap-3 px-4 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors font-medium"><Wallet className="h-5 w-5" /> Financeiro</Link>
      <Link href={`/merchant/${slug}/analytics`} className="flex items-center gap-3 px-4 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors font-medium"><BarChart3 className="h-5 w-5" /> BI & IA Insights</Link>
      <Link href={`/merchant/${slug}/settings`} className="flex items-center gap-3 px-4 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors font-medium"><Settings className="h-5 w-5" /> Configurações</Link>
    </div>
  );

  if (loadingMerchant) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 space-y-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="font-black italic text-slate-400 uppercase tracking-widest">Sincronizando Painel {segment}...</p>
      </div>
    );
  }

  const stats = getSegmentStats();

  return (
    <div className="flex min-h-screen bg-slate-50 font-body">
      {/* Sidebar Desktop */}
      <aside className="w-64 border-r bg-white hidden lg:flex flex-col sticky top-0 h-screen">
        <div className="p-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-primary p-1.5 rounded-lg shadow-sm">
              <ShoppingBag className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-lg text-slate-800 tracking-tight italic uppercase">MERCADO ÁGIL</span>
          </Link>
        </div>
        <nav className="flex-1 overflow-hidden">
          <NavLinks />
        </nav>
        <div className="p-4 border-t">
          <Button variant="ghost" className="w-full justify-start text-slate-500 gap-2" asChild><Link href="/login"><LogOut className="h-4 w-4" /> Sair</Link></Button>
        </div>
      </aside>

      <main className="flex-1 p-4 lg:p-8">
        <header className="flex justify-between items-center mb-10">
          <div className="flex items-center gap-4">
            {/* Menu Mobile Trigger */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="lg:hidden rounded-xl border-slate-200">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72 p-0 border-none bg-white">
                <SheetHeader className="p-6 border-b text-left">
                  <SheetTitle className="flex items-center gap-2 font-black text-xl italic tracking-tighter text-primary uppercase">
                    MERCADO ÁGIL
                  </SheetTitle>
                </SheetHeader>
                <div className="p-4 h-full flex flex-col">
                  <NavLinks mobile />
                  <div className="mt-auto pt-4 border-t">
                    <Button variant="ghost" className="w-full justify-start text-slate-500 gap-2" asChild><Link href="/login"><LogOut className="h-4 w-4" /> Sair</Link></Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>

            <div>
              <h1 className="text-2xl lg:text-3xl font-black text-slate-900 uppercase tracking-tighter italic leading-none">Console {segment}</h1>
              <p className="text-slate-500 font-medium text-xs lg:text-base mt-1">Bem-vindo, {merchant?.name}</p>
            </div>
          </div>
          <div className="hidden md:flex gap-3">
            <Button variant="outline" className="rounded-xl h-12 gap-2" asChild>
              <Link href={`/store/${slug}`} target="_blank"><Globe className="h-4 w-4" /> Ver Vitrine</Link>
            </Button>
            <Button className="bg-primary rounded-2xl h-12 gap-2 shadow-xl shadow-primary/20 font-black italic px-8 text-white">
              <BrainCircuit className="h-5 w-5" /> IA Negotiator
            </Button>
          </div>
        </header>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-10">
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
           <Card className="border-none shadow-sm rounded-[40px] p-6 lg:p-10 bg-slate-900 text-white relative overflow-hidden">
              <div className="relative z-10 space-y-6">
                 <h2 className="text-2xl font-black italic uppercase tracking-tighter">Saúde do Ecossistema</h2>
                 <div className="flex items-center gap-4 p-6 bg-white/5 rounded-3xl border border-white/10">
                    <div className="h-12 w-12 rounded-full bg-green-500/20 flex items-center justify-center text-green-500 animate-pulse shrink-0">
                       <Activity className="h-6 w-6" />
                    </div>
                    <div>
                       <p className="font-black italic text-lg uppercase leading-tight">Instância Saudável</p>
                       <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Todas as APIs e integrações estão operacionais.</p>
                    </div>
                 </div>
                 <Button className="w-full h-14 bg-white text-slate-900 font-black italic rounded-2xl hover:bg-slate-100">
                    Abrir Monitoramento Pro
                 </Button>
              </div>
              <Zap className="absolute -bottom-10 -right-10 h-40 w-40 opacity-5" />
           </Card>

           <Card className="border-none shadow-sm rounded-[40px] p-6 lg:p-10 bg-white">
              <h2 className="text-2xl font-black italic uppercase tracking-tighter mb-6">Ações Rápidas IA</h2>
              <div className="space-y-4">
                 <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10 flex items-center justify-between group cursor-pointer hover:bg-primary/10 transition-colors">
                    <div className="flex items-center gap-3">
                       <Badge className="bg-primary text-white border-none h-8 w-8 flex items-center justify-center rounded-lg p-0"><TrendingUp className="h-4 w-4 text-white" /></Badge>
                       <p className="text-sm font-bold text-slate-700">Otimizar Preços por Curva ABC</p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-slate-300 group-hover:translate-x-1 transition-transform" />
                 </div>
                 <div className="p-4 bg-accent/5 rounded-2xl border border-accent/10 flex items-center justify-between group cursor-pointer hover:bg-accent/10 transition-colors">
                    <div className="flex items-center gap-3">
                       <Badge className="bg-accent text-white border-none h-8 w-8 flex items-center justify-center rounded-lg p-0"><Users className="h-4 w-4 text-white" /></Badge>
                       <p className="text-sm font-bold text-slate-700">Recuperar Carrinhos Abandonados</p>
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
