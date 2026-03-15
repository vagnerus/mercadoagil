
"use client";

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Users, Plus, LayoutDashboard, List, Settings, Package, Trash2, Edit2, Star, TrendingUp, Trophy } from "lucide-react";
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
            <p className="text-slate-500 font-medium">Leaderboard de performance e produtividade.</p>
          </div>
          <Button className="bg-slate-900 rounded-2xl h-12 gap-2 shadow-xl shadow-slate-200 font-bold">
            <Plus className="h-5 w-5" /> Novo Integrante
          </Button>
        </header>

        <div className="grid gap-6 md:grid-cols-4 mb-8">
           <Card className="border-none shadow-sm rounded-[32px] p-6 bg-primary/10 border border-primary/20 flex flex-col items-center text-center">
              <Trophy className="h-8 w-8 text-primary mb-2" />
              <p className="text-[10px] font-black uppercase text-primary tracking-widest">Destaque do Mês</p>
              <p className="text-xl font-black italic text-slate-900 mt-1">Ana Gerente</p>
           </Card>
           <Card className="border-none shadow-sm rounded-[32px] p-6 bg-blue-50/50">
              <p className="text-[10px] font-black uppercase text-blue-600 tracking-widest mb-1">Média Performance</p>
              <p className="text-3xl font-black italic text-slate-900">92%</p>
           </Card>
           <Card className="border-none shadow-sm rounded-[32px] p-6 bg-green-50/50">
              <p className="text-[10px] font-black uppercase text-green-600 tracking-widest mb-1">Pedidos Atendidos</p>
              <p className="text-3xl font-black italic text-slate-900">1.960</p>
           </Card>
           <Card className="border-none shadow-sm rounded-[32px] p-6 bg-purple-50/50">
              <p className="text-[10px] font-black uppercase text-purple-600 tracking-widest mb-1">Engajamento</p>
              <p className="text-3xl font-black italic text-slate-900">Alto</p>
           </Card>
        </div>

        <Card className="border-none shadow-sm rounded-[40px] overflow-hidden">
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-slate-50/50">
                <TableRow>
                  <TableHead className="px-8 h-16 font-black uppercase text-[10px] tracking-widest">Colaborador</TableHead>
                  <TableHead className="h-16 font-black uppercase text-[10px] tracking-widest">Performance</TableHead>
                  <TableHead className="h-16 font-black uppercase text-[10px] tracking-widest text-center">Volume</TableHead>
                  <TableHead className="text-right px-8 h-16 font-black uppercase text-[10px] tracking-widest">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {MOCK_STAFF.sort((a,b) => b.performanceScore - a.performanceScore).map((member, index) => (
                  <TableRow key={member.id} className="hover:bg-slate-50 transition-colors">
                    <TableCell className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <Avatar className="h-12 w-12 rounded-2xl shadow-sm border-2 border-white">
                            <AvatarImage src={member.avatar} />
                            <AvatarFallback>{member.name[0]}</AvatarFallback>
                          </Avatar>
                          {index === 0 && (
                            <div className="absolute -top-2 -right-2 bg-yellow-400 p-1 rounded-full border-2 border-white">
                               <Star className="h-3 w-3 text-white fill-white" />
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col">
                           <span className="font-black text-slate-900">{member.name}</span>
                           <span className="text-[9px] font-black uppercase text-slate-400">{member.role}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="w-full max-w-[140px] space-y-2">
                        <div className="flex justify-between text-[10px] font-black uppercase">
                           <span>Score</span>
                           <span className="text-primary">{member.performanceScore}%</span>
                        </div>
                        <Progress value={member.performanceScore} className="h-1.5" />
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                       <Badge variant="secondary" className="font-black italic bg-slate-100 text-slate-600 rounded-lg px-3">
                          {member.ordersHandled} pedidos
                       </Badge>
                    </TableCell>
                    <TableCell className="text-right px-8">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" className="rounded-2xl hover:bg-slate-200"><TrendingUp className="h-4 w-4 text-slate-400" /></Button>
                        <Button variant="ghost" size="icon" className="rounded-2xl hover:bg-slate-200"><Edit2 className="h-4 w-4 text-slate-400" /></Button>
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
