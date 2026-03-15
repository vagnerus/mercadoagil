
"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ProductAiGenerator } from "@/components/merchant/product-ai-generator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Search, Trash2, Edit2, LayoutDashboard, List, ShoppingBag, Settings, Package, Image as ImageIcon, Video, Wand2, Download, Copy, TrendingUp, Wallet, Users } from "lucide-react";
import { MOCK_PRODUCTS, MOCK_CATEGORIES } from "@/lib/mock-data";
import Link from 'next/link';
import { useToast } from "@/hooks/use-toast";

export default function MerchantCatalog({ params }: { params: { slug: string } }) {
  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [price, setPrice] = useState("");
  const [costPrice, setCostPrice] = useState("");
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const { toast } = useToast();

  const toggleSelect = (id: string) => {
    setSelectedItems(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const handleBulkDelete = () => {
    toast({ title: "Ação em Massa", description: `${selectedItems.length} itens removidos.` });
    setSelectedItems([]);
  };

  const calculateMargin = () => {
    if (!price || !costPrice) return null;
    const p = parseFloat(price);
    const c = parseFloat(costPrice);
    if (isNaN(p) || isNaN(c) || p === 0) return null;
    const margin = ((p - c) / p) * 100;
    return margin.toFixed(1);
  };

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
          <Link href={`/merchant/${params.slug}/dashboard`} className="flex items-center gap-3 px-4 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors font-medium">
            <LayoutDashboard className="h-5 w-5" /> Dashboard
          </Link>
          <Link href={`/merchant/${params.slug}/orders`} className="flex items-center gap-3 px-4 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors font-medium">
            <ShoppingBag className="h-5 w-5" /> Pedidos
          </Link>
          <Link href={`/merchant/${params.slug}/catalog`} className="flex items-center gap-3 px-4 py-2.5 bg-accent/10 text-accent rounded-xl font-bold">
            <List className="h-5 w-5" /> Catálogo
          </Link>
          <Link href={`/merchant/${params.slug}/customers`} className="flex items-center gap-3 px-4 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors font-medium">
            <Users className="h-5 w-5" /> CRM Clientes
          </Link>
          <Link href={`/merchant/${params.slug}/finance`} className="flex items-center gap-3 px-4 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors font-medium">
            <Wallet className="h-5 w-5" /> Financeiro
          </Link>
          <Link href={`/merchant/${params.slug}/settings`} className="flex items-center gap-3 px-4 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors font-medium">
            <Settings className="h-5 w-5" /> Configurações
          </Link>
        </nav>
      </aside>

      <main className="flex-1 p-8">
        <header className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tighter italic">Gestão de Cardápio</h1>
            <p className="text-slate-500 font-medium">Crie produtos incríveis com o poder da IA.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="rounded-xl h-12"><Download className="h-4 w-4 mr-2" /> Exportar</Button>
            <Button className="bg-slate-900 rounded-xl h-12 gap-2 font-bold"><Plus className="h-5 w-5" /> Novo Item</Button>
          </div>
        </header>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-1 space-y-6">
            <Card className="border-none shadow-sm rounded-[40px] overflow-hidden">
              <CardHeader className="p-8 pb-4">
                <CardTitle className="text-xl font-black italic">Criar Produto</CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                <div className="space-y-4">
                  <div className="h-48 w-full rounded-3xl bg-slate-100 border-2 border-dashed border-slate-200 flex flex-col items-center justify-center overflow-hidden relative group">
                    {imageUrl ? (
                      <div className="relative w-full h-full">
                        <img src={imageUrl} className="h-full w-full object-cover" alt="Preview" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                           <Button size="sm" variant="secondary" className="rounded-full"><Edit2 className="h-4 w-4" /></Button>
                           <Button size="sm" variant="destructive" className="rounded-full" onClick={() => setImageUrl("")}><Trash2 className="h-4 w-4" /></Button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <ImageIcon className="h-10 w-10 text-slate-300 mb-2" />
                        <span className="text-xs text-slate-400 font-black uppercase tracking-widest">Foto do Produto</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Nome</Label>
                    <Input 
                      placeholder="Ex: Hambúrguer de Picanha" 
                      value={productName}
                      onChange={(e) => setProductName(e.target.value)}
                      className="rounded-2xl h-12 bg-slate-50 border-none font-bold"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Venda (R$)</Label>
                      <Input 
                        type="number" 
                        step="0.01" 
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        className="rounded-2xl h-12 bg-slate-50 border-none font-bold text-primary" 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Custo (R$)</Label>
                      <Input 
                        type="number" 
                        step="0.01" 
                        value={costPrice}
                        onChange={(e) => setCostPrice(e.target.value)}
                        className="rounded-2xl h-12 bg-slate-50 border-none font-bold text-slate-400" 
                      />
                    </div>
                  </div>

                  {calculateMargin() && (
                    <div className="p-4 bg-green-50 rounded-2xl border border-green-100 flex items-center justify-between">
                       <span className="text-[10px] font-black uppercase text-green-700 tracking-widest">Margem de Lucro</span>
                       <Badge className="bg-green-500 text-white font-black italic">{calculateMargin()}%</Badge>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Descrição</Label>
                    <Textarea 
                      rows={3} 
                      placeholder="Descreva os ingredientes..." 
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="rounded-2xl bg-slate-50 border-none font-medium resize-none"
                    />
                  </div>
                </div>

                <ProductAiGenerator 
                  productName={productName} 
                  onDescriptionGenerated={setDescription} 
                  onImageGenerated={setImageUrl}
                />

                <Button className="w-full bg-accent hover:bg-accent/90 h-16 rounded-[28px] text-lg font-black italic shadow-xl shadow-accent/20">Salvar no Cardápio</Button>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <Card className="border-none shadow-sm rounded-[40px] overflow-hidden">
              <CardHeader className="bg-white p-8 border-b">
                <div className="flex flex-col md:flex-row justify-between gap-4">
                  <div>
                    <CardTitle className="text-xl font-black italic">Catálogo Ativo</CardTitle>
                    {selectedItems.length > 0 && (
                      <p className="text-sm font-bold text-accent mt-1">{selectedItems.length} itens selecionados</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <div className="relative w-full md:w-64">
                       <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                       <Input className="pl-12 bg-slate-100 border-none rounded-2xl h-12 font-medium" placeholder="Buscar produto..." />
                    </div>
                    {selectedItems.length > 0 && (
                      <Button variant="destructive" className="rounded-2xl h-12" onClick={handleBulkDelete}><Trash2 className="h-4 w-4" /></Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader className="bg-slate-50/50">
                    <TableRow>
                      <TableHead className="w-12 px-8"></TableHead>
                      <TableHead className="font-black uppercase text-[10px] tracking-widest">Item</TableHead>
                      <TableHead className="font-black uppercase text-[10px] tracking-widest text-center">Preço</TableHead>
                      <TableHead className="font-black uppercase text-[10px] tracking-widest text-center">Lucro Est.</TableHead>
                      <TableHead className="font-black uppercase text-[10px] tracking-widest text-right px-8">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {MOCK_PRODUCTS.map((product) => (
                      <TableRow key={product.id} className="hover:bg-slate-50 transition-colors">
                        <TableCell className="px-8">
                          <Checkbox checked={selectedItems.includes(product.id)} onCheckedChange={() => toggleSelect(product.id)} className="rounded-md border-slate-300" />
                        </TableCell>
                        <TableCell className="py-6">
                          <div className="flex items-center gap-4">
                            <div className="h-16 w-16 rounded-2xl bg-slate-200 overflow-hidden shadow-sm border border-white">
                              <img src={product.imageUrl} alt={product.name} className="h-full w-full object-cover" />
                            </div>
                            <div className="flex flex-col">
                              <span className="font-black text-slate-900">{product.name}</span>
                              <Badge variant="outline" className="w-fit text-[9px] font-black uppercase tracking-tighter mt-1 bg-white">Hambúrgueres</Badge>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <span className="font-black text-accent italic">R$ {product.price.toFixed(2)}</span>
                        </TableCell>
                        <TableCell className="text-center">
                           <Badge variant="secondary" className="bg-green-100 text-green-700 font-black italic">35%</Badge>
                        </TableCell>
                        <TableCell className="text-right px-8">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="icon" className="rounded-2xl hover:bg-slate-200"><Wand2 className="h-4 w-4 text-slate-400" /></Button>
                            <Button variant="ghost" size="icon" className="rounded-2xl hover:bg-slate-200"><Edit2 className="h-4 w-4 text-slate-400" /></Button>
                            <Button variant="ghost" size="icon" className="rounded-2xl text-red-500 hover:text-red-600 hover:bg-red-50"><Trash2 className="h-4 w-4" /></Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
