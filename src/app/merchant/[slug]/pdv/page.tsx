
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
  Barcode, Printer, ArrowLeft, Loader2, Sparkles, 
  Monitor, Scissors, Calendar, Timer, Ticket, FileText, Download
} from "lucide-react";
import { MOCK_PRODUCTS, MOCK_SERVICES, Product, Service } from "@/lib/mock-data";
import { useToast } from "@/hooks/use-toast";
import Link from 'next/link';
import { cn } from "@/lib/utils";
import { jsPDF } from "jspdf";

export default function MerchantPDV({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = React.use(params);
  const [cart, setCart] = useState<{product?: Product, service?: Service, quantity: number}[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'products' | 'services' | 'appointments'>('products');
  const { toast } = useToast();

  const filteredProducts = MOCK_PRODUCTS.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
  const filteredServices = MOCK_SERVICES.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()));

  const addItem = (item: Product | Service, type: 'product' | 'service') => {
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
  };

  const removeFromCart = (id: string, type: 'product' | 'service') => {
    setCart(prev => prev.filter(i => (type === 'product' ? i.product?.id !== id : i.service?.id !== id)));
  };

  const total = cart.reduce((acc, i) => acc + ((i.product?.price || i.service?.price || 0) * i.quantity), 0);

  const generatePDFReceipt = (orderId: string) => {
    const doc = new jsPDF({ unit: 'mm', format: [80, 150] }); // Formato térmico 80mm
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("MERCADO AGIL", 40, 15, { align: "center" });
    
    doc.setFontSize(8);
    doc.text(`ID INSTANCIA: ${slug.toUpperCase()}`, 40, 20, { align: "center" });
    doc.text(`PEDIDO: #${orderId}`, 40, 25, { align: "center" });
    
    doc.line(5, 30, 75, 30);
    
    let y = 38;
    doc.text("ITEM", 5, y);
    doc.text("QTD", 50, y);
    doc.text("TOTAL", 75, y, { align: "right" });
    
    doc.setFont("helvetica", "normal");
    y += 8;
    cart.forEach(item => {
      const name = item.product?.name || item.service?.name || "";
      const price = (item.product?.price || item.service?.price || 0) * item.quantity;
      doc.text(name.substring(0, 20), 5, y);
      doc.text(item.quantity.toString(), 52, y);
      doc.text(`R$ ${price.toFixed(2)}`, 75, y, { align: "right" });
      y += 6;
    });
    
    doc.line(5, y + 2, 75, y + 2);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("TOTAL GERAL", 5, y + 10);
    doc.text(`R$ ${total.toFixed(2)}`, 75, y + 10, { align: "right" });
    
    doc.setFontSize(7);
    doc.text("Obrigado pela preferência!", 40, y + 20, { align: "center" });
    doc.text(new Date().toLocaleString(), 40, y + 25, { align: "center" });
    
    doc.save(`Recibo_${orderId}.pdf`);
  };

  const handleCheckout = () => {
    if (cart.length === 0) return;
    setLoading(true);
    const orderId = Math.random().toString(36).substring(7).toUpperCase();
    
    setTimeout(() => {
      setLoading(false);
      generatePDFReceipt(orderId);
      setCart([]);
      toast({ title: "Venda Concluída!", description: "Recibo digital gerado com sucesso." });
    }, 1200);
  };

  return (
    <div className="flex h-screen bg-slate-900 overflow-hidden font-body text-white">
      {/* Sidebar Catálogo/Serviços */}
      <div className="w-[60%] flex flex-col border-r border-white/10 bg-slate-950">
        <header className="p-6 border-b border-white/10 flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href={`/merchant/${slug}/dashboard`} className="p-2 bg-white/5 rounded-xl hover:bg-white/10 transition-colors">
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <h1 className="text-2xl font-black italic tracking-tighter uppercase">PDV <span className="text-primary not-italic">ENTERPRISE</span></h1>
            </div>
            <div className="flex items-center gap-2 p-1 bg-white/5 rounded-2xl border border-white/10">
               <button onClick={() => setActiveTab('products')} className={cn("px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all", activeTab === 'products' ? "bg-primary text-white shadow-lg" : "text-slate-500")}>Produtos</button>
               <button onClick={() => setActiveTab('services')} className={cn("px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all", activeTab === 'services' ? "bg-primary text-white shadow-lg" : "text-slate-500")}>Serviços</button>
               <button onClick={() => setActiveTab('appointments')} className={cn("px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all", activeTab === 'appointments' ? "bg-primary text-white shadow-lg" : "text-slate-500")}>Agendamentos</button>
            </div>
          </div>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <Input className="pl-12 bg-white/5 border-none h-14 rounded-2xl font-bold focus:ring-primary text-lg" placeholder="Buscar por nome, SKU ou BIPAR código..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-2 lg:grid-cols-3 gap-4 no-scrollbar content-start">
          {activeTab === 'products' && filteredProducts.map(p => (
            <Card key={p.id} onClick={() => addItem(p, 'product')} className="bg-white/5 border-none hover:bg-primary transition-all cursor-pointer group rounded-[35px] overflow-hidden flex flex-col h-56">
              <div className="h-28 overflow-hidden relative">
                <img src={p.imageUrl} className="w-full h-full object-cover opacity-60 group-hover:opacity-100" />
                <Badge className="absolute top-3 right-3 bg-black/50 border-none font-black italic">R$ {p.price.toFixed(2)}</Badge>
              </div>
              <CardContent className="p-5 flex-1 flex flex-col justify-between">
                <p className="font-black text-xs text-white uppercase italic leading-tight">{p.name}</p>
                <div className="flex justify-between items-center text-[8px] font-black text-slate-500 group-hover:text-white/80 uppercase">
                  <span>Estoque: {p.stock}</span>
                  <Barcode className="h-3 w-3" />
                </div>
              </CardContent>
            </Card>
          ))}

          {activeTab === 'services' && filteredServices.map(s => (
            <Card key={s.id} onClick={() => addItem(s, 'service')} className="bg-white/5 border-none hover:bg-primary transition-all cursor-pointer group rounded-[35px] p-6 flex flex-col justify-between h-56 border-2 border-transparent hover:border-white/20">
               <div className="h-12 w-12 rounded-2xl bg-white/5 flex items-center justify-center text-slate-500 group-hover:text-white transition-colors">
                  <Scissors className="h-6 w-6" />
               </div>
               <div className="space-y-1">
                  <p className="font-black text-sm uppercase italic text-white leading-tight">{s.name}</p>
                  <p className="text-[10px] font-bold text-slate-500 group-hover:text-white/60 flex items-center gap-1 uppercase"><Timer className="h-3 w-3" /> {s.duration} min</p>
               </div>
               <p className="font-black text-xl text-primary italic group-hover:text-white">R$ {s.price.toFixed(2)}</p>
            </Card>
          ))}

          {activeTab === 'appointments' && (
            <div className="col-span-full space-y-4">
               <div className="p-10 text-center bg-white/5 rounded-[40px] border-2 border-dashed border-white/10">
                  <Calendar className="h-12 w-12 text-slate-700 mx-auto mb-4" />
                  <p className="font-black italic text-slate-500 uppercase tracking-widest">Selecione um Agendamento do Dia</p>
                  <p className="text-[10px] font-bold text-slate-600 mt-2">Os serviços e profissionais serão vinculados automaticamente.</p>
               </div>
            </div>
          )}
        </div>
      </div>

      {/* Sidebar Carrinho / Checkout */}
      <div className="w-[40%] flex flex-col bg-slate-900 shadow-2xl relative">
        <header className="p-6 border-b border-white/10 flex items-center justify-between">
          <h2 className="text-xl font-black italic uppercase tracking-widest flex items-center gap-3">
            <Ticket className="h-6 w-6 text-primary" /> Comanda Aberta
          </h2>
          <Badge className="bg-primary text-white border-none font-black px-4 py-1 rounded-full">{cart.length} ITENS</Badge>
        </header>

        <div className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar">
          {cart.map((item, idx) => (
            <div key={idx} className="flex gap-4 p-5 bg-white/5 rounded-[30px] items-center border border-white/5 group hover:bg-white/10 transition-all">
              <div className="h-14 w-14 rounded-2xl overflow-hidden bg-slate-800 flex items-center justify-center text-slate-500">
                {item.product ? <img src={item.product.imageUrl} className="w-full h-full object-cover" /> : <Scissors className="h-6 w-6" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-black text-xs uppercase italic leading-tight truncate">{item.product?.name || item.service?.name}</p>
                <p className="text-primary font-black mt-1 text-sm italic">R$ {(item.product?.price || item.service?.price || 0).toFixed(2)}</p>
              </div>
              <div className="flex items-center gap-3 bg-black/40 p-1.5 rounded-2xl">
                <span className="font-black w-6 text-center text-xs">{item.quantity}x</span>
              </div>
              <Button size="icon" variant="ghost" className="text-slate-600 hover:text-red-400 transition-colors" onClick={() => removeFromCart((item.product?.id || item.service?.id)!, item.product ? 'product' : 'service')}><Trash2 className="h-4 w-4" /></Button>
            </div>
          ))}
          
          {cart.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-slate-700 space-y-4">
              <div className="h-24 w-24 rounded-full bg-white/5 flex items-center justify-center">
                 <Monitor className="h-10 w-10 opacity-20" />
              </div>
              <p className="font-black italic uppercase tracking-[0.2em] text-[10px]">Aguardando lançamento...</p>
            </div>
          )}
        </div>

        <footer className="p-8 bg-black/60 border-t border-white/10 space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between text-slate-500 font-black uppercase text-[10px] tracking-[0.2em]">
              <span>Subtotal</span>
              <span>R$ {total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-4xl font-black italic tracking-tighter text-white">
              <span>TOTAL</span>
              <span className="text-primary">R$ {total.toFixed(2)}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button variant="outline" className="h-14 bg-white/5 border-white/10 rounded-2xl font-black italic hover:bg-white hover:text-slate-900 transition-all gap-2 uppercase tracking-widest text-[10px]">
              <Landmark className="h-5 w-5" /> PIX / Dinheiro
            </Button>
            <Button variant="outline" className="h-14 bg-white/5 border-white/10 rounded-2xl font-black italic hover:bg-white hover:text-slate-900 transition-all gap-2 uppercase tracking-widest text-[10px]">
              <CreditCard className="h-5 w-5" /> Cartão Débito/Crédito
            </Button>
          </div>

          <Button 
            onClick={handleCheckout} 
            disabled={cart.length === 0 || loading}
            className="w-full h-20 bg-primary hover:bg-primary/90 text-white rounded-[35px] text-xl font-black italic shadow-2xl shadow-primary/20 flex justify-between px-10 transition-all active:scale-95 border-4 border-white/5"
          >
            {loading ? <Loader2 className="h-8 w-8 animate-spin mx-auto" /> : (
              <>
                <span>FECHAR COMANDA</span>
                <div className="flex items-center gap-3">
                  <FileText className="h-6 w-6 opacity-50" />
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
