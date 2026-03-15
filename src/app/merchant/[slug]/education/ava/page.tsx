
"use client";

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  GraduationCap, Monitor, Play, BookOpen, 
  Users, MessageSquare, FileText, LayoutDashboard,
  Zap, Star, Award, Loader2
} from "lucide-react";
import Link from 'next/link';

export default function EducationAVA({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = React.use(params);

  return (
    <div className="flex min-h-screen bg-slate-900 text-white font-body">
      <aside className="w-64 border-r border-white/10 bg-black hidden lg:flex flex-col sticky top-0 h-screen">
        <div className="p-6">
          <Link href={`/merchant/${slug}/dashboard`} className="flex items-center gap-2 font-black text-xl italic tracking-tighter text-primary uppercase">MERCADO ÁGIL</Link>
        </div>
        <nav className="flex-1 px-4 space-y-2">
          <Link href={`/merchant/${slug}/dashboard`} className="flex items-center gap-3 px-4 py-2.5 text-slate-400 hover:bg-white/5 rounded-xl transition-colors font-medium"><LayoutDashboard className="h-5 w-5" /> Dashboard</Link>
          <Link href={`/merchant/${slug}/education/ava`} className="flex items-center gap-3 px-4 py-2.5 bg-primary/10 text-primary rounded-xl font-bold"><Monitor className="h-5 w-5" /> Ambiente (AVA)</Link>
          <Link href={`/merchant/${slug}/education/academic`} className="flex items-center gap-3 px-4 py-2.5 text-slate-400 hover:bg-white/5 rounded-xl transition-colors font-medium"><BookOpen className="h-5 w-5" /> Aulas & Materiais</Link>
        </nav>
      </aside>

      <main className="flex-1 p-8 overflow-y-auto">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-black tracking-tighter italic uppercase">Ambiente Virtual (AVA)</h1>
            <p className="text-slate-500 font-medium italic">E-learning Experience v2.4 - Estilo Netflix.</p>
          </div>
          <div className="flex gap-3">
             <Button className="bg-primary rounded-2xl h-12 gap-2 font-black italic px-8 shadow-xl shadow-primary/20">
                <Play className="h-4 w-4" /> Live Streaming
             </Button>
          </div>
        </header>

        <div className="grid gap-8 lg:grid-cols-3">
           <div className="lg:col-span-2 space-y-8">
              <div className="aspect-video rounded-[40px] bg-black border-4 border-white/5 relative overflow-hidden group">
                 <img src="https://picsum.photos/seed/edu/1200/800" className="w-full h-full object-cover opacity-40 group-hover:scale-105 transition-transform duration-1000" />
                 <div className="absolute inset-0 flex items-center justify-center">
                    <div className="h-24 w-24 rounded-full bg-primary flex items-center justify-center shadow-3xl shadow-primary/40 cursor-pointer hover:scale-110 transition-transform">
                       <Play className="h-10 w-10 fill-white" />
                    </div>
                 </div>
                 <div className="absolute bottom-10 left-10 right-10">
                    <Badge className="bg-red-500 text-white border-none font-black italic mb-4">LIVE NOW</Badge>
                    <h2 className="text-3xl font-black italic uppercase">Aula 04: Estratégias Avançadas de Vendas</h2>
                    <p className="text-slate-400 font-medium mt-2">Prof. Ricardo Oliveira • 1.2k Alunos assistindo</p>
                 </div>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                 {[
                   { icon: BookOpen, label: "Materiais PDF", count: "12" },
                   { icon: MessageSquare, label: "Fórum Ativo", count: "42" },
                   { icon: Award, label: "Certificados", count: "02" },
                 ].map((item, i) => (
                   <Card key={i} className="bg-white/5 border-none rounded-[30px] p-6 hover:bg-white/10 transition-colors">
                      <item.icon className="h-8 w-8 text-primary mb-4" />
                      <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest">{item.label}</p>
                      <p className="text-2xl font-black italic mt-1">{item.count}</p>
                   </Card>
                 ))}
              </div>
           </div>

           <div className="space-y-8">
              <Card className="bg-white/5 border-none rounded-[40px] p-8">
                 <CardTitle className="text-xl font-black italic mb-6">Trilha de Conhecimento</CardTitle>
                 <div className="space-y-6">
                    {[
                      { title: "Introdução ao Mercado", progress: 100, status: "Done" },
                      { title: "Arquitetura SaaS", progress: 65, status: "Doing" },
                      { title: "IA & Automação", progress: 0, status: "Locked" },
                    ].map((step, i) => (
                      <div key={i} className="space-y-2">
                         <div className="flex justify-between items-center text-[10px] font-black uppercase">
                            <span className={step.status === 'Locked' ? 'text-slate-600' : 'text-slate-300'}>{step.title}</span>
                            <span className="text-primary">{step.progress}%</span>
                         </div>
                         <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full bg-primary rounded-full" style={{width: `${step.progress}%`}}></div>
                         </div>
                      </div>
                    ))}
                 </div>
              </Card>

              <Card className="bg-primary rounded-[40px] p-8 text-white relative overflow-hidden">
                 <div className="relative z-10 space-y-4">
                    <Zap className="h-10 w-10 text-white" />
                    <h3 className="text-xl font-black italic uppercase">Upsell IA</h3>
                    <p className="text-xs font-bold opacity-80 leading-relaxed italic">"Baseado no seu progresso, sugerimos o curso de 'Liderança Exponencial' para dobrar seus ganhos."</p>
                    <Button className="w-full bg-white text-primary font-black italic rounded-2xl h-12">Ver Oferta VIP</Button>
                 </div>
                 <Star className="absolute -bottom-10 -right-10 h-40 w-40 opacity-10" />
              </Card>
           </div>
        </div>
      </main>
    </div>
  );
}
