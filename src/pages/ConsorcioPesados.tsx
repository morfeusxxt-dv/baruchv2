import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Truck, Sparkles, ShieldCheck, CheckCircle2, Calculator, ArrowRight, MessageCircle, TrendingUp, DollarSign, Wrench } from 'lucide-react'
import { Button, Reveal } from '../components/ui'
import { brl, waLink } from '../lib/data'

type PesadoPlan = {
  categoria: string
  credito: number
  meses: number
  parcela: number
  indicado: string
}

const PLANS: PesadoPlan[] = [
  { categoria: 'Caminhão 3/4 & VUC', credito: 250000, meses: 120, parcela: 2518.44, indicado: 'Distribuição Urbana' },
  { categoria: 'Caminhão Toco / Truck', credito: 450000, meses: 120, parcela: 4533.19, indicado: 'Cargas Médias & Caçamba' },
  { categoria: 'Cavalo Mecânico 4x2 / 6x2', credito: 750000, meses: 120, parcela: 7555.32, indicado: 'Carreta & Rodoviário' },
  { categoria: 'Cavalo Mecânico 6x4 Premium', credito: 950000, meses: 120, parcela: 9570.07, indicado: 'Bitrem & Graneleiro' },
  { categoria: 'Renovação de Frota (2 Unidades)', credito: 1500000, meses: 120, parcela: 15110.64, indicado: 'Empresas & Frotistas' },
  { categoria: 'Expansão Logística Pesada', credito: 2200000, meses: 120, parcela: 22162.27, indicado: 'Grandes Transportadoras' },
]

