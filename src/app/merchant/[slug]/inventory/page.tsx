
"use client";

import * as React from 'react';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Package, AlertTriangle, TrendingDown, ArrowUpDown, Search, 
  Plus, Filter, Download, History, Database, Layers, 
  QrCode, Warehouse, Truck, RefreshCw, Barcode
} from "lucide-react";
import Link from 'next/link';
import { MOCK_PRODUCTS } from "@/lib/mock-data";

export default function MerchantInventory({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = React.use(params);
  const [warehouse, setWarehouse] = useState("principal");
  const lowStockItems = MOCK_PRODUCTS.filter(p => (p.stock || 0) <= (p.minStock || 0));

  return (
    <div className="flex min-h-screen bg-slate-50 font-body">
      <aside className="w-64 border-r bg-white hidden lg:flex flex-col sticky top-0 h-screen">
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
            <p className="text-slate-500 font-medium">Controle multi-warehouse, rastreio de lotes e grade de variações.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="rounded-2xl h-12 gap-2 font-bold px-6"><Barcode className="h-4 w-4" /> Scan SKU</Button>
            <Button className="bg-slate-900 rounded-2xl h-12 gap-2 font-bold px-6 shadow-xl shadow-slate-200">
              <Plus className="h-4 w-4" /> Entrada de Lote / NF-e
            </Button>
          </div>
        </header>

        <div className="flex gap-4 mb-8 overflow-x-auto no-scrollbar pb-2">
           <Button 
            variant={warehouse === 'principal' ? 'default' : 'outline'} 
            className="rounded-2xl h-14 px-8 font-black italic gap-2"
            onClick={() => setWarehouse('principal')}
           >
              <Warehouse className="h-4 w-4" /> CD Principal - SP
           </Button>
           <Button 
            variant={warehouse === 'sul' ? 'default' : 'outline'} 
            className="rounded-2xl h-14 px-8 font-black italic gap-2"
            onClick={() => setWarehouse('sul')}
           >
              <Warehouse className="h-4 w-4" /> Filial Sul - CTBA
           </Button>
           <Button variant="ghost" className="rounded-2xl h-14 px-6 text-slate-400 font-bold border-2 border-dashed">
              <Plus className="h-4 w-4 mr-2" /> Novo Galpão
           </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-4 mb-10">
           <Card className="border-none shadow-sm p-6 rounded-[32px] bg-red-500 text-white relative overflow-hidden">
              <p className="text-[10px] font-black uppercase tracking-widest opacity-80">Ruptura Crítica</p>
              <p className="text-4xl font-black italic mt-2">{lowStockItems.length} SKUs</p>
              <AlertTriangle className="absolute -bottom-4 -right-4 h-24 w-24 opacity-10" />
           </Card>
           <Card className="border-none shadow-sm p-6 rounded-[32px] bg-white">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Patrimônio Imobilizado</p>
              <p className="text-3xl font-black italic mt-2 text-slate-900">R$ 482.150</p>
           </Card>
           <Card className="border-none shadow-sm p-6 rounded-[32px] bg-white">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Giro Médio (Global)</p>
              <div className="flex items-center gap-3 mt-2">
                 <p className="text-3xl font-black italic text-slate-900">5.8x</p>
                 <Badge className="bg-green-100 text-green-700 font-black border-none px-3">Alta Performance</Badge>
              </div>
           </Card>
           <Card className="border-none shadow-sm p-6 rounded-[32px] bg-primary text-white relative overflow-hidden">
              <p className="text-[10px] font-black uppercase tracking-widest opacity-80">AI Replenishment</p>
              <p className="text-3xl font-black italic mt-2">Próx. 48h</p>
              <Truck className="absolute -bottom-4 -right-4 h-24 w-24 opacity-10" />
           </Card>
        </div>

        <Card className="border-none shadow-sm rounded-[40px] overflow-hidden bg-white">
          <CardHeader className="p-8 border-b bg-slate-50/50 flex flex-row items-center justify-between">
            <div className="flex items-center gap-4">
               <CardTitle className="text-xl font-black italic">Monitoramento de Lotes</CardTitle>
               <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input placeholder="Buscar por Lote, Validade, SKU..." className="pl-10 h-12 w-80 rounded-2xl bg-white border-none shadow-sm font-medium" />
               </div>
            </div>
            <div className="flex gap-2">
               <Button variant="outline" className="rounded-xl font-bold"><RefreshCw className="h-4 w-4 mr-2" /> Sync API ERP</Button>
               <Button variant="ghost" size="icon" className="rounded-xl"><Filter className="h-5 w-5 text-slate-400" /></Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-slate-50/30">
                <TableRow>
                  <TableHead className="px-8 h-16 font-black uppercase text-[10px] tracking-widest">Produto / Lote</TableHead>
                  <TableHead className="h-16 font-black uppercase text-[10px] tracking-widest">Localização</TableHead>
                  <TableHead className="h-16 font-black uppercase text-[10px] tracking-widest text-center">Unidades</TableHead>
                  <TableHead className="h-16 font-black uppercase text-[10px] tracking-widest text-center">Validade / IA</TableHead>
                  <TableHead className="text-right px-8 h-16 font-black uppercase text-[10px] tracking-widest">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {MOCK_PRODUCTS.map((p) => (
                  <TableRow key={p.id} className="hover:bg-slate-50 transition-colors">
                    <TableCell className="px-8 py-6">
                       <div className="flex items-center gap-4">
                          <div className="h-14 w-14 rounded-2xl bg-slate-100 overflow-hidden shadow-inner border border-slate-50">
                             <img src={p.imageUrl} className="h-full w-full object-cover" />
                          </div>
                          <div className="flex flex-col">
                             <span className="font-black text-slate-900 text-base italic">{p.name}</span>
                             <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                                <QrCode className="h-2 w-2" /> LOTE: #AF2024-XP
                             </span>
                          </div>
                       </div>
                    </TableCell>
                    <TableCell>
                       <div className="flex flex-col">
                          <span className="font-bold text-slate-600">Corredor B - Prateleira 04</span>
                          <span className="text-[9px] font-black text-slate-400 uppercase">{warehouse.toUpperCase()}</span>
                       </div>
                    </TableCell>
                    <TableCell className="text-center">
                       <div className="flex flex-col items-center">
                          <span className="font-black text-slate-900 text-xl italic">{p.stock}</span>
                          <span className="text-[8px] font-bold text-slate-400 uppercase">UNIDADES</span>
                       </div>
                    </TableCell>
                    <TableCell className="text-center">
                       <div className="flex flex-col items-center gap-1">
                          <Badge className="bg-slate-100 text-slate-600 border-none font-black italic text-[9px] uppercase">30 DEZ 2025</Badge>
                          <span className="text-[8px] font-bold text-green-600 uppercase flex items-center gap-1"><TrendingDown className="h-2 w-2" /> Giro Seguro</span>
                       </div>
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
