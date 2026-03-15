
"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Database, Download, ShieldCheck, LogOut, LayoutDashboard, Building2, LayoutGrid, Server, History, AlertCircle } from "lucide-react";
import Link from 'next/link';

const auditLogs = [
  { id: 'ad1', user: 'admin@mercadoagil.com', action: 'Bloqueio de Tenant', target: 'pizza-ruim', date: '2024-03-21 14:20', severity: 'high' },
  { id: 'ad2', user: 'system', action: 'Backup Concluído', target: 'Region: SA-East-1', date: '2024-03-21 04:00', severity: 'low' },
  { id: 'ad3', user: 'ana.gerente@burger.com', action: 'Update Plano', target: 'burger-ze', date: '2024-03-20 18:45', severity: 'medium' },
  { id: 'ad4', user: 'admin@mercadoagil.com', action: 'Login Global', target: 'Master Console', date: '2024-03-20 10:15', severity: 'low' },
];

export default function AdminAudit() {
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
          <Link href="/admin/audit" className="flex items-center gap-3 px-4 py-2.5 bg-primary/10 text-primary rounded-xl font-semibold">
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
            <h1 className="text-3xl font-black text-slate-900 tracking-tighter italic">Logs de Auditoria</h1>
            <p className="text-slate-500 font-medium">Registro histórico de todas as ações administrativas.</p>
          </div>
          <Button variant="outline" className="h-12 rounded-2xl gap-2 font-bold"><Download className="h-4 w-4" /> Exportar CSV</Button>
        </header>

        <Card className="border-none shadow-sm rounded-[40px] overflow-hidden bg-white">
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow>
                  <TableHead className="px-8 h-16 font-black uppercase text-[10px] tracking-widest">Usuário</TableHead>
                  <TableHead className="h-16 font-black uppercase text-[10px] tracking-widest">Ação</TableHead>
                  <TableHead className="h-16 font-black uppercase text-[10px] tracking-widest">Target</TableHead>
                  <TableHead className="h-16 font-black uppercase text-[10px] tracking-widest">Severidade</TableHead>
                  <TableHead className="text-right px-8 h-16 font-black uppercase text-[10px] tracking-widest">Timestamp</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {auditLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="px-8 py-6 font-bold text-slate-600">{log.user}</TableCell>
                    <TableCell className="font-black text-slate-900 italic uppercase text-xs">{log.action}</TableCell>
                    <TableCell className="font-medium text-slate-500">{log.target}</TableCell>
                    <TableCell>
                       <Badge className={`rounded-lg font-black uppercase text-[8px] border-none ${
                         log.severity === 'high' ? 'bg-red-100 text-red-600' : 
                         log.severity === 'medium' ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'
                       }`}>
                         {log.severity}
                       </Badge>
                    </TableCell>
                    <TableCell className="text-right px-8 font-bold text-slate-400 tabular-nums">{log.date}</TableCell>
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
