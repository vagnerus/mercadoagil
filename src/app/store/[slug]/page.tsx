
"use client";

import * as React from 'react';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { MOCK_MERCHANTS, MOCK_PRODUCTS, MOCK_SERVICES, MOCK_STAFF, Product, Service, Merchant } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ShoppingCart, Search, ChevronRight, Plus, ArrowLeft, 
  Star, Heart, Zap, ShoppingBag, MapPin, 
  Phone, CreditCard, Landmark, Clock, 
  Scissors, Calendar as CalendarIcon, User, Timer, 
  CheckCircle2, Info, MessageCircle, Map as MapIcon
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useFirestore, addDocumentNonBlocking } from '@/firebase';
import { collection, serverTimestamp } from 'firebase/firestore';
import { cn } from "@/lib/utils";

export default function StoreFront() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;
  
  const [merchant, setMerchant] = useState<Merchant | null>(null);
  const [cart, setCart] = useState<{product?: Product, service?: Service, quantity: number}[]>([]);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [bookingStep, setBookingStep] = useState<'service' | 'professional' | 'time'>('service');
  
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    phone: "",
    address: "",
    professionalId: "",
    date: new Date().toISOString().split('T')[0],
    time: ""
  });

  const { toast } = useToast();
  const db = useFirestore();

  useEffect(() => {
    if (slug) {
      const found = MOCK_MERCHANTS.find(m => m.slug === slug);
      if (found) {
        setMerchant(found);
      }
    }
  }, [slug]);

  const isServiceBusiness = merchant?.segment === 'BEAUTY' || merchant?.segment === 'HEALTH' || merchant?.segment === 'SERVICE';

  const products = MOCK_PRODUCTS.filter(p => p.merchantId === merchant?.id);
  const services = MOCK_SERVICES.filter(s => s.merchantId === merchant?.id);

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
    
    if (type === 'service') {
      setBookingStep('professional');
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
      const total = cart.reduce((acc, i) => acc + ((i.product?.price || i.service?.price || 0) * i.quantity), 0);

      addDocumentNonBlocking(collection(db, 'merchants', merchant!.id, 'orders'), {
        id: orderId,
        customerName: customerInfo.name,
        customerPhone: customerInfo.phone,
        address: customerInfo.address,
        orderType: isServiceBusiness ? 'appointment' : 'delivery',
        status: isServiceBusiness ? 'scheduled' : 'new',
        createdAt: new Date().toISOString(),
        timestamp: serverTimestamp(),
        total,
        scheduledProfessional: customerInfo.professionalId,
        scheduledTime: isServiceBusiness ? `${customerInfo.date} ${customerInfo.time}` : undefined,
        items: cart.map(i => ({
          productId: i.product?.id || null,
          serviceId: i.service?.id || null,
          productName: i.product?.name || i.service?.name,
          quantity: i.quantity,
          price: i.product?.price || i.service?.price
        }))
      });

      toast({ title: "Sucesso!", description: "Seu agendamento foi confirmado." });
      setIsCheckoutOpen(false);
      router.push(`/store/${slug}/track/${orderId}`);
    } catch (e) {
      toast({ title: "Erro", description: "Falha ao processar reserva.", variant: "destructive" });
    }
  };

  if (!merchant) return null;

  return (
    <div className="max-w-xl mx-auto min-h-screen bg-white pb-44 relative font-body">
      {/* App Header Estilo Salão99 */}
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b p-4 flex items-center justify-between">
         <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-primary flex items-center justify-center text-white shadow-lg">
               <Scissors className="h-5 w-5" />
            </div>
            <div>
               <h1 className="font-black text-sm uppercase italic leading-none">{merchant.name}</h1>
               <p className="text-[10px] font-bold text-slate-400 mt-1 flex items-center gap-1 uppercase">
                  <MapPin className="h-2 w-2" /> {merchant.slug}.agil.com
               </p>
            </div>
         </div>
         <Button variant="ghost" size="icon" className="rounded-full bg-slate-50"><Heart className="h-4 w-4" /></Button>
      </div>

      {/* Banner & Bio */}
      <div className="relative h-48 w-full">
        <img src={merchant.bannerUrl} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent"></div>
      </div>

      <div className="px-6 -mt-10 relative z-10 space-y-6">
         <div className="bg-white rounded-[40px] shadow-2xl p-8 border border-slate-50">
            <div className="flex justify-between items-start">
               <div className="space-y-1">
                  <h2 className="text-2xl font-black italic tracking-tighter uppercase">{merchant.name}</h2>
                  <div className="flex items-center gap-3">
                     <span className="text-xs font-black text-yellow-500 flex items-center gap-1"><Star className="h-3 w-3 fill-yellow-500" /> 4.9</span>
                     <span className="text-[10px] font-bold text-slate-400 uppercase">1.2k avaliações</span>
                  </div>
               </div>
               <Badge className="bg-green-500 text-white font-black italic border-none px-3">ABERTO</Badge>
            </div>
            <div className="flex gap-2 mt-6 overflow-x-auto no-scrollbar pb-2">
               <Button variant="outline" className="rounded-2xl gap-2 font-bold h-10 border-slate-100 text-slate-600"><MapIcon className="h-4 w-4" /> Ver Mapa</Button>
               <Button variant="outline" className="rounded-2xl gap-2 font-bold h-10 border-slate-100 text-slate-600"><MessageCircle className="h-4 w-4" /> WhatsApp</Button>
               <Button variant="outline" className="rounded-2xl gap-2 font-bold h-10 border-slate-100 text-slate-600"><Info className="h-4 w-4" /> Info</Button>
            </div>
         </div>

         {/* Serviços - Grid Estilo Salão99 */}
         <div className="space-y-6">
            <div className="flex justify-between items-center">
               <h3 className="text-lg font-black italic uppercase tracking-tighter">Escolha um Serviço</h3>
               <Search className="h-5 w-5 text-slate-300" />
            </div>
            <div className="grid gap-4">
               {services.map(s => (
                 <div 
                  key={s.id} 
                  onClick={() => addToCart(s, 'service')}
                  className="p-5 bg-slate-50 hover:bg-slate-100 rounded-[35px] border border-transparent hover:border-primary/20 transition-all flex items-center gap-4 cursor-pointer group"
                 >
                    <div className="h-16 w-16 rounded-[24px] bg-white shadow-sm flex items-center justify-center text-slate-400 group-hover:text-primary transition-colors">
                       <Scissors className="h-8 w-8" />
                    </div>
                    <div className="flex-1">
                       <p className="font-black text-slate-900 uppercase italic text-sm">{s.name}</p>
                       <p className="text-[10px] font-bold text-slate-400 flex items-center gap-1 uppercase mt-1"><Timer className="h-3 w-3" /> {s.duration} min</p>
                       <p className="font-black text-primary italic mt-1">R$ {s.price.toFixed(2)}</p>
                    </div>
                    <div className="bg-white p-2 rounded-full shadow-sm"><Plus className="h-4 w-4 text-primary" /></div>
                 </div>
               ))}
            </div>
         </div>

         {/* Produtos de Venda (Up-selling) */}
         <div className="space-y-6">
            <h3 className="text-lg font-black italic uppercase tracking-tighter">Produtos da Loja</h3>
            <div className="flex gap-4 overflow-x-auto no-scrollbar px-1">
               {products.map(p => (
                 <div key={p.id} onClick={() => addToCart(p, 'product')} className="min-w-[160px] bg-slate-50 p-4 rounded-[35px] border border-slate-100 space-y-3 shrink-0 active:scale-95 transition-all">
                    <div className="h-24 w-full bg-white rounded-2xl overflow-hidden shadow-sm">
                       <img src={p.imageUrl} className="h-full w-full object-cover" />
                    </div>
                    <div>
                       <p className="font-black text-[10px] uppercase italic truncate">{p.name}</p>
                       <p className="font-black text-primary italic text-sm">R$ {p.price.toFixed(2)}</p>
                    </div>
                 </div>
               ))}
            </div>
         </div>
      </div>

      {/* Floating Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-white border-t rounded-t-[45px] shadow-[0_-20px_50px_-15px_rgba(0,0,0,0.15)] z-50">
         <Button 
          disabled={cart.length === 0}
          onClick={() => setIsCheckoutOpen(true)}
          className="w-full h-16 bg-slate-900 hover:bg-black text-white rounded-[30px] font-black italic text-lg shadow-2xl flex justify-between px-10"
         >
            <div className="flex items-center gap-3">
               <div className="bg-primary p-1.5 rounded-lg text-white">
                  {isServiceBusiness ? <CalendarIcon className="h-5 w-5" /> : <ShoppingCart className="h-5 w-5" />}
               </div>
               <span>{isServiceBusiness ? 'AGENDAR' : 'CHECKOUT'}</span>
            </div>
            <span>R$ {cart.reduce((a, b) => a + ((b.product?.price || b.service?.price || 0) * b.quantity), 0).toFixed(2)}</span>
         </Button>
      </div>

      {/* Dialog de Checkout Multistep */}
      <Dialog open={isCheckoutOpen} onOpenChange={setIsCheckoutOpen}>
         <DialogContent className="sm:max-w-lg p-0 rounded-[45px] border-none shadow-2xl overflow-hidden font-body">
            <div className="bg-slate-900 p-8 text-white relative overflow-hidden">
               <DialogHeader>
                  <DialogTitle className="text-3xl font-black italic uppercase tracking-tighter">
                     {bookingStep === 'professional' ? 'Quem irá te atender?' : 
                      bookingStep === 'time' ? 'Escolha o Horário' : 'Seus Dados'}
                  </DialogTitle>
                  <p className="text-primary font-bold text-[10px] uppercase tracking-widest mt-1">Sessão Segura • {merchant.name}</p>
               </DialogHeader>
               <Zap className="absolute -bottom-6 -right-6 h-24 w-24 text-primary opacity-10 animate-pulse" />
            </div>

            <div className="p-8 space-y-8 max-h-[70vh] overflow-y-auto no-scrollbar">
               {/* Passo 1: Escolha do Profissional */}
               {bookingStep === 'professional' && (
                 <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                       {['Qualquer um', ...MOCK_STAFF.map(s => s.name)].map(name => (
                         <button 
                          key={name} 
                          onClick={() => {
                            setCustomerInfo({...customerInfo, professionalId: name});
                            setBookingStep('time');
                          }}
                          className={cn(
                            "p-6 rounded-[30px] border-2 transition-all flex flex-col items-center gap-3",
                            customerInfo.professionalId === name ? "border-primary bg-primary/5 scale-105 shadow-xl shadow-primary/10" : "border-slate-100 bg-slate-50 text-slate-400"
                          )}
                         >
                            <div className={cn("h-14 w-14 rounded-full flex items-center justify-center text-white font-black", customerInfo.professionalId === name ? "bg-primary" : "bg-slate-200")}>
                               <User className="h-6 w-6" />
                            </div>
                            <span className="font-black italic text-xs uppercase">{name.split(' ')[0]}</span>
                         </button>
                       ))}
                    </div>
                 </div>
               )}

               {/* Passo 2: Horário */}
               {bookingStep === 'time' && (
                 <div className="space-y-8">
                    <div className="space-y-4">
                       <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Escolha o Dia</Label>
                       <Input type="date" value={customerInfo.date} onChange={e => setCustomerInfo({...customerInfo, date: e.target.value})} className="h-14 rounded-2xl bg-slate-50 border-none font-black italic" />
                    </div>
                    <div className="space-y-4">
                       <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Horários Disponíveis</Label>
                       <div className="grid grid-cols-3 gap-3">
                          {['09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'].map(t => (
                            <Button 
                              key={t} 
                              variant={customerInfo.time === t ? 'default' : 'outline'}
                              onClick={() => {
                                setCustomerInfo({...customerInfo, time: t});
                                setBookingStep('service'); // Move para dados
                              }}
                              className="h-12 rounded-xl font-black italic border-slate-100"
                            >
                               {t}
                            </Button>
                          ))}
                       </div>
                    </div>
                 </div>
               )}

               {/* Passo 3: Dados Finais */}
               {bookingStep === 'service' && (
                 <div className="space-y-8">
                    <div className="space-y-6">
                       <div className="space-y-2">
                          <Label className="text-[10px] font-black uppercase text-slate-400 px-1">Seu Nome Completo</Label>
                          <Input value={customerInfo.name} onChange={e => setCustomerInfo({...customerInfo, name: e.target.value})} placeholder="Ex: João Silva" className="h-14 rounded-2xl bg-slate-50 border-none font-bold" />
                       </div>
                       <div className="space-y-2">
                          <Label className="text-[10px] font-black uppercase text-slate-400 px-1">WhatsApp para Lembrete</Label>
                          <Input value={customerInfo.phone} onChange={e => setCustomerInfo({...customerInfo, phone: e.target.value})} placeholder="(00) 00000-0000" className="h-14 rounded-2xl bg-slate-50 border-none font-bold" />
                       </div>
                    </div>

                    <div className="p-6 bg-slate-50 rounded-[35px] border-2 border-dashed border-slate-200">
                       <div className="flex justify-between items-center mb-4">
                          <p className="text-[10px] font-black uppercase text-slate-400">Resumo da Reserva</p>
                          <Badge className="bg-primary/10 text-primary border-none font-black italic">{cart.length} itens</Badge>
                       </div>
                       <div className="space-y-2">
                          {cart.map((i, idx) => (
                            <div key={idx} className="flex justify-between text-xs font-bold text-slate-700 italic">
                               <span>{i.quantity}x {i.product?.name || i.service?.name}</span>
                               <span>R$ {((i.product?.price || i.service?.price || 0) * i.quantity).toFixed(2)}</span>
                            </div>
                          ))}
                       </div>
                       <div className="mt-4 pt-4 border-t border-dashed border-slate-200 flex justify-between items-center">
                          <span className="font-black italic text-slate-900">TOTAL</span>
                          <span className="font-black italic text-2xl text-primary">R$ {cart.reduce((a, b) => a + ((b.product?.price || b.service?.price || 0) * b.quantity), 0).toFixed(2)}</span>
                       </div>
                    </div>

                    <Button onClick={handleFinishOrder} className="w-full h-20 bg-primary hover:bg-primary/90 text-white rounded-[35px] font-black italic text-xl shadow-2xl shadow-primary/20 uppercase tracking-tighter">
                       Confirmar Agendamento <CheckCircle2 className="h-6 w-6 ml-3" />
                    </Button>
                 </div>
               )}
            </div>
         </DialogContent>
      </Dialog>
    </div>
  );
}
