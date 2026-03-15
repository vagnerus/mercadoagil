
"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { LayoutDashboard, ShoppingBag, List, Settings, Package, Ticket, Plus, Trash2 } from "lucide-react";
import Link from 'next/link';
import { MOCK_COUPONS } from "@/lib/mock-data";
import { useToast } from "@/hooks/use-toast";

export default function MerchantCoupons({ params }: { params: { slug: string } }) {
  const [coupons, setCoupons] = useState(MOCK_COUPONS);
  const { toast } = useToast();

  const handleDelete = (id: string) => {
    setCoupons(prev => prev.filter(c => c.id !== id));
    toast({ title: "Cupom Removido", description: "O cupom não é mais válido." });
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
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
          <Link href={`/merchant/${params.slug}/coupons`} className="flex items-center gap-3 px-4 py-2.5 bg-accent/10 text-accent rounded-xl font-bold">
            <Ticket className="h-5 w-5" /> Cupons
          </Link>
          <Link href={`/merchant/${params.slug}/settings`} className="flex items-center gap-3 px-4 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors font-medium">
            <Settings className="h-5 w-5" /> Configurações
          </Link>
        </nav>
      </aside>

      <main className="flex-1 p-8">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Cupons de Desconto</h1>
            <p className="text-slate-500 mt-1">Crie promoções irresistíveis para seus clientes.</p>
          </div>
          <Button className="bg-accent rounded-xl gap-2 h-12 px-6">
            <Plus className="h-4 w-4" /> Novo Cupom
          </Button>
        </header>

        <div className="grid gap-8 lg:grid-cols-3">
          <Card className="lg:col-span-2 border-none shadow-sm rounded-3xl overflow-hidden">
            <CardHeader className="bg-white p-6 border-b">
              <CardTitle className="text-xl">Cupons Ativos</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-slate-50">
                  <TableRow>
                    <TableHead className="px-6">Código</TableHead>
                    <TableHead>Desconto</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead className="text-right px-6">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {coupons.map((coupon) => (
                    <TableRow key={coupon.id}>
                      <TableCell className="px-6 font-bold">{coupon.code}</TableCell>
                      <TableCell>{coupon.discount}{coupon.type === 'percent' ? '%' : ' R$'}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="rounded-lg">
                          {coupon.type === 'percent' ? 'Porcentagem' : 'Valor Fixo'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right px-6">
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(coupon.id)} className="text-red-500 hover:bg-red-50 rounded-full">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm rounded-3xl p-6 h-fit bg-primary/5">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
               <Ticket className="h-5 w-5 text-primary" /> Dica de Marketing
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Cupons de <strong>10% OFF</strong> para a primeira compra aumentam a taxa de conversão em até 35%. Tente criar um código como <code>BEMVINDO</code> hoje mesmo!
            </p>
          </Card>
        </div>
      </main>
    </div>
  );
}
