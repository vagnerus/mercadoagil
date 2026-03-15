
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Package, DollarSign, Clock, LayoutDashboard, List, Settings, UtensilsCrossed, TrendingUp, AlertTriangle, Download, Users, Ticket } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import Link from 'next/link';
import { MOCK_PRODUCTS } from "@/lib/mock-data";

const chartData = [
  { name: 'Seg', sales: 4000 },
  { name: 'Ter', sales: 3000 },
  { name: 'Qua', sales: 2000 },
  { name: 'Qui', sales: 2780 },
  { name: 'Sex', sales: 1890 },
  { name: 'Sab', sales: 2390 },
  { name: 'Dom', sales: 3490 },
];

export default function MerchantDashboard({ params }: { params: { slug: string } }) {
  const lowStockProducts = MOCK_PRODUCTS.filter(p => p.stock && p.stock < 10);

  const stats = [
    { title: "Vendas de Hoje", value: "R$ 1.240", icon: DollarSign, color: "text-green-600", bg: "bg-green-100" },
    { title: "Ticket Médio", value: "R$ 42,50", icon: TrendingUp, color: "text-blue-600", bg: "bg-blue-100" },
    { title: "Novos Clientes", value: "12", icon: Users, color: "text-purple-600", bg: "bg-purple-100" },
    { title: "Tempo Médio", value: "32 min", icon: Clock, color: "text-orange-600", bg: "bg-orange-100" },
  ];

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
          <Link href={`/merchant/${params.slug}/dashboard`} className="flex items-center gap-3 px-4 py-2.5 bg-accent/10 text-accent rounded-xl font-bold">
            <LayoutDashboard className="h-5 w-5" /> Dashboard
          </Link>
          <Link href={`/merchant/${params.slug}/orders`} className="flex items-center gap-3 px-4 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors font-medium">
            <ShoppingBag className="h-5 w-5" /> Pedidos
          </Link>
          <Link href={`/merchant/${params.slug}/catalog`} className="flex items-center gap-3 px-4 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors font-medium">
            <List className="h-5 w-5" /> Catálogo
          </Link>
          <Link href={`/merchant/${params.slug}/coupons`} className="flex items-center gap-3 px-4 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors font-medium">
            <Ticket className="h-5 w-5" /> Cupons
          </Link>
          <Link href={`/merchant/${params.slug}/settings`} className="flex items-center gap-3 px-4 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors font-medium">
            <Settings className="h-5 w-5" /> Configurações
          </Link>
        </nav>
      </aside>

      <main className="flex-1 p-8 overflow-y-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 uppercase tracking-tight">{params.slug.replace('-', ' ')}</h1>
            <p className="text-slate-500">Métricas e alertas em tempo real.</p>
          </div>
          <div className="flex gap-3">
             <Button variant="outline" className="rounded-xl h-12 gap-2"><Download className="h-4 w-4" /> Exportar Vendas</Button>
             <Badge className="bg-green-500 text-white h-12 px-6 rounded-xl flex items-center text-sm font-bold">LOJA ABERTA</Badge>
          </div>
        </header>

        {lowStockProducts.length > 0 && (
          <div className="mb-8 p-4 bg-orange-50 border border-orange-100 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-4">
               <div className="p-3 bg-orange-100 rounded-xl">
                 <AlertTriangle className="h-6 w-6 text-orange-600" />
               </div>
               <div>
                  <h4 className="font-bold text-orange-900">Alerta de Estoque</h4>
                  <p className="text-sm text-orange-700">Existem {lowStockProducts.length} itens com menos de 10 unidades no estoque.</p>
               </div>
            </div>
            <Button variant="ghost" asChild className="text-orange-900 font-bold hover:bg-orange-100"><Link href={`/merchant/${params.slug}/catalog`}>Ver Estoque</Link></Button>
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          {stats.map((stat, i) => (
            <Card key={i} className="border-none shadow-sm rounded-3xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className={`${stat.bg} p-3 rounded-2xl`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-sm font-medium text-slate-500">{stat.title}</p>
                  <p className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2 border-none shadow-sm rounded-3xl p-6">
             <CardHeader className="p-0 mb-6 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-xl">Faturamento Semanal</CardTitle>
                </div>
             </CardHeader>
             <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} tickFormatter={(value) => `R$ ${value}`} />
                    <Tooltip cursor={{fill: '#f1f5f9'}} contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} />
                    <Bar dataKey="sales" fill="hsl(var(--accent))" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
             </div>
          </Card>

          <Card className="border-none shadow-sm rounded-3xl p-6 flex flex-col gap-6">
             <div>
                <CardTitle className="text-xl">Ações Rápidas</CardTitle>
                <p className="text-sm text-slate-500">Funcionalidades de gestão.</p>
             </div>
             <div className="space-y-4">
                <Button className="w-full h-14 bg-slate-900 rounded-2xl justify-start gap-4 px-6" asChild>
                  <Link href={`/merchant/${params.slug}/team`}><Users className="h-5 w-5" /> Gerenciar Equipe</Link>
                </Button>
                <Button variant="outline" className="w-full h-14 rounded-2xl justify-start gap-4 px-6" asChild>
                   <Link href={`/merchant/${params.slug}/customers`}><ShoppingBag className="h-5 w-5" /> Base de Clientes</Link>
                </Button>
                <div className="pt-4 border-t">
                   <p className="text-xs font-bold text-slate-400 uppercase mb-3">Seu Plano</p>
                   <div className="bg-primary/10 p-4 rounded-2xl flex items-center justify-between">
                      <span className="font-bold text-primary">Plano PRO</span>
                      <Button size="sm" variant="ghost" className="text-xs underline">Mudar plano</Button>
                   </div>
                </div>
             </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
