
"use client";

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Wallet, DollarSign, ArrowUpRight, TrendingUp, 
  LogOut, ShieldCheck, LayoutDashboard, LayoutGrid, 
  Server, Download, Calendar, Search, CreditCard,
  Zap, PieChart, Activity, Headphones
} from "lucide-react";
import Link from 'next/link';
import { Input } from "@/components/ui/input";

const billingLogs = [
  { id: 'tx1', store: 'Barbearia do Zé', plan: 'Pro', status: 'Paid', value: 150.00, date: '2024-03-20' },
  { id: 'tx2', store: 'BK do Porto', plan: 'Pro II', status: 'Paid', value: 300.00, date: '2024-03-19' },
  { id: 'tx3', store: 'Clínica Vida', plan: 'Pro', status: 'Pending', value: 150.00, date: '2024-03-18' },
];

export default function AdminBilling() {
  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 font-body">
      <aside className="w-64 border-r dark:border-slate-800 bg-white dark:bg-slate-900 hidden lg:flex flex-col sticky top-0 h-screen">
        <div className="p-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-primary p-1.5 rounded-lg shadow-sm">
              <ShieldCheck className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-xl text-slate-800 dark:text-white tracking-tight italic uppercase">Master Admin</span>
          </Link>
        </div>
        <nav className="flex-1 px-4 space-y-2">
          <Link href="/admin/dashboard" className="flex items-center gap-3 px-4 py-2.5 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors font-medium">
            <LayoutDashboard className="h-5 w-5" /> Dashboard
          </Link>
          <Link href="/admin/billing" className="flex items-center gap-3 px-4 py-2.5 bg-primary/10 text-primary rounded-xl font-bold">
            <DollarSign className="h-5 w-5" /> Faturamento SaaS
          </Link>
          <Link href="/admin/tenants" className="flex items-center gap-3 px-4 py-2.5 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors font-medium">
            <LayoutGrid className="h-5 w-5" /> Multi-Tenancy
          </Link>
          <Link href="/admin/support" className="flex items-center gap-3 px-4 py-2.5 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors font-medium">
            <Headphones className="h-5 w-5" /> Suporte Global
          </Link>
        </nav>
        <div className="p-4 border-t dark:border-slate-800">
          <Button variant="ghost" className="w-full justify-start text-slate-500 gap-2 hover:text-red-500" asChild>
            <Link href="/"><LogOut className="h-4 w-4" /> Sair</Link>
          </Button>
        </div>
      </aside>

      <main className="flex-1 p-8">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter italic uppercase">SaaS Financial Command</h1>
            <p className="text-slate-500 font-medium">Monitoramento global de MRR, Churn e faturamento direto.</p>
          </div>
          <div className="flex gap-2">
             <Button variant="outline" className="rounded-2xl h-12 gap-2 font-black italic dark:border-slate-800">
                <Calendar className="h-4 w-4" /> Março 2024
             </Button>
             <Button className="bg-primary text-white rounded-2xl h-12 gap-2 font-black italic shadow-xl shadow-primary/20 px-8">
                <Download className="h-4 w-4" /> Relatório DRE
             </Button>
          </div>
        </header>

        <div className="grid gap-6 md:grid-cols-4 mb-10">
           <Card className="border-none shadow-sm p-6 rounded-[32px] bg-primary text-white relative overflow-hidden">
              <p className="text-[10px] font-black uppercase tracking-widest opacity-80">MRR (Recorrência Mensal)</p>
              <p className="text-4xl font-black italic mt-2">R$ 48.250</p>
              <TrendingUp className="absolute -bottom-4 -right-4 h-24 w-24 opacity-10" />
           </Card>
           <Card className="border-none shadow-sm p-6 rounded-[32px] bg-white dark:bg-slate-900">
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">ARPU Médio</p>
              <p className="text-3xl font-black italic mt-2 text-slate-900 dark:text-white">R$ 185,00</p>
           </Card>
           <Card className="border-none shadow-sm p-6 rounded-[32px] bg-white dark:bg-slate-900">
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Churn Rate IA</p>
              <p className="text-3xl font-black italic mt-2 text-red-500">1.4%</p>
           </Card>
           <Card className="border-none shadow-sm p-6 rounded-[32px] bg-slate-900 dark:bg-black text-white">
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Inadimplência Global</p>
              <p className="text-3xl font-black italic mt-2 text-orange-400">2.8%</p>
           </Card>
        </div>

        <Card className="border-none shadow-sm rounded-[40px] overflow-hidden bg-white dark:bg-slate-900">
          <CardHeader className="p-8 border-b dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 flex flex-row items-center justify-between">
            <div className="flex items-center gap-4">
               <CardTitle className="text-xl font-black italic dark:text-white">Histórico de Cobranças SaaS</CardTitle>
               <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input placeholder="Buscar por loja ou fatura..." className="pl-10 h-12 w-80 rounded-2xl bg-white dark:bg-slate-800 border-none shadow-sm font-medium" />
               </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="dark:border-slate-800">
                  <TableHead className="px-8 h-16 font-black uppercase text-[10px] tracking-widest">Store / Tenant</TableHead>
                  <TableHead className="h-16 font-black uppercase text-[10px] tracking-widest">Plano</TableHead>
                  <TableHead className="h-16 font-black uppercase text-[10px] tracking-widest text-center">Status Pagto</TableHead>
                  <TableHead className="h-16 font-black uppercase text-[10px] tracking-widest text-center">Data</TableHead>
                  <TableHead className="text-right px-8 h-16 font-black uppercase text-[10px] tracking-widest">Valor Mensal</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {billingLogs.map(log => (
                  <TableRow key={log.id} className="dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <TableCell className="px-8 py-6">
                       <span className="font-black text-slate-900 dark:text-white text-base italic uppercase">{log.store}</span>
                    </TableCell>
                    <TableCell className="font-bold text-slate-500 italic">{log.plan}</TableCell>
                    <TableCell className="text-center">
                       <Badge className={cn(
                         "rounded-lg border-none px-3 font-black text-[9px] uppercase",
                         log.status === 'Paid' ? "bg-green-100 text-green-600" : "bg-orange-100 text-orange-600"
                       )}>
                          {log.status === 'Paid' ? 'LIQUIDADO' : 'PENDENTE'}
                       </Badge>
                    </TableCell>
                    <TableCell className="text-center font-bold text-slate-400 tabular-nums">{log.date}</TableCell>
                    <TableCell className="text-right px-8 font-black text-primary italic">R$ {log.value.toFixed(2)}</TableCell>
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
