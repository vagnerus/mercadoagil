
"use client";

import * as React from 'react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  GraduationCap, Monitor, Play, BookOpen, 
  Users, MessageSquare, FileText, LayoutDashboard,
  Zap, Star, Award, Loader2, Search, Filter, PlayCircle, Clock, Sparkles,
  ShoppingBag, CheckCircle2, TrendingUp, ChevronRight, Info, BookMarked
} from "lucide-react";
import Link from 'next/link';
import { COURSE_LIBRARY } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const CATEGORIES = ["Todos", "Varejo", "Beleza", "Gestão", "Marketing", "Saúde", "Tecnologia"];

export default function EducationAVA({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = React.use(params);
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const { toast } = useToast();

  const filteredCourses = COURSE_LIBRARY.filter(course => {
    const matchesCategory = selectedCategory === "Todos" || course.category === selectedCategory;
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleStartCourse = (courseId: string) => {
    toast({
      title: "Matrícula Ativada!",
      description: `Aproveite seu treinamento gratuito exclusivo.`,
    });
    router.push(`/merchant/${slug}/education/course/${courseId}`);
  };

  return (
    <div className="flex min-h-screen bg-slate-900 text-white font-body overflow-x-hidden">
      <aside className="w-64 border-r border-white/10 bg-black hidden lg:flex flex-col sticky top-0 h-screen shrink-0">
        <div className="p-6">
          <Link href={`/merchant/${slug}/dashboard`} className="flex items-center gap-2 font-black text-xl italic tracking-tighter text-primary uppercase">MERCADO ÁGIL</Link>
        </div>
        <nav className="flex-1 px-4 space-y-2 overflow-y-auto no-scrollbar">
          <Link href={`/merchant/${slug}/dashboard`} className="flex items-center gap-3 px-4 py-2.5 text-slate-400 hover:bg-white/5 rounded-xl transition-colors font-medium"><LayoutDashboard className="h-5 w-5" /> Dashboard</Link>
          <Link href={`/merchant/${slug}/education/ava`} className="flex items-center gap-3 px-4 py-2.5 bg-primary/10 text-primary rounded-xl font-bold"><Monitor className="h-5 w-5" /> Ágil Academy</Link>
          <Link href={`/merchant/${slug}/education/academic`} className="flex items-center gap-3 px-4 py-2.5 text-slate-400 hover:bg-white/5 rounded-xl transition-colors font-medium"><BookOpen className="h-5 w-5" /> Gestão Escolar</Link>
        </nav>
      </aside>

      <main className="flex-1 overflow-y-auto p-4 lg:p-8">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-2">
               <Badge className="bg-green-500 text-white border-none font-black italic px-3 py-1 rounded-full text-[10px]">ACESSO PREMIUM LIBERADO</Badge>
               <Badge className="bg-primary/20 text-primary border-none font-black text-[10px]">1.000 CURSOS DISPONÍVEIS</Badge>
            </div>
            <h1 className="text-4xl font-black tracking-tighter italic uppercase text-white">Ágil Academy <span className="text-primary not-italic">ELITE</span></h1>
            <p className="text-slate-500 font-medium italic mt-1">A maior biblioteca de educação corporativa para lojistas.</p>
          </div>
          <div className="flex gap-3 w-full md:w-auto">
             <div className="relative flex-1 md:w-80">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <Input 
                  placeholder="O que sua equipe precisa aprender?" 
                  className="bg-white/5 border-white/10 rounded-2xl h-12 pl-12 text-white font-bold"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
             </div>
             <Button className="bg-primary rounded-2xl h-12 gap-2 font-black italic px-8 shadow-xl shadow-primary/20 hover:scale-105 transition-transform text-white">
                <TrendingUp className="h-4 w-4" /> MEU PROGRESSO
             </Button>
          </div>
        </header>

        {/* Categories Bar */}
        <div className="flex gap-3 overflow-x-auto no-scrollbar mb-12 pb-2">
           {CATEGORIES.map(cat => (
             <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={cn(
                "px-6 py-2.5 rounded-full whitespace-nowrap font-black italic text-[10px] uppercase tracking-widest transition-all",
                selectedCategory === cat ? "bg-primary text-white shadow-lg shadow-primary/30" : "bg-white/5 text-slate-500 hover:bg-white/10"
              )}
             >
               {cat}
             </button>
           ))}
        </div>

        {/* Featured Banner */}
        <div className="mb-16 aspect-[21/9] w-full rounded-[40px] relative overflow-hidden group border-4 border-white/5 shadow-2xl">
           <img src="https://picsum.photos/seed/education_hero_elite/1600/600" className="w-full h-full object-cover opacity-40 group-hover:scale-105 transition-transform duration-1000" />
           <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>
           <div className="absolute bottom-10 left-10 max-w-2xl space-y-6">
              <div className="flex gap-2">
                <Badge className="bg-primary text-white border-none font-black italic px-4 py-1.5 rounded-full text-xs">BIBLIOTECA COMPLETA</Badge>
                <Badge className="bg-white/10 text-white border-none font-black italic px-4 py-1.5 rounded-full text-xs">CONTEÚDO ESTRUTURADO</Badge>
              </div>
              <h2 className="text-5xl font-black italic uppercase tracking-tighter">Do Zero ao Próximo Nível</h2>
              <p className="text-slate-300 font-medium leading-relaxed italic text-lg">Capacite sua equipe com os 1.000 treinamentos integrados ao seu painel. Gratuito para todos os parceiros Mercado Ágil.</p>
              <div className="flex gap-4">
                 <Button className="h-14 px-10 rounded-2xl bg-white text-slate-900 font-black italic text-lg gap-3" onClick={() => handleStartCourse("c1")}>
                    <PlayCircle className="h-6 w-6" /> EXPLORAR CURSOS
                 </Button>
              </div>
           </div>
        </div>

        {/* Course Grid */}
        <div className="space-y-12">
           <div className="flex items-center justify-between">
              <h3 className="text-2xl font-black italic uppercase tracking-tighter">{selectedCategory} <span className="text-slate-600 font-bold ml-2">({filteredCourses.length})</span></h3>
              <div className="h-1 flex-1 mx-8 bg-white/5 rounded-full"></div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredCourses.slice(0, 100).map((course) => ( // Show first 100 for perf, search handles the rest
                <div key={course.id} className="group flex flex-col cursor-pointer" onClick={() => setSelectedCourse(course)}>
                   <div className="aspect-video rounded-[30px] overflow-hidden relative border-2 border-white/5 bg-slate-800 mb-4">
                      <img src={course.thumb} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                         <PlayCircle className="h-16 w-16 text-white" />
                      </div>
                      <div className="absolute top-4 left-4">
                         <Badge className="bg-green-500 text-white border-none font-black italic text-[10px]">100% LIBERADO</Badge>
                      </div>
                      <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                         <Badge className="bg-black/60 backdrop-blur-md text-white border-none font-black italic text-[8px] uppercase">{course.category}</Badge>
                         <span className="text-[10px] font-black text-white flex items-center gap-1 bg-primary/80 px-2 py-1 rounded-lg">
                            <Star className="h-3 w-3 fill-white" /> {course.rating}
                         </span>
                      </div>
                   </div>
                   <div className="space-y-3 px-2 flex-1 flex flex-col">
                      <h4 className="font-black italic text-lg leading-tight group-hover:text-primary transition-colors line-clamp-2">{course.title}</h4>
                      <div className="flex items-center gap-4 text-slate-500 font-bold text-[10px] uppercase tracking-widest">
                         <span className="flex items-center gap-1"><Play className="h-3 w-3" /> {course.lessons} Aulas</span>
                         <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {course.duration}</span>
                      </div>
                      <Button 
                        className="w-full bg-white/5 hover:bg-primary hover:text-white border border-white/10 rounded-xl h-10 font-black italic text-[10px] uppercase transition-all mt-auto group-hover:border-primary"
                      >
                        ESTUDAR AGORA
                      </Button>
                   </div>
                </div>
              ))}
           </div>

           {filteredCourses.length === 0 && (
             <div className="p-20 text-center bg-white/5 rounded-[40px] border-2 border-dashed border-white/10">
                <Monitor className="h-16 w-16 text-slate-700 mx-auto mb-6" />
                <p className="text-xl font-black italic text-slate-500 uppercase">Busca sem resultados.</p>
                <p className="text-sm text-slate-600 mt-2">Explore nossas 1.000 opções de treinamento.</p>
             </div>
           )}
        </div>

        {/* Course Details Modal */}
        <Dialog open={!!selectedCourse} onOpenChange={() => setSelectedCourse(null)}>
           <DialogContent className="sm:max-w-3xl bg-slate-950 border-white/10 p-0 overflow-hidden text-white rounded-[40px]">
              {selectedCourse && (
                <div className="flex flex-col">
                   <div className="aspect-video w-full relative">
                      <img src={selectedCourse.thumb} className="w-full h-full object-cover opacity-50" />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent"></div>
                      <div className="absolute bottom-8 left-8 right-8">
                         <Badge className="bg-primary text-white border-none font-black italic mb-4 uppercase text-[10px]">{selectedCourse.category}</Badge>
                         <h2 className="text-4xl font-black italic uppercase tracking-tighter">{selectedCourse.title}</h2>
                      </div>
                   </div>
                   <div className="p-8 space-y-8">
                      <div className="grid grid-cols-3 gap-4">
                         <div className="bg-white/5 p-4 rounded-3xl border border-white/5 text-center">
                            <p className="text-[10px] font-black text-slate-500 uppercase">Carga Horária</p>
                            <p className="text-lg font-black italic text-primary">{selectedCourse.duration}</p>
                         </div>
                         <div className="bg-white/5 p-4 rounded-3xl border border-white/5 text-center">
                            <p className="text-[10px] font-black text-slate-500 uppercase">Aulas Gravadas</p>
                            <p className="text-lg font-black italic text-primary">{selectedCourse.lessons}</p>
                         </div>
                         <div className="bg-white/5 p-4 rounded-3xl border border-white/5 text-center">
                            <p className="text-[10px] font-black text-slate-500 uppercase">Ranking</p>
                            <p className="text-lg font-black italic text-primary">{selectedCourse.rating}/5.0</p>
                         </div>
                      </div>

                      <div className="space-y-4">
                         <h3 className="text-xl font-black italic uppercase tracking-tighter flex items-center gap-2">
                            <Info className="h-5 w-5 text-primary" /> Ementa Completa
                         </h3>
                         <p className="text-slate-400 font-medium leading-relaxed italic">{selectedCourse.description}</p>
                      </div>

                      <div className="space-y-4">
                         <h3 className="text-xl font-black italic uppercase tracking-tighter">Competências que você irá adquirir:</h3>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {selectedCourse.syllabus.map((item: string, i: number) => (
                              <div key={i} className="flex items-center gap-3 bg-white/5 p-3 rounded-2xl border border-white/5">
                                 <div className="h-6 w-6 rounded-lg bg-primary/20 flex items-center justify-center text-primary font-black text-[10px] italic">{i+1}</div>
                                 <span className="text-xs font-bold text-slate-300">{item}</span>
                              </div>
                            ))}
                         </div>
                      </div>

                      <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                         <div className="space-y-1">
                            <p className="text-[10px] font-black text-slate-500 uppercase">Disponibilidade</p>
                            <p className="text-3xl font-black italic text-green-500 uppercase">ACESSO IMEDIATO</p>
                         </div>
                         <Button onClick={() => handleStartCourse(selectedCourse.id)} className="h-16 px-12 rounded-3xl bg-primary hover:bg-primary/90 text-white font-black italic text-xl shadow-2xl shadow-primary/20 gap-3">
                            <PlayCircle className="h-6 w-6" /> INICIAR TREINAMENTO
                         </Button>
                      </div>
                   </div>
                </div>
              )}
           </DialogContent>
        </Dialog>

        {/* Certification Section */}
        <section className="mt-24 pt-16 border-t border-white/5">
           <Card className="bg-primary rounded-[50px] p-12 text-white relative overflow-hidden border-none shadow-3xl shadow-primary/20">
              <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
                 <div className="space-y-8">
                    <div className="h-20 w-20 rounded-3xl bg-white/20 flex items-center justify-center">
                       <Award className="h-12 w-12 text-white" />
                    </div>
                    <h3 className="text-5xl font-black italic uppercase tracking-tighter leading-[0.9]">Treinamento de Elite Gratuito</h3>
                    <p className="text-xl font-medium opacity-80 italic leading-relaxed">No Mercado Ágil, investimos no seu crescimento. Todos os 1.000 cursos emitem certificados digitais profissionais para você e sua equipe.</p>
                    <div className="flex gap-4">
                       <Button className="h-16 px-10 rounded-2xl bg-white text-primary font-black italic text-xl shadow-2xl hover:scale-105 transition-transform">
                          VER MEU PAINEL
                       </Button>
                       <Button variant="ghost" className="h-16 px-8 rounded-2xl bg-white/10 border border-white/20 font-black italic text-white hover:bg-white/20">
                          MEUS CERTIFICADOS
                       </Button>
                    </div>
                 </div>
                 <div className="hidden lg:flex justify-end">
                    <div className="grid grid-cols-2 gap-6 rotate-3">
                       {[1,2,3,4].map(i => (
                         <div key={i} className="h-40 w-40 bg-white/10 backdrop-blur-xl border border-white/20 rounded-[30px] flex flex-col items-center justify-center gap-3">
                            <GraduationCap className="h-10 w-10 text-white/40" />
                            <div className="h-2 w-20 bg-white/20 rounded-full"></div>
                            <div className="h-2 w-12 bg-white/10 rounded-full"></div>
                         </div>
                       ))}
                    </div>
                 </div>
              </div>
              <Sparkles className="absolute -bottom-20 -right-20 h-80 w-80 opacity-10" />
           </Card>
        </section>
      </main>
    </div>
  );
}
