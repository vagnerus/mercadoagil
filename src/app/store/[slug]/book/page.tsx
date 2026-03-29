
"use client";

import * as React from 'react';
import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ChevronLeft, Clock, Scissors, User, 
  Calendar as CalendarIcon, CheckCircle2, 
  Loader2, Sparkles, MessageCircle
} from "lucide-react";
import { useFirestore, useCollection, useMemoFirebase, addDocumentNonBlocking } from '@/firebase';
import { collection, query, where, limit, doc, getDoc } from 'firebase/firestore';
import Link from 'next/link';
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

export default function BookingPage() {
  const { slug } = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const db = useFirestore();
  
  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState<any>(null);
  const [selectedStaff, setSelectedStaff] = useState<any>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Queries para dados reais
  const merchantQuery = useMemoFirebase(() => query(
    collection(db, 'merchants'), 
    where('slug', '==', slug), 
    limit(1)
  ), [db, slug]);
  const { data: merchantData } = useCollection(merchantQuery);
  const merchant = merchantData?.[0];
  const merchantId = merchant?.id;

  const servicesQuery = useMemoFirebase(() => {
    if (!merchantId) return null;
    return query(collection(db, 'merchants', merchantId, 'services'));
  }, [db, merchantId]);
  const { data: services, isLoading: loadingServices } = useCollection(servicesQuery);

  const staffQuery = useMemoFirebase(() => {
    if (!merchantId) return null;
    return query(collection(db, 'merchants', merchantId, 'staff'));
  }, [db, merchantId]);
  const { data: staff, isLoading: loadingStaff } = useCollection(staffQuery);

  const availableTimes = ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00", "18:00"];

  const handleConfirm = async () => {
    if (!merchantId) return;
    setLoading(true);

    try {
      const appointment = {
        serviceId: selectedService.id,
        service: selectedService.name,
        staffId: selectedStaff.id,
        staff: selectedStaff.name,
        time: selectedTime,
        date: new Date().toISOString().split('T')[0],
        status: 'pending',
        customer: "Cliente Online", // Simulado até ter auth de cliente
        createdAt: new Date().toISOString()
      };

      await addDocumentNonBlocking(collection(db, 'merchants', merchantId, 'appointments'), appointment);
      
      toast({ title: "Agendamento Realizado!", description: "Você receberá uma confirmação no WhatsApp em breve." });
      setStep(4);
    } catch (e) {
      toast({ title: "Erro", description: "Falha ao processar reserva.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-body selection:bg-primary">
      <header className="px-6 h-20 flex items-center border-b border-white/5 sticky top-0 z-50 bg-black/80 backdrop-blur-xl">
        <div className="container max-w-2xl mx-auto flex items-center gap-4">
           <Button variant="ghost" size="icon" className="rounded-full bg-white/5" asChild>
              <Link href={`/store/${slug}`}><ChevronLeft className="h-5 w-5" /></Link>
           </Button>
           <h1 className="text-xl font-black italic uppercase tracking-tighter">Reservar <span className="text-primary">Horário</span></h1>
        </div>
      </header>

      <main className="container max-w-2xl mx-auto px-6 py-12 space-y-10">
        {/* Progress Bar */}
        <div className="flex justify-between items-center px-4 relative">
           <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-white/5 -translate-y-1/2 -z-10"></div>
           {[1, 2, 3].map(i => (
             <div key={i} className={cn(
               "h-10 w-10 rounded-full flex items-center justify-center font-black italic text-sm transition-all border-4",
               step >= i ? "bg-primary border-black text-white scale-110" : "bg-slate-900 border-black text-slate-600"
             )}>{i}</div>
           ))}
        </div>

        {step === 1 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
             <div className="space-y-2 text-center">
                <h2 className="text-2xl font-black italic uppercase">Escolha o Serviço</h2>
                <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Selecione o procedimento desejado</p>
             </div>
             
             {loadingServices ? (
               <div className="py-20 flex justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
             ) : (
               <div className="grid gap-4">
                  {services?.map(s => (
                    <Card 
                      key={s.id} 
                      onClick={() => { setSelectedService(s); setStep(2); }}
                      className={cn(
                        "p-6 bg-white/5 border-2 border-white/5 hover:border-primary/40 transition-all cursor-pointer rounded-[35px] group",
                        selectedService?.id === s.id && "border-primary bg-primary/10"
                      )}
                    >
                       <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                             <div className="h-12 w-12 rounded-2xl bg-white/5 flex items-center justify-center text-slate-500 group-hover:text-primary">
                                <Scissors className="h-6 w-6" />
                             </div>
                             <div>
                                <p className="font-black text-sm uppercase italic">{s.name}</p>
                                <p className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1"><Clock className="h-3 w-3" /> {s.duration} min</p>
                             </div>
                          </div>
                          <p className="font-black text-lg text-primary italic">R$ {s.price?.toFixed(2)}</p>
                       </div>
                    </Card>
                  ))}
               </div>
             )}
          </div>
        )}

        {step === 2 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
             <div className="space-y-2 text-center">
                <h2 className="text-2xl font-black italic uppercase">Com quem deseja agendar?</h2>
                <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Selecione um profissional da equipe</p>
             </div>

             {loadingStaff ? (
               <div className="py-20 flex justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
             ) : (
               <div className="grid grid-cols-2 gap-4">
                  {staff?.map(p => (
                    <Card 
                      key={p.id} 
                      onClick={() => { setSelectedStaff(p); setStep(3); }}
                      className={cn(
                        "p-6 bg-white/5 border-2 border-white/5 hover:border-primary transition-all cursor-pointer rounded-[40px] text-center space-y-4",
                        selectedStaff?.id === p.id && "border-primary bg-primary/10"
                      )}
                    >
                       <div className="h-20 w-20 rounded-[30px] overflow-hidden mx-auto border-2 border-white/10">
                          <img src={p.avatar} className="w-full h-full object-cover" />
                       </div>
                       <div>
                          <p className="font-black text-sm uppercase italic">{p.name}</p>
                          <p className="text-[10px] font-bold text-slate-500 uppercase">{p.role}</p>
                       </div>
                    </Card>
                  ))}
               </div>
             )}
             <Button variant="ghost" onClick={() => setStep(1)} className="w-full font-black italic text-slate-500 uppercase text-[10px]">Alterar Serviço</Button>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
             <div className="space-y-2 text-center">
                <h2 className="text-2xl font-black italic uppercase">Qual o melhor horário?</h2>
                <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Horários disponíveis para {selectedStaff?.name}</p>
             </div>

             <div className="grid grid-cols-3 gap-3">
                {availableTimes.map(time => (
                  <Button 
                    key={time} 
                    onClick={() => setSelectedTime(time)}
                    variant={selectedTime === time ? "default" : "outline"}
                    className={cn(
                      "h-14 rounded-2xl font-black italic text-lg",
                      selectedTime === time ? "bg-primary border-primary" : "bg-white/5 border-white/10"
                    )}
                  >
                    {time}
                  </Button>
                ))}
             </div>

             <div className="pt-8 border-t border-white/10 space-y-6">
                <div className="p-6 bg-primary/5 rounded-[35px] border border-primary/20 space-y-4">
                   <h3 className="text-[10px] font-black uppercase text-primary tracking-widest">Resumo da Reserva</h3>
                   <div className="grid gap-2">
                      <p className="text-sm font-bold flex justify-between"><span>Serviço:</span> <span className="italic uppercase">{selectedService?.name}</span></p>
                      <p className="text-sm font-bold flex justify-between"><span>Profissional:</span> <span className="italic uppercase">{selectedStaff?.name}</span></p>
                      <p className="text-sm font-bold flex justify-between"><span>Horário:</span> <span className="text-primary italic text-lg">{selectedTime || "--:--"}</span></p>
                   </div>
                </div>

                <Button 
                  onClick={handleConfirm}
                  disabled={!selectedTime || loading}
                  className="w-full h-20 bg-primary hover:bg-primary/90 text-white rounded-[35px] font-black italic text-xl shadow-2xl gap-3"
                >
                   {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : <>CONFIRMAR AGENDAMENTO <Sparkles className="h-6 w-6" /></>}
                </Button>
                <Button variant="ghost" onClick={() => setStep(2)} className="w-full font-black italic text-slate-500 uppercase text-[10px]">Alterar Profissional</Button>
             </div>
          </div>
        )}

        {step === 4 && (
          <div className="py-20 text-center space-y-8 animate-in zoom-in-95">
             <div className="h-32 w-32 bg-green-500 rounded-[45px] flex items-center justify-center mx-auto shadow-2xl shadow-green-500/20">
                <CheckCircle2 className="h-16 w-16 text-white" />
             </div>
             <div className="space-y-4">
                <h2 className="text-4xl font-black italic uppercase tracking-tighter leading-none">Tudo Pronto!</h2>
                <p className="text-slate-400 font-medium italic leading-relaxed max-w-sm mx-auto">
                   Seu horário com <b>{selectedStaff?.name}</b> foi reservado com sucesso para hoje às <b>{selectedTime}</b>.
                </p>
             </div>
             <div className="p-6 bg-white/5 rounded-3xl border border-white/5 inline-flex items-center gap-3">
                <MessageCircle className="h-5 w-5 text-green-500" />
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Enviando confirmação no WhatsApp...</span>
             </div>
             <Button className="w-full h-16 bg-white text-black rounded-[30px] font-black italic text-lg" asChild>
                <Link href={`/store/${slug}`}>VOLTAR AO INÍCIO</Link>
             </Button>
          </div>
        )}
      </main>
    </div>
  );
}
