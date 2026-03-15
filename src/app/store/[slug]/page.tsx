
"use client";

import * as React from 'react';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { MOCK_MERCHANTS, MOCK_CATEGORIES, MOCK_PRODUCTS, MOCK_SERVICES, MOCK_STAFF, Product, Service, Merchant } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ShoppingCart, Search, ChevronRight, Plus, Minus, ArrowLeft, 
  Star, Heart, QrCode, Gift, Zap, Sparkles, ShoppingBag, MapPin, 
  Phone, Check, CreditCard, Landmark, Wallet, Clock, Bot, 
  Send, Scissors, Calendar as CalendarIcon, User, Timer, CheckCircle2
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useFirestore, addDocumentNonBlocking } from '@/firebase';
import { collection, serverTimestamp } from 'firebase/firestore';

export default function StoreFront() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;
  
  const [merchant, setMerchant] = useState<Merchant | null>(null);
  const [cart, setCart] = useState<{product?: Product, service?: Service, quantity: number}[]>([]);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [orderType, setOrderType] = useState<'delivery' | 'pickup' | 'appointment'>('delivery');
  
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    phone: "",
    address: "",
    professional: "",
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
        if (found.segment === 'BEAUTY' || found.segment === 'HEALTH' || found.segment === 'SERVICE') {
          setOrderType('appointment');
        }
      }
    }
  }, [slug]);

  const isServiceBusiness = merchant?.segment === 'BEAUTY' || merchant?.segment === 'HEALTH' || merchant?.segment === 'SERVICE';

  const products = MOCK_PRODUCTS.filter(p => p.merchantId === merchant?.id);
  const services = MOCK_SERVICES.filter(s => s.merchantId === merchant?.id);

  const addToCart = (item: Product | Service, type: 'product' | 'service') => {
    // Para serviços, geralmente agendamos um por vez no fluxo simplificado, 
    // mas mantemos o carrinho para permitir combos (ex: Corte + Pomada)
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
    toast({ 
      title: "Item Selecionado", 
      description: `${item.name} adicionado à sua reserva.` 
    });
  };

  const handleFinishOrder = async () => {
    if (!customerInfo.name || !customerInfo.phone) {
      toast({ title: "Dados Incompletos", description: "Preencha seu nome e WhatsApp.", variant: "destructive" });
      return;
    }

    if (orderType === 'appointment' && (!customerInfo.time || !customerInfo.professional)) {
      toast({ title: "Horário Pendente", description: "Escolha o barbeiro e o horário do atendimento.", variant: "destructive" });
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
        orderType,
        status: orderType === 'appointment' ? 'scheduled' : 'new',
        createdAt: new Date().toISOString(),
        timestamp: serverTimestamp(),
        total,
        scheduledProfessional: customerInfo.professional,
        scheduledTime: orderType === 'appointment' ? `${customerInfo.date} ${customerInfo.time}` : undefined,
        items: cart.map(i => ({
          productId: i.product?.id || null,
          serviceId: i.service?.id || null,
          productName: i.product?.name || i.service?.name,
          quantity: i.quantity,
          price: i.product?.price || i.service?.price
        }))
      });

      toast({ 
        title: orderType === 'appointment' ? "Reserva Confirmada!" : "Pedido Enviado!", 
        description: "Você receberá uma confirmação em instantes." 
      });
      
      setIsCheckoutOpen(false);
      router.push(`/store/${slug}/track/${orderId}`);
    } catch (e) {
      toast({ title: "Erro", description: "Falha ao processar reserva.", variant: "destructive" });
    }
  };

  if (!merchant) return null;

  return (
    <div className="max-w-xl mx-auto min-h-screen bg-slate-50 pb-44 relative font-body overflow-x-hidden">
      {/* Header Mobile / Navigation */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b p-4 flex items-center justify-between">
         <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-xl">
            <ArrowLeft className="h-5 w-5" />
         </Button>
         <div className="text-center">
            <p className="font-black text-xs uppercase tracking-widest text-slate-400">Você está em</p>
            <p className="font-black text-sm italic text-primary uppercase">{merchant.name}</p>
         </div>
         <div className="w-10"></div>
      </div>

      {/* Hero Section */}
      <div className="relative h-56 w-full overflow-hidden">
        <img src={merchant.bannerUrl} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>
        <div className="absolute bottom-6 left-6 flex items-end gap-4">
           <div className="h-20 w-20 rounded-[28px] border-4 border-white/20 bg-white shadow-2xl overflow-hidden shrink-0">
              <img src={merchant.logoUrl} className="h-full w-full object-cover" />
           </div>
           <div className="pb-1">
              <h1 className="text-2xl font-black text-white italic uppercase tracking-tighter">{merchant.name}</h1>
              <div className="flex items-center gap-2 mt-1">
                 <Badge className="bg-primary text-white border-none font-black italic text-[8px] px-2 py-0.5 uppercase">
                    {merchant.segment}
                 </Badge>
                 <span className="text-[10px] text-white/60 font-bold flex items-center gap-1"><Star className="h-3 w-3 fill-yellow-400 text-yellow-400" /> 4.9 (120+)</span>
              </div>
           </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-6 space-y-10">
        {/* Agendamento de Serviços */}
        {isServiceBusiness && (
          <div className="space-y-6">
             <div className="flex items-center justify-between">
                <h2 className="text-xl font-black text-slate-900 italic uppercase tracking-tighter flex items-center gap-2">
                   <Scissors className="h-5 w-5 text-primary" /> Serviços Disponíveis
                </h2>
                <Badge variant="outline" className="border-primary/20 text-primary font-black italic">Hoje</Badge>
             </div>
             
             <div className="grid gap-4">
                {services.map(s => (
                  <div 
                    key={s.id} 
                    onClick={() => addToCart(s, 'service')} 
                    className="flex gap-4 p-5 bg-white border border-slate-100 rounded-[35px] shadow-sm active:scale-[0.98] transition-all group relative overflow-hidden"
                  >
                     <div className="h-16 w-16 rounded-[24px] bg-slate-50 flex items-center justify-center text-slate-400 group-active:bg-primary group-active:text-white transition-colors">
                        <Scissors className="h-8 w-8" />
                     </div>
                     <div className="flex-1">
                        <h3 className="font-black text-slate-900 text-base uppercase italic">{s.name}</h3>
                        <div className="flex items-center gap-3 mt-1">
                           <p className="text-[10px] text-slate-400 font-bold uppercase flex items-center gap-1">
                              <Timer className="h-3 w-3" /> {s.duration} MIN
                           </p>
                           <p className="text-[10px] text-primary font-black uppercase">Pronta Reserva</p>
                        </div>
                        <p className="font-black text-primary text-xl mt-2 italic">R$ {s.price.toFixed(2)}</p>
                     </div>
                     <div className="flex items-center justify-center bg-slate-50 rounded-full h-10 w-10 my-auto">
                        <Plus className="h-5 w-5 text-slate-300 group-hover:text-primary" />
                     </div>
                  </div>
                ))}
             </div>
          </div>
        )}

        {/* Produtos Extras */}
        {products.length > 0 && (
          <div className="space-y-6">
             <h2 className="text-xl font-black text-slate-900 italic uppercase tracking-tighter flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-accent" /> Produtos de Cuidado
             </h2>
             <div className="grid grid-cols-2 gap-4">
                {products.map(p => (
                  <div key={p.id} onClick={() => addToCart(p, 'product')} className="bg-white border border-slate-100 rounded-[35px] shadow-sm p-4 flex flex-col gap-3 active:scale-[0.98] transition-all">
                     <div className="h-32 w-full rounded-[28px] bg-slate-100 overflow-hidden shadow-inner">
                        <img src={p.imageUrl} className="h-full w-full object-cover" />
                     </div>
                     <div>
                        <h3 className="font-black text-slate-900 text-xs uppercase italic truncate">{p.name}</h3>
                        <p className="font-black text-accent text-lg mt-1 italic">R$ {p.price.toFixed(2)}</p>
                     </div>
                     <Button variant="secondary" size="sm" className="w-full rounded-2xl font-black italic text-[10px] h-8 bg-slate-50 text-slate-400 hover:bg-accent hover:text-white border-none">
                        ADICIONAR
                     </Button>
                  </div>
                ))}
             </div>
          </div>
        )}
      </div>

      {/* Floating Cart Button */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-full max-w-xl px-6 z-50">
        <Button 
          onClick={() => setIsCheckoutOpen(true)} 
          disabled={cart.length === 0} 
          className="w-full bg-slate-900 h-20 rounded-[45px] flex justify-between px-10 shadow-2xl active:scale-95 transition-all border-4 border-white/5"
        >
          <div className="flex items-center gap-4">
             <div className="relative">
                <div className="bg-primary/20 p-2 rounded-xl">
                   {isServiceBusiness ? <CalendarIcon className="h-6 w-6 text-primary" /> : <ShoppingCart className="h-6 w-6 text-primary" />}
                </div>
                <span className="absolute -top-2 -right-2 h-6 w-6 bg-primary text-white rounded-full text-[10px] font-black flex items-center justify-center border-4 border-slate-900">
                   {cart.reduce((a, b) => a + b.quantity, 0)}
                </span>
             </div>
             <div className="text-left">
                <span className="font-black text-lg text-white italic uppercase tracking-tighter block leading-none">
                   {isServiceBusiness ? 'Reservar' : 'Finalizar'}
                </span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                   {cart.length} itens na sacola
                </span>
             </div>
          </div>
          <span className="font-black text-2xl text-primary italic tracking-tighter">
             R$ {cart.reduce((a, b) => a + ((b.product?.price || b.service?.price || 0) * b.quantity), 0).toFixed(2)}
          </span>
        </Button>
      </div>

      {/* Checkout / Booking Dialog */}
      <Dialog open={isCheckoutOpen} onOpenChange={setIsCheckoutOpen}>
        <DialogContent className="sm:max-w-lg p-0 overflow-hidden rounded-[40px] border-none shadow-2xl font-body">
           <div className="bg-slate-900 p-10 text-white relative overflow-hidden">
              <div className="relative z-10">
                 <h2 className="text-3xl font-black italic uppercase tracking-tighter leading-none">
                    {isServiceBusiness ? 'Confirmar Agendamento' : 'Fechar Pedido'}
                 </h2>
                 <p className="text-xs text-primary font-bold uppercase tracking-[0.2em] mt-2">
                    {merchant.name} • checkout seguro
                 </p>
              </div>
              <Zap className="absolute -bottom-6 -right-6 h-32 w-32 text-primary/10 animate-pulse" />
           </div>
           
           <div className="p-10 space-y-8 max-h-[70vh] overflow-y-auto no-scrollbar">
              {isServiceBusiness && (
                <div className="space-y-8">
                   {/* Escolha do Barbeiro */}
                   <div className="space-y-4">
                      <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1">Selecione o Barbeiro</Label>
                      <div className="grid grid-cols-2 gap-3">
                         {['Qualquer um', ...MOCK_STAFF.map(s => s.name.split(' ')[0])].map(name => (
                           <button 
                            key={name} 
                            onClick={() => setCustomerInfo({...customerInfo, professional: name})}
                            className={cn(
                              "h-14 rounded-2xl font-black italic text-xs uppercase border-2 transition-all flex items-center justify-center gap-2",
                              customerInfo.professional === name 
                                ? "bg-primary border-primary text-white shadow-lg shadow-primary/20 scale-105" 
                                : "bg-slate-50 border-slate-100 text-slate-400"
                            )}
                           >
                              <User className="h-4 w-4" /> {name}
                           </button>
                         ))}
                      </div>
                   </div>

                   {/* Data e Horário */}
                   <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                         <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1">Data</Label>
                         <Input 
                          type="date" 
                          className="h-14 rounded-2xl bg-slate-50 border-none font-black italic" 
                          value={customerInfo.date} 
                          onChange={e => setCustomerInfo({...customerInfo, date: e.target.value})} 
                         />
                      </div>
                      <div className="space-y-2">
                         <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1">Horário</Label>
                         <Select value={customerInfo.time} onValueChange={v => setCustomerInfo({...customerInfo, time: v})}>
                            <SelectTrigger className="h-14 rounded-2xl bg-slate-50 border-none font-black italic text-lg">
                               <SelectValue placeholder="Selecione" />
                            </SelectTrigger>
                            <SelectContent className="rounded-2xl border-none shadow-2xl">
                               {['09:00', '09:30', '10:00', '10:30', '11:00', '14:00', '14:30', '15:00', '16:00', '17:00'].map(t => (
                                 <SelectItem key={t} value={t} className="font-black italic">{t}</SelectItem>
                               ))}
                            </SelectContent>
                         </Select>
                      </div>
                   </div>
                </div>
              )}

              {/* Informações de Contato */}
              <div className="space-y-6 pt-6 border-t border-dashed">
                <div className="space-y-2">
                   <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1">Seu Nome</Label>
                   <Input 
                    placeholder="Como podemos te chamar?" 
                    className="h-14 rounded-2xl bg-slate-50 border-none font-bold" 
                    value={customerInfo.name} 
                    onChange={e => setCustomerInfo({...customerInfo, name: e.target.value})} 
                   />
                </div>
                <div className="space-y-2">
                   <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1">WhatsApp</Label>
                   <Input 
                    placeholder="(00) 00000-0000" 
                    className="h-14 rounded-2xl bg-slate-50 border-none font-bold" 
                    value={customerInfo.phone} 
                    onChange={e => setCustomerInfo({...customerInfo, phone: e.target.value})} 
                   />
                </div>
              </div>

              {/* Resumo da Reserva */}
              <div className="p-6 bg-primary/5 rounded-[32px] border border-primary/10">
                 <div className="flex justify-between items-center mb-4">
                    <p className="text-[10px] font-black uppercase text-slate-400">Resumo</p>
                    <Badge className="bg-white text-primary border-none font-black italic text-[8px]">{cart.length} ITENS</Badge>
                 </div>
                 <div className="space-y-2">
                    {cart.map((i, idx) => (
                      <div key={idx} className="flex justify-between text-xs font-bold text-slate-700">
                         <span>{i.quantity}x {i.product?.name || i.service?.name}</span>
                         <span>R$ {((i.product?.price || i.service?.price || 0) * i.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                 </div>
                 <div className="mt-4 pt-4 border-t border-dashed border-primary/20 flex justify-between items-center">
                    <span className="font-black italic text-slate-900">TOTAL</span>
                    <span className="font-black italic text-2xl text-primary">R$ {cart.reduce((a, b) => a + ((b.product?.price || b.service?.price || 0) * b.quantity), 0).toFixed(2)}</span>
                 </div>
              </div>

              <Button 
                onClick={handleFinishOrder} 
                className="w-full h-20 bg-primary hover:bg-primary/90 rounded-[35px] font-black text-xl italic shadow-2xl shadow-primary/20 uppercase tracking-tighter group transition-all"
              >
                 {isServiceBusiness ? 'Confirmar Minha Reserva' : 'Enviar Meu Pedido'}
                 <ChevronRight className="h-6 w-6 ml-2 group-hover:translate-x-2 transition-transform" />
              </Button>
              
              <p className="text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                 Ao confirmar, você aceita nossos termos de agendamento.
              </p>
           </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
