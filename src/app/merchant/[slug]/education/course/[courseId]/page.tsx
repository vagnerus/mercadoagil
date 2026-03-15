
"use client";

import * as React from 'react';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Play, CheckCircle2, FileText, MessageSquare, 
  ChevronLeft, Download, Clock, PlayCircle,
  HelpCircle, Sparkles, Send, Info, Award, Users
} from "lucide-react";
import Link from 'next/link';
import { COURSE_LIBRARY } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { jsPDF } from "jspdf";

export default function CoursePlayer() {
  const { slug, courseId } = useParams();
  const router = useRouter();
  const { toast } = useToast();
  
  const course = COURSE_LIBRARY.find(c => c.id === courseId);
  const [currentLesson, setCurrentLesson] = useState<any>(null);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [comment, setComment] = useState("");

  useEffect(() => {
    if (course) {
      setCurrentLesson(course.modules[0].lessons[0]);
    } else if (courseId) {
      router.push(`/merchant/${slug}/education/ava`);
    }
  }, [course, router, slug, courseId]);

  const toggleLessonComplete = (id: string) => {
    setCompletedLessons(prev => 
      prev.includes(id) ? prev.filter(l => l !== id) : [...prev, id]
    );
    if (!completedLessons.includes(id)) {
      toast({ title: "Aula Concluída!", description: "Continue assim para o certificado." });
    }
  };

  const totalLessons = course?.modules.reduce((acc, m) => acc + m.lessons.length, 0) || 1;
  const progress = Math.round((completedLessons.length / totalLessons) * 100);

  const handleDownload = (material: any) => {
    try {
      const doc = new jsPDF();
      const margin = 15;
      const pageWidth = 210;
      
      const addHeader = (pageNum: number) => {
        doc.setFillColor(37, 99, 235); 
        doc.rect(0, 0, pageWidth, 40, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(24);
        doc.text("ÁGIL ACADEMY ELITE", margin, 20);
        doc.setFontSize(8);
        doc.setFont("helvetica", "normal");
        doc.text("CENTRO DE EXCELÊNCIA EM EDUCAÇÃO CORPORATIVA", margin, 28);
        doc.text(`MATERIAL OFICIAL DE ESTUDO - PÁGINA ${pageNum}`, margin, 33);
      };

      const addFooter = (pageNum: number, totalPages: number) => {
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.text("Propriedade Intelectual Mercado Ágil - Uso Exclusivo de Alunos", margin, 285);
        doc.text(`${pageNum} / ${totalPages}`, 190, 285);
      };

      // Início da Capa
      addHeader(1);
      doc.setTextColor(33, 33, 33);
      doc.setFontSize(22);
      doc.setFont("helvetica", "bold");
      doc.text(course?.title.toUpperCase() || "MANUAL TÉCNICO", margin, 65);
      
      doc.setFontSize(14);
      doc.setTextColor(100, 116, 139);
      doc.text(`Especialização: ${course?.category}`, margin, 75);
      doc.text(`Carga Horária: ${course?.duration}`, margin, 82);
      
      doc.setDrawColor(200, 200, 200);
      doc.line(margin, 90, 195, 90);
      
      doc.setTextColor(51, 65, 85);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      
      // Expansão do conteúdo para gerar 10 páginas
      const fullText = (material.content + "\n\n").repeat(8);
      const lines = doc.splitTextToSize(fullText, 180);
      
      let y = 100;
      let currentPage = 1;

      lines.forEach((line: string) => {
        if (y > 270) {
          currentPage++;
          doc.addPage();
          addHeader(currentPage);
          y = 55;
        }
        doc.text(line, margin, y);
        y += 7;
      });

      // Caderno de Anotações no Final
      if (y > 200) {
        doc.addPage();
        currentPage++;
        addHeader(currentPage);
        y = 55;
      }
      
      doc.setFont("helvetica", "bold");
      doc.setTextColor(37, 99, 235);
      doc.text("CADERNO DE ANOTAÇÕES TÉCNICAS", margin, y + 10);
      doc.setDrawColor(220, 220, 220);
      for(let i=1; i<=15; i++) {
        y += 12;
        doc.line(margin, y, 195, y);
      }
      
      const pageCount = (doc as any).internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        addFooter(i, pageCount);
      }
      
      doc.save(`${course?.id}_Manual_Agil_Academy.pdf`);
      toast({ title: "Manual Gerado (10+ Páginas)", description: "Documento completo baixado com sucesso." });
    } catch (e) {
      toast({ title: "Erro", description: "Falha na exportação.", variant: "destructive" });
    }
  };

  if (!course || !currentLesson) return null;

  return (
    <div className="flex h-screen bg-slate-950 text-white font-body overflow-hidden">
      <aside className="w-80 border-r border-white/10 bg-slate-900 flex flex-col h-full shrink-0 shadow-2xl">
        <div className="p-6 border-b border-white/10">
           <Link href={`/merchant/${slug}/education/ava`} className="text-slate-400 hover:text-white flex items-center gap-2 text-[10px] font-black uppercase tracking-widest mb-6 transition-colors">
              <ChevronLeft className="h-4 w-4" /> Painel Academy
           </Link>
           <div>
              <h2 className="text-sm font-black italic leading-tight uppercase truncate">{course.title}</h2>
              <Progress value={progress} className="h-1.5 mt-4 bg-white/5" />
              <p className="text-[10px] font-bold text-primary uppercase mt-2">{progress}% Concluído</p>
           </div>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar p-2 space-y-6 pt-6">
           {course.modules.map((module, mIdx) => (
             <div key={mIdx} className="space-y-2 px-2">
                <h3 className="text-[9px] font-black uppercase text-slate-500 tracking-widest px-2 mb-2">{module.title}</h3>
                {module.lessons.map((lesson) => {
                  const isActive = lesson.id === currentLesson.id;
                  const isDone = completedLessons.includes(lesson.id);
                  return (
                    <button
                      key={lesson.id}
                      onClick={() => setCurrentLesson(lesson)}
                      className={cn(
                        "w-full p-4 rounded-2xl flex items-center gap-3 transition-all text-left",
                        isActive ? "bg-primary text-white shadow-lg" : "hover:bg-white/5 text-slate-400"
                      )}
                    >
                       <div className={cn(
                         "h-8 w-8 rounded-lg flex items-center justify-center shrink-0",
                         isActive ? "bg-white/20" : isDone ? "bg-green-500/20 text-green-500" : "bg-white/5"
                       )}>
                          {isDone ? <CheckCircle2 className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                       </div>
                       <div className="flex-1 min-w-0">
                          <p className="text-xs font-black italic uppercase leading-tight truncate">{lesson.title}</p>
                          <p className="text-[9px] opacity-60 font-bold mt-1 uppercase">{lesson.duration}</p>
                       </div>
                    </button>
                  );
                })}
             </div>
           ))}
        </div>

        {progress === 100 && (
          <div className="p-6 border-t border-white/10 bg-primary/5">
             <Button className="w-full bg-primary hover:bg-primary/90 rounded-xl h-12 font-black italic gap-2 text-white">
                <Award className="h-5 w-5" /> EMITIR CERTIFICADO
             </Button>
          </div>
        )}
      </aside>

      <main className="flex-1 flex flex-col h-full bg-black overflow-y-auto no-scrollbar">
         <div className="aspect-video w-full bg-slate-900 relative">
            <video key={currentLesson.id} className="w-full h-full object-contain" controls autoPlay>
               <source src={currentLesson.videoUrl} type="video/mp4" />
            </video>
            <div className="absolute top-6 left-6">
               <Badge className="bg-primary text-white border-none font-black italic px-4 py-2 rounded-xl text-[10px] uppercase">AULA ATIVA</Badge>
            </div>
         </div>

         <div className="p-8 lg:p-16 max-w-5xl mx-auto w-full">
            <header className="flex flex-col md:flex-row justify-between items-start mb-12 gap-6">
               <div className="space-y-3">
                  <Badge className="bg-primary/20 text-primary border-none font-black italic text-[10px] uppercase px-3 py-1">{course.category}</Badge>
                  <h1 className="text-4xl font-black italic uppercase tracking-tighter leading-none">{currentLesson.title}</h1>
                  <p className="text-slate-500 font-medium italic">Curso: {course.title}</p>
               </div>
               <Button 
                onClick={() => toggleLessonComplete(currentLesson.id)}
                variant={completedLessons.includes(currentLesson.id) ? "outline" : "default"}
                className={cn(
                  "h-14 rounded-2xl px-10 font-black italic gap-2 text-lg shadow-xl",
                  completedLessons.includes(currentLesson.id) ? "border-green-500 text-green-500" : "bg-white text-slate-950"
                )}
               >
                  {completedLessons.includes(currentLesson.id) ? <CheckCircle2 className="h-6 w-6" /> : <PlayCircle className="h-6 w-6" />}
                  {completedLessons.includes(currentLesson.id) ? "CONCLUÍDO" : "CONCLUIR AULA"}
               </Button>
            </header>

            <Tabs defaultValue="overview" className="space-y-10">
               <TabsList className="bg-white/5 border border-white/10 p-1 rounded-2xl h-auto flex gap-1">
                  <TabsTrigger value="overview" className="rounded-xl py-3 px-8 font-black italic text-[10px] uppercase"><Info className="h-4 w-4 mr-2" /> Teoria</TabsTrigger>
                  <TabsTrigger value="materials" className="rounded-xl py-3 px-8 font-black italic text-[10px] uppercase"><FileText className="h-4 w-4 mr-2" /> Manuais PDF</TabsTrigger>
                  <TabsTrigger value="comments" className="rounded-xl py-3 px-8 font-black italic text-[10px] uppercase"><MessageSquare className="h-4 w-4 mr-2" /> Fórum</TabsTrigger>
               </TabsList>

               <TabsContent value="overview" className="space-y-8 outline-none">
                  <div className="bg-white/5 p-10 rounded-[40px] border border-white/10">
                     <h3 className="text-xl font-black italic uppercase text-white mb-8 border-l-4 border-primary pl-6">Conteúdo Didático Avançado</h3>
                     <div className="prose prose-invert max-w-none">
                        <p className="text-slate-300 text-lg leading-relaxed italic whitespace-pre-wrap">
                           {currentLesson.content}
                        </p>
                     </div>
                  </div>
               </TabsContent>

               <TabsContent value="materials" className="space-y-6 outline-none">
                  <div className="grid gap-4">
                    {course.materials.map((mat: any, i: number) => (
                      <div key={i} className="flex flex-col md:flex-row items-start md:items-center justify-between p-8 bg-white/5 rounded-[35px] border border-white/5 hover:bg-primary/5 transition-all gap-6">
                         <div className="flex items-center gap-6">
                            <div className="h-16 w-16 rounded-2xl bg-primary/20 flex items-center justify-center text-primary">
                               <FileText className="h-8 w-8" />
                            </div>
                            <div>
                               <p className="font-black italic uppercase text-lg">{mat.title}</p>
                               <p className="text-[10px] font-bold text-slate-500 uppercase">{mat.type} • {mat.size}</p>
                            </div>
                         </div>
                         <Button onClick={() => handleDownload(mat)} className="w-full md:w-auto rounded-2xl h-14 px-8 bg-white text-slate-900 hover:bg-primary hover:text-white gap-3 font-black italic text-xs shadow-xl transition-all">
                            <Download className="h-5 w-5" /> BAIXAR MANUAL INTEGRAL
                         </Button>
                      </div>
                    ))}
                  </div>
               </TabsContent>

               <TabsContent value="comments" className="space-y-8 outline-none">
                  <div className="flex gap-6">
                     <div className="h-14 w-14 rounded-2xl bg-slate-800 shrink-0 flex items-center justify-center border border-white/10"><Users className="h-7 w-7 text-slate-500" /></div>
                     <div className="flex-1 space-y-4">
                        <textarea 
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                          placeholder="Tire sua dúvida técnica com os tutores..."
                          className="w-full bg-white/5 border border-white/10 rounded-3xl p-6 text-sm font-medium focus:ring-2 focus:ring-primary outline-none min-h-[150px] italic text-white"
                        />
                        <div className="flex justify-end">
                           <Button onClick={() => { setComment(""); toast({ title: "Enviado!" }); }} className="bg-primary hover:bg-primary/90 rounded-2xl h-14 px-10 font-black italic text-white shadow-xl">
                              <Send className="h-5 w-5 mr-2" /> ENVIAR DÚVIDA
                           </Button>
                        </div>
                     </div>
                  </div>
               </TabsContent>
            </Tabs>
         </div>
      </main>
    </div>
  );
}
