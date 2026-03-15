
"use client";

import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Server, Activity, Globe, ShieldCheck, LogOut, LayoutDashboard, Building2, LayoutGrid, Database, Zap, Cpu, HardDrive, RefreshCw } from "lucide-react";
import Link from 'next/link';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const latencyData = [
  { time: '10:00', ms: 14 },
  { time: '11:00', ms: 16 },
  { time: '12:00', ms: 22 },
  { time: '13:00', ms: 18 },
  { time: '14:00', ms: 15 },
  { time: '15:00', ms: 14 },
];

export default function AdminInfra() {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <aside className="w-64 border-r bg-white hidden lg:flex flex-col sticky top-0 h-screen">
        <div className="p-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-primary p-1.5 rounded-lg">
              <ShieldCheck className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-xl text-slate-800 tracking-tight">Master Admin</span>
          </Link>
        </div>
        <nav className="flex-1 px-4 space-y-2">
          <Link href="/admin/dashboard" className="flex items-center gap-3 px-4 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors font-medium">
            <LayoutDashboard className="h-5 w-5" /> Global
          </Link>
          <Link href="/admin/franchises" className="flex items-center gap-3 px-4 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors font-medium">
            <Building2 className="h-5 w-5" /> Gestão de Franquias
          </Link>
          <Link href="/admin/tenants" className="flex items-center gap-3 px-4 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors font-medium">
            <LayoutGrid className="h-5 w-5" /> Multi-Tenancy
          </Link>
          <Link href="/admin/audit" className="flex items-center gap-3 px-4 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors font-medium">
            <Database className="h-5 w-5" /> Auditoria SaaS
          </Link>
          <Link href="/admin/infra" className="flex items-center gap-3 px-4 py-2.5 bg-primary/10 text-primary rounded-xl font-semibold">
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
            <h1 className="text-3xl font-black text-slate-900 tracking-tighter italic">Infraestrutura Global</h1>
            <p className="text-slate-500 font-medium">Monitoramento de backend, latência e saúde de clusters.</p>
          </div>
          <Button className="bg-primary rounded-2xl h-12 gap-2 font-black italic shadow-xl shadow-primary/20">
            <RefreshCw className="h-4 w-4" /> Flush Cache Global
          </Button>
        </header>

        <div className="grid gap-6 md:grid-cols-4 mb-8">
           <Card className="border-none shadow-sm p-6 rounded-3xl bg-white flex flex-col items-center text-center">
              <Cpu className="h-8 w-8 text-blue-500 mb-3" />
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">CPU Master</p>
              <p className="text-2xl font-black italic text-slate-900">12%</p>
           </Card>
           <Card className="border-none shadow-sm p-6 rounded-3xl bg-white flex flex-col items-center text-center">
              <HardDrive className="h-8 w-8 text-purple-500 mb-3" />
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">DB Load</p>
              <p className="text-2xl font-black italic text-slate-900">42%</p>
           </Card>
           <Card className="border-none shadow-sm p-6 rounded-3xl bg-white flex flex-col items-center text-center">
              <Zap className="h-8 w-8 text-yellow-500 mb-3" />
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Avg Latency</p>
              <p className="text-2xl font-black italic text-slate-900">18ms</p>
           </Card>
           <Card className="border-none shadow-sm p-6 rounded-3xl bg-white flex flex-col items-center text-center border-2 border-green-100">
              <Globe className="h-8 w-8 text-green-500 mb-3" />
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Region: SA</p>
              <Badge className="bg-green-100 text-green-700 font-black border-none mt-1">Healthy</Badge>
           </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
           <Card className="border-none shadow-sm p-8 rounded-[40px] bg-white">
              <CardTitle className="text-xl font-black italic mb-8">Latência API (Últimas 6h)</CardTitle>
              <div className="h-[300px]">
                 <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={latencyData}>
                       <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                       <XAxis dataKey="time" tick={{fontWeight: 700}} axisLine={false} tickLine={false} />
                       <YAxis tickFormatter={(v) => `${v}ms`} tick={{fontWeight: 700}} axisLine={false} tickLine={false} />
                       <Tooltip />
                       <Area type="monotone" dataKey="ms" stroke="#3b82f6" strokeWidth={4} fillOpacity={0.1} fill="#3b82f6" />
                    </AreaChart>
                 </ResponsiveContainer>
              </div>
           </Card>

           <div className="space-y-6">
              <Card className="border-none shadow-sm p-8 rounded-[40px] bg-slate-900 text-white relative overflow-hidden h-[200px]">
                 <div className="relative z-10">
                    <p className="text-[10px] font-black uppercase text-slate-400 mb-2">Cluster Status</p>
                    <h3 className="text-2xl font-black italic">Operação Nominal</h3>
                    <p className="text-sm text-green-400 font-bold mt-4 flex items-center gap-2">
                       <Activity className="h-4 w-4" /> Sincronismo 100%
                    </p>
                 </div>
              </Card>

              <Card className="border-none shadow-sm p-8 rounded-[40px] bg-white h-[calc(100%-216px)]">
                 <CardTitle className="text-xl font-black italic mb-6">Incidentes Recentes</CardTitle>
                 <div className="flex flex-col items-center justify-center text-center h-[100px] bg-slate-50 rounded-3xl border border-dashed">
                    <ShieldCheck className="h-8 w-8 text-green-500 mb-2" />
                    <p className="text-xs font-bold text-slate-400">Nenhum incidente crítico registrado nas últimas 48h.</p>
                 </div>
              </Card>
           </div>
        </div>
      </main>
    </div>
  );
}
