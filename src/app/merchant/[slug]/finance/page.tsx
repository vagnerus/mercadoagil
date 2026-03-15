
"use client";

import * as React from 'react';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Wallet, TrendingUp, ArrowDownCircle, ArrowUpCircle, Download, 
  Calendar, LayoutDashboard, ShoppingBag, List, Settings, 
  Package, CreditCard, Lock, Unlock, Landmark, ArrowRight, Loader2
} from "lucide-react";
import Link from 'next/link';
import { useToast } from "@/hooks/use-toast";

export default function MerchantFinance({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = React.use(params);
  const [isCashOpen, setIsCashOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleToggleCash = () => {
    setLoading(true);
    setTimeout(() => {
      setIsCashOpen(!isCashOpen);
      setLoading(false);
      toast({ 
        title: isCashOpen ? "Caixa Fechado" : "Caixa Aberto", 
        description: isCashOpen ? "Relatório de fechamento enviado ao e-mail." : "Operação de balcão iniciada." 
      });
    }, 1000);
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-body">
      <aside className="w-64 border-r bg-white hidden lg:flex flex-col sticky top-0 h-screen">
        <div className="p-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-accent p-1.5 rounded-lg shadow-sm">
              <Package className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-lg text-slate-800 tracking-tight">Painel Lojista</span>
          </Link>
        </div>
        <nav className="flex-1 px-4 space-y-2">
          <Link href={`/merchant/${slug}/dashboard`} className="flex items-center gap-3 px-4 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors font-medium">
            <LayoutDashboard className="h-5 w-5" /> Dashboard
          </Link>
          <Link href={`/merchant/${slug}/finance`} className="flex items-center gap-3 px-4 py-2.5 bg-accent/10 text-accent rounded-xl font-bold">
            <Wallet className="h-5 w-5" /> Financeiro
          </Link>
          <Link href={`/merchant/${slug}/settings`} className="flex items-center gap-3 px-4 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors font-medium">
            <Settings className="h-5 w-5" /> Configurações
          </Link>
        </nav>
      </aside>

      <main className="flex-1 p-8">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black text-slate-900 italic tracking-tighter">Fluxo Financeiro</h1>
            <p className="text-slate-500 font-medium">Controle de caixa, entradas e saídas diárias.</p>
          </div>
          <div className="flex gap-3">
             <Button 
              onClick={handleToggleCash} 
              disabled={loading}
              className={`h-12 rounded-2xl font-black italic px-6 shadow-xl gap-2 transition-all ${isCashOpen ? 'bg-red-500 hover:bg-red-600' : 'bg-green-600 hover:bg-green-700'}`}
             >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : (isCashOpen ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />)}
                {isCashOpen ? 'Fechar Caixa' : 'Abrir Caixa Diário'}
             </Button>
             <Button variant="outline" className="rounded-2xl h-12 gap-2 font-bold"><Download className="h-4 w-4" /> Relatório CSV</Button>
          </div>
        </header>

        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <Card className="border-none shadow-sm rounded-[32px] bg-primary text-white p-8 relative overflow-hidden">
            <p className="text-white/70 font-black uppercase text-[10px] tracking-widest mb-1">Saldo em Caixa (Físico)</p>
            <p className="text-4xl font-black italic tracking-tighter">R$ 1.240,50</p>
            <Wallet className="absolute -bottom-4 -right-4 h-24 w-24 opacity-10" />
          </Card>

          <Card className="border-none shadow-sm rounded-[32px] p-8">
            <div className="flex justify-between items-start mb-4">
              <div className="bg-green-100 p-3 rounded-2xl">
                <ArrowUpCircle className="h-6 w-6 text-green-600" />
              </div>
              <Badge className="bg-green-50 text-green-600 border-none font-black italic">+12.4%</Badge>
            </div>
            <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest mb-1">Entradas (Hoje)</p>
            <p className="text-3xl font-black text-slate-900 tracking-tighter italic">R$ 4.850,00</p>
          </Card>

          <Card className="border-none shadow-sm rounded-[32px] p-8">
            <div className="flex justify-between items-start mb-4">
              <div className="bg-red-100 p-3 rounded-2xl">
                <ArrowDownCircle className="h-6 w-6 text-red-600" />
              </div>
              <span className="text-red-600 font-black text-xs">Sangria: R$ 150</span>
            </div>
            <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest mb-1">Saídas / Despesas</p>
            <p className="text-3xl font-black text-slate-900 tracking-tighter italic">R$ 840,00</p>
          </Card>
        </div>

        <Card className="border-none shadow-sm rounded-[40px] overflow-hidden bg-white">
          <CardHeader className="p-8 border-b bg-slate-50/50">
            <CardTitle className="text-xl font-black italic">Conciliação Bancária & Digital</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50">
                  <TableHead className="px-8 font-black uppercase text-[10px]">Data/Hora</TableHead>
                  <TableHead className="font-black uppercase text-[10px]">Descrição</TableHead>
                  <TableHead className="font-black uppercase text-[10px]">Método</TableHead>
                  <TableHead className="text-right px-8 font-black uppercase text-[10px]">Valor</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[
                  { id: 1, time: '14:20', desc: 'Pedido #AF23', method: 'PIX AUTOMÁTICO', value: 125.90, type: 'in' },
                  { id: 2, time: '13:45', desc: 'Sangria de Caixa', method: 'DINHEIRO', value: -100.00, type: 'out' },
                  { id: 3, time: '12:10', desc: 'Venda Balcão', method: 'CARTÃO CRÉDITO', value: 45.00, type: 'in' },
                ].map((tx) => (
                  <TableRow key={tx.id}>
                    <TableCell className="px-8 py-6 font-bold text-slate-500">{tx.time}</TableCell>
                    <TableCell className="font-black text-slate-900 italic">{tx.desc}</TableCell>
                    <TableCell>
                       <Badge variant="secondary" className="font-black text-[9px] uppercase">{tx.method}</Badge>
                    </TableCell>
                    <TableCell className={`text-right px-8 font-black italic ${tx.type === 'in' ? 'text-green-600' : 'text-red-500'}`}>
                      R$ {Math.abs(tx.value).toFixed(2)}
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
