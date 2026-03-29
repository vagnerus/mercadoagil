
"use client";

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Truck, Building2, Phone, Mail, Plus, Search, 
  Settings, ShoppingBag, List, LayoutDashboard, 
  ArrowUpCircle, ExternalLink, MessageSquare
} from "lucide-react";
import Link from 'next/link';

const suppliers = [
  { id: 'v1', name: 'Alimentos Gerais S.A.', category: 'Perecíveis', reliability: 98, contact: 'Carlos Fornecedor', status: 'Ativo' },
  { id: 'v2', name: 'Distribuidora Bebidas Pro', category: 'Bebidas', reliability: 92, contact: 'Juliana Vendas', status: 'Ativo' },
  { id: 'v3', name: 'Embalagens & Cia', category: 'Suprimentos', reliability: 85, contact: 'Marcos Logística', status: 'Alerta' },
];

export default function MerchantSuppliers({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = React.use(params);

  return (
    <div className="flex min-h-screen bg-slate-50 font-body">
      <aside className="w-64 border-r bg-white hidden lg:flex flex-col sticky top-0 h-screen">
        <div className="p-6">
          <Link href="/" className="flex items-center gap-2 font-black text-xl italic tracking-tighter text-primary uppercase">
            MERCADO ÁGIL
          </Link>
        </div>
        <nav className="flex-1 px-4 space-y-2">
          <Link href={`/merchant/${slug}/dashboard`} className="flex items-center gap-3 px-4 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors font-medium">
            <LayoutDashboard className="h-5 w-5" /> Dashboard
          </Link>
          <Link href={`/merchant/${slug}/suppliers`} className="flex items-center gap-3 px-4 py-2.5 bg-primary/10 text-primary rounded-xl font-bold">
            <Truck className="h-5 w-5" /> Fornecedores
          </Link>
          <Link href={`/merchant/${slug}/catalog`} className="flex items-center gap-3 px-4 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors font-medium">
            <List className="h-5 w-5" /> Catálogo
          </Link>
        </nav>
      </aside>

      <main className="flex-1 p-8">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tighter italic uppercase">Vendor Management CRM</h1>
            <p className="text-slate-500 font-medium">Gestão de compras, reposição automática e auditoria de parceiros.</p>
          </div>
          <Button className="bg-primary rounded-2xl h-12 gap-2 font-black italic shadow-xl shadow-primary/20 px-8 text-white">
            <Plus className="h-5 w-5" /> Novo Parceiro
          </Button>
        </header>

        <div className="grid gap-6 md:grid-cols-3 mb-10">
           <Card className="border-none shadow-sm p-8 rounded-[40px] bg-white flex flex-col justify-center text-center space-y-2">
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Pedidos de Compra (Mês)</p>
              <p className="text-4xl font-black italic text-slate-900">24</p>
           </Card>
           <Card className="border-none shadow-sm p-8 rounded-[40px] bg-white flex flex-col justify-center text-center space-y-2">
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Reliability Score Médio</p>
              <div className="flex items-center justify-center gap-3">
                 <p className="text-4xl font-black italic text-primary">91%</p>
                 <Badge className="bg-primary/10 text-primary border-none font-black italic">Top Tier</Badge>
              </div>
           </Card>
           <Card className="border-none shadow-sm p-8 rounded-[40px] bg-slate-900 text-white flex flex-col justify-center text-center space-y-2">
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Economia Gerada (IA Negotiator)</p>
              <p className="text-4xl font-black italic text-primary">R$ 12.450</p>
           </Card>
        </div>

        <Card className="border-none shadow-sm rounded-[40px] overflow-hidden bg-white">
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-slate-50/50">
                <TableRow>
                  <TableHead className="px-8 h-16 font-black uppercase text-[10px] tracking-widest">Empresa / Fornecedor</TableHead>
                  <TableHead className="h-16 font-black uppercase text-[10px] tracking-widest">Categoria</TableHead>
                  <TableHead className="h-16 font-black uppercase text-[10px] tracking-widest text-center">Score Entrega</TableHead>
                  <TableHead className="h-16 font-black uppercase text-[10px] tracking-widest text-center">Status</TableHead>
                  <TableHead className="text-right px-8 h-16 font-black uppercase text-[10px] tracking-widest">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {suppliers.map((v) => (
                  <TableRow key={v.id} className="hover:bg-slate-50 transition-colors">
                    <TableCell className="px-8 py-6">
                       <div className="flex items-center gap-4">
                          <div className="h-12 w-12 rounded-2xl bg-slate-100 flex items-center justify-center">
                             <Building2 className="h-6 w-6 text-slate-400" />
                          </div>
                          <div className="flex flex-col">
                             <span className="font-black text-slate-900 text-base italic uppercase">{v.name}</span>
                             <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{v.contact}</span>
                          </div>
                       </div>
                    </TableCell>
                    <TableCell className="font-bold text-slate-500 italic">{v.category}</TableCell>
                    <TableCell className="text-center">
                       <div className="flex flex-col items-center gap-1">
                          <span className={`font-black text-lg ${v.reliability > 90 ? 'text-green-600' : 'text-orange-500'}`}>{v.reliability}%</span>
                          <div className="h-1 w-16 bg-slate-100 rounded-full overflow-hidden">
                             <div className={`h-full ${v.reliability > 90 ? 'bg-green-500' : 'bg-orange-500'}`} style={{width: `${v.reliability}%`}}></div>
                          </div>
                       </div>
                    </TableCell>
                    <TableCell className="text-center">
                       <Badge className={`rounded-lg border-none px-3 font-black text-[9px] uppercase ${v.status === 'Ativo' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                          {v.status}
                       </Badge>
                    </TableCell>
                    <TableCell className="text-right px-8">
                       <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" className="rounded-xl text-primary"><MessageSquare className="h-4 w-4" /></Button>
                          <Button variant="ghost" size="icon" className="rounded-xl"><ExternalLink className="h-4 w-4 text-slate-400" /></Button>
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
