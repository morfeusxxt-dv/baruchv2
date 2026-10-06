import { useCallback, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import useEmblaCarousel from 'embla-carousel-react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  CalendarCheck,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  MessageCircle,
  X,
  ZoomIn,
  ShieldCheck,
  CheckCircle2,
  Heart,
  Share2,
  Scale,
  Sparkles,
  Calculator,
  Phone,
  Check,
  MapPin,
  Fuel,
  Gauge,
  Sliders,
  Palette,
  Award,
  FileCheck2,
  Clock,
  Car
} from 'lucide-react'
import { Button, TrustBadge } from '../components/ui'
import { VehicleCard } from '../components/VehicleCard'
import {
  brl,
  fuel,
  gear,
  getConsorcioPlans,
  getVehicle,
  isMoto,
  kmFmt,
  title,
  vehicles,
  waLink,
  waVehicle,
  years,
} from '../lib/data'
import { useStore } from '../lib/store'

export default function Veiculo() {
  const { slug } = useParams()
  const v = getVehicle(slug)
  const [ref, api] = useEmblaCarousel({ loop: true })
  const [idx, setIdx] = useState(0)
  const [full, setFull] = useState(false)
  const [zoom, setZoom] = useState(false)
  const [modal, setModal] = useState(false)
  const [sent, setSent] = useState(false)
  const [copied, setCopied] = useState(false)
  const [activeTab, setActiveTab] = useState<'specs' | 'opcionais' | 'descricao'>('specs')

  const {
    toggleFavorite,
    isFavorite,
    toggleCompare,
    inCompare,
    setTestDriveModal,
    setConsorcioModal,
  } = useStore()

  useEffect(() => {
    if (!api) return
    const f = () => setIdx(api.selectedScrollSnap())
    api.on('select', f)
    f()
  }, [api])

  const n = v?.imagens.length ?? 0
  const go = useCallback(
    (d: number) => {
      setZoom(false)
      setIdx(i => (i + d + n) % n)
      api?.scrollTo((idx + d + n) % n)
    },
    [api, idx, n]
  )

  useEffect(() => {
    if (!full) return
    const k = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setFull(false)
      if (e.key === 'ArrowRight') go(1)
      if (e.key === 'ArrowLeft') go(-1)
    }
    addEventListener('keydown', k)
    return () => removeEventListener('keydown', k)
  }, [full, go])

  if (!v) {
    return (
      <div className="min-h-screen bg-slate-50 px-6 pb-32 pt-48 text-center">
        <h1 className="text-3xl font-bold text-slate-900">Veículo não encontrado</h1>
        <p className="mt-2 text-slate-500">O veículo procurado pode ter sido vendido ou estar indisponível.</p>
        <div className="mt-8">
          <Button to="/estoque">Voltar ao estoque</Button>
        </div>
      </div>
    )
  }

  const moto = isMoto(v)
  const consorcioPlans = getConsorcioPlans(v)
  const fav = isFavorite(v.id)
  const comparing = inCompare(v.id)

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${title(v)} ${v.versao} - Baruch Veículos`,
        text: `Confira este ${title(v)} ${v.versao} na Baruch Veículos em São Luís:`,
        url: window.location.href,
      }).catch(() => {})
    } else {
      navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    }
  }

  const specsList = [
    { label: 'Marca', value: v.marca, icon: Award },
    { label: 'Modelo', value: v.modelo, icon: Car },
    { label: 'Versão', value: v.versao || (moto ? 'Yamaha Official' : '—'), icon: Sliders },
    { label: 'Ano Fabricação/Modelo', value: years(v), icon: Clock },
    { label: 'Quilometragem', value: kmFmt(v.km), icon: Gauge },
    { label: 'Combustível', value: fuel(v.combustivel), icon: Fuel },
    { label: 'Câmbio', value: gear(v.cambio), icon: Sliders },
    { label: 'Cor', value: v.cor ?? (moto ? 'Cores Oficiais Yamaha' : '—'), icon: Palette },
    { label: 'Categoria', value: moto ? 'Motocicleta Yamaha' : (v.categoria || 'Seminovo Selecionado'), icon: Car },
    { label: 'Procedência', value: 'Laudo Cautelar 100% Aprovado', icon: FileCheck2 },
  ]

  const related = vehicles
    .filter(x => x.id !== v.id && (x.marca === v.marca || x.categoria === v.categoria))
    .slice(0, 3)

  return (
    <div className="min-h-screen bg-slate-50/60 pb-28 pt-28 sm:pt-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb e Ações Rápidas */}
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3 text-xs font-semibold text-slate-500">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2">
            <Link to="/" className="hover:text-slate-900 transition">Início</Link>
            <span className="text-slate-300">/</span>
            <Link to={moto ? '/motos' : '/estoque'} className="hover:text-slate-900 transition">
              {moto ? 'Motos Yamaha' : 'Estoque'}
            </Link>
            <span className="text-slate-300">/</span>
            <span className="font-bold text-slate-800 truncate max-w-[200px] sm:max-w-none">{title(v)}</span>
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleCompare(v.id)}
              className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-bold transition-all shadow-xs ${
                comparing
                  ? 'border-yellow-400 bg-yellow-400 text-slate-950'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-yellow-400 hover:bg-yellow-50/50'
              }`}
            >
              <Scale size={13} />
              <span>{comparing ? 'Comparando' : 'Comparar'}</span>
            </button>
            <button
              onClick={() => toggleFavorite(v.id)}
              className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-bold transition-all shadow-xs ${
                fav
                  ? 'border-red-500 bg-red-500 text-white'
                  : 'border-slate-200 bg-white text-slate-700 hover:text-red-500 hover:border-red-200 hover:bg-red-50/30'
              }`}
            >
              <Heart size={13} fill={fav ? 'currentColor' : 'none'} />
              <span>{fav ? 'Salvo' : 'Favoritar'}</span>
            </button>
            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 transition-all hover:border-yellow-400 hover:bg-yellow-50/30 shadow-xs"
            >
              {copied ? <Check size={13} className="text-green-600" /> : <Share2 size={13} />}
              <span>{copied ? 'Copiado!' : 'Compartilhar'}</span>
            </button>
          </div>
        </div>

        {/* HERO MASTER GRID: Galeria à esquerda + Painel de Decisão/Compra à direita */}
        <div className="grid gap-6 lg:grid-cols-12 items-start">
          
          {/* COLUNA ESQUERDA (7 colunas): Galeria Compacta e Perfeita */}
          <div className="lg:col-span-7 space-y-4">
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-2.5 sm:p-3.5 shadow-sm">
              <div className="group relative overflow-hidden rounded-xl bg-slate-950 aspect-[16/11] max-h-[440px] flex items-center justify-center">
                <div ref={ref} className="h-full w-full overflow-hidden">
                  <div className="flex h-full">
                    {v.imagens.map((s, i) => (
                      <div key={s} className="h-full min-w-0 shrink-0 basis-full flex items-center justify-center bg-slate-950">
                        <img
                          src={s}
                          alt={`${title(v)} ${v.versao} - foto ${i + 1}`}
                          className="h-full w-full object-contain object-center select-none"
                          loading={i ? 'lazy' : 'eager'}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Botões de Navegação da Galeria */}
                {n > 1 && (
                  <>
                    <button
                      onClick={() => api?.scrollPrev()}
                      aria-label="Foto anterior"
                      className="absolute left-3 top-1/2 -translate-y-1/2 grid h-9 w-9 place-items-center rounded-full bg-white/90 text-slate-800 shadow-md backdrop-blur-xs transition hover:bg-yellow-400 hover:scale-105"
                    >
                      <ChevronLeft size={18} />
                    </button>
                    <button
                      onClick={() => api?.scrollNext()}
                      aria-label="Próxima foto"
                      className="absolute right-3 top-1/2 -translate-y-1/2 grid h-9 w-9 place-items-center rounded-full bg-white/90 text-slate-800 shadow-md backdrop-blur-xs transition hover:bg-yellow-400 hover:scale-105"
                    >
                      <ChevronRight size={18} />
                    </button>
                  </>
                )}

                {/* Badge de Contagem e Botão Fullscreen */}
                <button
                  onClick={() => setFull(true)}
                  aria-label="Ver em tela cheia"
                  className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-full bg-slate-900/80 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-sm transition hover:bg-slate-900 shadow-sm"
                >
                  <Maximize2 size={13} />
                  <span>{idx + 1} / {n}</span>
                </button>
              </div>

              {/* Thumbnails row */}
              {n > 1 && (
                <div className="no-scrollbar mt-3 flex gap-2 overflow-x-auto pb-1">
                  {v.imagens.map((s, i) => (
                    <button
                      key={s}
                      onClick={() => api?.scrollTo(i)}
                      aria-label={`Ver foto ${i + 1}`}
                      className={`h-14 sm:h-16 w-20 sm:w-24 shrink-0 overflow-hidden rounded-lg border-2 transition ${
                        i === idx ? 'border-yellow-500 ring-2 ring-yellow-400/20 shadow-xs' : 'border-slate-200 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={s} alt="" className="h-full w-full object-cover" loading="lazy" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Destaque Consórcio Yamaha (Se for moto) */}
            {moto && consorcioPlans.length > 0 && (
              <div className="rounded-2xl border border-yellow-300 bg-gradient-to-br from-yellow-50/90 via-white to-yellow-50/50 p-5 shadow-xs">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-yellow-200/70 pb-3">
                  <div>
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-yellow-800">
                      Consórcio Oficial Yamaha
                    </span>
                    <h3 className="text-base font-bold text-slate-950">Planos de Parcelamento Sem Juros</h3>
                  </div>
                  <button
                    onClick={() => setConsorcioModal(v)}
                    className="rounded-full bg-yellow-400 px-4 py-1.5 text-xs font-bold text-slate-950 shadow-xs hover:bg-yellow-500 transition"
                  >
                    Simular Plano
                  </button>
                </div>

                <div className="mt-3 grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {consorcioPlans.map(p => (
                    <button
                      key={p.meses}
                      onClick={() => setConsorcioModal(v)}
                      className="flex flex-col items-center justify-center rounded-xl border border-yellow-200 bg-white p-2.5 text-center transition hover:border-yellow-400 hover:shadow-xs"
                    >
                      <span className="text-[11px] font-bold text-yellow-950">{p.meses} Meses</span>
                      <span className="font-display text-sm font-extrabold text-slate-950">{p.parcelaFmt}</span>
                      <span className="text-[10px] text-slate-400">/mês</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* COLUNA DIREITA (5 colunas): Informações Principais, Preço e Ações Compactas */}
          <div className="lg:col-span-5">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm space-y-4">
              
              {/* Badges e Título */}
              <div>
                <div className="flex flex-wrap items-center gap-1.5 mb-2">
                  <span className="rounded-md bg-yellow-100 border border-yellow-300 px-2 py-0.5 text-xs font-black text-yellow-950">
                    {v.marca}
                  </span>
                  <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-bold text-slate-700">
                    Ano {years(v)}
                  </span>
                  {moto ? (
                    <span className="rounded-md bg-yellow-400 px-2 py-0.5 text-[11px] font-black uppercase tracking-wider text-slate-950">
                      Yamaha 0km
                    </span>
                  ) : (
                    <span className="rounded-md bg-slate-900 px-2 py-0.5 text-[11px] font-bold text-white">
                      Seminovo Periciado
                    </span>
                  )}
                </div>

                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-950 leading-tight">
                  {title(v)}
                </h1>
                <p className="text-xs sm:text-sm font-medium text-slate-500 mt-0.5">
                  {v.versao || (moto ? 'Linha Oficial Yamaha 0km' : 'Veículo Selecionado')}
                </p>
              </div>

              {/* Preço e Status de Estoque */}
              <div className="flex items-center justify-between rounded-xl bg-slate-50 border border-slate-100 px-4 py-3">
                <div>
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Valor à vista / Financiamento
                  </span>
                  <p className="font-display text-2xl sm:text-3xl font-extrabold text-slate-950">
                    {brl(v.preco)}
                  </p>
                </div>
                <div className="text-right">
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/60 rounded-full px-2.5 py-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Em Estoque
                  </span>
                </div>
              </div>

              {/* Atributos Rápidos 4x Compactos */}
              <div className="grid grid-cols-4 gap-1.5 text-center">
                <div className="rounded-lg border border-slate-100 bg-slate-50/60 py-2 px-1">
                  <span className="block text-[9px] uppercase font-bold text-slate-400">Km</span>
                  <span className="block text-[11px] font-extrabold text-slate-900 truncate">{kmFmt(v.km)}</span>
                </div>
                <div className="rounded-lg border border-slate-100 bg-slate-50/60 py-2 px-1">
                  <span className="block text-[9px] uppercase font-bold text-slate-400">Combustível</span>
                  <span className="block text-[11px] font-extrabold text-slate-900 truncate">{fuel(v.combustivel)}</span>
                </div>
                <div className="rounded-lg border border-slate-100 bg-slate-50/60 py-2 px-1">
                  <span className="block text-[9px] uppercase font-bold text-slate-400">Câmbio</span>
                  <span className="block text-[11px] font-extrabold text-slate-900 truncate">{gear(v.cambio)}</span>
                </div>
                <div className="rounded-lg border border-slate-100 bg-slate-50/60 py-2 px-1">
                  <span className="block text-[9px] uppercase font-bold text-slate-400">Cor</span>
                  <span className="block text-[11px] font-extrabold text-slate-900 truncate">{v.cor ?? 'Oficial'}</span>
                </div>
              </div>

              {/* Botões de Ação Otimizados */}
              <div className="space-y-2 pt-1">
                <Button onClick={() => setModal(true)} arrow className="w-full h-11 text-xs font-extrabold shadow-sm">
                  {moto ? 'Comprar / Reservar Esta Moto' : 'Tenho Interesse Neste Veículo'}
                </Button>
                
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    href={waVehicle(v)}
                    variant="ghost"
                    className="w-full h-10 text-xs font-bold border border-slate-200 hover:border-yellow-400 hover:bg-yellow-50/40"
                  >
                    <MessageCircle size={14} className="text-yellow-600" />
                    WhatsApp
                  </Button>
                  
                  {moto ? (
                    <Button
                      onClick={() => setConsorcioModal(v)}
                      variant="ghost"
                      className="w-full h-10 text-xs font-bold border border-slate-200 hover:border-yellow-400 hover:bg-yellow-50/40"
                    >
                      <Sparkles size={14} className="text-yellow-600" />
                      Consórcio
                    </Button>
                  ) : (
                    <Button
                      to={`/financiamento?veiculo=${v.id}`}
                      variant="ghost"
                      className="w-full h-10 text-xs font-bold border border-slate-200 hover:border-yellow-400 hover:bg-yellow-50/40"
                    >
                      <Calculator size={14} className="text-yellow-600" />
                      Financiamento
                    </Button>
                  )}
                </div>

                <Button
                  onClick={() => setTestDriveModal(v)}
                  variant="ghost"
                  className="w-full h-9 text-[11px] font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                >
                  <CalendarCheck size={13} />
                  Agendar Test Drive / Visita
                </Button>
              </div>

              {/* Selos de Confiança Compactos em Grid 2x */}
              <div className="border-t border-slate-100 pt-3 grid grid-cols-2 gap-2 text-[11px] text-slate-600">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 size={13} className="text-yellow-500 shrink-0" />
                  <span>Laudo Cautelar 100%</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 size={13} className="text-yellow-500 shrink-0" />
                  <span>{moto ? 'Garantia Yamaha' : 'Garantia de Loja'}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 size={13} className="text-yellow-500 shrink-0" />
                  <span>Troca com Troco</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 size={13} className="text-yellow-500 shrink-0" />
                  <span>Pronta Entrega em SLZ</span>
                </div>
              </div>

              {/* Localização Compacta */}
              <div className="rounded-lg bg-slate-50 px-3 py-2 border border-slate-100 flex items-center gap-2 text-[11px] text-slate-600">
                <MapPin size={14} className="text-yellow-600 shrink-0" />
                <span className="truncate"><strong>Showroom:</strong> Av. dos Africanos, 386 - São Luís - MA</span>
              </div>

            </div>
          </div>
        </div>

        {/* SEÇÕES ESTRUTURADAS ABAIXO: Ficha Técnica, Opcionais, Descrição e Simulador */}
        <div className="mt-8 space-y-8">
          
          {/* Caixa com Ficha Técnica Completa e Opcionais */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <span className="eyebrow">Detalhamento Completo</span>
                <h2 className="text-xl font-bold text-slate-950 mt-1">Especificações & Equipamentos</h2>
              </div>

              {/* Abas Rápidas */}
              <div className="flex gap-1.5 rounded-xl bg-slate-100 p-1 text-xs font-bold">
                <button
                  onClick={() => setActiveTab('specs')}
                  className={`rounded-lg px-4 py-2 transition ${
                    activeTab === 'specs' ? 'bg-white text-slate-950 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Ficha Técnica
                </button>
                {v.opcionais.length > 0 && (
                  <button
                    onClick={() => setActiveTab('opcionais')}
                    className={`rounded-lg px-4 py-2 transition ${
                      activeTab === 'opcionais' ? 'bg-white text-slate-950 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Opcionais ({v.opcionais.length})
                  </button>
                )}
                {v.descricao && (
                  <button
                    onClick={() => setActiveTab('descricao')}
                    className={`rounded-lg px-4 py-2 transition ${
                      activeTab === 'descricao' ? 'bg-white text-slate-950 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Sobre o Veículo
                  </button>
                )}
              </div>
            </div>

            {/* Conteúdo da Aba Ficha Técnica */}
            {activeTab === 'specs' && (
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {specsList.map(item => {
                  const Icon = item.icon
                  return (
                    <div key={item.label} className="flex items-center gap-3 rounded-xl bg-slate-50/70 border border-slate-100 p-3.5">
                      <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-yellow-100 text-yellow-800">
                        <Icon size={16} />
                      </div>
                      <div className="min-w-0">
                        <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">{item.label}</span>
                        <span className="block text-sm font-extrabold text-slate-900 truncate">{item.value}</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}

            {/* Conteúdo da Aba Opcionais */}
            {activeTab === 'opcionais' && v.opcionais.length > 0 && (
              <div className="mt-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5">
                  {v.opcionais.map(o => (
                    <div key={o} className="flex items-center gap-2 rounded-xl bg-slate-50 border border-slate-100 p-3 text-xs font-semibold text-slate-800">
                      <CheckCircle2 size={15} className="text-yellow-600 shrink-0" />
                      <span>{o}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Conteúdo da Aba Descrição */}
            {activeTab === 'descricao' && v.descricao && (
              <div className="mt-6 rounded-xl bg-slate-50/70 border border-slate-100 p-5">
                <div
                  className="text-xs sm:text-sm leading-relaxed text-slate-700 space-y-3"
                  dangerouslySetInnerHTML={{ __html: v.descricao.replace(/\n/g, '<br/>') }}
                />
              </div>
            )}
          </div>

          {/* Banner de Financiamento e Troca com Troco */}
          <div className="rounded-2xl border border-yellow-300/80 bg-gradient-to-r from-yellow-500 via-yellow-400 to-amber-400 p-6 sm:p-8 text-slate-950 shadow-md">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-1 max-w-2xl">
                <span className="inline-block rounded-full bg-slate-950 px-3 py-0.5 text-xs font-extrabold text-white">
                  Aprovação Expressa em São Luís
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                  Quer financiar este {title(v)} ou dar seu carro de entrada?
                </h3>
                <p className="text-xs sm:text-sm font-medium text-slate-900/90">
                  Trabalhamos com os melhores bancos (Santander, BV, Bradesco, Itaú, Banco PAN e Consórcio Yamaha) para garantir a menor taxa de juros do Maranhão.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <Button to={`/financiamento?veiculo=${v.id}`} variant="dark" className="shadow-md">
                  Simular Financiamento
                </Button>
                <Button href={waVehicle(v)} className="bg-slate-950 text-white hover:bg-slate-900 border-none">
                  <MessageCircle size={16} />
                  Falar no WhatsApp
                </Button>
              </div>
            </div>
          </div>

        </div>

        {/* VEÍCULOS RELACIONADOS */}
        {related.length > 0 && (
          <section className="mt-14 sm:mt-18 border-t border-slate-200 pt-10" aria-labelledby="rel">
            <div className="flex items-center justify-between mb-6">
              <div>
                <span className="eyebrow">Recomendações Baruch</span>
                <h2 id="rel" className="text-2xl font-bold text-slate-950">
                  {moto ? 'Outras Motocicletas Yamaha Recomendadas' : 'Você Também Pode se Interessar'}
                </h2>
              </div>
              <Button to={moto ? '/motos' : '/estoque'} variant="ghost" arrow className="text-xs">
                Ver todo o estoque
              </Button>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map(r => <VehicleCard key={r.id} v={r} />)}
            </div>
          </section>
        )}
      </div>

      {/* Mobile CTA bar fixo */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 p-3.5 shadow-xl backdrop-blur-md lg:hidden flex items-center gap-2">
        <Button href={waVehicle(v)} variant="ghost" className="shrink-0 px-3 border border-slate-200">
          <MessageCircle size={18} className="text-yellow-600" />
        </Button>
        <button
          onClick={() => setModal(true)}
          className="h-11 flex-1 rounded-full bg-yellow-400 text-xs font-extrabold text-slate-950 shadow-md hover:bg-yellow-500 transition"
        >
          {moto ? 'Comprar / Reservar Moto' : 'Tenho Interesse Neste Carro'}
        </button>
      </div>

      {/* Modal de Interesse */}
      <AnimatePresence>
        {modal && (
          <motion.div
            className="fixed inset-0 z-[90] grid place-items-end bg-black/60 backdrop-blur-sm p-0 sm:place-items-center sm:p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => { setModal(false); setSent(false) }}
          >
            <motion.div
              onClick={e => e.stopPropagation()}
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              role="dialog"
              aria-modal="true"
              aria-label="Tenho interesse"
              className="w-full max-w-lg rounded-t-3xl sm:rounded-3xl bg-white p-6 sm:p-8 shadow-2xl"
            >
              {sent ? (
                <div className="py-8 text-center">
                  <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-yellow-100 text-yellow-700 mb-4">
                    <CheckCircle2 size={32} />
                  </div>
                  <p className="font-display text-2xl font-bold text-slate-900">Interesse registrado!</p>
                  <p className="mt-2 text-sm text-slate-600">Um consultor da equipe Baruch entrará em contato em instantes.</p>
                  <button
                    onClick={() => { setModal(false); setSent(false) }}
                    className="mt-6 rounded-full bg-slate-900 px-6 py-2.5 text-xs font-semibold text-white"
                  >
                    Fechar
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="text-2xl font-bold text-slate-900">Tenho interesse</h2>
                      <p className="mt-1 text-xs font-semibold text-slate-500">{title(v)} · {years(v)} · {brl(v.preco)}</p>
                    </div>
                    <button
                      onClick={() => setModal(false)}
                      className="grid h-8 w-8 place-items-center rounded-full border border-slate-200 text-slate-500 hover:text-slate-900"
                    >
                      <X size={16} />
                    </button>
                  </div>
                  <form
                    className="mt-6 space-y-4"
                    onSubmit={e => {
                      e.preventDefault()
                      setSent(true)
                    }}
                  >
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Seu Nome</label>
                      <input
                        required
                        type="text"
                        placeholder="Nome completo"
                        className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none focus:border-yellow-500 focus:bg-white focus:ring-2 focus:ring-yellow-100"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">WhatsApp / Telefone</label>
                      <input
                        required
                        type="tel"
                        placeholder="(98) 99999-9999"
                        className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none focus:border-yellow-500 focus:bg-white focus:ring-2 focus:ring-yellow-100"
                      />
                    </div>
                    <button
                      type="submit"
                      className="h-12 w-full rounded-full bg-yellow-400 font-bold text-slate-950 shadow-md hover:bg-yellow-500 transition-colors"
                    >
                      Enviar Proposta para a Baruch
                    </button>
                  </form>
                </>
              )}
            </motion.div>
          </motion.div>
        )}

        {/* Fullscreen Photo Gallery */}
        {full && (
          <motion.div
            className="fixed inset-0 z-[95] flex flex-col bg-slate-950 text-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            role="dialog"
            aria-modal="true"
            aria-label="Galeria em tela cheia"
          >
            <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-800">
              <span className="text-sm font-semibold text-slate-300">{idx + 1} / {n} · {title(v)}</span>
              <div className="flex gap-2">
                <button
                  onClick={() => setZoom(z => !z)}
                  aria-label="Zoom"
                  className="grid h-10 w-10 place-items-center rounded-full border border-slate-700 hover:border-yellow-400 hover:text-yellow-400"
                >
                  <ZoomIn size={16} />
                </button>
                <button
                  onClick={() => setFull(false)}
                  aria-label="Fechar"
                  className="grid h-10 w-10 place-items-center rounded-full border border-slate-700 hover:border-yellow-400 hover:text-yellow-400"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
            <div className="relative flex flex-1 items-center justify-center overflow-hidden p-4">
              <button
                onClick={() => go(-1)}
                aria-label="Anterior"
                className="absolute left-4 z-10 grid h-12 w-12 place-items-center rounded-full bg-slate-800/80 hover:bg-yellow-400 hover:text-slate-950 transition"
              >
                <ChevronLeft size={22} />
              </button>
              <motion.img
                key={idx}
                src={v.imagens[idx]}
                alt={`${title(v)} foto ${idx + 1}`}
                drag={zoom ? true : 'x'}
                dragSnapToOrigin
                onDragEnd={(_, i) => {
                  if (!zoom && Math.abs(i.offset.x) > 80) go(i.offset.x < 0 ? 1 : -1)
                }}
                animate={{ scale: zoom ? 2 : 1 }}
                onClick={() => setZoom(z => !z)}
                className={`max-h-full max-w-full select-none rounded-xl object-contain ${
                  zoom ? 'cursor-zoom-out' : 'cursor-zoom-in'
                }`}
              />
              <button
                onClick={() => go(1)}
                aria-label="Próxima"
                className="absolute right-4 z-10 grid h-12 w-12 place-items-center rounded-full bg-slate-800/80 hover:bg-yellow-400 hover:text-slate-950 transition"
              >
                <ChevronRight size={22} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

