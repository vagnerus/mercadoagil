
"use client";

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users, Plus, LayoutDashboard, ShoppingBag, List, Settings, Package, ShieldCheck, Mail, Trash2, Edit2 } from "lucide-react";
import Link from 'next/link';
import { MOCK_STAFF } from "@/lib/mock-data";

export default function MerchantStaff({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = React.use(params);

  return (
    <div className="flex min-h-screen bg-slate-50 font-body">
      <aside className="w-64 border-r bg-white hidden lg:flex flex-col">
        <div className="p-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-accent p-1.5 rounded-lg shadow-sm">
              <Package className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-lg text-slate-800 tracking-tight">Painel Lojista</span>
          </Link>
        </div>
        <nav className="flex-1 px-4 space-y-2">
          <Link href={`/merchant/${slug}/dashboard`} className="flex items-center gap-3 px-4 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors font-medium">
            <LayoutDashboard className="h-5 w-5" /> Dashboard
          </Link>
          <Link href={`/merchant/${slug}/staff`} className="flex items-center gap-3 px-4 py-2.5 bg-accent/10 text-accent rounded-xl font-bold">
            <Users className="h-5 w-5" /> Equipe
          </Link>
          <Link href={`/merchant/${slug}/catalog`} className="flex items-center gap-3 px-4 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors font-medium">
            <List className="h-5 w-5" /> Catálogo
          </Link>
          <Link href={`/merchant/${slug}/settings`} className="flex items-center gap-3 px-4 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors font-medium">
            <Settings className="h-5 w-5" /> Configurações
          </Link>
        </nav>
      </aside>

      <main className="flex-1 p-8">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tighter italic">Gestão de Equipe</h1>
            <p className="text-slate-500 font-medium">Controle de acessos e permissões dos seus colaboradores.</p>
          </div>
          <Button className="bg-slate-900 rounded-2xl h-12 gap-2 shadow-xl shadow-slate-200 font-bold">
            <Plus className="h-5 w-5" /> Novo Integrante
          </Button>
        </header>

        <div className="grid gap-6 md:grid-cols-3 mb-8">
           <Card className="border-none shadow-sm rounded-[32px] p-6 bg-blue-50/50">
              <p className="text-[10px] font-black uppercase text-blue-600 tracking-widest mb-1">Total de Membros</p>
              <p className="text-3xl font-black italic text-slate-900">12</p>
           </Card>
           <Card className="border-none shadow-sm rounded-[32px] p-6 bg-green-50/50">
              <p className="text-[10px] font-black uppercase text-green-600 tracking-widest mb-1">Cozinha Ativa</p>
              <p className="text-3xl font-black italic text-slate-900">4 Chefs</p>
           </Card>
           <Card className="border-none shadow-sm rounded-[32px] p-6 bg-purple-50/50">
              <p className="text-[10px] font-black uppercase text-purple-600 tracking-widest mb-1">Acessos Manager</p>
              <p className="text-3xl font-black italic text-slate-900">2</p>
           </Card>
        </div>

        <Card className="border-none shadow-sm rounded-[40px] overflow-hidden">
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-slate-50/50">
                <TableRow>
                  <TableHead className="px-8 h-16 font-black uppercase text-[10px] tracking-widest">Colaborador</TableHead>
                  <TableHead className="h-16 font-black uppercase text-[10px] tracking-widest">Cargo</TableHead>
                  <TableHead className="h-16 font-black uppercase text-[10px] tracking-widest">Email</TableHead>
                  <TableHead className="text-right px-8 h-16 font-black uppercase text-[10px] tracking-widest">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {MOCK_STAFF.map((member) => (
                  <TableRow key={member.id} className="hover:bg-slate-50 transition-colors">
                    <TableCell className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-12 w-12 rounded-2xl shadow-sm border-2 border-white">
                          <AvatarImage src={member.avatar} />
                          <AvatarFallback>{member.name[0]}</AvatarFallback>
                        </Avatar>
                        <span className="font-black text-slate-900">{member.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={`rounded-full px-4 py-1 font-black text-[9px] uppercase border-none ${
                        member.role === 'Chef' ? 'bg-orange-100 text-orange-700' :
                        member.role === 'Manager' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {member.role}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-slate-400 font-bold text-sm">
                      {member.email}
                    </TableCell>
                    <TableCell className="text-right px-8">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" className="rounded-2xl hover:bg-slate-200"><Edit2 className="h-4 w-4 text-slate-400" /></Button>
                        <Button variant="ghost" size="icon" className="rounded-2xl text-red-500 hover:bg-red-50"><Trash2 className="h-4 w-4" /></Button>
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
