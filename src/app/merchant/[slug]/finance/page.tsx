
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Wallet, TrendingUp, ArrowDownCircle, ArrowUpCircle, Download, Calendar, LayoutDashboard, ShoppingBag, List, Settings, Package, CreditCard } from "lucide-react";
import Link from 'next/link';

const transactions = [
  { id: 'tx1', date: '2024-03-20', type: 'Venda', value: 1250.00, status: 'Pago', method: 'Cartão de Crédito' },
  { id: 'tx2', date: '2024-03-19', type: 'Venda', value: 850.00, status: 'Pago', method: 'PIX' },
  { id: 'tx3', date: '2024-03-18', type: 'Mensalidade', value: -149.00, status: 'Debitado', method: 'Plano Pro' },
  { id: 'tx4', date: '2024-03-17', type: 'Venda', value: 420.00, status: 'Pendente', method: 'Boleto' },
];

export default function MerchantFinance({ params }: { params: { slug: string } }) {
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
          <Link href={`/merchant/${params.slug}/finance`} className="flex items-center gap-3 px-4 py-2.5 bg-accent/10 text-accent rounded-xl font-bold">
            <Wallet className="h-5 w-5" /> Financeiro
          </Link>
          <Link href={`/merchant/${params.slug}/settings`} className="flex items-center gap-3 px-4 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors font-medium">
            <Settings className="h-5 w-5" /> Configurações
          </Link>
        </nav>
      </aside>

      <main className="flex-1 p-8">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-black text-slate-900 italic">Gestão Financeira</h1>
            <p className="text-slate-500 font-medium">Controle seu fluxo de caixa e repasses.</p>
          </div>
          <Button className="bg-slate-900 rounded-2xl h-12 gap-2 shadow-lg shadow-slate-200">
            <Download className="h-4 w-4" /> Exportar Relatório
          </Button>
        </header>

        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <Card className="border-none shadow-sm rounded-[32px] bg-primary text-white p-8">
            <div className="flex justify-between items-start mb-4">
              <div className="bg-white/20 p-3 rounded-2xl">
                <Wallet className="h-6 w-6 text-white" />
              </div>
              <Badge className="bg-white/20 text-white border-none rounded-full">Disponível</Badge>
            </div>
            <p className="text-white/70 font-bold uppercase text-xs tracking-widest mb-1">Saldo Total</p>
            <p className="text-4xl font-black italic tracking-tighter">R$ 14.520,80</p>
          </Card>

          <Card className="border-none shadow-sm rounded-[32px] p-8">
            <div className="flex justify-between items-start mb-4">
              <div className="bg-green-100 p-3 rounded-2xl">
                <ArrowUpCircle className="h-6 w-6 text-green-600" />
              </div>
              <span className="text-green-600 font-black text-sm">+14%</span>
            </div>
            <p className="text-slate-400 font-bold uppercase text-xs tracking-widest mb-1">Entradas (Mês)</p>
            <p className="text-3xl font-black text-slate-900 tracking-tighter italic">R$ 22.140,00</p>
          </Card>

          <Card className="border-none shadow-sm rounded-[32px] p-8">
            <div className="flex justify-between items-start mb-4">
              <div className="bg-red-100 p-3 rounded-2xl">
                <ArrowDownCircle className="h-6 w-6 text-red-600" />
              </div>
              <span className="text-red-600 font-black text-sm">-5%</span>
            </div>
            <p className="text-slate-400 font-bold uppercase text-xs tracking-widest mb-1">Saídas (Mês)</p>
            <p className="text-3xl font-black text-slate-900 tracking-tighter italic">R$ 3.840,00</p>
          </Card>
        </div>

        <Card className="border-none shadow-sm rounded-[40px] overflow-hidden">
          <CardHeader className="p-8 border-b bg-white flex flex-row items-center justify-between">
            <CardTitle className="text-xl font-black italic">Extrato de Lançamentos</CardTitle>
            <Button variant="outline" className="rounded-xl gap-2 font-bold"><Calendar className="h-4 w-4" /> Março/2024</Button>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-slate-50/50">
                <TableRow>
                  <TableHead className="px-8 font-black uppercase text-[10px] tracking-widest">Data</TableHead>
                  <TableHead className="font-black uppercase text-[10px] tracking-widest">Descrição</TableHead>
                  <TableHead className="font-black uppercase text-[10px] tracking-widest">Método</TableHead>
                  <TableHead className="font-black uppercase text-[10px] tracking-widest">Status</TableHead>
                  <TableHead className="text-right px-8 font-black uppercase text-[10px] tracking-widest">Valor</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((tx) => (
                  <TableRow key={tx.id} className="hover:bg-slate-50 transition-colors">
                    <TableCell className="px-8 py-6 font-bold text-slate-500">{tx.date}</TableCell>
                    <TableCell className="font-black text-slate-900">{tx.type}</TableCell>
                    <TableCell className="text-slate-500 font-medium">{tx.method}</TableCell>
                    <TableCell>
                      <Badge className={`rounded-lg border-none ${tx.status === 'Pago' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                        {tx.status}
                      </Badge>
                    </TableCell>
                    <TableCell className={`text-right px-8 font-black italic ${tx.value > 0 ? 'text-green-600' : 'text-red-500'}`}>
                      R$ {tx.value.toFixed(2)}
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
