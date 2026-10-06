import { AnimatePresence, motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { X, Trash2, ArrowRight, ShieldCheck, Check, Sparkles, MessageCircle } from 'lucide-react'
import { useStore } from '../lib/store'
import { brl, fuel, gear, kmFmt, title, waLink, years } from '../lib/data'

export function CompareModal() {
  const { compareVehicles, clearCompare, toggleCompare } = useStore()

  if (compareVehicles.length === 0) return null

  const handleWhatsAppCompare = () => {
    const list = compareVehicles.map(v => `• ${title(v)} ${v.versao} (${years(v)}) - ${brl(v.preco)}`).join('\n')
    const msg = `Olá! Estou em dúvida entre os seguintes veículos no site da Baruch e gostaria da ajuda de um consultor para decidir:\n\n${list}`
    window.open(waLink(msg), '_blank')
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating Bar when comparing */}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex items-center gap-4 rounded-3xl border-2 border-yellow-400 bg-white/95 p-3.5 shadow-2xl backdrop-blur-md"
      >
        <div className="flex items-center gap-2 pl-2">
          <span className="grid h-7 w-7 place-items-center rounded-full bg-yellow-400 text-xs font-bold text-slate-950">
            {compareVehicles.length}
          </span>
          <span className="text-xs font-bold text-slate-800 hidden sm:inline">
            Comparando veículos
          </span>
        </div>

        <div className="flex items-center gap-2">
          {compareVehicles.map(v => (
            <div key={v.id} className="relative group">
              <img src={v.imagens[0]} alt={title(v)} className="h-10 w-14 rounded-lg object-cover border border-slate-200" />
              <button
                onClick={() => toggleCompare(v.id)}
                className="absolute -top-1.5 -right-1.5 grid h-5 w-5 place-items-center rounded-full bg-slate-900 text-white text-[10px] shadow"
                title="Remover"
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2 border-l border-slate-200 pl-3">
          <button
            onClick={handleWhatsAppCompare}
            className="flex items-center gap-1.5 rounded-full bg-yellow-400 px-3.5 py-2 text-xs font-bold text-slate-950 shadow hover:bg-yellow-500"
          >
            <MessageCircle size={14} />
            <span className="hidden sm:inline">Tirar Dúvida no WhatsApp</span>
          </button>
          <button
            onClick={clearCompare}
            className="rounded-full border border-slate-200 p-2 text-slate-400 hover:text-slate-800"
            title="Limpar comparação"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </motion.div>
    </div>
  )
}
