"use client";

import * as React from 'react';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Package, DollarSign, Clock, LayoutDashboard, List, Settings, TrendingUp, AlertTriangle, Download, Users, BrainCircuit, Wallet, Map, ArrowUpRight, ArrowDownRight, Activity, Zap, Star } from "lucide-react";
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import Link from 'next/link';
import { MOCK_PRODUCTS } from "@/lib/mock-data";
import { getBusinessAdvice, BusinessAdvisorOutput } from "@/ai/flows/business-advisor-flow";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const salesData = [
  { name: 'Seg', sales: 4200, orders: 45, prev: 3800 },
  { name: 'Ter', sales: 3100, orders: 32, prev: 3400 },
  { name: 'Qua', sales: 2500, orders: 28, prev: 2200 },
  { name: 'Qui', sales: 4800, orders: 51, prev: 4100 },
  { name: 'Sex', sales: 6200, orders: 68, prev: 5800 },
  { name: 'Sab', sales: 8400, orders: 92, prev: 7900 },
  { name: 'Dom', sales: 7100, orders: 78, prev: 6500 },
];

const liveFeed = [
  { id: 1, type: 'order', text: 'Novo pedido #AB32 recebido!', time: '2 min', icon: ShoppingBag, color: 'text-blue-500', bg: 'bg-blue-50' },
  { id: 2, type: 'customer', text: 'João Silva se tornou um Cliente VIP!', time: '15 min', icon: Star, color: 'text-yellow-600', bg: 'bg-yellow-50' },
  { id: 3, type: 'stock', text: 'Estoque de Coca-Cola 2L está crítico!', time: '45 min', icon: AlertTriangle, color: 'text-red-500', bg: 'bg-red-50' },
  { id: 4, type: 'promo', text: 'Cupom VOLTAPRA CASA usado 14 vezes.', time: '2h', icon: Zap, color: 'text-purple-500', bg: 'bg-purple-50' },
];

const productPerformance = [
  { name: 'X-Tudo', value: 45, color: '#3b82f6' },
  { name: 'Pizza Calabresa', value: 30, color: '#f59e0b' },
  { name: 'Coca 2L', value: 15, color: '#ef4444' },
  { name: 'Batata Frita', value: 10, color: '#10b981' },
];

