
"use client";

import * as React from 'react';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  BarChart3, TrendingUp, Users, MousePointer2, Map, 
  Download, Calendar, LayoutDashboard, Settings, 
  ArrowUpRight, ArrowDownRight, Zap, Target, Globe, PieChart
} from "lucide-react";
import { 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area, BarChart, Bar, Cell, LineChart, Line 
} from 'recharts';
import Link from 'next/link';

const heatMapData = [
  { region: 'Centro', orders: 450, rev: 12000 },
  { region: 'Norte', orders: 320, rev: 8500 },
  { region: 'Sul', orders: 280, rev: 7200 },
  { region: 'Leste', orders: 150, rev: 4100 },
  { region: 'Oeste', orders: 90, rev: 2300 },
];

const conversionData = [
  { name: 'Visitas', value: 5000 },
  { name: 'Carrinho', value: 1200 },
  { name: 'Checkout', value: 600 },
  { name: 'Venda', value: 450 },
];

export default function MerchantAnalytics({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = React.use(params);

  return (
    <div className="flex min-h-screen bg-slate-50 font-body">
      <aside className="w-64 border-r bg-white hidden lg:flex flex-col sticky top-0 h-screen">
        <div className="p-6">
          <Link href="/" className="flex items-center gap-2 font-black text-xl italic tracking-tighter text-primary">
            MERCADO ÁGIL
          </Link>
        </div>
        <nav className="flex-1 px-4 space-y-2">
          <Link href={`/merchant/${slug}/dashboard`} className="flex items-center gap-3 px-4 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors font-medium">
            <LayoutDashboard className="h-5 w-5" /> Dashboard
          </Link>
          <Link href={`/merchant/${slug}/analytics`} className="flex items-center gap-3 px-4 py-2.5 bg-primary/10 text-primary rounded-xl font-bold">
            <BarChart3 className="h-5 w-5" /> Analytics Pro
          </Link>
          <Link href={`/merchant/${slug}/settings`} className="flex items-center gap-3 px-4 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors font-medium">
            <Settings className="h-5 w-5" /> Configurações
          </Link>
        </nav>
      </aside>

      <main className="flex-1 p-8 overflow-y-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tighter italic uppercase">Big Data & Insights</h1>
            <p className="text-slate-500 font-medium">Análise comportamental, funil de vendas e mapa de calor.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="rounded-2xl h-12 gap-2 font-bold"><Calendar className="h-4 w-4" /> Últimos 30 dias</Button>
            <Button className="bg-primary rounded-2xl h-12 gap-2 font-black italic shadow-xl shadow-primary/20 px-6">
              <Download className="h-4 w-4" /> Exportar Deep Report
            </Button>
          </div>
        </header>

        <div className="grid gap-6 md:grid-cols-4 mb-10">
           {[
             { title: "Taxa de Conversão", value: "9.2%", trend: "+1.2%", icon: Target, color: "text-blue-600", bg: "bg-blue-100" },
             { title: "LTV (Customer Life)", value: "R$ 842", trend: "+5.4%", icon: Users, color: "text-purple-600", bg: "bg-purple-100" },
             { title: "Churn Rate (IA)", value: "1.2%", trend: "-0.5%", icon: ArrowDownRight, color: "text-green-600", bg: "bg-green-100" },
             { title: "Sessões Ativas", value: "142", trend: "Live", icon: Globe, color: "text-orange-600", bg: "bg-orange-100" },
           ].map((stat, i) => (
             <Card key={i} className="border-none shadow-sm rounded-[32px] overflow-hidden">
               <CardContent className="p-6">
                 <div className="flex justify-between items-start">
                    <div className={`${stat.bg} p-3 rounded-2xl`}>
                       <stat.icon className={`h-6 w-6 ${stat.color}`} />
                    </div>
                    <Badge className="bg-slate-50 text-slate-400 border-none font-black italic">{stat.trend}</Badge>
                 </div>
                 <div className="mt-4">
                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{stat.title}</p>
                    <p className="text-3xl font-black italic text-slate-900">{stat.value}</p>
                 </div>
               </CardContent>
             </Card>
           ))}
        </div>

        <div className="grid gap-8 lg:grid-cols-3 mb-8">
           <Card className="lg:col-span-2 border-none shadow-sm rounded-[40px] p-8 bg-white">
              <div className="flex justify-between items-center mb-8">
                 <CardTitle className="text-2xl font-black italic">Mapa de Calor por Região</CardTitle>
                 <Map className="h-6 w-6 text-slate-200" />
              </div>
              <div className="h-[350px]">
                 <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={heatMapData}>
                       <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                       <XAxis dataKey="region" axisLine={false} tickLine={false} tick={{fontWeight: 700}} />
                       <YAxis axisLine={false} tickLine={false} tickFormatter={(v) => `R$ ${v/1000}k`} />
                       <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)'}} />
                       <Bar dataKey="rev" radius={[15, 15, 0, 0]}>
                          {heatMapData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={index === 0 ? 'hsl(var(--primary))' : '#e2e8f0'} />
                          ))}
                       </Bar>
                    </BarChart>
                 </ResponsiveContainer>
              </div>
           </Card>

           <div className="space-y-6">
              <Card className="border-none shadow-sm rounded-[40px] p-8 bg-slate-900 text-white relative overflow-hidden">
                 <div className="relative z-10">
                    <p className="text-[10px] font-black uppercase text-primary tracking-widest mb-2">Benchmark Local</p>
                    <h3 className="text-2xl font-black italic">Você está no Top 5%</h3>
                    <p className="text-sm text-slate-400 mt-4 leading-relaxed font-medium">
                       Sua loja performa melhor que 95% dos concorrentes no mesmo segmento em um raio de 5km.
                    </p>
                    <div className="mt-6 h-2 w-full bg-white/10 rounded-full overflow-hidden">
                       <div className="h-full bg-primary w-[95%]"></div>
                    </div>
                 </div>
                 <Zap className="absolute -bottom-10 -right-10 h-40 w-40 opacity-5" />
              </Card>

              <Card className="border-none shadow-sm rounded-[40px] p-8 bg-white">
                 <CardTitle className="text-xl font-black italic mb-6">Funil de Conversão</CardTitle>
                 <div className="space-y-4">
                    {conversionData.map((item, i) => (
                      <div key={item.name} className="space-y-1">
                         <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                            <span className="text-slate-400">{item.name}</span>
                            <span className="text-slate-900">{item.value}</span>
                         </div>
                         <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-primary/40 rounded-full" style={{ width: `${(item.value / conversionData[0].value) * 100}%` }}></div>
                         </div>
                      </div>
                    ))}
                 </div>
              </Card>
           </div>
        </div>

        <Card className="border-none shadow-sm rounded-[40px] p-10 bg-white">
           <div className="flex justify-between items-center mb-10">
              <div className="space-y-1">
                 <h2 className="text-2xl font-black italic tracking-tighter uppercase">Previsão de Receita (IA Preditiva)</h2>
                 <p className="text-sm text-slate-400 font-bold">Baseado em tendências sazonais e comportamento de mercado.</p>
              </div>
              <Badge className="bg-primary/10 text-primary border-none px-4 py-2 font-black italic">Confiança: 92%</Badge>
           </div>
           <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                 <AreaChart data={[
                   { d: '01/10', v: 4200 }, { d: '05/10', v: 5100 }, { d: '10/10', v: 4800 }, 
                   { d: '15/10', v: 6200 }, { d: '20/10', v: 8400 }, { d: '25/10', v: 7900 },
                   { d: '30/10', v: 9500 }
                 ]}>
                    <defs>
                       <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                       </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="d" axisLine={false} tickLine={false} tick={{fontWeight: 700}} />
                    <YAxis axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{borderRadius: '20px', border: 'none'}} />
                    <Area type="monotone" dataKey="v" stroke="hsl(var(--primary))" strokeWidth={5} fillOpacity={1} fill="url(#colorPv)" />
                 </AreaChart>
              </ResponsiveContainer>
           </div>
        </Card>
      </main>
    </div>
  );
}
