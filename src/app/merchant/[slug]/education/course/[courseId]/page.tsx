
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
    window.open(material.url, '_blank');
    toast({ title: "Download Iniciado", description: `Baixando ${material.title}...` });
  };

  if (!course || !currentLesson) return null;

  return (
    <div className="flex h-screen bg-slate-950 text-white font-body overflow-hidden">
      {/* Sidebar de Conteúdo */}
      <aside className="w-80 border-r border-white/10 bg-slate-900 flex flex-col h-full shrink-0">
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
          <div className="p-6 bg-primary/10 border-t border-primary/20">
             <Button className="w-full bg-primary hover:bg-primary/90 rounded-xl h-12 font-black italic gap-2 text-white">
                <Award className="h-5 w-5" /> EMITIR CERTIFICADO
             </Button>
          </div>
        )}
      </aside>

      {/* Player Principal */}
      <main className="flex-1 flex flex-col h-full bg-black overflow-y-auto no-scrollbar">
         <div className="aspect-video w-full bg-slate-900 relative group overflow-hidden">
            <video 
              key={currentLesson.id} // Chave única força o reload do elemento de vídeo
              className="w-full h-full object-contain"
              controls
              autoPlay
            >
               <source src={currentLesson.videoUrl} type="video/mp4" />
               Seu navegador não suporta vídeos.
            </video>
            <div className="absolute top-6 left-6 opacity-0 group-hover:opacity-100 transition-opacity">
               <Badge className="bg-primary text-white border-none font-black italic py-2 px-4 rounded-xl text-xs uppercase">AULA ATIVA: {currentLesson.title}</Badge>
            </div>
         </div>

         <div className="p-8 lg:p-12 max-w-5xl">
            <header className="flex flex-col md:flex-row justify-between items-start mb-12 gap-6">
               <div className="space-y-2">
                  <Badge className="bg-primary/20 text-primary border-none font-black italic text-[10px] uppercase px-3 py-1">{course.category}</Badge>
                  <h1 className="text-4xl font-black italic uppercase tracking-tighter leading-none">{currentLesson.title}</h1>
                  <p className="text-slate-500 font-medium italic">Faz parte do curso: {course.title}</p>
               </div>
               <Button 
                onClick={() => toggleLessonComplete(currentLesson.id)}
                variant={completedLessons.includes(currentLesson.id) ? "outline" : "default"}
                className={cn(
                  "h-14 rounded-2xl px-10 font-black italic gap-2 transition-all shrink-0",
                  completedLessons.includes(currentLesson.id) ? "border-green-500 text-green-500 hover:bg-green-500/10" : "bg-white text-slate-950 hover:bg-slate-100"
                )}
               >
                  {completedLessons.includes(currentLesson.id) ? <CheckCircle2 className="h-5 w-5" /> : <PlayCircle className="h-5 w-5" />}
                  {completedLessons.includes(currentLesson.id) ? "AULA CONCLUÍDA" : "CONCLUIR AULA"}
               </Button>
            </header>

            <Tabs defaultValue="overview" className="space-y-8">
               <TabsList className="bg-white/5 border border-white/10 p-1 rounded-2xl h-auto flex overflow-x-auto no-scrollbar">
                  <TabsTrigger value="overview" className="rounded-xl py-3 px-8 font-black italic text-xs uppercase whitespace-nowrap"><Info className="h-4 w-4 mr-2" /> Visão Geral</TabsTrigger>
                  <TabsTrigger value="materials" className="rounded-xl py-3 px-8 font-black italic text-xs uppercase whitespace-nowrap"><FileText className="h-4 w-4 mr-2" /> Materiais de Apoio</TabsTrigger>
                  <TabsTrigger value="comments" className="rounded-xl py-3 px-8 font-black italic text-xs uppercase whitespace-nowrap"><MessageSquare className="h-4 w-4 mr-2" /> Comentários</TabsTrigger>
                  <TabsTrigger value="quiz" className="rounded-xl py-3 px-8 font-black italic text-xs uppercase whitespace-nowrap"><HelpCircle className="h-4 w-4 mr-2" /> Desafio IA</TabsTrigger>
               </TabsList>

               <TabsContent value="overview" className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 outline-none">
                  <div className="prose prose-invert max-w-none">
                     <h3 className="text-2xl font-black italic uppercase text-white mb-4">Sobre esta lição</h3>
                     <p className="text-slate-400 text-lg leading-relaxed italic">{course.description}</p>
                  </div>
                  <div className="grid md:grid-cols-2 gap-6 pt-8 border-t border-white/5">
                     <Card className="bg-white/5 border-none p-6 rounded-[35px] relative overflow-hidden">
                        <Sparkles className="absolute -bottom-4 -right-4 h-24 w-24 opacity-5 text-primary" />
                        <h4 className="text-xs font-black text-primary uppercase mb-4 tracking-widest">Dica do Tutor</h4>
                        <p className="text-sm font-bold text-slate-300 italic leading-relaxed">"Não pule as etapas práticas. A configuração correta do ecossistema é o segredo para vender mais no automático e garantir a escalabilidade do seu negócio."</p>
                     </Card>
                     <Card className="bg-white/5 border-none p-6 rounded-[35px]">
                        <h4 className="text-xs font-black text-slate-500 uppercase mb-4 tracking-widest">Tempo de Estudo Recomendado</h4>
                        <div className="flex items-center gap-3">
                           <Clock className="h-6 w-6 text-slate-600" />
                           <p className="text-xl font-black italic text-white uppercase">45 Minutos Intensivos</p>
                        </div>
                     </Card>
                  </div>
               </TabsContent>

               <TabsContent value="materials" className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500 outline-none">
                  <h3 className="text-2xl font-black italic uppercase text-white mb-6">Downloads e Referências Externas</h3>
                  {course.materials.map((mat: any, i: number) => (
                    <div key={i} className="flex flex-col md:flex-row items-start md:items-center justify-between p-6 bg-white/5 rounded-[30px] border border-white/5 hover:bg-white/10 transition-all gap-4">
                       <div className="flex items-center gap-4">
                          <div className="h-12 w-12 rounded-2xl bg-primary/20 flex items-center justify-center text-primary">
                             <FileText className="h-6 w-6" />
                          </div>
                          <div>
                             <p className="font-black italic uppercase text-sm">{mat.title}</p>
                             <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{mat.type} • {mat.size}</p>
                          </div>
                       </div>
                       <Button 
                        onClick={() => handleDownload(mat)}
                        variant="outline" 
                        className="w-full md:w-auto rounded-xl h-10 border-white/10 hover:bg-white hover:text-black gap-2 text-[10px] font-black uppercase"
                       >
                          <Download className="h-4 w-4" /> Baixar Arquivo
                       </Button>
                    </div>
                  ))}
               </TabsContent>

               <TabsContent value="comments" className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 outline-none">
                  <div className="space-y-6">
                     <div className="flex gap-4">
                        <div className="h-12 w-12 rounded-full bg-slate-800 shrink-0 flex items-center justify-center"><Users className="h-6 w-6 text-slate-600" /></div>
                        <div className="flex-1 space-y-4">
                           <textarea 
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Deixe sua dúvida ou comentário aqui..."
                            className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm font-medium focus:ring-primary outline-none min-h-[120px] italic text-white"
                           />
                           <div className="flex justify-end">
                              <Button onClick={handlePostComment} className="bg-primary hover:bg-primary/90 rounded-xl h-12 px-8 font-black italic gap-2 text-white transition-all">
                                 <Send className="h-4 w-4" /> ENVIAR COMENTÁRIO
                              </Button>
                           </div>
                        </div>
                     </div>

                     <div className="space-y-6 pt-10 border-t border-white/5">
                        <div className="p-6 bg-white/5 rounded-3xl border border-white/5 space-y-3">
                           <div className="flex justify-between items-center">
                              <span className="text-xs font-black text-primary uppercase italic">João Silva (Lojista Premium)</span>
                              <span className="text-[8px] font-bold text-slate-600 uppercase">Há 2 horas</span>
                           </div>
                           <p className="text-sm font-medium italic text-slate-400">"Essa estratégia de automação mudou o jogo no meu estabelecimento. Reduzi o tempo de resposta em 60%. Valeu Ágil Academy!"</p>
                        </div>
                     </div>
                  </div>
               </TabsContent>

               <TabsContent value="quiz" className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 outline-none">
                  <div className="p-12 text-center space-y-8 bg-gradient-to-br from-primary/5 to-transparent rounded-[50px] border border-primary/10">
                     <div className="h-20 w-20 bg-primary/20 rounded-[30px] flex items-center justify-center text-primary mx-auto">
                        <HelpCircle className="h-10 w-10" />
                     </div>
                     <div className="space-y-2">
                        <h3 className="text-3xl font-black italic uppercase tracking-tighter">Desafio de Fixação Pro</h3>
                        <p className="text-slate-400 font-medium italic max-w-lg mx-auto">Responda as questões geradas pela nossa IA baseadas no conteúdo exclusivo desta aula para pontuar no ranking global de lojistas.</p>
                     </div>
                     <Button className="h-16 px-12 rounded-[25px] bg-primary hover:bg-primary/90 text-white font-black italic text-lg shadow-2xl shadow-primary/20">
                        COMEÇAR DESAFIO IA
                     </Button>
                  </div>
               </TabsContent>
            </Tabs>
         </div>
      </main>
    </div>
  );
}
