import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Search, X, ArrowRight, Sparkles, Tag, Car, Bike, Calculator, FileText } from 'lucide-react'
import { useStore } from '../lib/store'
import { brl, isMoto, kmFmt, title, vehicles, years } from '../lib/data'

export function SearchModal() {
  const { searchOpen, setSearchOpen } = useStore()
  const [q, setQ] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setSearchOpen(true)
      }
      if (e.key === 'Escape') {
        setSearchOpen(false)
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [setSearchOpen])

  if (!searchOpen) return null

  const matches = q.trim() === ''
    ? []
    : vehicles.filter(v => {
        const full = `${v.marca} ${v.modelo} ${v.versao} ${v.categoria} ${v.combustivel}`.toLowerCase()
        return full.includes(q.toLowerCase())
      }).slice(0, 6)

  const quickLinks = [
    { label: 'Motos Yamaha 0km & Showroom', to: '/motos', icon: Bike },
    { label: 'Estoque Completo de Seminovos', to: '/estoque', icon: Car },
    { label: 'Consórcio de Imóveis & Terrenos', to: '/consorcio/imoveis', icon: Sparkles },
    { label: 'Consórcio Náutico & Motores de Popa', to: '/consorcio/nautica', icon: Sparkles },
    { label: 'Consórcio de Caminhões & Frotas', to: '/consorcio/pesados', icon: Sparkles },
    { label: 'Simulador de Financiamento', to: '/financiamento', icon: Calculator },
    { label: 'Avaliação do seu Usado', to: '/avaliacao', icon: Tag },
  ]

  const handleSelect = (to: string) => {
    setSearchOpen(false)
    setQ('')
    navigate(to)
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[110] grid place-items-start bg-black/60 backdrop-blur-sm p-4 pt-16 sm:pt-24" onClick={() => setSearchOpen(false)}>
        <motion.div
          onClick={e => e.stopPropagation()}
          initial={{ y: -20, opacity: 0, scale: 0.98 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: -20, opacity: 0, scale: 0.98 }}
          className="mx-auto w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl border border-slate-200"
        >
          {/* Barra de Busca */}
          <div className="relative flex items-center border-b border-slate-100 px-6">
            <Search size={20} className="text-slate-400" />
            <input
              autoFocus
              value={q}
              onChange={e => setQ(e.target.value)}
              placeholder="Buscar por carro, moto Yamaha, modelo, marca (ex: Crosser, Polo, Compass)..."
              className="h-16 w-full bg-transparent pl-4 pr-12 text-sm md:text-base font-semibold text-slate-900 outline-none placeholder:text-slate-400"
            />
            <button
              onClick={() => setSearchOpen(false)}
              className="grid h-8 w-8 place-items-center rounded-full border border-slate-200 text-slate-400 hover:text-slate-900"
            >
              <X size={15} />
            </button>
          </div>

          {/* Resultados */}
          <div className="max-h-[60vh] overflow-y-auto p-4 sm:p-6 space-y-4">
            {q.trim() !== '' && matches.length === 0 && (
              <div className="py-8 text-center text-slate-500">
                <p className="font-bold text-slate-800">Nenhum resultado encontrado para "{q}"</p>
                <p className="mt-1 text-xs text-slate-400">Tente buscar por marca, modelo ou categoria (ex: Yamaha, Fiat, Jeep, SUV, Moto).</p>
              </div>
            )}

            {matches.length > 0 && (
              <div>
                <p className="text-[0.68rem] font-bold uppercase tracking-wider text-slate-400 mb-3 px-2">
                  Veículos no Estoque ({matches.length})
                </p>
                <div className="space-y-2">
                  {matches.map(v => (
                    <button
                      key={v.id}
                      onClick={() => handleSelect(`/veiculo/${v.slug}`)}
                      className="flex w-full items-center justify-between rounded-2xl p-3 text-left transition hover:bg-yellow-50/70 border border-transparent hover:border-yellow-200"
                    >
                      <div className="flex items-center gap-3">
                        <img src={v.imagens[0]} alt="" className="h-12 w-16 rounded-xl object-cover bg-slate-100" />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-900">{title(v)}</span>
                            {isMoto(v) && (
                              <span className="rounded-full bg-yellow-100 px-2 py-0.5 text-[10px] font-bold text-yellow-800">
                                Moto Yamaha
                              </span>
                            )}
                          </div>
                          <p className="text-[0.68rem] text-slate-400 font-semibold">{v.versao} · {years(v)} · {kmFmt(v.km)}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-display text-sm font-extrabold text-slate-950">{brl(v.preco)}</p>
                        <span className="text-[10px] font-bold text-yellow-700">Ver veículo →</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Acessos Rápidos */}
            <div className="pt-2 border-t border-slate-100">
              <p className="text-[0.68rem] font-bold uppercase tracking-wider text-slate-400 mb-3 px-2">
                Páginas e Serviços Principais
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {quickLinks.map(link => {
                  const Icon = link.icon
                  return (
                    <button
                      key={link.to}
                      onClick={() => handleSelect(link.to)}
                      className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50/50 p-3 text-left transition hover:border-yellow-300 hover:bg-yellow-50/50"
                    >
                      <div className="grid h-8 w-8 place-items-center rounded-xl bg-white border border-slate-200 text-yellow-700">
                        <Icon size={16} />
                      </div>
                      <span className="text-xs font-bold text-slate-800">{link.label}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          <div className="border-t border-slate-100 bg-slate-50 px-6 py-3 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Dica: Pressione <strong>ESC</strong> para fechar</span>
            <span>Atalho: <strong>Ctrl + K</strong></span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
