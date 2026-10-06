import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Search, SlidersHorizontal, X, RotateCcw } from 'lucide-react'
import { VehicleCard } from '../components/VehicleCard'
import { BRANDS, fuel, title, Vehicle } from '../lib/data'
import { useStore } from '../lib/store'

type F = { q: string; marca: string; modelo: string; min: string; max: string; ano: string; kmMax: string; comb: string; cambio: string; tipo: string; destaque: string }
const EMPTY: F = { q: '', marca: '', modelo: '', min: '', max: '', ano: '', kmMax: '', comb: '', cambio: '', tipo: '', destaque: '' }

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <label className="block">
    <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">{label}</span>
    {children}
  </label>
)
const inp = 'h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-100 shadow-sm'

function Panel({ f, set, reset }: { f: F; set: (k: keyof F, v: string) => void; reset: () => void }) {
  const { vehicles: allVehicles } = useStore()
  const brands = [...new Set(allVehicles.map(v => v.marca.split(' ')[0]))].sort()
  const models = [...new Set(allVehicles.filter(v => !f.marca || v.marca.toLowerCase().startsWith(f.marca.toLowerCase())).map(v => v.modelo))].sort()
  const anos = [...new Set(allVehicles.map(v => v.anoMod))].sort((a, b) => b - a)
  const cats = [...new Set(allVehicles.map(v => v.categoria).filter(Boolean))]
  return (
    <div className="space-y-4 rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider">Filtrar Veículos</h3>
        <button onClick={reset} className="flex items-center gap-1 text-xs font-semibold text-yellow-700 hover:text-yellow-800">
          <RotateCcw size={13} /> Limpar
        </button>
      </div>
      <Field label="Marca"><select className={inp} value={f.marca} onChange={e => { set('marca', e.target.value); set('modelo', '') }}><option value="">Todas as marcas</option>{[...new Set([...brands, ...BRANDS.filter(b => allVehicles.some(v => v.marca.startsWith(b)))])].sort().map(b => <option key={b}>{b}</option>)}</select></Field>
      <Field label="Modelo"><select className={inp} value={f.modelo} onChange={e => set('modelo', e.target.value)}><option value="">Todos os modelos</option>{models.map(m => <option key={m}>{m}</option>)}</select></Field>
      <div className="grid grid-cols-2 gap-2.5">
        <Field label="Preço mín."><input className={inp} inputMode="numeric" placeholder="R$ 0" value={f.min} onChange={e => set('min', e.target.value.replace(/\D/g, ''))} /></Field>
        <Field label="Preço máx."><input className={inp} inputMode="numeric" placeholder="R$ 200.000" value={f.max} onChange={e => set('max', e.target.value.replace(/\D/g, ''))} /></Field>
      </div>
      <Field label="Ano a partir de"><select className={inp} value={f.ano} onChange={e => set('ano', e.target.value)}><option value="">Qualquer ano</option>{anos.map(a => <option key={a}>{a}</option>)}</select></Field>
      <Field label="Quilometragem máx."><select className={inp} value={f.kmMax} onChange={e => set('kmMax', e.target.value)}><option value="">Qualquer km</option>{[0, 20000, 50000, 80000, 100000].map(k => <option key={k} value={k}>{k === 0 ? 'Zero km' : `até ${k.toLocaleString('pt-BR')} km`}</option>)}</select></Field>
      <Field label="Combustível"><select className={inp} value={f.comb} onChange={e => set('comb', e.target.value)}><option value="">Todos os combustíveis</option>{['flex', 'hibrido', 'eletrico'].map(c => <option key={c} value={c}>{fuel(c)}</option>)}</select></Field>
      <Field label="Câmbio"><select className={inp} value={f.cambio} onChange={e => set('cambio', e.target.value)}><option value="">Todos</option><option value="manual">Manual</option><option value="automatico">Automático</option></select></Field>
      <Field label="Carroceria / Categoria"><select className={inp} value={f.tipo} onChange={e => set('tipo', e.target.value)}><option value="">Todas</option>{cats.map(c => <option key={c}>{c}</option>)}</select></Field>
      <label className="flex cursor-pointer items-center gap-3 pt-2 text-xs font-semibold text-slate-700">
        <input type="checkbox" className="h-4 w-4 rounded border-slate-300 text-yellow-500 accent-yellow-500 focus:ring-yellow-400" checked={f.destaque === '1'} onChange={e => set('destaque', e.target.checked ? '1' : '')} />
        Apenas veículos em destaque
      </label>
    </div>
  )
}

