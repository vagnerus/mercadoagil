
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
  Briefcase, Star, Target
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
      
      <Link href={`/merchant/${slug}/hr`} className="flex items-center gap-3 px-4 py-2.5 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl font-medium">
        <Briefcase className="h-5 w-5" /> Enterprise RH
      </Link>

      <Link href={`/merchant/${slug}/feedback`} className="flex items-center gap-3 px-4 py-2.5 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl font-medium">
        <Star className="h-5 w-5" /> Sentiment AI
      </Link>

      <Link href={`/merchant/${slug}/analytics`} className="flex items-center gap-3 px-4 py-2.5 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl font-medium">
        <BarChart3 className="h-5 w-5" /> Analytics Pro
      </Link>

      <Link href={`/merchant/${slug}/creative-studio`} className="flex items-center gap-3 px-4 py-2.5 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl font-medium">
        <Video className="h-5 w-5 text-primary" /> Creative Studio
      </Link>

      <Link href={`/merchant/${slug}/marketing`} className="flex items-center gap-3 px-4 py-2.5 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl font-medium">
        <Megaphone className="h-5 w-5" /> Growth IA
      </Link>

      <Link href={`/merchant/${slug}/loyalty`} className="flex items-center gap-3 px-4 py-2.5 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl font-medium">
        <Crown className="h-5 w-5" /> Fidelidade
      </Link>

      {segment === 'BEAUTY' && (
        <>
          <Link href={`/merchant/${slug}/appointments`} className="flex items-center gap-3 px-4 py-2.5 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl font-medium"><Calendar className="h-5 w-5" /> Agenda Digital</Link>
          <Link href={`/merchant/${slug}/staff`} className="flex items-center gap-3 px-4 py-2.5 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl font-medium"><Users className="h-5 w-5" /> Equipe</Link>
        </>
      )}

      <Link href={`/merchant/${slug}/pdv`} className="flex items-center gap-3 px-4 py-2.5 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl font-medium"><Monitor className="h-5 w-5" /> PDV Cloud</Link>
      <Link href={`/merchant/${slug}/finance`} className="flex items-center gap-3 px-4 py-2.5 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors font-medium"><Wallet className="h-5 w-5" /> Financeiro</Link>
      <Link href={`/merchant/${slug}/inventory`} className="flex items-center gap-3 px-4 py-2.5 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors font-medium"><Package className="h-5 w-5" /> Estoque</Link>
      <Link href={`/merchant/${slug}/suppliers`} className="flex items-center gap-3 px-4 py-2.5 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors font-medium"><Truck className="h-5 w-5" /> Fornecedores</Link>
      <Link href={`/merchant/${slug}/education/ava`} className="flex items-center gap-3 px-4 py-2.5 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors font-medium"><Monitor className="h-5 w-5" /> Ágil Academy</Link>
      <Link href={`/merchant/${slug}/settings`} className="flex items-center gap-3 px-4 py-2.5 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors font-medium"><Settings className="h-5 w-5" /> Configurações</Link>
    </div>
  );

  if (loadingMerchant) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 space-y-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="font-black italic text-slate-400 uppercase tracking-widest">Sincronizando Painel {segment}...</p>
      </div>
    );
  }

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
        <nav className="flex-1 overflow-hidden">
          <NavLinks />
        </nav>
        <div className="p-4 border-t dark:border-slate-800">
          <Button variant="ghost" className="w-full justify-start text-slate-500 gap-2" asChild><Link href="/login"><LogOut className="h-4 w-4" /> Sair</Link></Button>
        </div>
      </aside>

      <main className="flex-1 p-4 lg:p-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div className="flex gap-2 bg-white dark:bg-slate-900 p-2 rounded-full w-fit shadow-sm border dark:border-slate-800">
            <Button 
              onClick={() => toggleMode('easy')}
              variant={uiMode === 'easy' ? 'default' : 'ghost'}
              className={cn(
                "rounded-full px-6 font-black italic text-xs uppercase transition-all",
                uiMode === 'easy' ? "bg-green-600 text-white shadow-lg" : "text-slate-400 hover:text-green-600"
              )}
            >
              <MousePointer2 className="h-3.5 w-3.5 mr-2" /> Modo Fácil
            </Button>
            <Button 
              onClick={() => toggleMode('advanced')}
              variant={uiMode === 'advanced' ? 'default' : 'ghost'}
              className={cn(
                "rounded-full px-6 font-black italic text-xs uppercase transition-all",
                uiMode === 'advanced' ? "bg-slate-900 dark:bg-white dark:text-slate-900 text-white shadow-lg" : "text-slate-400 hover:text-slate-900 dark:hover:text-white"
              )}
            >
              <Zap className="h-3.5 w-3.5 mr-2" /> Modo Avançado
            </Button>
          </div>
          <ModeToggle />
        </div>

        <header className="flex justify-between items-center mb-10">
          <div className="flex items-center gap-4">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="lg:hidden rounded-xl border-slate-200 dark:border-slate-800">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72 p-0 border-none bg-white dark:bg-slate-900">
                <SheetHeader className="p-6 border-b dark:border-slate-800 text-left">
                  <SheetTitle className="flex items-center gap-2 font-black text-xl italic tracking-tighter text-primary uppercase">
                    MERCADO ÁGIL
                  </SheetTitle>
                </SheetHeader>
                <div className="p-4 h-full flex flex-col">
                  <NavLinks mobile />
                  <div className="mt-auto pt-4 border-t dark:border-slate-800">
                    <Button variant="ghost" className="w-full justify-start text-slate-500 gap-2" asChild><Link href="/login"><LogOut className="h-4 w-4" /> Sair</Link></Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>

            <div>
              <h1 className="text-2xl lg:text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter italic leading-none">
                {uiMode === 'easy' ? 'Meu Painel' : `Console ${segment}`}
              </h1>
              <p className="text-slate-500 font-medium text-xs lg:text-base mt-1">
                {uiMode === 'easy' ? `Olá, ${merchant?.name}! O que vamos fazer hoje?` : `Bem-vindo, ${merchant?.name}`}
              </p>
            </div>
          </div>
          <div className="hidden md:flex gap-3">
            <Button variant="outline" className="rounded-xl h-12 gap-2 dark:border-slate-800" asChild>
              <Link href={`/store/${slug}`} target="_blank"><Globe className="h-4 w-4" /> Ver Vitrine</Link>
            </Button>
            <AiBusinessHub merchantName={merchant?.name || slug} />
          </div>
        </header>

        {uiMode === 'advanced' ? (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-10">
              {stats.map((stat, i) => (
                <Card key={i} className="border-none shadow-sm rounded-3xl overflow-hidden group hover:scale-[1.02] transition-transform dark:bg-slate-900">
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
                  <div className="relative z-10 flex flex-col md:flex-row justify-between gap-10">
                     <div className="space-y-6 flex-1">
                        <h2 className="text-2xl font-black italic uppercase tracking-tighter">Enterprise HR Suite</h2>
                        <p className="text-slate-400 text-sm italic font-medium leading-relaxed">Gerencie escalas de trabalho, produtividade e folha de pagamento da sua equipe em um único lugar.</p>
                        <div className="flex gap-3">
                           <Button className="h-14 px-8 bg-primary hover:bg-primary/90 text-white font-black italic rounded-2xl gap-2" asChild>
                              <Link href={`/merchant/${slug}/hr`}>ABRIR RH ENTERPRISE <Briefcase className="h-5 w-5" /></Link>
                           </Button>
                           <Button variant="outline" className="h-14 px-8 border-white/10 text-white font-black italic rounded-2xl gap-2 hover:bg-white/5" asChild>
                              <Link href={`/merchant/${slug}/feedback`}>SENTIMENT AI <Target className="h-5 w-5" /></Link>
                           </Button>
                        </div>
                     </div>
                     <div className="flex items-center gap-4 p-6 bg-white/5 rounded-3xl border border-white/10 shrink-0">
                        <div className="h-12 w-12 rounded-full bg-green-500/20 flex items-center justify-center text-green-500 animate-pulse">
                           <Activity className="h-6 w-6" />
                        </div>
                        <div>
                           <p className="font-black italic text-lg uppercase leading-tight">SaaS Health</p>
                           <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Latência: 12ms</p>
                        </div>
                     </div>
                  </div>
                  <Zap className="absolute -bottom-10 -right-10 h-40 w-40 opacity-5" />
               </Card>

               <Card className="border-none shadow-sm rounded-[40px] p-6 lg:p-10 bg-white dark:bg-slate-900">
                  <h2 className="text-xl font-black italic uppercase tracking-tighter mb-6 dark:text-white flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary" /> Ações Rápidas IA
                  </h2>
                  <div className="space-y-4">
                     <Link href={`/merchant/${slug}/hr`} className="p-4 bg-primary/5 rounded-2xl border border-primary/10 flex items-center justify-between group cursor-pointer hover:bg-primary/10 transition-colors">
                        <div className="flex items-center gap-3">
                           <Badge className="bg-primary text-white border-none h-8 w-8 flex items-center justify-center rounded-lg p-0"><Briefcase className="h-4 w-4" /></Badge>
                           <p className="text-xs font-bold text-slate-700 dark:text-slate-300">Gerenciar Equipe</p>
                        </div>
                        <ChevronRight className="h-4 w-4 text-slate-300 group-hover:translate-x-1 transition-transform" />
                     </Link>
                     <Link href={`/merchant/${slug}/feedback`} className="p-4 bg-accent/5 rounded-2xl border border-accent/10 flex items-center justify-between group cursor-pointer hover:bg-accent/10 transition-colors">
                        <div className="flex items-center gap-3">
                           <Badge className="bg-accent text-white border-none h-8 w-8 flex items-center justify-center rounded-lg p-0"><Star className="h-4 w-4" /></Badge>
                           <p className="text-xs font-bold text-slate-700 dark:text-slate-300">Sentiment AI</p>
                        </div>
                        <ChevronRight className="h-4 w-4 text-slate-300 group-hover:translate-x-1 transition-transform" />
                     </Link>
                     <Link href={`/merchant/${slug}/analytics`} className="p-4 bg-slate-100/50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center justify-between group cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                        <div className="flex items-center gap-3">
                           <Badge className="bg-slate-900 text-white border-none h-8 w-8 flex items-center justify-center rounded-lg p-0"><BarChart3 className="h-4 w-4" /></Badge>
                           <p className="text-xs font-bold text-slate-700 dark:text-slate-300">Analytics Pro</p>
                        </div>
                        <ChevronRight className="h-4 w-4 text-slate-300 group-hover:translate-x-1 transition-transform" />
                     </Link>
                  </div>
               </Card>
            </div>
          </div>
        ) : (
          <div className="animate-in zoom-in-95 duration-500">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Link href={`/merchant/${slug}/${segment === 'BEAUTY' || segment === 'HEALTH' ? 'appointments' : 'orders'}`} className="col-span-1">
                <Card className="h-64 border-none shadow-lg rounded-[40px] bg-white dark:bg-slate-900 flex flex-col items-center justify-center p-8 hover:scale-105 transition-all group">
                  <div className="bg-blue-100 dark:bg-blue-900 p-6 rounded-[30px] mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <Calendar className="h-12 w-12 text-blue-600 dark:text-blue-400 group-hover:text-white" />
                  </div>
                  <h3 className="text-xl font-black italic uppercase tracking-tight text-slate-900 dark:text-white">
                    {segment === 'BEAUTY' || segment === 'HEALTH' ? 'Minha Agenda' : 'Meus Pedidos'}
                  </h3>
                  <p className="text-slate-400 font-bold text-xs uppercase mt-2">Clique para ver seus horários</p>
                </Card>
              </Link>

              <Link href={`/merchant/${slug}/finance`} className="col-span-1">
                <Card className="h-64 border-none shadow-lg rounded-[40px] bg-white dark:bg-slate-900 flex flex-col items-center justify-center p-8 hover:scale-105 transition-all group">
                  <div className="bg-green-100 dark:bg-blue-900 p-6 rounded-[30px] mb-4 group-hover:bg-green-600 group-hover:text-white transition-colors">
                    <DollarSign className="h-12 w-12 text-green-600 dark:text-green-400 group-hover:text-white" />
                  </div>
                  <h3 className="text-xl font-black italic uppercase tracking-tight text-slate-900 dark:text-white">Ver meu Dinheiro</h3>
                  <p className="text-slate-400 font-bold text-xs uppercase mt-2">Clique para ver o que vendeu</p>
                </Card>
              </Link>

              <Link href={`/merchant/${slug}/hr`} className="col-span-1">
                <Card className="h-64 border-none shadow-lg rounded-[40px] bg-white dark:bg-slate-900 flex flex-col items-center justify-center p-8 hover:scale-105 transition-all group">
                  <div className="bg-purple-100 dark:bg-purple-900 p-6 rounded-[30px] mb-4 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                    <Briefcase className="h-12 w-12 text-purple-600 dark:text-purple-400 group-hover:text-white" />
                  </div>
                  <h3 className="text-xl font-black italic uppercase tracking-tight text-slate-900 dark:text-white">Gerenciar Equipe</h3>
                  <p className="text-slate-400 font-bold text-xs uppercase mt-2">Escalas e RH Simplificado</p>
                </Card>
              </Link>

              <Card className="md:col-span-2 lg:col-span-3 border-none shadow-sm rounded-[40px] p-10 bg-slate-900 dark:bg-black text-white relative overflow-hidden">
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
                  <div className="text-center md:text-left space-y-4">
                    <h2 className="text-3xl font-black italic uppercase">Resumo de Hoje</h2>
                    <div className="flex flex-wrap justify-center md:justify-start gap-8">
                      <div>
                        <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">Você Ganhou</p>
                        <p className="text-4xl font-black italic text-green-400 mt-1">R$ 2.450</p>
                      </div>
                      <div className="h-12 w-px bg-white/10 hidden md:block"></div>
                      <div>
                        <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">Trabalhos Realizados</p>
                        <p className="text-4xl font-black italic text-blue-400 mt-1">12</p>
                      </div>
                    </div>
                  </div>
                  <Button onClick={() => setShowAi(true)} className="h-20 px-12 bg-primary hover:bg-primary/90 text-white rounded-[35px] font-black italic text-xl shadow-2xl gap-3">
                    <HelpCircle className="h-8 w-8" /> PRECISO DE AJUDA
                  </Button>
                </div>
                <Zap className="absolute -bottom-10 -right-10 h-40 w-40 opacity-5" />
              </Card>
            </div>
          </div>
        )}
      </main>

      {showAi && (
        <AiAssistantChat 
          merchantName={merchant?.name} 
          segment={segment} 
          uiMode={uiMode}
        />
      )}
    </div>
  );
}