export default function ConsorcioPesados() {
  const [selectedPlan, setSelectedPlan] = useState<PesadoPlan>(PLANS[1])
  const [nome, setNome] = useState('')
  const [telefone, setTelefone] = useState('')
  const [empresa, setEmpresa] = useState('')
  const [sent, setSent] = useState(false)

  const handleSimulateWhatsApp = (e: React.FormEvent) => {
    e.preventDefault()
    setSent(true)
    const msg = `Olá! Gostaria de consultar uma proposta de Consórcio de Caminhões e Pesados na Baruch:\n\n• *Categoria:* ${selectedPlan.categoria}\n• *Carta de Crédito:* ${brl(selectedPlan.credito)}\n• *Prazo:* ${selectedPlan.meses} meses\n• *Parcela:* aprox. ${brl(selectedPlan.parcela)}/mês\n• *Nome/Empresa:* ${nome} ${empresa ? `(${empresa})` : ''}\n• *Telefone:* ${telefone}\n\nPodem me apresentar os grupos de pesados com lance embutido?`
    setTimeout(() => {
      window.open(waLink(msg), '_blank')
    }, 600)
  }

  const truckAdvantages = [
    { icon: DollarSign, title: 'Zero Juros de Financiamento', desc: 'Economia financeira de até 50% em relação ao Finame ou CDC bancário tradicional.' },
    { icon: TrendingUp, title: 'Renovação Planejada de Frotas', desc: 'Mantenha seus caminhões novos, reduzindo despesas com manutenção e consumo de diesel.' },
    { icon: Sparkles, title: 'Lance Embutido de até 30%', desc: 'Utilize parte do próprio crédito para dar lance e antecipar a retirada do caminhão.' },
    { icon: Wrench, title: 'Multimarcas Sem Restrições', desc: 'Fature cavalos mecânicos e implementos Scania, Volvo, Mercedes-Benz, DAF, Iveco ou VW.' },
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
          <span className="text-slate-800">Caminhões & Linha Pesada</span>
        </nav>

        {/* Header com Banner de Destaque */}
        <div className="relative overflow-hidden rounded-[2.5rem] border-2 border-yellow-300 bg-gradient-to-br from-yellow-50/90 via-white to-yellow-100/60 shadow-xl p-8 sm:p-12 lg:p-16">
          <div className="grid lg:grid-cols-[1.1fr_0.9fr] items-center gap-10">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-yellow-400 px-3.5 py-1 text-xs font-extrabold text-slate-950 mb-4 shadow-sm">
                <Truck size={14} />
                <span>Linha Pesada & Frotas</span>
              </div>
              <h1 className="text-[clamp(2.4rem,5.5vw,4.5rem)] font-extrabold tracking-tight text-slate-950 leading-[1.02]">
                Potencialize sua frota sem juros abusivos.
              </h1>
              <p className="mt-4 text-base md:text-lg text-slate-600 leading-relaxed font-normal max-w-xl">
                Caminhões 0km e seminovos, cavalos mecânicos, carretas e implementos rodoviários com planos flexíveis em até 120 meses.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button href="#simulador" arrow>
                  Simular Carta Pesada
                </Button>
                <Button href={waLink('Olá! Gostaria de falar com o consultor de frotas e pesados da Baruch.')} variant="ghost">
                  <MessageCircle size={16} className="text-yellow-600" />
                  Consultor de Frotas
                </Button>
              </div>
            </div>

            <div className="relative aspect-[16/10] overflow-hidden rounded-3xl border-2 border-white shadow-2xl bg-slate-200">
              <img
                src="/images/pesados.jpg"
                alt="Consórcio de Caminhões e Linha Pesada Baruch"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <p className="font-display text-lg font-bold">Cavalos Mecânicos & Utilitários</p>
                <p className="text-xs text-slate-300">Scania · Volvo · Mercedes-Benz · DAF · Iveco · VW</p>
              </div>
            </div>
          </div>
        </div>

        {/* Vantagens para Transportadores e Frotistas */}
        <div className="mt-20 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {truckAdvantages.map((ta, i) => {
            const Icon = ta.icon
            return (
              <Reveal key={ta.title} delay={i * 0.05}>
                <div className="rounded-3xl border border-slate-200/80 bg-white p-7 shadow-sm transition hover:border-yellow-400 hover:shadow-md h-full">
                  <div className="grid h-12 w-12 place-items-center rounded-2xl bg-yellow-100 text-yellow-900 font-bold mb-4">
                    <Icon size={22} />
                  </div>
                  <h3 className="text-base font-bold text-slate-950">{ta.title}</h3>
                  <p className="mt-2 text-xs text-slate-600 leading-relaxed">{ta.desc}</p>
                </div>
              </Reveal>
            )
          })}
        </div>

        {/* Simulador Interativo de Cotas Pesadas */}
        <div id="simulador" className="mt-24 rounded-3xl border border-slate-200/80 bg-white p-8 sm:p-12 shadow-sm">
          <div className="max-w-2xl">
            <span className="eyebrow">Simulador de Pesados</span>
            <h2 className="mt-2 text-3xl font-extrabold text-slate-950">Escolha o porte do veículo ou frota</h2>
            <p className="mt-2 text-sm text-slate-600">
              Consulte os valores médios de parcelas mensais sem taxas de juros bancárias.
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
                  <span className="mt-1 font-display text-sm sm:text-base font-extrabold text-slate-950">{p.categoria}</span>
                  <span className="mt-2 text-xs font-bold text-yellow-800">{brl(p.parcela)}/mês</span>
                  <span className="text-[10px] text-slate-400">{brl(p.credito)}</span>
                </button>
              )
            })}
          </div>

          {/* Destaque do Plano e Formulário de Simulação */}
          <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_1.1fr] items-center border-t border-slate-100 pt-8">
            <div className="rounded-3xl border-2 border-yellow-300 bg-gradient-to-br from-yellow-50 to-white p-8 shadow-sm">
              <span className="eyebrow">Cota Linha Pesada</span>
              <p className="mt-2 font-display text-3xl sm:text-4xl font-extrabold text-slate-950">
                {selectedPlan.categoria}
              </p>
              <p className="mt-1 font-display text-2xl font-bold text-yellow-700">
                {selectedPlan.meses}x de {brl(selectedPlan.parcela)}
              </p>
              <p className="mt-1 text-xs text-slate-500 font-semibold">Crédito total: {brl(selectedPlan.credito)}</p>
              <div className="mt-6 space-y-2.5 text-xs text-slate-600 font-medium">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={15} className="text-yellow-600" />
                  <span>Possibilidade de lance embutido de até 30%</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={15} className="text-yellow-600" />
                  <span>Opção de faturamento direto na fábrica com desconto PJ</span>
                </div>
              </div>
            </div>

            {/* Formulário de Envio */}
            <form onSubmit={handleSimulateWhatsApp} className="space-y-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="block text-[0.68rem] font-bold uppercase tracking-wider text-slate-500 mb-1">Seu Nome / Responsável</label>
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
                <label className="block text-[0.68rem] font-bold uppercase tracking-wider text-slate-500 mb-1">Nome da Empresa / Transportadora (opcional)</label>
                <input
                  value={empresa}
                  onChange={e => setEmpresa(e.target.value)}
                  placeholder="Razão Social ou Nome Fantasia"
                  className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-xs font-semibold text-slate-900 outline-none focus:border-yellow-500 focus:bg-white"
                />
              </div>

              <button
                type="submit"
                className="flex h-13 w-full items-center justify-center gap-2 rounded-full bg-yellow-400 font-bold text-slate-950 shadow-md transition hover:bg-yellow-500"
              >
                <MessageCircle size={18} />
                <span>Receber Proposta de Frotas & Pesados no WhatsApp</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
