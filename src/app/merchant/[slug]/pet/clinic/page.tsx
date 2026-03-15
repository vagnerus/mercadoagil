
"use client";

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Dog, HeartPulse, Search, Plus, Calendar, 
  Users, Activity, ClipboardList, ShieldAlert,
  LayoutDashboard, ShoppingBag
} from "lucide-react";
import Link from 'next/link';

const pets = [
  { id: 'pet1', name: 'Thor', species: 'Cão - Golden', owner: 'João Silva', vaccine: '12/12/2024', status: 'Saudável' },
  { id: 'pet2', name: 'Luna', species: 'Gato - Persa', owner: 'Maria Santos', vaccine: 'Expired', status: 'Internada' },
  { id: 'pet3', name: 'Bidu', species: 'Cão - Poodle', owner: 'Ricardo O.', vaccine: '15/11/2024', status: 'Pós-Op' },
];

export default function PetClinic({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = React.use(params);

  return (
    <div className="flex min-h-screen bg-slate-50 font-body">
      <aside className="w-64 border-r bg-white hidden lg:flex flex-col sticky top-0 h-screen">
        <div className="p-6">
          <Link href={`/merchant/${slug}/dashboard`} className="flex items-center gap-2 font-black text-xl italic tracking-tighter text-primary uppercase">MERCADO ÁGIL</Link>
        </div>
        <nav className="flex-1 px-4 space-y-2">
          <Link href={`/merchant/${slug}/dashboard`} className="flex items-center gap-3 px-4 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors font-medium"><LayoutDashboard className="h-5 w-5" /> Dashboard</Link>
          <Link href={`/merchant/${slug}/pet/clinic`} className="flex items-center gap-3 px-4 py-2.5 bg-primary/10 text-primary rounded-xl font-bold"><HeartPulse className="h-5 w-5" /> Clínica Vet</Link>
          <Link href={`/merchant/${slug}/appointments`} className="flex items-center gap-3 px-4 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors font-medium"><Dog className="h-5 w-5" /> Banho & Tosa</Link>
        </nav>
      </aside>

      <main className="flex-1 p-8">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tighter italic uppercase">Gestão Clínica Veterinária</h1>
            <p className="text-slate-500 font-medium">Prontuário animal, vacinas e monitoramento de internação.</p>
          </div>
          <Button className="bg-primary rounded-2xl h-12 gap-2 font-black italic shadow-xl shadow-primary/20 px-8 text-white">
            <Plus className="h-5 w-5" /> Nova Admissão
          </Button>
        </header>

        <div className="grid gap-6 md:grid-cols-4 mb-10">
           <Card className="border-none shadow-sm p-6 rounded-[32px] bg-red-500 text-white relative overflow-hidden">
              <p className="text-[10px] font-black uppercase tracking-widest opacity-80">Internação Crítica</p>
              <p className="text-4xl font-black italic mt-2">02 Pets</p>
              <ShieldAlert className="absolute -bottom-4 -right-4 h-24 w-24 opacity-10" />
           </Card>
           <Card className="border-none shadow-sm p-6 rounded-[32px] bg-white">
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Vacinas p/ Vencer</p>
              <p className="text-3xl font-black italic mt-2 text-slate-900">45 Alertas</p>
           </Card>
           <Card className="border-none shadow-sm p-6 rounded-[32px] bg-white">
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Atendimentos Vet</p>
              <p className="text-3xl font-black italic mt-2 text-primary">12 Hoje</p>
           </Card>
           <Card className="border-none shadow-sm p-6 rounded-[32px] bg-slate-900 text-white">
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Faturamento Vet</p>
              <p className="text-3xl font-black italic mt-2 text-primary">R$ 4.250</p>
           </Card>
        </div>

        <Card className="border-none shadow-sm rounded-[40px] overflow-hidden bg-white">
          <CardHeader className="p-8 border-b bg-slate-50/50 flex flex-row items-center justify-between">
            <div className="flex items-center gap-4">
               <CardTitle className="text-xl font-black italic">Pacientes Pet</CardTitle>
               <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input placeholder="Nome do Pet, Tutor ou Microchip..." className="pl-10 h-12 w-80 rounded-2xl bg-white border-none shadow-sm font-medium" />
               </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-slate-50/30">
                <TableRow>
                  <TableHead className="px-8 h-16 font-black uppercase text-[10px] tracking-widest">Pet / Espécie</TableHead>
                  <TableHead className="h-16 font-black uppercase text-[10px] tracking-widest">Tutor</TableHead>
                  <TableHead className="h-16 font-black uppercase text-[10px] tracking-widest">Vacina (V10/Raiva)</TableHead>
                  <TableHead className="h-16 font-black uppercase text-[10px] tracking-widest text-center">Estado</TableHead>
                  <TableHead className="text-right px-8 h-16 font-black uppercase text-[10px] tracking-widest">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pets.map((p) => (
                  <TableRow key={p.id} className="hover:bg-slate-50 transition-colors">
                    <TableCell className="px-8 py-6">
                       <div className="flex items-center gap-4">
                          <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                             <Dog className="h-6 w-6" />
                          </div>
                          <div className="flex flex-col">
                             <span className="font-black text-slate-900 text-base italic uppercase">{p.name}</span>
                             <span className="text-[9px] font-bold text-slate-400 uppercase">{p.species}</span>
                          </div>
                       </div>
                    </TableCell>
                    <TableCell className="font-bold text-slate-600">{p.owner}</TableCell>
                    <TableCell>
                       <Badge className={`rounded-lg border-none px-3 font-black text-[9px] uppercase ${p.vaccine === 'Expired' ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-600'}`}>
                          {p.vaccine}
                       </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                       <Badge className={`rounded-lg border-none px-3 font-black text-[9px] uppercase ${
                         p.status === 'Internada' ? 'bg-red-500 text-white' : 
                         p.status === 'Saudável' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'
                       }`}>
                          {p.status}
                       </Badge>
                    </TableCell>
                    <TableCell className="text-right px-8">
                       <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" className="rounded-xl text-primary"><ClipboardList className="h-4 w-4" /></Button>
                          <Button variant="ghost" size="icon" className="rounded-xl text-slate-400"><Activity className="h-4 w-4" /></Button>
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
