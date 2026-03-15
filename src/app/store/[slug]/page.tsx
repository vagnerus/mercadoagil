
"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { MOCK_MERCHANTS, MOCK_CATEGORIES, MOCK_PRODUCTS, MOCK_COUPONS, Product, Merchant, Coupon } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Clock, Info, Search, MapPin, ChevronRight, Plus, Minus, Trash2, CheckCircle2, ArrowLeft, Star, Heart, Share2, Ticket } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import Link from 'next/link';

export default function StoreFront() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;
  
  const [merchant, setMerchant] = useState<Merchant | null>(null);
  const [cart, setCart] = useState<{product: Product, quantity: number, variationId?: string}[]>([]);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [orderFinished, setOrderFinished] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [couponCode, setCouponCode] = useState("");
  const [activeCoupon, setActiveCoupon] = useState<Coupon | null>(null);
  
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

  const toggleFavorite = (productId: string) => {
    setFavorites(prev => 
      prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]
    );
  };

  const handleApplyCoupon = () => {
    const coupon = MOCK_COUPONS.find(c => c.code.toUpperCase() === couponCode.toUpperCase());
    if (coupon) {
      setActiveCoupon(coupon);
      toast({ title: "Cupom Aplicado!", description: `Desconto de ${coupon.discount}${coupon.type === 'percent' ? '%' : ' R$'} aplicado.` });
    } else {
      toast({ title: "Erro", description: "Cupom inválido ou expirado.", variant: "destructive" });
    }
  };

  const addToCart = (product: Product, variationId?: string) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id && item.variationId === variationId);
      if (existing) {
        return prev.map(item => item.product.id === product.id && item.variationId === variationId ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { product, quantity: 1, variationId }];
    });
    setSelectedProduct(null);
    toast({ title: "Adicionado!", description: `${product.name} no carrinho.` });
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
  const discountAmount = activeCoupon 
    ? (activeCoupon.type === 'percent' ? (cartTotal * activeCoupon.discount / 100) : activeCoupon.discount)
    : 0;
  const finalTotal = Math.max(0, cartTotal - discountAmount + 5);

  const handleFinishOrder = () => {
    setOrderFinished(true);
    setTimeout(() => {
      const tempOrderId = Math.random().toString(36).substring(7);
      router.push(`/store/${slug}/track/${tempOrderId}`);
    }, 2000);
  };

  const shareStore = () => {
    const text = `Confira a loja ${merchant?.name} no Mercado Ágil!`;
    const url = window.location.href;
    window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`);
  };

  if (!merchant) return null;

  return (
    <div className="max-w-xl mx-auto min-h-screen bg-slate-50 pb-32 relative font-body">
      <div className="relative h-64 w-full overflow-hidden">
        <img src={merchant.bannerUrl} alt={merchant.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
        <Link href="/" className="absolute top-6 left-6 bg-white/90 backdrop-blur-sm p-3 rounded-2xl shadow-lg z-50">
           <ArrowLeft className="h-5 w-5 text-slate-800" />
        </Link>
        <button onClick={shareStore} className="absolute top-6 right-6 bg-white/90 backdrop-blur-sm p-3 rounded-2xl shadow-lg z-50">
           <Share2 className="h-5 w-5 text-slate-800" />
        </button>
        <div className="absolute bottom-6 left-6 right-6 flex items-end gap-5">
           <div className="h-24 w-24 rounded-[30px] border-4 border-white bg-white shadow-2xl overflow-hidden shrink-0">
             <img src={merchant.logoUrl} alt={merchant.name} className="h-full w-full object-cover" />
           </div>
           <div className="flex-1 pb-1 space-y-1">
             <h1 className="text-2xl font-black text-white drop-shadow-md">{merchant.name}</h1>
             <div className="flex items-center gap-2">
                <Badge className="bg-green-500 border-none px-3 py-1 text-white text-[10px] font-black rounded-full">ABERTO</Badge>
                <div className="flex items-center text-white text-xs font-bold gap-1">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" /> 4.9 (120+)
                </div>
             </div>
           </div>
        </div>
      </div>

      <div className="bg-white px-6 py-6 border-b flex items-center justify-between rounded-b-[40px] shadow-sm">
        <div className="flex flex-col items-center flex-1 border-r">
          <span className="text-slate-900 font-bold text-sm">30-45 min</span>
          <span className="text-[10px] uppercase font-bold tracking-wider opacity-60">Tempo</span>
        </div>
        <div className="flex flex-col items-center flex-1 border-r">
          <span className="text-slate-900 font-bold text-sm">R$ 5,00</span>
          <span className="text-[10px] uppercase font-bold tracking-wider opacity-60">Entrega</span>
        </div>
        <div className="flex flex-col items-center flex-1">
          <span className="text-slate-900 font-bold text-sm">R$ 20,00</span>
          <span className="text-[10px] uppercase font-bold tracking-wider opacity-60">Mínimo</span>
        </div>
      </div>

      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md p-4 space-y-4 border-b">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input 
            className="w-full h-12 bg-slate-100 border-none rounded-2xl pl-11 pr-4 text-sm font-medium focus:ring-2 focus:ring-primary outline-none" 
            placeholder="O que vamos comer hoje?"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          {categories.map(cat => (
             <Badge key={cat.id} variant="outline" className="rounded-full px-5 py-2 whitespace-nowrap bg-white border-slate-200 text-slate-600 font-bold text-xs hover:bg-primary/10 hover:text-primary cursor-pointer transition-colors shadow-sm">
               {cat.name}
             </Badge>
          ))}
        </div>
      </div>

      <div className="p-4 space-y-10">
        {categories.map(category => {
          const catProducts = filteredProducts.filter(p => p.categoryId === category.id);
          if (catProducts.length === 0) return null;

          return (
            <div key={category.id} className="space-y-4">
              <h2 className="text-xl font-black text-slate-900 pl-2">{category.name}</h2>
              <div className="grid gap-4">
                {catProducts.map(product => (
                  <div key={product.id} className="relative group">
                    <button 
                      onClick={() => toggleFavorite(product.id)}
                      className="absolute top-4 left-4 z-10 p-2 bg-white/80 backdrop-blur-sm rounded-xl shadow-sm hover:scale-110 transition-transform"
                    >
                      <Heart className={`h-4 w-4 ${favorites.includes(product.id) ? 'fill-red-500 text-red-500' : 'text-slate-400'}`} />
                    </button>
                    <div 
                      onClick={() => setSelectedProduct(product)}
                      className="flex gap-4 p-4 bg-white border border-slate-100 rounded-[32px] hover:border-primary/30 hover:shadow-xl transition-all cursor-pointer shadow-sm relative overflow-hidden"
                    >
                      <div className="flex-1 flex flex-col justify-between py-1">
                        <div>
                          <h3 className="font-bold text-slate-900 text-base">{product.name}</h3>
                          <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">{product.description}</p>
                        </div>
                        <div className="flex items-center gap-3 mt-3">
                          <p className="font-black text-primary text-lg italic tracking-tight">R$ {product.price.toFixed(2)}</p>
                          {product.rating && (
                            <Badge variant="secondary" className="bg-yellow-50 text-yellow-700 h-6 px-2 text-[10px] font-bold rounded-lg gap-1 border-none">
                              <Star className="h-2 w-2 fill-yellow-400" /> {product.rating}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="h-28 w-28 rounded-[28px] bg-slate-100 overflow-hidden shrink-0 relative">
                        <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors"></div>
                        <div className="absolute top-2 right-2 bg-primary text-white p-2 rounded-2xl shadow-lg opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100">
                           <Plus className="h-5 w-5" />
                        </div>
                      </div>
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
                <div className="h-72 w-full relative">
                   <img src={selectedProduct.imageUrl} className="w-full h-full object-cover" alt="" />
                   <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                   <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
                      <div className="text-white space-y-1">
                        <h2 className="text-2xl font-black">{selectedProduct.name}</h2>
                        <p className="text-sm font-bold opacity-90">Receita Especial Ágil</p>
                      </div>
                      <div className="bg-white text-primary p-3 rounded-2xl shadow-lg font-black italic">R$ {selectedProduct.price.toFixed(2)}</div>
                   </div>
                </div>
                <div className="p-8 space-y-6">
                   <div className="space-y-2">
                      <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Sobre este prato</h3>
                      <p className="text-slate-600 leading-relaxed font-medium">{selectedProduct.description}</p>
                   </div>
                   
                   {selectedProduct.variations && selectedProduct.variations.length > 0 && (
                     <div className="space-y-3">
                        <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Variações</h3>
                        <div className="grid grid-cols-2 gap-2">
                          {selectedProduct.variations.map(v => (
                            <button key={v.id} onClick={() => addToCart(selectedProduct, v.id)} className="p-4 bg-slate-50 border rounded-2xl text-left hover:border-primary transition-all">
                              <p className="text-xs font-bold">{v.name}</p>
                              <p className="text-sm font-black text-primary">R$ {v.price.toFixed(2)}</p>
                            </button>
                          ))}
                        </div>
                     </div>
                   )}

                   <div className="flex gap-4 pt-4 border-t">
                      <Button className="flex-1 bg-primary hover:bg-primary/90 py-8 rounded-3xl font-black text-lg italic shadow-xl shadow-primary/20" onClick={() => addToCart(selectedProduct)}>
                        Adicionar ao Carrinho
                      </Button>
                   </div>
                </div>
             </div>
           )}
        </DialogContent>
      </Dialog>

      <Dialog open={isCheckoutOpen} onOpenChange={setIsCheckoutOpen}>
        <DialogContent className="sm:max-w-md max-h-[95vh] overflow-y-auto rounded-[35px] border-none shadow-2xl p-0 font-body">
          <div className="flex flex-col h-full">
            <DialogHeader className="p-8 pb-4 border-b">
              <DialogTitle className="text-2xl font-black">Meu Carrinho</DialogTitle>
            </DialogHeader>
            
            <div className="p-8 pt-6 space-y-8 flex-1">
              {cart.length === 0 ? (
                <div className="py-12 text-center text-slate-400 font-bold">Carrinho vazio</div>
              ) : (
                <div className="space-y-6">
                  <div className="space-y-5">
                    {cart.map(item => (
                      <div key={item.product.id} className="flex items-center gap-4">
                        <div className="h-14 w-14 rounded-2xl overflow-hidden bg-slate-100 shadow-sm">
                          <img src={item.product.imageUrl} className="h-full w-full object-cover" alt="" />
                        </div>
                        <div className="flex-1">
                          <p className="font-bold text-sm text-slate-900">{item.product.name}</p>
                          <p className="text-xs text-primary font-black">R$ {(item.product.price * item.quantity).toFixed(2)}</p>
                        </div>
                        <div className="flex items-center bg-slate-100 rounded-2xl p-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-xl" onClick={() => updateQuantity(item.product.id, -1)}><Minus className="h-3 w-3" /></Button>
                          <span className="text-xs font-black w-5 text-center">{item.quantity}</span>
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-xl" onClick={() => updateQuantity(item.product.id, 1)}><Plus className="h-3 w-3" /></Button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-4 pt-6 border-t">
                    <Label className="text-xs font-black uppercase text-slate-400">Cupom de Desconto</Label>
                    <div className="flex gap-2">
                       <Input 
                        placeholder="CÓDIGO" 
                        className="rounded-xl h-12 bg-slate-50 uppercase font-bold"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                       />
                       <Button onClick={handleApplyCoupon} className="bg-slate-900 rounded-xl h-12">Aplicar</Button>
                    </div>
                  </div>

                  <div className="bg-slate-900 p-8 rounded-[40px] space-y-3 shadow-2xl">
                     <div className="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-widest opacity-80">
                        <span>Subtotal</span>
                        <span className="text-white">R$ {cartTotal.toFixed(2)}</span>
                     </div>
                     {activeCoupon && (
                       <div className="flex justify-between text-xs font-bold text-green-400 uppercase tracking-widest">
                          <span>Desconto ({activeCoupon.code})</span>
                          <span>- R$ {discountAmount.toFixed(2)}</span>
                       </div>
                     )}
                     <div className="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-widest opacity-80">
                        <span>Entrega</span>
                        <span className="text-white">R$ 5,00</span>
                     </div>
                     <div className="flex justify-between font-black text-3xl pt-4 border-t border-white/10 mt-2">
                        <span className="text-white italic">Total</span>
                        <span className="text-primary tracking-tight">R$ {finalTotal.toFixed(2)}</span>
                     </div>
                  </div>

                  <Button className="w-full bg-primary hover:bg-primary/90 py-9 rounded-[35px] text-xl font-black italic shadow-xl shadow-primary/20" onClick={handleFinishOrder}>
                    Finalizar Pedido <ChevronRight className="ml-2 h-7 w-7" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {cart.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-full max-w-xl px-4 z-50">
          <Button 
            onClick={() => setIsCheckoutOpen(true)}
            className="w-full bg-slate-900 py-10 rounded-[40px] flex justify-between px-10 h-auto shadow-2xl border border-white/10"
          >
            <div className="flex items-center gap-5">
               <div className="relative">
                 <div className="bg-primary p-4 rounded-3xl">
                   <ShoppingCart className="h-7 w-7 text-white" />
                 </div>
                 <Badge className="absolute -top-3 -right-3 h-8 w-8 p-0 flex items-center justify-center bg-white text-primary font-black rounded-full border-2 border-slate-900">
                    {cart.reduce((a, b) => a + b.quantity, 0)}
                 </Badge>
               </div>
               <div className="flex flex-col items-start">
                 <span className="text-white/40 text-[10px] uppercase font-black">Carrinho</span>
                 <span className="font-black text-xl text-white italic">Ver Itens</span>
               </div>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-white/40 text-[10px] uppercase font-black">Total</span>
              <span className="font-black text-3xl text-primary tracking-tighter italic">R$ {finalTotal.toFixed(2)}</span>
            </div>
          </Button>
        </div>
      )}
    </div>
  );
}
