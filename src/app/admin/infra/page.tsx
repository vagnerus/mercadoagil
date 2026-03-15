
"use client";

import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Server, Activity, Globe, ShieldCheck, LogOut, LayoutDashboard, 
  Building2, LayoutGrid, Database, Zap, Cpu, HardDrive, RefreshCw, 
  ShieldAlert, Fingerprint, Network, Lock, Cloud, Radio, Share2
} from "lucide-react";
import Link from 'next/link';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const latencyData = [
  { time: '10:00', ms: 14, errors: 0 },
  { time: '11:00', ms: 16, errors: 1 },
  { time: '12:00', ms: 22, errors: 0 },
  { time: '13:00', ms: 18, errors: 0 },
  { time: '14:00', ms: 15, errors: 2 },
  { time: '15:00', ms: 14, errors: 0 },
];

const clusterData = [
  { name: 'Cluster-SA', load: 12, storage: 45 },
  { name: 'Cluster-US', load: 8, storage: 30 },
  { name: 'Cluster-EU', load: 15, storage: 25 },
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
            <LayoutDashboard className="h-5 w-5" /> Global Dashboard
          </Link>
          <Link href="/admin/infra" className="flex items-center gap-3 px-4 py-2.5 bg-primary/10 text-primary rounded-xl font-semibold">
            <Server className="h-5 w-5" /> Infraestrutura Cloud
          </Link>
        </nav>
        <div className="p-4 border-t">
          <Button variant="ghost" className="w-full justify-start text-slate-500 gap-2 hover:text-red-500" asChild>
            <Link href="/"><LogOut className="h-4 w-4" /> Sair</Link>
          </Button>
        </div>
      </aside>

      <main className="flex-1 p-8 overflow-y-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tighter italic uppercase">Infraestrutura Global SaaS</h1>
            <p className="text-slate-500 font-medium">Monitoramento de clusters regionais, latência e segurança de dados.</p>
          </div>
          <div className="flex gap-2">
             <Button variant="outline" className="rounded-2xl h-12 gap-2 font-black italic border-red-200 text-red-500 hover:bg-red-50">
                <ShieldAlert className="h-4 w-4" /> Emergency Shutdown
             </Button>
             <Button className="bg-primary rounded-2xl h-12 gap-2 font-black italic shadow-xl shadow-primary/20">
                <RefreshCw className="h-4 w-4" /> Flush Cache & CDN
             </Button>
          </div>
        </header>

        <div className="grid gap-6 md:grid-cols-4 mb-8">
           <Card className="border-none shadow-sm p-6 rounded-3xl bg-white flex flex-col items-center text-center">
              <Cpu className="h-8 w-8 text-blue-500 mb-3" />
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">CPU MASTER LOAD</p>
              <p className="text-2xl font-black italic text-slate-900">12.4%</p>
           </Card>
           <Card className="border-none shadow-sm p-6 rounded-3xl bg-red-50 flex flex-col items-center text-center border border-red-100">
              <ShieldAlert className="h-8 w-8 text-red-500 mb-3" />
              <p className="text-[10px] font-black uppercase text-red-400 tracking-widest">ATTACKS BLOCKED</p>
              <p className="text-2xl font-black italic text-red-900">1.2k</p>
           </Card>
           <Card className="border-none shadow-sm p-6 rounded-3xl bg-white flex flex-col items-center text-center">
              <Zap className="h-8 w-8 text-yellow-500 mb-3" />
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">GLOBAL LATENCY</p>
              <p className="text-2xl font-black italic text-slate-900">18ms</p>
           </Card>
           <Card className="border-none shadow-sm p-6 rounded-3xl bg-white flex flex-col items-center text-center border-2 border-green-100">
              <Globe className="h-8 w-8 text-green-500 mb-3" />
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">CDN STATUS</p>
              <Badge className="bg-green-100 text-green-700 font-black border-none mt-1">HEALTHY</Badge>
           </Card>
        </div>

        <div className="grid gap-8 lg:grid-cols-2 mb-8">
           <Card className="border-none shadow-sm p-8 rounded-[40px] bg-white">
              <CardTitle className="text-xl font-black italic mb-8">API Latency & Health (Real-time)</CardTitle>
              <div className="h-[300px]">
                 <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={latencyData}>
                       <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                       <XAxis dataKey="time" tick={{fontWeight: 700, fontSize: 10}} axisLine={false} tickLine={false} />
                       <YAxis tickFormatter={(v) => `${v}ms`} tick={{fontWeight: 700, fontSize: 10}} axisLine={false} tickLine={false} />
                       <Tooltip contentStyle={{borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)'}} />
                       <Area type="monotone" dataKey="ms" stroke="#3b82f6" strokeWidth={4} fillOpacity={0.1} fill="#3b82f6" />
                       <Area type="monotone" dataKey="errors" stroke="#ef4444" strokeWidth={2} fillOpacity={0.1} fill="#ef4444" />
                    </AreaChart>
                 </ResponsiveContainer>
              </div>
           </Card>

           <Card className="border-none shadow-sm p-8 rounded-[40px] bg-white">
              <CardTitle className="text-xl font-black italic mb-8">Cluster Distribution (Resource Usage)</CardTitle>
              <div className="h-[300px]">
                 <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={clusterData}>
                       <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                       <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontWeight: 700, fontSize: 10}} />
                       <YAxis axisLine={false} tickLine={false} tick={{fontWeight: 700, fontSize: 10}} />
                       <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '20px', border: 'none'}} />
                       <Bar dataKey="load" name="CPU Load" fill="#3b82f6" radius={[10, 10, 0, 0]} />
                       <Bar dataKey="storage" name="Storage (%)" fill="#8b5cf6" radius={[10, 10, 0, 0]} />
                    </BarChart>
                 </ResponsiveContainer>
              </div>
           </Card>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
           <div className="lg:col-span-2 space-y-6">
              <Card className="border-none shadow-sm rounded-[40px] p-8 bg-slate-900 text-white relative overflow-hidden">
                 <div className="flex items-center justify-between mb-8 relative z-10">
                    <CardTitle className="text-xl font-black italic">Security Hub & Fraud Control</CardTitle>
                    <Badge className="bg-primary/20 text-primary border-none font-black italic">ACTIVE SHIELD</Badge>
                 </div>
                 <div className="grid md:grid-cols-2 gap-8 relative z-10">
                    <div className="p-6 bg-white/5 rounded-3xl border border-white/10 space-y-4">
                       <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400">
                             <Lock className="h-5 w-5" />
                          </div>
                          <p className="font-black italic text-sm">SSL Governance</p>
                       </div>
                       <p className="text-xs text-slate-400 leading-relaxed font-medium">
                          Monitorando 542 certificados SSL. Renovação automática ativada em 100% das instâncias lojistas.
                       </p>
                    </div>
                    <div className="p-6 bg-white/5 rounded-3xl border border-white/10 space-y-4">
                       <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-xl bg-orange-500/20 flex items-center justify-center text-orange-400">
                             <Fingerprint className="h-5 w-5" />
                          </div>
                          <p className="font-black italic text-sm">AI Fraud Scanner</p>
                       </div>
                       <p className="text-xs text-slate-400 leading-relaxed font-medium">
                          Padrões de hardware identificados. 0 transações suspeitas detectadas nos últimos 60 minutos.
                       </p>
                    </div>
                 </div>
                 <ShieldCheck className="absolute -bottom-10 -right-10 h-40 w-40 opacity-5" />
              </Card>
           </div>

           <Card className="border-none shadow-sm p-8 rounded-[40px] bg-white">
              <CardTitle className="text-xl font-black italic mb-6">Service Health Queue</CardTitle>
              <div className="space-y-4">
                 {[
                   { name: 'Auth Server', status: 'Stable', color: 'text-green-500', icon: Radio },
                   { name: 'Asset Delivery', status: 'Optimal', color: 'text-green-500', icon: Share2 },
                   { name: 'Payment Webhook', status: 'Stable', color: 'text-green-500', icon: Network },
                   { name: 'Email Gateway', status: 'Degraded', color: 'text-orange-500', icon: Cloud },
                 ].map(service => (
                   <div key={service.name} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                      <div className="flex items-center gap-3">
                         <service.icon className="h-4 w-4 text-slate-400" />
                         <span className="font-bold text-xs text-slate-700">{service.name}</span>
                      </div>
                      <span className={`font-black text-[10px] uppercase ${service.color}`}>{service.status}</span>
                   </div>
                 ))}
              </div>
           </Card>
        </div>
      </main>
    </div>
  );
}
