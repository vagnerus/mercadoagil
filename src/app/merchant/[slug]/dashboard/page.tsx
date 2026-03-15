
"use client";

import * as React from 'react';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Package, DollarSign, Clock, LayoutDashboard, List, Settings, TrendingUp, BrainCircuit, Activity, Zap, History, MousePointer2, PieChart as PieChartIcon, Users } from "lucide-react";
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar, Cell, PieChart, Pie } from 'recharts';
import Link from 'next/link';
import { MOCK_AUDIT_LOGS } from "@/lib/mock-data";
import { getBusinessAdvice, BusinessAdvisorOutput } from "@/ai/flows/business-advisor-flow";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

const salesData = [
  { name: 'Seg', sales: 4200 },
  { name: 'Ter', sales: 3100 },
  { name: 'Qua', sales: 2500 },
  { name: 'Qui', sales: 4800 },
  { name: 'Sex', sales: 6200 },
  { name: 'Sab', sales: 8400 },
  { name: 'Dom', sales: 7100 },
];

const throughputData = [
  { station: 'Grelha', time: 12, color: '#f59e0b' },
  { station: 'Prep', time: 8, color: '#3b82f6' },
  { station: 'Montagem', time: 5, color: '#10b981' },
  { station: 'Entrega', time: 15, color: '#8b5cf6' },
];

