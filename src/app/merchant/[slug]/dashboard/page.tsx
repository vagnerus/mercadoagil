
"use client";

import * as React from 'react';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Package, DollarSign, Clock, LayoutDashboard, List, Settings, TrendingUp, BrainCircuit, Activity, Zap, History, MousePointer2, PieChart as PieChartIcon, Users, Truck, Briefcase, ShoppingCart, Monitor, ChevronRight, MessageCircle, BarChart, Smile, AlertCircle, Heart } from "lucide-react";
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart as ReBarChart, Bar, Cell } from 'recharts';
import Link from 'next/link';
import { MOCK_AUDIT_LOGS, MOCK_MERCHANTS } from "@/lib/mock-data";
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

export default function MerchantDashboard({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = React.use(params);
  const [loadingAdvice, setLoadingAdvice] = useState(false);
  const [advice, setAdvice] = useState<BusinessAdvisorOutput | null>(null);
  const [isAdviceOpen, setIsAdviceOpen] = useState(false);
  const { toast } = useToast();
  
  const merchant = MOCK_MERCHANTS.find(m => m.slug === slug) || MOCK_MERCHANTS[0];
  const isRestaurant = merchant.segment === 'RESTAURANT';

  const stats = [
    { title: "Vendas Hoje", value: "R$ 1.240", icon: DollarSign, color: "text-green-600", bg: "bg-green-100", trend: "+12.5%" },
    { title: "Ticket Médio", value: "R$ 42,50", icon: TrendingUp, color: "text-blue-600", bg: "bg-blue-100", trend: "+4.2%" },
    { title: isRestaurant ? "Uptime KDS" : "Logística", icon: Activity, value: "99.9%", color: "text-purple-600", bg: "bg-purple-100", trend: "Normal" },
    { title: isRestaurant ? "Throughput" : "Expedição", value: "32 min", icon: Clock, color: "text-orange-600", bg: "bg-orange-100", trend: "-5 min" },
  ];

  const handleGetAdvice = async () => {
    setLoadingAdvice(true);
    try {
      const result = await getBusinessAdvice({
        merchantName: merchant.name,
        salesData: salesData.map(d => ({ date: d.name, total: d.sales, itemCount: 45 })),
        topProducts: [{ name: 'Item Popular', quantity: 150 }]
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
      <aside className="w-64 border-r bg-white hidden lg:flex flex-col sticky top-0 h-screen">
        <div className="p-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-accent p-1.5 rounded-lg shadow-sm">
              <Package className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-lg text-slate-800 tracking-tight">Painel Lojista</span>
          </Link>
        </div>
        <nav className="flex-1 px-4 space-y-2 overflow-y-auto no-scrollbar pb-10">
          <Link href={`/merchant/${slug}/dashboard`} className="flex items-center gap-3 px-4 py-2.5 bg-accent/10 text-accent rounded-xl font-bold">
            <LayoutDashboard className="h-5 w-5" /> Dashboard
          </Link>
          <Link href={`/merchant/${slug}/pdv`} className="flex items-center gap-3 px-4 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors font-medium">
            <Monitor className="h-5 w-5 text-primary" /> PDV Cloud
          </Link>
          <Link href={`/merchant/${slug}/logistics`} className="flex items-center gap-3 px-4 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors font-medium">
            <Truck className="h-5 w-5" /> Logística & Frota
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
            <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter italic">{merchant.name}</h1>
            <p className="text-slate-500 font-medium">Inteligência {merchant.segment === 'RESTAURANT' ? 'Operacional' : 'Comercial'} Ativada.</p>
          </div>
          <div className="flex gap-3">
             <Button onClick={handleGetAdvice} className="bg-primary hover:bg-primary/90 rounded-2xl h-12 gap-2 shadow-xl shadow-primary/20 font-black italic px-8">
               <BrainCircuit className="h-5 w-5" /> Consultoria IA
             </Button>
          </div>
        </header>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          {stats.map((stat, i) => (
            <Card key={i} className="border-none shadow-sm rounded-3xl overflow-hidden group hover:scale-[1.02] transition-transform">
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
          <Card className="lg:col-span-2 border-none shadow-sm rounded-[40px] p-8 bg-white">
             <CardTitle className="text-2xl font-black italic mb-8">AI Customer Segmentation</CardTitle>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 bg-slate-50 rounded-[35px] border border-dashed flex flex-col gap-4">
                   <div className="flex justify-between items-center">
                      <Badge className="bg-primary text-white border-none font-black italic">BALEIAS</Badge>
                      <TrendingUp className="h-4 w-4 text-primary" />
                   </div>
                   <div>
                      <p className="text-3xl font-black italic">142</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase">Clientes High-Ticket</p>
                   </div>
                   <p className="text-[9px] text-slate-500 font-medium">Aumentou 12% desde a última campanha IA.</p>
                </div>
                <div className="p-6 bg-slate-50 rounded-[35px] border border-dashed flex flex-col gap-4">
                   <div className="flex justify-between items-center">
                      <Badge className="bg-green-500 text-white border-none font-black italic">FIÉIS</Badge>
                      <Heart className="h-4 w-4 text-green-500" />
                   </div>
                   <div>
                      <p className="text-3xl font-black italic">842</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase">Recorrência Mensal</p>
                   </div>
                   <p className="text-[9px] text-slate-500 font-medium">Taxa de retenção em níveis recordes (68%).</p>
                </div>
                <div className="p-6 bg-red-50 rounded-[35px] border border-dashed border-red-100 flex flex-col gap-4">
                   <div className="flex justify-between items-center">
                      <Badge className="bg-red-500 text-white border-none font-black italic">CHURN RISK</Badge>
                      <AlertCircle className="h-4 w-4 text-red-500" />
                   </div>
                   <div>
                      <p className="text-3xl font-black italic">24</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase">Inativos 15+ dias</p>
                   </div>
                   <Button variant="outline" size="sm" className="h-8 rounded-lg text-[9px] font-black uppercase">Reativar agora</Button>
                </div>
             </div>
             
             <div className="mt-8 p-6 bg-slate-900 rounded-[35px] text-white flex items-center justify-between">
                <div className="flex items-center gap-4">
                   <div className="bg-primary/20 p-3 rounded-2xl text-primary">
                      <Smile className="h-6 w-6" />
                   </div>
                   <div>
                      <p className="font-black italic">AI Sentiment Score</p>
                      <p className="text-xs text-slate-400 italic">"O feedback geral é altamente positivo, foco em 'Entrega Rápida'."</p>
                   </div>
                </div>
                <Badge className="bg-green-500 text-white font-black italic px-4 py-1">POSITIVO (94%)</Badge>
             </div>
          </Card>

          <div className="space-y-6">
            <Card className="border-none shadow-sm rounded-[40px] p-8 bg-white h-fit">
               <CardTitle className="text-xl font-black italic mb-6">Omnichannel Hub</CardTitle>
               <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border">
                     <div className="flex items-center gap-3">
                        <div className="bg-green-100 p-2 rounded-xl text-green-600"><MessageCircle className="h-4 w-4" /></div>
                        <span className="font-bold text-xs">WhatsApp</span>
                     </div>
                     <span className="font-black text-xs text-primary">42 Pedidos</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border">
                     <div className="flex items-center gap-3">
                        <div className="bg-blue-100 p-2 rounded-xl text-blue-600"><Globe className="h-4 w-4" /></div>
                        <span className="font-bold text-xs">Web Store</span>
                     </div>
                     <span className="font-black text-xs text-primary">85 Pedidos</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border">
                     <div className="flex items-center gap-3">
                        <div className="bg-purple-100 p-2 rounded-xl text-purple-600"><Monitor className="h-4 w-4" /></div>
                        <span className="font-bold text-xs">PDV Balcão</span>
                     </div>
                     <span className="font-black text-xs text-primary">12 Pedidos</span>
                  </div>
               </div>
            </Card>

            <Card className="border-none shadow-sm rounded-[40px] p-8 h-fit bg-slate-900 text-white relative overflow-hidden">
               <CardTitle className="text-xl font-black italic mb-4">Saúde do Lojista</CardTitle>
               <div className="space-y-4">
                  <div className="flex justify-between items-center text-xs">
                     <span className="font-bold text-slate-400">Conversão Loja</span>
                     <span className="font-black text-primary">12.4%</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                     <span className="font-bold text-slate-400">NPS Clientes</span>
                     <span className="font-black text-green-500">4.9/5</span>
                  </div>
               </div>
               <BrainCircuit className="absolute -bottom-10 -right-10 h-40 w-40 opacity-5" />
            </Card>
          </div>
        </div>

        <Card className="border-none shadow-sm rounded-[40px] p-8 bg-white">
           <CardTitle className="text-2xl font-black italic mb-8">Performance Semanal (Todos os Canais)</CardTitle>
           <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={salesData}>
                  <defs>
                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" tick={{fontWeight: 600}} axisLine={false} tickLine={false} />
                  <YAxis tick={{fontWeight: 600}} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{borderRadius: '20px', border: 'none'}} />
                  <Area type="monotone" dataKey="sales" stroke="hsl(var(--primary))" strokeWidth={4} fillOpacity={1} fill="url(#colorSales)" />
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
