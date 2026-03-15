
"use client";

import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { MOCK_MERCHANTS, MOCK_CATEGORIES, MOCK_PRODUCTS, Product, Merchant } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  ShoppingCart, Search, ChevronRight, Plus, Minus, ArrowLeft, 
  Star, Heart, Share2, QrCode, Gift, Zap, Sparkles, Lock, 
  ShieldCheck, ShoppingBag, MapPin, Phone, User, Check,
  Download, Copy, TrendingUp, CreditCard, Landmark, Wallet, 
  Trophy, Flame, Clock, RefreshCw, MessageSquare, Globe, Mic, Send, Bot, Users as UsersIcon, Calendar
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import Link from 'next/link';
import { useFirestore, useCollection, addDocumentNonBlocking, useMemoFirebase } from '@/firebase';
import { collection, serverTimestamp, query } from 'firebase/firestore';

export default function StoreFront() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;
  
  const [merchant, setMerchant] = useState<Merchant | null>(null);
  const [cart, setCart] = useState<{product: Product, quantity: number}[]>([]);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [orderType, setOrderType] = useState<'delivery' | 'pickup'>('delivery');
  const [scheduledTime, setScheduledTime] = useState("now");
  
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    phone: "",
    address: "",
    paymentMethodId: ""
  });

  const { toast } = useToast();
  const db = useFirestore();

  useEffect(() => {
    if (slug) {
      const found = MOCK_MERCHANTS.find(m => m.slug === slug);
      if (found) setMerchant(found);
    }
  }, [slug]);

  const paymentsQuery = useMemoFirebase(() => {
    if (!merchant) return null;
    return query(collection(db, 'merchants', merchant.id, 'paymentMethods'));
  }, [db, merchant]);

  const { data: lojistaPayments } = useCollection(paymentsQuery);

  const products = MOCK_PRODUCTS.filter(p => p.merchantId === merchant?.id);
  const categories = MOCK_CATEGORIES.filter(c => c.merchantId === merchant?.id);
  const filteredProducts = products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item => item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { product, quantity: 1 }];
    });
    toast({ title: "Na Sacola!", description: `${product.name} adicionado.` });
  };

  const handleFinishOrder = async () => {
    if (!customerInfo.name || !customerInfo.phone || (orderType === 'delivery' && !customerInfo.address)) {
      toast({ title: "Dados Incompletos", description: "Por favor, preencha as informações obrigatórias.", variant: "destructive" });
      return;
    }
    
    try {
      const orderId = Math.random().toString(36).substring(7);
      await addDocumentNonBlocking(collection(db, 'merchants', merchant!.id, 'orders'), {
        id: orderId,
        customerName: customerInfo.name,
        customerPhone: customerInfo.phone,
        address: customerInfo.address,
        orderType,
        scheduledTime,
        total: cart.reduce((acc, item) => acc + (item.product.price * item.quantity), 0) + (orderType === 'delivery' ? 5 : 0),
        status: 'new',
        createdAt: new Date().toISOString(),
        timestamp: serverTimestamp(),
        items: cart.map(i => ({ productId: i.product.id, productName: i.product.name, quantity: i.quantity, price: i.product.price }))
      });

      toast({ title: "Sucesso!", description: "Seu pedido foi recebido." });
      setIsCheckoutOpen(false);
      router.push(`/store/${slug}/track/${orderId}`);
    } catch (e) {
      toast({ title: "Erro", description: "Tente novamente mais tarde.", variant: "destructive" });
    }
  };

  if (!merchant) return null;

  return (
    <div className="max-w-xl mx-auto min-h-screen bg-slate-50 pb-44 relative font-body overflow-x-hidden">
      {/* Widget Status */}
      <div className="fixed top-24 right-6 z-50">
         <Badge className="bg-green-500 text-white border-4 border-white shadow-2xl py-2 px-4 rounded-full font-black text-[10px] uppercase">LOJA ABERTA ⚡</Badge>
      </div>

      {/* AI Chatbot */}
      <div className="fixed bottom-32 right-6 z-50">
         <Button onClick={() => setIsChatOpen(!isChatOpen)} className="h-14 w-14 rounded-full bg-primary text-white shadow-2xl border-4 border-white"><Bot className="h-6 w-6" /></Button>
         {isChatOpen && (
           <div className="absolute bottom-20 right-0 w-80 bg-white rounded-[35px] shadow-2xl overflow-hidden border">
              <div className="bg-slate-900 p-6 text-white flex items-center gap-3">
                 <Bot className="h-5 w-5 text-primary" />
                 <div><p className="font-black text-sm">Concierge IA</p><p className="text-[10px] text-slate-400 font-bold uppercase">Online</p></div>
              </div>
              <div className="p-6 h-48 bg-slate-50 text-xs font-bold text-slate-600">Olá! Como posso ajudar no seu pedido hoje?</div>
              <div className="p-4 bg-white border-t flex gap-2">
                 <Input className="h-10 rounded-xl text-xs font-bold" placeholder="Digite sua dúvida..." />
                 <Button size="icon" className="h-10 w-10 rounded-xl bg-primary"><Send className="h-4 w-4" /></Button>
              </div>
           </div>
         )}
      </div>

      {/* Banner & Logo */}
      <div className="relative h-64 w-full overflow-hidden">
        <img src={merchant.bannerUrl} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent"></div>
        <div className="absolute bottom-6 left-6 flex items-end gap-4">
           <div className="h-20 w-20 rounded-3xl border-4 border-white/20 bg-white shadow-2xl overflow-hidden"><img src={merchant.logoUrl} className="h-full w-full object-cover" /></div>
           <h1 className="text-xl font-black text-white italic uppercase">{merchant.name}</h1>
        </div>
      </div>

      {/* Busca */}
      <div className="px-6 py-6"><div className="relative"><Search className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" /><input className="w-full h-14 bg-white border border-slate-100 shadow-sm rounded-[24px] pl-12 text-sm font-bold outline-none focus:border-primary" placeholder="Buscar no cardápio..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} /></div></div>

      {/* Categorias & Produtos */}
      <div className="p-6 space-y-10">
        {categories.map(category => (
          <div key={category.id} className="space-y-4">
            <h2 className="text-lg font-black text-slate-900 italic border-l-4 border-primary pl-4 uppercase">{category.name}</h2>
            <div className="grid gap-4">
              {filteredProducts.filter(p => p.categoryId === category.id).map(product => (
                <div key={product.id} onClick={() => addToCart(product)} className="flex gap-4 p-4 bg-white border border-slate-100 rounded-[30px] shadow-sm active:scale-95 transition-all">
                  <div className="flex-1"><h3 className="font-black text-slate-900 text-sm">{product.name}</h3><p className="text-[10px] text-slate-500 line-clamp-2 mt-1">{product.description}</p><p className="font-black text-primary text-lg mt-2">R$ {product.price.toFixed(2)}</p></div>
                  <div className="h-20 w-20 rounded-2xl bg-slate-100 overflow-hidden shrink-0"><img src={product.imageUrl} className="w-full h-full object-cover" /></div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Footer Carrinho */}
      <div className="fixed bottom-10 left-1/2 -translate-x-1/2 w-full max-w-xl px-8 z-50">
        <Button onClick={() => setIsCheckoutOpen(true)} disabled={cart.length === 0} className="w-full bg-slate-900 h-20 rounded-[45px] flex justify-between px-12 shadow-2xl active:scale-95 transition-all disabled:opacity-50">
          <div className="flex items-center gap-4">
             <div className="relative"><ShoppingCart className="h-6 w-6 text-primary" /><span className="absolute -top-3 -right-3 h-6 w-6 bg-primary text-white rounded-full text-[10px] font-black flex items-center justify-center border-4 border-slate-900">{cart.reduce((a, b) => a + b.quantity, 0)}</span></div>
             <span className="font-black text-lg text-white italic uppercase tracking-tighter">Minha Sacola</span>
          </div>
          <span className="font-black text-2xl text-primary italic tracking-tighter">R$ {cart.reduce((a, b) => a + (b.product.price * b.quantity), 0).toFixed(2)}</span>
        </Button>
      </div>

      {/* Modal Checkout com Agendamento */}
      <Dialog open={isCheckoutOpen} onOpenChange={setIsCheckoutOpen}>
        <DialogContent className="sm:max-w-lg p-0 overflow-hidden rounded-[40px] border-none shadow-2xl font-body">
           <div className="bg-slate-900 p-8 text-white flex justify-between items-center">
              <div><h2 className="text-2xl font-black italic uppercase">Finalizar Pedido</h2><p className="text-xs text-primary font-bold uppercase tracking-widest">Confirme seus dados</p></div>
              <ShoppingBag className="h-8 w-8 text-primary" />
           </div>
           
           <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto no-scrollbar">
              <div className="space-y-4">
                 <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Tipo de Pedido & Horário</h3>
                 <div className="grid grid-cols-2 gap-3">
                    <Button variant={orderType === 'delivery' ? 'default' : 'outline'} onClick={() => setOrderType('delivery')} className="rounded-2xl h-12 font-black italic">Entregar</Button>
                    <Button variant={orderType === 'pickup' ? 'default' : 'outline'} onClick={() => setOrderType('pickup')} className="rounded-2xl h-12 font-black italic">Retirar</Button>
                 </div>
                 <div className="space-y-2">
                    <Label className="text-[9px] font-black uppercase text-slate-400 px-1">Agendar para:</Label>
                    <Select value={scheduledTime} onValueChange={setScheduledTime}>
                       <SelectTrigger className="h-12 rounded-xl bg-slate-50 border-none font-bold"><SelectValue /></SelectTrigger>
                       <SelectContent><SelectItem value="now">O quanto antes (25-45 min)</SelectItem><SelectItem value="18:00">18:00 - 18:30</SelectItem><SelectItem value="19:00">19:00 - 19:30</SelectItem><SelectItem value="20:00">20:00 - 20:30</SelectItem></SelectContent>
                    </Select>
                 </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Seus Dados</h3>
                <div className="space-y-3">
                  <Input placeholder="Nome Completo" className="h-12 rounded-xl bg-slate-50 border-none font-bold" value={customerInfo.name} onChange={e => setCustomerInfo({...customerInfo, name: e.target.value})} />
                  <Input placeholder="WhatsApp" className="h-12 rounded-xl bg-slate-50 border-none font-bold" value={customerInfo.phone} onChange={e => setCustomerInfo({...customerInfo, phone: e.target.value})} />
                  {orderType === 'delivery' && <Textarea placeholder="Endereço Completo..." className="rounded-xl bg-slate-50 border-none font-bold" value={customerInfo.address} onChange={e => setCustomerInfo({...customerInfo, address: e.target.value})} />}
                </div>
              </div>

              <Button onClick={handleFinishOrder} className="w-full h-16 bg-primary hover:bg-primary/90 rounded-[28px] font-black text-xl italic shadow-2xl">Confirmar e Enviar</Button>
           </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
