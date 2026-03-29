
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Building2, Plus, TrendingUp, Users, LogOut, ShieldCheck, LayoutDashboard, LayoutGrid, Database, Server } from "lucide-react";
import Link from 'next/link';

const franchiseGroups = [
  { id: 'fg1', name: 'Rede Burger', units: 12, rev: 450000, growth: '+12%', owner: 'Carlos Alberto' },
  { id: 'fg2', name: 'Italian Foods', units: 8, rev: 320000, growth: '+8%', owner: 'Maria Julia' },
  { id: 'fg3', name: 'Pastel & Cia', units: 4, rev: 95000, growth: '-2%', owner: 'Fernando Lima' },
];

export default function AdminFranchises() {
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
          <Link href="/admin/franchises" className="flex items-center gap-3 px-4 py-2.5 bg-primary/10 text-primary rounded-xl font-semibold">
            <Building2 className="h-5 w-5" /> Gestão de Franquias
          </Link>
          <Link href="/admin/tenants" className="flex items-center gap-3 px-4 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors font-medium">
            <LayoutGrid className="h-5 w-5" /> Multi-Tenancy
          </Link>
          <Link href="/admin/audit" className="flex items-center gap-3 px-4 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors font-medium">
            <Database className="h-5 w-5" /> Auditoria SaaS
          </Link>
          <Link href="/admin/infra" className="flex items-center gap-3 px-4 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors font-medium">
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
            <h1 className="text-3xl font-black text-slate-900 tracking-tighter italic uppercase">Gestão de Franquias</h1>
            <p className="text-slate-500 font-medium">Controle de grupos e redes multi-unitarias.</p>
          </div>
          <Button className="bg-slate-900 rounded-2xl h-12 gap-2 font-bold shadow-xl shadow-slate-200 text-white">
            <Plus className="h-4 w-4" /> Nova Rede
          </Button>
        </header>

        <div className="grid gap-6 md:grid-cols-3 mb-8">
           <Card className="border-none shadow-sm p-8 rounded-[40px] bg-blue-600 text-white">
              <p className="text-[10px] font-black uppercase tracking-widest text-blue-100">Total Unidades</p>
              <p className="text-4xl font-black italic mt-2 tracking-tighter">142</p>
           </Card>
           <Card className="border-none shadow-sm p-8 rounded-[40px] bg-white">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Faturamento Médio Rede</p>
              <p className="text-3xl font-black italic mt-2 tracking-tighter text-slate-900">R$ 285.000</p>
           </Card>
           <Card className="border-none shadow-sm p-8 rounded-[40px] bg-white">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">NPS Global Franquias</p>
              <div className="flex items-center gap-3 mt-2">
                 <p className="text-3xl font-black italic tracking-tighter text-slate-900">4.8</p>
                 <Badge className="bg-green-100 text-green-700 font-black border-none">Excelente</Badge>
              </div>
           </Card>
        </div>

        <Card className="border-none shadow-sm rounded-[40px] overflow-hidden bg-white">
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow>
                  <TableHead className="px-8 h-16 font-black uppercase text-[10px] tracking-widest">Grupo de Franquia</TableHead>
                  <TableHead className="h-16 font-black uppercase text-[10px] tracking-widest">Unidades Ativas</TableHead>
                  <TableHead className="h-16 font-black uppercase text-[10px] tracking-widest">Responsável</TableHead>
                  <TableHead className="h-16 font-black uppercase text-[10px] tracking-widest">Crescimento</TableHead>
                  <TableHead className="text-right px-8 h-16 font-black uppercase text-[10px] tracking-widest">Faturamento Anual</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {franchiseGroups.map((group) => (
                  <TableRow key={group.id}>
                    <TableCell className="px-8 py-6">
                       <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center">
                             <Building2 className="h-5 w-5 text-blue-600" />
                          </div>
                          <span className="font-black text-slate-900 text-lg italic uppercase">{group.name}</span>
                       </div>
                    </TableCell>
                    <TableCell>
                       <Badge variant="secondary" className="font-black rounded-lg">{group.units} Lojas</Badge>
                    </TableCell>
                    <TableCell className="font-bold text-slate-500">{group.owner}</TableCell>
                    <TableCell>
                       <span className={`font-black italic ${group.growth.startsWith('+') ? 'text-green-600' : 'text-red-500'}`}>
                          {group.growth}
                       </span>
                    </TableCell>
                    <TableCell className="text-right px-8 font-black text-primary italic">R$ {group.rev.toLocaleString()}</TableCell>
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
