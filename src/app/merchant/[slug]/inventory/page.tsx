
"use client";

import * as React from 'react';
import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Package, AlertTriangle, TrendingDown, ArrowUpDown, Search, 
  Plus, Filter, Download, History, Database, Layers, 
  QrCode, Warehouse, Truck, RefreshCw, Barcode, Eye, Camera, Loader2,
  LayoutDashboard, Settings, Menu
} from "lucide-react";
import Link from 'next/link';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";

export default function MerchantInventory({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = React.use(params);
  const [warehouse, setWarehouse] = useState("principal");
  const [isVisionScanOpen, setIsVisionScanOpen] = useState(false);
  const [hasCameraPermission, setHasCameraPermission] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { toast } = useToast();

  const startVisionScan = async () => {
    setIsVisionScanOpen(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setHasCameraPermission(true);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      setHasCameraPermission(false);
      toast({
        variant: 'destructive',
        title: 'Acesso Negado',
        description: 'Ative a câmera para usar a Visão IA.',
      });
    }
  };

  const handleVisionAnalysis = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      toast({
        title: "Análise Concluída",
        description: "Detectados 12 itens no campo de visão. Estoque sincronizado.",
      });
      setIsVisionScanOpen(false);
    }, 2500);
  };

  const NavLinks = ({ mobile = false }: { mobile?: boolean }) => (
    <nav className={mobile ? "space-y-2" : "flex-1 px-4 space-y-2"}>
      <Link href={`/merchant/${slug}/dashboard`} className="flex items-center gap-3 px-4 py-2.5 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors font-medium"><LayoutDashboard className="h-5 w-5" /> Dashboard</Link>
      <Link href={`/merchant/${slug}/inventory`} className="flex items-center gap-3 px-4 py-2.5 bg-primary/10 text-primary rounded-xl font-bold"><Database className="h-5 w-5" /> Inventário Pro</Link>
      <Link href={`/merchant/${slug}/catalog`} className="flex items-center gap-3 px-4 py-2.5 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors font-medium"><Layers className="h-5 w-5" /> Catálogo</Link>
    </nav>
  );

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 font-body">
      <aside className="w-64 border-r dark:border-slate-800 bg-white dark:bg-slate-900 hidden lg:flex flex-col sticky top-0 h-screen">
        <div className="p-6">
          <Link href="/" className="flex items-center gap-2 font-black text-xl italic tracking-tighter text-primary">MERCADO ÁGIL</Link>
        </div>
        <NavLinks />
      </aside>

      <main className="flex-1 p-4 lg:p-8">
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
                  <SheetTitle className="flex items-center gap-2 font-black text-xl italic tracking-tighter text-primary uppercase">MERCADO ÁGIL</SheetTitle>
                </SheetHeader>
                <div className="p-4 h-full flex flex-col"><NavLinks mobile /></div>
              </SheetContent>
            </Sheet>
            <div>
              <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter italic uppercase">Inventário Enterprise</h1>
              <p className="text-slate-500 font-medium">Controle multi-warehouse e Visão Computacional IA.</p>
            </div>
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <Button onClick={startVisionScan} variant="outline" className="rounded-2xl h-12 gap-2 font-black italic flex-1 md:flex-none border-primary/20 text-primary hover:bg-primary/5">
              <Eye className="h-4 w-4" /> AI Vision Scan
            </Button>
            <Button className="bg-slate-900 dark:bg-primary rounded-2xl h-12 gap-2 font-bold px-6 shadow-xl flex-1 md:flex-none text-white">
              <Plus className="h-4 w-4" /> Entrada NF-e
            </Button>
          </div>
        </header>

        <div className="flex gap-4 mb-8 overflow-x-auto no-scrollbar pb-2">
           <Button variant={warehouse === 'principal' ? 'default' : 'outline'} className="rounded-2xl h-14 px-8 font-black italic gap-2 whitespace-nowrap" onClick={() => setWarehouse('principal')}>
              <Warehouse className="h-4 w-4" /> CD Principal - SP
           </Button>
           <Button variant={warehouse === 'sul' ? 'default' : 'outline'} className="rounded-2xl h-14 px-8 font-black italic gap-2 whitespace-nowrap" onClick={() => setWarehouse('sul')}>
              <Warehouse className="h-4 w-4" /> Filial Sul - CTBA
           </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-4 mb-10">
           <Card className="border-none shadow-sm p-6 rounded-[32px] bg-red-500 text-white relative overflow-hidden">
              <p className="text-[10px] font-black uppercase tracking-widest opacity-80">Ruptura Crítica</p>
              <p className="text-4xl font-black italic mt-2">02 SKUs</p>
              <AlertTriangle className="absolute -bottom-4 -right-4 h-24 w-24 opacity-10" />
           </Card>
           <Card className="border-none shadow-sm p-6 rounded-[32px] bg-white dark:bg-slate-900">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Patrimônio Imobilizado</p>
              <p className="text-3xl font-black italic mt-2 text-slate-900 dark:text-white">R$ 482.150</p>
           </Card>
           <Card className="border-none shadow-sm p-6 rounded-[32px] bg-slate-900 text-white relative overflow-hidden">
              <p className="text-[10px] font-black uppercase tracking-widest opacity-80">Pegada de Carbono (Log)</p>
              <div className="flex items-center gap-2 mt-2">
                 <p className="text-3xl font-black italic">0.8t CO2</p>
                 <Badge className="bg-green-500 text-white border-none font-black italic text-[8px]">ECO-FRIENDLY</Badge>
              </div>
           </Card>
           <Card className="border-none shadow-sm p-6 rounded-[32px] bg-primary text-white relative overflow-hidden">
              <p className="text-[10px] font-black uppercase tracking-widest opacity-80">AI Replenishment</p>
              <p className="text-3xl font-black italic mt-2">Próx. 48h</p>
              <Truck className="absolute -bottom-4 -right-4 h-24 w-24 opacity-10" />
           </Card>
        </div>

        <Card className="border-none shadow-sm rounded-[40px] overflow-hidden bg-white dark:bg-slate-900">
          <CardHeader className="p-8 border-b dark:border-slate-800 flex flex-col md:flex-row items-center justify-between bg-slate-50/50 dark:bg-slate-800/50 gap-4">
            <div className="flex items-center gap-4 w-full md:w-auto">
               <CardTitle className="text-xl font-black italic dark:text-white">Monitoramento de Lotes</CardTitle>
               <div className="relative flex-1 md:w-80">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input placeholder="Buscar por Lote, Validade, SKU..." className="pl-10 h-12 rounded-2xl bg-white dark:bg-slate-800 border-none shadow-sm font-medium" />
               </div>
            </div>
            <div className="flex gap-2">
               <Button variant="outline" className="rounded-xl font-bold dark:border-slate-700"><RefreshCw className="h-4 w-4 mr-2" /> Sync ERP</Button>
               <Button variant="ghost" size="icon" className="rounded-xl"><Filter className="h-5 w-5 text-slate-400" /></Button>
            </div>
          </CardHeader>
          <CardContent className="p-0 overflow-x-auto">
            <Table>
              <TableHeader className="bg-slate-50/30 dark:bg-slate-800/20">
                <TableRow className="dark:border-slate-800">
                  <TableHead className="px-8 h-16 font-black uppercase text-[10px] tracking-widest">Produto / Lote</TableHead>
                  <TableHead className="h-16 font-black uppercase text-[10px] tracking-widest">Localização</TableHead>
                  <TableHead className="h-16 font-black uppercase text-[10px] tracking-widest text-center">Unidades</TableHead>
                  <TableHead className="text-right px-8 h-16 font-black uppercase text-[10px] tracking-widest">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow className="dark:border-slate-800">
                  <TableCell className="px-8 py-6">
                     <div className="flex items-center gap-4">
                        <div className="h-14 w-14 rounded-2xl bg-slate-100 dark:bg-slate-800 overflow-hidden shadow-inner border dark:border-slate-700 flex items-center justify-center">
                           <Package className="h-6 w-6 text-slate-400" />
                        </div>
                        <div className="flex flex-col">
                           <span className="font-black text-slate-900 dark:text-white text-base italic uppercase">SKU #AF2024</span>
                           <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                              <QrCode className="h-2 w-2" /> LOTE: #XP-2025
                           </span>
                        </div>
                     </div>
                  </TableCell>
                  <TableCell className="font-bold text-slate-600 dark:text-slate-400">Corredor B - P4</TableCell>
                  <TableCell className="text-center font-black text-slate-900 dark:text-white text-xl">45</TableCell>
                  <TableCell className="text-right px-8">
                     <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" className="rounded-xl"><History className="h-4 w-4 text-slate-400" /></Button>
                        <Button variant="ghost" size="icon" className="rounded-xl"><ArrowUpDown className="h-4 w-4 text-slate-400" /></Button>
                     </div>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>

      <Dialog open={isVisionScanOpen} onOpenChange={setIsVisionScanOpen}>
        <DialogContent className="sm:max-w-2xl rounded-[40px] border-none shadow-2xl p-0 overflow-hidden font-body bg-white dark:bg-slate-950">
           <div className="bg-slate-900 p-8 text-white relative overflow-hidden">
              <div className="relative z-10">
                 <DialogTitle className="text-2xl font-black italic uppercase tracking-tighter">AI Vision Computer</DialogTitle>
                 <p className="text-slate-400 font-bold uppercase text-[9px] tracking-widest mt-1">Escaneamento volumétrico via IA.</p>
              </div>
              <Eye className="absolute -bottom-10 -right-10 h-40 w-40 opacity-5" />
           </div>
           <div className="p-8 space-y-6">
              <div className="aspect-video rounded-[30px] bg-black relative overflow-hidden flex items-center justify-center">
                 <video ref={videoRef} className="w-full h-full object-cover opacity-80" autoPlay muted />
                 <div className="absolute inset-0 border-2 border-primary/40 border-dashed m-10 rounded-2xl animate-pulse"></div>
                 {isAnalyzing && (
                   <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center gap-4">
                      <Loader2 className="h-12 w-12 animate-spin text-primary" />
                      <p className="text-primary font-black italic animate-pulse">PROCESSANDO VOLUMETRIA...</p>
                   </div>
                 )}
                 {!hasCameraPermission && (
                   <div className="text-center p-10">
                      <Camera className="h-12 w-12 text-slate-700 mx-auto mb-4" />
                      <p className="text-slate-500 font-bold">Aguardando câmera...</p>
                   </div>
                 )}
              </div>
              <Button onClick={handleVisionAnalysis} disabled={!hasCameraPermission || isAnalyzing} className="w-full h-16 bg-primary hover:bg-primary/90 text-white rounded-[28px] font-black italic text-lg shadow-xl">
                Analisar Estoque Visualmente
              </Button>
           </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
