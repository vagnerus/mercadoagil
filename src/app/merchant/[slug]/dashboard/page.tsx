
"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Package, DollarSign, Clock, LayoutDashboard, List, Settings, UtensilsCrossed, TrendingUp, AlertTriangle, Download, Users, Ticket, Sparkles, Loader2, BrainCircuit, Wallet } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import Link from 'next/link';
import { MOCK_PRODUCTS } from "@/lib/mock-data";
import { getBusinessAdvice, BusinessAdvisorOutput } from "@/ai/flows/business-advisor-flow";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const salesData = [
  { name: 'Seg', sales: 4200, orders: 45 },
  { name: 'Ter', sales: 3100, orders: 32 },
  { name: 'Qua', sales: 2500, orders: 28 },
  { name: 'Qui', sales: 4800, orders: 51 },
  { name: 'Sex', sales: 6200, orders: 68 },
  { name: 'Sab', sales: 8400, orders: 92 },
  { name: 'Dom', sales: 7100, orders: 78 },
];

const productPerformance = [
  { name: 'X-Tudo', value: 45, color: '#3b82f6' },
  { name: 'Pizza Calabresa', value: 30, color: '#f59e0b' },
  { name: 'Coca 2L', value: 15, color: '#ef4444' },
  { name: 'Batata Frita', value: 10, color: '#10b981' },
];

