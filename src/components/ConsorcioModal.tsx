import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X, CheckCircle2, ShieldCheck, Sparkles, MessageCircle } from 'lucide-react'
import { useStore } from '../lib/store'
import { brl, getConsorcioPlans, title, waLink, years } from '../lib/data'

export function ConsorcioModal() {
  const { consorcioModal, setConsorcioModal } = useStore()
  const [selectedMeses, setSelectedMeses] = useState<number | null>(null)
  const [lanceEmbutido, setLanceEmbutido] = useState(false)
  const [sent, setSent] = useState(false)
  const [nome, setNome] = useState('')
  const [telefone, setTelefone] = useState('')

  if (!consorcioModal) return null

  const plans = getConsorcioPlans(consorcioModal)
  const activeMeses = selectedMeses || (plans[0]?.meses ?? 80)
  const activePlan = plans.find(p => p.meses === activeMeses) || plans[0]

  const valorParcelaFinal = lanceEmbutido && activePlan
    ? activePlan.parcela * 0.75 // simula 25% de lance embutido reduzindo parcela
    : activePlan?.parcela ?? 0

  const handleClose = () => {
    setConsorcioModal(null)
    setSent(false)
    setSelectedMeses(null)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSent(true)
    const msg = `Olá! Gostaria de formalizar uma proposta do Consórcio Yamaha para o modelo *${title(consorcioModal)} ${consorcioModal.versao}* em *${activeMeses}x de ${brl(valorParcelaFinal)}* (${lanceEmbutido ? 'com lance embutido 25%' : 'sem lance'}). Meu nome é ${nome} (${telefone}).`
    setTimeout(() => {
      window.open(waLink(msg), '_blank')
    }, 600)
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] grid place-items-end bg-black/60 backdrop-blur-sm p-0 sm:place-items-center sm:p-6" onClick={handleClose}>
        <motion.div
          onClick={e => e.stopPropagation()}
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 40, opacity: 0 }}
          className="w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl bg-white p-6 sm:p-8 shadow-2xl"
        >
          {sent ? (
            <div className="py-8 text-center">
              <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-yellow-100 text-yellow-800 mb-4">
                <CheckCircle2 size={36} />
              </div>
              <h2 className="font-display text-2xl font-bold text-slate-950">Simulação Direcionada ao WhatsApp!</h2>
              <p className="mt-2 text-sm text-slate-600 max-w-md mx-auto">
                Abrimos uma conversa com nosso especialista em Consórcio Yamaha Baruch com os dados da sua cota para o <strong>{title(consorcioModal)}</strong>.
              </p>
              <button onClick={handleClose} className="mt-6 rounded-full bg-slate-900 px-6 py-2.5 text-xs font-bold text-white shadow-sm">
                Concluir
              </button>
            </div>
          ) : (
            <>
              <div className="flex items-start justify-between border-b border-slate-100 pb-4">
                <div>
                  <div className="inline-flex items-center gap-1.5 rounded-full border border-yellow-300 bg-yellow-50 px-3 py-0.5 text-[0.68rem] font-bold text-yellow-900 mb-2">
                    <Sparkles size={12} className="text-yellow-600" />
                    <span>Consórcio Oficial Yamaha</span>
                  </div>
                  <h2 className="text-2xl font-extrabold text-slate-950">{title(consorcioModal)}</h2>
                  <p className="text-xs text-slate-500 font-medium">{consorcioModal.versao || 'Linha 0km'} · Valor da Carta: <strong>{brl(consorcioModal.preco)}</strong></p>
                </div>
                <button onClick={handleClose} className="grid h-9 w-9 place-items-center rounded-full border border-slate-200 text-slate-500 hover:text-slate-900">
                  <X size={16} />
                </button>
              </div>

              {/* Seletor de Planos */}
              <div className="mt-6">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                  Escolha o prazo desejado da sua cota:
                </label>
                <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-5">
                  {plans.map(p => {
                    const isSelected = activeMeses === p.meses
                    return (
                      <button
                        key={p.meses}
                        type="button"
                        onClick={() => setSelectedMeses(p.meses)}
                        className={`flex flex-col items-center rounded-2xl border p-3 text-center transition-all ${
                          isSelected
                            ? 'border-yellow-500 bg-yellow-50/80 ring-2 ring-yellow-400/40 shadow-sm'
                            : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100'
                        }`}
                      >
                        <span className={`text-xs font-bold ${isSelected ? 'text-yellow-950' : 'text-slate-600'}`}>
                          {p.meses} meses
                        </span>
                        <span className="mt-1 font-display text-sm font-extrabold text-slate-950">
                          {p.parcelaFmt}
                        </span>
                        <span className="text-[0.6rem] text-slate-400">/mês</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Destaque do Plano Selecionado */}
              <div className="mt-6 rounded-2xl border-2 border-yellow-300 bg-gradient-to-br from-yellow-50 to-white p-5 shadow-sm">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <p className="text-[0.68rem] font-bold uppercase tracking-wider text-yellow-900">Parcela mensal calculada</p>
                    <p className="mt-0.5 font-display text-3xl font-extrabold text-slate-950">
                      {activeMeses}x de {brl(valorParcelaFinal)}
                    </p>
                    <p className="text-xs text-slate-600 font-medium">Sem taxa de juros · Sem entrada obrigatória</p>
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer rounded-xl bg-white px-3.5 py-2 border border-yellow-200 shadow-sm text-xs font-bold text-slate-800 hover:border-yellow-400">
                    <input
                      type="checkbox"
                      checked={lanceEmbutido}
                      onChange={e => setLanceEmbutido(e.target.checked)}
                      className="accent-yellow-500 rounded"
                    />
                    <span>Simular Lance Embutido (25%)</span>
                  </label>
                </div>
              </div>

              {/* Vantagens */}
              <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                <div className="flex items-center gap-2 rounded-xl bg-slate-50 p-2.5 text-slate-700">
                  <ShieldCheck size={14} className="text-yellow-600 shrink-0" />
                  <span>Garantia de Fábrica</span>
                </div>
                <div className="flex items-center gap-2 rounded-xl bg-slate-50 p-2.5 text-slate-700">
                  <Sparkles size={14} className="text-yellow-600 shrink-0" />
                  <span>Sorteios Semanais</span>
                </div>
                <div className="flex items-center gap-2 rounded-xl bg-slate-50 p-2.5 text-slate-700 col-span-2 sm:col-span-1">
                  <CheckCircle2 size={14} className="text-yellow-600 shrink-0" />
                  <span>Entrega em São Luís</span>
                </div>
              </div>

              {/* Formulário de Envio para o Consultor */}
              <form onSubmit={handleSubmit} className="mt-6 space-y-3.5 border-t border-slate-100 pt-5">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="block text-[0.68rem] font-bold uppercase tracking-wider text-slate-500 mb-1">Seu Nome</label>
                    <input
                      required
                      value={nome}
                      onChange={e => setNome(e.target.value)}
                      placeholder="Nome completo"
                      className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-xs font-semibold text-slate-900 outline-none focus:border-yellow-500 focus:bg-white focus:ring-2 focus:ring-yellow-100"
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
                      className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-xs font-semibold text-slate-900 outline-none focus:border-yellow-500 focus:bg-white focus:ring-2 focus:ring-yellow-100"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-yellow-400 font-bold text-slate-950 shadow-md transition-all hover:bg-yellow-500"
                >
                  <MessageCircle size={16} />
                  <span>Garantir Cota no WhatsApp com Consultor</span>
                </button>
              </form>
            </>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
