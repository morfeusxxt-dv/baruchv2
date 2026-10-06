import { motion } from 'framer-motion'
import { ArrowDown, ArrowRight, ShieldCheck, Sparkles, PhoneCall, MapPin, CheckCircle2, ChevronRight, Calculator } from 'lucide-react'
import { Button, Logo } from '../components/ui'
import { BrandsSection, CtaFinal, ExperienceSection, FeaturedCarousel, Metrics, TrustSection } from '../components/sections'
import { Consorcio as ConsorcioTeaser } from './Institucional'
import { SITE, waLink } from '../lib/data'

export default function Home() {
  return (
    <>
      {/* HERO SECTION - Editorial, cinematográfico e com visual de showroom premium */}
      <section className="relative flex min-h-[92svh] items-center overflow-hidden pb-20 pt-32 lg:min-h-[96svh] lg:pt-36 bg-gradient-to-b from-slate-50/90 via-white to-yellow-50/30" aria-labelledby="hero-title">
        {/* Glows arquitetônicos de iluminação suave */}
        <div className="pointer-events-none absolute -right-20 -top-20 h-[550px] w-[550px] rounded-full bg-yellow-400/15 blur-3xl" />
        <div className="pointer-events-none absolute -left-20 top-1/3 h-[450px] w-[450px] rounded-full bg-yellow-300/10 blur-3xl" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:32px_32px] opacity-35" />

        <div className="relative mx-auto w-full max-w-[1480px] px-6 lg:px-12">
          <div className="grid items-center gap-12 lg:grid-cols-[1.15fr_0.85fr]">
            {/* Coluna de Texto e CTAs */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center gap-2.5 rounded-full border border-yellow-300/90 bg-yellow-50/90 px-4 py-1.5 text-xs font-bold text-yellow-900 shadow-sm backdrop-blur"
              >
                <Sparkles size={14} className="text-yellow-600" />
                <span>Showroom Digital Baruch · São Luís, Maranhão</span>
              </motion.div>

              <h1 id="hero-title" className="mt-6 text-[clamp(2.8rem,7vw,6rem)] font-extrabold tracking-tight text-slate-950 leading-[0.98]">
                Vamos trocar de <br className="hidden sm:inline" />
                <span className="relative inline-block text-slate-900">
                  carro hoje?
                  <svg className="absolute -bottom-2 left-0 w-full h-3.5 text-yellow-400 opacity-80" viewBox="0 0 100 20" preserveAspectRatio="none">
                    <path d="M0 15 Q 50 0, 100 15" stroke="currentColor" strokeWidth="6" fill="transparent" strokeLinecap="round" />
                  </svg>
                </span>
              </h1>

              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.7 }}
                className="mt-7 max-w-xl text-lg md:text-xl text-slate-600 leading-relaxed font-normal"
              >
                Os melhores seminovos selecionados e motos Yamaha 0km com as condições mais transparentes de São Luís você encontra aqui.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35, duration: 0.7 }}
                className="mt-10 flex flex-wrap items-center gap-4"
              >
                <Button to="/estoque" arrow>
                  Explorar estoque completo
                </Button>
                <Button href={waLink('Olá! Gostaria de falar com um consultor da Baruch.')} variant="ghost">
                  <PhoneCall size={16} className="text-yellow-600" />
                  Falar com consultor
                </Button>
              </motion.div>

              {/* Badges de garantia rápidos */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="mt-12 flex flex-wrap items-center gap-5 border-t border-slate-200/80 pt-7 text-xs font-semibold text-slate-600"
              >
                <span className="flex items-center gap-2">
                  <ShieldCheck size={16} className="text-yellow-600" /> +10 anos de história
                </span>
                <span className="h-3 w-px bg-slate-300" />
                <span className="flex items-center gap-2">
                  <ShieldCheck size={16} className="text-yellow-600" /> 100% Procedência e Laudo
                </span>
                <span className="h-3 w-px bg-slate-300" />
                <span className="flex items-center gap-2">
                  <ShieldCheck size={16} className="text-yellow-600" /> Atendimento Personalizado
                </span>
              </motion.div>
            </div>

            {/* Coluna Visual de Showroom (Card Flutuante em Perspectiva) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.8 }}
              className="relative hidden lg:block"
            >
              <div className="relative overflow-hidden rounded-3xl border-2 border-yellow-300/80 bg-white p-3 shadow-2xl shadow-yellow-500/10">
                <div className="aspect-[4/3] overflow-hidden rounded-2xl bg-slate-100 relative">
                  <img
                    src="/images/showroom.jpg"
                    alt="Showroom moderno Baruch Veículos em São Luís"
                    className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white">
                    <div>
                      <span className="flex items-center gap-1.5 text-xs font-bold text-yellow-400">
                        <MapPin size={13} /> Av. dos Africanos, 386 · São Luís
                      </span>
                      <p className="text-sm font-bold text-white mt-0.5">Showroom Físico & Digital</p>
                    </div>
                    <span className="rounded-full bg-yellow-400 px-3 py-1 text-[11px] font-extrabold text-slate-950 shadow">
                      Aberto hoje
                    </span>
                  </div>
                </div>
              </div>

              {/* Card Flutuante de Avaliação Rápida */}
              <div className="absolute -bottom-6 -left-6 flex items-center gap-3 rounded-2xl border border-slate-100 bg-white/95 p-3.5 shadow-xl backdrop-blur-md">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-yellow-100 text-yellow-800 font-bold">
                  <CheckCircle2 size={20} />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">Veículos Inspecionados</p>
                  <p className="text-[11px] text-slate-500">Garantia e Laudo Cautelar</p>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="mt-12">
            <a href="#destaques-section" className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-slate-400 transition hover:text-slate-900">
              Explorar veículos em destaque <ArrowDown size={14} className="animate-bounce text-yellow-600" />
            </a>
          </div>
        </div>
      </section>

      {/* MÉTRICAS */}
      <Metrics />

      {/* ESTOQUE EM DESTAQUE */}
      <div id="destaques-section">
        <FeaturedCarousel />
      </div>

      {/* SHOWROOM MOTOS YAMAHA DESTAQUE COM FOTO REAL */}
      <section className="bg-gradient-to-b from-white via-yellow-50/30 to-slate-50/60 py-20 relative overflow-hidden">
        <div className="mx-auto max-w-[1480px] px-6 lg:px-12">
          <div className="relative overflow-hidden rounded-[2.5rem] border-2 border-yellow-300 bg-gradient-to-br from-yellow-50/90 via-white to-yellow-100/60 shadow-xl">
            <div className="grid lg:grid-cols-[1.1fr_0.9fr] items-center">
              {/* Lado do Conteúdo */}
              <div className="p-8 sm:p-12 lg:p-14 relative z-10">
                <div className="inline-flex items-center gap-2 rounded-full bg-yellow-400 px-3.5 py-1 text-xs font-bold text-slate-950 mb-4 shadow-sm">
                  <span>🏍️ Showroom Oficial Yamaha 0km</span>
                </div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-950 tracking-tight leading-[1.1]">
                  Procurando uma moto Yamaha com entrega imediata?
                </h2>
                <p className="mt-4 text-sm sm:text-base text-slate-600 leading-relaxed max-w-lg">
                  Confira a linha completa <strong>Yamaha FZ15, Aerox Connected, Fluo Hybrid, Crosser 150 e Neos 100% Elétrica</strong> com 3 anos de garantia e planos de consórcio sem juros a partir de <strong>R$ 277,06/mês</strong>.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Button to="/motos" arrow>
                    Ver Catálogo de Motos
                  </Button>
                  <Button to="/consorcio" variant="ghost">
                    Simular Consórcio
                  </Button>
                </div>
              </div>

              {/* Lado da Imagem com Fade */}
              <div className="relative h-64 sm:h-80 lg:h-full min-h-[320px] overflow-hidden">
                <img
                  src="/images/yamaha_showcase.jpg"
                  alt="Linha de Motocicletas Yamaha Showroom Baruch"
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-yellow-50/90 via-transparent to-transparent" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MARCAS */}
      <BrandsSection />

      {/* PILARES DE CONFIANÇA */}
      <TrustSection />

      {/* HISTÓRIA E EXPERIÊNCIA BARUCH */}
      <ExperienceSection />

      {/* CONSÓRCIO YAMAHA */}
      <ConsorcioTeaser teaser />

      {/* CTA DE CONVERSÃO FINAL */}
      <CtaFinal />
    </>
  )
}
