
"use client";

import * as React from 'react';
import { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  ShoppingCart, Search, Plus, Minus, Trash2, 
  CreditCard, Landmark, Wallet, User, Zap, 
  Barcode, Printer, ArrowLeft, Loader2, Sparkles, Monitor
} from "lucide-react";
import { MOCK_PRODUCTS, Product } from "@/lib/mock-data";
import { useToast } from "@/hooks/use-toast";
import Link from 'next/link';

export default function MerchantPDV({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = React.use(params);
  const [cart, setCart] = useState<{product: Product, quantity: number}[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
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

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.product.id !== id));
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.product.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const total = cart.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);

  const handleCheckout = () => {
    if (cart.length === 0) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setCart([]);
      toast({ title: "Venda Concluída!", description: "Cupom emitido com sucesso." });
    }, 1000);
  };

  return (
    <div className="flex h-screen bg-slate-900 overflow-hidden font-body text-white">
      {/* Sidebar Catálogo */}
      <div className="w-[60%] flex flex-col border-r border-white/10 bg-slate-950">
        <header className="p-6 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href={`/merchant/${slug}/dashboard`} className="p-2 bg-white/5 rounded-xl hover:bg-white/10 transition-colors">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-2xl font-black italic tracking-tighter uppercase">PDV CLOUD <span className="text-primary not-italic">PRO</span></h1>
          </div>
          <div className="relative w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <Input 
              className="pl-12 bg-white/5 border-none h-12 rounded-2xl font-bold focus:ring-primary" 
              placeholder="Buscar item ou BIPAR código..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoFocus
            />
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-3 gap-4 no-scrollbar content-start">
          {filteredProducts.map(product => (
            <Card 
              key={product.id} 
              onClick={() => addToCart(product)}
              className="bg-white/5 border-none hover:bg-primary hover:scale-[1.02] transition-all cursor-pointer group rounded-3xl overflow-hidden h-48 flex flex-col"
            >
              <div className="h-24 overflow-hidden relative">
                <img src={product.imageUrl} className="w-full h-full object-cover opacity-60 group-hover:opacity-100" />
                <Badge className="absolute top-2 right-2 bg-black/50 border-none font-black italic">R$ {product.price.toFixed(2)}</Badge>
              </div>
              <CardContent className="p-4 flex-1 flex flex-col justify-between">
                <p className="font-black text-sm text-white group-hover:text-white line-clamp-2 uppercase italic">{product.name}</p>
                <div className="flex justify-between items-center text-[10px] font-bold text-slate-500 group-hover:text-white/80">
                  <span>ESTOQUE: {product.stock}</span>
                  <Barcode className="h-3 w-3" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Sidebar Carrinho / Checkout */}
      <div className="w-[40%] flex flex-col bg-slate-900 shadow-2xl relative">
        <header className="p-6 border-b border-white/10 flex items-center justify-between">
          <h2 className="text-xl font-black italic uppercase tracking-widest flex items-center gap-2">
            <ShoppingCart className="h-5 w-5 text-primary" /> Sacola de Venda
          </h2>
          <Badge className="bg-primary text-white border-none font-black px-4">{cart.length} ITENS</Badge>
        </header>

        <div className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar">
          {cart.map(item => (
            <div key={item.product.id} className="flex gap-4 p-4 bg-white/5 rounded-[28px] items-center border border-white/5">
              <div className="h-14 w-14 rounded-2xl overflow-hidden bg-slate-800">
                <img src={item.product.imageUrl} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1">
                <p className="font-black text-sm uppercase italic leading-tight">{item.product.name}</p>
                <p className="text-primary font-black mt-1">R$ {item.product.price.toFixed(2)}</p>
              </div>
              <div className="flex items-center gap-3 bg-black/20 p-1.5 rounded-2xl">
                <Button size="icon" variant="ghost" className="h-8 w-8 text-white" onClick={() => updateQuantity(item.product.id, -1)}><Minus className="h-4 w-4" /></Button>
                <span className="font-black w-4 text-center">{item.quantity}</span>
                <Button size="icon" variant="ghost" className="h-8 w-8 text-white" onClick={() => updateQuantity(item.product.id, 1)}><Plus className="h-4 w-4" /></Button>
              </div>
              <Button size="icon" variant="ghost" className="text-red-400" onClick={() => removeFromCart(item.product.id)}><Trash2 className="h-4 w-4" /></Button>
            </div>
          ))}
          
          {cart.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-slate-600 space-y-4">
              <Monitor className="h-20 w-20 opacity-10" />
              <p className="font-black italic uppercase tracking-widest">Aguardando Input...</p>
            </div>
          )}
        </div>

        <footer className="p-8 bg-black/40 border-t border-white/10 space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between text-slate-400 font-bold uppercase text-[10px] tracking-widest">
              <span>Subtotal</span>
              <span>R$ {total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-3xl font-black italic tracking-tighter text-white">
              <span>TOTAL</span>
              <span className="text-primary">R$ {total.toFixed(2)}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button variant="outline" className="h-14 bg-white/5 border-white/10 rounded-2xl font-black italic hover:bg-white hover:text-slate-900 transition-all gap-2">
              <Landmark className="h-5 w-5" /> PIX
            </Button>
            <Button variant="outline" className="h-14 bg-white/5 border-white/10 rounded-2xl font-black italic hover:bg-white hover:text-slate-900 transition-all gap-2">
              <CreditCard className="h-5 w-5" /> CARTÃO
            </Button>
          </div>

          <Button 
            onClick={handleCheckout} 
            disabled={cart.length === 0 || loading}
            className="w-full h-20 bg-primary hover:bg-primary/90 text-white rounded-[32px] text-2xl font-black italic shadow-2xl shadow-primary/20 flex justify-between px-10 transition-all active:scale-95"
          >
            {loading ? <Loader2 className="h-8 w-8 animate-spin mx-auto" /> : (
              <>
                <span>FECHAR VENDA</span>
                <div className="flex items-center gap-3">
                  <Printer className="h-6 w-6 opacity-50" />
                  <Sparkles className="h-6 w-6" />
                </div>
              </>
            )}
          </Button>
        </footer>
      </div>
    </div>
  );
}