export default function MerchantDashboard({ params }: { params: { slug: string } }) {
  const [loadingAdvice, setLoadingAdvice] = useState(false);
  const [advice, setAdvice] = useState<BusinessAdvisorOutput | null>(null);
  const [isAdviceOpen, setIsAdviceOpen] = useState(false);
  
  const lowStockProducts = MOCK_PRODUCTS.filter(p => p.stock && p.stock < 10);

  const stats = [
    { title: "Vendas de Hoje", value: "R$ 1.240", icon: DollarSign, color: "text-green-600", bg: "bg-green-100" },
    { title: "Ticket Médio", value: "R$ 42,50", icon: TrendingUp, color: "text-blue-600", bg: "bg-blue-100" },
    { title: "Novos Clientes", value: "12", icon: Users, color: "text-purple-600", bg: "bg-purple-100" },
    { title: "Tempo Médio", value: "32 min", icon: Clock, color: "text-orange-600", bg: "bg-orange-100" },
  ];

  const handleGetAdvice = async () => {
    setLoadingAdvice(true);
    try {
      const result = await getBusinessAdvice({
        merchantName: params.slug.replace('-', ' '),
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
          <Link href={`/merchant/${params.slug}/dashboard`} className="flex items-center gap-3 px-4 py-2.5 bg-accent/10 text-accent rounded-xl font-bold">
            <LayoutDashboard className="h-5 w-5" /> Dashboard
          </Link>
          <Link href={`/merchant/${params.slug}/orders`} className="flex items-center gap-3 px-4 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors font-medium">
            <ShoppingBag className="h-5 w-5" /> Pedidos
          </Link>
          <Link href={`/merchant/${params.slug}/catalog`} className="flex items-center gap-3 px-4 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors font-medium">
            <List className="h-5 w-5" /> Catálogo
          </Link>
          <Link href={`/merchant/${params.slug}/customers`} className="flex items-center gap-3 px-4 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors font-medium">
            <Users className="h-5 w-5" /> CRM Clientes
          </Link>
          <Link href={`/merchant/${params.slug}/finance`} className="flex items-center gap-3 px-4 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors font-medium">
            <Wallet className="h-5 w-5" /> Financeiro
          </Link>
          <Link href={`/merchant/${params.slug}/settings`} className="flex items-center gap-3 px-4 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors font-medium">
            <Settings className="h-5 w-5" /> Configurações
          </Link>
        </nav>
      </aside>

      <main className="flex-1 p-8 overflow-y-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter italic">{params.slug.replace('-', ' ')}</h1>
            <p className="text-slate-500 font-medium">Insights e controle total do seu negócio.</p>
          </div>
          <div className="flex gap-3">
             <Button 
              onClick={handleGetAdvice} 
              disabled={loadingAdvice}
              className="bg-primary hover:bg-primary/90 rounded-2xl h-12 gap-2 shadow-xl shadow-primary/20 font-black italic"
             >
               {loadingAdvice ? <Loader2 className="h-4 w-4 animate-spin" /> : <BrainCircuit className="h-5 w-5" />}
               Assistente IA
             </Button>
             <Badge className="bg-green-500 text-white h-12 px-6 rounded-2xl flex items-center text-sm font-black italic shadow-sm">LOJA ABERTA</Badge>
          </div>
        </header>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          {stats.map((stat, i) => (
            <Card key={i} className="border-none shadow-sm rounded-[32px] hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className={`${stat.bg} p-3 rounded-2xl`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
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

        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2 border-none shadow-sm rounded-[40px] p-8">
             <CardHeader className="p-0 mb-8 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-2xl font-black italic">Performance Semanal</CardTitle>
                  <CardDescription className="font-bold text-slate-400">Volume de vendas (R$) por dia.</CardDescription>
                </div>
             </CardHeader>
             <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontWeight: 600, fontSize: 12}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontWeight: 600, fontSize: 12}} tickFormatter={(value) => `R$ ${value}`} />
                    <Tooltip cursor={{fill: '#f1f5f9'}} contentStyle={{borderRadius: '24px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)'}} />
                    <Bar dataKey="sales" fill="hsl(var(--primary))" radius={[10, 10, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
             </div>
          </Card>

          <Card className="border-none shadow-sm rounded-[40px] p-8 flex flex-col gap-8 bg-white">
             <div>
                <CardTitle className="text-2xl font-black italic">Mix de Produtos</CardTitle>
                <CardDescription className="font-bold text-slate-400">Participação no faturamento.</CardDescription>
             </div>
             <div className="h-[250px] relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={productPerformance}
                      cx="50%"
                      cy="50%"
                      innerRadius={65}
                      outerRadius={85}
                      paddingAngle={8}
                      dataKey="value"
                    >
                      {productPerformance.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
             </div>
             <div className="space-y-4">
                {productPerformance.map((item, i) => (
                  <div key={i} className="flex items-center justify-between text-xs font-black uppercase tracking-wider">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full shadow-sm" style={{backgroundColor: item.color}}></div>
                      <span className="text-slate-500">{item.name}</span>
                    </div>
                    <span className="text-slate-900 italic">{item.value}%</span>
                  </div>
                ))}
             </div>
          </Card>
        </div>
      </main>

      <Dialog open={isAdviceOpen} onOpenChange={setIsAdviceOpen}>
        <DialogContent className="sm:max-w-2xl rounded-[40px] border-none shadow-2xl p-0 overflow-hidden">
           <div className="bg-primary p-10 text-white relative overflow-hidden">
              <Sparkles className="absolute -top-10 -right-10 h-40 w-40 opacity-10" />
              <DialogHeader>
                <DialogTitle className="text-3xl font-black italic tracking-tighter">Relatório de Consultoria IA</DialogTitle>
                <p className="text-white/80 font-bold uppercase text-xs tracking-widest mt-2">Análise Estratégica Mercado Ágil</p>
              </DialogHeader>
           </div>
           <div className="p-10 space-y-10">
              {advice && (
                <>
                  <div className="flex items-center justify-between p-6 bg-slate-50 rounded-[24px] border border-dashed border-slate-200">
                    <div>
                      <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-1">Status Atual</h3>
                      <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-none px-4 py-1.5 rounded-full font-black italic">{advice.sentiment}</Badge>
                    </div>
                    <BrainCircuit className="h-10 w-10 text-primary opacity-20" />
                  </div>
                  
                  <div className="space-y-3">
                    <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Resumo da Performance</h3>
                    <p className="text-slate-600 font-medium leading-relaxed">{advice.summary}</p>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Conselhos Práticos</h3>
                    <div className="grid gap-4">
                      {advice.advice.map((item, i) => (
                        <div key={i} className="flex gap-4 p-5 bg-white border border-slate-100 rounded-[28px] items-center shadow-sm">
                           <div className="bg-primary/10 text-primary h-8 w-8 rounded-2xl flex items-center justify-center shrink-0 text-xs font-black italic">{i+1}</div>
                           <p className="text-sm font-bold text-slate-700">{item}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
              <Button className="w-full h-16 bg-slate-900 rounded-[28px] font-black italic text-xl shadow-xl" onClick={() => setIsAdviceOpen(false)}>Focar no Crescimento!</Button>
           </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
