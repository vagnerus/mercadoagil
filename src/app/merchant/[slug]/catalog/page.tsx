
"use client";

import * as React from 'react';
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Plus, Search, Trash2, Edit2, LayoutDashboard, List, 
  ShoppingBag, Settings, Package, Image as ImageIcon, 
  Wand2, Download, TrendingUp, Sparkles, Box, RefreshCw, 
  FileSpreadsheet, MousePointer2, Layers
} from "lucide-react";
import { MOCK_PRODUCTS, Product } from "@/lib/mock-data";
import Link from 'next/link';
import { useToast } from "@/hooks/use-toast";

export default function MerchantCatalog({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = React.use(params);
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [isBulkMode, setIsBulkMode] = useState(false);
  const { toast } = useToast();

  const toggleSelect = (id: string) => {
    setSelectedItems(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const handleBulkPriceChange = () => {
    toast({ title: "Edição em Massa", description: `Ajustando preço de ${selectedItems.length} itens em +10% conforme solicitado.` });
    setSelectedItems([]);
    setIsBulkMode(false);
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-body">
      <aside className="w-64 border-r bg-white hidden lg:flex flex-col sticky top-0 h-screen">
        <div className="p-6">
          <Link href="/" className="flex items-center gap-2 font-black text-xl italic tracking-tighter text-primary">MERCADO ÁGIL</Link>
        </div>
        <nav className="flex-1 px-4 space-y-2">
          <Link href={`/merchant/${slug}/dashboard`} className="flex items-center gap-3 px-4 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl font-medium"><LayoutDashboard className="h-5 w-5" /> Dashboard</Link>
          <Link href={`/merchant/${slug}/catalog`} className="flex items-center gap-3 px-4 py-2.5 bg-accent/10 text-accent rounded-xl font-bold"><List className="h-5 w-5" /> Catálogo Pro</Link>
        </nav>
      </aside>

      <main className="flex-1 p-8">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tighter italic uppercase">Gestão de Catálogo</h1>
            <p className="text-slate-500 font-medium">Controle de preços, estoque e edição em massa.</p>
          </div>
          <div className="flex gap-2">
            {selectedItems.length > 0 ? (
              <Button onClick={handleBulkPriceChange} className="bg-primary rounded-2xl h-12 gap-2 font-black italic px-6 animate-pulse">
                <TrendingUp className="h-4 w-4" /> Reajustar {selectedItems.length} Selecionados
              </Button>
            ) : (
              <Button variant="outline" className="rounded-2xl h-12 gap-2 font-bold" onClick={() => setIsBulkMode(!isBulkMode)}>
                <MousePointer2 className="h-4 w-4" /> {isBulkMode ? 'Cancelar Seleção' : 'Edição em Massa'}
              </Button>
            )}
            <Button className="bg-slate-900 rounded-2xl h-12 gap-2 font-bold px-6"><Plus className="h-5 w-5" /> Novo Item</Button>
          </div>
        </header>

        <Card className="border-none shadow-sm rounded-[40px] overflow-hidden bg-white">
          <CardHeader className="p-8 border-b flex flex-row items-center justify-between bg-slate-50/30">
            <div className="flex items-center gap-4">
              <CardTitle className="text-xl font-black italic">Produtos Ativos</CardTitle>
              <div className="relative w-64">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input className="pl-12 bg-white border-none rounded-2xl h-12 font-medium shadow-sm" placeholder="Buscar no catálogo..." />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-slate-50/50">
                <TableRow>
                  {isBulkMode && <TableHead className="w-12 px-8"></TableHead>}
                  <TableHead className="px-8 font-black uppercase text-[10px] tracking-widest">Produto</TableHead>
                  <TableHead className="font-black uppercase text-[10px] tracking-widest text-center">Preço</TableHead>
                  <TableHead className="font-black uppercase text-[10px] tracking-widest text-center">Status</TableHead>
                  <TableHead className="text-right px-8 font-black uppercase text-[10px] tracking-widest">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id} className="hover:bg-slate-50 transition-colors">
                    {isBulkMode && (
                      <TableCell className="px-8">
                        <Checkbox checked={selectedItems.includes(product.id)} onCheckedChange={() => toggleSelect(product.id)} />
                      </TableCell>
                    )}
                    <TableCell className="py-6 px-8">
                      <div className="flex items-center gap-4">
                        <div className="h-14 w-14 rounded-2xl overflow-hidden shadow-sm border"><img src={product.imageUrl} className="h-full w-full object-cover" /></div>
                        <div><p className="font-black text-slate-900 italic">{product.name}</p><p className="text-[10px] font-bold text-slate-400 uppercase">SKU: {product.id.toUpperCase()}</p></div>
                      </div>
                    </TableCell>
                    <TableCell className="text-center font-black text-primary italic text-lg">R$ {product.price.toFixed(2)}</TableCell>
                    <TableCell className="text-center"><Badge className="bg-green-100 text-green-700 font-black italic border-none">Disponível</Badge></TableCell>
                    <TableCell className="text-right px-8">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" className="rounded-xl"><Edit2 className="h-4 w-4 text-slate-400" /></Button>
                        <Button variant="ghost" size="icon" className="rounded-xl hover:text-red-500"><Trash2 className="h-4 w-4" /></Button>
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
