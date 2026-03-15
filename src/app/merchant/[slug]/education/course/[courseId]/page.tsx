
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
    } else {
      router.push(`/merchant/${slug}/education/ava`);
    }
  }, [course, router, slug]);

  const toggleLessonComplete = (id: string) => {
    setCompletedLessons(prev => 
      prev.includes(id) ? prev.filter(l => l !== id) : [...prev, id]
    );
    if (!completedLessons.includes(id)) {
      toast({ title: "Aula Concluída!", description: "Continue assim para ganhar seu certificado." });
    }
  };

  const totalLessons = course?.modules.reduce((acc, m) => acc + m.lessons.length, 0) || 1;
  const progress = Math.round((completedLessons.length / totalLessons) * 100);

  const handlePostComment = () => {
    if (!comment) return;
    toast({ title: "Comentário Enviado!", description: "O instrutor responderá em breve." });
    setComment("");
  };

  const handleDownload = (material: any) => {
    try {
      const doc = new jsPDF();
      const margin = 15;
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      
      // Função Auxiliar para Cabeçalho
      const addHeader = () => {
        doc.setFillColor(37, 99, 235); // Azul Primário Ágil
        doc.rect(0, 0, 210, 40, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(24);
        doc.text("ÁGIL ACADEMY", margin, 20);
        doc.setFontSize(8);
        doc.setFont("helvetica", "normal");
        doc.text("CENTRO DE EXCELÊNCIA EM EDUCAÇÃO CORPORATIVA", margin, 28);
        doc.text(`MATERIAL OFICIAL: ${material.title.toUpperCase()}`, margin, 33);
      };

      // Função Auxiliar para Rodapé
      const addFooter = (pageNum: number, totalPages: number) => {
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.text("Este documento é propriedade do Mercado Ágil. Uso exclusivo para alunos matriculados.", margin, 285);
        doc.text(`Página ${pageNum} de ${totalPages}`, 180, 285);
      };

      addHeader();
      
      // Capa e Título
      doc.setTextColor(33, 33, 33);
      doc.setFontSize(20);
      doc.setFont("helvetica", "bold");
      doc.text(course?.title || "Curso Masterclass", margin, 60);
      
      doc.setFontSize(12);
      doc.setTextColor(100, 116, 139);
      doc.text(`Categoria: ${course?.category}`, margin, 70);
      doc.text(`Data de Emissão: ${new Date().toLocaleDateString('pt-BR')}`, margin, 77);
      
      doc.setDrawColor(230, 230, 230);
      doc.line(margin, 85, 195, 85);
      
      // Conteúdo Teórico com Paginação Automática
      doc.setTextColor(51, 65, 85);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      
      const contentText = material.content || "Conteúdo não disponível.";
      const lines = doc.splitTextToSize(contentText, 180);
      
      let y = 95;
      lines.forEach((line: string) => {
        if (y > 270) {
          doc.addPage();
          addHeader();
          y = 55;
        }
        doc.text(line, margin, y);
        y += 7;
      });

      // Seção de Anotações (Garantir que comece em nova página se estiver no fim)
      if (y > 220) {
        doc.addPage();
        addHeader();
        y = 55;
      } else {
        y += 20;
      }

      doc.setFont("helvetica", "bold");
      doc.setTextColor(37, 99, 235);
      doc.text("CADERNO DE ANOTAÇÕES DO ALUNO", margin, y);
      doc.setDrawColor(200, 200, 200);
      for(let i=1; i<=10; i++) {
        y += 12;
        doc.line(margin, y, 195, y);
      }
      
      // Adicionar rodapé em todas as páginas
      const pageCount = (doc as any).internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        addFooter(i, pageCount);
      }
      
      doc.save(`${material.title.replace(/\s+/g, '_')}_Agil_Academy.pdf`);
      toast({ title: "Manual de Estudo Gerado!", description: "O PDF multipáginas foi baixado com sucesso." });
    } catch (e) {
      console.error(e);
      toast({ title: "Erro na Geração", description: "Falha ao processar PDF institucional.", variant: "destructive" });
    }
  };

  if (!course || !currentLesson) return null;

  return (
    <div className="flex h-screen bg-slate-950 text-white font-body overflow-hidden">
      {/* Sidebar de Conteúdo */}
      <aside className="w-85 border-r border-white/10 bg-slate-900 flex flex-col h-full shrink-0 shadow-2xl">
        <div className="p-6 border-b border-white/10 space-y-4">
           <Link href={`/merchant/${slug}/education/ava`} className="text-slate-400 hover:text-white flex items-center gap-2 text-xs font-black uppercase tracking-widest transition-colors">
              <ChevronLeft className="h-4 w-4" /> Voltar ao Academy
           </Link>
           <div>
              <h2 className="text-lg font-black italic leading-tight uppercase truncate">{course.title}</h2>
              <div className="flex items-center justify-between mt-4">
                 <span className="text-[10px] font-black text-slate-500 uppercase">Seu Progresso</span>
                 <span className="text-[10px] font-black text-primary uppercase">{progress}%</span>
              </div>
              <Progress value={progress} className="h-1.5 mt-2 bg-white/5" />
           </div>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar p-2 space-y-6 pt-6">
           {course.modules.map((module, mIdx) => (
             <div key={mIdx} className="space-y-2 px-2">
                <h3 className="text-[10px] font-black uppercase text-slate-500 tracking-widest px-2 mb-2">{module.title}</h3>
                {module.lessons.map((lesson) => {
                  const isActive = lesson.id === currentLesson.id;
                  const isDone = completedLessons.includes(lesson.id);
                  return (
                    <button
                      key={lesson.id}
                      onClick={() => setCurrentLesson(lesson)}
                      className={cn(
                        "w-full p-4 rounded-2xl flex items-center gap-3 transition-all text-left group",
                        isActive ? "bg-primary text-white shadow-lg shadow-primary/20" : "hover:bg-white/5 text-slate-400"
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
                          <p className="text-[10px] opacity-60 font-bold mt-1 uppercase tracking-widest">{lesson.duration}</p>
                       </div>
                    </button>
                  );
                })}
             </div>
           ))}
        </div>

        {progress === 100 && (
          <div className="p-6 bg-primary/10 border-t border-primary/20 animate-pulse">
             <Button className="w-full bg-primary hover:bg-primary/90 rounded-xl h-12 font-black italic gap-2 text-white shadow-xl shadow-primary/20">
                <Award className="h-5 w-5" /> EMITIR CERTIFICADO
             </Button>
          </div>
        )}
      </aside>

      {/* Player Principal */}
      <main className="flex-1 flex flex-col h-full bg-black overflow-y-auto no-scrollbar pb-20">
         <div className="aspect-video w-full bg-slate-900 relative group overflow-hidden shadow-2xl">
            <video 
              key={currentLesson.id} 
              className="w-full h-full object-contain"
              controls
              autoPlay
            >
               <source src={currentLesson.videoUrl} type="video/mp4" />
               Seu navegador não suporta vídeos.
            </video>
            <div className="absolute top-6 left-6">
               <Badge className="bg-primary/80 backdrop-blur-md text-white border-none font-black italic py-2 px-4 rounded-xl text-xs uppercase">MODO ESTUDO ATIVO</Badge>
            </div>
         </div>

         <div className="p-8 lg:p-12 max-w-5xl mx-auto w-full">
            <header className="flex flex-col md:flex-row justify-between items-start mb-12 gap-6">
               <div className="space-y-2">
                  <Badge className="bg-primary/20 text-primary border-none font-black italic text-[10px] uppercase px-3 py-1">{course.category}</Badge>
                  <h1 className="text-4xl font-black italic uppercase tracking-tighter leading-none">{currentLesson.title}</h1>
                  <p className="text-slate-500 font-medium italic mt-2">Você está assistindo: {course.title}</p>
               </div>
               <Button 
                onClick={() => toggleLessonComplete(currentLesson.id)}
                variant={completedLessons.includes(currentLesson.id) ? "outline" : "default"}
                className={cn(
                  "h-14 rounded-2xl px-10 font-black italic gap-2 transition-all shrink-0 shadow-xl",
                  completedLessons.includes(currentLesson.id) ? "border-green-500 text-green-500 hover:bg-green-500/10" : "bg-white text-slate-950 hover:bg-slate-100"
                )}
               >
                  {completedLessons.includes(currentLesson.id) ? <CheckCircle2 className="h-5 w-5" /> : <PlayCircle className="h-5 w-5" />}
                  {completedLessons.includes(currentLesson.id) ? "AULA CONCLUÍDA" : "CONCLUIR ESTA AULA"}
               </Button>
            </header>

            <Tabs defaultValue="overview" className="space-y-10">
               <TabsList className="bg-white/5 border border-white/10 p-1 rounded-2xl h-auto flex overflow-x-auto no-scrollbar gap-1">
                  <TabsTrigger value="overview" className="rounded-xl py-3 px-8 font-black italic text-xs uppercase whitespace-nowrap"><Info className="h-4 w-4 mr-2" /> Conteúdo Teórico</TabsTrigger>
                  <TabsTrigger value="materials" className="rounded-xl py-3 px-8 font-black italic text-xs uppercase whitespace-nowrap"><FileText className="h-4 w-4 mr-2" /> Apostilas (PDF)</TabsTrigger>
                  <TabsTrigger value="comments" className="rounded-xl py-3 px-8 font-black italic text-xs uppercase whitespace-nowrap"><MessageSquare className="h-4 w-4 mr-2" /> Fórum da Aula</TabsTrigger>
                  <TabsTrigger value="quiz" className="rounded-xl py-3 px-8 font-black italic text-xs uppercase whitespace-nowrap"><HelpCircle className="h-4 w-4 mr-2" /> Quiz IA</TabsTrigger>
               </TabsList>

               <TabsContent value="overview" className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500 outline-none">
                  <div className="bg-white/5 p-10 rounded-[40px] border border-white/10 shadow-inner">
                     <h3 className="text-2xl font-black italic uppercase text-white mb-8 border-l-4 border-primary pl-6">Material de Leitura Técnica</h3>
                     <div className="prose prose-invert max-w-none">
                        <p className="text-slate-300 text-lg leading-relaxed italic whitespace-pre-wrap">
                           {currentLesson.content || course.description}
                        </p>
                     </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                     <Card className="bg-primary/5 border-primary/10 p-8 rounded-[35px] relative overflow-hidden">
                        <Sparkles className="absolute -bottom-4 -right-4 h-24 w-24 opacity-10 text-primary" />
                        <h4 className="text-xs font-black text-primary uppercase mb-4 tracking-widest">Destaque do Especialista</h4>
                        <p className="text-sm font-bold text-slate-300 italic leading-relaxed">
                           "A aplicação prática do conhecimento técnico no seu PDV ou operação é o que garantirá o retorno do seu tempo investido aqui. Não esqueça de baixar o manual PDF institucional abaixo."
                        </p>
                     </Card>
                     <Card className="bg-white/5 border-white/10 p-8 rounded-[35px]">
                        <h4 className="text-xs font-black text-slate-500 uppercase mb-4 tracking-widest">Tempo de Estudo</h4>
                        <div className="flex items-center gap-3">
                           <Clock className="h-6 w-6 text-slate-600" />
                           <p className="text-xl font-black italic text-white uppercase">{currentLesson.duration} de Vídeo + Material Teórico</p>
                        </div>
                     </Card>
                  </div>
               </TabsContent>

               <TabsContent value="materials" className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 outline-none">
                  <h3 className="text-2xl font-black italic uppercase text-white mb-6">Biblioteca de Apoio Integrada</h3>
                  <div className="grid gap-4">
                    {course.materials.map((mat: any, i: number) => (
                      <div key={i} className="flex flex-col md:flex-row items-start md:items-center justify-between p-8 bg-white/5 rounded-[35px] border border-white/5 hover:bg-primary/10 hover:border-primary/20 transition-all gap-6 group">
                         <div className="flex items-center gap-6">
                            <div className="h-16 w-16 rounded-2xl bg-primary/20 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                               <FileText className="h-8 w-8" />
                            </div>
                            <div>
                               <p className="font-black italic uppercase text-lg">{mat.title}</p>
                               <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{mat.type} • {mat.size} • GUIA DE ESTUDO MULTIPÁGINAS</p>
                            </div>
                         </div>
                         <Button 
                          onClick={() => handleDownload(mat)}
                          className="w-full md:w-auto rounded-2xl h-14 px-8 bg-white text-slate-900 hover:bg-primary hover:text-white gap-3 font-black italic uppercase text-xs shadow-xl transition-all"
                         >
                            <Download className="h-5 w-5" /> BAIXAR MANUAL INTEGRAL
                         </Button>
                      </div>
                    ))}
                  </div>
               </TabsContent>

               <TabsContent value="comments" className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 outline-none">
                  <div className="space-y-8">
                     <div className="flex gap-6">
                        <div className="h-14 w-14 rounded-2xl bg-slate-800 shrink-0 flex items-center justify-center border border-white/10 shadow-lg"><Users className="h-7 w-7 text-slate-500" /></div>
                        <div className="flex-1 space-y-4">
                           <textarea 
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Tire sua dúvida técnica ou deixe um insight sobre esta aula..."
                            className="w-full bg-white/5 border border-white/10 rounded-3xl p-6 text-sm font-medium focus:ring-2 focus:ring-primary outline-none min-h-[150px] italic text-white placeholder:text-slate-600 shadow-inner"
                           />
                           <div className="flex justify-end">
                              <Button onClick={handlePostComment} className="bg-primary hover:bg-primary/90 rounded-2xl h-14 px-10 font-black italic gap-2 text-white shadow-2xl shadow-primary/20 transition-all">
                                 <Send className="h-5 w-5" /> POSTAR NO FÓRUM
                              </Button>
                           </div>
                        </div>
                     </div>
                  </div>
               </TabsContent>

               <TabsContent value="quiz" className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 outline-none">
                  <div className="p-16 text-center space-y-10 bg-gradient-to-br from-primary/10 to-transparent rounded-[60px] border border-primary/20 shadow-2xl relative overflow-hidden">
                     <div className="h-24 w-24 bg-primary text-white rounded-[35px] flex items-center justify-center mx-auto shadow-2xl rotate-3">
                        <HelpCircle className="h-12 w-12" />
                     </div>
                     <div className="space-y-4 relative z-10">
                        <h3 className="text-4xl font-black italic uppercase tracking-tighter">Desafio de Fixação Pro</h3>
                        <p className="text-slate-400 font-medium italic max-w-xl mx-auto text-lg">Nossa IA gerou questões exclusivas baseadas no conteúdo técnico de "{course.title}" para testar seu domínio e liberar sua badge profissional.</p>
                     </div>
                     <Button className="h-16 px-14 rounded-[30px] bg-white text-primary hover:bg-primary hover:text-white font-black italic text-xl shadow-2xl transition-all">
                        INICIAR TESTE AGORA
                     </Button>
                     <Sparkles className="absolute top-10 right-10 h-20 w-20 opacity-10 animate-pulse" />
                  </div>
               </TabsContent>
            </Tabs>
         </div>
      </main>
    </div>
  );
}
