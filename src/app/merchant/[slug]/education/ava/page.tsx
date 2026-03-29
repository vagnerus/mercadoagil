
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
  ShoppingBag, CheckCircle2, TrendingUp, ChevronRight, Info, BookMarked,
  Menu, Settings, LogOut, Scissors, Stethoscope, Video, ClipboardList, Wallet,
  Calendar
} from "lucide-react";
import Link from 'next/link';
import { COURSE_LIBRARY } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where, limit } from 'firebase/firestore';

const CATEGORIES = ["Todos", "Varejo", "Beleza", "Gestão", "Marketing", "Saúde", "Tecnologia"];

export default function EducationAVA({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = React.use(params);
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const { toast } = useToast();
  const db = useFirestore();

  const merchantQuery = useMemoFirebase(() => query(
    collection(db, 'merchants'), 
    where('slug', '==', slug),
    limit(1)
  ), [db, slug]);
  const { data: merchantData } = useCollection(merchantQuery);
  const merchant = merchantData?.[0];
  const segment = merchant?.segment || 'RETAIL';

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

  const NavLinks = ({ mobile = false }: { mobile?: boolean }) => (
    <div className={mobile ? "space-y-2" : "flex-1 px-4 space-y-2 overflow-y-auto no-scrollbar"}>
      <Link href={`/merchant/${slug}/dashboard`} className="flex items-center gap-3 px-4 py-2.5 text-slate-400 hover:bg-white/5 rounded-xl transition-colors font-medium">
        <LayoutDashboard className="h-5 w-5" /> Dashboard
      </Link>
      
      {segment === 'BEAUTY' && (
        <>
          <Link href={`/merchant/${slug}/appointments`} className="flex items-center gap-3 px-4 py-2.5 text-slate-400 hover:bg-white/5 rounded-xl font-medium"><Calendar className="h-5 w-5" /> Agenda Digital</Link>
          <Link href={`/merchant/${slug}/staff`} className="flex items-center gap-3 px-4 py-2.5 text-slate-400 hover:bg-white/5 rounded-xl font-medium"><Users className="h-5 w-5" /> Equipe de Estilo</Link>
        </>
      )}

      {segment === 'HEALTH' && (
        <>
          <Link href={`/merchant/${slug}/health/pep`} className="flex items-center gap-3 px-4 py-2.5 text-slate-400 hover:bg-white/5 rounded-xl font-medium"><ClipboardList className="h-5 w-5" /> Prontuários (PEP)</Link>
        </>
      )}

      <Link href={`/merchant/${slug}/education/ava`} className="flex items-center gap-3 px-4 py-2.5 bg-primary/10 text-primary rounded-xl font-bold"><Monitor className="h-5 w-5" /> Ágil Academy</Link>
      <Link href={`/merchant/${slug}/settings`} className="flex items-center gap-3 px-4 py-2.5 text-slate-400 hover:bg-white/5 rounded-xl transition-colors font-medium"><Settings className="h-5 w-5" /> Configurações</Link>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-slate-900 text-white font-body overflow-x-hidden">
      <aside className="w-64 border-r border-white/10 bg-black hidden lg:flex flex-col sticky top-0 h-screen shrink-0">
        <div className="p-6">
          <Link href="/" className="flex items-center gap-2 font-black text-xl italic tracking-tighter text-primary uppercase">MERCADO ÁGIL</Link>
        </div>
        <nav className="flex-1 overflow-hidden">
          <NavLinks />
        </nav>
        <div className="p-4 border-t border-white/10">
          <Button variant="ghost" className="w-full justify-start text-slate-500 gap-2 hover:text-white" asChild><Link href="/login"><LogOut className="h-4 w-4" /> Sair</Link></Button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto p-4 lg:p-8">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div className="flex items-center gap-4 w-full">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="lg:hidden rounded-xl border-white/10 bg-white/5 text-white">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72 p-0 border-none bg-slate-950 text-white">
                <SheetHeader className="p-6 border-b border-white/10 text-left">
                  <SheetTitle className="flex items-center gap-2 font-black text-xl italic tracking-tighter text-primary uppercase">
                    MERCADO ÁGIL
                  </SheetTitle>
                </SheetHeader>
                <div className="p-4 h-full flex flex-col">
                  <NavLinks mobile />
                  <div className="mt-auto pt-4 border-t border-white/10">
                    <Button variant="ghost" className="w-full justify-start text-slate-500 gap-2 hover:text-white" asChild><Link href="/login"><LogOut className="h-4 w-4" /> Sair</Link></Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
            <div>
              <div className="flex items-center gap-2 mb-2">
                 <Badge className="bg-green-500 text-white border-none font-black italic px-3 py-1 rounded-full text-[10px]">PREMIUM LIBERADO</Badge>
                 <Badge className="bg-primary/20 text-primary border-none font-black text-[10px] hidden sm:flex">1.000 CURSOS</Badge>
              </div>
              <h1 className="text-2xl sm:text-4xl font-black tracking-tighter italic uppercase text-white">Ágil Academy <span className="text-primary not-italic">ELITE</span></h1>
            </div>
          </div>
          <div className="flex gap-3 w-full md:w-auto">
             <div className="relative flex-1 md:w-80">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <Input 
                  placeholder="O que aprender hoje?" 
                  className="bg-white/5 border-white/10 rounded-2xl h-12 pl-12 text-white font-bold"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
             </div>
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

        {/* Course Grid */}
        <div className="space-y-12">
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredCourses.slice(0, 100).map((course) => ( 
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
        </div>

        {/* Course Details Modal */}
        <Dialog open={!!selectedCourse} onOpenChange={() => setSelectedCourse(null)}>
           <DialogContent className="sm:max-w-3xl bg-slate-950 border-white/10 p-0 overflow-hidden text-white rounded-[40px]">
              <DialogHeader className="p-8 pb-0">
                <DialogTitle className="text-2xl font-black italic uppercase tracking-tighter text-white">
                  {selectedCourse?.title || "Detalhes do Curso"}
                </DialogTitle>
                <DialogDescription className="text-slate-400">
                  Visualize a ementa e inicie seu treinamento profissional de elite.
                </DialogDescription>
              </DialogHeader>
              {selectedCourse && (
                <div className="flex flex-col">
                   <div className="aspect-video w-full relative">
                      <img src={selectedCourse.thumb} className="w-full h-full object-cover opacity-50" />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent"></div>
                      <div className="absolute bottom-8 left-8 right-8">
                         <Badge className="bg-primary text-white border-none font-black italic mb-4 uppercase text-[10px]">{selectedCourse.category}</Badge>
                         <h2 className="text-2xl sm:text-4xl font-black italic uppercase tracking-tighter">{selectedCourse.title}</h2>
                      </div>
                   </div>
                   <div className="p-8 space-y-8 max-h-[50vh] overflow-y-auto no-scrollbar">
                      <div className="grid grid-cols-3 gap-4">
                         <div className="bg-white/5 p-4 rounded-3xl border border-white/5 text-center">
                            <p className="text-[10px] font-black text-slate-500 uppercase">Carga</p>
                            <p className="text-sm sm:text-lg font-black italic text-primary">{selectedCourse.duration}</p>
                         </div>
                         <div className="bg-white/5 p-4 rounded-3xl border border-white/5 text-center">
                            <p className="text-[10px] font-black text-slate-500 uppercase">Aulas</p>
                            <p className="text-sm sm:text-lg font-black italic text-primary">{selectedCourse.lessons}</p>
                         </div>
                         <div className="bg-white/5 p-4 rounded-3xl border border-white/5 text-center">
                            <p className="text-[10px] font-black text-slate-500 uppercase">Nota</p>
                            <p className="text-sm sm:text-lg font-black italic text-primary">{selectedCourse.rating}</p>
                         </div>
                      </div>

                      <div className="space-y-4">
                         <h3 className="text-xl font-black italic uppercase tracking-tighter flex items-center gap-2">
                            <Info className="h-5 w-5 text-primary" /> Ementa
                         </h3>
                         <p className="text-slate-400 font-medium leading-relaxed italic text-sm">{selectedCourse.description}</p>
                      </div>

                      <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6">
                         <div className="space-y-1 text-center sm:text-left">
                            <p className="text-[10px] font-black text-slate-500 uppercase">Disponibilidade</p>
                            <p className="text-2xl font-black italic text-green-500 uppercase">ACESSO IMEDIATO</p>
                         </div>
                         <Button onClick={() => handleStartCourse(selectedCourse.id)} className="w-full sm:w-auto h-16 px-12 rounded-3xl bg-primary hover:bg-primary/90 text-white font-black italic text-xl shadow-2xl shadow-primary/20 gap-3">
                            <PlayCircle className="h-6 w-6" /> INICIAR
                         </Button>
                      </div>
                   </div>
                </div>
              )}
           </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}
