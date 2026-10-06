import { AnimatePresence, motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { X, Heart, Trash2, ArrowRight, Phone, MessageCircle } from 'lucide-react'
import { useStore } from '../lib/store'
import { brl, kmFmt, title, waLink, years } from '../lib/data'

export function FavoritesDrawer() {
  const { favDrawerOpen, setFavDrawerOpen, favVehicles, toggleFavorite, toggleCompare, inCompare } = useStore()

  if (!favDrawerOpen) return null

  const total = favVehicles.reduce((acc, v) => acc + (v.preco || 0), 0)

  const handleWhatsAppAll = () => {
    const listNames = favVehicles.map(v => `• ${title(v)} ${v.versao} (${years(v)}) - ${brl(v.preco)}`).join('\n')
    const msg = `Olá! Gostaria de informações sobre os seguintes veículos que salvei na minha lista de favoritos no site da Baruch:\n\n${listNames}`
    window.open(waLink(msg), '_blank')
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex justify-end bg-black/50 backdrop-blur-sm" onClick={() => setFavDrawerOpen(false)}>
        <motion.div
          onClick={e => e.stopPropagation()}
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="flex h-full w-full max-w-md flex-col bg-white shadow-2xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-100 p-6">
            <div className="flex items-center gap-2.5">
              <div className="grid h-10 w-10 place-items-center rounded-2xl bg-yellow-100 text-yellow-800 font-bold">
                <Heart size={18} fill="currentColor" />
              </div>
              <div>
                <h2 className="text-lg font-extrabold text-slate-950">Meus Favoritos</h2>
                <p className="text-xs text-slate-400 font-semibold">{favVehicles.length} {favVehicles.length === 1 ? 'veículo salvo' : 'veículos salvos'}</p>
              </div>
            </div>
            <button
              onClick={() => setFavDrawerOpen(false)}
              className="grid h-9 w-9 place-items-center rounded-full border border-slate-200 text-slate-500 hover:text-slate-900"
            >
              <X size={16} />
            </button>
          </div>

          {/* Lista de Favoritos */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {favVehicles.length === 0 ? (
              <div className="py-16 text-center">
                <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-slate-100 text-slate-400 mb-3">
                  <Heart size={28} />
                </div>
                <p className="font-bold text-slate-900 text-base">Sua lista está vazia</p>
                <p className="mt-1 text-xs text-slate-500 max-w-xs mx-auto">
                  Clique no ícone de coração nos carros ou motos para salvar seus modelos favoritos e consultar depois.
                </p>
                <Link
                  to="/estoque"
                  onClick={() => setFavDrawerOpen(false)}
                  className="mt-5 inline-flex items-center gap-2 rounded-full bg-yellow-400 px-5 py-2.5 text-xs font-bold text-slate-950 shadow-sm hover:bg-yellow-500"
                >
                  Explorar Estoque
                </Link>
              </div>
            ) : (
              favVehicles.map(v => (
                <div key={v.id} className="flex gap-3.5 rounded-2xl border border-slate-200/80 bg-white p-3.5 shadow-sm transition hover:border-yellow-300">
                  <div className="h-20 w-24 shrink-0 overflow-hidden rounded-xl bg-slate-100">
                    <img src={v.imagens[0]} alt={title(v)} className="h-full w-full object-cover" />
                  </div>
                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-1">
                        <Link
                          to={`/veiculo/${v.slug}`}
                          onClick={() => setFavDrawerOpen(false)}
                          className="text-xs font-bold text-slate-950 hover:text-yellow-700 line-clamp-1"
                        >
                          {title(v)}
                        </Link>
                        <button
                          onClick={() => toggleFavorite(v.id)}
                          className="text-slate-400 hover:text-red-500 p-0.5"
                          title="Remover dos favoritos"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                      <p className="text-[0.65rem] text-slate-400 font-semibold">{years(v)} · {kmFmt(v.km)}</p>
                      <p className="font-display text-sm font-extrabold text-slate-950 mt-1">{brl(v.preco)}</p>
                    </div>

                    <div className="mt-2 flex items-center justify-between gap-2 pt-2 border-t border-slate-100 text-[0.68rem]">
                      <button
                        onClick={() => toggleCompare(v.id)}
                        className={`font-bold transition ${inCompare(v.id) ? 'text-yellow-800' : 'text-slate-500 hover:text-slate-900'}`}
                      >
                        {inCompare(v.id) ? '✓ Comparando' : '+ Comparar'}
                      </button>
                      <Link
                        to={`/veiculo/${v.slug}`}
                        onClick={() => setFavDrawerOpen(false)}
                        className="font-bold text-yellow-700 hover:underline inline-flex items-center gap-1"
                      >
                        Ver detalhes <ArrowRight size={10} />
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer com Ações */}
          {favVehicles.length > 0 && (
            <div className="border-t border-slate-100 bg-slate-50 p-6 space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-slate-600">
                <span>Valor Total Estimado:</span>
                <span className="font-display text-lg font-extrabold text-slate-950">{brl(total)}</span>
              </div>
              <button
                onClick={handleWhatsAppAll}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-yellow-400 text-xs font-bold text-slate-950 shadow-md transition hover:bg-yellow-500"
              >
                <MessageCircle size={15} />
                <span>Consultar Toda Lista no WhatsApp</span>
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
