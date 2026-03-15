
"use client";

import * as React from 'react';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Package, AlertTriangle, TrendingDown, ArrowUpDown, Search, Plus, Filter, Download, History, Database, Layers } from "lucide-react";
import Link from 'next/link';
import { MOCK_PRODUCTS } from "@/lib/mock-data";

export default function MerchantInventory({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = React.use(params);
  const lowStockItems = MOCK_PRODUCTS.filter(p => (p.stock || 0) <= (p.minStock || 0));

  return (
    <div className="flex min-h-screen bg-slate-50 font-body">
      <aside className="w-64 border-r bg-white hidden lg:flex flex-col">
        <div className="p-6">
          <Link href="/" className="flex items-center gap-2 font-black text-xl italic tracking-tighter text-primary">
            MERCADO ÁGIL
          </Link>
        </div>
        <nav className="flex-1 px-4 space-y-2">
          <Link href={`/merchant/${slug}/dashboard`} className="flex items-center gap-3 px-4 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors font-medium">
            <Package className="h-5 w-5" /> Dashboard
          </Link>
          <Link href={`/merchant/${slug}/inventory`} className="flex items-center gap-3 px-4 py-2.5 bg-primary/10 text-primary rounded-xl font-bold">
            <Database className="h-5 w-5" /> Inventário Pro
          </Link>
          <Link href={`/merchant/${slug}/catalog`} className="flex items-center gap-3 px-4 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors font-medium">
            <Layers className="h-5 w-5" /> Catálogo
          </Link>
        </nav>
      </aside>

      <main className="flex-1 p-8">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tighter italic uppercase">Gestão de Estoque Enterprise</h1>
            <p className="text-slate-500 font-medium">Controle de lotes, variações e alertas críticos de ruptura.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="rounded-2xl h-12 gap-2 font-bold"><Download className="h-4 w-4" /> Exportar CSV</Button>
            <Button className="bg-slate-900 rounded-2xl h-12 gap-2 font-bold"><Plus className="h-4 w-4" /> Entrada de Lote</Button>
          </div>
        </header>

        <div className="grid gap-6 md:grid-cols-4 mb-10">
           <Card className="border-none shadow-sm p-6 rounded-[32px] bg-red-500 text-white relative overflow-hidden">
              <p className="text-[10px] font-black uppercase tracking-widest opacity-80">Ruptura de Estoque</p>
              <p className="text-4xl font-black italic mt-2">{lowStockItems.length}</p>
              <AlertTriangle className="absolute -bottom-4 -right-4 h-24 w-24 opacity-10" />
           </Card>
           <Card className="border-none shadow-sm p-6 rounded-[32px] bg-white">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Valor Total Imobilizado</p>
              <p className="text-3xl font-black italic mt-2 text-slate-900">R$ 145.200</p>
           </Card>
           <Card className="border-none shadow-sm p-6 rounded-[32px] bg-white">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Giro de Estoque (Mês)</p>
              <div className="flex items-center gap-3 mt-2">
                 <p className="text-3xl font-black italic text-slate-900">4.2x</p>
                 <Badge className="bg-green-100 text-green-700 font-black border-none">Otimizado</Badge>
              </div>
           </Card>
           <Card className="border-none shadow-sm p-6 rounded-[32px] bg-white">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Previsão AI Abastecimento</p>
              <p className="text-3xl font-black italic mt-2 text-primary">04 Out</p>
           </Card>
        </div>

        <Card className="border-none shadow-sm rounded-[40px] overflow-hidden bg-white">
          <CardHeader className="p-8 border-b bg-slate-50/50 flex flex-row items-center justify-between">
            <div className="flex items-center gap-4">
               <CardTitle className="text-xl font-black italic">Controle de Itens</CardTitle>
               <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input placeholder="Buscar SKU ou Produto..." className="pl-10 h-10 w-64 rounded-xl bg-white border-none shadow-sm font-medium" />
               </div>
            </div>
            <Button variant="ghost" size="icon" className="rounded-xl"><Filter className="h-5 w-5 text-slate-400" /></Button>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-slate-50/30">
                <TableRow>
                  <TableHead className="px-8 h-16 font-black uppercase text-[10px] tracking-widest">Produto / SKU</TableHead>
                  <TableHead className="h-16 font-black uppercase text-[10px] tracking-widest">Categoria</TableHead>
                  <TableHead className="h-16 font-black uppercase text-[10px] tracking-widest text-center">Disponível</TableHead>
                  <TableHead className="h-16 font-black uppercase text-[10px] tracking-widest text-center">Status</TableHead>
                  <TableHead className="text-right px-8 h-16 font-black uppercase text-[10px] tracking-widest">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {MOCK_PRODUCTS.map((p) => (
                  <TableRow key={p.id} className="hover:bg-slate-50 transition-colors">
                    <TableCell className="px-8 py-6">
                       <div className="flex items-center gap-4">
                          <div className="h-12 w-12 rounded-xl bg-slate-100 overflow-hidden">
                             <img src={p.imageUrl} className="h-full w-full object-cover" />
                          </div>
                          <div className="flex flex-col">
                             <span className="font-black text-slate-900 text-base">{p.name}</span>
                             <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">SKU: {p.id.toUpperCase()}</span>
                          </div>
                       </div>
                    </TableCell>
                    <TableCell className="font-bold text-slate-500">Alimentos</TableCell>
                    <TableCell className="text-center font-black text-slate-900 text-lg">{p.stock}</TableCell>
                    <TableCell className="text-center">
                       <Badge className={`rounded-lg border-none px-3 font-black text-[9px] uppercase ${
                         (p.stock || 0) <= (p.minStock || 0) ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
                       }`}>
                         {(p.stock || 0) <= (p.minStock || 0) ? 'Crítico' : 'Saudável'}
                       </Badge>
                    </TableCell>
                    <TableCell className="text-right px-8">
                       <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" className="rounded-xl"><History className="h-4 w-4 text-slate-400" /></Button>
                          <Button variant="ghost" size="icon" className="rounded-xl"><ArrowUpDown className="h-4 w-4 text-slate-400" /></Button>
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
