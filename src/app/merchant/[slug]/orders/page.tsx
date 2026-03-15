
"use client";

import { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, ShoppingBag, List, Settings, Package, ChevronRight, Clock, User, MapPin, ArrowRight, Volume2, Loader2 } from "lucide-react";
import Link from 'next/link';
import { MOCK_ORDERS, OrderStatus } from "@/lib/mock-data";
import { useToast } from "@/hooks/use-toast";
import { textToSpeech } from "@/ai/flows/text-to-speech-flow";

export default function MerchantOrders({ params }: { params: { slug: string } }) {
  const [orders, setOrders] = useState(MOCK_ORDERS);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();

  const columns: { label: string; status: OrderStatus; color: string; nextStatus?: OrderStatus }[] = [
    { label: "Novos", status: "new", color: "bg-blue-500", nextStatus: "preparing" },
    { label: "Em Preparo", status: "preparing", color: "bg-orange-500", nextStatus: "delivering" },
    { label: "Em Entrega", status: "delivering", color: "bg-purple-500", nextStatus: "finished" },
    { label: "Concluídos", status: "finished", color: "bg-green-500" },
  ];

  const announceOrder = async (text: string) => {
    setIsSpeaking(true);
    try {
      const result = await textToSpeech({ text });
      if (audioRef.current) {
        audioRef.current.src = result.audioUri;
        audioRef.current.play();
      }
    } catch (error) {
      console.error("Erro ao anunciar áudio:", error);
    } finally {
      setIsSpeaking(false);
    }
  };

  const moveOrder = (orderId: string, currentStatus: OrderStatus) => {
    const currentCol = columns.find(c => c.status === currentStatus);
    if (currentCol?.nextStatus) {
      const order = orders.find(o => o.id === orderId);
      const nextCol = columns.find(c => c.status === currentCol.nextStatus);
      
      setOrders(prev => prev.map(o => 
        o.id === orderId ? { ...o, status: currentCol.nextStatus as OrderStatus } : o
      ));

      toast({
        title: "Status Atualizado",
        description: `O pedido #${orderId.toUpperCase()} agora está ${nextCol?.label}.`,
      });

      if (order) {
        announceOrder(`Pedido do ${order.customerName} mudou para ${nextCol?.label}`);
      }
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
    announceOrder(`Atenção! Um pedido foi cancelado.`);
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <audio ref={audioRef} hidden />
      
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
          <Link href={`/merchant/${params.slug}/orders`} className="flex items-center gap-3 px-4 py-2.5 bg-accent/10 text-accent rounded-xl font-bold">
            <ShoppingBag className="h-5 w-5" /> Pedidos
          </Link>
          <Link href={`/merchant/${params.slug}/catalog`} className="flex items-center gap-3 px-4 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors font-medium">
            <List className="h-5 w-5" /> Catálogo
          </Link>
          <Link href={`/merchant/${params.slug}/settings`} className="flex items-center gap-3 px-4 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors font-medium">
            <Settings className="h-5 w-5" /> Configurações
          </Link>
        </nav>
      </aside>

      <main className="flex-1 p-8 overflow-x-auto">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Gestão de Pedidos</h1>
            <p className="text-slate-500 mt-1">Acompanhe e anuncie os pedidos em tempo real.</p>
          </div>
          <div className="flex gap-4">
            <Button variant="outline" className="gap-2 rounded-xl" onClick={() => announceOrder("Sistema de áudio ativo e pronto para notificações")}>
              {isSpeaking ? <Loader2 className="h-4 w-4 animate-spin" /> : <Volume2 className="h-4 w-4" />}
              Testar Áudio
            </Button>
            <Button variant="outline" className="gap-2 rounded-xl">
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
                 <Badge variant="secondary" className="rounded-full bg-white shadow-sm">
                    {orders.filter(o => o.status === col.status).length}
                 </Badge>
              </div>

              <div className="flex-1 bg-slate-100/50 p-2 rounded-3xl border border-dashed border-slate-300 overflow-y-auto space-y-4">
                {orders.filter(o => o.status === col.status).map((order) => (
                  <Card key={order.id} className="border-none shadow-sm hover:shadow-md transition-shadow group rounded-2xl overflow-hidden">
                    <CardContent className="p-4 space-y-3">
                      <div className="flex justify-between items-start">
                        <span className="font-bold text-slate-900 text-sm">#{order.id.toUpperCase()}</span>
                        <span className="text-xs text-slate-400 font-medium">{new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm font-bold text-slate-800">
                          <User className="h-3 w-3 text-accent" /> {order.customerName}
                        </div>
                        <div className="flex items-start gap-2 text-xs text-slate-500 font-medium">
                          <MapPin className="h-3 w-3 text-slate-400 mt-0.5" /> {order.address}
                        </div>
                      </div>

                      <div className="pt-2 border-t space-y-1">
                        {order.items.map(item => (
                          <div key={item.id} className="flex justify-between text-xs font-medium">
                             <span className="text-slate-600">{item.quantity}x {item.productName}</span>
                          </div>
                        ))}
                      </div>

                      <div className="flex justify-between items-center pt-2">
                        <span className="font-black text-accent italic">R$ {order.total.toFixed(2)}</span>
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                           {col.nextStatus && (
                             <Button size="sm" className="h-9 px-3 text-xs gap-1 bg-slate-900 rounded-xl" onClick={() => moveOrder(order.id, order.status)}>
                               Avançar <ArrowRight className="h-3 w-3" />
                             </Button>
                           )}
                           {order.status === 'new' && (
                             <Button size="sm" variant="ghost" className="h-9 px-3 text-xs text-red-500 hover:text-red-600 hover:bg-red-50 rounded-xl" onClick={() => cancelOrder(order.id)}>
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
