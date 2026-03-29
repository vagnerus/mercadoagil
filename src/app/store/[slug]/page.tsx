
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
  Filter, Share2, HeartPulse, Sparkles
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
  const { data: products, isLoading: loadingProducts } = useCollection(productsQuery);

  const servicesQuery = useMemoFirebase(() => {
    if (!merchant?.id) return null;
    return query(collection(db, 'merchants', merchant.id, 'services'), orderBy('createdAt', 'desc'));
  }, [db, merchant?.id]);
  const { data: services, isLoading: loadingServices } = useCollection(servicesQuery);

  const [cart, setCart] = useState<{item: any, type: 'product' | 'service', quantity: number}[]>([]);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [orderFinished, setOrderFinished] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    phone: "",
    address: "",
    time: "14:00"
  });

  const isServiceBusiness = merchant?.segment === 'BEAUTY' || merchant?.segment === 'HEALTH' || merchant?.segment === 'SERVICE';

  const categories = ["Todos", ...Array.from(new Set([
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
      toast({ title: "Sucesso!", description: "Seu agendamento foi enviado." });
    } catch (e) {
      toast({ title: "Erro", description: "Falha ao processar pedido.", variant: "destructive" });
    }
  };

  const handleWhatsAppConfirm = () => {
    if (!merchant?.settings?.whatsapp) return;
    const cleanStorePhone = merchant.settings.whatsapp.replace(/\D/g, '');
    const serviceName = cart[0]?.item?.name || "Serviço";
    const message = `Olá! Acabei de fazer um agendamento de *${serviceName}* para as *${customerInfo.time}* hoje no nome de *${customerInfo.name}*. Aguardo confirmação!`;
    window.open(`https://wa.me/55${cleanStorePhone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: merchant?.name,
        text: `Confira a vitrine da ${merchant?.name} no Mercado Ágil!`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({ title: "Link Copiado!", description: "Compartilhe com seus amigos." });
    }
  };

  if (loadingMerchant) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white space-y-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="font-black italic text-slate-400 uppercase tracking-widest">Entrando na Vitrine...</p>
      </div>
    );
  }

  if (!merchant) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-8 text-center">
        <h1 className="text-2xl font-black italic text-slate-900">Loja não encontrada</h1>
        <p className="text-slate-500 mt-2">O link pode estar incorreto ou a loja foi desativada.</p>
      </div>
    );
  }

  const totalCart = cart.reduce((a, b) => a + (b.item.price * b.quantity), 0);

  return (
    <div className="max-w-xl mx-auto min-h-screen bg-white pb-44 relative font-body overflow-x-hidden">
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b p-4 flex items-center justify-between">
         <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-primary flex items-center justify-center text-white shadow-lg">
               {isServiceBusiness ? <Scissors className="h-5 w-5" /> : <ShoppingBag className="h-5 w-5" />}
            </div>
            <div>
               <h1 className="font-black text-sm uppercase italic leading-none">{merchant.name}</h1>
               <p className="text-[10px] font-bold text-slate-400 mt-1 flex items-center gap-1 uppercase">
                  <MapPin className="h-2 w-2" /> SP, Brasil
               </p>
            </div>
         </div>
         <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={handleShare} className="rounded-full bg-slate-50"><Share2 className="h-4 w-4 text-slate-400" /></Button>
            <Link href={`/store/${slug}/profile`} className="p-2 bg-slate-50 rounded-full"><User className="h-5 w-5 text-slate-400" /></Link>
         </div>
      </div>

      {orderFinished ? (
        <div className="p-8 text-center space-y-8 animate-in zoom-in-95 duration-500">
           <div className="h-24 w-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto shadow-xl shadow-green-100">
              <CheckCircle2 className="h-12 w-12" />
           </div>
           <div className="space-y-2">
              <h2 className="text-3xl font-black italic tracking-tighter uppercase">Pedido Recebido!</h2>
              <p className="text-slate-500 font-medium italic">Sua solicitação foi enviada para a loja.</p>
           </div>
           <Card className="border-none bg-slate-50 p-6 rounded-[35px] text-left space-y-4">
              <div className="flex justify-between items-center text-[10px] font-black uppercase text-slate-400">
                 <span>Protocolo</span>
                 <span>#{orderFinished.toUpperCase()}</span>
              </div>
              <div className="space-y-1">
                 <p className="text-xl font-black italic text-slate-900 uppercase">{cart[0]?.item?.name}</p>
                 <p className="text-sm font-bold text-primary italic uppercase">{customerInfo.time} - Hoje</p>
              </div>
           </Card>
           <Button 
            onClick={handleWhatsAppConfirm} 
            className="w-full h-16 bg-green-500 hover:bg-green-600 text-white rounded-[30px] font-black italic text-lg shadow-2xl flex gap-3"
           >
              <MessageCircle className="h-6 w-6" /> NOTIFICAR VIA WHATSAPP
           </Button>
           <Button variant="ghost" onClick={() => setOrderFinished(null)} className="font-bold text-slate-400 uppercase text-xs">Voltar para a Loja</Button>
        </div>
      ) : (
        <>
          <div className="relative h-56 w-full overflow-hidden">
            <img src={merchant.bannerUrl || `https://picsum.photos/seed/${slug}/1200/400`} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-white via-white/20 to-transparent"></div>
            <div className="absolute bottom-6 left-6 right-6">
               <div className="flex items-center gap-3">
                  <div className="h-16 w-16 rounded-3xl bg-white p-1 shadow-xl">
                     <img src={merchant.logoUrl || `https://picsum.photos/seed/logo/200/200`} className="w-full h-full object-cover rounded-[20px]" />
                  </div>
                  <div>
                     <h2 className="text-2xl font-black italic text-slate-900 leading-none uppercase tracking-tighter">{merchant.name}</h2>
                     <div className="flex items-center gap-2 mt-1">
                        <div className="flex items-center text-yellow-500">
                           <Star className="h-3 w-3 fill-yellow-500" />
                           <span className="text-xs font-black ml-1">4.9</span>
                        </div>
                        <span className="text-slate-400 text-[10px] font-bold uppercase">• 150+ avaliações</span>
                     </div>
                  </div>
               </div>
            </div>
          </div>

          <div className="px-6 space-y-8">
             {/* Barra de Busca */}
             <div className="relative mt-4">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input 
                  className="pl-12 h-14 rounded-2xl bg-slate-50 border-none font-bold text-slate-900 focus:ring-primary shadow-sm" 
                  placeholder="O que você procura?" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
             </div>

             {/* Categorias */}
             <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={cn(
                      "px-6 py-2.5 rounded-full whitespace-nowrap font-black italic text-[10px] uppercase tracking-widest transition-all",
                      selectedCategory === cat ? "bg-primary text-white shadow-lg" : "bg-slate-50 text-slate-400 border border-slate-100"
                    )}
                  >
                    {cat}
                  </button>
                ))}
             </div>

             {/* Promoções / Cashback Info */}
             {merchant.settings?.enableCashback && (
               <div className="bg-primary/5 border border-primary/10 p-6 rounded-[35px] flex items-center justify-between">
                  <div className="flex items-center gap-4">
                     <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                        <Zap className="h-6 w-6" />
                     </div>
                     <div>
                        <p className="font-black text-xs uppercase italic">Ganhe Cashback!</p>
                        <p className="text-[10px] font-bold text-slate-500 uppercase">Receba {merchant.settings.cashbackPercentage}% de volta na sua carteira.</p>
                     </div>
                  </div>
                  <Badge className="bg-primary text-white border-none font-black italic uppercase text-[8px]">ATIVO</Badge>
               </div>
             )}

             {isServiceBusiness ? (
               <div className="space-y-6">
                  <div className="flex justify-between items-center">
                     <h3 className="text-lg font-black italic uppercase tracking-tighter">Serviços & Procedimentos</h3>
                     <Badge variant="outline" className="border-slate-100 text-slate-400 font-bold text-[8px] uppercase">{filteredItems.services?.length} OPÇÕES</Badge>
                  </div>
                  <div className="grid gap-4">
                     {filteredItems.services?.length === 0 ? (
                       <div className="p-10 text-center bg-slate-50 rounded-[35px] border-2 border-dashed border-slate-200">
                          <p className="text-xs font-bold text-slate-400 uppercase italic">Nenhum serviço encontrado.</p>
                       </div>
                     ) : (
                       filteredItems.services?.map(s => (
                         <div key={s.id} onClick={() => setSelectedItem({...s, type: 'service'})} className="p-5 bg-white rounded-[35px] flex items-center gap-4 cursor-pointer hover:bg-slate-50 border border-slate-50 shadow-sm transition-all">
                            <div className="h-16 w-16 rounded-[24px] bg-primary/5 flex items-center justify-center text-primary shadow-inner">
                               <Scissors className="h-8 w-8" />
                            </div>
                            <div className="flex-1 min-w-0">
                               <p className="font-black text-slate-900 uppercase italic text-sm truncate">{s.name}</p>
                               <div className="flex items-center gap-3 mt-1">
                                  <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1 uppercase"><Timer className="h-3 w-3" /> {s.duration} min</span>
                                  <span className="text-[10px] font-black text-primary italic uppercase">R$ {s.price.toFixed(2)}</span>
                               </div>
                            </div>
                            <Plus className="h-5 w-5 text-primary bg-primary/10 rounded-full p-1" />
                         </div>
                       ))
                     )}
                  </div>
               </div>
             ) : (
               <div className="space-y-6">
                  <div className="flex justify-between items-center">
                     <h3 className="text-lg font-black italic uppercase tracking-tighter">Produtos & Itens</h3>
                     <Badge variant="outline" className="border-slate-100 text-slate-400 font-bold text-[8px] uppercase">{filteredItems.products?.length} ITENS</Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                     {filteredItems.products?.length === 0 ? (
                       <div className="col-span-2 p-10 text-center bg-slate-50 rounded-[35px] border-2 border-dashed border-slate-200">
                          <p className="text-xs font-bold text-slate-400 uppercase italic">Catálogo vazio no momento.</p>
                       </div>
                     ) : (
                       filteredItems.products?.map(p => (
                         <div key={p.id} onClick={() => setSelectedItem({...p, type: 'product'})} className="bg-white p-4 rounded-[35px] border border-slate-100 shadow-sm space-y-3 cursor-pointer hover:bg-slate-50 transition-all">
                            <div className="h-36 w-full bg-slate-50 rounded-2xl overflow-hidden shadow-inner relative">
                              <img src={p.imageUrl || `https://picsum.photos/seed/${p.id}/200/200`} className="h-full w-full object-cover" />
                              <button onClick={(e) => { e.stopPropagation(); addToCart(p, 'product'); }} className="absolute bottom-2 right-2 h-8 w-8 bg-primary rounded-full flex items-center justify-center text-white shadow-lg"><Plus className="h-4 w-4" /></button>
                            </div>
                            <div>
                              <p className="font-black text-[10px] uppercase italic truncate text-slate-900">{p.name}</p>
                              <div className="flex justify-between items-center mt-1">
                                 <p className="font-black text-primary italic text-sm">R$ {p.price.toFixed(2)}</p>
                                 <Badge className="bg-slate-50 text-slate-400 border-none font-bold text-[7px] uppercase">{p.category}</Badge>
                              </div>
                            </div>
                         </div>
                       ))
                     )}
                  </div>
               </div>
             )}

             {/* Avaliações Recentes */}
             <div className="space-y-6 pt-4">
                <h3 className="text-lg font-black italic uppercase tracking-tighter">O que dizem os clientes</h3>
                <div className="space-y-4">
                   {[
                     { name: "Carlos A.", comment: "Melhor atendimento da região, recomendo!", rating: 5 },
                     { name: "Juliana M.", comment: "Sempre pontual e ambiente muito limpo.", rating: 5 }
                   ].map((rev, i) => (
                     <div key={i} className="bg-slate-50 p-6 rounded-[30px] space-y-3">
                        <div className="flex justify-between items-center">
                           <p className="font-black text-xs italic uppercase text-slate-900">{rev.name}</p>
                           <div className="flex items-center gap-0.5">
                              {[...Array(rev.rating)].map((_, j) => <Star key={j} className="h-2.5 w-2.5 fill-yellow-500 text-yellow-500" />)}
                           </div>
                        </div>
                        <p className="text-xs text-slate-500 font-medium italic italic leading-relaxed">"{rev.comment}"</p>
                     </div>
                   ))}
                </div>
             </div>
          </div>

          {/* Checkout Flutuante */}
          <div className="fixed bottom-0 left-0 right-0 p-6 bg-white/80 backdrop-blur-xl border-t rounded-t-[45px] shadow-[0_-20px_50px_-15px_rgba(0,0,0,0.15)] z-50">
             <Button 
              disabled={cart.length === 0}
              onClick={() => setIsCheckoutOpen(true)}
              className="w-full h-16 bg-slate-900 text-white rounded-[30px] font-black italic text-lg shadow-2xl flex justify-between px-10 border-4 border-white/10"
             >
                <div className="flex items-center gap-3">
                   <div className="bg-primary p-1.5 rounded-lg text-white">
                      {isServiceBusiness ? <CalendarIcon className="h-5 w-5" /> : <ShoppingCart className="h-5 w-5" />}
                   </div>
                   <span>{isServiceBusiness ? 'AGENDAR AGORA' : 'VER CARRINHO'}</span>
                </div>
                <div className="text-right">
                   <p className="text-[10px] font-bold opacity-60 leading-none">TOTAL</p>
                   <p className="font-black italic">R$ {totalCart.toFixed(2)}</p>
                </div>
             </Button>
          </div>
        </>
      )}

      {/* Modal de Detalhes do Item */}
      <Dialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
         <DialogContent className="sm:max-w-lg p-0 rounded-[45px] border-none shadow-2xl overflow-hidden font-body">
            {selectedItem && (
              <div className="flex flex-col">
                 <div className="h-64 w-full relative">
                    <img src={selectedItem.imageUrl || `https://picsum.photos/seed/${selectedItem.id}/600/400`} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <Button variant="ghost" size="icon" onClick={() => setSelectedItem(null)} className="absolute top-6 left-6 text-white bg-black/20 rounded-full h-10 w-10"><ArrowLeft className="h-5 w-5" /></Button>
                    <div className="absolute bottom-6 left-8 right-8">
                       <Badge className="bg-primary text-white border-none font-black italic uppercase text-[8px] mb-2">{selectedItem.category}</Badge>
                       <h2 className="text-3xl font-black italic text-white uppercase tracking-tighter leading-none">{selectedItem.name}</h2>
                    </div>
                 </div>
                 <div className="p-8 space-y-8">
                    <div className="flex justify-between items-center">
                       <div className="space-y-1">
                          <p className="text-[10px] font-black uppercase text-slate-400">Valor Integral</p>
                          <p className="text-3xl font-black italic text-primary">R$ {selectedItem.price.toFixed(2)}</p>
                       </div>
                       {merchant.settings?.enableCashback && (
                         <div className="text-right">
                            <p className="text-[10px] font-black uppercase text-green-500">Seu Cashback</p>
                            <p className="text-xl font-black italic text-green-600">R$ {(selectedItem.price * (merchant.settings.cashbackPercentage / 100)).toFixed(2)}</p>
                         </div>
                       )}
                    </div>

                    <div className="space-y-4">
                       <h4 className="font-black italic uppercase text-xs text-slate-900 flex items-center gap-2">
                          <Info className="h-4 w-4 text-primary" /> Descrição do {selectedItem.type === 'service' ? 'Procedimento' : 'Produto'}
                       </h4>
                       <p className="text-sm font-medium text-slate-500 italic leading-relaxed">
                          {selectedItem.description || `O melhor ${selectedItem.name} da região. Qualidade superior e atendimento de excelência garantidos pela ${merchant.name}.`}
                       </p>
                    </div>

                    <Button onClick={() => addToCart(selectedItem, selectedItem.type)} className="w-full h-20 bg-slate-900 hover:bg-slate-800 text-white rounded-[35px] font-black italic text-xl shadow-2xl uppercase">
                       ADICIONAR À SACOLA <Sparkles className="h-6 w-6 ml-3 text-primary" />
                    </Button>
                 </div>
              </div>
            )}
         </DialogContent>
      </Dialog>

      {/* Modal de Checkout */}
      <Dialog open={isCheckoutOpen} onOpenChange={setIsCheckoutOpen}>
         <DialogContent className="sm:max-w-lg p-0 rounded-[45px] border-none shadow-2xl overflow-hidden font-body">
            <div className="bg-slate-900 p-8 text-white">
               <DialogTitle className="text-3xl font-black italic uppercase">Finalizar Pedido</DialogTitle>
               <p className="text-primary font-bold text-[10px] uppercase tracking-widest mt-1">Conclua sua solicitação com segurança.</p>
            </div>
            <div className="p-8 space-y-6">
               <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase text-slate-400 px-1">Seu Nome</Label>
                    <Input value={customerInfo.name} onChange={e => setCustomerInfo({...customerInfo, name: e.target.value})} className="h-14 rounded-2xl bg-slate-50 border-none font-bold" placeholder="Nome Completo" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase text-slate-400 px-1">WhatsApp</Label>
                    <Input value={customerInfo.phone} onChange={e => setCustomerInfo({...customerInfo, phone: e.target.value})} className="h-14 rounded-2xl bg-slate-50 border-none font-bold" placeholder="(00) 00000-0000" />
                  </div>
                  {isServiceBusiness && (
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase text-slate-400 px-1">Horário Preferencial</Label>
                      <Input type="time" value={customerInfo.time} onChange={e => setCustomerInfo({...customerInfo, time: e.target.value})} className="h-14 rounded-2xl bg-slate-50 border-none font-bold" />
                    </div>
                  )}
                  {!isServiceBusiness && (
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase text-slate-400 px-1">Endereço de Entrega</Label>
                      <Input value={customerInfo.address} onChange={e => setCustomerInfo({...customerInfo, address: e.target.value})} className="h-14 rounded-2xl bg-slate-50 border-none font-bold" placeholder="Rua, Número, Bairro" />
                    </div>
                  )}
               </div>
               <Button onClick={handleFinishOrder} className="w-full h-20 bg-primary hover:bg-primary/90 text-white rounded-[35px] font-black italic text-xl shadow-2xl uppercase">
                  CONFIRMAR AGORA <CheckCircle2 className="h-6 w-6 ml-3" />
               </Button>
            </div>
         </DialogContent>
      </Dialog>
    </div>
  );
}
