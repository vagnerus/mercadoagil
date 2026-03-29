
"use client";

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Globe, ShoppingBag, TrendingUp, ShieldCheck, 
  LogOut, LayoutDashboard, LayoutGrid, Server, 
  Plus, Search, Star, ExternalLink, Settings,
  Zap, Headphones
} from "lucide-react";
import Link from 'next/link';
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const marketplaceStores = [
  { id: 'm1', name: 'Barbearia do Zé', slug: 'barbearia-ze', segment: 'Beleza', status: 'Featured', sales: 450 },
  { id: 'm2', name: 'Burger King do Porto', slug: 'bk-porto', segment: 'Restaurante', status: 'Active', sales: 1200 },
  { id: 'm3', name: 'Clínica Saúde Total', slug: 'saude-total', segment: 'Saúde', status: 'Verified', sales: 85 },
];

export default function AdminMarketplace() {
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
          <Link href="/admin/marketplace" className="flex items-center gap-3 px-4 py-2.5 bg-primary/10 text-primary rounded-xl font-bold">
            <Globe className="h-5 w-5" /> Marketplace Global
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
            <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter italic uppercase">Marketplace Control Center</h1>
            <p className="text-slate-500 font-medium">Gestão da vitrine global unificada para todos os lojistas.</p>
          </div>
          <div className="flex gap-2">
             <Button variant="outline" className="rounded-2xl h-12 gap-2 font-black italic border-primary/20 text-primary hover:bg-primary/5">
                <Settings className="h-4 w-4" /> Regras de Comissão
             </Button>
             <Button className="bg-primary text-white rounded-2xl h-12 gap-2 font-black italic shadow-xl shadow-primary/20 px-8">
                <Zap className="h-4 w-4" /> Campanha Global
             </Button>
          </div>
        </header>

        <div className="grid gap-6 md:grid-cols-4 mb-10">
           <Card className="border-none shadow-sm p-6 rounded-[32px] bg-white dark:bg-slate-900">
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Volume GMV (Marketplace)</p>
              <p className="text-3xl font-black italic mt-2 text-slate-900 dark:text-white">R$ 1.2M</p>
           </Card>
           <Card className="border-none shadow-sm p-6 rounded-[32px] bg-white dark:bg-slate-900">
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Taxa de Conversão Hub</p>
              <p className="text-3xl font-black italic mt-2 text-primary">4.8%</p>
           </Card>
           <Card className="border-none shadow-sm p-6 rounded-[32px] bg-slate-900 dark:bg-black text-white relative overflow-hidden">
              <p className="text-[10px] font-black uppercase tracking-widest opacity-80">Lojas em Destaque</p>
              <p className="text-4xl font-black italic mt-2">12</p>
              <Star className="absolute -bottom-4 -right-4 h-24 w-24 opacity-10" />
           </Card>
           <Card className="border-none shadow-sm p-6 rounded-[32px] bg-white dark:bg-slate-900">
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Tráfego Global (24h)</p>
              <p className="text-3xl font-black italic mt-2 text-slate-900 dark:text-white">124k</p>
           </Card>
        </div>

        <Card className="border-none shadow-sm rounded-[40px] overflow-hidden bg-white dark:bg-slate-900">
          <CardHeader className="p-8 border-b dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 flex flex-row items-center justify-between">
            <div className="flex items-center gap-4">
               <CardTitle className="text-xl font-black italic dark:text-white">Gerenciador de Visibilidade</CardTitle>
               <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input placeholder="Filtrar por nome ou segmento..." className="pl-10 h-12 w-80 rounded-2xl bg-white dark:bg-slate-800 border-none shadow-sm font-medium" />
               </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="dark:border-slate-800">
                  <TableHead className="px-8 h-16 font-black uppercase text-[10px] tracking-widest">Loja / Merchant</TableHead>
                  <TableHead className="h-16 font-black uppercase text-[10px] tracking-widest">Segmento</TableHead>
                  <TableHead className="h-16 font-black uppercase text-[10px] tracking-widest text-center">Status Hub</TableHead>
                  <TableHead className="h-16 font-black uppercase text-[10px] tracking-widest text-center">Vendas Hub</TableHead>
                  <TableHead className="text-right px-8 h-16 font-black uppercase text-[10px] tracking-widest">Ações Master</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {marketplaceStores.map(store => (
                  <TableRow key={store.id} className="dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <TableCell className="px-8 py-6">
                       <div className="flex items-center gap-4">
                          <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                             <ShoppingBag className="h-6 w-6" />
                          </div>
                          <div className="flex flex-col">
                             <span className="font-black text-slate-900 dark:text-white text-base italic uppercase">{store.name}</span>
                             <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{store.slug}.agil.com</span>
                          </div>
                       </div>
                    </TableCell>
                    <TableCell className="font-bold text-slate-500 italic">{store.segment}</TableCell>
                    <TableCell className="text-center">
                       <Badge className={cn(
                         "rounded-lg border-none px-3 font-black text-[9px] uppercase",
                         store.status === 'Featured' ? "bg-yellow-100 text-yellow-700" : 
                         store.status === 'Verified' ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-600"
                       )}>
                          {store.status}
                       </Badge>
                    </TableCell>
                    <TableCell className="text-center font-black text-slate-900 dark:text-white">{store.sales}</TableCell>
                    <TableCell className="text-right px-8">
                       <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" className="rounded-xl text-primary"><TrendingUp className="h-4 w-4" /></Button>
                          <Button variant="ghost" size="icon" className="rounded-xl text-slate-400" asChild>
                             <Link href={`/store/${store.slug}`} target="_blank"><ExternalLink className="h-4 w-4" /></Link>
                          </Button>
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
