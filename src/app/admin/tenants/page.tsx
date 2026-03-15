
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Store, Search, Filter, ShieldCheck, LogOut, LayoutDashboard, Building2, LayoutGrid, Database, Server, MoreHorizontal } from "lucide-react";
import Link from 'next/link';
import { MOCK_MERCHANTS } from "@/lib/mock-data";

export default function AdminTenants() {
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
          <Link href="/admin/tenants" className="flex items-center gap-3 px-4 py-2.5 bg-primary/10 text-primary rounded-xl font-semibold">
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
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tighter italic">Multi-Tenancy</h1>
            <p className="text-slate-500 font-medium">Monitoramento individual de cada lojista (tenant).</p>
          </div>
          <div className="flex gap-3 w-full md:w-auto">
             <div className="relative flex-1 md:w-80">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input className="pl-12 h-12 rounded-2xl bg-white border-none shadow-sm font-medium" placeholder="Buscar por CNPJ, URL ou Nome..." />
             </div>
             <Button variant="outline" className="h-12 rounded-2xl gap-2 font-bold"><Filter className="h-4 w-4" /> Filtros</Button>
          </div>
        </header>

        <Card className="border-none shadow-sm rounded-[40px] overflow-hidden bg-white">
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow>
                  <TableHead className="px-8 h-16 font-black uppercase text-[10px] tracking-widest">Lojista / Slug</TableHead>
                  <TableHead className="h-16 font-black uppercase text-[10px] tracking-widest">Plano Atual</TableHead>
                  <TableHead className="h-16 font-black uppercase text-[10px] tracking-widest">Uso de Dados</TableHead>
                  <TableHead className="h-16 font-black uppercase text-[10px] tracking-widest">Status</TableHead>
                  <TableHead className="text-right px-8 h-16 font-black uppercase text-[10px] tracking-widest">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {MOCK_MERCHANTS.map((m) => (
                  <TableRow key={m.id} className="hover:bg-slate-50 transition-colors">
                    <TableCell className="px-8 py-6">
                       <div className="flex flex-col">
                          <span className="font-black text-slate-900 text-lg italic">{m.name}</span>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{m.slug}.mercadoagil.com</span>
                       </div>
                    </TableCell>
                    <TableCell>
                       <Badge className={`font-black italic border-none ${
                         m.plan === 'Pro' ? 'bg-purple-100 text-purple-700' : 'bg-slate-100 text-slate-600'
                       }`}>
                         {m.plan}
                       </Badge>
                    </TableCell>
                    <TableCell>
                       <div className="flex flex-col gap-1 w-24">
                          <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                             <div className="h-full bg-primary w-[45%]" />
                          </div>
                          <span className="text-[9px] font-black text-slate-400 uppercase">1.2GB / 5GB</span>
                       </div>
                    </TableCell>
                    <TableCell>
                       <div className="flex items-center gap-2">
                          <div className={`h-2 w-2 rounded-full ${m.status === 'active' ? 'bg-green-500' : 'bg-red-500'}`} />
                          <span className="font-bold text-slate-600 capitalize">{m.status}</span>
                       </div>
                    </TableCell>
                    <TableCell className="text-right px-8">
                       <Button variant="ghost" size="icon" className="rounded-xl"><MoreHorizontal className="h-5 w-5 text-slate-400" /></Button>
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
