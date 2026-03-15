
"use client";

import * as React from 'react';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Video, Mic, MicOff, VideoOff, PhoneOff, 
  MessageSquare, Users, ShieldCheck, 
  LayoutDashboard, ClipboardList, Loader2, Sparkles, Monitor
} from "lucide-react";
import Link from 'next/link';

export default function HealthTelemedicine({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = React.use(params);
  const [callActive, setCallActive] = useState(false);

  return (
    <div className="flex min-h-screen bg-slate-900 text-white font-body">
      <aside className="w-64 border-r border-white/10 bg-black hidden lg:flex flex-col sticky top-0 h-screen">
        <div className="p-6">
          <Link href={`/merchant/${slug}/dashboard`} className="flex items-center gap-2 font-black text-xl italic tracking-tighter text-primary uppercase">MERCADO ÁGIL</Link>
        </div>
        <nav className="flex-1 px-4 space-y-2">
          <Link href={`/merchant/${slug}/dashboard`} className="flex items-center gap-3 px-4 py-2.5 text-slate-400 hover:bg-white/5 rounded-xl transition-colors font-medium"><LayoutDashboard className="h-5 w-5" /> Dashboard</Link>
          <Link href={`/merchant/${slug}/health/pep`} className="flex items-center gap-3 px-4 py-2.5 text-slate-400 hover:bg-white/5 rounded-xl transition-colors font-medium"><ClipboardList className="h-5 w-5" /> Prontuários (PEP)</Link>
          <Link href={`/merchant/${slug}/health/telemedicine`} className="flex items-center gap-3 px-4 py-2.5 bg-primary/10 text-primary rounded-xl font-bold"><Video className="h-5 w-5" /> Telemedicina</Link>
        </nav>
      </aside>

      <main className="flex-1 p-8 overflow-y-auto">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-black tracking-tighter italic uppercase">Consultório Virtual</h1>
            <p className="text-slate-500 font-medium italic">Sala segura AES-256 compatível com LGPD.</p>
          </div>
          <Badge className="bg-green-500/20 text-green-500 border-none px-4 py-2 font-black italic">CONEXÃO: ESTÁVEL</Badge>
        </header>

        <div className="grid gap-8 lg:grid-cols-4">
           <div className="lg:col-span-3 space-y-6">
              <div className="aspect-video rounded-[40px] bg-black border-4 border-white/5 relative overflow-hidden group shadow-2xl">
                 {!callActive ? (
                   <div className="absolute inset-0 flex flex-col items-center justify-center space-y-6">
                      <div className="h-32 w-32 rounded-full bg-slate-800 flex items-center justify-center">
                         <Users className="h-16 w-16 text-slate-600" />
                      </div>
                      <div className="text-center">
                         <h3 className="text-xl font-black italic">Aguardando Paciente...</h3>
                         <p className="text-slate-500 text-sm mt-1">Sala: DR-RICARDO-OB-24</p>
                      </div>
                      <Button onClick={() => setCallActive(true)} className="bg-primary hover:bg-primary/90 text-white font-black italic rounded-2xl px-10 h-14 shadow-xl shadow-primary/20">
                         INICIAR CONSULTA
                      </Button>
                   </div>
                 ) : (
                   <>
                     <img src="https://picsum.photos/seed/patient/1200/800" className="w-full h-full object-cover opacity-80" />
                     <div className="absolute top-6 right-6 w-48 aspect-video rounded-2xl border-2 border-white/20 overflow-hidden shadow-2xl">
                        <img src="https://picsum.photos/seed/doctor/400/300" className="w-full h-full object-cover" />
                        <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/50 rounded-md text-[8px] font-bold">VOCÊ (DR. RICARDO)</div>
                     </div>
                     <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-4 bg-black/40 backdrop-blur-xl p-4 rounded-3xl border border-white/10 shadow-2xl">
                        <Button size="icon" variant="ghost" className="h-12 w-12 rounded-full bg-white/10 hover:bg-white/20"><Mic className="h-5 w-5" /></Button>
                        <Button size="icon" variant="ghost" className="h-12 w-12 rounded-full bg-white/10 hover:bg-white/20"><Video className="h-5 w-5" /></Button>
                        <Button onClick={() => setCallActive(false)} size="icon" className="h-12 w-12 rounded-full bg-red-500 hover:bg-red-600"><PhoneOff className="h-5 w-5" /></Button>
                     </div>
                   </>
                 )}
              </div>
           </div>

           <div className="space-y-6">
              <Card className="bg-white/5 border-none rounded-[40px] p-8">
                 <CardTitle className="text-xl font-black italic mb-6">Prontuário Rápido</CardTitle>
                 <div className="space-y-4">
                    <div className="p-4 bg-white/5 rounded-2xl space-y-2 border border-white/10">
                       <p className="text-[10px] font-black uppercase text-primary">Paciente Atual</p>
                       <p className="text-lg font-black italic">João Silva, 42</p>
                       <p className="text-xs text-slate-400">Histórico: Hipertensão</p>
                    </div>
                    <Button variant="outline" className="w-full h-12 rounded-2xl border-white/10 text-white font-black hover:bg-white/5 uppercase text-xs">Ver Prontuário Completo</Button>
                 </div>
              </Card>

              <Card className="bg-primary rounded-[40px] p-8 text-white relative overflow-hidden">
                 <div className="relative z-10 space-y-4">
                    <Sparkles className="h-10 w-10 text-white" />
                    <h3 className="text-xl font-black italic uppercase">IA Scribe</h3>
                    <p className="text-xs font-bold opacity-80 leading-relaxed italic">"Nossa IA está transcrevendo a consulta e gerando o CID automaticamente."</p>
                    <Badge className="bg-white/20 text-white border-none font-black italic">ESCRITA ATIVA</Badge>
                 </div>
              </Card>
           </div>
        </div>
      </main>
    </div>
  );
}