export default function Estoque() {
  const { vehicles } = useStore()
  const [sp, setSp] = useSearchParams()
  const [sheet, setSheet] = useState(false)
  const [sort, setSort] = useState('recentes')
  const f: F = { ...EMPTY, ...Object.fromEntries([...sp.entries()]) } as F
  const set = (k: keyof F, v: string) => { const n = new URLSearchParams(sp); v ? n.set(k, v) : n.delete(k); setSp(n, { replace: true }) }
  const list = useMemo(() => {
    let r = vehicles.filter(v => {
      if (v.status === 'vendido' || v.status === 'inativo') return false
      const hay = `${v.marca} ${v.modelo} ${v.versao}`.toLowerCase()
      return (!f.q || f.q.toLowerCase().split(' ').every(t => hay.includes(t)))
        && (!f.marca || v.marca.toLowerCase().startsWith(f.marca.toLowerCase())) && (!f.modelo || v.modelo === f.modelo)
        && (!f.min || v.preco >= +f.min) && (!f.max || v.preco <= +f.max) && (!f.ano || v.anoMod >= +f.ano)
        && (f.kmMax === '' || v.km <= +f.kmMax) && (!f.comb || v.combustivel === f.comb) && (!f.cambio || v.cambio === f.cambio)
        && (!f.tipo || v.categoria === f.tipo) && (!f.destaque || v.destaque)
    })
    const s = { recentes: (a: typeof r[0], b: typeof r[0]) => (b.entrada || '').localeCompare(a.entrada || ''), menor: (a: typeof r[0], b: typeof r[0]) => a.preco - b.preco, maior: (a: typeof r[0], b: typeof r[0]) => b.preco - a.preco, km: (a: typeof r[0], b: typeof r[0]) => a.km - b.km }[sort]!
    return [...r].sort(s)
  }, [vehicles, sp, sort])
  const active = [...sp.keys()].length

  return (
    <div className="min-h-screen bg-slate-50/60 pb-32 pt-32 lg:pt-36">
      <div className="mx-auto max-w-[1480px] px-6 lg:px-12">
        <span className="eyebrow">Showroom Digital</span>
        <h1 className="mt-3 max-w-3xl text-[clamp(2.2rem,4.5vw,3.8rem)] font-bold tracking-tight text-slate-950 leading-[1.05]">
          Encontre o veículo ideal para você.
        </h1>
        
        {/* Barra superior de busca, abas de categoria e ordenação */}
        <div className="mt-8 flex flex-col gap-3">
          <div className="flex flex-wrap gap-2">
            {[
              ['', 'Todos os Veículos'],
              ['HATCH', 'Carros Hatch'],
              ['SUVs', 'SUVs'],
              ['SEDANS', 'Sedans'],
              ['UTILITÁRIOS', 'Picapes / Utilitários'],
              ['MOTO', '🏍️ Motocicletas Yamaha'],
            ].map(([tipoVal, label]) => (
              <button
                key={tipoVal}
                onClick={() => set('tipo', tipoVal)}
                className={`rounded-full px-4 py-2 text-xs font-bold transition-all shadow-sm ${
                  f.tipo === tipoVal
                    ? 'bg-yellow-400 text-slate-950 ring-2 ring-yellow-400/30 font-extrabold'
                    : 'bg-white border border-slate-200 text-slate-700 hover:border-yellow-400 hover:bg-yellow-50/50'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <label className="relative flex-1">
              <span className="sr-only">Qual carro você está procurando?</span>
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input value={f.q} onChange={e => set('q', e.target.value)} placeholder="Busque por marca, modelo, versão..." className="h-12 w-full rounded-2xl border border-slate-200 bg-white pl-12 pr-4 text-sm text-slate-900 outline-none shadow-sm transition placeholder:text-slate-400 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-100" />
            </label>
            <label>
              <span className="sr-only">Ordenar</span>
              <select value={sort} onChange={e => setSort(e.target.value)} className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-5 text-sm font-medium text-slate-700 outline-none shadow-sm focus:border-yellow-500 sm:w-56">
                <option value="recentes">Mais recentes</option>
                <option value="menor">Menor preço</option>
                <option value="maior">Maior preço</option>
                <option value="km">Menor quilometragem</option>
              </select>
            </label>
            <button onClick={() => setSheet(true)} className="flex h-12 items-center justify-center gap-2 rounded-2xl bg-yellow-400 px-6 text-sm font-bold text-slate-950 shadow-sm transition hover:bg-yellow-500 lg:hidden">
              <SlidersHorizontal size={17} /> Filtros {active > 0 && `(${active})`}
            </button>
          </div>
        </div>


        <div className="mt-10 grid gap-8 lg:grid-cols-[280px_1fr]">
          <aside className="hidden self-start lg:sticky lg:top-28 lg:block" aria-label="Filtros">
            <Panel f={f} set={set} reset={() => setSp({}, { replace: true })} />
          </aside>
          
          <section aria-live="polite">
            <div className="mb-6 flex items-center justify-between">
              <p className="text-sm font-medium text-slate-500">
                Mostrando <strong className="text-slate-900 font-bold">{list.length}</strong> {list.length === 1 ? 'veículo disponível' : 'veículos disponíveis'}
              </p>
            </div>
            
            <motion.div layout className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              <AnimatePresence mode="popLayout">
                {list.map(v => (
                  <motion.div layout key={v.id} initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }} transition={{ duration: 0.3 }}>
                    <VehicleCard v={v} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>

            {list.length === 0 && (
              <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-14 text-center shadow-sm">
                <p className="font-display text-2xl font-bold text-slate-900">Nenhum veículo encontrado.</p>
                <p className="mt-2 text-sm text-slate-500 max-w-md mx-auto">Tente ajustar seus filtros de busca ou fale diretamente com a equipe da Baruch pelo WhatsApp.</p>
                <button onClick={() => setSp({}, { replace: true })} className="mt-6 inline-flex items-center rounded-full bg-slate-900 px-6 py-2.5 text-xs font-semibold text-white hover:bg-slate-800">
                  Limpar todos os filtros
                </button>
              </div>
            )}
          </section>
        </div>
      </div>

      {/* Mobile filter bottom sheet */}
      <AnimatePresence>
        {sheet && (
          <>
            <motion.div className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSheet(false)} />
            <motion.div role="dialog" aria-modal="true" aria-label="Filtros" className="fixed inset-x-0 bottom-0 z-[80] flex max-h-[88vh] flex-col rounded-t-3xl bg-white shadow-2xl" initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}>
              <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
                <h2 className="text-lg font-bold text-slate-900">Filtrar Estoque</h2>
                <button onClick={() => setSheet(false)} aria-label="Fechar" className="grid h-9 w-9 place-items-center rounded-full border border-slate-200 text-slate-600">
                  <X size={17} />
                </button>
              </div>
              <div className="overflow-y-auto px-6 py-6">
                <Panel f={f} set={set} reset={() => setSp({}, { replace: true })} />
              </div>
              <div className="border-t border-slate-100 p-4">
                <button onClick={() => setSheet(false)} className="h-12 w-full rounded-full bg-yellow-400 font-bold text-slate-950 shadow-md">
                  Ver {list.length} {list.length === 1 ? 'veículo' : 'veículos'}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

