
"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { MOCK_MERCHANTS, MOCK_CATEGORIES, MOCK_PRODUCTS, Product, Merchant } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Clock, Info, Search, MapPin, ChevronRight, Plus, Minus, Trash2, CheckCircle2, ArrowLeft, Star } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import Link from 'next/link';

export default function StoreFront() {
  const params = useParams();
  const slug = params?.slug as string;
  
  const [merchant, setMerchant] = useState<Merchant | null>(null);
  const [cart, setCart] = useState<{product: Product, quantity: number}[]>([]);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [orderFinished, setOrderFinished] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    const found = MOCK_MERCHANTS.find(m => m.slug === slug);
    if (found) setMerchant(found);
  }, [slug]);

  const categories = MOCK_CATEGORIES.filter(c => c.merchantId === merchant?.id);
  const products = MOCK_PRODUCTS.filter(p => p.merchantId === merchant?.id);
  
  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item => item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { product, quantity: 1 }];
    });
    toast({
      title: "Adicionado ao carrinho!",
      description: `${product.name} agora está no seu pedido.`,
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.product.id === productId) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const cartTotal = cart.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const handleFinishOrder = () => {
    setOrderFinished(true);
    setTimeout(() => {
      setCart([]);
      setIsCheckoutOpen(false);
      setOrderFinished(false);
      toast({
        title: "Pedido Enviado!",
        description: "A cozinha já recebeu seu pedido!",
      });
    }, 2500);
  };

  if (!merchant) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center space-y-4">
        <img src="https://picsum.photos/seed/empty/400/300" alt="Não encontrado" className="rounded-3xl opacity-50 max-w-xs" />
        <h2 className="text-2xl font-bold text-slate-800">Loja não encontrada</h2>
        <p className="text-slate-500">Verifique o endereço digitado ou retorne para o início.</p>
        <Button asChild className="rounded-full px-8 py-6 h-auto text-lg"><Link href="/">Voltar ao Início</Link></Button>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto min-h-screen bg-slate-50 pb-32 relative">
      {/* Banner & Brand */}
      <div className="relative h-64 w-full overflow-hidden">
        <img src={merchant.bannerUrl} alt={merchant.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
        <Link href="/" className="absolute top-6 left-6 bg-white/90 backdrop-blur-sm p-3 rounded-2xl shadow-lg hover:scale-105 transition-transform active:scale-95">
           <ArrowLeft className="h-5 w-5 text-slate-800" />
        </Link>
        <div className="absolute bottom-6 left-6 right-6 flex items-end gap-5">
           <div className="h-24 w-24 rounded-[30px] border-4 border-white bg-white shadow-2xl overflow-hidden shrink-0">
             <img src={merchant.logoUrl} alt={merchant.name} className="h-full w-full object-cover" />
           </div>
           <div className="flex-1 pb-1 space-y-1">
             <h1 className="text-2xl font-black text-white leading-tight drop-shadow-md">{merchant.name}</h1>
             <div className="flex items-center gap-2">
                <Badge className="bg-green-500 border-none px-3 py-1 text-white text-[10px] font-bold rounded-full">ABERTO AGORA</Badge>
                <div className="flex items-center text-white/90 text-xs font-semibold gap-1 drop-shadow">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" /> 4.9 (120+)
                </div>
             </div>
           </div>
        </div>
      </div>

      {/* Info Bar */}
      <div className="bg-white px-6 py-6 border-b flex items-center justify-between text-slate-500">
        <div className="flex flex-col items-center flex-1 border-r">
          <span className="text-slate-900 font-bold text-sm">30-45 min</span>
          <span className="text-[10px] uppercase font-bold tracking-wider">Tempo</span>
        </div>
        <div className="flex flex-col items-center flex-1 border-r">
          <span className="text-slate-900 font-bold text-sm">R$ 5,00</span>
          <span className="text-[10px] uppercase font-bold tracking-wider">Entrega</span>
        </div>
        <div className="flex flex-col items-center flex-1">
          <span className="text-slate-900 font-bold text-sm">R$ 20,00</span>
          <span className="text-[10px] uppercase font-bold tracking-wider">Mínimo</span>
        </div>
      </div>

      {/* Search & Categories */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md p-4 space-y-4 border-b">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input 
            className="w-full h-12 bg-slate-100 border-none rounded-2xl pl-11 pr-4 text-sm font-medium focus:ring-2 focus:ring-primary outline-none transition-all" 
            placeholder="Pesquisar no cardápio..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide no-scrollbar">
          {categories.map(cat => (
             <Badge key={cat.id} variant="outline" className="rounded-full px-5 py-2 whitespace-nowrap bg-slate-50 border-slate-200 text-slate-600 font-bold text-xs hover:bg-primary/10 hover:text-primary hover:border-primary cursor-pointer transition-colors">
               {cat.name}
             </Badge>
          ))}
        </div>
      </div>

      {/* Product List */}
      <div className="p-4 space-y-10">
        {categories.map(category => {
          const catProducts = filteredProducts.filter(p => p.categoryId === category.id);
          if (catProducts.length === 0) return null;

          return (
            <div key={category.id} className="space-y-4">
              <h2 className="text-xl font-extrabold text-slate-900 pl-2">{category.name}</h2>
              <div className="grid gap-4">
                {catProducts.map(product => (
                  <div 
                    key={product.id} 
                    onClick={() => addToCart(product)}
                    className="flex gap-4 p-4 bg-white border border-slate-100 rounded-[28px] hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all cursor-pointer active:scale-[0.97] group overflow-hidden relative"
                  >
                    <div className="flex-1 flex flex-col justify-between py-1">
                      <div>
                        <h3 className="font-bold text-slate-900 text-base group-hover:text-primary transition-colors">{product.name}</h3>
                        <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">{product.description}</p>
                      </div>
                      <p className="font-black text-primary text-lg mt-3 italic">R$ {product.price.toFixed(2)}</p>
                    </div>
                    <div className="h-28 w-28 rounded-3xl bg-slate-50 overflow-hidden shrink-0 relative">
                      <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                      <div className="absolute top-2 right-2 bg-primary text-white p-2 rounded-2xl shadow-lg opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100">
                         <Plus className="h-5 w-5" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
        {filteredProducts.length === 0 && (
          <div className="py-20 text-center space-y-4 opacity-40">
            <Search className="h-12 w-12 mx-auto" />
            <p className="font-bold">Nenhum item encontrado.</p>
          </div>
        )}
      </div>

      {/* Checkout Dialog */}
      <Dialog open={isCheckoutOpen} onOpenChange={setIsCheckoutOpen}>
        <DialogContent className="sm:max-w-md max-h-[95vh] overflow-y-auto rounded-[35px] border-none shadow-2xl p-0">
          {orderFinished ? (
            <div className="py-16 flex flex-col items-center justify-center space-y-6 animate-in fade-in zoom-in-95 duration-500">
              <div className="bg-green-100 p-8 rounded-[40px] animate-bounce">
                <CheckCircle2 className="h-20 w-20 text-green-500" />
              </div>
              <div className="text-center space-y-2 px-8">
                <h2 className="text-3xl font-black text-slate-900 leading-tight">Pedido Realizado com Sucesso!</h2>
                <p className="text-slate-500 font-medium">Você receberá atualizações em tempo real pelo seu telefone.</p>
              </div>
              <Button className="w-48 bg-slate-900 text-white rounded-full py-6 h-auto" onClick={() => setIsCheckoutOpen(false)}>Ok, Entendi</Button>
            </div>
          ) : (
            <div className="flex flex-col h-full">
              <DialogHeader className="p-8 pb-4 border-b">
                <DialogTitle className="text-2xl font-black flex items-center gap-3">
                   <div className="bg-primary/10 p-2 rounded-xl"><ShoppingCart className="h-6 w-6 text-primary" /></div>
                   Meu Carrinho
                </DialogTitle>
              </DialogHeader>
              
              <div className="p-8 pt-6 space-y-8 flex-1">
                {cart.length === 0 ? (
                  <div className="py-12 text-center text-slate-400 font-bold space-y-4">
                    <img src="https://picsum.photos/seed/empty-cart/200/200" className="mx-auto grayscale opacity-50" alt="" />
                    <p>Seu carrinho está esperando por delícias...</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="space-y-5 max-h-[40vh] overflow-y-auto pr-2 no-scrollbar">
                      {cart.map(item => (
                        <div key={item.product.id} className="flex items-center gap-4 group">
                          <div className="h-14 w-14 rounded-2xl overflow-hidden bg-slate-100 shrink-0 shadow-sm border">
                            <img src={item.product.imageUrl} className="h-full w-full object-cover" alt="" />
                          </div>
                          <div className="flex-1">
                            <p className="font-bold text-sm text-slate-900 leading-tight">{item.product.name}</p>
                            <p className="text-xs text-primary font-black mt-0.5">R$ {(item.product.price * item.quantity).toFixed(2)}</p>
                          </div>
                          <div className="flex items-center bg-slate-100 rounded-2xl p-1 gap-1">
                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-xl hover:bg-white" onClick={() => updateQuantity(item.product.id, -1)}><Minus className="h-3 w-3" /></Button>
                            <span className="text-xs font-black w-5 text-center">{item.quantity}</span>
                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-xl hover:bg-white" onClick={() => updateQuantity(item.product.id, 1)}><Plus className="h-3 w-3" /></Button>
                          </div>
                          <Button variant="ghost" size="icon" className="h-10 w-10 text-slate-300 hover:text-red-500 rounded-2xl" onClick={() => removeFromCart(item.product.id)}><Trash2 className="h-5 w-5" /></Button>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-4 border-t pt-6">
                      <div className="space-y-2">
                        <Label htmlFor="address" className="text-xs font-bold uppercase text-slate-400 tracking-wider">Endereço de Entrega</Label>
                        <Input id="address" placeholder="Ex: Rua das Palmeiras, 452 - Centro" className="rounded-2xl bg-slate-50 border-slate-100 h-12 text-sm font-medium" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone" className="text-xs font-bold uppercase text-slate-400 tracking-wider">WhatsApp para Contato</Label>
                        <Input id="phone" placeholder="(00) 00000-0000" className="rounded-2xl bg-slate-50 border-slate-100 h-12 text-sm font-medium" />
                      </div>
                    </div>

                    <div className="bg-slate-900 p-6 rounded-[35px] space-y-3 shadow-xl">
                       <div className="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-widest">
                          <span>Subtotal</span>
                          <span className="text-white">R$ {cartTotal.toFixed(2)}</span>
                       </div>
                       <div className="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-widest">
                          <span>Entrega</span>
                          <span className="text-white">R$ 5,00</span>
                       </div>
                       <div className="flex justify-between font-black text-2xl pt-3 border-t border-white/10">
                          <span className="text-white italic">Total</span>
                          <span className="text-primary tracking-tight">R$ {(cartTotal + 5).toFixed(2)}</span>
                       </div>
                    </div>

                    <Button className="w-full bg-primary hover:bg-primary/90 py-8 rounded-[30px] shadow-xl shadow-primary/20 text-lg font-black italic tracking-tight" onClick={handleFinishOrder}>
                      Finalizar Pedido <ChevronRight className="ml-2 h-6 w-6" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Floating Cart Button */}
      {cartCount > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-full max-w-xl px-4 z-50 animate-in slide-in-from-bottom-20 duration-500">
          <Button 
            onClick={() => setIsCheckoutOpen(true)}
            className="w-full bg-slate-900 hover:bg-slate-800 py-8 rounded-[35px] shadow-[0_20px_40px_-10px_rgba(0,0,0,0.3)] flex justify-between px-8 h-auto group active:scale-95 transition-all"
          >
            <div className="flex items-center gap-4">
               <div className="relative">
                 <div className="bg-primary p-3 rounded-2xl shadow-lg shadow-primary/30 group-hover:scale-110 transition-transform">
                   <ShoppingCart className="h-6 w-6 text-white" />
                 </div>
                 <Badge className="absolute -top-3 -right-3 h-7 w-7 p-0 flex items-center justify-center bg-white text-primary font-black rounded-full text-xs shadow-md border-2 border-slate-900">
                    {cartCount}
                 </Badge>
               </div>
               <div className="flex flex-col items-start leading-tight">
                 <span className="text-white/60 text-[10px] uppercase font-bold tracking-widest">Carrinho</span>
                 <span className="font-black text-lg text-white">Ver Pedido</span>
               </div>
            </div>
            <div className="flex flex-col items-end leading-tight">
              <span className="text-white/60 text-[10px] uppercase font-bold tracking-widest">Total</span>
              <span className="font-black text-2xl text-primary tracking-tighter">R$ {cartTotal.toFixed(2)}</span>
            </div>
          </Button>
        </div>
      )}
    </div>
  );
}
