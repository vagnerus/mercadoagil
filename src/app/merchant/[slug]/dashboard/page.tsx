import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Package, DollarSign, Clock, LayoutDashboard, List, Settings, UtensilsCrossed } from "lucide-react";
import Link from 'next/link';

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

        <div className="grid gap-6 md:grid-cols-2">
           <Card className="border-none shadow-sm">
             <CardHeader>
                <CardTitle className="text-lg">Destaque do Período</CardTitle>
             </CardHeader>
             <CardContent className="h-64 flex items-center justify-center text-slate-400 bg-slate-50/50 rounded-b-xl">
                Gráfico de Vendas (Simulado)
             </CardContent>
           </Card>
           
           <Card className="border-none shadow-sm">
             <CardHeader>
                <CardTitle className="text-lg">Ações Rápidas</CardTitle>
             </CardHeader>
             <CardContent className="space-y-4">
               <Button className="w-full justify-start py-6 bg-accent hover:bg-accent/90" asChild>
                 <Link href={`/merchant/${params.slug}/catalog`}>
                   <List className="mr-3 h-5 w-5" /> Adicionar Novo Produto
                 </Link>
               </Button>
               <Button variant="outline" className="w-full justify-start py-6" asChild>
                  <Link href={`/merchant/${params.slug}/orders`}>
                    <ShoppingBag className="mr-3 h-5 w-5" /> Ver Painel de Pedidos
                  </Link>
               </Button>
             </CardContent>
           </Card>
        </div>
      </main>
    </div>
  );
}