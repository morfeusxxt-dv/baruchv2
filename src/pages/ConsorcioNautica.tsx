import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Anchor, Sparkles, ShieldCheck, CheckCircle2, Calculator, ArrowRight, MessageCircle, Waves, Compass, Ship } from 'lucide-react'
import { Button, Reveal } from '../components/ui'
import { brl, waLink } from '../lib/data'

type NauticaPlan = {
  potencia: string
  credito: number
  meses: number
  parcela: number
  indicado: string
}

const PLANS: NauticaPlan[] = [
  { potencia: 'Yamaha 15HP / 25HP', credito: 18000, meses: 60, parcela: 348.00, indicado: 'Pesca & Botes' },
  { potencia: 'Yamaha 40HP / 60HP', credito: 35000, meses: 60, parcela: 676.00, indicado: 'Lanchas Pequenas' },
  { potencia: 'Yamaha 90HP / 115HP 4T', credito: 65000, meses: 60, parcela: 1256.00, indicado: 'Lanchas Médias' },
  { potencia: 'Yamaha 150HP / 200HP 4T', credito: 110000, meses: 60, parcela: 2126.00, indicado: 'Lanchas de Passeio' },
  { potencia: 'Yamaha 250HP / 300HP V6', credito: 180000, meses: 60, parcela: 3480.00, indicado: 'Embarcações Offshore' },
  { potencia: 'Lancha Completa + Motor', credito: 280000, meses: 60, parcela: 5413.00, indicado: 'Conjunto Náutico' },
]

