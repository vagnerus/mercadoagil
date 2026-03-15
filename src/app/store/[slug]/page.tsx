
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
import { useToast } from "@/hooks/use-toast";
import { useFirestore, addDocumentNonBlocking } from '@/firebase';
import { collection, serverTimestamp } from 'firebase/firestore';
import Link from 'next/link';
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

      addDocumentNonBlocking(collection(db, 'merchants', merchant?.id || 'm1', 'orders'), {
        id: orderId,
        customerName: customerInfo.name,
        customerPhone: customerInfo.phone,
        address: customerInfo.address,
        orderType: isServiceBusiness ? 'appointment' : 'delivery',
        status: isServiceBusiness ? 'scheduled' : 'new',
        createdAt: new Date().toISOString(),
        timestamp: serverTimestamp(),
        total,
        items: cart.map(i => ({
          name: i.product?.name || i.service?.name,
          quantity: i.quantity,
          price: i.product?.price || i.service?.price
        }))
      });

      toast({ title: "Sucesso!", description: "Pedido processado." });
      setIsCheckoutOpen(false);
      router.push(`/store/${slug}/track/${orderId}`);
    } catch (e) {
      toast({ title: "Erro", description: "Falha ao processar.", variant: "destructive" });
    }
  };

  if (!merchant) return null;

  return (
    <div className="max-w-xl mx-auto min-h-screen bg-white pb-44 relative font-body">
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b p-4 flex items-center justify-between">
         <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-primary flex items-center justify-center text-white shadow-lg">
               {isServiceBusiness ? <Scissors className="h-5 w-5" /> : <ShoppingBag className="h-5 w-5" />}
            </div>
            <div>
               <h1 className="font-black text-sm uppercase italic leading-none">{merchant.name}</h1>
               <p className="text-[10px] font-bold text-slate-400 mt-1 flex items-center gap-1 uppercase">
                  <MapPin className="h-2 w-2" /> {merchant.slug}.agil.com
               </p>
            </div>
         </div>
         <Link href={`/store/${slug}/profile`} className="p-2 bg-slate-50 rounded-full"><User className="h-5 w-5 text-slate-400" /></Link>
      </div>

      <div className="relative h-48 w-full">
        <img src={merchant.bannerUrl} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent"></div>
      </div>

      <div className="px-6 -mt-10 relative z-10 space-y-10">
         <div className="bg-white rounded-[40px] shadow-2xl p-8 border border-slate-50">
            <div className="flex justify-between items-start">
               <div className="space-y-1">
                  <h2 className="text-2xl font-black italic tracking-tighter uppercase">{merchant.name}</h2>
                  <Badge className="bg-green-500 text-white border-none font-black italic text-[8px] uppercase">ABERTO AGORA</Badge>
               </div>
               <div className="flex gap-2">
                  <Button variant="ghost" size="icon" className="rounded-full bg-slate-50"><Heart className="h-4 w-4" /></Button>
               </div>
            </div>
            <div className="flex gap-2 mt-6 overflow-x-auto no-scrollbar">
               <Button variant="outline" className="rounded-2xl gap-2 font-bold h-10 border-slate-100 text-slate-600"><MapIcon className="h-4 w-4" /> Mapa</Button>
               <Button variant="outline" className="rounded-2xl gap-2 font-bold h-10 border-slate-100 text-slate-600"><MessageCircle className="h-4 w-4" /> WhatsApp</Button>
            </div>
         </div>

         {isServiceBusiness ? (
           <div className="space-y-6">
              <h3 className="text-lg font-black italic uppercase tracking-tighter">Escolha um Serviço</h3>
              <div className="grid gap-4">
                 {MOCK_SERVICES.filter(s => s.merchantId === merchant.id).length === 0 ? (
                   <div className="p-10 text-center bg-slate-50 rounded-[35px] border-2 border-dashed border-slate-200">
                      <p className="text-xs font-bold text-slate-400 uppercase italic">Nenhum serviço cadastrado ainda.</p>
                   </div>
                 ) : (
                   MOCK_SERVICES.filter(s => s.merchantId === merchant.id).map(s => (
                     <div key={s.id} onClick={() => addToCart(s, 'service')} className="p-5 bg-slate-50 rounded-[35px] flex items-center gap-4 cursor-pointer active:scale-95 transition-all">
                        <div className="h-16 w-16 rounded-[24px] bg-white shadow-sm flex items-center justify-center text-slate-400">
                           <Scissors className="h-8 w-8" />
                        </div>
                        <div className="flex-1">
                           <p className="font-black text-slate-900 uppercase italic text-sm">{s.name}</p>
                           <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">{s.duration} min</p>
                           <p className="font-black text-primary italic mt-1">R$ {s.price.toFixed(2)}</p>
                        </div>
                        <Plus className="h-5 w-5 text-primary mr-2" />
                     </div>
                   ))
                 )}
              </div>
           </div>
         ) : (
           <div className="space-y-6">
              <h3 className="text-lg font-black italic uppercase tracking-tighter">Produtos em Destaque</h3>
              <div className="grid grid-cols-2 gap-4">
                 {MOCK_PRODUCTS.filter(p => p.merchantId === merchant.id).length === 0 ? (
                   <div className="col-span-2 p-10 text-center bg-slate-50 rounded-[35px] border-2 border-dashed border-slate-200">
                      <p className="text-xs font-bold text-slate-400 uppercase italic">Catálogo vazio no momento.</p>
                   </div>
                 ) : (
                   MOCK_PRODUCTS.filter(p => p.merchantId === merchant.id).map(p => (
                     <div key={p.id} onClick={() => addToCart(p, 'product')} className="bg-slate-50 p-4 rounded-[35px] space-y-3 cursor-pointer active:scale-95 transition-all">
                        <div className="h-32 w-full bg-white rounded-2xl overflow-hidden"><img src={p.imageUrl} className="h-full w-full object-cover" /></div>
                        <div><p className="font-black text-[10px] uppercase italic truncate">{p.name}</p><p className="font-black text-primary italic text-sm">R$ {p.price.toFixed(2)}</p></div>
                     </div>
                   ))
                 )}
              </div>
           </div>
         )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-6 bg-white border-t rounded-t-[45px] shadow-[0_-20px_50px_-15px_rgba(0,0,0,0.15)] z-50">
         <Button 
          disabled={cart.length === 0}
          onClick={() => setIsCheckoutOpen(true)}
          className="w-full h-16 bg-slate-900 text-white rounded-[30px] font-black italic text-lg shadow-2xl flex justify-between px-10"
         >
            <div className="flex items-center gap-3">
               <div className="bg-primary p-1.5 rounded-lg text-white">
                  {isServiceBusiness ? <CalendarIcon className="h-5 w-5" /> : <ShoppingCart className="h-5 w-5" />}
               </div>
               <span>{isServiceBusiness ? 'RESERVAR AGORA' : 'VER CARRINHO'}</span>
            </div>
            <span>R$ {cart.reduce((a, b) => a + ((b.product?.price || b.service?.price || 0) * b.quantity), 0).toFixed(2)}</span>
         </Button>
      </div>

      <Dialog open={isCheckoutOpen} onOpenChange={setIsCheckoutOpen}>
         <DialogContent className="sm:max-w-lg p-0 rounded-[45px] border-none shadow-2xl overflow-hidden font-body">
            <div className="bg-slate-900 p-8 text-white">
               <DialogTitle className="text-3xl font-black italic uppercase">Finalizar</DialogTitle>
               <p className="text-primary font-bold text-[10px] uppercase tracking-widest mt-1">Conclua sua reserva com segurança.</p>
            </div>
            <div className="p-8 space-y-6">
               <div className="space-y-4">
                  <div className="space-y-2"><Label className="text-[10px] font-black uppercase text-slate-400 px-1">Seu Nome</Label><Input value={customerInfo.name} onChange={e => setCustomerInfo({...customerInfo, name: e.target.value})} className="h-14 rounded-2xl bg-slate-50 border-none font-bold" /></div>
                  <div className="space-y-2"><Label className="text-[10px] font-black uppercase text-slate-400 px-1">WhatsApp</Label><Input value={customerInfo.phone} onChange={e => setCustomerInfo({...customerInfo, phone: e.target.value})} className="h-14 rounded-2xl bg-slate-50 border-none font-bold" /></div>
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
