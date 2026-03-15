
"use client";

import * as React from 'react';
import { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, ShoppingBag, List, Settings, Package, 
  ChevronRight, Clock, User, ArrowRight, Printer, CheckCheck, 
  Smartphone, LayoutGrid, Loader2, Wallet, Utensils, 
  Table as TableIcon, Bell, FileText, Share2
} from "lucide-react";
import Link from 'next/link';
import { OrderStatus, Order } from "@/lib/mock-data";
import { useToast } from "@/hooks/use-toast";
import { textToSpeech } from "@/ai/flows/text-to-speech-flow";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useFirestore, useCollection, updateDocumentNonBlocking, useMemoFirebase, useUser } from '@/firebase';
import { collection, query, orderBy, doc } from 'firebase/firestore';

export default function MerchantOrders({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = React.use(params);
  const { user } = useUser();
  const [viewMode, setViewMode] = useState<'kanban' | 'kds' | 'tables'>('kanban');
  const [printOrder, setPrintOrder] = useState<Order | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();
  const db = useFirestore();

  const ordersQuery = useMemoFirebase(() => {
    if (!user) return null;
    return query(collection(db, 'merchants', 'm1', 'orders'), orderBy('createdAt', 'desc'));
  }, [db, user]);

  const { data: firestoreOrders, isLoading } = useCollection(ordersQuery);

  const columns: { label: string; status: OrderStatus; color: string; nextStatus?: OrderStatus }[] = [
    { label: "Novos", status: "new", color: "bg-blue-500", nextStatus: "preparing" },
    { label: "Cozinha", status: "preparing", color: "bg-orange-500", nextStatus: "delivering" },
    { label: "Entrega", status: "delivering", color: "bg-purple-500", nextStatus: "finished" },
    { label: "Prontos", status: "finished", color: "bg-green-500" },
  ];

  const moveOrder = (orderId: string, currentStatus: OrderStatus) => {
    const currentCol = columns.find(c => c.status === currentStatus);
    if (currentCol?.nextStatus) {
      const orderRef = doc(db, 'merchants', 'm1', 'orders', orderId);
      updateDocumentNonBlocking(orderRef, { status: currentCol.nextStatus });
      toast({ title: "Status Atualizado", description: `O pedido avançou para ${currentCol.nextStatus}.` });
    }
  };

  const handleEmitNFCe = (orderId: string) => {
    toast({ title: "Processando NFC-e...", description: "Nota fiscal emitida e vinculada ao pedido." });
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-body">
      <audio ref={audioRef} hidden />
      
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
          <Link href={`/merchant/${slug}/orders`} className="flex items-center gap-3 px-4 py-2.5 bg-accent/10 text-accent rounded-xl font-bold">
            <ShoppingBag className="h-5 w-5" /> Pedidos
          </Link>
          <Link href={`/merchant/${slug}/waiter`} className="flex items-center gap-3 px-4 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors font-medium">
            <Smartphone className="h-5 w-5 text-primary" /> App Garçom
          </Link>
          <Link href={`/merchant/${slug}/settings`} className="flex items-center gap-3 px-4 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors font-medium">
            <Settings className="h-5 w-5" /> Configurações
          </Link>
        </nav>
      </aside>

      <main className="flex-1 p-8 overflow-x-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tighter italic">Centro de Comandos</h1>
            <p className="text-slate-500 font-medium">Centralização de delivery, balcão e salão.</p>
          </div>
          <div className="flex items-center gap-2 p-1 bg-white rounded-2xl shadow-sm border">
            <Button 
              variant={viewMode === 'kanban' ? 'default' : 'ghost'} 
              className="rounded-xl font-black italic gap-2 h-10 px-4"
              onClick={() => setViewMode('kanban')}
            >
              <LayoutGrid className="h-4 w-4" /> Kanban
            </Button>
            <Button 
              variant={viewMode === 'kds' ? 'default' : 'ghost'} 
              className="rounded-xl font-black italic gap-2 h-10 px-4"
              onClick={() => setViewMode('kds')}
            >
              <Utensils className="h-4 w-4" /> Cozinha
            </Button>
            <Button 
              variant={viewMode === 'tables' ? 'default' : 'ghost'} 
              className="rounded-xl font-black italic gap-2 h-10 px-4"
              onClick={() => setViewMode('tables')}
            >
              <TableIcon className="h-4 w-4" /> Mesas
            </Button>
          </div>
        </header>

        {isLoading ? (
          <div className="h-[400px] flex items-center justify-center"><Loader2 className="animate-spin text-primary h-12 w-12" /></div>
        ) : (
          <>
            {viewMode === 'kanban' && (
              <div className="flex gap-8 min-w-max pb-6 h-[calc(100vh-250px)]">
                {columns.map((col) => (
                  <div key={col.status} className="w-80 flex flex-col gap-6">
                    <div className="flex items-center justify-between px-4">
                       <div className="flex items-center gap-3">
                         <div className={`h-4 w-4 rounded-full ${col.color} shadow-lg shadow-${col.color}/30`}></div>
                         <h3 className="font-black text-slate-700 italic text-lg">{col.label}</h3>
                       </div>
                       <Badge className="bg-white text-slate-400 font-black border-none shadow-sm rounded-lg px-3">
                          {firestoreOrders?.filter((o: any) => o.status === col.status).length || 0}
                       </Badge>
                    </div>

                    <div className="flex-1 bg-slate-100/30 p-4 rounded-[40px] border border-dashed border-slate-200 overflow-y-auto space-y-4 no-scrollbar">
                      {firestoreOrders?.filter((o: any) => o.status === col.status).map((order: any) => (
                        <Card key={order.id} className="border-none shadow-sm hover:shadow-xl transition-all group rounded-[32px] overflow-hidden bg-white">
                          <CardContent className="p-6 space-y-4">
                            <div className="flex justify-between items-start">
                              <div className="flex flex-col">
                                 <span className="font-black text-slate-900 text-sm italic">#{order.id.toUpperCase()}</span>
                                 <Badge variant="outline" className="mt-1 text-[8px] font-black uppercase text-primary border-primary/20">
                                    {order.tableId ? `Mesa ${order.tableId}` : 'Delivery'}
                                 </Badge>
                              </div>
                              <Button size="icon" variant="ghost" className="h-8 w-8 rounded-lg" onClick={() => handleEmitNFCe(order.id)}>
                                 <FileText className="h-4 w-4 text-slate-400" />
                              </Button>
                            </div>
                            
                            <div className="space-y-1">
                              <p className="text-xs font-black text-slate-800">{order.customerName}</p>
                              <p className="text-[10px] font-bold text-slate-400 flex items-center gap-1"><Clock className="h-3 w-3" /> {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                            </div>

                            <div className="flex justify-between items-center pt-4 border-t border-dashed">
                              <span className="font-black text-primary italic text-lg">R$ {order.total.toFixed(2)}</span>
                              <div className="flex gap-2">
                                 {col.nextStatus && (
                                   <Button size="sm" className="h-10 px-4 text-xs gap-2 bg-slate-900 rounded-xl font-black italic" onClick={() => moveOrder(order.id, order.status)}>
                                     Avançar <ArrowRight className="h-4 w-4" />
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
            )}

            {viewMode === 'kds' && (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                 {firestoreOrders?.filter((o: any) => o.status === 'preparing').map((order: any) => (
                   <Card key={order.id} className="border-4 border-orange-200 shadow-2xl rounded-[40px] overflow-hidden bg-white">
                     <div className="bg-orange-500 p-6 text-white flex justify-between items-center">
                        <h3 className="text-2xl font-black italic">#{order.id.toUpperCase()}</h3>
                        <Badge className="bg-white/20 text-white font-black">{order.tableId ? `MESA ${order.tableId}` : 'DELIVERY'}</Badge>
                     </div>
                     <CardContent className="p-8 space-y-6">
                        <div className="space-y-4">
                           {order.items?.map((item: any, i: number) => (
                             <div key={i} className="flex items-center gap-6 p-4 bg-slate-50 rounded-3xl border border-slate-100">
                                <span className="text-3xl font-black text-orange-500">{item.quantity}x</span>
                                <span className="text-xl font-black text-slate-900">{item.productName}</span>
                             </div>
                           ))}
                        </div>
                        <Button className="w-full h-16 bg-green-500 hover:bg-green-600 rounded-2xl font-black text-xl italic shadow-xl shadow-green-100 gap-3" onClick={() => moveOrder(order.id, 'preparing')}>
                           <CheckCheck className="h-6 w-6" /> PRONTO PARA SERVIR
                        </Button>
                     </CardContent>
                   </Card>
                 ))}
              </div>
            )}

            {viewMode === 'tables' && (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                 {[1,2,3,4,5,6,7,8,9,10,11,12].map(num => {
                   const tableOrder = firestoreOrders?.find((o: any) => o.tableId === num.toString() && o.status !== 'finished');
                   return (
                     <Card key={num} className={`border-none shadow-sm rounded-[35px] p-6 text-center space-y-4 transition-all ${tableOrder ? 'bg-primary text-white scale-105' : 'bg-white'}`}>
                        <p className={`text-[10px] font-black uppercase tracking-widest ${tableOrder ? 'text-white/60' : 'text-slate-400'}`}>Mesa</p>
                        <p className="text-4xl font-black italic tracking-tighter">{num}</p>
                        {tableOrder ? (
                          <div className="space-y-2">
                             <p className="text-xs font-bold italic">R$ {tableOrder.total.toFixed(2)}</p>
                             <Badge className="bg-white/20 text-white border-none font-black italic text-[8px]">EM CONSUMO</Badge>
                          </div>
                        ) : (
                          <Badge variant="outline" className="text-[8px] font-black uppercase text-slate-300 border-slate-100">Vazia</Badge>
                        )}
                     </Card>
                   );
                 })}
              </div>
            )}
          </>
        )}
      </main>

      <Dialog open={!!printOrder} onOpenChange={() => setPrintOrder(null)}>
        <DialogContent className="sm:max-w-xs rounded-[40px] border-none shadow-2xl p-0 overflow-hidden font-mono">
           <div className="p-10 space-y-6 text-slate-800 text-center">
              <div className="border-b-2 border-dashed border-slate-200 pb-4">
                 <h2 className="text-2xl font-black uppercase tracking-tighter">MERCADO ÁGIL</h2>
                 <p className="text-[10px] mt-2">--------------------------------</p>
                 <p className="text-sm font-black mt-2">PEDIDO: #{printOrder?.id.toUpperCase()}</p>
              </div>
              <Button className="w-full bg-slate-900 text-white rounded-2xl gap-2 font-bold" onClick={() => window.print()}>
                 <Printer className="h-4 w-4" /> Imprimir Cupom
              </Button>
           </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
