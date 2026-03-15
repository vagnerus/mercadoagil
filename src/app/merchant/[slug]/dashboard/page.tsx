
"use client";

import * as React from 'react';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Package, DollarSign, Clock, LayoutDashboard, List, Settings, TrendingUp, AlertTriangle, Download, Users, BrainCircuit, Wallet, Map, ArrowUpRight, ArrowDownRight, Activity, Zap, Star, ShieldCheck, History, MousePointer2 } from "lucide-react";
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area, BarChart, Bar } from 'recharts';
import Link from 'next/link';
import { MOCK_PRODUCTS, MOCK_AUDIT_LOGS } from "@/lib/mock-data";
import { getBusinessAdvice, BusinessAdvisorOutput } from "@/ai/flows/business-advisor-flow";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

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
  const { toast } = useToast();
  
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
      toast({ title: "Erro", description: "Falha ao consultar IA.", variant: "destructive" });
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
          <Link href={`/merchant/${slug}/customers`} className="flex items-center gap-3 px-4 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors font-medium">
            <Users className="h-5 w-5" /> CRM Clientes
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
            <p className="text-slate-500 font-medium">Métricas integradas e inteligência de negócio.</p>
          </div>
          <div className="flex gap-3">
             <Button variant="outline" className="rounded-2xl h-12 gap-2 font-bold bg-white">
                <History className="h-4 w-4" /> Logs Auditoria
             </Button>
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
             <div className="flex justify-between items-center mb-8">
                <CardTitle className="text-2xl font-black italic">Receita Semanal (WoW)</CardTitle>
                <Badge variant="secondary" className="bg-primary/10 text-primary font-black">+14.2% esta semana</Badge>
             </div>
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

          <div className="space-y-6">
            <Card className="border-none shadow-sm rounded-[40px] p-8 bg-slate-900 text-white relative overflow-hidden h-[220px]">
               <div className="relative z-10">
                 <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Saúde do Sistema</p>
                 <div className="flex items-center gap-3">
                    <div className="h-3 w-3 rounded-full bg-green-500 animate-pulse"></div>
                    <span className="font-bold">Operando Normal</span>
                 </div>
                 <div className="mt-6 grid grid-cols-2 gap-4">
                    <div>
                       <p className="text-2xl font-black italic">99.9%</p>
                       <p className="text-[9px] uppercase font-bold text-slate-400">Uptime</p>
                    </div>
                    <div>
                       <p className="text-2xl font-black italic">14ms</p>
                       <p className="text-[9px] uppercase font-bold text-slate-400">Latência</p>
                    </div>
                 </div>
               </div>
               <MousePointer2 className="absolute -bottom-10 -right-10 h-40 w-40 opacity-5 text-white" />
            </Card>

            <Card className="border-none shadow-sm rounded-[40px] p-8 flex flex-col h-[calc(100%-236px)]">
               <CardTitle className="text-2xl font-black italic mb-6 flex items-center gap-2">
                  <Activity className="h-6 w-6 text-primary" /> Atividade Auditoria
               </CardTitle>
               <div className="space-y-4 flex-1 overflow-y-auto no-scrollbar">
                  {MOCK_AUDIT_LOGS.map((log) => (
                    <div key={log.id} className="p-4 rounded-3xl bg-slate-50 border border-slate-100">
                      <div className="flex justify-between items-start mb-1">
                        <p className="text-sm font-black text-slate-900">{log.action}</p>
                        <span className="text-[8px] font-bold text-slate-400 uppercase">{log.timestamp}</span>
                      </div>
                      <p className="text-xs text-slate-500 font-medium leading-tight">{log.details}</p>
                      <p className="text-[10px] font-black text-primary mt-2 uppercase">{log.user}</p>
                    </div>
                  ))}
               </div>
            </Card>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
           <Card className="border-none shadow-sm rounded-[40px] p-8">
              <CardTitle className="text-2xl font-black italic mb-8">Top Produtos (Volume)</CardTitle>
              <div className="h-[300px]">
                 <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={productPerformance} layout="vertical">
                       <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                       <XAxis type="number" hide />
                       <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} width={100} tick={{fontWeight: 700}} />
                       <Tooltip cursor={{fill: 'transparent'}} contentStyle={{borderRadius: '16px'}} />
                       <Bar dataKey="value" radius={[0, 10, 10, 0]}>
                          {productPerformance.map((entry, index) => (
                             <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                       </Bar>
                    </BarChart>
                 </ResponsiveContainer>
              </div>
           </Card>

           <Card className="border-none shadow-sm rounded-[40px] p-8 flex flex-col justify-center items-center text-center bg-primary/5 border border-primary/10">
              <div className="bg-primary/20 p-6 rounded-full mb-6">
                 <Zap className="h-12 w-12 text-primary fill-primary" />
              </div>
              <h3 className="text-2xl font-black italic tracking-tighter mb-2">QR Code de Mesa Ativo</h3>
              <p className="text-slate-500 font-medium max-w-xs mb-8">Seus clientes podem pedir diretamente da mesa escaneando o código.</p>
              <div className="flex gap-4">
                 <Button className="rounded-2xl h-14 px-8 font-black italic bg-slate-900">Configurar Mesas</Button>
                 <Button variant="outline" className="rounded-2xl h-14 px-8 font-black italic border-2">Gerar PDF</Button>
              </div>
           </Card>
        </div>
      </main>

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
  );
}
