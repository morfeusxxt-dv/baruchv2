import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Home, Sparkles, ShieldCheck, CheckCircle2, Calculator, ArrowRight, MessageCircle, Building2, Hammer, Key, Landmark, HelpCircle } from 'lucide-react'
import { Button, Reveal, SectionHeading } from '../components/ui'
import { brl, waLink } from '../lib/data'

type ImovelPlan = {
  credito: number
  meses: number
  parcela: number
  indicado: string
}

const PLANS: ImovelPlan[] = [
  { credito: 100000, meses: 200, parcela: 598.50, indicado: 'Reforma ou Terreno' },
  { credito: 150000, meses: 200, parcela: 897.75, indicado: 'Apartamento Inicial' },
  { credito: 250000, meses: 200, parcela: 1496.25, indicado: 'Casa em Condomínio' },
  { credito: 400000, meses: 200, parcela: 2394.00, indicado: 'Casa de Alto Padrão' },
  { credito: 600000, meses: 200, parcela: 3591.00, indicado: 'Imóvel Comercial / Praia' },
  { credito: 1000000, meses: 200, parcela: 5985.00, indicado: 'Mansão / Investimento' },
]

export default function ConsorcioImoveis() {
  const [selectedPlan, setSelectedPlan] = useState<ImovelPlan>(PLANS[2])
  const [nome, setNome] = useState('')
  const [telefone, setTelefone] = useState('')
  const [objetivo, setObjetivo] = useState('Comprar casa ou apartamento')
  const [sent, setSent] = useState(false)

  const handleSimulateWhatsApp = (e: React.FormEvent) => {
    e.preventDefault()
    setSent(true)
    const msg = `Olá! Gostaria de consultar uma proposta de Consórcio Imobiliário Yamaha/Baruch:\n\n• *Carta de Crédito:* ${brl(selectedPlan.credito)}\n• *Prazo Estimado:* ${selectedPlan.meses} meses\n• *Parcela:* aprox. ${brl(selectedPlan.parcela)}/mês\n• *Objetivo:* ${objetivo}\n• *Nome:* ${nome}\n• *Telefone:* ${telefone}\n\nPodem me enviar a tabela detalhada de grupos em andamento?`
    setTimeout(() => {
      window.open(waLink(msg), '_blank')
    }, 600)
  }

  const useCases = [
    { icon: Home, title: 'Comprar Casa ou Apartamento', desc: 'Imóveis novos ou usados, residenciais ou comerciais, em qualquer cidade do Brasil.' },
    { icon: Landmark, title: 'Comprar Terreno ou Lote', desc: 'Adquira seu lote em condomínio fechado com tranquilidade e sem juros.' },
    { icon: Hammer, title: 'Construir ou Reformar', desc: 'Liberação do crédito por etapas de obra para construir a casa dos seus sonhos.' },
    { icon: Key, title: 'Quitar Financiamento Bancário', desc: 'Substitua os juros altos do seu financiamento atual pelas parcelas sem juros do consórcio.' },
    { icon: Building2, title: 'Uso do FGTS', desc: 'Utilize o saldo do seu FGTS para ofertar lances, abater o saldo devedor ou quitar parcelas.' },
    { icon: Sparkles, title: 'Poder de Compra à Vista', desc: 'Com a carta contemplada, você negocia descontos agressivos como pagamento em dinheiro.' },
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
          <span className="text-slate-800">Imóveis & Terrenos</span>
        </nav>

        {/* Header com Banner de Destaque */}
        <div className="relative overflow-hidden rounded-[2.5rem] border-2 border-yellow-300 bg-gradient-to-br from-yellow-50/90 via-white to-yellow-100/60 shadow-xl p-8 sm:p-12 lg:p-16">
          <div className="grid lg:grid-cols-[1.1fr_0.9fr] items-center gap-10">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-yellow-400 px-3.5 py-1 text-xs font-extrabold text-slate-950 mb-4 shadow-sm">
                <Home size={14} />
                <span>Consórcio Imobiliário Oficial Baruch</span>
              </div>
              <h1 className="text-[clamp(2.4rem,5.5vw,4.5rem)] font-extrabold tracking-tight text-slate-950 leading-[1.02]">
                Conquiste seu imóvel sem juros bancários.
              </h1>
              <p className="mt-4 text-base md:text-lg text-slate-600 leading-relaxed font-normal max-w-xl">
                Planeje a compra de casas, apartamentos, terrenos, obras ou quitação de financiamento com cartas de <strong>R$ 100 mil a R$ 1 milhão</strong> em até 200 meses.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button href="#simulador" arrow>
                  Simular Carta de Crédito
                </Button>
                <Button href={waLink('Olá! Gostaria de consultar os grupos de Consórcio Imobiliário Baruch.')} variant="ghost">
                  <MessageCircle size={16} className="text-yellow-600" />
                  Falar com Especialista
                </Button>
              </div>
            </div>

            <div className="relative aspect-[16/10] overflow-hidden rounded-3xl border-2 border-white shadow-2xl bg-slate-200">
              <img
                src="/images/imoveis.jpg"
                alt="Consórcio de Imóveis Baruch"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <p className="font-display text-lg font-bold">Casas, Apartamentos & Terrenos</p>
                <p className="text-xs text-slate-300">Planos flexíveis de 60 a 200 meses sem taxa de juros</p>
              </div>
            </div>
          </div>
        </div>

        {/* Casos de Uso do Consórcio Imobiliário */}
        <div className="mt-24">
          <div className="max-w-3xl">
            <span className="eyebrow">Versatilidade Total</span>
            <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold text-slate-950">
              Como você pode utilizar sua carta de crédito:
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              A carta de crédito imobiliária oferece total liberdade de escolha no momento da contemplação.
            </p>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {useCases.map((uc, i) => {
              const Icon = uc.icon
              return (
                <Reveal key={uc.title} delay={i * 0.05}>
                  <div className="rounded-3xl border border-slate-200/80 bg-white p-7 shadow-sm transition hover:border-yellow-400 hover:shadow-md h-full flex flex-col justify-between">
                    <div>
                      <div className="grid h-12 w-12 place-items-center rounded-2xl bg-yellow-100 text-yellow-900 font-bold mb-4">
                        <Icon size={22} />
                      </div>
                      <h3 className="text-lg font-bold text-slate-950">{uc.title}</h3>
                      <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">{uc.desc}</p>
                    </div>
                  </div>
                </Reveal>
              )
            })}
          </div>
        </div>

        {/* Simulador Interativo de Cotas Imobiliárias */}
        <div id="simulador" className="mt-24 rounded-3xl border border-slate-200/80 bg-white p-8 sm:p-12 shadow-sm">
          <div className="max-w-2xl">
            <span className="eyebrow">Simulador de Crédito</span>
            <h2 className="mt-2 text-3xl font-extrabold text-slate-950">Escolha o valor da sua cota</h2>
            <p className="mt-2 text-sm text-slate-600">
              Veja o valor estimado das parcelas mensais sem juros para cada faixa de crédito.
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
                  <span className="mt-1 font-display text-base sm:text-lg font-extrabold text-slate-950">{brl(p.credito)}</span>
                  <span className="mt-2 text-xs font-bold text-yellow-800">{brl(p.parcela)}/mês</span>
                  <span className="text-[10px] text-slate-400">{p.meses} meses</span>
                </button>
              )
            })}
          </div>

          {/* Destaque do Plano e Formulário de Simulação */}
          <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_1.1fr] items-center border-t border-slate-100 pt-8">
            <div className="rounded-3xl border-2 border-yellow-300 bg-gradient-to-br from-yellow-50 to-white p-8 shadow-sm">
              <span className="eyebrow">Resumo da Cota</span>
              <p className="mt-2 font-display text-3xl sm:text-4xl font-extrabold text-slate-950">
                Crédito de {brl(selectedPlan.credito)}
              </p>
              <p className="mt-1 font-display text-2xl font-bold text-yellow-700">
                {selectedPlan.meses}x de {brl(selectedPlan.parcela)}
              </p>
              <div className="mt-6 space-y-2.5 text-xs text-slate-600 font-medium">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={15} className="text-yellow-600" />
                  <span>Sem juros compensatórios (economia de até 60% comparado a financiamento)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={15} className="text-yellow-600" />
                  <span>Possibilidade de lance embutido de até 25% da própria carta</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={15} className="text-yellow-600" />
                  <span>Permite utilização de FGTS para amortização ou lances</span>
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

              <div>
                <label className="block text-[0.68rem] font-bold uppercase tracking-wider text-slate-500 mb-1">Finalidade do Imóvel</label>
                <select
                  value={objetivo}
                  onChange={e => setObjetivo(e.target.value)}
                  className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-xs font-semibold text-slate-900 outline-none focus:border-yellow-500 focus:bg-white"
                >
                  <option>Comprar casa ou apartamento</option>
                  <option>Comprar terreno em condomínio</option>
                  <option>Construir ou reformar</option>
                  <option>Quitar financiamento bancário</option>
                  <option>Investimento patrimonial / aluguel</option>
                </select>
              </div>

              <button
                type="submit"
                className="flex h-13 w-full items-center justify-center gap-2 rounded-full bg-yellow-400 font-bold text-slate-950 shadow-md transition hover:bg-yellow-500"
              >
                <MessageCircle size={18} />
                <span>Receber Estudo de Grupos de Imóveis no WhatsApp</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
