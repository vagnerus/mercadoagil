
"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, ShoppingBag, List, Settings, Package, ChevronRight, Clock, User, MapPin, ArrowRight } from "lucide-react";
import Link from 'next/link';
import { MOCK_ORDERS, OrderStatus } from "@/lib/mock-data";
import { useToast } from "@/hooks/use-toast";

export default function MerchantOrders({ params }: { params: { slug: string } }) {
  const [orders, setOrders] = useState(MOCK_ORDERS);
  const { toast } = useToast();

  const columns: { label: string; status: OrderStatus; color: string; nextStatus?: OrderStatus }[] = [
    { label: "Novos", status: "new", color: "bg-blue-500", nextStatus: "preparing" },
    { label: "Em Preparo", status: "preparing", color: "bg-orange-500", nextStatus: "delivering" },
    { label: "Em Entrega", status: "delivering", color: "bg-purple-500", nextStatus: "finished" },
    { label: "Concluídos", status: "finished", color: "bg-green-500" },
  ];

  const moveOrder = (orderId: string, currentStatus: OrderStatus) => {
    const currentCol = columns.find(c => c.status === currentStatus);
    if (currentCol?.nextStatus) {
      setOrders(prev => prev.map(o => 
        o.id === orderId ? { ...o, status: currentCol.nextStatus as OrderStatus } : o
      ));
      toast({
        title: "Status Atualizado",
        description: `O pedido #${orderId.toUpperCase()} avançou na fila.`,
      });
    }
  };

  const cancelOrder = (orderId: string) => {
    setOrders(prev => prev.map(o => 
      o.id === orderId ? { ...o, status: 'cancelled' } : o
    ));
    toast({
      title: "Pedido Cancelado",
      description: `O pedido #${orderId.toUpperCase()} foi marcado como cancelado.`,
      variant: "destructive"
    });
  };

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
          <Link href={`/merchant/${params.slug}/dashboard`} className="flex items-center gap-3 px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
            <LayoutDashboard className="h-5 w-5" /> Dashboard
          </Link>
          <Link href={`/merchant/${params.slug}/orders`} className="flex items-center gap-3 px-4 py-2 bg-accent/10 text-accent rounded-lg font-medium">
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

      <main className="flex-1 p-8 overflow-x-auto">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Gerenciador de Pedidos</h1>
            <p className="text-slate-500">Acompanhe e atualize o status dos pedidos em tempo real.</p>
          </div>
          <div className="flex gap-4">
            <Button variant="outline" className="gap-2">
              <Clock className="h-4 w-4" /> Histórico
            </Button>
          </div>
        </header>

        <div className="flex gap-6 min-w-max pb-4 h-[calc(100vh-200px)]">
          {columns.map((col) => (
            <div key={col.status} className="w-80 flex flex-col gap-4">
              <div className="flex items-center justify-between px-2">
                 <div className="flex items-center gap-2">
                   <div className={`h-3 w-3 rounded-full ${col.color}`}></div>
                   <h3 className="font-bold text-slate-700">{col.label}</h3>
                 </div>
                 <Badge variant="secondary" className="rounded-full">
                    {orders.filter(o => o.status === col.status).length}
                 </Badge>
              </div>

              <div className="flex-1 bg-slate-100/50 p-2 rounded-xl border border-dashed border-slate-300 overflow-y-auto space-y-4">
                {orders.filter(o => o.status === col.status).map((order) => (
                  <Card key={order.id} className="border-none shadow-sm hover:shadow-md transition-shadow group">
                    <CardContent className="p-4 space-y-3">
                      <div className="flex justify-between items-start">
                        <span className="font-bold text-slate-900 text-sm">#{order.id.toUpperCase()}</span>
                        <span className="text-xs text-slate-400">{new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm font-medium">
                          <User className="h-3 w-3 text-slate-400" /> {order.customerName}
                        </div>
                        <div className="flex items-start gap-2 text-xs text-slate-500">
                          <MapPin className="h-3 w-3 text-slate-400 mt-0.5" /> {order.address}
                        </div>
                      </div>

                      <div className="pt-2 border-t space-y-1">
                        {order.items.map(item => (
                          <div key={item.id} className="flex justify-between text-xs">
                             <span className="text-slate-600">{item.quantity}x {item.productName}</span>
                          </div>
                        ))}
                      </div>

                      <div className="flex justify-between items-center pt-2">
                        <span className="font-bold text-accent">R$ {order.total.toFixed(2)}</span>
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                           {col.nextStatus && (
                             <Button size="sm" variant="outline" className="h-8 px-2 text-xs gap-1" onClick={() => moveOrder(order.id, order.status)}>
                               Avançar <ArrowRight className="h-3 w-3" />
                             </Button>
                           )}
                           {order.status === 'new' && (
                             <Button size="sm" variant="ghost" className="h-8 px-2 text-xs text-red-500 hover:text-red-600" onClick={() => cancelOrder(order.id)}>
                               Cancelar
                             </Button>
                           )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
