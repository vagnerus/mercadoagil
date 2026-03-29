
"use client";

import * as React from 'react';
import { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  ShoppingBag, Package, DollarSign, Clock, LayoutDashboard, List, Settings, 
  TrendingUp, BrainCircuit, Activity, Zap, Users, Monitor, 
  Calendar, Scissors, Wallet, Globe, LogOut, ShieldCheck,
  ChevronRight, Loader2, Stethoscope, Wrench, Dog, GraduationCap,
  ClipboardList, HeartPulse, Truck, BarChart3, Video, HeartHandshake,
  Menu, MousePointer2, CheckCircle2, HelpCircle, Sparkles, Crown, Megaphone,
  Briefcase, Star, Target, ShieldAlert, Lock
} from "lucide-react";
import Link from 'next/link';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where, limit } from 'firebase/firestore';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { AiAssistantChat } from "@/components/merchant/ai-assistant-chat";
import { AiBusinessHub } from "@/components/merchant/ai-business-hub";
import { ModeToggle } from "@/components/mode-toggle";

export default function MerchantDashboard({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = React.use(params);
  const db = useFirestore();
  const [uiMode, setUiMode] = useState<'advanced' | 'easy'>('advanced');
  const [showAi, setShowAi] = useState(false);
  
  useEffect(() => {
    const savedMode = localStorage.getItem('agil_ui_mode');
    if (savedMode === 'easy' || savedMode === 'advanced') {
      setUiMode(savedMode);
    }
    setTimeout(() => setShowAi(true), 1500);
  }, []);

  const toggleMode = (mode: 'advanced' | 'easy') => {
    setUiMode(mode);
    localStorage.setItem('agil_ui_mode', mode);
  };

  const merchantQuery = useMemoFirebase(() => query(
    collection(db, 'merchants'), 
    where('slug', '==', slug),
    limit(1)
  ), [db, slug]);

  const { data: merchantData, isLoading: loadingMerchant } = useCollection(merchantQuery);
  const merchant = merchantData?.[0];

  const segment = merchant?.segment || 'RETAIL';

  if (loadingMerchant) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 space-y-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="font-black italic text-slate-400 uppercase tracking-widest">Sincronizando Painel {segment}...</p>
      </div>
    );
  }

  // Tela de Bloqueio / Aguardando Aprovação
  if (merchant?.status === 'pending_approval') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 p-6 font-body">
         <div className="max-w-md w-full text-center space-y-8 animate-in zoom-in-95 duration-500">
            <div className="h-24 w-24 bg-primary/10 rounded-[40px] flex items-center justify-center mx-auto border-2 border-primary/20">
               <ShieldAlert className="h-12 w-12 text-primary animate-pulse" />
            </div>
            <div className="space-y-4">
               <h1 className="text-3xl font-black text-white italic uppercase tracking-tighter">Instância em Auditoria</h1>
               <p className="text-slate-400 text-sm font-medium leading-relaxed italic">
                  Sua loja <b>{merchant.name}</b> foi provisionada, mas o acesso ainda não foi liberado pelo Master Admin. <br/><br/>
                  Este processo leva cerca de 1 hora para verificação do CNPJ e conformidade técnica.
               </p>
            </div>
            <div className="p-6 bg-white/5 rounded-[30px] border border-white/10 text-[10px] font-black uppercase text-primary tracking-widest">
               ID da Instância: {merchant.id}
            </div>
            <Button variant="ghost" className="text-slate-500 hover:text-white" asChild><Link href="/"><LogOut className="mr-2 h-4 w-4" /> Sair do Console</Link></Button>
         </div>
      </div>
    );
  }

  if (merchant?.status === 'blocked' || merchant?.status === 'rejected') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-950 p-6 font-body">
         <div className="max-w-md w-full text-center space-y-8">
            <Lock className="h-20 w-20 text-white mx-auto" />
            <h1 className="text-3xl font-black text-white italic uppercase tracking-tighter">Acesso Suspenso</h1>
            <p className="text-white/70 italic">Sua instância foi bloqueada por violação de termos ou pendência financeira.</p>
            <Button className="w-full h-16 bg-white text-red-900 rounded-3xl font-black italic">CONTATAR MASTER ADMIN</Button>
         </div>
      </div>
    );
  }

  const getSegmentStats = () => {
    switch (segment) {
      case 'BEAUTY':
        return [
          { title: "Agendamentos Hoje", value: "12", icon: Calendar, color: "text-blue-600", bg: "bg-blue-100", trend: "+2" },
          { title: "Cadeiras Ocupadas", value: "4", icon: Scissors, color: "text-orange-600", bg: "bg-orange-100", trend: "Normal" },
          { title: "Clientes Ativos", value: "842", icon: Users, color: "text-purple-600", bg: "bg-purple-100", trend: "+5%" },
          { title: "Faturamento Diário", value: "R$ 2.450", icon: DollarSign, color: "text-green-600", bg: "bg-green-100", trend: "+12%" },
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
      <Link href={`/merchant/${slug}/hr`} className="flex items-center gap-3 px-4 py-2.5 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl font-medium"><Briefcase className="h-5 w-5" /> Gestão de Equipe</Link>
      <Link href={`/merchant/${slug}/appointments`} className="flex items-center gap-3 px-4 py-2.5 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl font-medium"><Calendar className="h-5 w-5" /> Agenda Digital</Link>
      <Link href={`/merchant/${slug}/pdv`} className="flex items-center gap-3 px-4 py-2.5 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl font-medium"><Monitor className="h-5 w-5" /> PDV Cloud</Link>
      <Link href={`/merchant/${slug}/finance`} className="flex items-center gap-3 px-4 py-2.5 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors font-medium"><Wallet className="h-5 w-5" /> Financeiro</Link>
      <Link href={`/merchant/${slug}/settings`} className="flex items-center gap-3 px-4 py-2.5 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors font-medium"><Settings className="h-5 w-5" /> Configurações</Link>
    </div>
  );

  const stats = getSegmentStats();

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 font-body relative">
      <aside className="w-64 border-r dark:border-slate-800 bg-white dark:bg-slate-900 hidden lg:flex flex-col sticky top-0 h-screen">
        <div className="p-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-primary p-1.5 rounded-lg shadow-sm">
              <ShoppingBag className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-lg text-slate-800 dark:text-white tracking-tight italic uppercase">MERCADO ÁGIL</span>
          </Link>
        </div>
        <nav className="flex-1 overflow-hidden"><NavLinks /></nav>
        <div className="p-4 border-t dark:border-slate-800">
          <Button variant="ghost" className="w-full justify-start text-slate-500 gap-2" asChild><Link href="/login"><LogOut className="h-4 w-4" /> Sair</Link></Button>
        </div>
      </aside>

      <main className="flex-1 p-4 lg:p-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div className="flex gap-2 bg-white dark:bg-slate-900 p-2 rounded-full w-fit shadow-sm border dark:border-slate-800">
            <Button onClick={() => toggleMode('easy')} variant={uiMode === 'easy' ? 'default' : 'ghost'} className={cn("rounded-full px-6 font-black italic text-xs uppercase", uiMode === 'easy' ? "bg-green-600 text-white shadow-lg" : "text-slate-400 hover:text-green-600")}><MousePointer2 className="h-3.5 w-3.5 mr-2" /> Modo Fácil</Button>
            <Button onClick={() => toggleMode('advanced')} variant={uiMode === 'advanced' ? 'default' : 'ghost'} className={cn("rounded-full px-6 font-black italic text-xs uppercase", uiMode === 'advanced' ? "bg-slate-900 dark:bg-white dark:text-slate-900 text-white" : "text-slate-400")}><Zap className="h-3.5 w-3.5 mr-2" /> Modo Avançado</Button>
          </div>
          <ModeToggle />
        </div>

        <header className="flex justify-between items-center mb-10">
          <div className="flex items-center gap-4">
            <Sheet>
              <SheetTrigger asChild><Button variant="outline" size="icon" className="lg:hidden rounded-xl border-slate-200 dark:border-slate-800"><Menu className="h-5 w-5" /></Button></SheetTrigger>
              <SheetContent side="left" className="w-72 p-0 border-none bg-white dark:bg-slate-900">
                <SheetHeader className="p-6 border-b dark:border-slate-800 text-left"><SheetTitle className="font-black text-xl italic tracking-tighter text-primary uppercase">MERCADO ÁGIL</SheetTitle></SheetHeader>
                <div className="p-4 h-full flex flex-col"><NavLinks mobile /></div>
              </SheetContent>
            </Sheet>
            <div>
              <h1 className="text-2xl lg:text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter italic leading-none">{merchant?.name}</h1>
              <p className="text-slate-500 font-medium text-xs lg:text-base mt-1">Status da Instância: <span className="text-green-500 uppercase font-black">Ativa e Auditada</span></p>
            </div>
          </div>
          <AiBusinessHub merchantName={merchant?.name || slug} />
        </header>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-10">
          {stats.map((stat, i) => (
            <Card key={i} className="border-none shadow-sm rounded-3xl overflow-hidden dark:bg-slate-900">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className={`${stat.bg} dark:bg-slate-800 p-3 rounded-2xl`}><stat.icon className={`h-6 w-6 ${stat.color}`} /></div>
                  <div className="text-[10px] font-black uppercase text-slate-400">{stat.trend}</div>
                </div>
                <div className="mt-4">
                  <p className="text-xs font-black text-slate-400 uppercase">{stat.title}</p>
                  <p className="text-2xl font-black text-slate-900 dark:text-white mt-1 italic tracking-tight">{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
           <Card className="lg:col-span-2 border-none shadow-sm rounded-[40px] p-6 lg:p-10 bg-slate-900 dark:bg-black text-white relative overflow-hidden">
              <div className="relative z-10 space-y-6">
                 <h2 className="text-2xl font-black italic uppercase tracking-tighter">Configurações Enterprise</h2>
                 <p className="text-slate-400 text-sm italic font-medium leading-relaxed max-w-lg">Sua unidade está operando no Regime <b>{merchant.legal?.regimeTributario}</b> com CNPJ auditado. Utilize o módulo financeiro para acompanhar o faturamento líquido descontando taxas.</p>
                 <div className="flex gap-3">
                    <Button className="h-14 px-8 bg-primary hover:bg-primary/90 text-white font-black italic rounded-2xl" asChild><Link href={`/merchant/${slug}/settings`}>EDITAR REGRAS DE NEGÓCIO</Link></Button>
                 </div>
              </div>
              <Zap className="absolute -bottom-10 -right-10 h-40 w-40 opacity-5" />
           </Card>
        </div>
      </main>

      {showAi && <AiAssistantChat merchantName={merchant?.name} segment={segment} uiMode={uiMode} />}
    </div>
  );
}
