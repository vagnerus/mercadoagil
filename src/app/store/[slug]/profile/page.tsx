
"use client";

import * as React from 'react';
import { useState } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  User, Calendar, ShoppingBag, Wallet, 
  Star, ChevronRight, ArrowLeft, Clock,
  History, Settings, LogOut, Package, Scissors,
  Share2, Trophy, Gift, ArrowUpRight, Copy, Check, Zap,
  Bell, Heart, CreditCard
} from "lucide-react";
import Link from 'next/link';
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function ClientPanel() {
  const params = useParams();
  const slug = params?.slug as string;
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const handleCopyCode = () => {
    navigator.clipboard.writeText("AGIL-VIP-2024");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({ title: "Código Copiado!", description: "Indique amigos e ganhe mais cashback." });
  };

  return (
    <div className="max-w-xl mx-auto min-h-screen bg-slate-50 font-body pb-32">
      <header className="bg-white p-6 border-b flex items-center justify-between sticky top-0 z-50">
        <Link href={`/store/${slug}`} className="p-2 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-lg font-black uppercase italic tracking-tighter">Minha Conta</h1>
        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
           <User className="h-5 w-5 text-primary" />
        </div>
      </header>

      <main className="p-6 space-y-8">
        {/* Card de Cashback - Design Elite */}
        <div className="bg-slate-900 p-10 rounded-[45px] text-white shadow-2xl relative overflow-hidden">
           <div className="relative z-10 flex flex-col justify-between h-full">
              <div>
                 <Badge className="bg-primary text-white border-none font-black italic text-[8px] uppercase tracking-widest mb-4 px-3 py-1">TIER GOLD MEMBER</Badge>
                 <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Saldo Disponível</p>
                 <p className="text-5xl font-black italic mt-1 tracking-tighter text-white">R$ 12,50</p>
              </div>
              <div className="mt-8 flex items-center gap-4 bg-white/5 p-4 rounded-3xl border border-white/10 backdrop-blur-md">
                 <div className="h-10 w-10 rounded-2xl bg-green-500/20 flex items-center justify-center text-green-500">
                    <Zap className="h-5 w-5" />
                 </div>
                 <div>
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Próximo Nível</p>
                    <p className="text-xs font-bold text-white uppercase italic">Elite Platinum (R$ 50,00)</p>
                 </div>
              </div>
           </div>
           <Wallet className="absolute -bottom-10 -right-10 h-48 w-48 opacity-10 rotate-12" />
        </div>

        {/* Notificações e Lembretes */}
        <div className="p-6 bg-blue-600 rounded-[35px] text-white flex items-center justify-between shadow-lg shadow-blue-200">
           <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-2xl bg-white/20 flex items-center justify-center">
                 <Bell className="h-6 w-6 animate-swing" />
              </div>
              <div>
                 <p className="font-black italic text-sm uppercase">Lembrete Ativo</p>
                 <p className="text-[10px] font-bold opacity-80 uppercase">Corte hoje às 14:00</p>
              </div>
           </div>
           <Badge className="bg-white text-blue-600 border-none font-black italic">CONFIRMADO</Badge>
        </div>

        {/* Grid de Ações Rápidas */}
        <div className="grid grid-cols-2 gap-4">
           <Card className="border-none shadow-sm rounded-[35px] p-6 bg-white hover:shadow-xl transition-all cursor-pointer group border-b-4 border-primary/20">
              <Calendar className="h-8 w-8 text-primary mb-4 group-hover:scale-110 transition-transform" />
              <p className="font-black text-sm uppercase italic text-slate-900 leading-tight">Meus Agendamentos</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase mt-2">01 Pendente</p>
           </Card>
           <Card className="border-none shadow-sm rounded-[35px] p-6 bg-white hover:shadow-xl transition-all cursor-pointer group border-b-4 border-accent/20">
              <ShoppingBag className="h-8 w-8 text-accent mb-4 group-hover:scale-110 transition-transform" />
              <p className="font-black text-sm uppercase italic text-slate-900 leading-tight">Meus Pedidos</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase mt-2">Histórico Completo</p>
           </Card>
        </div>

        {/* Seção de Pacotes Ativos */}
        <div className="space-y-4">
           <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-2">Meus Pacotes & Sessões</h3>
           <Card className="border-none shadow-sm rounded-[35px] p-6 bg-white flex items-center justify-between border-l-4 border-green-500">
              <div className="flex items-center gap-4">
                 <div className="h-12 w-12 rounded-2xl bg-green-50 flex items-center justify-center text-green-600">
                    <History className="h-6 w-6" />
                 </div>
                 <div>
                    <p className="font-black text-slate-900 italic text-sm uppercase">Combo Barba & Cabelo</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Restam 03 sessões</p>
                 </div>
              </div>
              <Button size="sm" className="rounded-xl font-black italic bg-slate-900 text-white text-[8px] h-8 px-3">USAR AGORA</Button>
           </Card>
        </div>

        {/* Refer & Earn (Indique e Ganhe) */}
        <Card className="border-none shadow-lg rounded-[40px] p-8 bg-primary text-white relative overflow-hidden">
           <div className="relative z-10 space-y-6">
              <div className="h-12 w-12 rounded-2xl bg-white/20 flex items-center justify-center">
                 <Gift className="h-6 w-6 text-white" />
              </div>
              <div>
                 <h3 className="text-2xl font-black italic uppercase tracking-tighter">Indique e Ganhe</h3>
                 <p className="text-xs font-medium text-white/70 leading-relaxed mt-2 italic">
                    Compartilhe seu código com amigos. Quando eles usarem pela primeira vez, você ganha **R$ 5,00** de bônus direto na carteira.
                 </p>
              </div>
              <div className="bg-white/10 p-4 rounded-3xl border border-white/20 flex items-center justify-between gap-4">
                 <code className="text-sm font-black tracking-widest">AGIL-VIP-2024</code>
                 <Button onClick={handleCopyCode} variant="ghost" size="icon" className="text-white hover:bg-white/20">
                    {copied ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
                 </Button>
              </div>
           </div>
           <Trophy className="absolute -bottom-6 -right-6 h-32 w-32 opacity-10 -rotate-12" />
        </Card>

        {/* Histórico Recente */}
        <div className="space-y-4">
           <div className="flex justify-between items-center px-2">
              <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Movimentações Recentes</h3>
              <Link href="#" className="text-[8px] font-black text-primary uppercase border-b border-primary">Ver Tudo</Link>
           </div>
           <div className="space-y-3">
              {[
                { name: "Corte Degradê", date: "12 Out, 14:00", status: "Concluído", icon: Scissors, color: "text-blue-500", bg: "bg-blue-50" },
                { name: "Cashback Recebido", date: "12 Out, 14:45", status: "Crédito", icon: Wallet, color: "text-green-500", bg: "bg-green-50" }
              ].map((item, i) => (
                <div key={i} className="bg-white p-5 rounded-[35px] shadow-sm flex items-center justify-between border border-slate-100 hover:scale-[1.02] transition-transform">
                   <div className="flex items-center gap-4">
                      <div className={cn("h-12 w-12 rounded-2xl flex items-center justify-center", item.bg, item.color)}>
                         <item.icon className="h-6 w-6" />
                      </div>
                      <div>
                         <p className="font-black text-sm uppercase italic text-slate-900">{item.name}</p>
                         <p className="text-[10px] font-bold text-slate-400 flex items-center gap-1 uppercase">
                            <Clock className="h-3 w-3" /> {item.date}
                         </p>
                      </div>
                   </div>
                   <Badge className={cn(
                     "font-black text-[8px] border-none italic uppercase px-3",
                     item.status === 'Concluído' ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"
                   )}>{item.status}</Badge>
                </div>
              ))}
           </div>
        </div>

        {/* Footer de Ação */}
        <div className="pt-6 border-t border-dashed border-slate-200">
           <button className="w-full h-16 bg-red-50 text-red-500 rounded-[30px] font-black italic flex items-center justify-center gap-3 uppercase tracking-widest text-xs hover:bg-red-100 transition-colors">
              <LogOut className="h-5 w-5" /> Sair da minha conta
           </button>
           <p className="text-center text-[8px] font-black text-slate-300 uppercase mt-6 tracking-[0.3em]">Mercado Ágil Customer Cloud v3.2</p>
        </div>
      </main>

      {/* Bottom Navigation Mobile */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-white/80 backdrop-blur-xl border-t flex justify-around items-center z-50 rounded-t-[40px] shadow-2xl">
         <Link href={`/store/${slug}`} className="p-4 text-slate-400 hover:text-primary transition-colors">
            <ShoppingBag className="h-7 w-7" />
         </Link>
         <Link href={`/store/${slug}/profile`} className="p-4 text-primary bg-primary/10 rounded-3xl scale-110 shadow-inner">
            <User className="h-7 w-7" />
         </Link>
         <Link href={`/store/${slug}/profile`} className="p-4 text-slate-400 hover:text-primary transition-colors">
            <Clock className="h-7 w-7" />
         </Link>
      </div>
    </div>
  );
}
