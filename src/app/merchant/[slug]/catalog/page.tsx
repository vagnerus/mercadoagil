
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
import { ProductAiGenerator } from "@/components/merchant/product-ai-generator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Plus, Search, Trash2, Edit2, LayoutDashboard, List, 
  ShoppingBag, Settings, Package, Image as ImageIcon, 
  Wand2, Download, TrendingUp, Sparkles, AlertCircle, 
  Lock, Zap, Box, Layers, MousePointer2, Layers3, FileJson, FileSpreadsheet, RefreshCw
} from "lucide-react";
import { MOCK_PRODUCTS, Product } from "@/lib/mock-data";
import Link from 'next/link';
import { useToast } from "@/hooks/use-toast";

export default function MerchantCatalog({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = React.use(params);
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [price, setPrice] = useState("");
  const [costPrice, setCostPrice] = useState("");
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [dynamicPricing, setDynamicPricing] = useState(true);
  const { toast } = useToast();

  const toggleSelect = (id: string) => {
    setSelectedItems(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const calculateMargin = () => {
    if (!price || !costPrice) return null;
    const p = parseFloat(price);
    const c = parseFloat(costPrice);
    if (isNaN(p) || isNaN(c) || p === 0) return null;
    const margin = ((p - c) / p) * 100;
    return margin.toFixed(1);
  };

  const handleSaveProduct = () => {
    if (!productName || !price) {
      toast({ title: "Erro", description: "Nome e preço são obrigatórios.", variant: "destructive" });
      return;
    }

    const newProduct: Product = {
      id: Math.random().toString(36).substring(7),
      merchantId: "m1",
      categoryId: "c1",
      name: productName,
      description: description,
      price: parseFloat(price),
      costPrice: parseFloat(costPrice) || 0,
      imageUrl: imageUrl || "https://picsum.photos/seed/placeholder/400/300",
      isAvailable: true,
      stock: 0
    };

    setProducts([newProduct, ...products]);
    toast({ title: "Produto Salvo!", description: `${productName} foi adicionado ao catálogo.` });
    
    setProductName("");
    setDescription("");
    setImageUrl("");
    setPrice("");
    setCostPrice("");
  };

  const handleBulkImport = () => {
    toast({ title: "Processando CSV...", description: "A IA está mapeando 150 novos produtos detectados." });
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-body">
      <aside className="w-64 border-r bg-white hidden lg:flex flex-col sticky top-0 h-screen">
        <div className="p-6">
          <Link href="/" className="flex items-center gap-2 font-black text-xl italic tracking-tighter text-primary">
            MERCADO ÁGIL
          </Link>
        </div>
        <nav className="flex-1 px-4 space-y-2">
          <Link href={`/merchant/${slug}/dashboard`} className="flex items-center gap-3 px-4 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors font-medium">
            <LayoutDashboard className="h-5 w-5" /> Dashboard
          </Link>
          <Link href={`/merchant/${slug}/catalog`} className="flex items-center gap-3 px-4 py-2.5 bg-accent/10 text-accent rounded-xl font-bold">
            <List className="h-5 w-5" /> Catálogo Pro
          </Link>
          <Link href={`/merchant/${slug}/inventory`} className="flex items-center gap-3 px-4 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors font-medium">
            <Box className="h-5 w-5" /> Multi-Estoques
          </Link>
          <Link href={`/merchant/${slug}/subscriptions`} className="flex items-center gap-3 px-4 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors font-medium">
            <Zap className="h-5 w-5" /> Assinaturas IA
          </Link>
        </nav>
      </aside>

      <main className="flex-1 p-8">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tighter italic uppercase">Gestão de Catálogo Enterprise</h1>
            <p className="text-slate-500 font-medium">Grade de produtos, kits e processamento massivo via IA.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="rounded-2xl h-12 gap-2 font-bold" onClick={handleBulkImport}><FileSpreadsheet className="h-4 w-4" /> Importar CSV/Excel</Button>
            <Button className="bg-slate-900 rounded-2xl h-12 gap-2 font-bold px-6 shadow-xl shadow-slate-200">
              <Plus className="h-5 w-5" /> Novo Item / Kit
            </Button>
          </div>
        </header>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-1 space-y-6">
            <Card className="border-none shadow-sm rounded-[40px] overflow-hidden bg-white">
              <CardHeader className="p-8 pb-4">
                <CardTitle className="text-xl font-black italic">Editor Global</CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                <div className="space-y-4">
                  <div className="h-48 w-full rounded-3xl bg-slate-100 border-2 border-dashed border-slate-200 flex flex-col items-center justify-center overflow-hidden relative group">
                    {imageUrl ? (
                      <img src={imageUrl} className="h-full w-full object-cover" alt="Preview" />
                    ) : (
                      <>
                        <ImageIcon className="h-10 w-10 text-slate-300 mb-2" />
                        <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Foto 4K Render</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Nome do Produto ou Kit</Label>
                    <Input 
                      placeholder="Ex: Combo Família Ultra" 
                      value={productName}
                      onChange={(e) => setProductName(e.target.value)}
                      className="rounded-2xl h-12 bg-slate-50 border-none font-bold"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Preço Venda</Label>
                      <Input 
                        type="number" 
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        className="rounded-2xl h-12 bg-slate-50 border-none font-bold text-primary" 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Custo Entrada</Label>
                      <Input 
                        type="number" 
                        value={costPrice}
                        onChange={(e) => setCostPrice(e.target.value)}
                        className="rounded-2xl h-12 bg-slate-50 border-none font-bold text-slate-400" 
                      />
                    </div>
                  </div>

                  <div className="p-6 bg-primary/5 rounded-[30px] border border-primary/10 space-y-4">
                     <div className="flex items-center justify-between">
                        <div className="space-y-1">
                           <p className="text-xs font-black italic text-primary">IA Dynamic Pricing</p>
                           <p className="text-[9px] text-slate-400 font-bold uppercase">Ajuste automático por demanda</p>
                        </div>
                        <Switch checked={dynamicPricing} onCheckedChange={setDynamicPricing} />
                     </div>
                     {calculateMargin() && (
                        <div className="flex justify-between items-center pt-2 border-t border-dashed border-primary/20">
                           <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Margem Real</span>
                           <Badge className="bg-green-500 text-white font-black italic border-none">{calculateMargin()}%</Badge>
                        </div>
                     )}
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Descrição Comercial (IA Friendly)</Label>
                    <Textarea 
                      rows={3} 
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="rounded-2xl bg-slate-50 border-none font-medium resize-none"
                    />
                  </div>
                </div>

                <ProductAiGenerator productName={productName} onDescriptionGenerated={setDescription} onImageGenerated={setImageUrl} />

                <Button onClick={handleSaveProduct} className="w-full bg-accent hover:bg-accent/90 h-16 rounded-[28px] text-lg font-black italic shadow-xl shadow-accent/20">Publicar no Ecossistema</Button>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <Card className="border-none shadow-sm rounded-[40px] overflow-hidden bg-white">
              <CardHeader className="p-8 border-b flex flex-row items-center justify-between">
                <div className="flex items-center gap-4">
                  <CardTitle className="text-xl font-black italic">Inventário Ativo</CardTitle>
                  <div className="relative w-64">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input className="pl-12 bg-slate-100 border-none rounded-2xl h-12 font-medium" placeholder="Buscar SKU, Cor, Lote..." />
                  </div>
                </div>
                <div className="flex gap-2">
                   <Button variant="ghost" size="icon" className="rounded-xl"><RefreshCw className="h-5 w-5 text-slate-400" /></Button>
                   <Button variant="ghost" size="icon" className="rounded-xl"><Download className="h-5 w-5 text-slate-400" /></Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader className="bg-slate-50/50">
                    <TableRow>
                      <TableHead className="w-12 px-8"></TableHead>
                      <TableHead className="font-black uppercase text-[10px] tracking-widest">Especificação / Grade</TableHead>
                      <TableHead className="font-black uppercase text-[10px] tracking-widest text-center">Status Venda</TableHead>
                      <TableHead className="font-black uppercase text-[10px] tracking-widest text-right px-8">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.map((product) => (
                      <TableRow key={product.id} className="hover:bg-slate-50 transition-colors">
                        <TableCell className="px-8">
                          <Checkbox checked={selectedItems.includes(product.id)} onCheckedChange={() => toggleSelect(product.id)} className="rounded-md" />
                        </TableCell>
                        <TableCell className="py-6">
                          <div className="flex items-center gap-4">
                            <div className="h-16 w-16 rounded-2xl bg-slate-200 overflow-hidden shadow-sm border border-white relative group">
                              <img src={product.imageUrl} alt={product.name} className="h-full w-full object-cover transition-transform group-hover:scale-110" />
                              {product.isLoyaltyExclusive && (
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                   <Lock className="h-4 w-4 text-yellow-400" />
                                </div>
                              )}
                            </div>
                            <div className="flex flex-col">
                              <div className="flex items-center gap-2">
                                <span className="font-black text-slate-900">{product.name}</span>
                                <Badge variant="secondary" className="bg-blue-50 text-blue-600 text-[8px] border-none font-bold uppercase">SKU: {product.id.slice(0, 5).toUpperCase()}</Badge>
                              </div>
                              <div className="flex gap-1 mt-1">
                                <Badge variant="outline" className="text-[8px] font-black uppercase text-slate-400">Grade: Única</Badge>
                                <Badge variant="outline" className="text-[8px] font-black uppercase text-slate-400">Estoque: {product.stock || 0}</Badge>
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex flex-col items-center">
                             <span className="font-black text-primary text-lg italic">R$ {product.price.toFixed(2)}</span>
                             {dynamicPricing && (
                               <Badge className="mt-1 bg-green-100 text-green-600 text-[8px] font-black border-none animate-pulse">Preço Otimizado IA</Badge>
                             )}
                          </div>
                        </TableCell>
                        <TableCell className="text-right px-8">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="icon" className="rounded-2xl hover:bg-slate-200"><Wand2 className="h-4 w-4 text-slate-400" /></Button>
                            <Button variant="ghost" size="icon" className="rounded-2xl hover:bg-slate-200"><Edit2 className="h-4 w-4 text-slate-400" /></Button>
                            <Button variant="ghost" size="icon" className="rounded-2xl hover:text-red-500"><Trash2 className="h-4 w-4" /></Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm p-8 rounded-[40px] bg-slate-900 text-white relative overflow-hidden">
               <div className="relative z-10 flex justify-between items-center">
                  <div className="space-y-4 max-w-md">
                     <div className="flex items-center gap-2 text-accent">
                        <Zap className="h-5 w-5 fill-current" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Plano de Recorrência IA</span>
                     </div>
                     <h3 className="text-2xl font-black italic">Gerar Clube de Assinaturas</h3>
                     <p className="text-slate-400 text-sm font-medium leading-relaxed">
                        Nossa IA detectou que seus clientes compram {products[0]?.name} a cada 15 dias. Deseja criar um plano de assinatura mensal com 15% de desconto automático?
                     </p>
                     <Button className="h-12 bg-white text-slate-900 rounded-xl font-black italic px-8 hover:bg-slate-50">Configurar Assinatura IA</Button>
                  </div>
                  <Layers className="h-32 w-32 opacity-5 text-white" />
               </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
