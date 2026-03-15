
"use client";

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, ClipboardList, User, FileText, Activity, ShieldCheck, LayoutDashboard } from "lucide-react";
import Link from 'next/link';

const patients = [
  { id: 'p1', name: 'João Silva', age: 42, lastConsult: '12/10/2024', status: 'Em Tratamento', risk: 'Baixo' },
  { id: 'p2', name: 'Maria Santos', age: 28, lastConsult: '15/10/2024', status: 'Alta', risk: 'Baixo' },
  { id: 'p3', name: 'Ricardo Oliveira', age: 55, lastConsult: '10/10/2024', status: 'Monitoramento', risk: 'Médio' },
];

export default function HealthPEP({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = React.use(params);

  return (
    <div className="flex min-h-screen bg-slate-50 font-body">
      <aside className="w-64 border-r bg-white hidden lg:flex flex-col sticky top-0 h-screen">
        <div className="p-6">
          <Link href={`/merchant/${slug}/dashboard`} className="flex items-center gap-2 font-black text-xl italic tracking-tighter text-primary uppercase">MERCADO ÁGIL</Link>
        </div>
        <nav className="flex-1 px-4 space-y-2">
          <Link href={`/merchant/${slug}/dashboard`} className="flex items-center gap-3 px-4 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors font-medium"><LayoutDashboard className="h-5 w-5" /> Dashboard</Link>
          <Link href={`/merchant/${slug}/health/pep`} className="flex items-center gap-3 px-4 py-2.5 bg-primary/10 text-primary rounded-xl font-bold"><ClipboardList className="h-5 w-5" /> Prontuário (PEP)</Link>
        </nav>
      </aside>

      <main className="flex-1 p-8">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tighter italic uppercase">Prontuário Eletrônico (PEP)</h1>
            <p className="text-slate-500 font-medium">Segurança total compatível com LGPD & TISS.</p>
          </div>
          <Button className="bg-primary rounded-2xl h-12 gap-2 font-black italic shadow-xl shadow-primary/20 px-8">
            <Plus className="h-5 w-5" /> Novo Paciente
          </Button>
        </header>

        <div className="grid gap-6 md:grid-cols-3 mb-10">
           <Card className="border-none shadow-sm p-8 rounded-[40px] bg-slate-900 text-white relative overflow-hidden">
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Criptografia</p>
              <div className="flex items-center gap-2 mt-2">
                 <ShieldCheck className="h-6 w-6 text-primary" />
                 <p className="text-2xl font-black italic">AES-256 ACTIVE</p>
              </div>
           </Card>
           <Card className="border-none shadow-sm p-8 rounded-[40px] bg-white">
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Faturamento Convênios</p>
              <p className="text-3xl font-black italic mt-2 text-slate-900">R$ 42.150</p>
           </Card>
           <Card className="border-none shadow-sm p-8 rounded-[40px] bg-white">
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Prescrições Digitais</p>
              <p className="text-3xl font-black italic mt-2 text-slate-900">142</p>
           </Card>
        </div>

        <Card className="border-none shadow-sm rounded-[40px] overflow-hidden bg-white">
          <CardHeader className="p-8 border-b bg-slate-50/50 flex flex-row items-center justify-between">
            <div className="flex items-center gap-4">
               <CardTitle className="text-xl font-black italic">Base de Pacientes</CardTitle>
               <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input placeholder="Buscar por Nome, CPF ou ID..." className="pl-10 h-12 w-80 rounded-2xl bg-white border-none shadow-sm font-medium" />
               </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-slate-50/30">
                <TableRow>
                  <TableHead className="px-8 h-16 font-black uppercase text-[10px] tracking-widest">Paciente</TableHead>
                  <TableHead className="h-16 font-black uppercase text-[10px] tracking-widest">Idade</TableHead>
                  <TableHead className="h-16 font-black uppercase text-[10px] tracking-widest">Última Consulta</TableHead>
                  <TableHead className="h-16 font-black uppercase text-[10px] tracking-widest text-center">Risco IA</TableHead>
                  <TableHead className="text-right px-8 h-16 font-black uppercase text-[10px] tracking-widest">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {patients.map((p) => (
                  <TableRow key={p.id} className="hover:bg-slate-50 transition-colors">
                    <TableCell className="px-8 py-6">
                       <div className="flex items-center gap-4">
                          <div className="h-12 w-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400">
                             <User className="h-6 w-6" />
                          </div>
                          <div className="flex flex-col">
                             <span className="font-black text-slate-900 text-base">{p.name}</span>
                             <span className="text-[9px] font-bold text-slate-400 uppercase">{p.status}</span>
                          </div>
                       </div>
                    </TableCell>
                    <TableCell className="font-bold text-slate-600">{p.age} anos</TableCell>
                    <TableCell className="font-bold text-slate-600">{p.lastConsult}</TableCell>
                    <TableCell className="text-center">
                       <Badge className={`rounded-lg border-none px-3 font-black text-[9px] uppercase ${p.risk === 'Médio' ? 'bg-orange-100 text-orange-600' : 'bg-green-100 text-green-600'}`}>
                          {p.risk}
                       </Badge>
                    </TableCell>
                    <TableCell className="text-right px-8">
                       <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" className="rounded-xl text-primary"><FileText className="h-4 w-4" /></Button>
                          <Button variant="ghost" size="icon" className="rounded-xl text-slate-400"><Activity className="h-4 w-4" /></Button>
                       </div>
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
