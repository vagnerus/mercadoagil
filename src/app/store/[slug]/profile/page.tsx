
"use client";

import * as React from 'react';
import { useState } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/badge";
import { 
  User, Calendar, ShoppingBag, Wallet, 
  Star, ChevronRight, ArrowLeft, Clock,
  History, Settings, LogOut, Package, Scissors
} from "lucide-react";
import Link from 'next/link';

export default function ClientPanel() {
  const params = useParams();
  const slug = params?.slug as string;

  return (
    <div className="max-w-xl mx-auto min-h-screen bg-slate-50 font-body pb-20">
      <header className="bg-white p-6 border-b flex items-center justify-between sticky top-0 z-50">
        <Link href={`/store/${slug}`} className="p-2 bg-slate-100 rounded-xl">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-lg font-black uppercase italic tracking-tighter">Minha Conta</h1>
        <div className="h-10 w-10 rounded-full bg-slate-200 flex items-center justify-center">
           <User className="h-5 w-5 text-slate-500" />
        </div>
      </header>

      <main className="p-6 space-y-6">
        <div className="bg-primary p-8 rounded-[40px] text-white shadow-xl shadow-primary/20 relative overflow-hidden">
           <div className="relative z-10">
              <p className="text-[10px] font-black uppercase tracking-widest opacity-80">Saldo Cashback</p>
              <p className="text-4xl font-black italic mt-1">R$ 12,50</p>
              <div className="mt-4 flex items-center gap-2">
                 <Badge className="bg-white/20 text-white border-none font-black italic text-[8px] uppercase">TIER GOLD</Badge>
                 <span className="text-[8px] font-bold opacity-70 uppercase tracking-widest">+5% em cada compra</span>
              </div>
           </div>
           <Wallet className="absolute -bottom-4 -right-4 h-32 w-32 opacity-10" />
        </div>

        <div className="grid grid-cols-2 gap-4">
           <Card className="border-none shadow-sm rounded-3xl p-6 bg-white hover:bg-slate-50 transition-colors cursor-pointer group">
              <Calendar className="h-6 w-6 text-primary mb-3" />
              <p className="font-black text-xs uppercase italic">Meus Agendamentos</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">01 Pendente</p>
           </Card>
           <Card className="border-none shadow-sm rounded-3xl p-6 bg-white hover:bg-slate-50 transition-colors cursor-pointer group">
              <ShoppingBag className="h-6 w-6 text-primary mb-3" />
              <p className="font-black text-xs uppercase italic">Meus Pedidos</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">Histórico</p>
           </Card>
        </div>

        <div className="space-y-4">
           <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-2">Histórico Recente</h3>
           <div className="space-y-3">
              {[1,2].map(i => (
                <div key={i} className="bg-white p-5 rounded-[35px] shadow-sm flex items-center justify-between border border-slate-100">
                   <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400">
                         <Scissors className="h-6 w-6" />
                      </div>
                      <div>
                         <p className="font-black text-sm uppercase italic">Corte Degradê</p>
                         <p className="text-[10px] font-bold text-slate-400 flex items-center gap-1 uppercase">
                            <Clock className="h-3 w-3" /> 12 Out às 14:00
                         </p>
                      </div>
                   </div>
                   <Badge className="bg-green-100 text-green-700 font-black text-[8px] border-none italic uppercase">Concluído</Badge>
                </div>
              ))}
           </div>
        </div>

        <div className="pt-6 border-t border-dashed border-slate-200">
           <button className="w-full h-14 bg-red-50 text-red-500 rounded-2xl font-black italic flex items-center justify-center gap-2 uppercase tracking-widest text-xs">
              <LogOut className="h-4 w-4" /> Sair da Conta
           </button>
        </div>
      </main>

      <div className="fixed bottom-0 left-0 right-0 p-6 bg-white/80 backdrop-blur-md border-t flex justify-around">
         <Link href={`/store/${slug}`} className="p-3 text-slate-400"><ShoppingBag className="h-6 w-6" /></Link>
         <Link href={`/store/${slug}/profile`} className="p-3 text-primary"><User className="h-6 w-6" /></Link>
         <Link href={`/store/${slug}/track/last`} className="p-3 text-slate-400"><Clock className="h-6 w-6" /></Link>
      </div>
    </div>
  );
}
