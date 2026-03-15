import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Store, TrendingUp, AlertCircle, LayoutDashboard, Settings, Package, CreditCard } from "lucide-react";
import { MOCK_MERCHANTS } from "@/lib/mock-data";
import Link from 'next/link';

export default function AdminDashboard() {
  const stats = [
    { title: "Total de Lojas", value: "542", icon: Store, color: "text-blue-600", bg: "bg-blue-100" },
    { title: "Faturamento Assinaturas", value: "R$ 125.400", icon: TrendingUp, color: "text-green-600", bg: "bg-green-100" },
    { title: "Usuários Ativos", value: "12.8k", icon: Users, color: "text-purple-600", bg: "bg-purple-100" },
    { title: "Pendências", value: "14", icon: AlertCircle, color: "text-orange-600", bg: "bg-orange-100" },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-white hidden lg:block">
        <div className="p-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-primary p-1 rounded-md">
              <Store className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-lg text-slate-800 tracking-tight">Master Admin</span>
          </Link>
        </div>
        <nav className="px-4 space-y-2">
          <Link href="/admin/dashboard" className="flex items-center gap-3 px-4 py-2 bg-primary/10 text-primary rounded-lg font-medium">
            <LayoutDashboard className="h-5 w-5" /> Dashboard
          </Link>
          <Link href="#" className="flex items-center gap-3 px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
            <Store className="h-5 w-5" /> Lojistas
          </Link>
          <Link href="#" className="flex items-center gap-3 px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
            <CreditCard className="h-5 w-5" /> Planos
          </Link>
          <Link href="#" className="flex items-center gap-3 px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
            <Settings className="h-5 w-5" /> Configurações
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Métricas Globais</h1>
            <p className="text-slate-500">Bem-vindo ao centro de controle da plataforma.</p>
          </div>
          <div className="flex gap-4">
             <Badge variant="outline" className="px-3 py-1">Versão 2.4.0</Badge>
          </div>
        </header>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          {stats.map((stat, i) => (
            <Card key={i} className="border-none shadow-sm overflow-hidden">
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

        <Card className="border-none shadow-sm">
          <CardHeader className="border-b bg-white">
            <CardTitle className="text-lg">Últimos Lojistas Cadastrados</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Loja</TableHead>
                  <TableHead>Plano</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Data Cadastro</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {MOCK_MERCHANTS.map((merchant) => (
                  <TableRow key={merchant.id}>
                    <TableCell className="font-medium flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-slate-200 overflow-hidden">
                        <img src={merchant.logoUrl} alt={merchant.name} className="h-full w-full object-cover" />
                      </div>
                      {merchant.name}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{merchant.plan}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={merchant.status === 'active' ? 'default' : 'destructive'} className={merchant.status === 'active' ? 'bg-green-100 text-green-700 hover:bg-green-100' : ''}>
                        {merchant.status === 'active' ? 'Ativo' : 'Bloqueado'}
                      </Badge>
                    </TableCell>
                    <TableCell>{merchant.createdAt}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">Gerenciar</Button>
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
