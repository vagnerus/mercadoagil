
"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Search, Mail, Phone, MessageSquare, Star, LayoutDashboard, ShoppingBag, List, Wallet, Settings, Package } from "lucide-react";
import Link from 'next/link';

const customers = [
  { id: 'u1', name: 'João Silva', email: 'joao@email.com', phone: '(11) 99999-8888', orders: 12, spent: 1450.00, rating: 4.9 },
  { id: 'u2', name: 'Maria Santos', email: 'maria@email.com', phone: '(11) 97777-6666', orders: 8, spent: 920.00, rating: 5.0 },
  { id: 'u3', name: 'Pedro Souza', email: 'pedro@email.com', phone: '(11) 98888-5555', orders: 3, spent: 210.00, rating: 4.2 },
];

export default function MerchantCustomers({ params }: { params: { slug: string } }) {
  return (
    <div className="flex min-h-screen bg-slate-50 font-body">
      <aside className="w-64 border-r bg-white hidden lg:flex flex-col">
        <div className="p-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-accent p-1.5 rounded-lg shadow-sm">
              <Package className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-lg text-slate-800 tracking-tight">Painel Lojista</span>
          </Link>
        </div>
        <nav className="flex-1 px-4 space-y-2">
          <Link href={`/merchant/${params.slug}/dashboard`} className="flex items-center gap-3 px-4 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors font-medium">
            <LayoutDashboard className="h-5 w-5" /> Dashboard
          </Link>
          <Link href={`/merchant/${params.slug}/orders`} className="flex items-center gap-3 px-4 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors font-medium">
            <ShoppingBag className="h-5 w-5" /> Pedidos
          </Link>
          <Link href={`/merchant/${params.slug}/catalog`} className="flex items-center gap-3 px-4 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors font-medium">
            <List className="h-5 w-5" /> Catálogo
          </Link>
          <Link href={`/merchant/${params.slug}/customers`} className="flex items-center gap-3 px-4 py-2.5 bg-accent/10 text-accent rounded-xl font-bold">
            <Users className="h-5 w-5" /> CRM Clientes
          </Link>
          <Link href={`/merchant/${params.slug}/finance`} className="flex items-center gap-3 px-4 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors font-medium">
            <Wallet className="h-5 w-5" /> Financeiro
          </Link>
          <Link href={`/merchant/${params.slug}/settings`} className="flex items-center gap-3 px-4 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors font-medium">
            <Settings className="h-5 w-5" /> Configurações
          </Link>
        </nav>
      </aside>

      <main className="flex-1 p-8">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black text-slate-900 italic tracking-tighter">CRM de Clientes</h1>
            <p className="text-slate-500 font-medium">Conheça e fidelize seus compradores recorrentes.</p>
          </div>
          <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input className="pl-12 h-12 rounded-2xl bg-white border-none shadow-sm" placeholder="Buscar por nome ou celular..." />
          </div>
        </header>

        <div className="grid gap-6 md:grid-cols-4 mb-8">
          <Card className="border-none shadow-sm rounded-[32px] p-6 text-center space-y-2">
            <p className="text-xs font-black uppercase tracking-widest text-slate-400">Total Clientes</p>
            <p className="text-4xl font-black italic tracking-tighter text-slate-900">1.248</p>
          </Card>
          <Card className="border-none shadow-sm rounded-[32px] p-6 text-center space-y-2 bg-accent/5 border border-accent/10">
            <p className="text-xs font-black uppercase tracking-widest text-accent">Novos (30 dias)</p>
            <p className="text-4xl font-black italic tracking-tighter text-accent">142</p>
          </Card>
          <Card className="border-none shadow-sm rounded-[32px] p-6 text-center space-y-2">
            <p className="text-xs font-black uppercase tracking-widest text-slate-400">Taxa Retenção</p>
            <p className="text-4xl font-black italic tracking-tighter text-slate-900">68%</p>
          </Card>
          <Card className="border-none shadow-sm rounded-[32px] p-6 text-center space-y-2">
            <p className="text-xs font-black uppercase tracking-widest text-slate-400">Nota Média</p>
            <p className="text-4xl font-black italic tracking-tighter text-slate-900 flex items-center justify-center gap-2"><Star className="h-6 w-6 fill-yellow-400 text-yellow-400" /> 4.9</p>
          </Card>
        </div>

        <Card className="border-none shadow-sm rounded-[40px] overflow-hidden">
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-slate-50/50">
                <TableRow>
                  <TableHead className="px-8 h-16 font-black uppercase text-[10px] tracking-widest">Cliente</TableHead>
                  <TableHead className="h-16 font-black uppercase text-[10px] tracking-widest text-center">Pedidos</TableHead>
                  <TableHead className="h-16 font-black uppercase text-[10px] tracking-widest text-center">Faturamento</TableHead>
                  <TableHead className="h-16 font-black uppercase text-[10px] tracking-widest text-center">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customers.map((c) => (
                  <TableRow key={c.id} className="hover:bg-slate-50 transition-colors">
                    <TableCell className="px-8 py-6">
                      <div className="flex flex-col">
                        <span className="font-black text-slate-900 text-lg">{c.name}</span>
                        <div className="flex items-center gap-4 mt-1">
                          <span className="text-xs font-bold text-slate-400 flex items-center gap-1"><Mail className="h-3 w-3" /> {c.email}</span>
                          <span className="text-xs font-bold text-slate-400 flex items-center gap-1"><Phone className="h-3 w-3" /> {c.phone}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge className="bg-slate-100 text-slate-800 font-black rounded-lg px-3 py-1 border-none">{c.orders}</Badge>
                    </TableCell>
                    <TableCell className="text-center font-black italic text-primary text-lg">R$ {c.spent.toFixed(2)}</TableCell>
                    <TableCell className="text-center">
                      <div className="flex justify-center gap-2">
                        <Button variant="ghost" size="icon" className="rounded-2xl hover:bg-slate-200"><MessageSquare className="h-5 w-5 text-slate-600" /></Button>
                        <Button variant="ghost" size="icon" className="rounded-2xl hover:bg-slate-200"><Settings className="h-5 w-5 text-slate-600" /></Button>
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
