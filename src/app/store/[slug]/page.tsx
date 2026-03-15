
"use client";

import * as React from 'react';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { MOCK_MERCHANTS, MOCK_CATEGORIES, MOCK_PRODUCTS, MOCK_SERVICES, Product, Service, Merchant } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ShoppingCart, Search, ChevronRight, Plus, Minus, ArrowLeft, 
  Star, Heart, QrCode, Gift, Zap, Sparkles, ShoppingBag, MapPin, 
  Phone, Check, CreditCard, Landmark, Wallet, Clock, Bot, 
  Send, Scissors, Calendar as CalendarIcon, User, Timer
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useFirestore, useCollection, addDocumentNonBlocking, useMemoFirebase } from '@/firebase';
import { collection, serverTimestamp, query } from 'firebase/firestore';

export default function StoreFront() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;
  
  const [merchant, setMerchant] = useState<Merchant | null>(null);
  const [cart, setCart] = useState<{product?: Product, service?: Service, quantity: number}[]>([]);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isChatOpen, setIsChatOpen] = useState(false);
  
  const [bookingStep, setBookingStep] = useState(1); // 1: Info, 2: Slot Selection
  const [orderType, setOrderType] = useState<'delivery' | 'pickup' | 'appointment'>('delivery');
  
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    phone: "",
    address: "",
    professional: "",
    date: "",
    time: ""
  });

  const { toast } = useToast();
  const db = useFirestore();

  useEffect(() => {
    if (slug) {
      const found = MOCK_MERCHANTS.find(m => m.slug === slug);
      if (found) {
        setMerchant(found);
        setOrderType(found.segment === 'BEAUTY' || found.segment === 'HEALTH' || found.segment === 'SERVICE' ? 'appointment' : 'delivery');
      }
    }
  }, [slug]);

  const isServiceBusiness = merchant?.segment === 'BEAUTY' || merchant?.segment === 'HEALTH' || merchant?.segment === 'MAINTENANCE' || merchant?.segment === 'SERVICE';

  const products = MOCK_PRODUCTS.filter(p => p.merchantId === merchant?.id);
  const services = MOCK_SERVICES.filter(s => s.merchantId === merchant?.id);
  const categories = MOCK_CATEGORIES.filter(c => c.merchantId === merchant?.id);

  const addToCart = (item: Product | Service, type: 'product' | 'service') => {
    setCart(prev => {
      const existing = prev.find(i => (type === 'product' ? i.product?.id === item.id : i.service?.id === item.id));
      if (existing) {
        return prev.map(i => {
          if (type === 'product' && i.product?.id === item.id) return { ...i, quantity: i.quantity + 1 };
          if (type === 'service' && i.service?.id === item.id) return { ...i, quantity: i.quantity + 1 };
          return i;
        });
      }
      return [...prev, { [type]: item, quantity: 1 }];
    });
    toast({ title: "Adicionado!", description: `${item.name} pronto na sacola.` });
  };

  const handleFinishOrder = async () => {
    if (!customerInfo.name || !customerInfo.phone) {
      toast({ title: "Dados Incompletos", description: "Preencha as informações obrigatórias.", variant: "destructive" });
      return;
    }
    
    try {
      const orderId = Math.random().toString(36).substring(7);
      const total = cart.reduce((acc, i) => acc + ((i.product?.price || i.service?.price || 0) * i.quantity), 0);

      await addDocumentNonBlocking(collection(db, 'merchants', merchant!.id, 'orders'), {
        id: orderId,
        customerName: customerInfo.name,
        customerPhone: customerInfo.phone,
        address: customerInfo.address,
        orderType,
        status: 'new',
        createdAt: new Date().toISOString(),
        timestamp: serverTimestamp(),
        scheduledTime: orderType === 'appointment' ? `${customerInfo.date} ${customerInfo.time}` : undefined,
        items: cart.map(i => ({
          productId: i.product?.id,
          serviceId: i.service?.id,
          productName: i.product?.name || i.service?.name,
          quantity: i.quantity,
          price: i.product?.price || i.service?.price
        }))
      });

      toast({ title: "Recebido!", description: "Seu agendamento/pedido foi processado." });
      setIsCheckoutOpen(false);
      router.push(`/store/${slug}/track/${orderId}`);
    } catch (e) {
      toast({ title: "Erro", description: "Falha na conexão.", variant: "destructive" });
    }
  };

  if (!merchant) return null;

  return (
    <div className="max-w-xl mx-auto min-h-screen bg-slate-50 pb-44 relative font-body overflow-x-hidden">
      {/* Status Widget */}
      <div className="fixed top-24 right-6 z-50">
         <Badge className="bg-primary text-white border-4 border-white shadow-2xl py-2 px-4 rounded-full font-black text-[10px] uppercase">
            {isServiceBusiness ? 'DISPONÍVEL HOJE 📅' : 'LOJA ABERTA ⚡'}
         </Badge>
      </div>

      {/* Hero Section */}
      <div className="relative h-64 w-full overflow-hidden">
        <img src={merchant.bannerUrl} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent"></div>
        <div className="absolute bottom-6 left-6 flex items-end gap-4">
           <div className="h-20 w-20 rounded-3xl border-4 border-white/20 bg-white shadow-2xl overflow-hidden">
              <img src={merchant.logoUrl} className="h-full w-full object-cover" />
           </div>
           <div>
              <h1 className="text-xl font-black text-white italic uppercase">{merchant.name}</h1>
              <p className="text-[10px] font-bold text-primary uppercase tracking-widest">{merchant.segment}</p>
           </div>
        </div>
      </div>

      {/* Menu / Catalogo */}
      <div className="p-6 space-y-10">
        {isServiceBusiness && (
          <div className="space-y-6">
             <h2 className="text-lg font-black text-slate-900 italic border-l-4 border-primary pl-4 uppercase">Nossos Serviços</h2>
             <div className="grid gap-4">
                {services.map(s => (
                  <div key={s.id} onClick={() => addToCart(s, 'service')} className="flex gap-4 p-5 bg-white border border-slate-100 rounded-[35px] shadow-sm active:scale-95 transition-all group">
                     <div className="h-16 w-16 rounded-[24px] bg-slate-50 flex items-center justify-center text-slate-400 group-active:bg-primary group-active:text-white transition-colors">
                        <Scissors className="h-8 w-8" />
                     </div>
                     <div className="flex-1">
                        <h3 className="font-black text-slate-900 text-sm uppercase italic">{s.name}</h3>
                        <p className="text-[10px] text-slate-500 font-bold mt-1 uppercase flex items-center gap-2"><Timer className="h-3 w-3" /> {s.duration} MIN</p>
                        <p className="font-black text-primary text-xl mt-2 italic">R$ {s.price.toFixed(2)}</p>
                     </div>
                     <div className="flex items-center"><Plus className="h-6 w-6 text-slate-200" /></div>
                  </div>
                ))}
             </div>
          </div>
        )}

        {products.length > 0 && (
          <div className="space-y-6">
             <h2 className="text-lg font-black text-slate-900 italic border-l-4 border-accent pl-4 uppercase">Para levar (Home Care)</h2>
             <div className="grid gap-4">
                {products.map(p => (
                  <div key={p.id} onClick={() => addToCart(p, 'product')} className="flex gap-4 p-4 bg-white border border-slate-100 rounded-[30px] shadow-sm">
                     <div className="flex-1">
                        <h3 className="font-black text-slate-900 text-sm">{p.name}</h3>
                        <p className="text-[10px] text-slate-500 line-clamp-2 mt-1 italic">{p.description}</p>
                        <p className="font-black text-accent text-lg mt-2">R$ {p.price.toFixed(2)}</p>
                     </div>
                     <div className="h-20 w-20 rounded-2xl bg-slate-100 overflow-hidden shrink-0 shadow-inner">
                        <img src={p.imageUrl} className="h-full w-full object-cover" />
                     </div>
                  </div>
                ))}
             </div>
          </div>
        )}
      </div>

      {/* Footer Carrinho / Agendamento */}
      <div className="fixed bottom-10 left-1/2 -translate-x-1/2 w-full max-w-xl px-8 z-50">
        <Button onClick={() => setIsCheckoutOpen(true)} disabled={cart.length === 0} className="w-full bg-slate-900 h-20 rounded-[45px] flex justify-between px-12 shadow-2xl active:scale-95 transition-all">
          <div className="flex items-center gap-4">
             <div className="relative">
                {isServiceBusiness ? <CalendarIcon className="h-6 w-6 text-primary" /> : <ShoppingCart className="h-6 w-6 text-primary" />}
                <span className="absolute -top-3 -right-3 h-6 w-6 bg-primary text-white rounded-full text-[10px] font-black flex items-center justify-center border-4 border-slate-900">{cart.reduce((a, b) => a + b.quantity, 0)}</span>
             </div>
             <span className="font-black text-lg text-white italic uppercase tracking-tighter">
                {isServiceBusiness ? 'Reservar' : 'Sacola'}
             </span>
          </div>
          <span className="font-black text-2xl text-primary italic tracking-tighter">R$ {cart.reduce((a, b) => a + ((b.product?.price || b.service?.price || 0) * b.quantity), 0).toFixed(2)}</span>
        </Button>
      </div>

      {/* Checkout Dinâmico */}
      <Dialog open={isCheckoutOpen} onOpenChange={setIsCheckoutOpen}>
        <DialogContent className="sm:max-w-lg p-0 overflow-hidden rounded-[40px] border-none shadow-2xl font-body">
           <div className="bg-slate-900 p-8 text-white flex justify-between items-center">
              <div>
                 <h2 className="text-2xl font-black italic uppercase tracking-tighter">
                    {isServiceBusiness ? 'Confirmar Reserva' : 'Finalizar Pedido'}
                 </h2>
                 <p className="text-xs text-primary font-bold uppercase tracking-widest">Vertical: {merchant.segment}</p>
              </div>
              <Zap className="h-8 w-8 text-primary animate-pulse" />
           </div>
           
           <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto no-scrollbar">
              {isServiceBusiness ? (
                <div className="space-y-6">
                   <div className="space-y-4">
                      <Label className="text-[10px] font-black uppercase text-slate-400">Escolha o Profissional</Label>
                      <div className="grid grid-cols-2 gap-3">
                         {['Qualquer um', 'Ricardo', 'Ana'].map(name => (
                           <Button key={name} variant={customerInfo.professional === name ? 'default' : 'outline'} onClick={() => setCustomerInfo({...customerInfo, professional: name})} className="rounded-2xl h-12 font-black italic text-xs">{name}</Button>
                         ))}
                      </div>
                   </div>
                   <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                         <Label className="text-[10px] font-black uppercase text-slate-400">Data</Label>
                         <Input type="date" className="h-12 rounded-xl bg-slate-50 border-none font-bold" value={customerInfo.date} onChange={e => setCustomerInfo({...customerInfo, date: e.target.value})} />
                      </div>
                      <div className="space-y-2">
                         <Label className="text-[10px] font-black uppercase text-slate-400">Horário</Label>
                         <Select value={customerInfo.time} onValueChange={v => setCustomerInfo({...customerInfo, time: v})}>
                            <SelectTrigger className="h-12 rounded-xl bg-slate-50 border-none font-bold"><SelectValue placeholder="Selecione" /></SelectTrigger>
                            <SelectContent><SelectItem value="09:00">09:00</SelectItem><SelectItem value="10:00">10:00</SelectItem><SelectItem value="14:00">14:00</SelectItem></SelectContent>
                         </Select>
                      </div>
                   </div>
                </div>
              ) : (
                <div className="space-y-4">
                   <Label className="text-[10px] font-black uppercase text-slate-400">Tipo de Entrega</Label>
                   <div className="grid grid-cols-2 gap-3">
                      <Button variant={orderType === 'delivery' ? 'default' : 'outline'} onClick={() => setOrderType('delivery')} className="rounded-2xl h-12 font-black italic">Entregar</Button>
                      <Button variant={orderType === 'pickup' ? 'default' : 'outline'} onClick={() => setOrderType('pickup')} className="rounded-2xl h-12 font-black italic">Retirar</Button>
                   </div>
                </div>
              )}

              <div className="space-y-4 pt-4 border-t border-dashed">
                <Label className="text-[10px] font-black uppercase text-slate-400">Suas Informações</Label>
                <Input placeholder="Nome Completo" className="h-12 rounded-xl bg-slate-50 border-none font-bold" value={customerInfo.name} onChange={e => setCustomerInfo({...customerInfo, name: e.target.value})} />
                <Input placeholder="WhatsApp para confirmação" className="h-12 rounded-xl bg-slate-50 border-none font-bold" value={customerInfo.phone} onChange={e => setCustomerInfo({...customerInfo, phone: e.target.value})} />
                {orderType === 'delivery' && (
                  <Textarea placeholder="Endereço Completo..." className="rounded-xl bg-slate-50 border-none font-bold" value={customerInfo.address} onChange={e => setCustomerInfo({...customerInfo, address: e.target.value})} />
                )}
              </div>

              <Button onClick={handleFinishOrder} className="w-full h-16 bg-primary hover:bg-primary/90 rounded-[30px] font-black text-xl italic shadow-2xl transition-transform active:scale-95 uppercase tracking-tighter">
                 {isServiceBusiness ? 'Confirmar Agendamento' : 'Enviar Pedido'}
              </Button>
           </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
