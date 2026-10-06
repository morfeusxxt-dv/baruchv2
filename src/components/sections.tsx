import { useCallback } from 'react'
import { Link } from 'react-router-dom'
import useEmblaCarousel from 'embla-carousel-react'
import { ArrowLeft, ArrowRight, ShieldCheck, Gauge, Zap, CheckCircle2, Sparkles, Star, MapPin, Award } from 'lucide-react'
import { Button, Img, Reveal, SectionHeading } from './ui'
import { VehicleCard } from './VehicleCard'
import { BRANDS, brandCount, brandIcon, featured, vehicles, waLink } from '../lib/data'

export function Metrics() {
  const items = [
    ['+10', 'anos', 'de história e tradição em São Luís'],
    ['100%', 'procedência', 'garantida e histórico verificado'],
    ['Km', 'real', 'comprovada com laudo cautelar'],
    ['Ágil', 'atendimento', 'especializado e humanizado'],
  ]
  return (
    <section aria-label="Indicadores de confiança" className="relative z-10 -mt-10 mx-auto max-w-[1480px] px-6 lg:px-12">
      <div className="rounded-3xl border border-slate-200/80 bg-white/90 p-2 shadow-[0_12px_36px_rgba(0,0,0,0.04)] backdrop-blur-md">
        <div className="grid grid-cols-2 lg:grid-cols-4 divide-y lg:divide-y-0 lg:divide-x divide-slate-100">
          {items.map(([a, b, c], i) => (
            <Reveal key={a} delay={i * 0.05} y={10} className="px-6 py-6 sm:py-8 lg:px-8">
              <div className="inline-block rounded-lg bg-yellow-50 px-2.5 py-0.5 mb-2 border border-yellow-200/80">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-yellow-900">{b}</span>
              </div>
              <p className="font-display text-3xl sm:text-4xl font-extrabold text-slate-950">{a}</p>
              <p className="mt-1 text-xs font-medium text-slate-500 leading-relaxed">{c}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

export function FeaturedCarousel() {
  const [ref, api] = useEmblaCarousel({ align: 'start', dragFree: true, containScroll: 'trimSnaps' })
  const prev = useCallback(() => api?.scrollPrev(), [api])
  const next = useCallback(() => api?.scrollNext(), [api])
  
  return (
    <section className="bg-gradient-to-b from-yellow-50/30 via-slate-50/50 to-white py-24 lg:py-32 relative overflow-hidden" aria-labelledby="destaques">
      {/* Glow suave */}
      <div className="pointer-events-none absolute -left-40 top-1/4 h-96 w-96 rounded-full bg-yellow-400/10 blur-3xl" />
      
      <div className="mx-auto max-w-[1480px] px-6 lg:px-12 relative z-10">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div id="destaques">
            <SectionHeading eyebrow="Destaques Baruch" title="Carros que merecem sua atenção." sub="As melhores oportunidades selecionadas a dedo pela nossa equipe em São Luís." />
          </div>
          <div className="flex gap-2.5">
            {[[prev, ArrowLeft, 'Anterior'], [next, ArrowRight, 'Próximo']].map(([fn, Icon, l]) => {
              const I = Icon as typeof ArrowLeft
              return (
                <button key={l as string} onClick={fn as () => void} aria-label={l as string}
                  className="grid h-12 w-12 place-items-center rounded-full border border-slate-200 bg-white text-slate-800 shadow-sm transition hover:border-yellow-400 hover:bg-yellow-400 hover:text-slate-950">
                  <I size={18} />
                </button>
              )
            })}
          </div>
        </div>
      </div>
      <div className="mt-12 overflow-hidden pl-6 lg:pl-[max(3rem,calc((100vw-1480px)/2+3rem))] relative z-10" ref={ref}>
        <div className="flex cursor-grab gap-6 pr-6 active:cursor-grabbing pb-4">
          {featured.map(v => (
            <div key={v.id} className="min-w-0 shrink-0 basis-[85%] sm:basis-[48%] lg:basis-[31%]">
              <VehicleCard v={v} />
            </div>
          ))}
        </div>
      </div>
      <div className="mx-auto mt-10 max-w-[1480px] px-6 lg:px-12 relative z-10">
        <Button to="/estoque" variant="dark" arrow>Ver todo o estoque disponível</Button>
      </div>
    </section>
  )
}

export function BrandGrid({ limit }: { limit?: number }) {
  const list = limit ? BRANDS.slice(0, limit) : BRANDS
  return (
    <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 lg:grid-cols-5">
      {list.map((b, i) => {
        const n = brandCount(b)
        return (
          <Reveal key={b} delay={(i % 5) * 0.03} y={8}>
            <Link to={`/estoque?marca=${encodeURIComponent(b)}`}
              className="group flex flex-col items-center justify-center rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-yellow-400 hover:shadow-[0_12px_28px_rgba(234,179,8,0.12)] h-32 sm:h-36">
              <span className="brand-glyph h-8 w-16 text-slate-700 transition-transform duration-300 group-hover:scale-110 group-hover:text-yellow-600" style={{ ['--g' as string]: `url(${brandIcon(b)})` }} aria-hidden />
              <span className="mt-3 text-xs font-bold tracking-wider uppercase text-slate-800 group-hover:text-slate-950">{b}</span>
              <span className="text-[0.65rem] font-semibold text-yellow-700 mt-0.5">{n > 0 ? `${n} no estoque` : 'disponível'}</span>
            </Link>
          </Reveal>
        )
      })}
    </div>
  )
}

export function BrandsSection() {
  return (
    <section className="bg-gradient-to-b from-white via-slate-50/40 to-slate-50/80 py-24 lg:py-32" aria-labelledby="marcas">
      <div className="mx-auto max-w-[1480px] px-6 lg:px-12">
        <div id="marcas">
          <SectionHeading eyebrow="Marcas em Destaque" title="Encontre pela sua marca preferida." sub="Escolha a marca que combina com seu estilo e necessidades." />
        </div>
        <div className="mt-12">
          <BrandGrid limit={10} />
        </div>
        <div className="mt-10">
          <Button to="/marcas" variant="ghost" arrow>Ver todas as marcas</Button>
        </div>
      </div>
    </section>
  )
}

export function TrustSection() {
  return (
    <section className="bg-gradient-to-b from-slate-50/80 via-white to-yellow-50/30 py-24 lg:py-32 relative overflow-hidden" aria-labelledby="confianca">
      <div className="mx-auto max-w-[1480px] px-6 lg:px-12 relative z-10">
        <div id="confianca">
          <SectionHeading eyebrow="Pilares de Confiança" title="Comprar bem começa por confiar." sub="Na Baruch, transparência não é argumento de venda. É parte fundamental de como trabalhamos." />
        </div>

        {/* Grid com Imagem de Inspeção Técnica e Cards */}
        <div className="mt-14 grid gap-8 lg:grid-cols-[1.1fr_1fr] items-center">
          {/* Card com Foto Real de Inspeção Cautelar */}
          <Reveal>
            <div className="group relative overflow-hidden rounded-3xl border-2 border-slate-200/80 bg-white shadow-lg">
              <div className="aspect-[16/10] overflow-hidden">
                <img
                  src="/images/inspection.jpg"
                  alt="Inspeção técnica e laudo cautelar Baruch Veículos"
                  className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/30 to-transparent p-6 sm:p-8 flex flex-col justify-end text-white">
                <div className="inline-flex items-center gap-2 rounded-full bg-yellow-400 px-3.5 py-1 text-xs font-bold text-slate-950 w-fit mb-2 shadow">
                  <ShieldCheck size={14} />
                  <span>Inspeção Cautelar 100% Aprovada</span>
                </div>
                <h3 className="font-display text-xl sm:text-2xl font-bold text-white">
                  Diagnóstico Rigoroso de Mais de 100 Itens
                </h3>
                <p className="mt-1 text-xs sm:text-sm text-slate-300 font-normal max-w-lg">
                  Estrutura, mecânica, eletrônica embarcada, histórico documental e quilometragem aferida antes de entrar no showroom.
                </p>
              </div>
            </div>
          </Reveal>

          {/* Cards de Pilares */}
          <div className="space-y-4">
            {[
              { icon: ShieldCheck, t: 'Procedência 100% Garantida', d: 'Histórico completo de procedência sem leilão, sem sinistro e com documentação pronta para transferência imediata.' },
              { icon: Gauge, t: 'Quilometragem Real Comprovada', d: 'Conferência técnica no painel e no módulo de injeção eletrônica com laudo cautelar emitido por empresa credenciada.' },
              { icon: Zap, t: 'Atendimento Ágil e Humanizado', d: 'Consultores prontos no WhatsApp para simular propostas, enviar vídeos detalhados e agendar seu test drive exclusivo.' },
            ].map(({ icon: Icon, t, d }, i) => (
              <Reveal key={t} delay={i * 0.08}>
                <div className="flex gap-4 rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm transition-all duration-300 hover:border-yellow-400 hover:shadow-md">
                  <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-yellow-400 text-slate-950 font-bold shadow-sm">
                    <Icon size={22} />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-slate-950">{t}</h4>
                    <p className="mt-1 text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">{d}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export function ExperienceSection() {
  return (
    <section className="bg-gradient-to-b from-yellow-50/30 via-white to-slate-50/50 py-24 lg:py-36 relative overflow-hidden" aria-labelledby="exp">
      <div className="mx-auto grid max-w-[1480px] items-center gap-14 px-6 lg:grid-cols-[1.1fr_1fr] lg:px-12">
        {/* Composição Visual de Imagens (Entrega e Showroom) */}
        <div className="relative">
          {/* Foto Principal: Entrega do Carro ao Cliente */}
          <div className="aspect-[4/3] overflow-hidden rounded-3xl border-2 border-yellow-400 shadow-xl bg-slate-100">
            <img
              src="/images/delivery.jpg"
              alt="Entrega de veículo e satisfação do cliente na Baruch Veículos"
              className="h-full w-full object-cover"
            />
          </div>

          {/* Foto Secundária Flutuante: Showroom Baruch */}
          <div className="hidden sm:block absolute -bottom-8 -left-8 w-56 h-36 overflow-hidden rounded-2xl border-2 border-white shadow-2xl bg-slate-200">
            <img
              src="/images/showroom.jpg"
              alt="Showroom Baruch Veículos"
              className="h-full w-full object-cover"
            />
          </div>

          {/* Badge Dourado Flutuante */}
          <div className="absolute -bottom-6 -right-4 rounded-3xl bg-yellow-400 p-6 text-slate-950 shadow-2xl sm:p-7 border border-yellow-300">
            <p className="font-display text-4xl sm:text-5xl font-extrabold">+10 anos</p>
            <p className="text-xs sm:text-sm font-bold mt-0.5 uppercase tracking-wider text-slate-900">de história em São Luís</p>
          </div>
        </div>

        {/* Conteúdo Institucional */}
        <div>
          <Reveal>
            <span className="eyebrow">Experiência Baruch</span>
            <h2 id="exp" className="mt-4 text-[clamp(2.2rem,4.5vw,3.8rem)] font-bold tracking-tight text-slate-900 leading-[1.05]">
              Mais que uma compra. Um relacionamento.
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="mt-6 space-y-4 text-base md:text-lg leading-relaxed text-slate-600">
              <p>
                Há mais de dez anos, nas ruas de São Luís, nasceu a Baruch. O nome possui origem bíblica e significa <strong className="text-slate-950 font-semibold bg-yellow-100 px-2 py-0.5 rounded">“abençoado”</strong>.
              </p>
              <p>
                A empresa foi criada com a convicção de que o verdadeiro valor de um negócio não está apenas na venda, mas no relacionamento duradouro com cada cliente e família que atendemos.
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.2}>
            <div className="mt-8 grid grid-cols-3 gap-3 border-t border-slate-100 pt-6">
              {['Transparência', 'Excelência', 'Pós-venda'].map(x => (
                <div key={x} className="rounded-2xl border border-yellow-200 bg-yellow-50/70 p-3.5 text-center">
                  <span className="block text-xs sm:text-sm font-bold text-yellow-900">{x}</span>
                </div>
              ))}
            </div>
          </Reveal>
          <div className="mt-10">
            <Button to="/quem-somos" variant="ghost" arrow>Conheça nossa história completa</Button>
          </div>
        </div>
      </div>
    </section>
  )
}

export function CtaFinal() {
  return (
    <section className="bg-gradient-to-b from-slate-50/50 via-yellow-50/30 to-white py-24 lg:py-32 relative overflow-hidden" aria-labelledby="cta">
      <div className="mx-auto max-w-[1480px] px-6 lg:px-12">
        <div className="rounded-[2.5rem] border-2 border-yellow-300 bg-gradient-to-br from-yellow-50 via-white to-yellow-100/60 p-10 sm:p-16 lg:p-20 shadow-xl text-center relative overflow-hidden">
          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-yellow-400/20 blur-2xl" />
          <Reveal className="max-w-3xl mx-auto relative z-10">
            <span className="eyebrow">Pronto para dar o próximo passo?</span>
            <h2 id="cta" className="mt-4 text-[clamp(2.4rem,5.5vw,4.2rem)] font-extrabold tracking-tight text-slate-950 leading-[1.02]">
              Seu próximo carro ou moto está aqui.
            </h2>
            <p className="mt-5 text-base md:text-lg text-slate-600 leading-relaxed font-normal">
              Visite nosso showroom na Av. dos Africanos ou converse com um consultor online. Encontraremos a melhor condição para você.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Button to="/estoque" arrow>Ver estoque disponível</Button>
              <Button href={waLink('Olá! Gostaria de falar com um consultor da Baruch.')} variant="ghost">
                Falar no WhatsApp
              </Button>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
