
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Store, ShieldCheck, ArrowRight, Loader2, UserCircle, LayoutGrid } from "lucide-react";
import Link from 'next/link';
import { useToast } from "@/hooks/use-toast";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent | string) => {
    if (typeof e !== 'string') e.preventDefault();
    
    setLoading(true);
    const targetEmail = typeof e === 'string' ? e : email;
    
    // Simulação de login
    setTimeout(() => {
      if (targetEmail.includes('admin')) {
        router.push('/admin/dashboard');
        toast({ title: "Modo Administrador", description: "Bem-vindo ao Master Console." });
      } else {
        router.push('/merchant/burger-ze/dashboard');
        toast({ title: "Modo Lojista", description: "Bem-vindo ao seu Painel de Gestão." });
      }
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-body">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <div className="bg-primary p-2 rounded-xl text-white">
              <Store className="h-6 w-6" />
            </div>
            <span className="text-2xl font-black tracking-tighter text-slate-900 uppercase">MERCADO ÁGIL</span>
          </Link>
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter italic">Acesso ao Painel</h1>
          <p className="text-slate-500 font-medium italic opacity-70">Gerencie sua loja ou a plataforma global.</p>
        </div>

        <Card className="border-none shadow-2xl rounded-[40px] overflow-hidden bg-white">
          <CardHeader className="p-10 pb-4">
            <CardTitle className="text-xl font-black italic">Entrar</CardTitle>
            <CardDescription className="font-medium">Use suas credenciais ou os acessos rápidos abaixo.</CardDescription>
          </CardHeader>
          <CardContent className="p-10 pt-4 space-y-8">
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">E-mail</Label>
                <Input 
                  type="email" 
                  placeholder="seu@email.com" 
                  className="h-14 rounded-2xl bg-slate-50 border-none font-bold"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Senha</Label>
                  <Button variant="link" className="text-[10px] font-black uppercase tracking-widest text-primary p-0 h-auto">Esqueci a senha</Button>
                </div>
                <Input 
                  type="password" 
                  placeholder="••••••••" 
                  className="h-14 rounded-2xl bg-slate-50 border-none font-bold"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" disabled={loading} className="w-full h-16 bg-primary hover:bg-primary/90 rounded-[28px] text-lg font-black italic shadow-xl shadow-primary/20 gap-3">
                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <>Entrar no Painel <ArrowRight className="h-5 w-5" /></>}
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-slate-100"></span></div>
              <div className="relative flex justify-center text-[10px] uppercase font-black text-slate-400 bg-white px-2">Acesso Rápido (Demo)</div>
            </div>

            <div className="grid grid-cols-2 gap-4">
               <Button 
                variant="outline" 
                className="h-14 rounded-2xl border-2 border-slate-100 font-black italic text-xs gap-2 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all"
                onClick={() => handleLogin('admin@mercadoagil.com')}
               >
                 <ShieldCheck className="h-4 w-4" /> MASTER ADM
               </Button>
               <Button 
                variant="outline" 
                className="h-14 rounded-2xl border-2 border-slate-100 font-black italic text-xs gap-2 hover:bg-accent hover:text-white hover:border-accent transition-all"
                onClick={() => handleLogin('lojista@mercadoagil.com')}
               >
                 <UserCircle className="h-4 w-4" /> LOJISTA
               </Button>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-sm font-bold text-slate-400">
          Não tem uma loja? <Link href="/" className="text-primary hover:underline">Comece agora gratuitamente.</Link>
        </p>
      </div>
    </div>
  );
}
