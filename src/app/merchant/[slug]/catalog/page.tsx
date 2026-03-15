
"use client";

import * as React from 'react';
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Plus, Search, Trash2, Edit2, LayoutDashboard, List, 
  TrendingUp, MousePointer2, Loader2, Package
} from "lucide-react";
import Link from 'next/link';
import { useToast } from "@/hooks/use-toast";
import { useFirestore, useCollection, addDocumentNonBlocking, deleteDocumentNonBlocking, useMemoFirebase } from '@/firebase';
import { collection, query, doc, orderBy, where, limit } from 'firebase/firestore';

export default function MerchantCatalog({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = React.use(params);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [isBulkMode, setIsBulkMode] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const db = useFirestore();

  // Buscar o ID real do Merchant via Slug
  const merchantQuery = useMemoFirebase(() => query(
    collection(db, 'merchants'), 
    where('slug', '==', slug),
    limit(1)
  ), [db, slug]);
  const { data: merchantData } = useCollection(merchantQuery);
  const merchantId = merchantData?.[0]?.id;

  const productsQuery = useMemoFirebase(() => {
    if (!merchantId) return null;
    return query(collection(db, 'merchants', merchantId, 'products'), orderBy('createdAt', 'desc'));
  }, [db, merchantId]);
  
  const { data: products, isLoading: loadingProducts } = useCollection(productsQuery);

  const [formData, setFormData] = useState({
    name: "",
    price: 0,
    category: "Geral"
  });

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!merchantId) return;
    setLoading(true);
    
    const newProduct = {
      name: formData.name,
      price: Number(formData.price),
      category: formData.category,
      imageUrl: `https://picsum.photos/seed/${formData.name}/200/200`,
      isAvailable: true,
      createdAt: new Date().toISOString()
    };

    addDocumentNonBlocking(collection(db, 'merchants', merchantId, 'products'), newProduct);
    
    setLoading(false);
    setIsCreateOpen(false);
    setFormData({ name: "", price: 0, category: "Geral" });
    toast({ title: "Produto Adicionado", description: `${formData.name} já faz parte do cardápio.` });
  };

  const toggleSelect = (id: string) => {
    setSelectedItems(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const handleDelete = (id: string) => {
    if (!merchantId) return;
    deleteDocumentNonBlocking(doc(db, 'merchants', merchantId, 'products', id));
    toast({ title: "Excluído", description: "O item foi removido do sistema." });
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-body">
      <aside className="w-64 border-r bg-white hidden lg:flex flex-col sticky top-0 h-screen">
        <div className="p-6">
          <Link href="/" className="flex items-center gap-2 font-black text-xl italic tracking-tighter text-primary">MERCADO ÁGIL</Link>
        </div>
        <nav className="flex-1 px-4 space-y-2">
          <Link href={`/merchant/${slug}/dashboard`} className="flex items-center gap-3 px-4 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl font-medium"><LayoutDashboard className="h-5 w-5" /> Dashboard</Link>
          <Link href={`/merchant/${slug}/catalog`} className="flex items-center gap-3 px-4 py-2.5 bg-primary/10 text-primary rounded-xl font-bold"><List className="h-5 w-5" /> Cardápio/Produtos</Link>
        </nav>
      </aside>

      <main className="flex-1 p-8">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tighter italic uppercase">Gestão de Itens</h1>
            <p className="text-slate-500 font-medium">Controle de preços, estoque e cardápio digital.</p>
          </div>
          <div className="flex gap-2">
            {selectedItems.length > 0 ? (
              <Button className="bg-primary rounded-2xl h-12 gap-2 font-black italic px-6 animate-pulse text-white">
                <TrendingUp className="h-4 w-4" /> Reajustar {selectedItems.length} Selecionados
              </Button>
            ) : (
              <Button variant="outline" className="rounded-2xl h-12 gap-2 font-bold" onClick={() => setIsBulkMode(!isBulkMode)}>
                <MousePointer2 className="h-4 w-4" /> {isBulkMode ? 'Cancelar Seleção' : 'Edição em Massa'}
              </Button>
            )}
            
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
              <DialogTrigger asChild>
                <Button className="bg-slate-900 rounded-2xl h-12 gap-2 font-bold px-6 text-white shadow-xl">
                  <Plus className="h-5 w-5" /> Novo Item
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md rounded-[40px] p-0 overflow-hidden border-none shadow-2xl">
                <div className="bg-primary p-8 text-white">
                  <DialogTitle className="text-2xl font-black italic uppercase text-white">Novo Cadastro</DialogTitle>
                  <p className="text-white/70 text-xs font-bold mt-1">Adicione itens ao seu inventário ou cardápio.</p>
                </div>
                <form onSubmit={handleCreateProduct} className="p-8 space-y-6">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase text-slate-400">Nome do Item</Label>
                    <Input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="h-12 rounded-xl bg-slate-50 border-none font-bold" placeholder="Ex: X-Salada ou Camisa Polo" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase text-slate-400">Preço (R$)</Label>
                      <Input type="number" required value={formData.price} onChange={e => setFormData({...formData, price: Number(e.target.value)})} className="h-12 rounded-xl bg-slate-50 border-none font-bold" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase text-slate-400">Categoria</Label>
                      <Input required value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="h-12 rounded-xl bg-slate-50 border-none font-bold" />
                    </div>
                  </div>
                  <Button type="submit" disabled={loading} className="w-full h-16 bg-slate-900 rounded-[30px] font-black italic text-lg text-white">
                    {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : 'CADASTRAR AGORA'}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </header>

        <Card className="border-none shadow-sm rounded-[40px] overflow-hidden bg-white">
          <CardHeader className="p-8 border-b flex flex-row items-center justify-between bg-slate-50/30">
            <div className="flex items-center gap-4">
              <CardTitle className="text-xl font-black italic">Listagem Ativa</CardTitle>
              <div className="relative w-64">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input className="pl-12 bg-white border-none rounded-2xl h-12 font-medium shadow-sm" placeholder="Buscar..." />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {loadingProducts ? (
              <div className="p-20 text-center"><Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" /></div>
            ) : (
              <Table>
                <TableHeader className="bg-slate-50/50">
                  <TableRow>
                    {isBulkMode && <TableHead className="w-12 px-8"></TableHead>}
                    <TableHead className="px-8 font-black uppercase text-[10px] tracking-widest">Item</TableHead>
                    <TableHead className="font-black uppercase text-[10px] tracking-widest text-center">Preço</TableHead>
                    <TableHead className="font-black uppercase text-[10px] tracking-widest text-center">Status</TableHead>
                    <TableHead className="text-right px-8 font-black uppercase text-[10px] tracking-widest">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products?.map((product: any) => (
                    <TableRow key={product.id} className="hover:bg-slate-50 transition-colors">
                      {isBulkMode && (
                        <TableCell className="px-8">
                          <Checkbox checked={selectedItems.includes(product.id)} onCheckedChange={() => toggleSelect(product.id)} />
                        </TableCell>
                      )}
                      <TableCell className="py-6 px-8">
                        <div className="flex items-center gap-4">
                          <div className="h-14 w-14 rounded-2xl overflow-hidden shadow-sm border bg-slate-100 flex items-center justify-center">
                            <img src={product.imageUrl || `https://picsum.photos/seed/${product.id}/200/200`} className="h-full w-full object-cover" />
                          </div>
                          <div><p className="font-black text-slate-900 italic uppercase">{product.name}</p><p className="text-[10px] font-bold text-slate-400 uppercase">{product.category}</p></div>
                        </div>
                      </TableCell>
                      <TableCell className="text-center font-black text-primary italic text-lg">R$ {product.price.toFixed(2)}</TableCell>
                      <TableCell className="text-center"><Badge className="bg-green-100 text-green-700 font-black italic border-none">Disponível</Badge></TableCell>
                      <TableCell className="text-right px-8">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" className="rounded-xl"><Edit2 className="h-4 w-4 text-slate-400" /></Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDelete(product.id)} className="rounded-xl hover:text-red-500"><Trash2 className="h-4 w-4 text-slate-400" /></Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {products?.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="h-40 text-center text-slate-400 font-bold italic uppercase tracking-widest text-xs">Catálogo limpo.</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
