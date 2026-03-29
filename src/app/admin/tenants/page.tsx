
"use client";

import { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Store, ShieldCheck, LogOut, LayoutDashboard, LayoutGrid, 
  Server, Plus, Loader2, Search, Copy, CheckCircle2, XCircle, 
  Building2, Globe, ArrowUpRight, Headphones
} from "lucide-react";
import Link from 'next/link';
import { useToast } from "@/hooks/use-toast";
import { useFirestore, useCollection, updateDocumentNonBlocking, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, doc } from 'firebase/firestore';
import { cn } from "@/lib/utils";

export default function AdminTenants() {
  const { toast } = useToast();
  const db = useFirestore();
  
  const merchantsQuery = useMemoFirebase(() => query(collection(db, 'merchants'), orderBy('createdAt', 'desc')), [db]);
  const { data: merchants, isLoading: loadingMerchants } = useCollection(merchantsQuery);

  const handleUpdateStatus = (id: string, newStatus: string) => {
    updateDocumentNonBlocking(doc(db, 'merchants', id), { status: newStatus });
    toast({ title: newStatus === 'active' ? "Instância Aprovada!" : "Instância Bloqueada" });
  };

  const copyStoreLink = (slug: string) => {
    const url = `${window.location.origin}/store/${slug}`;
    navigator.clipboard.writeText(url);
    toast({ title: "Link Copiado!" });
  };

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 font-body">
      <aside className="w-64 border-r dark:border-slate-800 bg-white dark:bg-slate-900 hidden lg:flex flex-col sticky top-0 h-screen">
        <div className="p-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-primary p-1.5 rounded-lg">
              <ShieldCheck className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-xl dark:text-white tracking-tight italic uppercase">Master Admin</span>
          </Link>
        </div>
        <nav className="flex-1 px-4 space-y-2">
          <Link href="/admin/dashboard" className="flex items-center gap-3 px-4 py-2.5 text-slate-600 dark:text-slate-400 hover:bg-slate-100 rounded-xl transition-colors font-medium"><LayoutDashboard className="h-5 w-5" /> Dashboard</Link>
          <Link href="/admin/tenants" className="flex items-center gap-3 px-4 py-2.5 bg-primary/10 text-primary rounded-xl font-bold"><LayoutGrid className="h-5 w-5" /> Gestão Multi-Tenant</Link>
          <Link href="/admin/support" className="flex items-center gap-3 px-4 py-2.5 text-slate-600 dark:text-slate-400 hover:bg-slate-100 rounded-xl transition-colors font-medium"><Headphones className="h-5 w-5" /> Chamados</Link>
        </nav>
        <div className="p-4 border-t">
          <Button variant="ghost" className="w-full justify-start text-slate-500 gap-2" asChild><Link href="/"><LogOut className="h-4 w-4" /> Sair</Link></Button>
        </div>
      </aside>

      <main className="flex-1 p-8">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter italic uppercase">Gestão de Instâncias</h1>
            <p className="text-slate-500 font-medium">Controle de ativação, auditoria e bloqueios.</p>
          </div>
        </header>

        {loadingMerchants ? (
          <div className="p-20 text-center"><Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" /></div>
        ) : (
          <Card className="border-none shadow-sm rounded-[40px] overflow-hidden bg-white dark:bg-slate-900">
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-slate-50/50 dark:bg-slate-800/50">
                  <TableRow className="dark:border-slate-800">
                    <TableHead className="px-8 h-16 font-black uppercase text-[10px]">Unidade / Merchant</TableHead>
                    <TableHead className="h-16 font-black uppercase text-[10px]">Dados Legais (CNPJ)</TableHead>
                    <TableHead className="h-16 font-black uppercase text-[10px] text-center">Status</TableHead>
                    <TableHead className="text-right px-8 h-16 font-black uppercase text-[10px]">Ações Master</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {merchants?.map((m: any) => (
                    <TableRow key={m.id} className="dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <TableCell className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-black italic">{m.name[0]}</div>
                          <div className="flex flex-col">
                            <span className="font-black text-slate-900 dark:text-white italic uppercase text-sm">{m.name}</span>
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{m.slug}.agil.com</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                         <p className="font-black text-slate-700 dark:text-slate-300 text-xs italic">{m.legal?.razaoSocial || 'N/A'}</p>
                         <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">CNPJ: {m.legal?.cnpj || 'N/A'}</p>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge className={cn(
                          "rounded-lg border-none font-black italic text-[8px] uppercase px-3 py-1",
                          m.status === 'active' ? "bg-green-100 text-green-600" : 
                          m.status === 'pending_approval' ? "bg-orange-100 text-orange-600 animate-pulse" : "bg-red-100 text-red-600"
                        )}>
                          {m.status === 'pending_approval' ? 'AGUARDANDO AUDITORIA' : m.status.toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right px-8">
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="sm" onClick={() => copyStoreLink(m.slug)} className="rounded-xl font-bold h-9 border-slate-200 dark:border-slate-800"><Globe className="h-3.5 w-3.5 mr-2" /> Link</Button>
                          {m.status === 'pending_approval' && (
                            <Button onClick={() => handleUpdateStatus(m.id, 'active')} size="sm" className="bg-green-600 hover:bg-green-700 rounded-xl h-9 px-4 font-black italic text-[10px] text-white gap-2">
                               <CheckCircle2 className="h-3.5 w-3.5" /> APROVAR
                            </Button>
                          )}
                          {m.status === 'active' && (
                            <Button onClick={() => handleUpdateStatus(m.id, 'blocked')} size="sm" variant="destructive" className="rounded-xl h-9 px-4 font-black italic text-[10px] gap-2">
                               <XCircle className="h-3.5 w-3.5" /> BLOQUEAR
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
