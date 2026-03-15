
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Store, TrendingUp, AlertCircle, LayoutDashboard, Settings, Package, CreditCard, LogOut, ChevronRight } from "lucide-react";
import { MOCK_MERCHANTS } from "@/lib/mock-data";
import Link from 'next/link';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const globalData = [
  { month: 'Jan', active: 400, rev: 80000 },
  { month: 'Fev', active: 450, rev: 95000 },
  { month: 'Mar', active: 510, rev: 110000 },
  { month: 'Abr', active: 542, rev: 125400 },
];

export default function AdminDashboard() {
  const stats = [
    { title: "Total de Lojas", value: "542", icon: Store, color: "text-blue-600", bg: "bg-blue-100", trend: "+12%" },
    { title: "Faturamento Assinaturas", value: "R$ 125.400", icon: TrendingUp, color: "text-green-600", bg: "bg-green-100", trend: "+8.4%" },
    { title: "Usuários Ativos", value: "12.8k", icon: Users, color: "text-purple-600", bg: "bg-purple-100", trend: "+5.1%" },
    { title: "Ticket Médio", value: "R$ 231", icon: CreditCard, color: "text-orange-600", bg: "bg-orange-100", trend: "+2%" },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-white hidden lg:flex flex-col">
        <div className="p-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-primary p-1.5 rounded-lg">
              <Store className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-xl text-slate-800 tracking-tight">Master Admin</span>
          </Link>
        </div>
        <nav className="flex-1 px-4 space-y-2">
          <Link href="/admin/dashboard" className="flex items-center gap-3 px-4 py-2.5 bg-primary/10 text-primary rounded-xl font-semibold">
            <LayoutDashboard className="h-5 w-5" /> Dashboard
          </Link>
          <Link href="#" className="flex items-center gap-3 px-4 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors font-medium">
            <Store className="h-5 w-5" /> Lojistas
          </Link>
          <Link href="#" className="flex items-center gap-3 px-4 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors font-medium">
            <Package className="h-5 w-5" /> Planos & SaaS
          </Link>
          <Link href="#" className="flex items-center gap-3 px-4 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors font-medium">
            <Users className="h-5 w-5" /> Colaboradores
          </Link>
          <Link href="#" className="flex items-center gap-3 px-4 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors font-medium">
            <Settings className="h-5 w-5" /> Configurações
          </Link>
        </nav>
        <div className="p-4 border-t">
          <Button variant="ghost" className="w-full justify-start text-slate-500 gap-2 hover:text-red-500 hover:bg-red-50" asChild>
            <Link href="/"><LogOut className="h-4 w-4" /> Sair do Painel</Link>
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Métricas Globais</h1>
            <p className="text-slate-500">Gestão centralizada da plataforma Mercado Ágil.</p>
          </div>
          <div className="flex items-center gap-3">
             <div className="flex -space-x-2 mr-4">
                <img className="h-8 w-8 rounded-full border-2 border-white" src="https://picsum.photos/seed/u1/100/100" alt="" />
                <img className="h-8 w-8 rounded-full border-2 border-white" src="https://picsum.photos/seed/u2/100/100" alt="" />
                <img className="h-8 w-8 rounded-full border-2 border-white" src="https://picsum.photos/seed/u3/100/100" alt="" />
             </div>
             <Badge variant="secondary" className="bg-slate-200 text-slate-700 px-4 py-1 rounded-full font-medium">Versão 2.5.0</Badge>
          </div>
        </header>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          {stats.map((stat, i) => (
            <Card key={i} className="border-none shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className={`${stat.bg} p-3 rounded-2xl`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                  <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">{stat.trend}</span>
                </div>
                <div className="mt-4">
                  <p className="text-sm font-medium text-slate-500">{stat.title}</p>
                  <p className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-3 mb-8">
          <Card className="lg:col-span-2 border-none shadow-sm p-6">
             <CardHeader className="p-0 mb-6 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-xl">Crescimento de Receita</CardTitle>
                  <p className="text-sm text-slate-500">Consolidado de MRR das assinaturas.</p>
                </div>
             </CardHeader>
             <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={globalData}>
                    <defs>
                      <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} tickFormatter={(value) => `R$ ${value/1000}k`} />
                    <Tooltip 
                      contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                    />
                    <Area type="monotone" dataKey="rev" stroke="hsl(var(--primary))" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                  </AreaChart>
                </ResponsiveContainer>
             </div>
          </Card>
          
          <Card className="border-none shadow-sm p-6 flex flex-col justify-between">
            <CardHeader className="p-0">
               <CardTitle className="text-xl">Alertas de Sistema</CardTitle>
               <p className="text-sm text-slate-500">Status da infraestrutura e suporte.</p>
            </CardHeader>
            <div className="space-y-4 mt-6">
               <div className="flex items-center gap-4 p-4 rounded-2xl bg-orange-50 border border-orange-100">
                  <AlertCircle className="h-8 w-8 text-orange-500 shrink-0" />
                  <div>
                    <p className="text-sm font-bold text-orange-900">14 Pendências</p>
                    <p className="text-xs text-orange-700">Aguardando aprovação de cadastro.</p>
                  </div>
               </div>
               <div className="flex items-center gap-4 p-4 rounded-2xl bg-green-50 border border-green-100">
                  <CheckCircle2 className="h-8 w-8 text-green-500 shrink-0" />
                  <div>
                    <p className="text-sm font-bold text-green-900">Servidores Saudáveis</p>
                    <p className="text-xs text-green-700">Latência média: 24ms.</p>
                  </div>
               </div>
               <div className="pt-4">
                  <Button className="w-full bg-slate-900 hover:bg-slate-800 text-white rounded-xl py-6">Ver Logs Completos</Button>
               </div>
            </div>
          </Card>
        </div>

        <Card className="border-none shadow-sm overflow-hidden">
          <CardHeader className="border-b bg-white flex flex-row items-center justify-between p-6">
            <CardTitle className="text-xl">Últimos Lojistas Cadastrados</CardTitle>
            <Button variant="outline" size="sm" className="rounded-full">Ver Todos</Button>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow>
                  <TableHead className="px-6 py-4">Loja</TableHead>
                  <TableHead>Plano</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Faturamento (30d)</TableHead>
                  <TableHead className="text-right px-6">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {MOCK_MERCHANTS.map((merchant) => (
                  <TableRow key={merchant.id} className="hover:bg-slate-50 transition-colors">
                    <TableCell className="px-6 py-4 font-semibold text-slate-900 flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-slate-200 overflow-hidden shrink-0">
                        <img src={merchant.logoUrl} alt={merchant.name} className="h-full w-full object-cover" />
                      </div>
                      <div className="flex flex-col">
                        <span>{merchant.name}</span>
                        <span className="text-xs text-slate-400 font-normal">{merchant.slug}.mercadoagil.com</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="rounded-lg bg-primary/5 text-primary border-primary/10">{merchant.plan}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={merchant.status === 'active' ? 'default' : 'destructive'} className={merchant.status === 'active' ? 'bg-green-100 text-green-700 hover:bg-green-100 border-none' : 'border-none'}>
                        {merchant.status === 'active' ? 'Ativo' : 'Bloqueado'}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium text-slate-700">R$ {Math.floor(Math.random() * 20000).toLocaleString('pt-BR')}</TableCell>
                    <TableCell className="text-right px-6">
                      <Button variant="ghost" size="icon" className="rounded-full hover:bg-slate-200"><ChevronRight className="h-5 w-5" /></Button>
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
