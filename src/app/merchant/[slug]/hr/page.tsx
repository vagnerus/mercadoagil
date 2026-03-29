
"use client";

import * as React from 'react';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { 
  Users, Clock, DollarSign, Calendar, 
  LayoutDashboard, FileText, Plus, Search, 
  TrendingUp, ArrowUpRight, UserCheck, Briefcase, 
  Calculator, UserMinus, ShieldAlert, Zap
} from "lucide-react";
import Link from 'next/link';
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const staffPerformance = [
  { id: 'st1', name: 'Ricardo Barber', role: 'Sênior', shift: '09:00 - 18:00', prod: 92, payroll: 4500 },
  { id: 'st2', name: 'Ana Estética', role: 'Pleno', shift: '10:00 - 19:00', prod: 85, payroll: 3200 },
  { id: 'st3', name: 'Marcos Style', role: 'Junior', shift: '13:00 - 22:00', prod: 78, payroll: 2100 },
];

export default function MerchantHR({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = React.use(params);
  const { toast } = useToast();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSimulatePayroll = () => {
    toast({ title: "Simulação de Folha", description: "Cálculo de encargos e salários processado." });
  };

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 font-body">
      <aside className="w-64 border-r dark:border-slate-800 bg-white dark:bg-slate-900 hidden lg:flex flex-col sticky top-0 h-screen">
        <div className="p-6">
          <Link href={`/merchant/${slug}/dashboard`} className="flex items-center gap-2 font-black text-xl italic tracking-tighter text-primary uppercase">
            MERCADO ÁGIL
          </Link>
        </div>
        <nav className="flex-1 px-4 space-y-2">
          <Link href={`/merchant/${slug}/dashboard`} className="flex items-center gap-3 px-4 py-2.5 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors font-medium">
            <LayoutDashboard className="h-5 w-5" /> Início
          </Link>
          <Link href={`/merchant/${slug}/hr`} className="flex items-center gap-3 px-4 py-2.5 bg-primary/10 text-primary rounded-xl font-bold">
            <Briefcase className="h-5 w-5" /> Gestão de RH
          </Link>
          <Link href={`/merchant/${slug}/staff`} className="flex items-center gap-3 px-4 py-2.5 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors font-medium">
            <Users className="h-5 w-5" /> Equipe
          </Link>
        </nav>
      </aside>

      <main className="flex-1 p-4 lg:p-8">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter italic uppercase">Capital Humano & Payroll</h1>
            <p className="text-slate-500 font-medium">Gestão de escalas, produtividade e encargos trabalhistas.</p>
          </div>
          <div className="flex gap-2">
             <Button onClick={handleSimulatePayroll} variant="outline" className="rounded-2xl h-12 gap-2 font-black italic dark:border-slate-800">
                <Calculator className="h-4 w-4" /> Simular Folha
             </Button>
             <Button className="bg-primary text-white rounded-2xl h-12 gap-2 font-black italic shadow-xl shadow-primary/20 px-6">
                <Plus className="h-4 w-4" /> Registrar Ponto
             </Button>
          </div>
        </header>

        <div className="grid gap-6 md:grid-cols-4 mb-10">
           <Card className="border-none shadow-sm p-6 rounded-[32px] bg-white dark:bg-slate-900">
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Colaboradores On-line</p>
              <p className="text-3xl font-black italic mt-2 text-green-600">08 / 12</p>
           </Card>
           <Card className="border-none shadow-sm p-6 rounded-[32px] bg-white dark:bg-slate-900">
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Custo Operacional RH</p>
              <p className="text-3xl font-black italic mt-2 text-slate-900 dark:text-white">
                {mounted ? "R$ 18.450" : "R$ ---"}
              </p>
           </Card>
           <Card className="border-none shadow-sm p-6 rounded-[32px] bg-primary text-white relative overflow-hidden">
              <p className="text-[10px] font-black uppercase tracking-widest opacity-80">Produtividade Global</p>
              <p className="text-4xl font-black italic mt-2">84.2%</p>
              <Zap className="absolute -bottom-4 -right-4 h-24 w-24 opacity-10" />
           </Card>
           <Card className="border-none shadow-sm p-6 rounded-[32px] bg-slate-900 dark:bg-black text-white">
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Absenteísmo (Mês)</p>
              <p className="text-3xl font-black italic mt-2 text-red-400">1.2%</p>
           </Card>
        </div>

        <div className="grid gap-8 lg:grid-cols-3 mb-8">
           <Card className="lg:col-span-2 border-none shadow-sm rounded-[40px] overflow-hidden bg-white dark:bg-slate-900">
              <CardHeader className="p-8 border-b dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 flex flex-row items-center justify-between">
                 <CardTitle className="text-xl font-black italic dark:text-white">Escala & Performance</CardTitle>
                 <div className="relative w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input placeholder="Buscar colaborador..." className="pl-10 h-10 rounded-xl bg-white dark:bg-slate-800 border-none shadow-sm font-medium" />
                 </div>
              </CardHeader>
              <CardContent className="p-0">
                 <Table>
                    <TableHeader>
                       <TableRow className="dark:border-slate-800">
                          <TableHead className="px-8 h-16 font-black uppercase text-[10px]">Colaborador</TableHead>
                          <TableHead className="h-16 font-black uppercase text-[10px]">Turno Atual</TableHead>
                          <TableHead className="h-16 font-black uppercase text-[10px]">Score Prod.</TableHead>
                          <TableHead className="text-right px-8 h-16 font-black uppercase text-[10px]">Salário (Base)</TableHead>
                       </TableRow>
                    </TableHeader>
                    <TableBody>
                       {staffPerformance.map(staff => (
                         <TableRow key={staff.id} className="dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                            <TableCell className="px-8 py-6">
                               <div className="flex flex-col">
                                  <span className="font-black text-slate-900 dark:text-white text-base italic uppercase">{staff.name}</span>
                                  <span className="text-[9px] font-bold text-slate-400 uppercase">{staff.role}</span>
                               </div>
                            </TableCell>
                            <TableCell>
                               <Badge variant="outline" className="font-bold text-[10px] dark:border-slate-700">{staff.shift}</Badge>
                            </TableCell>
                            <TableCell>
                               <div className="flex items-center gap-3">
                                  <Progress value={staff.prod} className="h-1.5 w-24" />
                                  <span className="font-black text-xs text-primary">{staff.prod}%</span>
                               </div>
                            </TableCell>
                            <TableCell className="text-right px-8 font-black text-slate-900 dark:text-white italic">
                               {mounted ? `R$ ${staff.payroll.toLocaleString('pt-BR')}` : 'R$ ---'}
                            </TableCell>
                         </TableRow>
                       ))}
                    </TableBody>
                 </Table>
              </CardContent>
           </Card>

           <div className="space-y-6">
              <Card className="border-none shadow-sm rounded-[40px] p-8 bg-slate-900 text-white relative overflow-hidden">
                 <div className="relative z-10 space-y-6">
                    <UserCheck className="h-10 w-10 text-primary" />
                    <h3 className="text-2xl font-black italic tracking-tighter">Recrutamento IA</h3>
                    <p className="text-slate-400 text-xs font-medium leading-relaxed italic">"Nossa IA analisou 14 currículos para a vaga de 'Recepcionista'. 3 candidatos possuem 90% de compatibilidade cultural."</p>
                    <Button className="w-full h-14 bg-white text-slate-900 font-black italic rounded-2xl hover:bg-slate-100 transition-all">Ver Candidatos</Button>
                 </div>
              </Card>

              <Card className="border-none shadow-sm rounded-[40px] p-8 bg-white dark:bg-slate-900">
                 <CardTitle className="text-lg font-black italic mb-6 dark:text-white uppercase">Alertas de Conformidade</CardTitle>
                 <div className="space-y-4">
                    <div className="p-4 bg-orange-50 dark:bg-orange-950 rounded-2xl border border-orange-100 dark:border-orange-900 flex items-center gap-3">
                       <ShieldAlert className="h-5 w-5 text-orange-500" />
                       <p className="text-[10px] font-bold text-orange-700 dark:text-orange-300 uppercase">Exame médico 'Ricardo' vence em 5 dias</p>
                    </div>
                    <div className="p-4 bg-red-50 dark:bg-red-950 rounded-2xl border border-red-100 dark:border-red-900 flex items-center gap-3">
                       <UserMinus className="h-5 w-5 text-red-500" />
                       <p className="text-[10px] font-bold text-red-700 dark:text-red-300 uppercase">Atraso detectado: 'Marcos' (15 min)</p>
                    </div>
                 </div>
              </Card>
           </div>
        </div>
      </main>
    </div>
  );
}