export default function MerchantDashboard({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = React.use(params);
  const [loadingAdvice, setLoadingAdvice] = useState(false);
  const [advice, setAdvice] = useState<BusinessAdvisorOutput | null>(null);
  const [isAdviceOpen, setIsAdviceOpen] = useState(false);
  const { toast } = useToast();
  
  const stats = [
    { title: "Vendas Hoje", value: "R$ 1.240", icon: DollarSign, color: "text-green-600", bg: "bg-green-100", trend: "+12.5%" },
    { title: "Ticket Médio", value: "R$ 42,50", icon: TrendingUp, color: "text-blue-600", bg: "bg-blue-100", trend: "+4.2%" },
    { title: "Uptime KDS", value: "99.9%", icon: Activity, color: "text-purple-600", bg: "bg-purple-100", trend: "Normal" },
    { title: "Throughput", value: "32 min", icon: Clock, color: "text-orange-600", bg: "bg-orange-100", trend: "-5 min" },
  ];

  const handleGetAdvice = async () => {
    setLoadingAdvice(true);
    try {
      const result = await getBusinessAdvice({
        merchantName: slug.replace('-', ' '),
        salesData: salesData.map(d => ({ date: d.name, total: d.sales, itemCount: 45 })),
        topProducts: [{ name: 'Burguer', quantity: 150 }]
      });
      setAdvice(result);
      setIsAdviceOpen(true);
    } catch (error) {
      toast({ title: "Erro", description: "IA falhou.", variant: "destructive" });
    } finally {
      setLoadingAdvice(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-body">
      <aside className="w-64 border-r bg-white hidden lg:flex flex-col">
        <div className="p-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-accent p-1.5 rounded-lg shadow-sm">
              <Package className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-lg text-slate-800 tracking-tight">Painel Lojista</span>
          </Link>
        </div>
        <nav className="flex-1 px-4 space-y-2">
          <Link href={`/merchant/${slug}/dashboard`} className="flex items-center gap-3 px-4 py-2.5 bg-accent/10 text-accent rounded-xl font-bold">
            <LayoutDashboard className="h-5 w-5" /> Dashboard
          </Link>
          <Link href={`/merchant/${slug}/staff`} className="flex items-center gap-3 px-4 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors font-medium">
            <Users className="h-5 w-5" /> Equipe
          </Link>
          <Link href={`/merchant/${slug}/orders`} className="flex items-center gap-3 px-4 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors font-medium">
            <ShoppingBag className="h-5 w-5" /> Pedidos
          </Link>
          <Link href={`/merchant/${slug}/catalog`} className="flex items-center gap-3 px-4 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors font-medium">
            <List className="h-5 w-5" /> Catálogo
          </Link>
          <Link href={`/merchant/${slug}/settings`} className="flex items-center gap-3 px-4 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors font-medium">
            <Settings className="h-5 w-5" /> Configurações
          </Link>
        </nav>
      </aside>

      <main className="flex-1 p-8 overflow-y-auto">
        <header className="flex justify-between items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter italic">{slug.replace('-', ' ')}</h1>
            <p className="text-slate-500 font-medium">Inteligência Operacional Multi-Unit.</p>
          </div>
          <div className="flex gap-3">
             <Button onClick={handleGetAdvice} className="bg-primary hover:bg-primary/90 rounded-2xl h-12 gap-2 shadow-xl shadow-primary/20 font-black italic px-8">
               <BrainCircuit className="h-5 w-5" /> Consultoria IA
             </Button>
          </div>
        </header>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          {stats.map((stat, i) => (
            <Card key={i} className="border-none shadow-sm rounded-[32px] overflow-hidden group hover:scale-[1.02] transition-transform">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className={`${stat.bg} p-3 rounded-2xl`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                  <div className="text-[10px] font-black uppercase tracking-widest text-green-500">{stat.trend}</div>
                </div>
                <div className="mt-4">
                  <p className="text-xs font-black text-slate-400 uppercase tracking-widest">{stat.title}</p>
                  <p className="text-2xl font-black text-slate-900 mt-1 italic tracking-tight">{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-3 mb-8">
          <Card className="lg:col-span-2 border-none shadow-sm rounded-[40px] p-8">
             <CardTitle className="text-2xl font-black italic mb-8">Fluxo de Cozinha (Estações)</CardTitle>
             <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={throughputData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                    <XAxis type="number" hide />
                    <YAxis dataKey="station" type="category" axisLine={false} tickLine={false} tick={{fontWeight: 700}} width={80} />
                    <Tooltip contentStyle={{borderRadius: '20px'}} />
                    <Bar dataKey="time" radius={[0, 10, 10, 0]}>
                      {throughputData.map((e, i) => <Cell key={i} fill={e.color} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
             </div>
             <p className="text-[10px] font-black text-center text-slate-400 uppercase tracking-widest mt-4">Tempo médio em minutos por estação</p>
          </Card>

          <div className="space-y-6">
            <Card className="border-none shadow-sm rounded-[40px] p-8 bg-slate-900 text-white relative overflow-hidden h-[200px]">
               <div className="relative z-10">
                 <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Throughput IA</p>
                 <p className="text-2xl font-black italic">Operação Ágil</p>
                 <div className="mt-6 flex items-center gap-3">
                    <div className="h-3 w-3 rounded-full bg-green-500 animate-pulse"></div>
                    <span className="font-bold text-sm">Gargalo: Nenhum</span>
                 </div>
               </div>
               <MousePointer2 className="absolute -bottom-10 -right-10 h-40 w-40 opacity-5 text-white" />
            </Card>

            <Card className="border-none shadow-sm rounded-[40px] p-8 h-[calc(100%-216px)]">
               <CardTitle className="text-xl font-black italic mb-6">Logs Recentes</CardTitle>
               <div className="space-y-4">
                  {MOCK_AUDIT_LOGS.map((log) => (
                    <div key={log.id} className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                      <p className="text-[10px] font-black text-primary uppercase">{log.user}</p>
                      <p className="text-xs font-bold text-slate-700 mt-1">{log.action}</p>
                    </div>
                  ))}
               </div>
            </Card>
          </div>
        </div>

        <Card className="border-none shadow-sm rounded-[40px] p-8">
           <CardTitle className="text-2xl font-black italic mb-8">Performance Semanal</CardTitle>
           <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" tick={{fontWeight: 600}} axisLine={false} tickLine={false} />
                  <YAxis tick={{fontWeight: 600}} axisLine={false} tickLine={false} />
                  <Tooltip />
                  <Area type="monotone" dataKey="sales" stroke="hsl(var(--primary))" strokeWidth={4} fillOpacity={0.1} fill="hsl(var(--primary))" />
                </AreaChart>
              </ResponsiveContainer>
           </div>
        </Card>
      </main>

      <Dialog open={isAdviceOpen} onOpenChange={setIsAdviceOpen}>
          <DialogContent className="sm:max-w-2xl rounded-[40px] p-0 overflow-hidden font-body border-none">
            <div className="bg-primary p-10 text-white">
                <DialogHeader>
                  <DialogTitle className="text-3xl font-black italic">Consultoria Estratégica IA</DialogTitle>
                </DialogHeader>
            </div>
            <div className="p-10 space-y-6">
                {advice && (
                  <div className="space-y-6">
                    <div className="p-6 bg-slate-50 rounded-[32px] border-2 border-dashed border-slate-200 text-sm font-medium italic text-slate-600">
                      {advice.summary}
                    </div>
                    <div className="grid gap-4">
                      {advice.advice.map((item, i) => (
                        <div key={i} className="flex gap-4 p-5 bg-white border border-slate-100 rounded-[28px] items-center">
                          <div className="bg-primary/10 text-primary h-8 w-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-black">{i+1}</div>
                          <p className="text-sm font-bold text-slate-700">{item}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <Button className="w-full h-16 bg-slate-900 rounded-[30px] font-black italic text-lg" onClick={() => setIsAdviceOpen(false)}>Aplicar Estratégia</Button>
            </div>
          </DialogContent>
        </Dialog>
    </div>
  );
}
