
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Plus, Search, Trash2, Edit2, LayoutDashboard, List, 
  TrendingUp, MousePointer2, Loader2, Package, Tag, 
  Layers, Gift, ShieldCheck, Sparkles, Wand2
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
    category: "Geral",
    isPackage: false,
    sessions: 1
  });

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!merchantId) return;
    setLoading(true);
    
    const newProduct = {
      ...formData,
      price: Number(formData.price),
      imageUrl: `https://picsum.photos/seed/${formData.name}/200/200`,
      isAvailable: true,
      createdAt: new Date().toISOString()
    };

    addDocumentNonBlocking(collection(db, 'merchants', merchantId, 'products'), newProduct);
    
    setLoading(false);
    setIsCreateOpen(false);
    toast({ title: formData.isPackage ? "Pacote Criado!" : "Produto Adicionado", description: "Item ativo na vitrine." });
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-body">
      <aside className="w-64 border-r bg-white hidden lg:flex flex-col sticky top-0 h-screen">
        <div className="p-6">
          <Link href="/" className="flex items-center gap-2 font-black text-xl italic tracking-tighter text-primary">MERCADO ÁGIL</Link>
        </div>
        <nav className="flex-1 px-4 space-y-2">
          <Link href={`/merchant/${slug}/dashboard`} className="flex items-center gap-3 px-4 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors font-medium"><LayoutDashboard className="h-5 w-5" /> Dashboard</Link>
          <Link href={`/merchant/${slug}/catalog`} className="flex items-center gap-3 px-4 py-2.5 bg-primary/10 text-primary rounded-xl font-bold"><List className="h-5 w-5" /> Gestão de Itens</Link>
        </nav>
      </aside>

      <main className="flex-1 p-8 overflow-y-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tighter italic uppercase">Cardápio & Inventário</h1>
            <p className="text-slate-500 font-medium italic">Produtos individuais, pacotes promocionais e combos elite.</p>
          </div>
          <div className="flex gap-2">
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
              <DialogTrigger asChild>
                <Button className="bg-slate-900 rounded-2xl h-12 gap-2 font-bold px-6 text-white shadow-xl shadow-slate-200">
                  <Plus className="h-5 w-5" /> Novo Item / Pacote
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md rounded-[40px] p-0 overflow-hidden border-none shadow-2xl">
                <div className="bg-primary p-8 text-white">
                  <DialogTitle className="text-2xl font-black italic uppercase">Novo Cadastro</DialogTitle>
                  <p className="text-white/70 text-xs font-bold mt-1">Produtos unitários ou pacotes de fidelização.</p>
                </div>
                <form onSubmit={handleCreateProduct} className="p-8 space-y-6">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase text-slate-400">Nome do Item/Pacote</Label>
                    <Input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="h-12 rounded-xl bg-slate-50 border-none font-bold" />
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
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                     <div className="space-y-1">
                        <p className="font-black text-slate-900 italic text-sm">Este item é um Pacote?</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase">Permite múltiplas sessões.</p>
                     </div>
                     <Checkbox checked={formData.isPackage} onCheckedChange={v => setFormData({...formData, isPackage: !!v})} />
                  </div>
                  <Button type="submit" disabled={loading} className="w-full h-16 bg-slate-900 rounded-[30px] font-black italic text-lg text-white">CADASTRAR ITEM ELITE</Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </header>

        <Tabs defaultValue="products" className="space-y-8">
           <TabsList className="bg-white p-1 rounded-2xl shadow-sm border h-auto flex gap-1 w-fit">
              <TabsTrigger value="products" className="rounded-xl py-3 px-8 font-black italic text-xs uppercase tracking-widest"><Package className="h-4 w-4 mr-2" /> Produtos</TabsTrigger>
              <TabsTrigger value="packages" className="rounded-xl py-3 px-8 font-black italic text-xs uppercase tracking-widest text-primary"><Gift className="h-4 w-4 mr-2" /> Pacotes de Fidelidade</TabsTrigger>
           </TabsList>

           <TabsContent value="products">
              <Card className="border-none shadow-sm rounded-[40px] overflow-hidden bg-white">
                <CardContent className="p-0">
                  {loadingProducts ? (
                    <div className="p-20 text-center"><Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" /></div>
                  ) : (
                    <Table>
                      <TableHeader className="bg-slate-50/50">
                        <TableRow>
                          <TableHead className="px-8 h-16 font-black uppercase text-[10px] tracking-widest text-slate-400">Item</TableHead>
                          <TableHead className="h-16 font-black uppercase text-[10px] tracking-widest text-slate-400 text-center">Preço</TableHead>
                          <TableHead className="h-16 font-black uppercase text-[10px] tracking-widest text-slate-400 text-center">Estoque</TableHead>
                          <TableHead className="text-right px-8 h-16 font-black uppercase text-[10px] tracking-widest text-slate-400">Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {products?.filter(p => !p.isPackage).map((product: any) => (
                          <TableRow key={product.id} className="hover:bg-slate-50 transition-colors">
                            <TableCell className="py-6 px-8">
                              <div className="flex items-center gap-4">
                                <div className="h-14 w-14 rounded-2xl overflow-hidden border-2 border-white shadow-sm">
                                  <img src={product.imageUrl} className="h-full w-full object-cover" />
                                </div>
                                <div>
                                   <p className="font-black text-slate-900 italic uppercase text-sm">{product.name}</p>
                                   <p className="text-[9px] font-bold text-slate-400 uppercase">{product.category}</p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="text-center font-black text-primary italic text-lg">R$ {product.price.toFixed(2)}</TableCell>
                            <TableCell className="text-center">
                               <Badge className="bg-green-100 text-green-700 font-black border-none px-3 uppercase text-[9px]">45 un</Badge>
                            </TableCell>
                            <TableCell className="text-right px-8">
                              <div className="flex justify-end gap-2">
                                <Button variant="ghost" size="icon" className="rounded-xl hover:bg-primary/10 text-primary"><Wand2 className="h-4 w-4" /></Button>
                                <Button variant="ghost" size="icon" className="rounded-xl hover:bg-red-50 text-slate-400 hover:text-red-500"><Trash2 className="h-4 w-4" /></Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
           </TabsContent>

           <TabsContent value="packages">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                 {products?.filter(p => p.isPackage).map((pkg: any) => (
                   <Card key={pkg.id} className="border-4 border-primary/10 shadow-xl rounded-[45px] p-8 space-y-6 bg-white hover:border-primary transition-all group relative overflow-hidden">
                      <div className="flex items-center justify-between">
                         <div className="h-14 w-14 rounded-3xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                            <Gift className="h-8 w-8" />
                         </div>
                         <Badge className="bg-primary text-white border-none font-black italic uppercase text-[10px] px-4">Combo Fidelidade</Badge>
                      </div>
                      <div className="space-y-2">
                         <h3 className="text-2xl font-black italic uppercase tracking-tighter text-slate-900 leading-none">{pkg.name}</h3>
                         <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Inclui {pkg.sessions || 5} sessões completas</p>
                      </div>
                      <div className="flex items-center justify-between pt-4 border-t border-dashed">
                         <div className="space-y-1">
                            <p className="text-[10px] font-black uppercase text-slate-400">Preço Especial</p>
                            <p className="text-2xl font-black italic text-primary">R$ {pkg.price.toFixed(2)}</p>
                         </div>
                         <Button variant="ghost" size="icon" className="text-red-400 hover:text-red-600 rounded-full"><Trash2 className="h-5 w-5" /></Button>
                      </div>
                      <Sparkles className="absolute -bottom-10 -right-10 h-32 w-32 opacity-5" />
                   </Card>
                 ))}
                 {products?.filter(p => p.isPackage).length === 0 && (
                   <div className="col-span-full h-60 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-[45px] text-center p-10 space-y-4">
                      <Gift className="h-12 w-12 text-slate-200" />
                      <p className="font-black italic text-slate-400 uppercase tracking-widest text-sm max-w-xs">Você ainda não criou nenhum pacote de serviços fidelizado.</p>
                   </div>
                 )}
              </div>
           </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
