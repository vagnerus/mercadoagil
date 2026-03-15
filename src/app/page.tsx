
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Store, ShieldCheck, ShoppingCart, ArrowRight, Zap, Globe, BarChart3, Star, CheckCircle2 } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation */}
      <header className="px-4 lg:px-6 h-16 flex items-center border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto flex items-center">
          <Link className="flex items-center justify-center gap-2" href="#">
            <div className="bg-primary p-1.5 rounded-lg text-white">
              <Store className="h-6 w-6" />
            </div>
            <span className="text-xl font-bold tracking-tight text-primary">Mercado Ágil</span>
          </Link>
          <nav className="ml-auto flex gap-4 sm:gap-6">
            <Link className="text-sm font-medium hover:text-primary transition-colors hidden md:block mt-2" href="/admin/dashboard">
              Painel Master
            </Link>
            <Link className="text-sm font-medium hover:text-primary transition-colors hidden md:block mt-2" href="/merchant/burger-ze/dashboard">
              Área do Lojista
            </Link>
            <Button variant="default" size="sm" asChild>
              <Link href="/store/burger-ze">Ver Demo Loja</Link>
            </Button>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-20 md:py-32 bg-gradient-to-b from-blue-50 to-white overflow-hidden relative">
          <div className="container px-4 md:px-6 mx-auto relative z-10">
            <div className="flex flex-col items-center space-y-8 text-center">
              <div className="space-y-4 max-w-3xl">
                <div className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium bg-primary/10 text-primary mb-4">
                  <Star className="h-4 w-4 mr-2 fill-primary" /> A plataforma nº 1 para novos lojistas
                </div>
                <h1 className="text-4xl font-extrabold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl/none text-slate-900 leading-tight">
                  Sua Loja Digital em <span className="text-primary italic">Minutos</span>
                </h1>
                <p className="mx-auto max-w-[700px] text-slate-500 md:text-xl/relaxed dark:text-slate-400">
                  A solução SaaS completa para delivery e e-commerce. Gestão de estoque com IA, 
                  pagamentos integrados e uma vitrine ultra-rápida.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button className="bg-primary text-white hover:bg-primary/90 px-10 py-7 text-lg h-auto rounded-full shadow-xl shadow-primary/30 transition-all hover:scale-105">
                  Criar Minha Loja <ArrowRight className="ml-2 h-6 w-6" />
                </Button>
                <Button variant="outline" className="px-10 py-7 text-lg h-auto rounded-full hover:bg-slate-50">
                  Falar com Consultor
                </Button>
              </div>
              <div className="flex items-center gap-8 pt-8 opacity-60 grayscale">
                <img src="https://picsum.photos/seed/brand1/120/40" alt="Logo Cliente" />
                <img src="https://picsum.photos/seed/brand2/120/40" alt="Logo Cliente" />
                <img src="https://picsum.photos/seed/brand3/120/40" alt="Logo Cliente" />
              </div>
            </div>
          </div>
          {/* Decorative element */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl -z-0"></div>
        </section>

        {/* Features Section */}
        <section className="w-full py-24 bg-white">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="text-center mb-16 space-y-4">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-slate-900">Tudo o que você precisa para crescer</h2>
              <p className="text-slate-500 max-w-2xl mx-auto">Ferramentas poderosas desenhadas para simplificar sua operação diária.</p>
            </div>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <div className="group flex flex-col items-center space-y-4 text-center p-8 rounded-3xl border bg-slate-50/30 hover:bg-white hover:shadow-2xl hover:-translate-y-2 transition-all">
                <div className="bg-primary/10 p-5 rounded-2xl group-hover:bg-primary group-hover:text-white transition-colors">
                  <ShieldCheck className="h-10 w-10 text-primary group-hover:text-white" />
                </div>
                <h3 className="text-2xl font-bold">Gestão Multi-Loja</h3>
                <p className="text-slate-500">
                  Gerencie múltiplas unidades de negócio em um único dashboard unificado com controle de permissões.
                </p>
              </div>
              <div className="group flex flex-col items-center space-y-4 text-center p-8 rounded-3xl border bg-slate-50/30 hover:bg-white hover:shadow-2xl hover:-translate-y-2 transition-all">
                <div className="bg-accent/10 p-5 rounded-2xl group-hover:bg-accent group-hover:text-white transition-colors">
                  <Zap className="h-10 w-10 text-accent group-hover:text-white" />
                </div>
                <h3 className="text-2xl font-bold">Catálogo com IA</h3>
                <p className="text-slate-500">
                  Deixe nossa IA escrever as descrições dos seus produtos de forma persuasiva e otimizada para SEO.
                </p>
              </div>
              <div className="group flex flex-col items-center space-y-4 text-center p-8 rounded-3xl border bg-slate-50/30 hover:bg-white hover:shadow-2xl hover:-translate-y-2 transition-all">
                <div className="bg-blue-600/10 p-5 rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <Globe className="h-10 w-10 text-blue-600 group-hover:text-white" />
                </div>
                <h3 className="text-2xl font-bold">Checkout Ágil</h3>
                <p className="text-slate-500">
                  Finalização de pedido em apenas 3 cliques. Aumente sua taxa de conversão em até 40% no mobile.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="w-full py-20 bg-slate-900 text-white relative overflow-hidden">
          <div className="container px-4 md:px-6 mx-auto relative z-10">
            <div className="grid gap-12 sm:grid-cols-3 text-center">
              <div className="space-y-2">
                <p className="text-5xl font-extrabold text-primary">800+</p>
                <p className="text-slate-400 text-lg">Lojistas Ativos</p>
              </div>
              <div className="space-y-2">
                <p className="text-5xl font-extrabold text-accent">R$ 5M+</p>
                <p className="text-slate-400 text-lg">Transacionados/mês</p>
              </div>
              <div className="space-y-2">
                <p className="text-5xl font-extrabold text-primary">99.99%</p>
                <p className="text-slate-400 text-lg">Uptime de Plataforma</p>
              </div>
            </div>
          </div>
          <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        </section>

        {/* Call to Action */}
        <section className="w-full py-24 bg-white">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="bg-primary/5 rounded-[40px] p-12 md:p-20 flex flex-col items-center text-center space-y-8 border border-primary/10">
              <h2 className="text-3xl md:text-5xl font-bold text-slate-900 max-w-2xl">Pronto para transformar seu delivery?</h2>
              <p className="text-slate-500 text-lg max-w-xl">Comece gratuitamente e expanda conforme sua necessidade. Sem taxas ocultas.</p>
              <div className="flex gap-4">
                <Button size="lg" className="rounded-full px-12 py-6 text-lg">Começar Agora</Button>
              </div>
              <div className="flex items-center gap-6 pt-4 text-sm font-medium text-slate-600">
                <span className="flex items-center gap-1"><CheckCircle2 className="h-4 w-4 text-green-500" /> Sem Cartão de Crédito</span>
                <span className="flex items-center gap-1"><CheckCircle2 className="h-4 w-4 text-green-500" /> Setup Grátis</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="w-full py-12 px-4 border-t bg-slate-50">
        <div className="container mx-auto grid md:grid-cols-4 gap-8">
          <div className="space-y-4">
             <Link className="flex items-center gap-2" href="#">
              <div className="bg-primary p-1.5 rounded-lg text-white">
                <Store className="h-5 w-5" />
              </div>
              <span className="text-lg font-bold tracking-tight text-primary">Mercado Ágil</span>
            </Link>
            <p className="text-sm text-slate-500">A plataforma definitiva para pequenos e médios lojistas digitais.</p>
          </div>
          <div>
            <h4 className="font-bold mb-4">Produto</h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li><Link href="#">Funcionalidades</Link></li>
              <li><Link href="#">Preços</Link></li>
              <li><Link href="#">Integrações</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Empresa</h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li><Link href="#">Sobre nós</Link></li>
              <li><Link href="#">Suporte</Link></li>
              <li><Link href="#">Contato</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Painéis</h4>
            <ul className="space-y-2 text-sm text-slate-600 font-medium">
              <li><Link href="/admin/dashboard" className="text-primary hover:underline">Painel Master Admin</Link></li>
              <li><Link href="/merchant/burger-ze/dashboard" className="text-accent hover:underline">Painel do Lojista</Link></li>
            </ul>
          </div>
        </div>
        <div className="container mx-auto border-t mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <p>© 2024 Mercado Ágil Tecnologia S.A. Todos os direitos reservados.</p>
          <nav className="flex gap-4 sm:gap-6">
            <Link className="hover:underline underline-offset-4" href="#">Termos de Uso</Link>
            <Link className="hover:underline underline-offset-4" href="#">Privacidade</Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
