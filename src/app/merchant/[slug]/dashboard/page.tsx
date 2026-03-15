
"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Package, DollarSign, Clock, LayoutDashboard, List, Settings, UtensilsCrossed, TrendingUp, AlertTriangle, Download, Users, Ticket, Sparkles, Loader2, BrainCircuit, Wallet, Map, Calendar, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
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
    { title: "Vendas Hoje", value: "R$ 1.240", icon: DollarSign, color: "text-green-600", bg: "bg-green-100", trend: "+12.5%", isUp: true },
    { title: "Ticket Médio", value: "R$ 42,50", icon: TrendingUp, color: "text-blue-600", bg: "bg-blue-100", trend: "+4.2%", isUp: true },
    { title: "Novos Clientes", value: "12", icon: Users, color: "text-purple-600", bg: "bg-purple-100", trend: "-2.1%", isUp: false },
    { title: "Tempo Médio", value: "32 min", icon: Clock, color: "text-orange-600", bg: "bg-orange-100", trend: "0.0%", isUp: true },
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
            <div className="flex items-center gap-3">
               <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter italic">{params.slug.replace('-', ' ')}</h1>
               <Badge className="bg-green-100 text-green-700 border-none rounded-full px-4 font-black text-[10px] uppercase">Online</Badge>
            </div>
            <p className="text-slate-500 font-medium">Métricas avançadas e análise preditiva IA.</p>
          </div>
          <div className="flex gap-3">
             <Button variant="outline" className="rounded-2xl h-12 gap-2 border-slate-200 font-bold"><Download className="h-4 w-4" /> Exportar</Button>
             <Button 
              onClick={handleGetAdvice} 
              disabled={loadingAdvice}
              className="bg-primary hover:bg-primary/90 rounded-2xl h-12 gap-2 shadow-xl shadow-primary/20 font-black italic px-8"
             >
               {loadingAdvice ? <Loader2 className="h-4 w-4 animate-spin" /> : <BrainCircuit className="h-5 w-5" />}
               Consultoria IA
             </Button>
          </div>
        </header>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          {stats.map((stat, i) => (
            <Card key={i} className="border-none shadow-sm rounded-[32px] hover:shadow-md transition-all group overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className={`${stat.bg} p-3 rounded-2xl group-hover:scale-110 transition-transform`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                  <div className={`flex items-center gap-1 text-[10px] font-black uppercase tracking-widest ${stat.isUp ? 'text-green-500' : 'text-red-500'}`}>
                    {stat.isUp ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
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
             <CardHeader className="p-0 mb-8 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-2xl font-black italic">Fluxo de Caixa</CardTitle>
                  <CardDescription className="font-bold text-slate-400">Comparativo vs Semana Passada</CardDescription>
                </div>
                <div className="flex gap-2">
                   <Badge variant="secondary" className="bg-slate-100 text-slate-500 border-none font-black italic">Hoje</Badge>
                   <Badge variant="secondary" className="bg-primary/10 text-primary border-none font-black italic">Semana Passada</Badge>
                </div>
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
                    <Area type="monotone" dataKey="prev" stroke="#cbd5e1" strokeWidth={2} fill="transparent" strokeDasharray="5 5" />
                  </AreaChart>
                </ResponsiveContainer>
             </div>
          </Card>

          <Card className="border-none shadow-sm rounded-[40px] p-8 flex flex-col justify-between">
             <div className="space-y-2">
                <CardTitle className="text-2xl font-black italic">Alertas Operacionais</CardTitle>
                <CardDescription className="font-bold text-slate-400">Ações imediatas sugeridas.</CardDescription>
             </div>
             
             <div className="space-y-4">
                {lowStockProducts.map(p => (
                  <div key={p.id} className="flex items-center gap-4 p-4 bg-red-50 border border-red-100 rounded-3xl group hover:bg-red-100 transition-colors">
                     <AlertTriangle className="h-8 w-8 text-red-500 shrink-0" />
                     <div className="flex-1">
                        <p className="text-sm font-black text-red-900">{p.name}</p>
                        <p className="text-xs font-bold text-red-700">Apenas {p.stock} unidades restantes!</p>
                     </div>
                     <Button size="icon" variant="ghost" className="rounded-full hover:bg-white text-red-500" asChild>
                        <Link href={`/merchant/${params.slug}/catalog`}><TrendingUp className="h-4 w-4" /></Link>
                     </Button>
                  </div>
                ))}
                
                <div className="p-6 bg-slate-900 rounded-[32px] text-white relative overflow-hidden group cursor-pointer">
                   <Map className="absolute -bottom-4 -right-4 h-24 w-24 opacity-10 group-hover:scale-110 transition-transform" />
                   <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-1">Zona de Calor</p>
                   <h4 className="text-xl font-black italic mb-4">Mapa de Pedidos</h4>
                   <Button size="sm" className="bg-primary text-white font-bold rounded-xl border-none">Ver Mapa</Button>
                </div>
             </div>

             <div className="pt-6 border-t border-dashed">
                <div className="flex items-center justify-between text-xs font-black uppercase tracking-widest text-slate-400">
                   <span>Meta Mensal</span>
                   <span>85%</span>
                </div>
                <div className="h-3 w-full bg-slate-100 rounded-full mt-2 overflow-hidden">
                   <div className="h-full bg-primary w-[85%] rounded-full shadow-lg shadow-primary/30"></div>
                </div>
             </div>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
           <Card className="border-none shadow-sm rounded-[40px] p-8 bg-white">
              <div className="flex justify-between items-start mb-6">
                 <div>
                    <h3 className="text-xl font-black italic">Mix de Produtos</h3>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Participação Financeira</p>
                 </div>
                 <PieChart width={80} height={80}>
                    <Pie data={productPerformance} cx="50%" cy="50%" innerRadius={25} outerRadius={35} paddingAngle={5} dataKey="value">
                      {productPerformance.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                 </PieChart>
              </div>
              <div className="space-y-4">
                 {productPerformance.map((item, i) => (
                   <div key={i} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                         <div className="h-2 w-2 rounded-full" style={{backgroundColor: item.color}}></div>
                         <span className="text-sm font-bold text-slate-600">{item.name}</span>
                      </div>
                      <span className="text-sm font-black italic text-slate-900">{item.value}%</span>
                   </div>
                 ))}
              </div>
           </Card>

           <Card className="md:col-span-2 border-none shadow-sm rounded-[40px] p-8 bg-white flex flex-col justify-between">
              <div className="flex justify-between items-center mb-6">
                 <div>
                    <h3 className="text-xl font-black italic">Horários de Pico</h3>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Volume de Pedidos por Hora</p>
                 </div>
                 <Button variant="ghost" size="sm" className="font-bold text-primary gap-1">Ver Tudo <Clock className="h-4 w-4" /></Button>
              </div>
              <div className="flex items-end justify-between h-32 gap-3">
                 {[10, 20, 45, 80, 100, 95, 70, 40, 20].map((h, i) => (
                   <div key={i} className="flex-1 group relative">
                      <div 
                        className="w-full bg-slate-100 rounded-t-xl group-hover:bg-primary transition-all cursor-help"
                        style={{height: `${h}%`}}
                      >
                         <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-black py-1 px-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                            {11 + i}:00 - {h}%
                         </div>
                      </div>
                      <div className="text-center mt-3 text-[9px] font-black text-slate-400">{11 + i}h</div>
                   </div>
                 ))}
              </div>
           </Card>
        </div>
      </main>

      <Dialog open={isAdviceOpen} onOpenChange={setIsAdviceOpen}>
        <DialogContent className="sm:max-w-2xl rounded-[40px] border-none shadow-2xl p-0 overflow-hidden font-body">
           <div className="bg-primary p-10 text-white relative overflow-hidden">
              <Sparkles className="absolute -top-10 -right-10 h-40 w-40 opacity-10 animate-pulse" />
              <DialogHeader>
                <DialogTitle className="text-3xl font-black italic tracking-tighter">Relatório de Estratégia IA</DialogTitle>
                <p className="text-white/80 font-bold uppercase text-[10px] tracking-widest mt-2 border-l-2 border-white/30 pl-3">Análise Mercado Ágil Intelligence</p>
              </DialogHeader>
           </div>
           <div className="p-10 space-y-10">
              {advice && (
                <>
                  <div className="flex items-center justify-between p-6 bg-slate-50 rounded-[32px] border border-dashed border-slate-200">
                    <div>
                      <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Saúde do Negócio</h3>
                      <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-none px-6 py-2 rounded-full font-black italic shadow-sm">{advice.sentiment}</Badge>
                    </div>
                    <BrainCircuit className="h-12 w-12 text-primary opacity-20" />
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Resumo da Inteligência</h3>
                    <p className="text-slate-600 font-medium leading-relaxed italic border-l-4 border-primary/20 pl-6">{advice.summary}</p>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Estratégias de Crescimento</h3>
                    <div className="grid gap-4">
                      {advice.advice.map((item, i) => (
                        <div key={i} className="flex gap-5 p-6 bg-white border border-slate-100 rounded-[32px] items-center shadow-sm hover:shadow-md transition-shadow group">
                           <div className="bg-primary/10 text-primary h-10 w-10 rounded-[18px] flex items-center justify-center shrink-0 text-xs font-black italic group-hover:bg-primary group-hover:text-white transition-all">{i+1}</div>
                           <p className="text-sm font-bold text-slate-700 leading-tight">{item}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
              <Button className="w-full h-20 bg-slate-900 rounded-[35px] font-black italic text-xl shadow-2xl hover:scale-[1.02] transition-transform" onClick={() => setIsAdviceOpen(false)}>Explodir de Vender!</Button>
           </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
