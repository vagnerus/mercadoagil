
"use client";

import * as React from 'react';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { MOCK_MERCHANTS, MOCK_CATEGORIES, MOCK_PRODUCTS, Product, Merchant } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ShoppingCart, Search, ChevronRight, Plus, Minus, ArrowLeft, 
  Star, Heart, Share2, QrCode, Gift, Zap, Sparkles, Lock, 
  ShieldCheck, ShoppingBag, MapPin, Phone, User, Check,
  Download, Copy, TrendingUp, CreditCard, Landmark, Wallet, Briefcase, Pill, MessageSquare
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
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
  const [userTier] = useState<'Bronze' | 'Silver' | 'Gold'>('Silver');
  const [walletBalance] = useState(142.50);
  const [useWallet, setUseWallet] = useState(false);
  
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
  
  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addToCart = (product: Product) => {
    if (product.isLoyaltyExclusive && product.requiredTier === 'Gold' && userTier !== 'Gold') {
      toast({ title: "Item Bloqueado", description: "Este item é exclusivo para clientes Nível Ouro!", variant: "destructive" });
      return;
    }

    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item => item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { product, quantity: 1 }];
    });
    toast({ title: "Adicionado!", description: `${product.name} no carrinho.` });
  };

  const handleFinishOrder = async () => {
    if (!customerInfo.name || !customerInfo.phone || !customerInfo.address || (!customerInfo.paymentMethodId && !useWallet)) {
      toast({ title: "Dados incompletos", description: "Por favor, preencha as informações de entrega e pagamento.", variant: "destructive" });
      return;
    }
    
    try {
      const orderId = Math.random().toString(36).substring(7);
      const selectedPayment = lojistaPayments?.find(p => p.id === customerInfo.paymentMethodId);

      await addDocumentNonBlocking(collection(db, 'merchants', merchant!.id, 'orders'), {
        id: orderId,
        customerName: customerInfo.name,
        customerPhone: customerInfo.phone,
        address: customerInfo.address,
        paymentMethod: useWallet ? 'Wallet Credits' : (selectedPayment?.type || 'Não informado'),
        total: finalTotal,
        status: 'new',
        createdAt: new Date().toISOString(),
        timestamp: serverTimestamp(),
        items: cart.map(i => ({
          productId: i.product.id,
          productName: i.product.name,
          quantity: i.quantity,
          price: i.product.price
        })),
        isPaid: useWallet
      });

      toast({ title: "Pedido enviado!", description: "Seu pedido está sendo processado." });
      setIsCheckoutOpen(false);
      router.push(`/store/${slug}/track/${orderId}`);
    } catch (e) {
      toast({ title: "Erro", description: "Falha ao enviar pedido.", variant: "destructive" });
    }
  };

  const cartTotal = cart.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  const deliveryFee = userTier === 'Gold' ? 0 : 5.00;
  const finalTotal = cartTotal + deliveryFee;

  if (!merchant) return null;

  return (
    <div className="max-w-xl mx-auto min-h-screen bg-slate-50 pb-44 relative font-body overflow-x-hidden">
      <div className="relative h-72 w-full overflow-hidden">
        <img src={merchant.bannerUrl} alt={merchant.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent"></div>
        <Link href="/" className="absolute top-6 left-6 bg-white/90 p-3 rounded-2xl shadow-xl z-50">
           <ArrowLeft className="h-5 w-5 text-slate-800" />
        </Link>
        <div className="absolute top-6 right-6 flex gap-2 z-50">
           <div className="bg-white/90 p-3 rounded-2xl shadow-xl"><Share2 className="h-5 w-5 text-slate-800" /></div>
           <div className="bg-white/90 p-3 rounded-2xl shadow-xl"><QrCode className="h-5 w-5 text-slate-800" /></div>
        </div>
        <div className="absolute bottom-8 left-8 right-8 flex items-end gap-6">
           <div className="h-24 w-24 rounded-[30px] border-4 border-white/20 bg-white shadow-2xl overflow-hidden shrink-0">
             <img src={merchant.logoUrl} alt={merchant.name} className="h-full w-full object-cover" />
           </div>
           <div className="flex-1 pb-2 space-y-1">
             <div className="flex items-center gap-2">
                <Badge className="bg-primary text-white text-[8px] font-black rounded-full uppercase px-3 shadow-lg">{userTier} Member</Badge>
                <div className="flex items-center text-white text-xs font-black gap-1">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" /> 4.9
                </div>
             </div>
             <h1 className="text-2xl font-black text-white italic tracking-tighter">{merchant.name}</h1>
           </div>
        </div>
      </div>

      <div className="p-6 grid grid-cols-2 gap-4">
         <div className="bg-primary p-5 rounded-[30px] flex flex-col justify-between h-32 relative overflow-hidden text-white shadow-xl shadow-primary/20">
            <Gift className="h-10 w-10 opacity-20 absolute -right-2 -bottom-2" />
            <p className="text-[9px] font-black uppercase tracking-widest text-white/80">Fidelidade</p>
            <div>
               <p className="text-2xl font-black italic tracking-tighter">750 pts</p>
               <div className="h-1.5 w-full bg-white/20 rounded-full mt-2 overflow-hidden">
                  <div className="h-full bg-white w-[75%]"></div>
               </div>
            </div>
         </div>
         <div className="bg-white p-5 rounded-[30px] flex flex-col justify-between h-32 relative overflow-hidden border border-slate-100 shadow-sm">
            <Wallet className="h-10 w-10 opacity-5 absolute -right-2 -bottom-2" />
            <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Minha Carteira</p>
            <div>
               <p className="text-2xl font-black italic tracking-tighter text-slate-900">R$ {walletBalance.toFixed(2)}</p>
               <p className="text-[8px] font-bold text-green-600 mt-1 flex items-center gap-1"><Sparkles className="h-2 w-2" /> +R$ 12.00 Cashback Pendente</p>
            </div>
         </div>
      </div>

      <div className="px-6 py-2">
        <div className="relative">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input 
            className="w-full h-14 bg-white border border-slate-100 shadow-sm rounded-[24px] pl-12 pr-4 text-sm font-bold outline-none focus:border-primary transition-all" 
            placeholder={`Buscar em ${merchant.name}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="p-6 space-y-12">
        {categories.length > 0 ? categories.map(category => {
          const catProducts = filteredProducts.filter(p => p.categoryId === category.id);
          if (catProducts.length === 0) return null;

          return (
            <div key={category.id} className="space-y-6">
              <h2 className="text-xl font-black text-slate-900 tracking-tighter italic border-l-4 border-primary pl-4">{category.name}</h2>
              <div className="grid gap-6">
                {catProducts.map(product => (
                  <div 
                    key={product.id}
                    onClick={() => addToCart(product)}
                    className={`flex gap-4 p-4 bg-white border border-slate-100 rounded-[35px] shadow-sm relative overflow-hidden group cursor-pointer active:scale-95 transition-all ${
                      product.isLoyaltyExclusive && userTier !== 'Gold' ? 'opacity-80 grayscale-[0.5]' : ''
                    }`}
                  >
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                         <h3 className="font-black text-slate-900 text-base">{product.name}</h3>
                         {product.isLoyaltyExclusive && <Lock className="h-3 w-3 text-yellow-600" />}
                      </div>
                      <p className="text-[10px] text-slate-500 line-clamp-2 font-medium">{product.description}</p>
                      <div className="flex items-center gap-3 mt-3">
                        <p className="font-black text-primary text-lg italic">R$ {product.price.toFixed(2)}</p>
                        {product.isLoyaltyExclusive && (
                          <Badge className="bg-yellow-50 text-yellow-700 text-[8px] font-black border-none uppercase">Gold Exclusive</Badge>
                        )}
                      </div>
                    </div>
                    <div className="h-24 w-24 rounded-[28px] bg-slate-100 overflow-hidden shrink-0 relative">
                      <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        }) : (
          <div className="text-center p-20">
             <ShoppingBag className="h-12 w-12 text-slate-200 mx-auto mb-4" />
             <p className="font-black text-slate-400 italic">Carregando catálogo...</p>
          </div>
        )}
      </div>

      <Dialog open={isCheckoutOpen} onOpenChange={setIsCheckoutOpen}>
        <DialogContent className="sm:max-w-lg p-0 overflow-hidden rounded-[40px] border-none shadow-2xl font-body">
           <div className="bg-slate-900 p-8 text-white flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-black italic tracking-tighter">Confirmar Pedido</h2>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Revisão de Itens & Pagamento</p>
              </div>
              <ShoppingBag className="h-8 w-8 text-primary" />
           </div>
           
           <div className="p-8 space-y-8 max-h-[70vh] overflow-y-auto no-scrollbar">
              <div className="space-y-4">
                 <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Saldo em Carteira</h3>
                 <div 
                   onClick={() => setUseWallet(!useWallet)}
                   className={`p-6 rounded-3xl border-2 transition-all cursor-pointer flex justify-between items-center ${
                     useWallet ? 'border-primary bg-primary/5' : 'border-slate-100 bg-white'
                   }`}
                 >
                    <div className="flex items-center gap-4">
                       <div className={`h-12 w-12 rounded-2xl flex items-center justify-center ${useWallet ? 'bg-primary text-white' : 'bg-slate-100 text-slate-400'}`}>
                          <Wallet className="h-6 w-6" />
                       </div>
                       <div>
                          <p className="font-black text-sm">Pagar com Saldo (R$ {walletBalance.toFixed(2)})</p>
                          <p className="text-[10px] text-slate-400 font-bold">Use seus créditos e ganhe +2% de cashback.</p>
                       </div>
                    </div>
                    <div className={`h-6 w-6 rounded-full border-2 flex items-center justify-center ${useWallet ? 'bg-primary border-primary' : 'border-slate-200'}`}>
                       {useWallet && <Check className="h-4 w-4 text-white" />}
                    </div>
                 </div>
              </div>

              {!useWallet && (
                <div className="space-y-4">
                  <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Outras Formas</h3>
                  <RadioGroup className="grid gap-3" onValueChange={v => setCustomerInfo({...customerInfo, paymentMethodId: v})}>
                    {lojistaPayments?.filter(p => p.isActive).map(method => (
                      <Label key={method.id} className="flex items-center justify-between p-4 rounded-2xl border-2 border-slate-100 hover:border-primary transition-all cursor-pointer">
                        <div className="flex items-center gap-3">
                          <RadioGroupItem value={method.id} id={method.id} />
                          <p className="font-black text-sm">{method.type}</p>
                        </div>
                        {method.type === 'PIX' ? <Landmark className="h-4 w-4 text-primary" /> : <CreditCard className="h-4 w-4 text-slate-400" />}
                      </Label>
                    ))}
                  </RadioGroup>
                </div>
              )}

              <div className="space-y-4">
                <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Informações de Entrega</h3>
                <div className="space-y-3">
                  <Input placeholder="Seu Nome" className="h-12 rounded-xl bg-slate-50 border-none font-bold px-4" value={customerInfo.name} onChange={e => setCustomerInfo({...customerInfo, name: e.target.value})} />
                  <Input placeholder="Seu Telefone" className="h-12 rounded-xl bg-slate-50 border-none font-bold px-4" value={customerInfo.phone} onChange={e => setCustomerInfo({...customerInfo, phone: e.target.value})} />
                  <Textarea placeholder="Endereço Completo ou Ponto de Referência" className="min-h-[100px] rounded-xl bg-slate-50 border-none font-bold px-4 pt-4" value={customerInfo.address} onChange={e => setCustomerInfo({...customerInfo, address: e.target.value})} />
                </div>
              </div>

              <div className="p-6 bg-slate-50 rounded-[35px] space-y-2">
                 <div className="flex justify-between text-sm font-bold text-slate-500">
                    <span>Subtotal</span>
                    <span>R$ {cartTotal.toFixed(2)}</span>
                 </div>
                 <div className="flex justify-between text-sm font-bold text-slate-500">
                    <span>Taxa de Entrega</span>
                    <span className={deliveryFee === 0 ? 'text-green-600 font-black italic' : ''}>{deliveryFee === 0 ? 'GRÁTIS' : `R$ ${deliveryFee.toFixed(2)}`}</span>
                 </div>
                 <div className="flex justify-between text-xl font-black text-slate-900 pt-4 border-t border-dashed">
                    <span className="italic">Total</span>
                    <span className="italic text-primary">R$ {finalTotal.toFixed(2)}</span>
                 </div>
              </div>
           </div>

           <div className="p-8 bg-white border-t">
              <Button 
                className="w-full h-16 bg-primary hover:bg-primary/90 rounded-[30px] font-black text-lg italic shadow-xl shadow-primary/20 flex justify-between px-10"
                onClick={handleFinishOrder}
              >
                <span>Finalizar Pedido</span>
                <ArrowLeft className="h-6 w-6 rotate-180" />
              </Button>
           </div>
        </DialogContent>
      </Dialog>

      <div className="fixed bottom-10 left-1/2 -translate-x-1/2 w-full max-w-xl px-8 z-50 flex gap-4">
        <Button variant="outline" className="h-20 w-20 rounded-full bg-white shadow-2xl border-2 border-slate-100 shrink-0">
           <MessageSquare className="h-6 w-6 text-primary" />
        </Button>
        <Button 
          onClick={() => setIsCheckoutOpen(true)}
          disabled={cart.length === 0}
          className="flex-1 bg-slate-900 h-20 rounded-[40px] flex justify-between px-10 shadow-2xl border-4 border-white/10 active:scale-95 transition-all disabled:opacity-50"
        >
          <div className="flex items-center gap-4">
             <div className="relative">
               <ShoppingCart className="h-6 w-6 text-primary" />
               <span className="absolute -top-3 -right-3 h-5 w-5 bg-white text-slate-900 rounded-full text-[10px] font-black flex items-center justify-center">
                 {cart.reduce((a, b) => a + b.quantity, 0)}
               </span>
             </div>
             <span className="font-black text-lg text-white italic">Ver Carrinho</span>
          </div>
          <span className="font-black text-2xl text-primary italic">R$ {finalTotal.toFixed(2)}</span>
        </Button>
      </div>
    </div>
  );
}
