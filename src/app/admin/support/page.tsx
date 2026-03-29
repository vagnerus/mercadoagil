
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Headphones, MessageSquare, CheckCircle2, Clock, 
  ShieldCheck, LogOut, LayoutDashboard, LayoutGrid, 
  Server, Loader2, Building2, User, Mail, ExternalLink, Menu
} from "lucide-react";
import Link from 'next/link';
import { useFirestore, useCollection, updateDocumentNonBlocking, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, doc } from 'firebase/firestore';
import { useToast } from "@/hooks/use-toast";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ModeToggle } from "@/components/mode-toggle";

export default function AdminSupport() {
  const db = useFirestore();
  const { toast } = useToast();
  
  const ticketsQuery = useMemoFirebase(() => query(collection(db, 'supportTickets'), orderBy('createdAt', 'desc')), [db]);
  const { data: tickets, isLoading } = useCollection(ticketsQuery);

  const handleResolveTicket = (id: string) => {
    updateDocumentNonBlocking(doc(db, 'supportTickets', id), { status: 'closed' });
    toast({ title: "Chamado Encerrado", description: "O lojista foi notificado da resolução." });
  };

  const NavLinks = ({ mobile = false }: { mobile?: boolean }) => (
    <nav className={mobile ? "space-y-2" : "flex-1 px-4 space-y-2"}>
      <Link href="/admin/dashboard" className="flex items-center gap-3 px-4 py-2.5 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors font-medium">
        <LayoutDashboard className="h-5 w-5" /> Dashboard
      </Link>
      <Link href="/admin/tenants" className="flex items-center gap-3 px-4 py-2.5 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors font-medium">
        <LayoutGrid className="h-5 w-5" /> Multi-Tenancy
      </Link>
      <Link href="/admin/support" className="flex items-center gap-3 px-4 py-2.5 bg-primary/10 text-primary rounded-xl font-bold">
        <Headphones className="h-5 w-5" /> Suporte Global
      </Link>
      <Link href="/admin/infra" className="flex items-center gap-3 px-4 py-2.5 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors font-medium">
        <Server className="h-5 w-5" /> Infraestrutura
      </Link>
    </nav>
  );

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 font-body">
      <aside className="w-64 border-r dark:border-slate-800 bg-white dark:bg-slate-900 hidden lg:flex flex-col sticky top-0 h-screen">
        <div className="p-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-primary p-1.5 rounded-lg">
              <ShieldCheck className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-xl text-slate-800 dark:text-white tracking-tight italic uppercase">Master Admin</span>
          </Link>
        </div>
        <NavLinks />
        <div className="p-4 border-t dark:border-slate-800">
          <Button variant="ghost" className="w-full justify-start text-slate-500 gap-2 hover:text-red-500" asChild>
            <Link href="/"><LogOut className="h-4 w-4" /> Sair</Link>
          </Button>
        </div>
      </aside>

      <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
          <div className="flex items-center gap-4">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="lg:hidden rounded-xl border-slate-200 dark:border-slate-800">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72 p-0 border-none bg-white dark:bg-slate-900">
                <SheetHeader className="p-6 border-b dark:border-slate-800 text-left">
                  <SheetTitle className="flex items-center gap-2 font-black text-xl italic tracking-tighter text-primary uppercase">Master Support</SheetTitle>
                </SheetHeader>
                <div className="p-4 h-full flex flex-col"><NavLinks mobile /></div>
              </SheetContent>
            </Sheet>
            <div>
              <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter italic uppercase">Centro de Suporte Humano</h1>
              <p className="text-slate-500 font-medium">Intervenção e auxílio direto aos lojistas em dificuldade.</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <ModeToggle />
            <Badge className="bg-slate-900 text-white font-black italic">SLA: 15min</Badge>
          </div>
        </header>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center p-20 space-y-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="font-black italic text-slate-400 uppercase tracking-widest">Sincronizando Chamados...</p>
          </div>
        ) : (
          <Card className="border-none shadow-sm rounded-[40px] overflow-hidden bg-white dark:bg-slate-900">
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-slate-50 dark:bg-slate-800/50">
                  <TableRow className="dark:border-slate-800">
                    <TableHead className="px-8 h-16 font-black uppercase text-[10px] tracking-widest">Lojista / Usuário</TableHead>
                    <TableHead className="h-16 font-black uppercase text-[10px] tracking-widest">Mensagem de Ajuda</TableHead>
                    <TableHead className="h-16 font-black uppercase text-[10px] tracking-widest text-center">Status</TableHead>
                    <TableHead className="text-right px-8 h-16 font-black uppercase text-[10px] tracking-widest">Ação Master</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tickets?.map((ticket: any) => (
                    <TableRow key={ticket.id} className="dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                      <TableCell className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                            <Building2 className="h-6 w-6" />
                          </div>
                          <div className="flex flex-col">
                            <span className="font-black text-slate-900 dark:text-white uppercase italic">{ticket.merchantName}</span>
                            <span className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1"><Mail className="h-3 w-3" /> {ticket.userEmail}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="max-w-md">
                        <p className="text-sm font-medium text-slate-600 dark:text-slate-400 italic line-clamp-2">"{ticket.lastMessage}"</p>
                        <p className="text-[9px] font-black text-slate-400 uppercase mt-1">{new Date(ticket.createdAt).toLocaleString('pt-BR')}</p>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge className={cn(
                          "rounded-lg font-black italic border-none uppercase text-[9px] px-3",
                          ticket.status === 'open' ? "bg-red-100 text-red-600 animate-pulse" : "bg-green-100 text-green-600"
                        )}>
                          {ticket.status === 'open' ? 'AGUARDANDO' : 'RESOLVIDO'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right px-8">
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="sm" asChild className="rounded-xl font-bold border-slate-200">
                            <a href={`mailto:${ticket.userEmail}`}><MessageSquare className="h-4 w-4 mr-2" /> Responder</a>
                          </Button>
                          {ticket.status === 'open' && (
                            <Button onClick={() => handleResolveTicket(ticket.id)} size="sm" className="bg-slate-900 text-white rounded-xl font-black italic gap-2 px-4 shadow-xl">
                              <CheckCircle2 className="h-4 w-4" /> ENCERRAR
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {tickets?.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} className="h-60 text-center">
                        <div className="flex flex-col items-center gap-4">
                          <div className="h-20 w-20 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center">
                            <Headphones className="h-8 w-8 text-slate-300" />
                          </div>
                          <p className="font-black italic text-slate-400 uppercase tracking-widest text-xs">Nenhum pedido de suporte no momento.</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
