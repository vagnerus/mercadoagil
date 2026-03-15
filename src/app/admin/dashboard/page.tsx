
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Store, LayoutDashboard, Database, Server, LogOut, ShieldCheck, Activity, Globe, LayoutGrid, Building2, TrendingUp, AlertTriangle } from "lucide-react";
import { MOCK_MERCHANTS } from "@/lib/mock-data";
import Link from 'next/link';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const globalData = [
  { month: 'Jan', rev: 80000, churn: 1.5 },
  { month: 'Fev', rev: 95000, churn: 1.2 },
  { month: 'Mar', rev: 110000, churn: 1.1 },
  { month: 'Abr', rev: 125400, churn: 1.2 },
];

export default function AdminDashboard() {
  const stats = [
    { title: "Redes (Franquias)", value: "24", icon: Building2, color: "text-blue-600", bg: "bg-blue-100", trend: "+2" },
    { title: "MRR Global", value: "R$ 125.400", icon: TrendingUp, color: "text-green-600", bg: "bg-green-100", trend: "+8.4%" },
    { title: "Lojistas Ativos", value: "542", icon: Store, color: "text-purple-600", bg: "bg-purple-100", trend: "+45" },
    { title: "Uptime Infra", value: "99.98%", icon: Activity, color: "text-orange-600", bg: "bg-orange-100", trend: "Normal" },
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
            <Building2 className="h-5 w-5" /> Gestão de Franquias
          </Link>
          <Link href="#" className="flex items-center gap-3 px-4 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors font-medium">
            <LayoutGrid className="h-5 w-5" /> Multi-Tenancy
          </Link>
          <Link href="#" className="flex items-center gap-3 px-4 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors font-medium">
            <Database className="h-5 w-5" /> Auditoria SaaS
          </Link>
          <Link href="#" className="flex items-center gap-3 px-4 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors font-medium">
            <Server className="h-5 w-5" /> Infraestrutura
          </Link>
        </nav>
        <div className="p-4 border-t">
          <Button variant="ghost" className="w-full justify-start text-slate-500 gap-2 hover:text-red-500" asChild>
            <Link href="/"><LogOut className="h-4 w-4" /> Sair</Link>
          </Button>
        </div>
      </aside>

      <main className="flex-1 p-8 overflow-y-auto">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tighter italic">Visão Geral Franquias</h1>
            <p className="text-slate-500 font-medium">Controle consolidado de redes e faturamento Multi-Unit.</p>
          </div>
          <div className="flex items-center gap-3">
             <Badge className="bg-slate-200 text-slate-700 font-black uppercase text-[10px]">v2.9.5-enterprise</Badge>
          </div>
        </header>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          {stats.map((stat, i) => (
            <Card key={i} className="border-none shadow-sm rounded-3xl overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className={`${stat.bg} p-3 rounded-2xl`}>
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
             <CardTitle className="text-2xl font-black italic mb-8">Consolidado MRR (Rede)</CardTitle>
             <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={globalData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fontWeight: 700}} />
                    <YAxis axisLine={false} tickLine={false} tickFormatter={(v) => `R$ ${v/1000}k`} tick={{fontWeight: 700}} />
                    <Tooltip />
                    <Area type="monotone" dataKey="rev" stroke="hsl(var(--primary))" strokeWidth={5} fillOpacity={0.1} fill="hsl(var(--primary))" />
                  </AreaChart>
                </ResponsiveContainer>
             </div>
          </Card>
          
          <div className="space-y-6">
            <Card className="border-none shadow-sm p-8 rounded-[40px] bg-slate-900 text-white relative overflow-hidden">
               <CardTitle className="text-xl font-black italic mb-4">Saúde da Rede</CardTitle>
               <div className="space-y-4">
                  <div className="flex justify-between items-center text-xs">
                     <span className="font-bold text-slate-400">Latência API</span>
                     <span className="font-black text-green-500">14ms</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                     <span className="font-bold text-slate-400">Sucesso Repasses</span>
                     <span className="font-black text-green-500">99.9%</span>
                  </div>
                  <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3">
                     <AlertTriangle className="h-4 w-4 text-red-500" />
                     <p className="text-[10px] font-bold text-red-200">2 lojas em Churn Risk</p>
                  </div>
               </div>
            </Card>

            <Card className="border-none shadow-sm p-8 rounded-[40px] bg-white h-[200px] flex flex-col justify-center items-center text-center">
               <Globe className="h-10 w-10 text-primary mb-4" />
               <p className="text-2xl font-black italic">14.2k</p>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Requisições / Min</p>
            </Card>
          </div>
        </div>

        <Card className="border-none shadow-sm rounded-[40px] overflow-hidden">
          <CardHeader className="p-8 border-b">
            <CardTitle className="text-2xl font-black italic">Lojistas & Franquias</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow>
                  <TableHead className="px-8 h-16 font-black uppercase text-[10px] tracking-widest">Lojista</TableHead>
                  <TableHead className="h-16 font-black uppercase text-[10px] tracking-widest">Grupo/Franquia</TableHead>
                  <TableHead className="h-16 font-black uppercase text-[10px] tracking-widest">Plano</TableHead>
                  <TableHead className="h-16 font-black uppercase text-[10px] tracking-widest">Status</TableHead>
                  <TableHead className="text-right px-8 h-16 font-black uppercase text-[10px] tracking-widest">MRR</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {MOCK_MERCHANTS.map((merchant) => (
                  <TableRow key={merchant.id}>
                    <TableCell className="px-8 py-6 font-black text-slate-900 text-lg italic">{merchant.name}</TableCell>
                    <TableCell className="font-bold text-slate-500">{merchant.franchiseGroup || 'Independente'}</TableCell>
                    <TableCell>
                      <Badge className="rounded-lg font-black italic bg-purple-100 text-purple-700 border-none">{merchant.plan}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                         <div className="h-2 w-2 rounded-full bg-green-500"></div>
                         <span className="font-bold text-slate-600">Ativo</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right px-8 font-black text-primary italic">R$ {merchant.mrr.toFixed(2)}</TableCell>
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
