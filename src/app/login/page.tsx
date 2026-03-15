
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Store, ShieldCheck, ArrowRight, Loader2 } from "lucide-react";
import Link from 'next/link';
import { useToast } from "@/hooks/use-toast";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulação de login
    setTimeout(() => {
      if (email.includes('admin')) {
        router.push('/admin/dashboard');
      } else {
        router.push('/merchant/burger-ze/dashboard');
      }
      toast({ title: "Bem-vindo!", description: "Acesso autorizado com sucesso." });
      setLoading(false);
    }, 1500);
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
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter italic">Bem-vindo de volta!</h1>
          <p className="text-slate-500 font-medium italic opacity-70 italic">Gerencie sua loja ou plataforma em um só lugar.</p>
        </div>

        <Card className="border-none shadow-2xl rounded-[40px] overflow-hidden bg-white">
          <CardHeader className="p-10 pb-4">
            <CardTitle className="text-xl font-black italic">Acesse sua conta</CardTitle>
            <CardDescription className="font-medium">Entre com seu e-mail e senha cadastrados.</CardDescription>
          </CardHeader>
          <CardContent className="p-10 pt-4">
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">E-mail</Label>
                <Input 
                  type="email" 
                  placeholder="admin@mercadoagil.com" 
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
          </CardContent>
        </Card>

        <p className="text-center text-sm font-bold text-slate-400">
          Não tem uma loja? <Link href="/" className="text-primary hover:underline">Comece agora gratuitamente.</Link>
        </p>
      </div>
    </div>
  );
}
