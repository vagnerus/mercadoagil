
"use client";

import * as React from 'react';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  ShoppingBag, Package, DollarSign, Clock, LayoutDashboard, List, Settings, 
  TrendingUp, Activity, Zap, Users, Monitor, 
  Calendar, Scissors, Wallet, Globe, LogOut, ShieldCheck,
  ChevronRight, Loader2, Stethoscope, Wrench, Dog, GraduationCap,
  ClipboardList, HeartPulse, Truck, BarChart3, Video,
  Menu, MousePointer2, HelpCircle, Sparkles, Crown, Megaphone,
  Briefcase, Star, Target, ShieldAlert, Lock, ArrowUpRight,
  AlertCircle, Info, Smartphone, Database, Landmark,
  Bell, CheckCircle, Dumbbell, PartyPopper, Gavel, Car, Droplets,
  Utensils, Ticket
} from "lucide-react";
import Link from 'next/link';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where, limit, orderBy } from 'firebase/firestore';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { AiAssistantChat } from "@/components/merchant/ai-assistant-chat";
import { AiBusinessHub } from "@/components/merchant/ai-business-hub";
import { ModeToggle } from "@/components/mode-toggle";
import { Progress } from "@/components/ui/progress";

export default function MerchantDashboard({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = React.use(params);
  const db = useFirestore();
  const [uiMode, setUiMode] = useState<'advanced' | 'easy'>('advanced');
  const [showAi, setShowAi] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
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

  const appointmentsQuery = useMemoFirebase(() => {
    if (!merchant?.id) return null;
    return query(collection(db, 'merchants', merchant.id, 'appointments'), orderBy('createdAt', 'desc'), limit(5));
  }, [db, merchant?.id]);
  const { data: recentAppointments } = useCollection(appointmentsQuery);

  const segment = merchant?.segment || 'RETAIL';

  if (loadingMerchant) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 space-y-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="font-black italic text-slate-400 uppercase tracking-widest text-[10px]">Provisionando Console {segment}...</p>
      </div>
    );
  }

  if (!merchant && !loadingMerchant && mounted) {
    return (
      <div className="min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950 p-6 flex">
        <div className="text-center space-y-4">
          <HelpCircle className="h-16 w-16 text-slate-300 mx-auto" />
          <h1 className="text-2xl font-black italic uppercase tracking-tighter text-slate-900 dark:text-white">Instância não encontrada</h1>
          <p className="text-slate-500 font-medium">Verifique o link ou contate o administrador Master.</p>
          <Button variant="outline" asChild className="rounded-xl"><Link href="/login">Voltar ao Login</Link></Button>
        </div>
      </div>
    );
  }

  const getSegmentStats = () => {
    switch (segment) {
      case 'BEAUTY':
        return [
          { title: "Agendamentos Hoje", value: "14", icon: Calendar, color: "text-blue-600", bg: "bg-blue-100", trend: "+2" },
          { title: "Cadeiras Ocupadas", value: "4/6", icon: Scissors, color: "text-orange-600", bg: "bg-orange-100", trend: "Normal" },
          { title: "Retention IA", value: "84%", icon: Users, color: "text-purple-600", bg: "bg-purple-100", trend: "+5%" },
          { title: "Faturamento Líquido", value: "R$ 2.450", icon: DollarSign, color: "text-green-600", bg: "bg-green-100", trend: "+12%" },
        ];
      case 'HEALTH':
        return [
          { title: "Consultas Agendadas", value: "08", icon: Stethoscope, color: "text-blue-600", bg: "bg-blue-100", trend: "+1" },
          { title: "PEP Visualizados", value: "42", icon: ClipboardList, color: "text-emerald-600", bg: "bg-emerald-100", trend: "Sync" },
          { title: "Telemedicina Live", value: "02", icon: Video, color: "text-purple-600", bg: "bg-purple-100", trend: "Active" },
          { title: "Faturamento Convênio", value: "R$ 8.420", icon: Wallet, color: "text-green-600", bg: "bg-green-100", trend: "+8%" },
        ];
      case 'RESTAURANT':
        return [
          { title: "Pedidos no KDS", value: "12", icon: Utensils, color: "text-orange-600", bg: "bg-orange-100", trend: "Flow" },
          { title: "Mesas Ocupadas", value: "8/15", icon: Landmark, color: "text-blue-600", bg: "bg-blue-100", trend: "53%" },
          { title: "Ticket Médio", value: "R$ 85,90", icon: DollarSign, color: "text-green-600", bg: "bg-green-100", trend: "+12%" },
          { title: "Tempo Médio Prep.", value: "18 min", icon: Clock, color: "text-red-600", bg: "bg-red-100", trend: "-2 min" },
        ];
      case 'FITNESS':
        return [
          { title: "Alunos On-line", value: "45", icon: Dumbbell, color: "text-blue-600", bg: "bg-blue-100", trend: "Pico" },
          { title: "Check-ins Hoje", value: "128", icon: CheckCircle, color: "text-green-600", bg: "bg-green-100", trend: "+15%" },
          { title: "MRR Assinaturas", value: "R$ 14.850", icon: Wallet, color: "text-purple-600", bg: "bg-purple-100", trend: "Estável" },
          { title: "Churn Rate", value: "1.2%", icon: Activity, color: "text-red-600", bg: "bg-red-100", trend: "-0.5%" },
        ];
      default:
        return [
          { title: "Vendas Brutas", value: "R$ 4.850", icon: DollarSign, color: "text-green-600", bg: "bg-green-100", trend: "+12%" },
          { title: "Pedidos Pendentes", value: "08", icon: Package, color: "text-blue-600", bg: "bg-blue-100", trend: "Flowing" },
          { title: "Saúde Estoque", value: "Normal", icon: Database, color: "text-purple-600", bg: "bg-purple-100", trend: "Sync" },
          { title: "Sessões Ativas", value: "142", icon: Globe, color: "text-orange-600", bg: "bg-orange-100", trend: "Live" },
        ];
    }
  };

  const NavLinks = ({ mobile = false }: { mobile?: boolean }) => {
    const commonLinks = [
      { href: `/merchant/${slug}/dashboard`, label: "Dashboard", icon: LayoutDashboard },
      { href: `/merchant/${slug}/analytics`, label: "Analytics Pro", icon: BarChart3 },
      { href: `/merchant/${slug}/inventory`, label: "Inventário IA", icon: Database },
      { href: `/merchant/${slug}/customers`, label: "CRM & WhatsApp", icon: Users },
      { href: `/merchant/${slug}/finance`, label: "Financeiro Pro", icon: Wallet },
      { href: `/merchant/${slug}/settings`, label: "Configurações", icon: Settings },
    ];

    const segmentSpecificLinks: Record<string, any[]> = {
      BEAUTY: [
        { href: `/merchant/${slug}/appointments`, label: "Agenda Digital", icon: Calendar },
        { href: `/merchant/${slug}/staff`, label: "Equipe Elite", icon: Scissors },
        { href: `/merchant/${slug}/services`, label: "Serviços & Preços", icon: List },
      ],
      RESTAURANT: [
        { href: `/merchant/${slug}/orders`, label: "KDS & Pedidos", icon: Utensils },
        { href: `/merchant/${slug}/waiter`, label: "App Garçom", icon: Smartphone },
        { href: `/merchant/${slug}/pdv`, label: "PDV Cloud", icon: Monitor },
      ],
      HEALTH: [
        { href: `/merchant/${slug}/health/pep`, label: "Prontuários (PEP)", icon: ClipboardList },
        { href: `/merchant/${slug}/health/telemedicine`, label: "Telemedicina", icon: Video },
        { href: `/merchant/${slug}/appointments`, label: "Agenda Médica", icon: Calendar },
      ],
      EDUCATION: [
        { href: `/merchant/${slug}/education/academic`, label: "Acadêmico", icon: GraduationCap },
        { href: `/merchant/${slug}/education/ava`, label: "Academy (AVA)", icon: Monitor },
      ],
      FITNESS: [
        { href: `/merchant/${slug}/fitness/plans`, label: "Planos & Assinaturas", icon: Ticket },
      ]
    };

    const links = [...commonLinks, ...(segmentSpecificLinks[segment] || [])];

    return (
      <div className={mobile ? "space-y-2" : "flex-1 px-4 space-y-2 overflow-y-auto no-scrollbar"}>
        {links.map((link, i) => (
          <Link 
            key={i}
            href={link.href} 
            className={cn(
              "flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            )}
          >
            <link.icon className="h-5 w-5" /> {link.label}
          </Link>
        ))}
      </div>
    );
  };

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
          <Button variant="ghost" className="w-full justify-start text-slate-500 gap-2 hover:text-red-500" asChild><Link href="/login"><LogOut className="h-4 w-4" /> Sair do Console</Link></Button>
        </div>
      </aside>

      <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div className="flex gap-2 bg-white dark:bg-slate-900 p-2 rounded-full w-fit shadow-sm border dark:border-slate-800">
            <Button onClick={() => toggleMode('easy')} variant={uiMode === 'easy' ? 'default' : 'ghost'} className={cn("rounded-full px-6 font-black italic text-xs uppercase", uiMode === 'easy' ? "bg-green-600 text-white shadow-lg" : "text-slate-400 hover:text-green-600")}><MousePointer2 className="h-3.5 w-3.5 mr-2" /> Modo Fácil</Button>
            <Button onClick={() => toggleMode('advanced')} variant={uiMode === 'advanced' ? 'default' : 'ghost'} className={cn("rounded-full px-6 font-black italic text-xs uppercase", uiMode === 'advanced' ? "bg-slate-900 dark:bg-white dark:text-slate-900 text-white" : "text-slate-400")}><Zap className="h-3.5 w-3.5 mr-2" /> Modo Avançado</Button>
          </div>
          <div className="flex items-center gap-3">
             <ModeToggle />
             <Badge className="bg-slate-900 dark:bg-white dark:text-slate-900 text-white font-black italic text-[10px] py-1.5 px-4 rounded-full">v3.2.0-ULTRA</Badge>
          </div>
        </div>

        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
          <div className="flex items-center gap-4">
            <Sheet>
              <SheetTrigger asChild><Button variant="outline" size="icon" className="lg:hidden rounded-xl border-slate-200 dark:border-slate-800"><Menu className="h-5 w-5" /></Button></SheetTrigger>
              <SheetContent side="left" className="w-72 p-0 border-none bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                <SheetHeader className="p-6 border-b dark:border-slate-800 text-left"><SheetTitle className="font-black text-xl italic tracking-tighter text-primary uppercase">MERCADO ÁGIL</SheetTitle></SheetHeader>
                <div className="p-4 h-full flex flex-col"><NavLinks mobile /></div>
              </SheetContent>
            </Sheet>
            <div>
              <h1 className="text-2xl lg:text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter italic leading-none">{merchant?.name}</h1>
              <p className="text-slate-500 font-medium text-xs lg:text-base mt-1">
                Vertical: <span className="text-primary font-black uppercase">{segment}</span> • Status: <span className="text-green-500 uppercase font-black">{merchant?.status === 'active' ? 'Ativo & Auditado' : 'Aguardando'}</span>
              </p>
            </div>
          </div>
          <AiBusinessHub merchantName={merchant?.name || slug} />
        </header>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-10">
          {getSegmentStats().map((stat, i) => (
            <Card key={i} className="border-none shadow-sm rounded-3xl overflow-hidden dark:bg-slate-900 group hover:ring-2 ring-primary transition-all">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className={cn(`${stat.bg} dark:bg-slate-800 p-3 rounded-2xl`)}><stat.icon className={cn(`h-6 w-6 ${stat.color}`)} /></div>
                  <div className="text-[10px] font-black uppercase text-slate-400 bg-slate-50 dark:bg-slate-800 px-2 py-0.5 rounded-full">{stat.trend}</div>
                </div>
                <div className="mt-4">
                  <p className="text-xs font-black text-slate-400 uppercase tracking-widest">{stat.title}</p>
                  <p className="text-2xl font-black text-slate-900 dark:text-white mt-1 italic tracking-tight">{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-8 lg:grid-cols-12">
           <div className="lg:col-span-8 space-y-8">
              <Card className="border-none shadow-sm rounded-[40px] p-6 lg:p-10 bg-slate-900 dark:bg-black text-white relative overflow-hidden">
                 <div className="relative z-10 space-y-6">
                    <div className="flex items-center gap-3">
                       <ShieldCheck className="h-6 w-6 text-primary" />
                       <h2 className="text-2xl font-black italic uppercase tracking-tighter">Gestão Operacional {segment}</h2>
                    </div>
                    <p className="text-slate-400 text-sm italic font-medium leading-relaxed max-w-lg">
                      Sua instância v3.2 está operando no regime <b>{merchant?.legal?.regimeTributario || 'Simples Nacional'}</b>. Todos os relatórios financeiros já descontam automaticamente as taxas de <b>{merchant?.financial?.creditFee || 2.99}%</b> das maquininhas.
                    </p>
                    <div className="flex gap-3">
                       <Button className="h-14 px-8 bg-primary hover:bg-primary/90 text-white font-black italic rounded-2xl" asChild><Link href={`/merchant/${slug}/settings`}>EDITAR CONFIGURAÇÕES</Link></Button>
                       <Button variant="outline" className="h-14 px-8 border-white/10 text-white font-black italic rounded-2xl hover:bg-white/5" asChild><Link href={`/merchant/${slug}/finance`}>FLUXO FINANCEIRO</Link></Button>
                    </div>
                 </div>
                 <Zap className="absolute -bottom-10 -right-10 h-40 w-40 opacity-5" />
              </Card>

              <Card className="border-none shadow-sm rounded-[40px] overflow-hidden bg-white dark:bg-slate-900">
                 <CardHeader className="p-8 border-b dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
                    <CardTitle className="text-xl font-black italic dark:text-white uppercase flex items-center gap-2">
                       <Clock className="h-5 w-5 text-primary" /> Atividade em Tempo Real
                    </CardTitle>
                    <Badge variant="outline" className="animate-pulse border-primary text-primary font-black italic text-[8px]">LIVE SYNC</Badge>
                 </CardHeader>
                 <CardContent className="p-0">
                    <div className="divide-y dark:divide-slate-800">
                       {recentAppointments?.map((ap: any) => (
                         <div key={ap.id} className="p-6 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                            <div className="flex items-center gap-4">
                               <div className="text-center w-12">
                                  <p className="font-black italic text-lg">{ap.time}</p>
                                  <p className="text-[8px] font-bold text-slate-400 uppercase">HORA</p>
                               </div>
                               <div className="h-10 w-1 bg-primary/20 rounded-full"></div>
                               <div>
                                  <p className="font-black text-slate-900 dark:text-white uppercase italic text-sm">{ap.customer}</p>
                                  <p className="text-[10px] font-bold text-slate-400 uppercase">{ap.service || ap.subject}</p>
                               </div>
                            </div>
                            <Badge className="bg-green-100 text-green-700 border-none font-black italic text-[8px] uppercase">{ap.status}</Badge>
                         </div>
                       ))}
                       {(!recentAppointments || recentAppointments.length === 0) && (
                         <div className="p-20 text-center text-slate-400 italic font-bold uppercase text-[10px] tracking-widest flex flex-col items-center gap-4">
                            <HelpCircle className="h-10 w-10 opacity-20" />
                            Nenhuma atividade registrada no momento.
                         </div>
                       )}
                    </div>
                 </CardContent>
              </Card>
           </div>

           <div className="lg:col-span-4 space-y-6">
              <Card className="border-none shadow-sm rounded-[40px] p-8 bg-white dark:bg-slate-900 space-y-6">
                 <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-2"><Sparkles className="h-3 w-3 text-primary" /> Operação Master</h3>
                 <div className="space-y-4">
                    <div className="space-y-2">
                       <div className="flex justify-between text-[10px] font-black uppercase">
                          <span className="text-slate-500">Capacidade Operacional</span>
                          <span className="text-primary">82%</span>
                       </div>
                       <Progress value={82} className="h-1.5" />
                    </div>
                    <div className="space-y-2">
                       <div className="flex justify-between text-[10px] font-black uppercase">
                          <span className="text-slate-500">Qualidade de Serviço (NPS)</span>
                          <span className="text-green-500">95%</span>
                       </div>
                       <Progress value={95} className="h-1.5" />
                    </div>
                 </div>
                 <div className="pt-4 border-t dark:border-slate-800 space-y-4">
                    <Link href={`/merchant/${slug}/analytics`} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl group hover:bg-primary transition-all">
                       <div className="flex items-center gap-3">
                          <BarChart3 className="h-5 w-5 text-primary group-hover:text-white" />
                          <span className="text-[10px] font-black uppercase text-slate-900 dark:text-white group-hover:text-white">Deep Intelligence</span>
                       </div>
                       <ArrowUpRight className="h-4 w-4 text-slate-400 group-hover:text-white" />
                    </Link>
                 </div>
              </Card>

              <Card className="border-none shadow-sm rounded-[40px] p-8 bg-primary text-white relative overflow-hidden">
                 <div className="relative z-10 space-y-4">
                    <Crown className="h-8 w-8 opacity-50" />
                    <h4 className="text-xl font-black italic uppercase leading-tight">Clube de <br/>Fidelidade {segment}</h4>
                    <p className="text-xs font-bold opacity-70">Sua base de membros VIP cresceu 12% este mês.</p>
                    <Button variant="outline" className="w-full h-12 rounded-xl bg-white/10 border-white/20 text-white font-black italic text-xs hover:bg-white/20" asChild><Link href={`/merchant/${slug}/loyalty`}>GERENCIAR RECOMPENSAS</Link></Button>
                 </div>
                 <Sparkles className="absolute -bottom-10 -right-10 h-32 w-32 opacity-10" />
              </Card>
           </div>
        </div>
      </main>

      {showAi && <AiAssistantChat merchantName={merchant?.name} segment={segment} uiMode={uiMode} />}
    </div>
  );
}
