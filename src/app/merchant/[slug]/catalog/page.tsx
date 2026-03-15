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
import { Plus, Search, Trash2, Edit2, LayoutDashboard, List, ShoppingBag, Settings, Package, Image as ImageIcon } from "lucide-react";
import { MOCK_PRODUCTS, MOCK_CATEGORIES } from "@/lib/mock-data";
import Link from 'next/link';

export default function MerchantCatalog({ params }: { params: { slug: string } }) {
  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
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
          <Link href={`/merchant/${params.slug}/settings`} className="flex items-center gap-3 px-4 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors font-medium">
            <Settings className="h-5 w-5" /> Configurações
          </Link>
        </nav>
      </aside>

      <main className="flex-1 p-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Gestão de Cardápio</h1>
          <p className="text-slate-500 mt-1">Gerencie seus produtos e categorias com inteligência artificial.</p>
        </header>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Form to add product */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="border-none shadow-sm rounded-3xl">
              <CardHeader>
                <CardTitle className="text-xl">Adicionar Produto</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2 text-center">
                  <div className="h-40 w-full rounded-2xl bg-slate-100 border-2 border-dashed border-slate-200 flex flex-col items-center justify-center overflow-hidden relative group">
                    {imageUrl ? (
                      <img src={imageUrl} className="h-full w-full object-cover" alt="Preview" />
                    ) : (
                      <>
                        <ImageIcon className="h-8 w-8 text-slate-400 mb-2" />
                        <span className="text-xs text-slate-400 font-medium">Imagem do Produto</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name">Nome do Produto</Label>
                  <Input 
                    id="name" 
                    placeholder="Ex: Hambúrguer de Picanha" 
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    className="rounded-xl"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Categoria</Label>
                    <Select>
                      <SelectTrigger className="rounded-xl">
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        {MOCK_CATEGORIES.map(cat => (
                          <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="price">Preço (R$)</Label>
                    <Input id="price" type="number" step="0.01" placeholder="0,00" className="rounded-xl" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="desc">Descrição</Label>
                  <Textarea 
                    id="desc" 
                    rows={3} 
                    placeholder="Fale sobre os ingredientes..." 
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="rounded-xl resize-none"
                  />
                </div>

                <ProductAiGenerator 
                  productName={productName} 
                  onDescriptionGenerated={setDescription} 
                  onImageGenerated={setImageUrl}
                />

                <Button className="w-full bg-accent hover:bg-accent/90 py-6 rounded-2xl text-lg font-bold">Salvar no Cardápio</Button>
              </CardContent>
            </Card>
          </div>

          {/* Product List */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-none shadow-sm rounded-3xl overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between border-b bg-white p-6">
                <CardTitle className="text-xl">Catálogo Ativo</CardTitle>
                <div className="relative w-64">
                   <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                   <Input className="pl-9 bg-slate-50 border-none rounded-xl" placeholder="Buscar produto..." />
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader className="bg-slate-50/50">
                    <TableRow>
                      <TableHead className="px-6">Item</TableHead>
                      <TableHead>Preço</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right px-6">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {MOCK_PRODUCTS.map((product) => (
                      <TableRow key={product.id} className="hover:bg-slate-50 transition-colors">
                        <TableCell className="px-6 py-4">
                          <div className="flex items-center gap-4">
                            <div className="h-14 w-14 rounded-2xl bg-slate-200 overflow-hidden shadow-sm border">
                              <img src={product.imageUrl} alt={product.name} className="h-full w-full object-cover" />
                            </div>
                            <div className="flex flex-col">
                              <span className="font-bold text-slate-900">{product.name}</span>
                              <span className="text-xs text-slate-400">ID: {product.id.toUpperCase()}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="font-black text-accent">R$ {product.price.toFixed(2)}</TableCell>
                        <TableCell>
                           <Badge variant="outline" className={product.isAvailable ? "bg-green-100 text-green-700 border-green-200 rounded-lg" : "bg-slate-100 text-slate-500 border-slate-200 rounded-lg"}>
                              {product.isAvailable ? "Venda Ativa" : "Pausado"}
                           </Badge>
                        </TableCell>
                        <TableCell className="text-right px-6">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="icon" className="rounded-full hover:bg-slate-200"><Edit2 className="h-4 w-4" /></Button>
                            <Button variant="ghost" size="icon" className="rounded-full text-red-500 hover:text-red-600 hover:bg-red-50"><Trash2 className="h-4 w-4" /></Button>
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
