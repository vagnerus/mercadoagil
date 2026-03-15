
"use client";

import * as React from 'react';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { LayoutDashboard, ShoppingBag, List, Settings, Package, CreditCard, Landmark, Wallet, Plus, Trash2, Smartphone, Save, Loader2, AlertCircle } from "lucide-react";
import Link from 'next/link';
import { useFirestore, useCollection, setDocumentNonBlocking, deleteDocumentNonBlocking, useMemoFirebase, useUser } from '@/firebase';
import { collection, query, doc } from 'firebase/firestore';
import { useToast } from "@/hooks/use-toast";

export default function MerchantPayments({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = React.use(params);
  const { user, isUserLoading } = useUser();
  const db = useFirestore();
  const { toast } = useToast();
  
  const paymentsQuery = useMemoFirebase(() => {
    if (!user) return null;
    return query(collection(db, 'merchants', 'm1', 'paymentMethods'));
  }, [db, user]);

  const { data: paymentMethods, isLoading } = useCollection(paymentsQuery);

  const [newMethod, setNewMethod] = useState({
    type: 'PIX',
    details: '',
    isActive: true
  });

  const handleAddMethod = () => {
    if (!user) {
      toast({ title: "Acesso Negado", description: "Você precisa estar logado para salvar alterações.", variant: "destructive" });
      return;
    }

    if (!newMethod.details) {
      toast({ title: "Erro", description: "Informe os detalhes (ex: Chave PIX)", variant: "destructive" });
      return;
    }

    const methodId = `method_${Math.random().toString(36).substring(7)}`;
    const methodRef = doc(db, 'merchants', 'm1', 'paymentMethods', methodId);
    
    setDocumentNonBlocking(methodRef, {
      id: methodId,
      ...newMethod,
      createdAt: new Date().toISOString()
    }, { merge: true });

    setNewMethod({ type: 'PIX', details: '', isActive: true });
    toast({ title: "Método Adicionado", description: "Sua loja já pode receber via " + newMethod.type });
  };

  const toggleMethodStatus = (method: any) => {
    const methodRef = doc(db, 'merchants', 'm1', 'paymentMethods', method.id);
    setDocumentNonBlocking(methodRef, { isActive: !method.isActive }, { merge: true });
    toast({ title: "Status Atualizado", description: `Método ${method.type} ${!method.isActive ? 'ativado' : 'desativado'}.` });
  };

  const handleDeleteMethod = (id: string) => {
    const methodRef = doc(db, 'merchants', 'm1', 'paymentMethods', id);
    deleteDocumentNonBlocking(methodRef);
    toast({ title: "Removido", description: "Método de pagamento excluído com sucesso." });
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
          <Link href={`/merchant/${slug}/dashboard`} className="flex items-center gap-3 px-4 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors font-medium">
            <LayoutDashboard className="h-5 w-5" /> Dashboard
          </Link>
          <Link href={`/merchant/${slug}/orders`} className="flex items-center gap-3 px-4 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors font-medium">
            <ShoppingBag className="h-5 w-5" /> Pedidos
          </Link>
          <Link href={`/merchant/${slug}/payments`} className="flex items-center gap-3 px-4 py-2.5 bg-accent/10 text-accent rounded-xl font-bold">
            <Wallet className="h-5 w-5" /> Pagamentos
          </Link>
          <Link href={`/merchant/${slug}/settings`} className="flex items-center gap-3 px-4 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors font-medium">
            <Settings className="h-5 w-5" /> Configurações
          </Link>
        </nav>
      </aside>

      <main className="flex-1 p-8">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black text-slate-900 italic tracking-tighter">Inovação em Pagamentos</h1>
            <p className="text-slate-500 font-medium">Adicione formas de recebimento e automatize seu checkout.</p>
          </div>
          {!user && !isUserLoading && (
            <Badge variant="destructive" className="animate-pulse gap-2 py-2 px-4 rounded-xl">
              <AlertCircle className="h-4 w-4" /> Sessão não sincronizada. Por favor, faça login.
            </Badge>
          )}
        </header>

        <div className="grid gap-8 lg:grid-cols-3">
          <Card className="lg:col-span-1 border-none shadow-sm rounded-[40px] overflow-hidden">
            <CardHeader className="bg-primary p-8 text-white">
              <CardTitle className="text-xl font-black italic">Novo Método</CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase text-slate-400 px-1">Tipo de Pagamento</Label>
                  <select 
                    className="w-full h-12 rounded-2xl bg-slate-50 border-none font-bold px-4 outline-none appearance-none"
                    value={newMethod.type}
                    onChange={(e) => setNewMethod({...newMethod, type: e.target.value})}
                  >
                    <option value="PIX">PIX (Instantâneo)</option>
                    <option value="CREDIT_CARD">Cartão de Crédito</option>
                    <option value="DEBIT_CARD">Cartão de Débito</option>
                    <option value="CASH">Dinheiro (Entrega)</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase text-slate-400 px-1">
                    {newMethod.type === 'PIX' ? 'Chave PIX' : 'Instruções / Detalhes'}
                  </Label>
                  <Input 
                    placeholder={newMethod.type === 'PIX' ? "ex: 11999998888 ou e-mail" : "ex: Aceitamos Visa/Master"} 
                    className="h-12 rounded-2xl bg-slate-50 border-none font-bold"
                    value={newMethod.details}
                    onChange={(e) => setNewMethod({...newMethod, details: e.target.value})}
                  />
                </div>

                <Button 
                  onClick={handleAddMethod}
                  disabled={!user}
                  className="w-full h-16 bg-slate-900 rounded-[28px] font-black italic text-lg shadow-xl shadow-slate-200 gap-2 disabled:opacity-50"
                >
                  <Plus className="h-5 w-5" /> Ativar Método
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="lg:col-span-2 space-y-6">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-2">Métodos Disponíveis na Loja</h3>
            
            {isLoading ? (
              <div className="flex flex-col items-center justify-center p-20 space-y-4">
                <Loader2 className="animate-spin text-primary h-10 w-10" />
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Sincronizando Banco de Dados...</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {paymentMethods?.map((method: any) => (
                  <Card key={method.id} className="border-none shadow-sm rounded-3xl overflow-hidden group hover:scale-[1.01] transition-all">
                    <CardContent className="p-6 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`h-14 w-14 rounded-2xl flex items-center justify-center ${method.isActive ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-400'}`}>
                          {method.type === 'PIX' ? <Landmark className="h-6 w-6" /> : <CreditCard className="h-6 w-6" />}
                        </div>
                        <div>
                          <p className="font-black text-slate-900 italic text-lg">{method.type}</p>
                          <p className="text-xs font-bold text-slate-400">{method.details}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="flex flex-col items-end gap-1">
                          <span className="text-[8px] font-black uppercase text-slate-400">Visibilidade</span>
                          <Switch 
                            checked={method.isActive} 
                            onCheckedChange={() => toggleMethodStatus(method)}
                          />
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteMethod(method.id)} className="text-slate-300 hover:text-red-500 rounded-xl">
                          <Trash2 className="h-5 w-5" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {paymentMethods?.length === 0 && (
                  <div className="p-20 text-center bg-white rounded-[40px] border-2 border-dashed border-slate-200">
                    <Smartphone className="h-12 w-12 text-slate-200 mx-auto mb-4" />
                    <p className="font-bold text-slate-400 italic">Nenhum método configurado. Sua loja está operando apenas com pagamento offline.</p>
                  </div>
                )}
              </div>
            )}

            <Card className="border-none shadow-sm p-8 rounded-[40px] bg-slate-900 text-white relative overflow-hidden">
               <div className="relative z-10 space-y-4">
                  <div className="flex items-center gap-2 text-primary">
                    <Smartphone className="h-5 w-5" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Inovação Mercado Ágil</span>
                  </div>
                  <h3 className="text-2xl font-black italic">Fluxo de Pagamento Inteligente</h3>
                  <p className="text-slate-400 text-sm font-medium leading-relaxed">
                    Ao adicionar novos métodos, você está personalizando a vitrine do cliente. O sistema cuida da lógica de exibição para garantir que você receba o dinheiro da forma que preferir.
                  </p>
               </div>
               <Landmark className="absolute -bottom-10 -right-10 h-40 w-40 opacity-5" />
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
