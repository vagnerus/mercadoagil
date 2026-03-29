
"use client";

import * as React from 'react';
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Users, Plus, Minus, Search, Send, ArrowLeft, 
  ChefHat, ShoppingBag, UtensilsCrossed, Smartphone, Check
} from "lucide-react";
import { MOCK_PRODUCTS, Product } from "@/lib/mock-data";
import { useToast } from "@/hooks/use-toast";
import Link from 'next/link';

export default function WaiterApp({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = React.use(params);
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [cart, setCart] = useState<{product: Product, quantity: number}[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  const filteredProducts = MOCK_PRODUCTS.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item => item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.product.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const handleSendToKitchen = () => {
    if (!selectedTable || cart.length === 0) {
      toast({ title: "Atenção", description: "Selecione uma mesa e adicione itens.", variant: "destructive" });
      return;
    }
    toast({ title: "Enviado!", description: `Pedido da Mesa ${selectedTable} enviado para a cozinha.` });
    setCart([]);
    setSelectedTable(null);
  };

  return (
    <div className="flex flex-col h-screen bg-slate-950 text-white font-body safe-bottom">
      {/* Header Mobile Otimizado */}
      <header className="p-4 border-b border-white/10 flex items-center justify-between bg-slate-900 sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <Link href={`/merchant/${slug}/dashboard`} className="p-2 bg-white/5 rounded-xl">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-lg font-black italic tracking-tighter uppercase">Waiter <span className="text-primary">App</span></h1>
        </div>
        <div className="flex items-center gap-2">
           <Smartphone className="h-4 w-4 text-slate-500" />
           <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">v2.4</span>
        </div>
      </header>

      {!selectedTable ? (
        <main className="flex-1 p-6 space-y-6 overflow-y-auto">
           <div className="text-center space-y-2">
              <h2 className="text-2xl font-black italic tracking-tighter uppercase">Selecione a Mesa</h2>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Gestão de Salão em tempo real</p>
           </div>
           <div className="grid grid-cols-3 gap-4">
              {[1,2,3,4,5,6,7,8,9,10,11,12].map(num => (
                <Button 
                  key={num} 
                  onClick={() => setSelectedTable(num.toString())}
                  className="h-20 rounded-3xl bg-white/5 border border-white/10 hover:bg-primary transition-all text-xl font-black italic"
                >
                  {num}
                </Button>
              ))}
           </div>
        </main>
      ) : (
        <main className="flex-1 flex flex-col overflow-hidden">
           <div className="p-4 bg-primary/10 border-b border-primary/20 flex justify-between items-center">
              <div className="flex items-center gap-3">
                 <Badge className="bg-primary text-white font-black italic text-lg h-10 w-10 flex items-center justify-center rounded-xl">{selectedTable}</Badge>
                 <span className="font-black italic text-sm uppercase">Lançando Pedido</span>
              </div>
              <Button variant="ghost" onClick={() => setSelectedTable(null)} className="text-[10px] font-black uppercase text-slate-400">Trocar Mesa</Button>
           </div>

           <div className="p-4">
              <div className="relative">
                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                 <Input 
                  className="pl-12 bg-white/5 border-none h-12 rounded-2xl font-bold" 
                  placeholder="Buscar produto..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                 />
              </div>
           </div>

           <div className="flex-1 overflow-y-auto px-4 space-y-3 pb-40">
              {filteredProducts.map(p => (
                <div key={p.id} onClick={() => addToCart(p)} className="flex items-center gap-4 p-3 bg-white/5 rounded-2xl active:bg-primary transition-colors cursor-pointer group">
                   <div className="h-14 w-14 rounded-xl overflow-hidden bg-slate-800">
                      <img src={p.imageUrl} className="h-full w-full object-cover opacity-60" />
                   </div>
                   <div className="flex-1">
                      <p className="font-black text-sm uppercase italic leading-tight truncate pr-2">{p.name}</p>
                      <p className="text-primary font-black text-xs">R$ {p.price.toFixed(2)}</p>
                   </div>
                   <Plus className="h-5 w-5 text-slate-600 group-active:text-white" />
                </div>
              ))}
           </div>

           {/* Carrinho Flutuante do Garçom */}
           <div className="fixed bottom-0 left-0 right-0 p-6 bg-slate-900 border-t border-white/10 rounded-t-[40px] shadow-2xl">
              <div className="space-y-4">
                 {cart.length > 0 && (
                   <div className="max-h-32 overflow-y-auto space-y-2 mb-4 no-scrollbar">
                      {cart.map(item => (
                        <div key={item.product.id} className="flex justify-between items-center bg-white/5 p-2 rounded-xl">
                           <span className="text-xs font-bold truncate pr-4">{item.product.name}</span>
                           <div className="flex items-center gap-3">
                              <button onClick={() => updateQuantity(item.product.id, -1)} className="h-6 w-6 rounded-lg bg-white/10 flex items-center justify-center"><Minus className="h-3 w-3" /></button>
                              <span className="font-black text-sm">{item.quantity}</span>
                              <button onClick={() => updateQuantity(item.product.id, 1)} className="h-6 w-6 rounded-lg bg-white/10 flex items-center justify-center"><Plus className="h-3 w-3" /></button>
                           </div>
                        </div>
                      ))}
                   </div>
                 )}
                 <Button 
                  disabled={cart.length === 0}
                  onClick={handleSendToKitchen}
                  className="w-full h-16 bg-primary hover:bg-primary/90 text-white rounded-[28px] font-black italic text-lg shadow-2xl shadow-primary/20 flex justify-between px-8"
                 >
                    <span>COMANDAR MESA {selectedTable}</span>
                    <ChefHat className="h-6 w-6" />
                 </Button>
              </div>
           </div>
        </main>
      )}
    </div>
  );
}