export default function ConsorcioNautica() {
  const [selectedPlan, setSelectedPlan] = useState<NauticaPlan>(PLANS[1])
  const [nome, setNome] = useState('')
  const [telefone, setTelefone] = useState('')
  const [sent, setSent] = useState(false)

  const handleSimulateWhatsApp = (e: React.FormEvent) => {
    e.preventDefault()
    setSent(true)
    const msg = `Olá! Gostaria de consultar uma proposta de Consórcio Náutico Yamaha Marine na Baruch:\n\n• *Linha:* ${selectedPlan.potencia}\n• *Carta de Crédito:* ${brl(selectedPlan.credito)}\n• *Prazo:* ${selectedPlan.meses} meses\n• *Parcela:* aprox. ${brl(selectedPlan.parcela)}/mês\n• *Nome:* ${nome}\n• *Telefone:* ${telefone}\n\nPodem me enviar a tabela oficial da Yamaha Marine?`
    setTimeout(() => {
      window.open(waLink(msg), '_blank')
    }, 600)
  }

  const marineHighlights = [
    { icon: Waves, title: 'Motores de Popa Yamaha 2T e 4T', desc: 'Os motores mais duráveis e eficientes do mundo para rios, baías e navegação em alto-mar.' },
    { icon: Compass, title: 'Lanchas, Botes e WaveRunner', desc: 'Adquira sua embarcação completa com motorização oficial Yamaha sem taxa de juros.' },
    { icon: ShieldCheck, title: 'Garantia e Assistência Oficial', desc: 'Peças genuínas Yamaha Marine com cobertura e suporte especializado no Maranhão.' },
    { icon: Sparkles, title: 'Planos Sem Juros em até 60x', desc: 'Adquira seu equipamento náutico com parcelas a partir de R$ 262,48/mês.' },
  ]

  return (
    <div className="min-h-screen bg-slate-50/50 pb-32 pt-32 lg:pt-36">
      <div className="mx-auto max-w-[1480px] px-6 lg:px-12">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-xs font-semibold text-slate-400">
          <Link to="/" className="hover:text-slate-800">Início</Link>
          <span>/</span>
          <Link to="/consorcio" className="hover:text-slate-800">Consórcio</Link>
          <span>/</span>
          <span className="text-slate-800">Náutica & Motores Yamaha</span>
        </nav>

        {/* Header com Banner de Destaque */}
        <div className="relative overflow-hidden rounded-[2.5rem] border-2 border-yellow-300 bg-gradient-to-br from-yellow-50/90 via-white to-yellow-100/60 shadow-xl p-8 sm:p-12 lg:p-16">
          <div className="grid lg:grid-cols-[1.1fr_0.9fr] items-center gap-10">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-yellow-400 px-3.5 py-1 text-xs font-extrabold text-slate-950 mb-4 shadow-sm">
                <Anchor size={14} />
                <span>Yamaha Marine Oficial</span>
              </div>
              <h1 className="text-[clamp(2.4rem,5.5vw,4.5rem)] font-extrabold tracking-tight text-slate-950 leading-[1.02]">
                Navegue com a força Yamaha Marine.
              </h1>
              <p className="mt-4 text-base md:text-lg text-slate-600 leading-relaxed font-normal max-w-xl">
                Consórcio para motores de popa, lanchas de passeio, barcos de pesca e jet skis com parcelas acessíveis a partir de <strong>R$ 262,48/mês</strong>.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button href="#simulador" arrow>
                  Ver Planos de Motores
                </Button>
                <Button href={waLink('Olá! Gostaria de consultar os planos de Consórcio Náutico Yamaha.')} variant="ghost">
                  <MessageCircle size={16} className="text-yellow-600" />
                  Consultor Náutico
                </Button>
              </div>
            </div>

            <div className="relative aspect-[16/10] overflow-hidden rounded-3xl border-2 border-white shadow-2xl bg-slate-200">
              <img
                src="/images/nautica.jpg"
                alt="Consórcio Yamaha Marine Náutica Baruch"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <p className="font-display text-lg font-bold">Yamaha Marine · Motores de Popa</p>
                <p className="text-xs text-slate-300">Líder mundial em confiabilidade e tecnologia náutica</p>
              </div>
            </div>
          </div>
        </div>

        {/* Destaques Yamaha Marine */}
        <div className="mt-20 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {marineHighlights.map((mh, i) => {
            const Icon = mh.icon
            return (
              <Reveal key={mh.title} delay={i * 0.05}>
                <div className="rounded-3xl border border-slate-200/80 bg-white p-7 shadow-sm transition hover:border-yellow-400 hover:shadow-md h-full">
                  <div className="grid h-12 w-12 place-items-center rounded-2xl bg-yellow-100 text-yellow-900 font-bold mb-4">
                    <Icon size={22} />
                  </div>
                  <h3 className="text-base font-bold text-slate-950">{mh.title}</h3>
                  <p className="mt-2 text-xs text-slate-600 leading-relaxed">{mh.desc}</p>
                </div>
              </Reveal>
            )
          })}
        </div>

        {/* Simulador Interativo de Cotas Náuticas */}
        <div id="simulador" className="mt-24 rounded-3xl border border-slate-200/80 bg-white p-8 sm:p-12 shadow-sm">
          <div className="max-w-2xl">
            <span className="eyebrow">Simulador Náutico</span>
            <h2 className="mt-2 text-3xl font-extrabold text-slate-950">Escolha seu motor ou embarcação</h2>
            <p className="mt-2 text-sm text-slate-600">
              Tabela oficial de parcelas do Consórcio Yamaha Marine em até 60 meses sem juros.
            </p>
          </div>

          {/* Seletor de Cartas */}
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {PLANS.map(p => {
              const isSelected = selectedPlan.credito === p.credito
              return (
                <button
                  key={p.credito}
                  onClick={() => setSelectedPlan(p)}
                  className={`flex flex-col items-center rounded-2xl border p-4 text-center transition-all ${
                    isSelected
                      ? 'border-yellow-400 bg-yellow-50/80 ring-2 ring-yellow-400/30 shadow-sm'
                      : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100'
                  }`}
                >
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">{p.indicado}</span>
                  <span className="mt-1 font-display text-sm sm:text-base font-extrabold text-slate-950">{p.potencia}</span>
                  <span className="mt-2 text-xs font-bold text-yellow-800">{brl(p.parcela)}/mês</span>
                  <span className="text-[10px] text-slate-400">{brl(p.credito)}</span>
                </button>
              )
            })}
          </div>

          {/* Destaque do Plano e Formulário de Simulação */}
          <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_1.1fr] items-center border-t border-slate-100 pt-8">
            <div className="rounded-3xl border-2 border-yellow-300 bg-gradient-to-br from-yellow-50 to-white p-8 shadow-sm">
              <span className="eyebrow">Cota Yamaha Marine</span>
              <p className="mt-2 font-display text-3xl sm:text-4xl font-extrabold text-slate-950">
                {selectedPlan.potencia}
              </p>
              <p className="mt-1 font-display text-2xl font-bold text-yellow-700">
                {selectedPlan.meses}x de {brl(selectedPlan.parcela)}
              </p>
              <p className="mt-1 text-xs text-slate-500 font-semibold">Crédito total: {brl(selectedPlan.credito)}</p>
              <div className="mt-6 space-y-2.5 text-xs text-slate-600 font-medium">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={15} className="text-yellow-600" />
                  <span>Entrega oficial e faturamento direto com a Yamaha do Brasil</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={15} className="text-yellow-600" />
                  <span>Planos sem juros e com sorteios mensais</span>
                </div>
              </div>
            </div>

            {/* Formulário de Envio */}
            <form onSubmit={handleSimulateWhatsApp} className="space-y-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="block text-[0.68rem] font-bold uppercase tracking-wider text-slate-500 mb-1">Seu Nome</label>
                  <input
                    required
                    value={nome}
                    onChange={e => setNome(e.target.value)}
                    placeholder="Nome completo"
                    className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-xs font-semibold text-slate-900 outline-none focus:border-yellow-500 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[0.68rem] font-bold uppercase tracking-wider text-slate-500 mb-1">WhatsApp</label>
                  <input
                    required
                    type="tel"
                    value={telefone}
                    onChange={e => setTelefone(e.target.value)}
                    placeholder="(98) 99999-9999"
                    className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-xs font-semibold text-slate-900 outline-none focus:border-yellow-500 focus:bg-white"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="flex h-13 w-full items-center justify-center gap-2 rounded-full bg-yellow-400 font-bold text-slate-950 shadow-md transition hover:bg-yellow-500"
              >
                <MessageCircle size={18} />
                <span>Receber Cota Yamaha Marine no WhatsApp</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
