
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Store, TrendingUp, AlertCircle, LayoutDashboard, Settings, Package, CreditCard, LogOut, ChevronRight, Activity, ShieldCheck, Database, Server, Lock, Globe } from "lucide-react";
import { MOCK_MERCHANTS } from "@/lib/mock-data";
import Link from 'next/link';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';

const globalData = [
  { month: 'Jan', active: 400, rev: 80000, new: 45 },
  { month: 'Fev', active: 450, rev: 95000, new: 52 },
  { month: 'Mar', active: 510, rev: 110000, new: 68 },
  { month: 'Abr', active: 542, rev: 125400, new: 74 },
];

export default function AdminDashboard() {
  const stats = [
    { title: "Lojas Ativas", value: "542", icon: Store, color: "text-blue-600", bg: "bg-blue-100", trend: "+12%" },
    { title: "MRR Consolidado", value: "R$ 125.400", icon: CreditCard, color: "text-green-600", bg: "bg-green-100", trend: "+8.4%" },
    { title: "Clientes Finais", value: "128.420", icon: Users, color: "text-purple-600", bg: "bg-purple-100", trend: "+5.1%" },
    { title: "Uptime Infra", value: "99.98%", icon: Activity, color: "text-orange-600", bg: "bg-orange-100", trend: "Estável" },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50">
      <aside className="w-64 border-r bg-white hidden lg:flex flex-col">
        <div className="p-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-primary p-1.5 rounded-lg">
              <ShieldCheck className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-xl text-slate-800 tracking-tight">Master Admin</span>
          </Link>
        </div>
        <nav className="flex-1 px-4 space-y-2">
          <Link href="/admin/dashboard" className="flex items-center gap-3 px-4 py-2.5 bg-primary/10 text-primary rounded-xl font-semibold">
            <LayoutDashboard className="h-5 w-5" /> Global
          </Link>
          <Link href="#" className="flex items-center gap-3 px-4 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors font-medium">
            <Store className="h-5 w-5" /> Gestão de Lojistas
          </Link>
          <Link href="#" className="flex items-center gap-3 px-4 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors font-medium">
            <Package className="h-5 w-5" /> Planos & SaaS
          </Link>
          <Link href="#" className="flex items-center gap-3 px-4 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors font-medium">
            <Database className="h-5 w-5" /> Logs de Auditoria
          </Link>
          <Link href="#" className="flex items-center gap-3 px-4 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors font-medium">
            <Server className="h-5 w-5" /> Infraestrutura
          </Link>
        </nav>
        <div className="p-6 mt-auto">
           <div className="bg-slate-900 rounded-2xl p-4 text-white">
              <p className="text-[10px] font-black uppercase text-slate-400 mb-2">Saúde da Rede</p>
              <div className="flex items-center gap-2 text-xs font-bold">
                 <div className="h-2 w-2 rounded-full bg-green-500"></div>
                 Brasil Sul (Normal)
              </div>
           </div>
        </div>
        <div className="p-4 border-t">
          <Button variant="ghost" className="w-full justify-start text-slate-500 gap-2 hover:text-red-500 hover:bg-red-50" asChild>
            <Link href="/"><LogOut className="h-4 w-4" /> Sair</Link>
          </Button>
        </div>
      </aside>

      <main className="flex-1 p-8 overflow-y-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tighter italic">Visão Geral da Rede</h1>
            <p className="text-slate-500 font-medium">Controle total de multi-tenancy e faturamento SaaS.</p>
          </div>
          <div className="flex items-center gap-3">
             <Badge variant="secondary" className="bg-slate-200 text-slate-700 px-4 py-1 rounded-full font-black uppercase text-[10px]">v2.9.0-stable</Badge>
             <Button size="icon" variant="outline" className="rounded-xl"><Lock className="h-4 w-4" /></Button>
          </div>
        </header>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          {stats.map((stat, i) => (
            <Card key={i} className="border-none shadow-sm hover:shadow-md transition-all group">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className={`${stat.bg} p-3 rounded-2xl group-hover:scale-110 transition-transform`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                  <span className="text-[10px] font-black text-green-600 bg-green-50 px-2 py-0.5 rounded-full">{stat.trend}</span>
                </div>
                <div className="mt-4">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.title}</p>
                  <p className="text-2xl font-black text-slate-900 mt-1 italic tracking-tight">{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-3 mb-8">
          <Card className="lg:col-span-2 border-none shadow-sm p-8 rounded-[40px]">
             <CardHeader className="p-0 mb-8 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-2xl font-black italic">Crescimento de Receita (MRR)</CardTitle>
                </div>
                <div className="flex gap-2">
                   <Button variant="ghost" size="sm" className="font-bold text-slate-400">90 dias</Button>
                   <Button variant="secondary" size="sm" className="font-bold bg-primary/10 text-primary">Este Ano</Button>
                </div>
             </CardHeader>
             <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={globalData}>
                    <defs>
                      <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fontWeight: 700}} />
                    <YAxis axisLine={false} tickLine={false} tickFormatter={(value) => `R$ ${value/1000}k`} tick={{fontWeight: 700}} />
                    <Tooltip contentStyle={{borderRadius: '24px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} />
                    <Area type="monotone" dataKey="rev" stroke="hsl(var(--primary))" strokeWidth={5} fillOpacity={1} fill="url(#colorRev)" />
                  </AreaChart>
                </ResponsiveContainer>
             </div>
          </Card>
          
          <div className="space-y-6">
            <Card className="border-none shadow-sm p-8 flex flex-col justify-between rounded-[40px] bg-primary text-white relative overflow-hidden">
              <CardHeader className="p-0">
                 <p className="text-[10px] font-black uppercase text-white/60 tracking-widest mb-1">Taxa de Churn</p>
                 <CardTitle className="text-4xl font-black italic">1.2%</CardTitle>
              </CardHeader>
              <div className="mt-8">
                 <p className="text-sm font-bold text-white/80">Meta Mensal: <span className="text-white">&lt; 2.0%</span></p>
                 <div className="h-2 w-full bg-white/20 rounded-full mt-3 overflow-hidden">
                    <div className="h-full bg-white w-[60%] rounded-full"></div>
                 </div>
              </div>
              <Globe className="absolute -bottom-10 -right-10 h-40 w-40 text-white/5" />
            </Card>

            <Card className="border-none shadow-sm p-8 rounded-[40px] bg-white h-[230px]">
               <CardTitle className="text-xl font-black italic mb-4">Novos Lojistas</CardTitle>
               <div className="h-[120px]">
                 <ResponsiveContainer width="100%" height="100%">
                   <BarChart data={globalData}>
                      <Bar dataKey="new" fill="hsl(var(--accent))" radius={[5, 5, 0, 0]} />
                   </BarChart>
                 </ResponsiveContainer>
               </div>
               <p className="text-[10px] font-black text-slate-400 mt-4 uppercase text-center tracking-widest">Média de 62 novos/mês</p>
            </Card>
          </div>
        </div>

        <Card className="border-none shadow-sm rounded-[40px] overflow-hidden">
          <CardHeader className="border-b bg-white flex flex-row items-center justify-between p-8">
            <CardTitle className="text-2xl font-black italic">Monitoramento de Assinaturas</CardTitle>
            <div className="flex gap-2">
               <Button variant="outline" className="rounded-xl h-10 font-bold">Filtrar</Button>
               <Button className="rounded-xl h-10 font-bold">Exportar CSV</Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow>
                  <TableHead className="px-8 py-5 h-16 font-black uppercase text-[10px] tracking-widest">Lojista</TableHead>
                  <TableHead className="h-16 font-black uppercase text-[10px] tracking-widest">Plano</TableHead>
                  <TableHead className="h-16 font-black uppercase text-[10px] tracking-widest">Status</TableHead>
                  <TableHead className="h-16 font-black uppercase text-[10px] tracking-widest">MRR Individual</TableHead>
                  <TableHead className="text-right px-8 h-16 font-black uppercase text-[10px] tracking-widest">Desde</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {MOCK_MERCHANTS.map((merchant) => (
                  <TableRow key={merchant.id} className="hover:bg-slate-50 transition-colors">
                    <TableCell className="px-8 py-6 font-black text-slate-900 text-lg italic">
                      {merchant.name}
                    </TableCell>
                    <TableCell>
                      <Badge className={`rounded-lg border-none px-4 py-1 font-black italic ${
                        merchant.plan === 'Pro' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                      }`}>{merchant.plan}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                         <div className="h-2 w-2 rounded-full bg-green-500"></div>
                         <span className="font-bold text-slate-600">Ativo</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-black text-primary italic">
                       R$ {merchant.mrr.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right px-8 text-slate-400 font-bold text-sm">
                      {merchant.createdAt}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
