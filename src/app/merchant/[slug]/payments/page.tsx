
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
import { collection, query, doc, where, limit } from 'firebase/firestore';
import { useToast } from "@/hooks/use-toast";

export default function MerchantPayments({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = React.use(params);
  const { user, isUserLoading } = useUser();
  const db = useFirestore();
  const { toast } = useToast();

  const merchantQuery = useMemoFirebase(() => query(
    collection(db, 'merchants'), 
    where('slug', '==', slug), 
    limit(1)
  ), [db, slug]);
  const { data: merchantData } = useCollection(merchantQuery);
  const merchantId = merchantData?.[0]?.id;
  
  const paymentsQuery = useMemoFirebase(() => {
    if (!merchantId) return null;
    return query(collection(db, 'merchants', merchantId, 'paymentMethods'));
  }, [db, merchantId]);

  const { data: paymentMethods, isLoading } = useCollection(paymentsQuery);

  const [newMethod, setNewMethod] = useState({
    type: 'PIX',
    details: '',
    isActive: true
  });

  const handleAddMethod = () => {
    if (!merchantId) return;

    if (!newMethod.details) {
      toast({ title: "Erro", description: "Informe os detalhes (ex: Chave PIX)", variant: "destructive" });
      return;
    }

    const methodId = `method_${Math.random().toString(36).substring(7)}`;
    const methodRef = doc(db, 'merchants', merchantId, 'paymentMethods', methodId);
    
    setDocumentNonBlocking(methodRef, {
      id: methodId,
      ...newMethod,
      createdAt: new Date().toISOString()
    }, { merge: true });

    setNewMethod({ type: 'PIX', details: '', isActive: true });
    toast({ title: "Método Adicionado", description: "Ativado com sucesso." });
  };

  const toggleMethodStatus = (method: any) => {
    if (!merchantId) return;
    const methodRef = doc(db, 'merchants', merchantId, 'paymentMethods', method.id);
    setDocumentNonBlocking(methodRef, { isActive: !method.isActive }, { merge: true });
    toast({ title: "Status Atualizado" });
  };

  const handleDeleteMethod = (id: string) => {
    if (!merchantId) return;
    const methodRef = doc(db, 'merchants', merchantId, 'paymentMethods', id);
    deleteDocumentNonBlocking(methodRef);
    toast({ title: "Removido" });
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-body">
      <aside className="w-64 border-r bg-white hidden lg:flex flex-col sticky top-0 h-screen">
        <div className="p-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-primary p-1.5 rounded-lg shadow-sm">
              <Package className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-lg text-slate-800 tracking-tight italic uppercase">MERCADO ÁGIL</span>
          </Link>
        </div>
        <nav className="flex-1 px-4 space-y-2">
          <Link href={`/merchant/${slug}/dashboard`} className="flex items-center gap-3 px-4 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors font-medium">
            <LayoutDashboard className="h-5 w-5" /> Dashboard
          </Link>
          <Link href={`/merchant/${slug}/finance`} className="flex items-center gap-3 px-4 py-2.5 bg-primary/10 text-primary rounded-xl font-bold">
            <Wallet className="h-5 w-5" /> Financeiro
          </Link>
          <Link href={`/merchant/${slug}/settings`} className="flex items-center gap-3 px-4 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors font-medium">
            <Settings className="h-5 w-5" /> Configurações
          </Link>
        </nav>
      </aside>

      <main className="flex-1 p-8">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black text-slate-900 italic tracking-tighter uppercase">Gateway de Pagamentos</h1>
            <p className="text-slate-500 font-medium italic">Configuração de métodos de recebimento da instância.</p>
          </div>
        </header>

        <div className="grid gap-8 lg:grid-cols-3">
          <Card className="lg:col-span-1 border-none shadow-sm rounded-[40px] overflow-hidden">
            <CardHeader className="bg-slate-900 p-8 text-white">
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
                    <option value="CASH">Dinheiro (Presencial)</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase text-slate-400 px-1">Detalhes (Chave ou Instrução)</Label>
                  <Input 
                    placeholder="ex: 11999998888" 
                    className="h-12 rounded-2xl bg-slate-50 border-none font-bold"
                    value={newMethod.details}
                    onChange={(e) => setNewMethod({...newMethod, details: e.target.value})}
                  />
                </div>

                <Button 
                  onClick={handleAddMethod}
                  disabled={!merchantId}
                  className="w-full h-16 bg-primary hover:bg-primary/90 text-white rounded-[28px] font-black italic text-lg shadow-xl"
                >
                  <Plus className="h-5 w-5" /> Adicionar Método
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="lg:col-span-2 space-y-6">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center p-20 space-y-4">
                <Loader2 className="animate-spin text-primary h-10 w-10" />
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Sincronizando métodos...</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {paymentMethods?.map((method: any) => (
                  <Card key={method.id} className="border-none shadow-sm rounded-3xl overflow-hidden bg-white">
                    <CardContent className="p-6 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`h-14 w-14 rounded-2xl flex items-center justify-center ${method.isActive ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-400'}`}>
                          {method.type === 'PIX' ? <Landmark className="h-6 w-6" /> : <CreditCard className="h-6 w-6" />}
                        </div>
                        <div>
                          <p className="font-black text-slate-900 italic text-lg uppercase">{method.type}</p>
                          <p className="text-xs font-bold text-slate-400 uppercase">{method.details}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <Switch checked={method.isActive} onCheckedChange={() => toggleMethodStatus(method)} />
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteMethod(method.id)} className="text-slate-300 hover:text-red-500">
                          <Trash2 className="h-5 w-5" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {paymentMethods?.length === 0 && (
                  <div className="p-20 text-center bg-white rounded-[40px] border-2 border-dashed border-slate-200">
                    <p className="font-bold text-slate-400 italic uppercase">Nenhum método configurado.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