export default function MerchantDashboard({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = React.use(params);
  const [loadingAdvice, setLoadingAdvice] = useState(false);
  const [advice, setAdvice] = useState<BusinessAdvisorOutput | null>(null);
  const [isAdviceOpen, setIsAdviceOpen] = useState(false);
  
  const stats = [
    { title: "Vendas Hoje", value: "R$ 1.240", icon: DollarSign, color: "text-green-600", bg: "bg-green-100", trend: "+12.5%", isUp: true },
    { title: "Ticket Médio", value: "R$ 42,50", icon: TrendingUp, color: "text-blue-600", bg: "bg-blue-100", trend: "+4.2%", isUp: true },
    { title: "Margem Média", value: "38.5%", icon: Activity, color: "text-purple-600", bg: "bg-purple-100", trend: "+1.2%", isUp: true },
    { title: "Tempo Médio", value: "32 min", icon: Clock, color: "text-orange-600", bg: "bg-orange-100", trend: "-5 min", isUp: true },
  ];

  const handleGetAdvice = async () => {
    setLoadingAdvice(true);
    try {
      const result = await getBusinessAdvice({
        merchantName: slug.replace('-', ' '),
        salesData: salesData.map(d => ({ date: d.name, total: d.sales, itemCount: d.orders })),
        topProducts: productPerformance.map(p => ({ name: p.name, quantity: p.value }))
      });
      setAdvice(result);
      setIsAdviceOpen(true);
    } catch (error) {
      console.error(error);
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
          <Link href={`/merchant/${slug}/orders`} className="flex items-center gap-3 px-4 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors font-medium">
            <ShoppingBag className="h-5 w-5" /> Pedidos
          </Link>
          <Link href={`/merchant/${slug}/catalog`} className="flex items-center gap-3 px-4 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors font-medium">
            <List className="h-5 w-5" /> Catálogo
          </Link>
          <Link href={`/merchant/${slug}/customers`} className="flex items-center gap-3 px-4 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors font-medium">
            <Users className="h-5 w-5" /> CRM Clientes
          </Link>
          <Link href={`/merchant/${slug}/finance`} className="flex items-center gap-3 px-4 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors font-medium">
            <Wallet className="h-5 w-5" /> Financeiro
          </Link>
          <Link href={`/merchant/${slug}/settings`} className="flex items-center gap-3 px-4 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors font-medium">
            <Settings className="h-5 w-5" /> Configurações
          </Link>
        </nav>
      </aside>

      <main className="flex-1 p-8 overflow-y-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter italic">{slug.replace('-', ' ')}</h1>
            <p className="text-slate-500 font-medium">Feed operacional e insights estratégicos.</p>
          </div>
          <div className="flex gap-3">
             <Button onClick={handleGetAdvice} className="bg-primary hover:bg-primary/90 rounded-2xl h-12 gap-2 shadow-xl shadow-primary/20 font-black italic px-8">
               <BrainCircuit className="h-5 w-5" /> Consultoria IA
             </Button>
          </div>
        </header>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          {stats.map((stat, i) => (
            <Card key={i} className="border-none shadow-sm rounded-[32px] overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className={`${stat.bg} p-3 rounded-2xl`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                  <div className={`flex items-center gap-1 text-[10px] font-black uppercase tracking-widest ${stat.isUp ? 'text-green-500' : 'text-red-500'}`}>
                    {stat.trend}
                  </div>
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
             <CardHeader className="p-0 mb-8">
                <CardTitle className="text-2xl font-black italic">Performance Semanal</CardTitle>
             </CardHeader>
             <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={salesData}>
                    <defs>
                      <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontWeight: 600, fontSize: 12}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontWeight: 600, fontSize: 12}} tickFormatter={(v) => `R$ ${v/1000}k`} />
                    <Tooltip contentStyle={{borderRadius: '24px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)'}} />
                    <Area type="monotone" dataKey="sales" stroke="hsl(var(--primary))" strokeWidth={4} fillOpacity={1} fill="url(#colorSales)" />
                  </AreaChart>
                </ResponsiveContainer>
             </div>
          </Card>

          <Card className="border-none shadow-sm rounded-[40px] p-8 flex flex-col">
             <CardTitle className="text-2xl font-black italic mb-6 flex items-center gap-2">
                <Activity className="h-6 w-6 text-primary" /> Feed Ao Vivo
             </CardTitle>
             <div className="space-y-4 flex-1 overflow-y-auto no-scrollbar max-h-[400px]">
                {liveFeed.map((item) => (
                  <div key={item.id} className="flex gap-4 p-4 rounded-3xl bg-slate-50 border border-slate-100 hover:scale-[1.02] transition-transform cursor-pointer">
                    <div className={`${item.bg} ${item.color} h-12 w-12 rounded-2xl flex items-center justify-center shrink-0`}>
                       <item.icon className="h-6 w-6" />
                    </div>
                    <div className="flex-1 space-y-0.5">
                       <p className="text-sm font-bold text-slate-800 leading-tight">{item.text}</p>
                       <span className="text-[10px] font-black uppercase text-slate-400">{item.time} atrás</span>
                    </div>
                  </div>
                ))}
             </div>
             <Button variant="ghost" className="w-full mt-6 rounded-2xl font-bold text-slate-500">Ver Histórico Completo</Button>
          </Card>
        </div>
      </main>

      <div className="p-10 space-y-6">
        <Dialog open={isAdviceOpen} onOpenChange={setIsAdviceOpen}>
          <DialogContent className="sm:max-w-2xl rounded-[40px] border-none shadow-2xl p-0 overflow-hidden font-body">
            <div className="bg-primary p-10 text-white relative overflow-hidden">
                <DialogHeader>
                  <DialogTitle className="text-3xl font-black italic tracking-tighter">Insights Estratégicos IA</DialogTitle>
                  <p className="text-white/80 font-bold uppercase text-[10px] tracking-widest mt-2">Análise Preditiva Mercado Ágil</p>
                </DialogHeader>
            </div>
            <div className="p-10 space-y-6">
                {advice && (
                  <div className="space-y-6">
                    <div className="p-6 bg-slate-50 rounded-[32px] border-2 border-dashed border-slate-200">
                      <p className="text-sm font-medium leading-relaxed italic text-slate-600">{advice.summary}</p>
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
                <Button className="w-full h-16 bg-slate-900 rounded-[30px] font-black italic text-lg" onClick={() => setIsAdviceOpen(false)}>Vamos Vender Mais!</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
