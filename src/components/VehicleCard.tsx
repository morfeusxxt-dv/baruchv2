import { Link } from 'react-router-dom'
import { MessageCircle, ArrowUpRight, Heart, Sparkles, Scale, Calculator } from 'lucide-react'
import { Badge, Img } from './ui'
import { type Vehicle, brl, fuel, gear, isMoto, kmFmt, title, years, waVehicle, getMinConsorcioParcela } from '../lib/data'
import { useStore } from '../lib/store'

export function VehicleCard({ v, compact = false }: { v: Vehicle; compact?: boolean }) {
  const { toggleFavorite, isFavorite, toggleCompare, inCompare, setConsorcioModal } = useStore()
  const fav = isFavorite(v.id)
  const comparing = inCompare(v.id)
  const moto = isMoto(v)
  const minParcela = moto ? getMinConsorcioParcela(v) : null

  return (
    <article className="group relative flex h-full flex-col rounded-3xl border border-slate-200/80 bg-white p-3 shadow-[0_4px_20px_rgba(0,0,0,0.03)] transition-all duration-300 hover:-translate-y-1.5 hover:border-yellow-400 hover:shadow-[0_16px_36px_rgba(234,179,8,0.12)]">
      {/* Imagem do Veículo com Badges e Ações */}
      <div className="relative block overflow-hidden rounded-2xl bg-slate-100">
        <Link to={`/veiculo/${v.slug}`} className="block aspect-[4/3] overflow-hidden" aria-label={`Ver detalhes: ${title(v)} ${v.versao}`}>
          <Img
            src={v.imagens[0]}
            alt={`${title(v)} ${v.versao} ${years(v)} à venda em São Luís`}
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          />
        </Link>

        {/* Gradiente sutil */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        {/* Badges superiores esquerdos */}
        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          {moto && (
            <span className="rounded-full bg-yellow-400 px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-slate-950 shadow-sm">
              Yamaha 0km
            </span>
          )}
          {v.destaque && !moto && <Badge tone="gold">Destaque</Badge>}
          {v.km === 0 && !moto && <Badge tone="dark">Zero km</Badge>}
        </div>

        {/* Botão de Favoritar superior direito */}
        <div className="absolute right-3 top-3 flex items-center gap-1.5">
          <button
            onClick={() => toggleCompare(v.id)}
            aria-label="Comparar veículo"
            title={comparing ? 'Remover da comparação' : 'Adicionar à comparação'}
            className={`grid h-8 w-8 place-items-center rounded-full backdrop-blur-md transition-all shadow-sm ${
              comparing
                ? 'bg-yellow-400 text-slate-950 ring-2 ring-yellow-400'
                : 'bg-white/90 text-slate-700 hover:bg-white hover:text-slate-950'
            }`}
          >
            <Scale size={14} />
          </button>
          <button
            onClick={() => toggleFavorite(v.id)}
            aria-label="Favoritar veículo"
            className={`grid h-8 w-8 place-items-center rounded-full backdrop-blur-md transition-all shadow-sm ${
              fav
                ? 'bg-red-500 text-white shadow-md'
                : 'bg-white/90 text-slate-700 hover:bg-white hover:text-red-500'
            }`}
          >
            <Heart size={14} fill={fav ? 'currentColor' : 'none'} />
          </button>
        </div>

        {/* Detalhes no Hover */}
        <div className="pointer-events-none absolute bottom-3 left-3 right-3 flex translate-y-2 items-center justify-between text-[11px] font-semibold text-white opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <span>{v.cor ?? 'Pronta entrega'}</span>
          <span>{v.opcionais.length > 0 ? `${v.opcionais.length} itens de série` : 'Garantia Yamaha'}</span>
        </div>
      </div>

      {/* Conteúdo do Card */}
      <div className="flex flex-1 flex-col px-3 pb-3 pt-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <Link to={`/veiculo/${v.slug}`} className="hover:text-yellow-700 transition-colors">
              <h3 className="text-lg font-bold text-slate-950 leading-snug">{title(v)}</h3>
            </Link>
            <p className="text-xs font-medium text-slate-500 line-clamp-1">{v.versao || (moto ? 'Yamaha Official' : 'Completo')}</p>
          </div>
          <span className="shrink-0 rounded-md bg-slate-100 px-2 py-0.5 text-[0.7rem] font-bold text-slate-700">
            {years(v)}
          </span>
        </div>

        {/* Atributos */}
        <div className="mt-3 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs font-medium text-slate-500 border-t border-slate-100 pt-2.5">
          <span>{kmFmt(v.km)}</span>
          <span className="h-1 w-1 rounded-full bg-slate-300" />
          <span>{fuel(v.combustivel)}</span>
          <span className="h-1 w-1 rounded-full bg-slate-300" />
          <span>{gear(v.cambio)}</span>
        </div>

        {/* Bloco de Consórcio / Preço */}
        {moto && minParcela ? (
          <div className="mt-3 rounded-2xl bg-yellow-50/80 border border-yellow-200/80 p-2.5 flex items-center justify-between">
            <div>
              <span className="block text-[0.6rem] font-bold uppercase tracking-wider text-yellow-900">Consórcio Yamaha a partir de</span>
              <span className="font-display text-sm font-extrabold text-slate-950">80x de {minParcela}</span>
            </div>
            <button
              onClick={() => setConsorcioModal(v)}
              className="rounded-xl bg-yellow-400 px-2.5 py-1 text-[11px] font-bold text-slate-950 shadow-sm transition hover:bg-yellow-500"
            >
              Simular Cota
            </button>
          </div>
        ) : null}

        {/* Preço e Botões */}
        <div className="mt-auto flex items-center justify-between pt-4">
          <div>
            <span className="block text-[0.65rem] font-bold uppercase tracking-wider text-slate-400">
              {moto ? 'À vista / Financiamento' : 'Valor'}
            </span>
            <p className="font-display text-xl md:text-2xl font-bold text-slate-950">{brl(v.preco)}</p>
          </div>
          <div className="flex items-center gap-2">
            <a
              href={waVehicle(v)}
              target="_blank"
              rel="noreferrer"
              aria-label={`Falar no WhatsApp sobre ${title(v)}`}
              className="grid h-10 w-10 place-items-center rounded-full border border-slate-200 text-slate-700 transition hover:border-yellow-400 hover:bg-yellow-400 hover:text-slate-950 shadow-sm"
              title="Conversar no WhatsApp"
            >
              <MessageCircle size={16} />
            </a>
            {!compact && (
              <Link
                to={`/veiculo/${v.slug}`}
                className="inline-flex h-10 items-center gap-1 rounded-full bg-slate-900 px-4 text-xs font-semibold text-white transition hover:bg-yellow-500 hover:text-slate-950 shadow-sm"
              >
                Ver <ArrowUpRight size={13} />
              </Link>
            )}
          </div>
        </div>
      </div>
    </article>
  )
}
