import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Store, ShieldCheck, ShoppingCart, ArrowRight, Zap, Globe, BarChart3 } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation */}
      <header className="px-4 lg:px-6 h-16 flex items-center border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <Link className="flex items-center justify-center gap-2" href="#">
          <div className="bg-primary p-1.5 rounded-lg text-white">
            <Store className="h-6 w-6" />
          </div>
          <span className="text-xl font-bold tracking-tight text-primary">Mercado Ágil</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link className="text-sm font-medium hover:text-primary transition-colors" href="/admin/dashboard">
            Painel Master
          </Link>
          <Link className="text-sm font-medium hover:text-primary transition-colors" href="/merchant/burger-ze/dashboard">
            Área do Lojista
          </Link>
          <Link className="text-sm font-medium hover:text-primary transition-colors" href="/store/burger-ze">
            Ver Demo Loja
          </Link>
        </nav>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-blue-50 to-white">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none text-slate-900">
                  Sua Loja Digital em <span className="text-primary">Minutos</span>
                </h1>
                <p className="mx-auto max-w-[700px] text-slate-500 md:text-xl dark:text-slate-400">
                  Plataforma SaaS multi-tenant completa para e-commerce e delivery. 
                  Gestão inteligente, catálogo digital e vendas simplificadas.
                </p>
              </div>
              <div className="space-x-4">
                <Button className="bg-primary text-white hover:bg-primary/90 px-8 py-6 text-lg h-auto rounded-full shadow-lg shadow-primary/20">
                  Começar Agora <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button variant="outline" className="px-8 py-6 text-lg h-auto rounded-full">
                  Agendar Demo
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-white">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
              <div className="flex flex-col items-center space-y-4 text-center p-6 rounded-2xl border bg-slate-50/50 hover:shadow-xl transition-all">
                <div className="bg-primary/10 p-4 rounded-full">
                  <ShieldCheck className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Painel de Gestão</h3>
                <p className="text-slate-500">
                  Controle total sobre seu negócio, clientes e faturamento em uma interface intuitiva.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center p-6 rounded-2xl border bg-slate-50/50 hover:shadow-xl transition-all">
                <div className="bg-accent/10 p-4 rounded-full">
                  <Zap className="h-8 w-8 text-accent" />
                </div>
                <h3 className="text-xl font-bold">IA de Produtos</h3>
                <p className="text-slate-500">
                  Gere descrições profissionais e otimizadas para SEO automaticamente com nossa inteligência artificial.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center p-6 rounded-2xl border bg-slate-50/50 hover:shadow-xl transition-all">
                <div className="bg-blue-600/10 p-4 rounded-full">
                  <Globe className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold">Frente de Loja PWA</h3>
                <p className="text-slate-500">
                  Experiência mobile-first ultra rápida para seus clientes, sem necessidade de download.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="w-full py-12 md:py-24 bg-slate-900 text-white">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="grid gap-10 sm:grid-cols-3 text-center">
              <div className="space-y-2">
                <p className="text-4xl font-bold text-primary">500+</p>
                <p className="text-slate-400">Lojistas Ativos</p>
              </div>
              <div className="space-y-2">
                <p className="text-4xl font-bold text-accent">R$ 2M+</p>
                <p className="text-slate-400">Transacionados/mês</p>
              </div>
              <div className="space-y-2">
                <p className="text-4xl font-bold text-primary">99.9%</p>
                <p className="text-slate-400">Uptime Garantido</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="w-full py-6 px-4 border-t flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-slate-500 bg-white">
        <p>© 2024 Mercado Ágil. Todos os direitos reservados.</p>
        <nav className="flex gap-4 sm:gap-6">
          <Link className="hover:underline underline-offset-4" href="#">Termos de Uso</Link>
          <Link className="hover:underline underline-offset-4" href="#">Privacidade</Link>
        </nav>
      </footer>
    </div>
  );
}