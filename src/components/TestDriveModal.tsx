import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X, CheckCircle2, Calendar, Clock, User, Phone, MessageCircle } from 'lucide-react'
import { useStore } from '../lib/store'
import { title, waLink, years } from '../lib/data'

export function TestDriveModal() {
  const { testDriveModal, setTestDriveModal } = useStore()
  const [sent, setSent] = useState(false)
  const [nome, setNome] = useState('')
  const [telefone, setTelefone] = useState('')
  const [data, setData] = useState('')
  const [periodo, setPeriodo] = useState('Manhã (09h - 12h)')

  if (!testDriveModal) return null

  const handleClose = () => {
    setTestDriveModal(null)
    setSent(false)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSent(true)
    const msg = `Olá! Gostaria de confirmar o agendamento de Test Drive para o *${title(testDriveModal)} ${testDriveModal.versao} ${years(testDriveModal)}* no dia *${data || 'a combinar'}* no período *${periodo}*. Meu nome é ${nome} (${telefone}).`
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
          className="w-full max-w-lg rounded-t-3xl sm:rounded-3xl bg-white p-6 sm:p-8 shadow-2xl"
        >
          {sent ? (
            <div className="py-8 text-center">
              <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-yellow-100 text-yellow-800 mb-4">
                <CheckCircle2 size={36} />
              </div>
              <h2 className="font-display text-2xl font-bold text-slate-950">Test Drive Agendado!</h2>
              <p className="mt-2 text-sm text-slate-600 max-w-md mx-auto">
                Encaminhamos seu pedido para nossa equipe de consultores no WhatsApp. O veículo <strong>{title(testDriveModal)}</strong> estará higienizado e pronto para você na Av. dos Africanos.
              </p>
              <button onClick={handleClose} className="mt-6 rounded-full bg-slate-900 px-6 py-2.5 text-xs font-bold text-white shadow-sm">
                Fechar
              </button>
            </div>
          ) : (
            <>
              <div className="flex items-start justify-between border-b border-slate-100 pb-4">
                <div>
                  <h2 className="text-2xl font-extrabold text-slate-950">Agendar Test Drive</h2>
                  <p className="text-xs text-slate-500 font-medium">{title(testDriveModal)} · {years(testDriveModal)} · {testDriveModal.versao}</p>
                </div>
                <button onClick={handleClose} className="grid h-9 w-9 place-items-center rounded-full border border-slate-200 text-slate-500 hover:text-slate-900">
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <div>
                  <label className="block text-[0.68rem] font-bold uppercase tracking-wider text-slate-500 mb-1">Seu Nome</label>
                  <div className="relative">
                    <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      required
                      value={nome}
                      onChange={e => setNome(e.target.value)}
                      placeholder="Nome completo"
                      className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-xs font-semibold text-slate-900 outline-none focus:border-yellow-500 focus:bg-white focus:ring-2 focus:ring-yellow-100"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[0.68rem] font-bold uppercase tracking-wider text-slate-500 mb-1">WhatsApp / Telefone</label>
                  <div className="relative">
                    <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      required
                      type="tel"
                      value={telefone}
                      onChange={e => setTelefone(e.target.value)}
                      placeholder="(98) 99999-9999"
                      className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-xs font-semibold text-slate-900 outline-none focus:border-yellow-500 focus:bg-white focus:ring-2 focus:ring-yellow-100"
                    />
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="block text-[0.68rem] font-bold uppercase tracking-wider text-slate-500 mb-1">Data de Preferência</label>
                    <div className="relative">
                      <Calendar size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="date"
                        required
                        value={data}
                        onChange={e => setData(e.target.value)}
                        className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-xs font-semibold text-slate-900 outline-none focus:border-yellow-500 focus:bg-white focus:ring-2 focus:ring-yellow-100"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[0.68rem] font-bold uppercase tracking-wider text-slate-500 mb-1">Período</label>
                    <div className="relative">
                      <Clock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                      <select
                        value={periodo}
                        onChange={e => setPeriodo(e.target.value)}
                        className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-xs font-semibold text-slate-900 outline-none focus:border-yellow-500 focus:bg-white focus:ring-2 focus:ring-yellow-100"
                      >
                        <option>Manhã (09h - 12h)</option>
                        <option>Tarde (14h - 17h30)</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl bg-yellow-50 border border-yellow-200/80 p-3.5 text-xs text-yellow-900 font-medium">
                  📍 <strong>Showroom Baruch:</strong> Av. dos Africanos, 386 - Fátima, São Luís - MA. Estacionamento exclusivo no local.
                </div>

                <button
                  type="submit"
                  className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-yellow-400 font-bold text-slate-950 shadow-md transition-all hover:bg-yellow-500"
                >
                  <MessageCircle size={16} />
                  <span>Confirmar Agendamento via WhatsApp</span>
                </button>
              </form>
            </>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
