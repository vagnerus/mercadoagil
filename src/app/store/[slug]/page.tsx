
"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { MOCK_MERCHANTS, MOCK_CATEGORIES, MOCK_PRODUCTS, MOCK_COUPONS, Product, Merchant, Coupon } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Clock, Info, Search, MapPin, ChevronRight, Plus, Minus, Trash2, CheckCircle2, ArrowLeft, Star, Heart, Share2, Ticket, QrCode, Gift, Zap } from "lucide-react";
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
  const [isQrOpen, setIsQrOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [couponCode, setCouponCode] = useState("");
  const [activeCoupon, setActiveCoupon] = useState<Coupon | null>(null);
  
  const { toast } = useToast();

  useEffect(() => {
    const found = MOCK_MERCHANTS.find(m => m.slug === slug);
    if (found) setMerchant(found);
  }, [slug]);

  const products = MOCK_PRODUCTS.filter(p => p.merchantId === merchant?.id);
  const categories = MOCK_CATEGORIES.filter(c => c.merchantId === merchant?.id);
  
  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleFavorite = (productId: string) => {
    const isFav = favorites.includes(productId);
    setFavorites(prev => isFav ? prev.filter(id => id !== productId) : [...prev, productId]);
    toast({ 
      title: isFav ? "Removido" : "Favoritado!", 
      description: isFav ? "Item removido da sua lista." : "Item salvo para facilitar sua próxima compra.",
      variant: isFav ? "default" : "default" 
    });
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
  const discountAmount = activeCoupon 
    ? (activeCoupon.type === 'percent' ? (cartTotal * activeCoupon.discount / 100) : activeCoupon.discount)
    : 0;
  const deliveryFee = 5.00;
  const finalTotal = Math.max(0, cartTotal - discountAmount + deliveryFee);

  const handleFinishOrder = () => {
    router.push(`/store/${slug}/track/${Math.random().toString(36).substring(7)}`);
  };

  if (!merchant) return null;

  return (
    <div className="max-w-xl mx-auto min-h-screen bg-slate-50 pb-40 relative font-body overflow-x-hidden">
      <div className="relative h-72 w-full overflow-hidden">
        <img src={merchant.bannerUrl} alt={merchant.name} className="w-full h-full object-cover scale-110 hover:scale-100 transition-transform duration-1000" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent"></div>
        <Link href="/" className="absolute top-6 left-6 bg-white/90 backdrop-blur-sm p-3 rounded-2xl shadow-xl z-50 hover:bg-white transition-colors">
           <ArrowLeft className="h-5 w-5 text-slate-800" />
        </Link>
        <div className="absolute top-6 right-6 flex gap-2 z-50">
          <button onClick={() => setIsQrOpen(true)} className="bg-white/90 backdrop-blur-sm p-3 rounded-2xl shadow-xl hover:bg-white transition-colors">
             <QrCode className="h-5 w-5 text-slate-800" />
          </button>
          <button onClick={() => window.open(`https://wa.me/?text=Confira a loja ${merchant.name}!`)} className="bg-white/90 backdrop-blur-sm p-3 rounded-2xl shadow-xl hover:bg-white transition-colors">
             <Share2 className="h-5 w-5 text-slate-800" />
          </button>
        </div>
        
        <div className="absolute bottom-8 left-8 right-8 flex items-end gap-6">
           <div className="h-28 w-28 rounded-[35px] border-4 border-white/20 bg-white shadow-2xl overflow-hidden shrink-0">
             <img src={merchant.logoUrl} alt={merchant.name} className="h-full w-full object-cover" />
           </div>
           <div className="flex-1 pb-2 space-y-2">
             <div className="flex items-center gap-2">
                <Badge className="bg-primary border-none px-4 py-1 text-white text-[9px] font-black rounded-full uppercase tracking-widest shadow-lg shadow-primary/30">Lojista Pro</Badge>
                <div className="flex items-center text-white text-xs font-black gap-1 drop-shadow-md">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" /> 4.9
                </div>
             </div>
             <h1 className="text-3xl font-black text-white drop-shadow-xl tracking-tighter italic">{merchant.name}</h1>
           </div>
        </div>
      </div>

      <div className="bg-white mx-4 -mt-10 relative z-10 px-6 py-8 rounded-[40px] shadow-2xl shadow-slate-200/50 flex items-center justify-between border">
        <div className="flex flex-col items-center flex-1 border-r border-slate-100">
          <span className="text-slate-900 font-black text-base italic">30-45</span>
          <span className="text-[9px] uppercase font-black tracking-widest text-slate-400">Minutos</span>
        </div>
        <div className="flex flex-col items-center flex-1 border-r border-slate-100 px-2">
          <span className="text-primary font-black text-base italic">R$ 5,00</span>
          <span className="text-[9px] uppercase font-black tracking-widest text-slate-400">Entrega</span>
        </div>
        <div className="flex flex-col items-center flex-1">
          <span className="text-slate-900 font-black text-base italic">R$ 20,00</span>
          <span className="text-[9px] uppercase font-black tracking-widest text-slate-400">Mínimo</span>
        </div>
      </div>

      <div className="p-6">
         <div className="bg-accent/5 border border-accent/10 p-6 rounded-[35px] flex items-center gap-5 relative overflow-hidden group">
            <Gift className="h-10 w-10 text-accent opacity-20 absolute -right-2 -bottom-2 group-hover:scale-125 transition-transform" />
            <div className="h-14 w-14 rounded-[20px] bg-accent/10 flex items-center justify-center shrink-0">
               <Zap className="h-6 w-6 text-accent fill-accent" />
            </div>
            <div className="flex-1 space-y-2">
               <div className="flex justify-between items-center">
                  <p className="text-xs font-black uppercase tracking-widest text-slate-500">Cartão Fidelidade</p>
                  <span className="text-xs font-black text-accent">7/10</span>
               </div>
               <div className="h-3 w-full bg-slate-200/50 rounded-full overflow-hidden">
                  <div className="h-full bg-accent w-[70%] rounded-full shadow-lg shadow-accent/20"></div>
               </div>
               <p className="text-[10px] font-bold text-slate-400">Faltam apenas 3 pedidos para sua recompensa!</p>
            </div>
         </div>
      </div>

      <div className="sticky top-0 z-40 bg-slate-50/90 backdrop-blur-md px-6 py-4 space-y-4">
        <div className="relative">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input 
            className="w-full h-14 bg-white border border-slate-100 shadow-sm rounded-[24px] pl-12 pr-4 text-sm font-bold focus:ring-2 focus:ring-primary outline-none transition-all" 
            placeholder="Qual será a pedida de hoje?"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar px-1">
          {categories.map(cat => (
             <Badge key={cat.id} variant="outline" className="rounded-[18px] px-6 py-3 whitespace-nowrap bg-white border-slate-100 text-slate-600 font-black text-[10px] uppercase tracking-widest hover:bg-primary hover:text-white hover:border-primary cursor-pointer transition-all shadow-sm">
               {cat.name}
             </Badge>
          ))}
        </div>
      </div>

      <div className="p-6 space-y-12">
        {categories.map(category => {
          const catProducts = filteredProducts.filter(p => p.categoryId === category.id);
          if (catProducts.length === 0) return null;

          return (
            <div key={category.id} className="space-y-6">
              <div className="flex items-center gap-3">
                 <div className="h-1 w-8 bg-primary rounded-full"></div>
                 <h2 className="text-2xl font-black text-slate-900 tracking-tighter italic">{category.name}</h2>
              </div>
              <div className="grid gap-6">
                {catProducts.map(product => (
                  <div key={product.id} className="relative group">
                    <button 
                      onClick={() => toggleFavorite(product.id)}
                      className="absolute top-4 left-4 z-20 p-3 bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl hover:scale-110 transition-transform"
                    >
                      <Heart className={`h-4 w-4 ${favorites.includes(product.id) ? 'fill-red-500 text-red-500' : 'text-slate-400'}`} />
                    </button>
                    <div 
                      onClick={() => setSelectedProduct(product)}
                      className="flex gap-5 p-5 bg-white border border-slate-100 rounded-[40px] hover:border-primary/20 hover:shadow-2xl hover:-translate-y-1 transition-all cursor-pointer shadow-sm relative overflow-hidden group/card"
                    >
                      <div className="flex-1 flex flex-col justify-between py-1">
                        <div>
                          <h3 className="font-black text-slate-900 text-lg leading-tight group-hover/card:text-primary transition-colors">{product.name}</h3>
                          <p className="text-xs text-slate-500 line-clamp-2 mt-2 font-medium leading-relaxed">{product.description}</p>
                        </div>
                        <div className="flex items-center gap-4 mt-4">
                          <p className="font-black text-primary text-xl italic tracking-tighter">R$ {product.price.toFixed(2)}</p>
                          {product.rating && (
                            <div className="flex items-center text-[10px] font-black text-yellow-600 bg-yellow-50 px-3 py-1 rounded-full">
                              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 mr-1" /> {product.rating}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="h-32 w-32 rounded-[32px] bg-slate-50 overflow-hidden shrink-0 relative shadow-inner border border-slate-50">
                        <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover group-hover/card:scale-110 transition-transform duration-500" />
                        <div className="absolute inset-0 bg-slate-900/5 group-hover/card:opacity-0 transition-opacity"></div>
                        <div className="absolute bottom-2 right-2 bg-primary text-white p-3 rounded-2xl shadow-xl translate-y-2 opacity-0 group-hover/card:translate-y-0 group-hover/card:opacity-100 transition-all">
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
        <DialogContent className="sm:max-w-md p-0 overflow-hidden rounded-[50px] border-none shadow-2xl font-body">
           {selectedProduct && (
             <div className="flex flex-col max-h-[90vh] overflow-y-auto no-scrollbar">
                <div className="h-80 w-full relative">
                   <img src={selectedProduct.imageUrl} className="w-full h-full object-cover" alt="" />
                   <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
                   <button onClick={() => setSelectedProduct(null)} className="absolute top-6 left-6 p-3 bg-white/20 backdrop-blur-md rounded-2xl text-white">
                      <ArrowLeft className="h-5 w-5" />
                   </button>
                   <div className="absolute bottom-8 left-8 right-8 flex justify-between items-end">
                      <div className="text-white space-y-1">
                        <Badge className="bg-primary/80 border-none rounded-full px-3 text-[9px] font-black uppercase mb-1">Destaque da Casa</Badge>
                        <h2 className="text-3xl font-black italic tracking-tighter">{selectedProduct.name}</h2>
                      </div>
                   </div>
                </div>
                <div className="p-10 space-y-8 bg-white">
                   <div className="space-y-3">
                      <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Descrição do Chef</h3>
                      <p className="text-slate-600 leading-relaxed font-bold text-base">{selectedProduct.description}</p>
                   </div>
                   
                   <div className="grid grid-cols-2 gap-6 py-6 border-y border-dashed border-slate-100">
                      <div className="flex flex-col">
                         <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">Preço Unitário</span>
                         <span className="text-2xl font-black italic text-primary">R$ {selectedProduct.price.toFixed(2)}</span>
                      </div>
                      <div className="flex flex-col items-end">
                         <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">Avaliação Média</span>
                         <div className="flex items-center gap-1 text-xl font-black italic">
                            <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" /> {selectedProduct.rating || 5.0}
                         </div>
                      </div>
                   </div>

                   <div className="space-y-4">
                      <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Observações</h3>
                      <Textarea placeholder="Ex: Sem cebola, retirar picles..." className="rounded-[24px] border-slate-100 bg-slate-50 font-bold h-24" />
                   </div>

                   <Button className="w-full bg-primary hover:bg-primary/90 h-20 rounded-[35px] font-black text-xl italic shadow-2xl shadow-primary/30" onClick={() => addToCart(selectedProduct)}>
                    Colocar no Carrinho
                   </Button>
                </div>
             </div>
           )}
        </DialogContent>
      </Dialog>

      <Dialog open={isCheckoutOpen} onOpenChange={setIsCheckoutOpen}>
        <DialogContent className="sm:max-w-md max-h-[95vh] overflow-hidden rounded-[45px] border-none shadow-2xl p-0 font-body">
          <div className="flex flex-col h-full bg-slate-50">
            <DialogHeader className="p-10 pb-6 bg-white border-b rounded-b-[45px] shadow-sm">
              <div className="flex justify-between items-center">
                 <DialogTitle className="text-3xl font-black italic tracking-tighter">Meu Carrinho</DialogTitle>
                 <Badge className="bg-slate-100 text-slate-500 border-none font-black italic rounded-full px-4">{cart.length} itens</Badge>
              </div>
            </DialogHeader>
            
            <div className="p-10 space-y-8 flex-1 overflow-y-auto no-scrollbar">
              {cart.length === 0 ? (
                <div className="py-20 text-center space-y-4">
                   <div className="h-24 w-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto">
                      <ShoppingCart className="h-10 w-10 text-slate-300" />
                   </div>
                   <p className="text-slate-400 font-black uppercase text-xs tracking-widest">Seu carrinho está vazio</p>
                </div>
              ) : (
                <div className="space-y-8">
                  <div className="space-y-6">
                    {cart.map((item, i) => (
                      <div key={i} className="flex items-center gap-5 p-5 bg-white rounded-[32px] border border-white shadow-sm group">
                        <div className="h-20 w-20 rounded-[22px] overflow-hidden bg-slate-100 border-2 border-slate-50 shrink-0">
                          <img src={item.product.imageUrl} className="h-full w-full object-cover group-hover:scale-110 transition-transform" alt="" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-black text-slate-900 text-sm truncate">{item.product.name}</p>
                          <p className="text-primary font-black italic text-lg mt-1">R$ {(item.product.price * item.quantity).toFixed(2)}</p>
                        </div>
                        <div className="flex items-center bg-slate-100/50 rounded-2xl p-1 gap-1">
                          <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-white shadow-sm" onClick={() => updateQuantity(item.product.id, -1)}><Minus className="h-4 w-4" /></Button>
                          <span className="text-sm font-black w-6 text-center italic">{item.quantity}</span>
                          <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-white shadow-sm" onClick={() => updateQuantity(item.product.id, 1)}><Plus className="h-4 w-4" /></Button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-4 pt-4">
                    <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-2">Possui um cupom?</Label>
                    <div className="flex gap-3">
                       <Input 
                        placeholder="CÓDIGO" 
                        className="rounded-2xl h-14 bg-white border-none shadow-sm uppercase font-black text-center tracking-widest"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                       />
                       <Button className="bg-slate-900 text-white rounded-2xl h-14 px-8 font-black italic shadow-lg">Validar</Button>
                    </div>
                  </div>

                  <div className="bg-slate-900 p-10 rounded-[45px] space-y-4 shadow-2xl relative overflow-hidden">
                     <Zap className="absolute -top-10 -right-10 h-32 w-32 text-primary opacity-5" />
                     <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        <span>Subtotal</span>
                        <span className="text-white">R$ {cartTotal.toFixed(2)}</span>
                     </div>
                     <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        <span>Taxa de Entrega</span>
                        <span className="text-white">R$ {deliveryFee.toFixed(2)}</span>
                     </div>
                     <div className="flex justify-between font-black text-4xl pt-6 border-t border-white/10 mt-2">
                        <span className="text-white italic tracking-tighter">Total</span>
                        <span className="text-primary italic tracking-tight">R$ {finalTotal.toFixed(2)}</span>
                     </div>
                  </div>

                  <Button className="w-full bg-primary hover:bg-primary/90 h-24 rounded-[40px] text-2xl font-black italic shadow-2xl shadow-primary/20 transition-all hover:scale-[1.02]" onClick={handleFinishOrder}>
                    Confirmar Pedido <ChevronRight className="ml-2 h-8 w-8" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isQrOpen} onOpenChange={setIsQrOpen}>
         <DialogContent className="sm:max-w-sm rounded-[45px] p-10 text-center space-y-8 font-body">
            <div className="space-y-2">
               <h3 className="text-2xl font-black italic tracking-tighter">QR Code da Loja</h3>
               <p className="text-slate-500 font-bold text-sm leading-relaxed">Mostre este código para seus clientes acessarem seu cardápio instantaneamente.</p>
            </div>
            <div className="h-64 w-64 bg-slate-50 border-4 border-slate-100 rounded-[40px] flex items-center justify-center mx-auto shadow-inner">
               <QrCode className="h-40 w-40 text-slate-800" />
            </div>
            <div className="flex gap-2">
               <Button variant="outline" className="flex-1 rounded-2xl h-14 font-black italic gap-2"><Download className="h-4 w-4" /> Baixar</Button>
               <Button className="flex-1 bg-slate-900 rounded-2xl h-14 font-black italic gap-2"><Copy className="h-4 w-4" /> Copiar Link</Button>
            </div>
         </DialogContent>
      </Dialog>

      {cart.length > 0 && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 w-full max-w-xl px-8 z-50 animate-in slide-in-from-bottom-20 duration-500">
          <Button 
            onClick={() => setIsCheckoutOpen(true)}
            className="w-full bg-slate-900 h-24 rounded-[45px] flex justify-between px-12 shadow-2xl border-4 border-white/10 group active:scale-95 transition-all"
          >
            <div className="flex items-center gap-6">
               <div className="relative">
                 <div className="bg-primary p-4 rounded-[22px] group-hover:scale-110 transition-transform">
                   <ShoppingCart className="h-7 w-7 text-white" />
                 </div>
                 <Badge className="absolute -top-3 -right-3 h-8 w-8 p-0 flex items-center justify-center bg-white text-primary font-black rounded-full border-4 border-slate-900 text-xs italic">
                    {cart.reduce((a, b) => a + b.quantity, 0)}
                 </Badge>
               </div>
               <div className="flex flex-col items-start">
                 <span className="text-white/40 text-[9px] uppercase font-black tracking-widest">Carrinho</span>
                 <span className="font-black text-xl text-white italic tracking-tighter">Ver Sacola</span>
               </div>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-white/40 text-[9px] uppercase font-black tracking-widest">Total</span>
              <span className="font-black text-3xl text-primary italic tracking-tight">R$ {finalTotal.toFixed(2)}</span>
            </div>
          </Button>
        </div>
      )}
    </div>
  );
}
