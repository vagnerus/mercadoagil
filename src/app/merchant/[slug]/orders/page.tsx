
"use client";

import * as React from 'react';
import { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, ShoppingBag, List, Settings, Package, ChevronRight, Clock, User, ArrowRight, Printer, CheckCheck, Smartphone, LayoutGrid, Loader2, Wallet } from "lucide-react";
import Link from 'next/link';
import { OrderStatus, Order } from "@/lib/mock-data";
import { useToast } from "@/hooks/use-toast";
import { textToSpeech } from "@/ai/flows/text-to-speech-flow";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useFirestore, useCollection, updateDocumentNonBlocking, useMemoFirebase, useUser } from '@/firebase';
import { collection, query, orderBy, doc } from 'firebase/firestore';

export default function MerchantOrders({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = React.use(params);
  const { user } = useUser();
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [viewMode, setViewMode] = useState<'kanban' | 'kds'>('kanban');
  const [printOrder, setPrintOrder] = useState<Order | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();
  const db = useFirestore();

  // Memoziação da query com verificação de AUTH para evitar erros de permissão
  const ordersQuery = useMemoFirebase(() => {
    if (!user) return null; // Não tenta buscar se não houver usuário logado
    return query(collection(db, 'merchants', 'm1', 'orders'), orderBy('createdAt', 'desc'));
  }, [db, user]);

  const { data: firestoreOrders, isLoading } = useCollection(ordersQuery);

  const columns: { label: string; status: OrderStatus; color: string; nextStatus?: OrderStatus }[] = [
    { label: "Novos", status: "new", color: "bg-blue-500", nextStatus: "preparing" },
    { label: "Cozinha", status: "preparing", color: "bg-orange-500", nextStatus: "delivering" },
    { label: "Entrega", status: "delivering", color: "bg-purple-500", nextStatus: "finished" },
    { label: "Prontos", status: "finished", color: "bg-green-500" },
  ];

  useEffect(() => {
    if (firestoreOrders && firestoreOrders.length > 0) {
      const newestOrder = firestoreOrders[0];
      const isNew = (Date.now() - new Date(newestOrder.createdAt).getTime()) < 10000;
      if (isNew && newestOrder.status === 'new') {
        announceOrder(`Novo pedido recebido de ${newestOrder.customerName}`);
      }
    }
  }, [firestoreOrders]);

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
      const orderRef = doc(db, 'merchants', 'm1', 'orders', orderId);
      updateDocumentNonBlocking(orderRef, { status: currentCol.nextStatus });

      const nextCol = columns.find(c => c.status === currentCol.nextStatus);
      toast({
        title: "Status Atualizado",
        description: `O pedido agora está ${nextCol?.label}.`,
      });
    }
  };

  const handlePrint = (order: Order) => {
    setPrintOrder(order);
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-body">
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
          <Link href={`/merchant/${slug}/dashboard`} className="flex items-center gap-3 px-4 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors font-medium">
            <LayoutDashboard className="h-5 w-5" /> Dashboard
          </Link>
          <Link href={`/merchant/${slug}/orders`} className="flex items-center gap-3 px-4 py-2.5 bg-accent/10 text-accent rounded-xl font-bold">
            <ShoppingBag className="h-5 w-5" /> Pedidos
          </Link>
          <Link href={`/merchant/${slug}/payments`} className="flex items-center gap-3 px-4 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors font-medium">
            <Wallet className="h-5 w-5" /> Pagamentos
          </Link>
          <Link href={`/merchant/${slug}/settings`} className="flex items-center gap-3 px-4 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors font-medium">
            <Settings className="h-5 w-5" /> Configurações
          </Link>
        </nav>
      </aside>

      <main className="flex-1 p-8 overflow-x-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tighter italic">Gestão Operacional</h1>
            <p className="text-slate-500 font-medium">Controle total do fluxo de pedidos em tempo real.</p>
          </div>
          <div className="flex items-center gap-4 p-1 bg-white rounded-2xl shadow-sm border">
            <Button 
              variant={viewMode === 'kanban' ? 'default' : 'ghost'} 
              className="rounded-xl font-black italic gap-2 h-10 px-6"
              onClick={() => setViewMode('kanban')}
            >
              <LayoutGrid className="h-4 w-4" /> Kanban
            </Button>
            <Button 
              variant={viewMode === 'kds' ? 'default' : 'ghost'} 
              className="rounded-xl font-black italic gap-2 h-10 px-6"
              onClick={() => setViewMode('kds')}
            >
              <ShoppingBag className="h-4 w-4" /> Modo Cozinha
            </Button>
          </div>
        </header>

        {isLoading ? (
          <div className="h-[400px] flex items-center justify-center"><Loader2 className="animate-spin text-primary h-12 w-12" /></div>
        ) : (
          viewMode === 'kanban' ? (
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
                               <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">Via App Web</span>
                            </div>
                          </div>
                          
                          <div className="space-y-2 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                            <div className="flex items-center gap-2 text-sm font-black text-slate-800 italic">
                              <User className="h-4 w-4 text-primary" /> {order.customerName}
                            </div>
                          </div>

                          <div className="space-y-2 py-2">
                            <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-3">Itens do Pedido</p>
                            {order.items?.map((item: any, i: number) => (
                              <div key={i} className="flex justify-between items-center text-xs font-bold">
                                 <span className="text-slate-600 bg-slate-100 px-2 py-1 rounded-lg">{item.quantity}x</span>
                                 <span className="flex-1 px-3 truncate text-slate-900">{item.productName}</span>
                              </div>
                            ))}
                          </div>

                          <div className="flex justify-between items-center pt-4 border-t border-dashed">
                            <span className="font-black text-primary italic text-xl">R$ {order.total.toFixed(2)}</span>
                            <div className="flex gap-2">
                               <Button size="icon" variant="ghost" className="h-10 w-10 rounded-xl hover:bg-slate-100 text-slate-400" onClick={() => handlePrint(order)}>
                                 <Printer className="h-4 w-4" />
                               </Button>
                               {col.nextStatus && (
                                 <Button size="sm" className="h-10 px-4 text-xs gap-2 bg-slate-900 rounded-xl font-black italic shadow-lg shadow-slate-200" onClick={() => moveOrder(order.id, order.status)}>
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
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
               {firestoreOrders?.filter((o: any) => o.status === 'preparing').map((order: any) => (
                 <Card key={order.id} className="border-4 border-orange-200 shadow-2xl rounded-[40px] overflow-hidden bg-white">
                   <div className="bg-orange-500 p-6 text-white flex justify-between items-center">
                      <h3 className="text-2xl font-black italic">#{order.id.toUpperCase()}</h3>
                      <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-2xl font-black">
                         <Clock className="h-5 w-5" /> {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
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
                      <div className="flex gap-4 pt-6">
                         <Button className="flex-1 h-16 bg-green-500 hover:bg-green-600 rounded-2xl font-black text-xl italic shadow-xl shadow-green-100 gap-3" onClick={() => moveOrder(order.id, 'preparing')}>
                            <CheckCheck className="h-6 w-6" /> PRONTO
                         </Button>
                         <Button variant="outline" size="icon" className="h-16 w-16 rounded-2xl border-2 border-slate-100 hover:bg-slate-50" onClick={() => handlePrint(order)}>
                            <Printer className="h-6 w-6 text-slate-400" />
                         </Button>
                      </div>
                   </CardContent>
                 </Card>
               ))}
            </div>
          )
        )}
      </main>

      <Dialog open={!!printOrder} onOpenChange={() => setPrintOrder(null)}>
        <DialogContent className="sm:max-w-xs rounded-[40px] border-none shadow-2xl p-0 overflow-hidden font-mono">
           <div className="p-10 space-y-6 text-slate-800 text-center">
              <div className="border-b-2 border-dashed border-slate-200 pb-4">
                 <h2 className="text-2xl font-black uppercase tracking-tighter">MERCADO ÁGIL</h2>
                 <p className="text-xs font-bold mt-1">{slug.toUpperCase()}</p>
                 <p className="text-[10px] mt-2">--------------------------------</p>
                 <p className="text-sm font-black mt-2">PEDIDO: #{printOrder?.id.toUpperCase()}</p>
                 <p className="text-[10px]">{new Date().toLocaleString()}</p>
              </div>
              
              <div className="space-y-2 text-left text-sm">
                 <p className="font-bold">CLIENTE: {printOrder?.customerName}</p>
                 <p className="text-[10px]">ENDEREÇO: {printOrder?.address}</p>
              </div>

              <div className="border-y-2 border-dashed border-slate-200 py-4 text-left">
                 {printOrder?.items?.map((item: any, i: number) => (
                   <div key={i} className="flex justify-between text-xs font-bold mb-1">
                      <span>{item.quantity}x {item.productName}</span>
                      <span>R$ {(item.price * item.quantity).toFixed(2)}</span>
                   </div>
                 ))}
              </div>

              <div className="flex justify-between items-center text-xl font-black">
                 <span>TOTAL:</span>
                 <span>R$ {printOrder?.total.toFixed(2)}</span>
              </div>

              <div className="pt-4 flex flex-col items-center gap-4">
                 <div className="h-32 w-32 bg-slate-100 rounded-2xl flex items-center justify-center border-2 border-dashed border-slate-300">
                    <Smartphone className="h-12 w-12 text-slate-300" />
                 </div>
                 <p className="text-[10px] uppercase font-bold text-slate-400">Escaneie para rastrear</p>
              </div>

              <Button className="w-full bg-slate-900 text-white rounded-2xl gap-2 font-bold" onClick={() => {
                window.print();
                setPrintOrder(null);
              }}>
                 <Printer className="h-4 w-4" /> Imprimir Agora
              </Button>
           </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
