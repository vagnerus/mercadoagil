
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Package, DollarSign, Clock, LayoutDashboard, List, Settings, UtensilsCrossed, TrendingUp } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import Link from 'next/link';

const chartData = [
  { name: 'Seg', sales: 4000 },
  { name: 'Ter', sales: 3000 },
  { name: 'Qua', sales: 2000 },
  { name: 'Qui', sales: 2780 },
  { name: 'Sex', sales: 1890 },
  { name: 'Sab', sales: 2390 },
  { name: 'Dom', sales: 3490 },
];

const areaData = [
  { time: '10:00', orders: 2 },
  { time: '12:00', orders: 15 },
  { time: '14:00', orders: 8 },
  { time: '16:00', orders: 5 },
  { time: '18:00', orders: 22 },
  { time: '20:00', orders: 35 },
  { time: '22:00', orders: 10 },
];

export default function MerchantDashboard({ params }: { params: { slug: string } }) {
  const stats = [
    { title: "Vendas de Hoje", value: "R$ 1.240", icon: DollarSign, color: "text-green-600", bg: "bg-green-100" },
    { title: "Pedidos Novos", value: "8", icon: ShoppingBag, color: "text-blue-600", bg: "bg-blue-100" },
    { title: "Em Preparo", value: "5", icon: UtensilsCrossed, color: "text-orange-600", bg: "bg-orange-100" },
    { title: "Tempo Médio", value: "32 min", icon: Clock, color: "text-purple-600", bg: "bg-purple-100" },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-white hidden lg:block">
        <div className="p-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-accent p-1 rounded-md">
              <Package className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-lg text-slate-800 tracking-tight">Lojista Admin</span>
          </Link>
        </div>
        <nav className="px-4 space-y-2">
          <Link href={`/merchant/${params.slug}/dashboard`} className="flex items-center gap-3 px-4 py-2 bg-accent/10 text-accent rounded-lg font-medium">
            <LayoutDashboard className="h-5 w-5" /> Dashboard
          </Link>
          <Link href={`/merchant/${params.slug}/orders`} className="flex items-center gap-3 px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
            <ShoppingBag className="h-5 w-5" /> Pedidos
          </Link>
          <Link href={`/merchant/${params.slug}/catalog`} className="flex items-center gap-3 px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
            <List className="h-5 w-5" /> Cardápio
          </Link>
          <Link href="#" className="flex items-center gap-3 px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
            <Settings className="h-5 w-5" /> Configurações
          </Link>
        </nav>
      </aside>

      <main className="flex-1 p-8">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 uppercase tracking-wide">
              {params.slug.replace('-', ' ')}
            </h1>
            <p className="text-slate-500">Visão geral da sua operação hoje.</p>
          </div>
          <div className="flex items-center gap-4">
            <Badge className="bg-green-500 text-white border-none py-1.5 px-4 rounded-full">LOJA ABERTA</Badge>
            <Link href={`/store/${params.slug}`} target="_blank">
               <Button variant="outline" size="sm">Ver Minha Loja</Button>
            </Link>
          </div>
        </header>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          {stats.map((stat, i) => (
            <Card key={i} className="border-none shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-500">{stat.title}</p>
                    <p className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</p>
                  </div>
                  <div className={`${stat.bg} p-3 rounded-2xl`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-3 mb-8">
           <Card className="lg:col-span-2 border-none shadow-sm">
             <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Vendas Semanais</CardTitle>
                  <p className="text-sm text-slate-500">Acompanhamento de receita bruta.</p>
                </div>
                <TrendingUp className="h-5 w-5 text-green-500" />
             </CardHeader>
             <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} tickFormatter={(value) => `R$ ${value}`} />
                    <Tooltip 
                      cursor={{fill: '#f8fafc'}}
                      contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                    />
                    <Bar dataKey="sales" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
             </CardContent>
           </Card>
           
           <Card className="border-none shadow-sm">
             <CardHeader>
                <CardTitle className="text-lg">Pico de Pedidos</CardTitle>
                <p className="text-sm text-slate-500">Volume de hoje por horário.</p>
             </CardHeader>
             <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={areaData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                    <YAxis hide />
                    <Tooltip 
                       contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                    />
                    <Area type="monotone" dataKey="orders" stroke="hsl(var(--primary))" fill="hsl(var(--primary)/0.2)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
             </CardContent>
           </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-1">
           <Card className="border-none shadow-sm">
             <CardHeader>
                <CardTitle className="text-lg">Ações Rápidas</CardTitle>
             </CardHeader>
             <CardContent className="grid gap-4 md:grid-cols-2">
               <Button className="py-6 bg-accent hover:bg-accent/90" asChild>
                 <Link href={`/merchant/${params.slug}/catalog`}>
                   <List className="mr-3 h-5 w-5" /> Adicionar Novo Produto
                 </Link>
               </Button>
               <Button variant="outline" className="py-6" asChild>
                  <Link href={`/merchant/${params.slug}/orders`}>
                    <ShoppingBag className="mr-3 h-5 w-5" /> Gerenciar Pedidos Ativos
                  </Link>
               </Button>
             </CardContent>
           </Card>
        </div>
      </main>
    </div>
  );
}
