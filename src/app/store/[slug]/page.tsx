
"use client";

import * as React from 'react';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ShoppingCart, Search, ChevronRight, Plus, ArrowLeft, 
  Star, Heart, Zap, ShoppingBag, MapPin, 
  Phone, CreditCard, Landmark, Clock, 
  Scissors, Calendar as CalendarIcon, User, Timer, 
  CheckCircle2, Info, MessageCircle, Map as MapIcon, Loader2,
  Filter, Share2, HeartPulse, Sparkles, Wand2, Bot, LogIn
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useFirestore, useCollection, useMemoFirebase, addDocumentNonBlocking } from '@/firebase';
import { collection, query, where, limit, serverTimestamp, orderBy } from 'firebase/firestore';
import Link from 'next/link';
import { cn } from "@/lib/utils";

export default function StoreFront() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;
  const db = useFirestore();
  const { toast } = useToast();

  const merchantQuery = useMemoFirebase(() => query(
    collection(db, 'merchants'), 
    where('slug', '==', slug), 
    limit(1)
  ), [db, slug]);
  const { data: merchantData, isLoading: loadingMerchant } = useCollection(merchantQuery);
  const merchant = merchantData?.[0];

  const productsQuery = useMemoFirebase(() => {
    if (!merchant?.id) return null;
    return query(collection(db, 'merchants', merchant.id, 'products'), orderBy('createdAt', 'desc'));
  }, [db, merchant?.id]);
  const { data: products } = useCollection(productsQuery);

  const servicesQuery = useMemoFirebase(() => {
    if (!merchant?.id) return null;
    return query(collection(db, 'merchants', merchant.id, 'services'), orderBy('createdAt', 'desc'));
  }, [db, merchant?.id]);
  const { data: services } = useCollection(servicesQuery);

  const [cart, setCart] = useState<{item: any, type: 'product' | 'service', quantity: number}[]>([]);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [orderFinished, setOrderFinished] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [isAiConciergeOpen, setIsAiConciergeOpen] = useState(false);
  
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    phone: "",
    address: "",
    time: "14:00"
  });

  const isServiceBusiness = merchant?.segment === 'BEAUTY' || merchant?.segment === 'HEALTH' || merchant?.segment === 'SERVICE';

  const categories = ["Todos", "Pacotes", ...Array.from(new Set([
    ...(products?.map(p => p.category) || []),
    ...(services?.map(s => s.category) || [])
  ].filter(Boolean)))];

  const filteredItems = {
    products: products?.filter(p => 
      (selectedCategory === "Todos" || p.category === selectedCategory) &&
      p.name.toLowerCase().includes(searchTerm.toLowerCase())
    ),
    services: services?.filter(s => 
      (selectedCategory === "Todos" || s.category === selectedCategory) &&
      s.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  };

  const addToCart = (item: any, type: 'product' | 'service') => {
    setCart(prev => {
      const existing = prev.find(i => i.item.id === item.id);
      if (existing) {
        return prev.map(i => i.item.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { item, type, quantity: 1 }];
    });
    
    setSelectedItem(null);
    if (type === 'service') {
      setIsCheckoutOpen(true);
    } else {
      toast({ title: "Adicionado!", description: `${item.name} está na sua sacola.` });
    }
  };

  const handleFinishOrder = async () => {
    if (!customerInfo.name || !customerInfo.phone) {
      toast({ title: "Dados Incompletos", description: "Preencha seu nome e WhatsApp.", variant: "destructive" });
      return;
    }

    try {
      const orderId = Math.random().toString(36).substring(7);
      const total = cart.reduce((acc, i) => acc + (i.item.price * i.quantity), 0);

      const orderData = {
        id: orderId,
        customerName: customerInfo.name,
        customerPhone: customerInfo.phone,
        address: customerInfo.address,
        orderType: isServiceBusiness ? 'appointment' : 'delivery',
        status: isServiceBusiness ? 'pending' : 'new',
        createdAt: new Date().toISOString(),
        timestamp: serverTimestamp(),
        total,
        time: customerInfo.time,
        items: cart.map(i => ({
          name: i.item.name,
          quantity: i.quantity,
          price: i.item.price
        }))
      };

      addDocumentNonBlocking(collection(db, 'merchants', merchant?.id!, 'orders'), orderData);
      
      if (isServiceBusiness) {
        addDocumentNonBlocking(collection(db, 'merchants', merchant?.id!, 'appointments'), {
          customer: customerInfo.name,
          phone: customerInfo.phone,
          service: cart[0]?.item?.name || "Serviço",
          staff: "Qualquer Profissional",
          time: customerInfo.time,
          date: new Date().toISOString().split('T')[0],
          status: 'pending',
          createdAt: new Date().toISOString()
        });
      }

      setOrderFinished(orderId);
      setIsCheckoutOpen(false);
      toast({ title: "Sucesso!", description: "Seu pedido foi enviado." });
    } catch (e) {
      toast({ title: "Erro", description: "Falha ao processar pedido.", variant: "destructive" });
    }
  };

  if (loadingMerchant) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white space-y-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="font-black italic text-slate-400 uppercase tracking-widest">Sincronizando Vitrine Elite...</p>
      </div>
    );
  }

  const totalCart = cart.reduce((a, b) => a + (b.item.price * b.quantity), 0);

  return (
    <div className="max-w-xl mx-auto min-h-screen bg-white pb-44 relative font-body overflow-x-hidden">
      {/* Header Interativo */}
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b p-4 flex items-center justify-between">
         <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-primary flex items-center justify-center text-white shadow-lg">
               {isServiceBusiness ? <Scissors className="h-5 w-5" /> : <ShoppingBag className="h-5 w-5" />}
            </div>
            <div>
               <h1 className="font-black text-sm uppercase italic leading-none">{merchant?.name}</h1>
               <Badge className="bg-green-100 text-green-700 border-none px-2 py-0.5 mt-1 font-black italic text-[7px] uppercase">Aberto Agora</Badge>
            </div>
         </div>
         <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" asChild className="rounded-full bg-slate-50">
               <Link href="/login"><LogIn className="h-4 w-4 text-slate-400" /></Link>
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setIsAiConciergeOpen(true)} className="rounded-full bg-primary/10 text-primary animate-pulse">
               <Bot className="h-5 w-5" />
            </Button>
         </div>
      </div>

      {orderFinished ? (
        <div className="p-8 text-center space-y-8 animate-in zoom-in-95 duration-500">
           <div className="h-24 w-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto shadow-xl shadow-green-100">
              <CheckCircle2 className="h-12 w-12" />
           </div>
           <h2 className="text-3xl font-black italic uppercase tracking-tighter">Pedido Finalizado!</h2>
           <Button className="w-full h-16 bg-slate-900 rounded-[30px] font-black italic" onClick={() => setOrderFinished(null)}>Voltar ao Início</Button>
        </div>
      ) : (
        <>
          {/* Hero Banner */}
          <div className="relative h-64 w-full overflow-hidden">
            <img src={merchant?.bannerUrl || `https://picsum.photos/seed/${slug}/1200/400`} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-white via-white/40 to-transparent"></div>
            <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
               <div className="flex items-center gap-4">
                  <div className="h-20 w-20 rounded-3xl bg-white p-1 shadow-2xl border-4 border-white">
                     <img src={merchant?.logoUrl || `https://picsum.photos/seed/logo/200/200`} className="w-full h-full object-cover rounded-[20px]" />
                  </div>
                  <div className="space-y-1">
                     <h2 className="text-2xl font-black italic text-slate-900 leading-none uppercase tracking-tighter">{merchant?.name}</h2>
                     <div className="flex items-center gap-2">
                        <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                        <span className="text-xs font-black">4.9 (150+ avaliações)</span>
                     </div>
                  </div>
               </div>
            </div>
          </div>

          <div className="px-6 space-y-10 mt-6">
             {/* Busca Global */}
             <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <Input 
                  className="pl-12 h-16 rounded-[25px] bg-slate-50 border-none font-bold text-lg shadow-inner" 
                  placeholder="Busque por serviços ou itens..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
             </div>

             {/* Categorias Pills */}
             <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={cn(
                      "px-6 py-3 rounded-full whitespace-nowrap font-black italic text-[10px] uppercase tracking-widest transition-all",
                      selectedCategory === cat ? "bg-primary text-white shadow-lg scale-105" : "bg-slate-50 text-slate-400 border"
                    )}
                  >
                    {cat}
                  </button>
                ))}
             </div>

             {/* Clube Ágil & Cashback */}
             {merchant?.settings?.enableCashback && (
               <Card className="border-none bg-primary/5 rounded-[40px] p-8 flex items-center justify-between border border-primary/10 overflow-hidden relative group cursor-pointer">
                  <div className="relative z-10 space-y-2">
                     <Badge className="bg-primary text-white border-none font-black italic text-[8px] uppercase tracking-widest">CLUBE ÁGIL ACTIVE</Badge>
                     <h3 className="text-xl font-black italic uppercase tracking-tighter">Ganhe {merchant.settings.cashbackPercentage}% de Volta</h3>
                     <p className="text-[10px] font-bold text-slate-500 uppercase">Seu dinheiro vale mais aqui. Compre e acumule.</p>
                  </div>
                  <Zap className="h-16 w-16 text-primary opacity-10 absolute -right-4 -bottom-4 group-hover:scale-125 transition-transform" />
               </Card>
             )}

             {/* Listagem Dinâmica */}
             <div className="space-y-8">
                {isServiceBusiness ? (
                  <div className="grid gap-4">
                     {filteredItems.services?.map(s => (
                       <div key={s.id} onClick={() => setSelectedItem({...s, type: 'service'})} className="p-6 bg-white rounded-[35px] flex items-center gap-5 border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
                          <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                             <Scissors className="h-8 w-8" />
                          </div>
                          <div className="flex-1 min-w-0">
                             <p className="font-black text-slate-900 uppercase italic text-sm truncate">{s.name}</p>
                             <div className="flex items-center gap-3 mt-1">
                                <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1 uppercase tracking-tighter"><Timer className="h-3 w-3" /> {s.duration} min</span>
                                <span className="text-[10px] font-black text-primary italic uppercase">R$ {s.price.toFixed(2)}</span>
                             </div>
                          </div>
                          <div className="h-10 w-10 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-primary transition-all">
                             <Plus className="h-5 w-5 text-slate-300 group-hover:text-white" />
                          </div>
                       </div>
                     ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                     {filteredItems.products?.map(p => (
                       <div key={p.id} onClick={() => setSelectedItem({...p, type: 'product'})} className="bg-white p-4 rounded-[35px] border border-slate-50 shadow-sm space-y-4 hover:shadow-2xl transition-all group">
                          <div className="h-40 w-full bg-slate-50 rounded-2xl overflow-hidden relative">
                             <img src={p.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                             <Badge className="absolute top-2 right-2 bg-black/50 backdrop-blur-md border-none font-black italic text-[8px] uppercase">R$ {p.price.toFixed(2)}</Badge>
                          </div>
                          <div className="px-2">
                             <p className="font-black text-xs uppercase italic truncate text-slate-900">{p.name}</p>
                             <p className="text-[8px] font-bold text-slate-400 uppercase mt-1">Acumule Cashback</p>
                          </div>
                       </div>
                     ))}
                  </div>
                )}
             </div>

             {/* Social Proof */}
             <div className="space-y-6 pt-6">
                <div className="flex justify-between items-center">
                   <h3 className="text-xl font-black italic uppercase tracking-tighter leading-none">O que dizem os clientes</h3>
                   <span className="text-[8px] font-bold text-primary uppercase border-b-2 border-primary">Ler todos</span>
                </div>
                <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4">
                   {[1,2,3].map(i => (
                     <Card key={i} className="min-w-[280px] border-none bg-slate-50 p-6 rounded-[35px] space-y-4 shadow-inner">
                        <div className="flex items-center gap-3">
                           <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center font-black italic text-xs text-primary">C</div>
                           <div>
                              <p className="font-black text-[10px] uppercase italic">Carlos Oliveira</p>
                              <div className="flex gap-0.5"><Star className="h-2 w-2 fill-yellow-500 text-yellow-500" /> <Star className="h-2 w-2 fill-yellow-500 text-yellow-500" /></div>
                           </div>
                        </div>
                        <p className="text-xs italic font-medium text-slate-500 leading-relaxed">"Sempre que venho na {merchant?.name} sou muito bem atendido. A IA de agendamento facilita muito!"</p>
                     </Card>
                   ))}
                </div>
             </div>
          </div>

          {/* Checkout Flutuante PWA */}
          <div className="fixed bottom-0 left-0 right-0 p-6 bg-white/80 backdrop-blur-xl border-t border-slate-100 z-50 rounded-t-[45px] shadow-3xl">
             <div className="flex justify-around items-center mb-6">
                <Link href={`/store/${slug}`} className="p-4 text-primary bg-primary/10 rounded-2xl"><ShoppingBag className="h-6 w-6" /></Link>
                <Link href={`/store/${slug}/profile`} className="p-4 text-slate-400 hover:text-primary transition-colors"><User className="h-6 w-6" /></Link>
                <Link href={`/store/${slug}/track/last`} className="p-4 text-slate-400 hover:text-primary transition-colors"><Clock className="h-6 w-6" /></Link>
             </div>
             <Button 
              disabled={cart.length === 0}
              onClick={() => setIsCheckoutOpen(true)}
              className="w-full h-20 bg-slate-900 text-white rounded-[35px] font-black italic text-xl shadow-2xl flex justify-between px-10 border-4 border-white/10 active:scale-95 transition-all"
             >
                <div className="flex items-center gap-3">
                   <div className="bg-primary p-2 rounded-xl text-white">
                      {isServiceBusiness ? <CalendarIcon className="h-6 w-6" /> : <ShoppingCart className="h-6 w-6" />}
                   </div>
                   <span>FECHAR AGORA</span>
                </div>
                <p className="font-black italic">R$ {totalCart.toFixed(2)}</p>
             </Button>
          </div>
        </>
      )}

      {/* Concierge IA Modal */}
      <Dialog open={isAiConciergeOpen} onOpenChange={setIsAiConciergeOpen}>
         <DialogContent className="sm:max-w-lg p-0 rounded-[45px] border-none shadow-2xl overflow-hidden bg-white">
            <div className="bg-primary p-10 text-white relative overflow-hidden">
               <div className="relative z-10 space-y-2">
                  <Badge className="bg-white/20 text-white border-none font-black italic px-3">Powered by Gemini 2.5</Badge>
                  <DialogTitle className="text-4xl font-black italic uppercase tracking-tighter">Ágil Concierge</DialogTitle>
                  <p className="text-white/80 font-bold uppercase text-[10px] tracking-widest mt-2">Eu ajudo você a escolher o melhor para você.</p>
               </div>
               <Sparkles className="absolute -bottom-10 -right-10 h-48 w-48 opacity-10 animate-pulse" />
            </div>
            <div className="p-10 space-y-8">
               <div className="bg-slate-50 p-6 rounded-[35px] italic text-sm font-medium text-slate-600 leading-relaxed border border-slate-100">
                  "Olá! Analisando seu perfil e o horário atual na <b>{merchant?.name}</b>, recomendo o serviço de <b>Corte Master</b>. Temos uma vaga disponível em 30 minutos! Gostaria que eu reservasse?"
               </div>
               <div className="grid gap-3">
                  <Button className="h-14 rounded-2xl bg-primary text-white font-black italic shadow-xl">SIM, RESERVAR AGORA</Button>
                  <Button variant="outline" className="h-14 rounded-2xl border-slate-200 font-bold italic">QUERO VER OUTROS HORÁRIOS</Button>
               </div>
            </div>
         </DialogContent>
      </Dialog>

      {/* Modal de Detalhes do Item */}
      <Dialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
         <DialogContent className="sm:max-w-lg p-0 rounded-[45px] border-none shadow-2xl overflow-hidden">
            {selectedItem && (
              <div className="flex flex-col">
                 <div className="h-72 w-full relative">
                    <img src={selectedItem.imageUrl || `https://picsum.photos/seed/${selectedItem.id}/600/400`} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div className="absolute bottom-8 left-8">
                       <Badge className="bg-primary text-white border-none font-black italic uppercase text-[8px] mb-2">{selectedItem.category}</Badge>
                       <h2 className="text-4xl font-black italic text-white uppercase tracking-tighter">{selectedItem.name}</h2>
                    </div>
                 </div>
                 <div className="p-8 space-y-8">
                    <div className="flex justify-between items-center bg-slate-50 p-6 rounded-[35px]">
                       <div className="space-y-1">
                          <p className="text-[10px] font-black uppercase text-slate-400">Investimento</p>
                          <p className="text-3xl font-black italic text-primary">R$ {selectedItem.price.toFixed(2)}</p>
                       </div>
                       <Badge className="bg-green-100 text-green-700 border-none font-black italic text-[10px] px-4 py-2 rounded-xl">CASHBACK ATIVO</Badge>
                    </div>
                    <Button onClick={() => addToCart(selectedItem, selectedItem.type)} className="w-full h-20 bg-slate-900 text-white rounded-[35px] font-black italic text-xl shadow-2xl uppercase gap-3">
                       ADICIONAR À SACOLA <Sparkles className="h-6 w-6 text-primary" />
                    </Button>
                 </div>
              </div>
            )}
         </DialogContent>
      </Dialog>

      {/* Modal Checkout */}
      <Dialog open={isCheckoutOpen} onOpenChange={setIsCheckoutOpen}>
         <DialogContent className="sm:max-w-lg p-0 rounded-[45px] border-none shadow-2xl overflow-hidden font-body bg-white">
            <div className="bg-slate-900 p-8 text-white">
               <DialogTitle className="text-3xl font-black italic uppercase">Confirmar Pedido</DialogTitle>
               <p className="text-primary font-bold text-[10px] uppercase tracking-widest mt-1">Ambiente seguro AES-256 compatível com LGPD.</p>
            </div>
            <div className="p-8 space-y-6">
               <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase text-slate-400 px-1">Nome Completo</Label>
                    <Input value={customerInfo.name} onChange={e => setCustomerInfo({...customerInfo, name: e.target.value})} className="h-14 rounded-2xl bg-slate-50 border-none font-bold" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase text-slate-400 px-1">WhatsApp</Label>
                    <Input value={customerInfo.phone} onChange={e => setCustomerInfo({...customerInfo, phone: e.target.value})} className="h-14 rounded-2xl bg-slate-50 border-none font-bold" />
                  </div>
                  {isServiceBusiness && (
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase text-slate-400 px-1">Horário Desejado</Label>
                      <Input type="time" value={customerInfo.time} onChange={e => setCustomerInfo({...customerInfo, time: e.target.value})} className="h-14 rounded-2xl bg-slate-50 border-none font-bold" />
                    </div>
                  )}
               </div>
               <Button onClick={handleFinishOrder} className="w-full h-20 bg-primary text-white rounded-[35px] font-black italic text-xl shadow-2xl uppercase">
                  CONCLUIR AGORA <CheckCircle2 className="h-6 w-6 ml-3" />
               </Button>
            </div>
         </DialogContent>
      </Dialog>
    </div>
  );
}
