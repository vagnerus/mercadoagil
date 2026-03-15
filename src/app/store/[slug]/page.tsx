
"use client";

import * as React from 'react';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { MOCK_MERCHANTS, MOCK_CATEGORIES, MOCK_PRODUCTS, Product, Merchant } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Search, ChevronRight, Plus, Minus, ArrowLeft, Star, Heart, Share2, QrCode, Gift, Zap, Sparkles, Lock, ShieldCheck } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import Link from 'next/link';

export default function StoreFront() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;
  
  const [merchant, setMerchant] = useState<Merchant | null>(null);
  const [cart, setCart] = useState<{product: Product, quantity: number}[]>([]);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isQrOpen, setIsQrOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [userTier] = useState<'Bronze' | 'Silver' | 'Gold'>('Silver'); // Simulado
  
  const { toast } = useToast();

  useEffect(() => {
    if (slug) {
      const found = MOCK_MERCHANTS.find(m => m.slug === slug);
      if (found) setMerchant(found);
    }
  }, [slug]);

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
    setSelectedProduct(null);
    toast({ title: "No carrinho!", description: `${product.name} adicionado.` });
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.product.id === productId) {
        const newQty = Math.max(0, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const cartTotal = cart.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  const deliveryFee = 5.00;
  const finalTotal = cartTotal + deliveryFee;

  if (!merchant) return null;

  return (
    <div className="max-w-xl mx-auto min-h-screen bg-slate-50 pb-40 relative font-body overflow-x-hidden">
      <div className="relative h-72 w-full overflow-hidden">
        <img src={merchant.bannerUrl} alt={merchant.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent"></div>
        <Link href="/" className="absolute top-6 left-6 bg-white/90 p-3 rounded-2xl shadow-xl z-50">
           <ArrowLeft className="h-5 w-5 text-slate-800" />
        </Link>
        <div className="absolute bottom-8 left-8 right-8 flex items-end gap-6">
           <div className="h-24 w-24 rounded-[30px] border-4 border-white/20 bg-white shadow-2xl overflow-hidden shrink-0">
             <img src={merchant.logoUrl} alt={merchant.name} className="h-full w-full object-cover" />
           </div>
           <div className="flex-1 pb-2 space-y-1">
             <div className="flex items-center gap-2">
                <Badge className="bg-primary text-white text-[8px] font-black rounded-full uppercase px-3 shadow-lg">{userTier} Tier Member</Badge>
                <div className="flex items-center text-white text-xs font-black gap-1">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" /> 4.9
                </div>
             </div>
             <h1 className="text-2xl font-black text-white italic tracking-tighter">{merchant.name}</h1>
           </div>
        </div>
      </div>

      <div className="p-6">
         <div className="bg-primary p-6 rounded-[35px] flex items-center gap-5 relative overflow-hidden text-white shadow-xl shadow-primary/20">
            <Gift className="h-10 w-10 opacity-20 absolute -right-2 -bottom-2" />
            <div className="h-14 w-14 rounded-[20px] bg-white/20 flex items-center justify-center shrink-0">
               <Zap className="h-6 w-6 text-white fill-white" />
            </div>
            <div className="flex-1 space-y-2">
               <div className="flex justify-between items-center">
                  <p className="text-[10px] font-black uppercase tracking-widest text-white/80">Programa de Fidelidade</p>
                  <span className="text-xs font-black">750 pts</span>
               </div>
               <div className="h-2.5 w-full bg-white/20 rounded-full overflow-hidden">
                  <div className="h-full bg-white w-[75%] rounded-full"></div>
               </div>
               <p className="text-[9px] font-bold text-white/70">Suba para o nível Gold para desbloquear itens exclusivos!</p>
            </div>
         </div>
      </div>

      <div className="px-6 py-4 space-y-4">
        <div className="relative">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input 
            className="w-full h-14 bg-white border border-slate-100 shadow-sm rounded-[24px] pl-12 pr-4 text-sm font-bold outline-none" 
            placeholder="Buscar pedida..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="p-6 space-y-12">
        {categories.map(category => {
          const catProducts = filteredProducts.filter(p => p.categoryId === category.id);
          if (catProducts.length === 0) return null;

          return (
            <div key={category.id} className="space-y-6">
              <h2 className="text-xl font-black text-slate-900 tracking-tighter italic border-l-4 border-primary pl-4">{category.name}</h2>
              <div className="grid gap-6">
                {catProducts.map(product => (
                  <div 
                    key={product.id}
                    onClick={() => setSelectedProduct(product)}
                    className={`flex gap-4 p-4 bg-white border border-slate-100 rounded-[35px] shadow-sm relative overflow-hidden group cursor-pointer ${
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
                          <Badge className="bg-yellow-50 text-yellow-700 text-[8px] font-black border-none uppercase">Gold Only</Badge>
                        )}
                      </div>
                    </div>
                    <div className="h-24 w-24 rounded-[28px] bg-slate-100 overflow-hidden shrink-0 relative">
                      <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                      {product.isLoyaltyExclusive && userTier !== 'Gold' && (
                         <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                            <ShieldCheck className="h-8 w-8 text-white opacity-40" />
                         </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <Dialog open={!!selectedProduct} onOpenChange={() => setSelectedProduct(null)}>
        <DialogContent className="sm:max-w-md p-0 overflow-hidden rounded-[40px] border-none shadow-2xl">
           {selectedProduct && (
             <div className="flex flex-col">
                <div className="h-64 w-full relative">
                   <img src={selectedProduct.imageUrl} className="w-full h-full object-cover" alt="" />
                   {selectedProduct.isLoyaltyExclusive && (
                     <div className="absolute top-4 right-4 bg-yellow-400 text-white px-4 py-1 rounded-full text-[10px] font-black flex items-center gap-1">
                        <Sparkles className="h-3 w-3" /> EXCLUSIVO GOLD
                     </div>
                   )}
                </div>
                <div className="p-8 space-y-6 bg-white">
                   <div>
                      <h2 className="text-2xl font-black italic">{selectedProduct.name}</h2>
                      <p className="text-sm text-slate-500 mt-2 font-bold">{selectedProduct.description}</p>
                   </div>
                   
                   <div className="space-y-4">
                      <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Instruções</Label>
                      <Textarea placeholder="Alguma preferência?" className="rounded-[20px] bg-slate-50 border-none font-bold" />
                   </div>

                   <Button 
                    className={`w-full h-16 rounded-[30px] font-black text-lg italic shadow-xl ${
                      selectedProduct.isLoyaltyExclusive && userTier !== 'Gold' ? 'bg-slate-300' : 'bg-primary shadow-primary/20'
                    }`} 
                    onClick={() => addToCart(selectedProduct)}
                    disabled={selectedProduct.isLoyaltyExclusive && userTier !== 'Gold'}
                   >
                    {selectedProduct.isLoyaltyExclusive && userTier !== 'Gold' ? 'Nível Insuficiente' : 'Adicionar à Sacola'}
                   </Button>
                </div>
             </div>
           )}
        </DialogContent>
      </Dialog>

      {cart.length > 0 && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 w-full max-w-xl px-8 z-50">
          <Button 
            onClick={() => setIsCheckoutOpen(true)}
            className="w-full bg-slate-900 h-20 rounded-[40px] flex justify-between px-10 shadow-2xl border-4 border-white/10"
          >
            <div className="flex items-center gap-4">
               <ShoppingCart className="h-6 w-6 text-primary" />
               <span className="font-black text-lg text-white italic">Ver Carrinho</span>
            </div>
            <span className="font-black text-2xl text-primary italic">R$ {finalTotal.toFixed(2)}</span>
          </Button>
        </div>
      )}
    </div>
  );
}
