
"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Clock, CheckCircle2, UtensilsCrossed, Truck, MapPin, Star } from "lucide-react";
import Link from 'next/link';

export default function OrderTracking() {
  const params = useParams();
  const orderId = params?.orderId as string;
  const [step, setStep] = useState(1);

  // Simulating order progress
  useEffect(() => {
    const timer = setInterval(() => {
      setStep(prev => (prev < 4 ? prev + 1 : 4));
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const steps = [
    { id: 1, label: "Pedido Recebido", icon: CheckCircle2, description: "Aguardando confirmação do restaurante." },
    { id: 2, label: "Em Preparo", icon: UtensilsCrossed, description: "O chef está preparando seu pedido com carinho." },
    { id: 3, label: "Saiu para Entrega", icon: Truck, description: "O motoboy já está a caminho da sua casa." },
    { id: 4, label: "Entregue", icon: MapPin, description: "Bom apetite! Não esqueça de avaliar." },
  ];

  return (
    <div className="max-w-xl mx-auto min-h-screen bg-slate-50 pb-20 font-body">
      <header className="bg-white p-6 flex items-center gap-4 border-b sticky top-0 z-50">
        <Link href={`/store/burger-ze`} className="p-2 bg-slate-100 rounded-xl">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-xl font-black">Acompanhar Pedido</h1>
          <p className="text-xs text-slate-400 font-bold"># {orderId?.toUpperCase()}</p>
        </div>
      </header>

      <main className="p-6 space-y-8">
        <div className="bg-primary p-8 rounded-[40px] text-white shadow-xl shadow-primary/20 relative overflow-hidden">
           <div className="relative z-10 space-y-2">
             <p className="text-xs font-bold uppercase opacity-80 tracking-widest">Previsão de Entrega</p>
             <h2 className="text-4xl font-black italic">25 - 35 min</h2>
           </div>
           <Clock className="absolute -bottom-4 -right-4 h-32 w-32 opacity-10" />
        </div>

        <div className="space-y-6">
          {steps.map((s, i) => (
            <div key={s.id} className="flex gap-6 relative">
              {i !== steps.length - 1 && (
                <div className={`absolute left-6 top-12 bottom-0 w-1 ${step > s.id ? 'bg-primary' : 'bg-slate-200'} rounded-full`}></div>
              )}
              <div className={`h-12 w-12 rounded-2xl flex items-center justify-center shrink-0 shadow-lg ${step >= s.id ? 'bg-primary text-white' : 'bg-white text-slate-300'}`}>
                <s.icon className="h-6 w-6" />
              </div>
              <div className="space-y-1 py-1">
                <h3 className={`font-black text-lg ${step >= s.id ? 'text-slate-900' : 'text-slate-300'}`}>{s.label}</h3>
                <p className={`text-sm font-medium leading-relaxed ${step >= s.id ? 'text-slate-500' : 'text-slate-300'}`}>{s.description}</p>
              </div>
            </div>
          ))}
        </div>

        {step === 4 && (
          <Card className="border-none shadow-xl rounded-[40px] p-8 space-y-6 animate-in fade-in slide-in-from-bottom-10">
            <div className="text-center space-y-2">
               <h3 className="text-xl font-black">Como foi sua experiência?</h3>
               <p className="text-slate-500 font-medium text-sm">Sua avaliação ajuda o Burger King do Zé a melhorar.</p>
            </div>
            <div className="flex justify-center gap-3">
               {[1,2,3,4,5].map(star => (
                 <Star key={star} className="h-10 w-10 text-yellow-400 hover:fill-yellow-400 cursor-pointer transition-all" />
               ))}
            </div>
            <Button className="w-full bg-slate-900 h-16 rounded-[25px] font-bold text-white shadow-xl">Enviar Avaliação</Button>
          </Card>
        )}
      </main>
    </div>
  );
}
