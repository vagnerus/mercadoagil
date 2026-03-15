"use client";

import { useState } from 'react';
import { MOCK_MERCHANTS, MOCK_CATEGORIES, MOCK_PRODUCTS, Product } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Clock, Info, Search, MapPin, ChevronRight, Plus } from "lucide-react";
import Link from 'next/link';

export default function StoreFront({ params }: { params: { slug: string } }) {
  const merchant = MOCK_MERCHANTS.find(m => m.slug === params.slug);
  const categories = MOCK_CATEGORIES.filter(c => c.merchantId === merchant?.id);
  const products = MOCK_PRODUCTS.filter(p => p.merchantId === merchant?.id);

  const [cart, setCart] = useState<{product: Product, quantity: number}[]>([]);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item => item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const cartTotal = cart.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  if (!merchant) return <div className="p-10 text-center">Loja não encontrada.</div>;

  return (
    <div className="max-w-3xl mx-auto min-h-screen bg-white pb-32">
      {/* Banner */}
      <div className="relative h-48 w-full bg-slate-200">
        <img src={merchant.bannerUrl} alt={merchant.name} className="w-full h-full object-cover" />
        <Link href="/" className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg">
           <ChevronRight className="h-5 w-5 rotate-180" />
        </Link>
      </div>

      {/* Merchant Header */}
      <div className="px-4 -mt-12 relative z-10 space-y-4">
        <div className="flex items-end justify-between">
           <div className="h-24 w-24 rounded-2xl border-4 border-white bg-white shadow-xl overflow-hidden">
             <img src={merchant.logoUrl} alt={merchant.name} className="h-full w-full object-cover" />
           </div>
           <div className="pb-1">
             <Badge className="bg-green-500 border-none px-3 py-1 text-white">ABERTO</Badge>
           </div>
        </div>
        
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-slate-900">{merchant.name}</h1>
          <div className="flex items-center gap-4 text-sm text-slate-500">
            <span className="flex items-center gap-1"><Clock className="h-4 w-4" /> 30-45 min</span>
            <span className="flex items-center gap-1"><MapPin className="h-4 w-4" /> Entrega R$ 5,00</span>
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="rounded-full gap-1">
            <Info className="h-4 w-4" /> Info
          </Button>
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input 
              className="w-full h-9 bg-slate-100 border-none rounded-full pl-9 pr-4 text-sm focus:ring-2 focus:ring-primary outline-none" 
              placeholder="O que você procura?" 
            />
          </div>
        </div>
      </div>

      {/* Menu Categories */}
      <div className="mt-8 px-4">
        {categories.map(category => (
          <div key={category.id} className="mb-8">
            <h2 className="text-xl font-bold text-slate-800 mb-4 sticky top-0 bg-white/80 py-2 backdrop-blur-sm z-10">{category.name}</h2>
            <div className="space-y-4">
              {products.filter(p => p.categoryId === category.id).map(product => (
                <div 
                  key={product.id} 
                  onClick={() => addToCart(product)}
                  className="flex gap-4 p-3 border rounded-2xl hover:bg-slate-50 transition-colors cursor-pointer active:scale-[0.98] group relative"
                >
                  <div className="flex-1 space-y-1">
                    <h3 className="font-bold text-slate-900">{product.name}</h3>
                    <p className="text-xs text-slate-500 line-clamp-2">{product.description}</p>
                    <p className="font-bold text-primary mt-2">R$ {product.price.toFixed(2)}</p>
                  </div>
                  <div className="h-24 w-24 rounded-xl bg-slate-100 overflow-hidden shrink-0 relative">
                    <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                       <Plus className="text-white h-8 w-8" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Floating Cart Button */}
      {cartCount > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-full max-w-3xl px-4 z-50 animate-in slide-in-from-bottom-10">
          <Button className="w-full bg-accent hover:bg-accent/90 py-6 rounded-2xl shadow-2xl flex justify-between px-6 h-auto">
            <div className="flex items-center gap-3">
               <div className="relative">
                 <div className="bg-white/20 p-2 rounded-lg">
                   <ShoppingCart className="h-5 w-5" />
                 </div>
                 <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center bg-white text-accent font-bold rounded-full text-[10px]">
                    {cartCount}
                 </Badge>
               </div>
               <span className="font-bold">Ver Carrinho</span>
            </div>
            <span className="font-bold text-lg">R$ {cartTotal.toFixed(2)}</span>
          </Button>
        </div>
      )}
    </div>
  );
}
