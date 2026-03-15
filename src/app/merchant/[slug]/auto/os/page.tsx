
"use client";

import * as React from 'react';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Search, Plus, ClipboardList, Car, Wrench, Clock, 
  Printer, LayoutDashboard, Settings, Camera, CheckSquare, 
  FileText, Share2, Eye
} from "lucide-react";
import Link from 'next/link';
import { useToast } from "@/hooks/use-toast";

const orders = [
  { id: 'os1', vehicle: 'Toyota Corolla - ABC1234', service: 'Troca de Óleo + Filtros', status: 'No Elevador', mechanic: 'Ricardo', time: '45 min', price: 450.00 },
  { id: 'os2', vehicle: 'Honda Civic - DEF5678', service: 'Revisão 40k km', status: 'Aguardando Peça', mechanic: 'Marcos', time: '2h 15m', price: 1200.00 },
  { id: 'os3', vehicle: 'Fiat Pulse - GHI9012', service: 'Alinhamento/Balanceamento', status: 'Pronto', mechanic: 'Ana', time: '0 min', price: 180.00 },
];

export default function AutoOS({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = React.use(params);
  const { toast } = useToast();

  const handleShareBudget = (id: string) => {
    toast({ title: "Orçamento Enviado", description: "Link de aprovação digital enviado via WhatsApp." });
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-body">
      <aside className="w-64 border-r bg-white hidden lg:flex flex-col sticky top-0 h-screen">
        <div className="p-6">
          <Link href={`/merchant/${slug}/dashboard`} className="flex items-center gap-2 font-black text-xl italic tracking-tighter text-primary uppercase">MERCADO ÁGIL</Link>
        </div>
        <nav className="flex-1 px-4 space-y-2">
          <Link href={`/merchant/${slug}/dashboard`} className="flex items-center gap-3 px-4 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors font-medium"><LayoutDashboard className="h-5 w-5" /> Dashboard</Link>
          <Link href={`/merchant/${slug}/auto/os`} className="flex items-center gap-3 px-4 py-2.5 bg-primary/10 text-primary rounded-xl font-bold"><ClipboardList className="h-5 w-5" /> Ordens de Serviço</Link>
          <Link href={`/merchant/${slug}/inventory`} className="flex items-center gap-3 px-4 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors font-medium"><Wrench className="h-5 w-5" /> Peças & Estoque</Link>
        </nav>
      </aside>

      <main className="flex-1 p-8">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tighter italic uppercase">Gestão de O.S. (Pátio)</h1>
            <p className="text-slate-500 font-medium">Controle de execução, orçamento e check-list digital.</p>
          </div>
          <div className="flex gap-3">
             <Button variant="outline" className="rounded-2xl h-12 gap-2 font-black italic border-primary/20 text-primary hover:bg-primary/5">
                <Camera className="h-4 w-4" /> Check-list Entrada
             </Button>
             <Button className="bg-slate-900 rounded-2xl h-12 gap-2 font-black italic shadow-xl shadow-slate-200 px-8 text-white">
                <Plus className="h-5 w-5" /> Abrir Nova O.S.
             </Button>
          </div>
        </header>

        <div className="grid gap-6 md:grid-cols-4 mb-10">
           <Card className="border-none shadow-sm p-6 rounded-[32px] bg-white">
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Tempo Médio OS</p>
              <p className="text-3xl font-black italic mt-2 text-slate-900">1h 24m</p>
           </Card>
           <Card className="border-none shadow-sm p-6 rounded-[32px] bg-primary text-white">
              <p className="text-[10px] font-black uppercase tracking-widest opacity-80">Em Execução</p>
              <p className="text-3xl font-black italic mt-2">08 Box</p>
           </Card>
           <Card className="border-none shadow-sm p-6 rounded-[32px] bg-white">
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Peças Pendentes</p>
              <p className="text-3xl font-black italic mt-2 text-orange-600">05 SKUs</p>
           </Card>
           <Card className="border-none shadow-sm p-6 rounded-[32px] bg-slate-900 text-white">
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Faturamento O.S.</p>
              <p className="text-3xl font-black italic mt-2 text-primary">R$ 18.450</p>
           </Card>
        </div>

        <Card className="border-none shadow-sm rounded-[40px] overflow-hidden bg-white">
          <CardHeader className="p-8 border-b bg-slate-50/50 flex flex-row items-center justify-between">
            <div className="flex items-center gap-4">
               <CardTitle className="text-xl font-black italic">Status do Pátio</CardTitle>
               <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input placeholder="Placa, Cliente ou OS..." className="pl-10 h-12 w-80 rounded-2xl bg-white border-none shadow-sm font-medium" />
               </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-slate-50/30">
                <TableRow>
                  <TableHead className="px-8 h-16 font-black uppercase text-[10px] tracking-widest">Veículo / Equipamento</TableHead>
                  <TableHead className="h-16 font-black uppercase text-[10px] tracking-widest">Serviço Principal</TableHead>
                  <TableHead className="h-16 font-black uppercase text-[10px] tracking-widest text-center">Status</TableHead>
                  <TableHead className="h-16 font-black uppercase text-[10px] tracking-widest text-center">Total</TableHead>
                  <TableHead className="text-right px-8 h-16 font-black uppercase text-[10px] tracking-widest">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((o) => (
                  <TableRow key={o.id} className="hover:bg-slate-50 transition-colors">
                    <TableCell className="px-8 py-6">
                       <div className="flex items-center gap-4">
                          <div className="h-12 w-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400">
                             <Car className="h-6 w-6" />
                          </div>
                          <div className="flex flex-col">
                             <span className="font-black text-slate-900 text-base italic uppercase">{o.vehicle}</span>
                             <span className="text-[9px] font-bold text-slate-400 uppercase">TEC: {o.mechanic} • #{o.id.toUpperCase()}</span>
                          </div>
                       </div>
                    </TableCell>
                    <TableCell className="font-bold text-slate-600 italic">{o.service}</TableCell>
                    <TableCell className="text-center">
                       <Badge className={`rounded-lg border-none px-3 font-black text-[9px] uppercase ${
                         o.status === 'Pronto' ? 'bg-green-100 text-green-600' : 
                         o.status === 'No Elevador' ? 'bg-blue-100 text-blue-600' : 'bg-orange-100 text-orange-600'
                       }`}>
                          {o.status}
                       </Badge>
                    </TableCell>
                    <TableCell className="text-center font-black text-primary italic">R$ {o.price.toFixed(2)}</TableCell>
                    <TableCell className="text-right px-8">
                       <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" onClick={() => handleShareBudget(o.id)} className="rounded-xl text-green-600 hover:bg-green-50"><Share2 className="h-4 w-4" /></Button>
                          <Button variant="ghost" size="icon" className="rounded-xl text-primary hover:bg-blue-50"><Printer className="h-4 w-4" /></Button>
                          <Button variant="ghost" size="icon" className="rounded-xl text-slate-400"><Settings className="h-4 w-4" /></Button>
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
