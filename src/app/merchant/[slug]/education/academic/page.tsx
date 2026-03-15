
"use client";

import * as React from 'react';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  GraduationCap, Users, BookOpen, FileText, 
  Plus, Search, Award, CheckCircle2, 
  Clock, LayoutDashboard, Monitor, Settings, Loader2
} from "lucide-react";
import Link from 'next/link';
import { useToast } from "@/hooks/use-toast";

const students = [
  { id: 's1', name: 'Lucas Silva', class: 'Turma A - Manhã', status: 'Ativo', grade: 8.5, attendance: '92%' },
  { id: 's2', name: 'Julia Costa', class: 'Turma A - Manhã', status: 'Ativo', grade: 9.2, attendance: '98%' },
  { id: 's3', name: 'Marcos Souza', class: 'Turma B - Noite', status: 'Inadimplente', grade: 6.0, attendance: '75%' },
];

export default function EducationAcademic({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = React.use(params);
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleGenerateCertificate = (student: string) => {
    toast({ title: "Certificado Gerado", description: `Documento para ${student} enviado ao e-mail.` });
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-body">
      <aside className="w-64 border-r bg-white hidden lg:flex flex-col sticky top-0 h-screen">
        <div className="p-6">
          <Link href={`/merchant/${slug}/dashboard`} className="flex items-center gap-2 font-black text-xl italic tracking-tighter text-primary uppercase">MERCADO ÁGIL</Link>
        </div>
        <nav className="flex-1 px-4 space-y-2">
          <Link href={`/merchant/${slug}/dashboard`} className="flex items-center gap-3 px-4 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors font-medium"><LayoutDashboard className="h-5 w-5" /> Dashboard</Link>
          <Link href={`/merchant/${slug}/education/academic`} className="flex items-center gap-3 px-4 py-2.5 bg-primary/10 text-primary rounded-xl font-bold"><GraduationCap className="h-5 w-5" /> Acadêmico</Link>
          <Link href={`/merchant/${slug}/education/ava`} className="flex items-center gap-3 px-4 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors font-medium"><Monitor className="h-5 w-5" /> Ambiente (AVA)</Link>
        </nav>
      </aside>

      <main className="flex-1 p-8">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tighter italic uppercase">Gestão Acadêmica</h1>
            <p className="text-slate-500 font-medium">Turmas, diário de classe e controle pedagógico.</p>
          </div>
          <Button className="bg-slate-900 rounded-2xl h-12 gap-2 font-black italic shadow-xl shadow-slate-200 px-8 text-white">
            <Plus className="h-5 w-5" /> Nova Turma / Aluno
          </Button>
        </header>

        <div className="grid gap-6 md:grid-cols-4 mb-10">
           <Card className="border-none shadow-sm p-6 rounded-[32px] bg-white">
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Alunos Ativos</p>
              <p className="text-3xl font-black italic mt-2 text-slate-900">542</p>
           </Card>
           <Card className="border-none shadow-sm p-6 rounded-[32px] bg-primary text-white">
              <p className="text-[10px] font-black uppercase tracking-widest opacity-80">Média Global</p>
              <p className="text-3xl font-black italic mt-2">8.4</p>
           </Card>
           <Card className="border-none shadow-sm p-6 rounded-[32px] bg-white">
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Frequência</p>
              <p className="text-3xl font-black italic mt-2 text-green-600">94%</p>
           </Card>
           <Card className="border-none shadow-sm p-6 rounded-[32px] bg-slate-900 text-white">
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Certificados</p>
              <p className="text-3xl font-black italic mt-2 text-primary">128</p>
           </Card>
        </div>

        <Card className="border-none shadow-sm rounded-[40px] overflow-hidden bg-white">
          <CardHeader className="p-8 border-b bg-slate-50/50 flex flex-row items-center justify-between">
            <div className="flex items-center gap-4">
               <CardTitle className="text-xl font-black italic">Diário de Classe Digital</CardTitle>
               <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input placeholder="Buscar por Aluno ou Turma..." className="pl-10 h-12 w-80 rounded-2xl bg-white border-none shadow-sm font-medium" />
               </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-slate-50/30">
                <TableRow>
                  <TableHead className="px-8 h-16 font-black uppercase text-[10px] tracking-widest">Aluno / Matrícula</TableHead>
                  <TableHead className="h-16 font-black uppercase text-[10px] tracking-widest">Turma Atual</TableHead>
                  <TableHead className="h-16 font-black uppercase text-[10px] tracking-widest text-center">Frequência</TableHead>
                  <TableHead className="h-16 font-black uppercase text-[10px] tracking-widest text-center">Nota Média</TableHead>
                  <TableHead className="text-right px-8 h-16 font-black uppercase text-[10px] tracking-widest">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.map((s) => (
                  <TableRow key={s.id} className="hover:bg-slate-50 transition-colors">
                    <TableCell className="px-8 py-6">
                       <div className="flex items-center gap-4">
                          <div className="h-12 w-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400">
                             <Users className="h-6 w-6" />
                          </div>
                          <div className="flex flex-col">
                             <span className="font-black text-slate-900 text-base italic uppercase">{s.name}</span>
                             <span className="text-[9px] font-bold text-slate-400 uppercase">MAT: #{s.id.toUpperCase()}</span>
                          </div>
                       </div>
                    </TableCell>
                    <TableCell className="font-bold text-slate-600 italic">{s.class}</TableCell>
                    <TableCell className="text-center font-black text-slate-900">{s.attendance}</TableCell>
                    <TableCell className="text-center">
                       <Badge className={`rounded-lg border-none px-3 font-black text-[9px] uppercase ${
                         s.grade >= 7 ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'
                       }`}>
                          {s.grade.toFixed(1)}
                       </Badge>
                    </TableCell>
                    <TableCell className="text-right px-8">
                       <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" className="rounded-xl text-primary" onClick={() => handleGenerateCertificate(s.name)}><Award className="h-4 w-4" /></Button>
                          <Button variant="ghost" size="icon" className="rounded-xl text-slate-400"><FileText className="h-4 w-4" /></Button>
                       </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
