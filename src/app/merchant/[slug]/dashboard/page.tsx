
"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Package, DollarSign, Clock, LayoutDashboard, List, Settings, UtensilsCrossed, TrendingUp, AlertTriangle, Download, Users, Ticket, Sparkles, Loader2, BrainCircuit } from "lucide-react";
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
    <div className="flex min-h-screen bg-slate-50">
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
          <Link href={`/merchant/${params.slug}/settings`} className="flex items-center gap-3 px-4 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors font-medium">
            <Settings className="h-5 w-5" /> Configurações
          </Link>
        </nav>
      </aside>

      <main className="flex-1 p-8 overflow-y-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 uppercase tracking-tight">{params.slug.replace('-', ' ')}</h1>
            <p className="text-slate-500 font-medium">Insights baseados em inteligência artificial.</p>
          </div>
          <div className="flex gap-3">
             <Button 
              onClick={handleGetAdvice} 
              disabled={loadingAdvice}
              className="bg-primary hover:bg-primary/90 rounded-xl h-12 gap-2 shadow-lg shadow-primary/20"
             >
               {loadingAdvice ? <Loader2 className="h-4 w-4 animate-spin" /> : <BrainCircuit className="h-5 w-5" />}
               Consultoria IA
             </Button>
             <Badge className="bg-green-500 text-white h-12 px-6 rounded-xl flex items-center text-sm font-bold shadow-sm">LOJA ABERTA</Badge>
          </div>
        </header>

        {lowStockProducts.length > 0 && (
          <div className="mb-8 p-5 bg-orange-50 border border-orange-100 rounded-[32px] flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-4">
               <div className="p-3 bg-orange-100 rounded-2xl">
                 <AlertTriangle className="h-6 w-6 text-orange-600" />
               </div>
               <div>
                  <h4 className="font-bold text-orange-900">Alerta de Estoque</h4>
                  <p className="text-sm text-orange-700 font-medium">Atenção! {lowStockProducts.length} itens estão abaixo do nível crítico.</p>
               </div>
            </div>
            <Button variant="outline" asChild className="border-orange-200 text-orange-900 font-bold rounded-xl hover:bg-orange-100"><Link href={`/merchant/${params.slug}/catalog`}>Gerenciar Estoque</Link></Button>
          </div>
        )}

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
                  <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">{stat.title}</p>
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
                  <CardTitle className="text-2xl font-black">Performance Semanal</CardTitle>
                  <CardDescription className="font-medium">Volume de vendas e pedidos por dia.</CardDescription>
                </div>
             </CardHeader>
             <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontWeight: 600}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontWeight: 600}} tickFormatter={(value) => `R$ ${value}`} />
                    <Tooltip cursor={{fill: '#f1f5f9'}} contentStyle={{borderRadius: '24px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)'}} />
                    <Bar dataKey="sales" fill="hsl(var(--accent))" radius={[12, 12, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
             </div>
          </Card>

          <Card className="border-none shadow-sm rounded-[40px] p-8 flex flex-col gap-8">
             <div>
                <CardTitle className="text-2xl font-black">Mix de Produtos</CardTitle>
                <CardDescription className="font-medium">Participação por categoria.</CardDescription>
             </div>
             <div className="h-[250px] relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={productPerformance}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {productPerformance.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
             </div>
             <div className="space-y-3">
                {productPerformance.map((item, i) => (
                  <div key={i} className="flex items-center justify-between text-sm font-bold">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{backgroundColor: item.color}}></div>
                      <span className="text-slate-600">{item.name}</span>
                    </div>
                    <span className="text-slate-900">{item.value}%</span>
                  </div>
                ))}
             </div>
          </Card>
        </div>
      </main>

      <Dialog open={isAdviceOpen} onOpenChange={setIsAdviceOpen}>
        <DialogContent className="sm:max-w-2xl rounded-[40px] border-none shadow-2xl p-0 overflow-hidden font-body">
           <div className="bg-primary p-8 text-white relative overflow-hidden">
              <Sparkles className="absolute -top-6 -right-6 h-32 w-32 opacity-10" />
              <DialogHeader>
                <DialogTitle className="text-3xl font-black italic tracking-tighter">Relatório Estratégico IA</DialogTitle>
                <p className="text-white/80 font-bold uppercase text-xs tracking-widest mt-2">Análise de Performance Mercado Ágil</p>
              </DialogHeader>
           </div>
           <div className="p-8 space-y-8">
              {advice && (
                <>
                  <div className="space-y-2">
                    <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Status do Negócio</h3>
                    <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-none px-4 py-1.5 rounded-full font-black italic">{advice.sentiment}</Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Resumo da Análise</h3>
                    <p className="text-slate-600 font-medium leading-relaxed">{advice.summary}</p>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Próximos Passos</h3>
                    <div className="grid gap-3">
                      {advice.advice.map((item, i) => (
                        <div key={i} className="flex gap-4 p-4 bg-slate-50 border rounded-2xl items-start">
                           <div className="bg-primary/10 text-primary h-6 w-6 rounded-full flex items-center justify-center shrink-0 text-xs font-black">{i+1}</div>
                           <p className="text-sm font-bold text-slate-700 leading-snug">{item}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
              <Button className="w-full h-14 bg-slate-900 rounded-2xl font-black italic text-lg shadow-xl" onClick={() => setIsAdviceOpen(false)}>Entendido!</Button>
           </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
