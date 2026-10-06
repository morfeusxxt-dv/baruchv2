import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Zap, ShieldCheck, ArrowRight, MessageCircle, Bike, CheckCircle2, ChevronRight, Calculator, Flame, Smartphone } from 'lucide-react'
import { VehicleCard } from '../components/VehicleCard'
import { Button, Reveal, SectionHeading } from '../components/ui'
import { brl, waLink, MOTO_CATEGORIES, getMotoCategory, MotoSubcategory, Vehicle } from '../lib/data'
import { useStore } from '../lib/store'

export default function Motos() {
  const [cat, setCat] = useState<MotoSubcategory | 'todas'>('todas')
  const [combustivel, setCombustivel] = useState<'todos' | 'flex' | 'hibrido' | 'eletrico'>('todos')
  const [q, setQ] = useState('')
  const { motos, setConsorcioModal } = useStore()

  const list = useMemo(() => {
    return motos.filter(m => {
      if (m.status === 'vendido' || m.status === 'inativo') return false
      const matchText = `${m.marca} ${m.modelo} ${m.versao} ${m.descricao}`.toLowerCase().includes(q.toLowerCase())
      if (!matchText) return false
      
      if (combustivel !== 'todos' && m.combustivel !== combustivel) return false

      if (cat !== 'todas') {
        const itemCat = getMotoCategory(m)
        if (itemCat !== cat) return false
      }

      return true
    })
  }, [motos, cat, combustivel, q])

  return (
    <div className="min-h-screen bg-slate-50/50 pb-32 pt-32 lg:pt-36">
      <div className="mx-auto max-w-[1480px] px-6 lg:px-12">
        {/* Header da Seção de Motos */}
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-yellow-300 bg-yellow-50 px-3.5 py-1 text-xs font-bold text-yellow-900 mb-3">
              <Sparkles size={14} className="text-yellow-600" />
              <span>Showroom Oficial Yamaha em São Luís</span>
            </div>
            <h1 className="text-[clamp(2.4rem,5vw,4.2rem)] font-extrabold tracking-tight text-slate-950 leading-[1.05]">
              Linha Yamaha 0km & Selecionadas
            </h1>
            <p className="mt-3 max-w-2xl text-base md:text-lg text-slate-600 font-normal">
              Street, Trail, Scooters, Híbridas e 100% Elétricas. Escolha sua Yamaha zero quilômetro com planos facilitados de consórcio ou financiamento com pronta entrega.
            </p>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <Button href={waLink('Olá! Gostaria de consultar a disponibilidade e valores da linha de motocicletas Yamaha na Baruch.')} arrow>
              Falar com Especialista Yamaha
            </Button>
            <Button to="/consorcio" variant="ghost">
              Tabela de Consórcio
            </Button>
          </div>
        </div>

        {/* Faixa de Pilares Yamaha */}
        <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            ['3 Anos de Garantia', 'Tranquilidade e segurança de fábrica', ShieldCheck],
            ['Pronta Entrega 0km', 'Retirada ágil em São Luís - MA', Sparkles],
            ['Y-Connect & Elétricas', 'Telemetria no app e sustentabilidade', Zap],
            ['Consórcio Sem Juros', 'Parcelas a partir de R$ 277,06/mês', MessageCircle],
          ].map(([t, d, Icon]) => (
            <div key={t as string} className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-yellow-100 text-yellow-800 font-bold mb-3">
                <Icon size={18} />
              </div>
              <h3 className="text-sm font-bold text-slate-950">{t as string}</h3>
              <p className="text-xs text-slate-500 mt-0.5">{d as string}</p>
            </div>
          ))}
        </div>

        {/* Filtros de Categorias de Moto */}
        <div className="mt-12 space-y-4">
          {/* Pill Tabs de Categorias */}
          <div className="flex flex-wrap items-center gap-2">
            {MOTO_CATEGORIES.map(c => {
              const active = cat === c.id
              return (
                <button
                  key={c.id}
                  onClick={() => setCat(c.id)}
                  className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-bold transition-all shadow-sm ${
                    active
                      ? 'bg-yellow-400 text-slate-950 ring-2 ring-yellow-400/40'
                      : 'bg-white border border-slate-200 text-slate-700 hover:border-yellow-400 hover:bg-yellow-50/50'
                  }`}
                >
                  <span>{c.icon}</span>
                  <span>{c.label}</span>
                </button>
              )
            })}
          </div>

          {/* Sub-filtros de Combustível e Busca */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-200 pb-6 pt-2">
            <div className="flex flex-wrap gap-2 w-full sm:w-auto">
              {[
                ['todos', 'Todas as Motorizações'],
                ['flex', 'Flex / Gasolina'],
                ['hibrido', 'Híbridas Conectadas'],
                ['eletrico', '100% Elétricas'],
              ].map(([id, label]) => (
                <button
                  key={id}
                  onClick={() => setCombustivel(id as any)}
                  className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all ${
                    combustivel === id
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="w-full sm:w-80">
              <input
                value={q}
                onChange={e => setQ(e.target.value)}
                placeholder="Buscar modelo (FZ15, Aerox, Crosser, Neos)..."
                className="h-11 w-full rounded-2xl border border-slate-200 bg-white px-4 text-xs text-slate-900 outline-none shadow-sm placeholder:text-slate-400 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-100"
              />
            </div>
          </div>
        </div>

        {/* Grid de Motocicletas */}
        <div className="mt-8">
          <div className="mb-6 flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Mostrando {list.length} {list.length === 1 ? 'modelo' : 'modelos'}
            </p>
            {(cat !== 'todas' || combustivel !== 'todos' || q !== '') && (
              <button
                onClick={() => { setCat('todas'); setCombustivel('todos'); setQ('') }}
                className="text-xs font-bold text-yellow-700 hover:underline"
              >
                Limpar todos os filtros
              </button>
            )}
          </div>

          <motion.div layout className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {list.map(m => (
                <motion.div
                  layout
                  key={m.id}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.3 }}
                >
                  <VehicleCard v={m} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {list.length === 0 && (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center shadow-sm">
              <p className="font-display text-xl font-bold text-slate-900">Nenhum modelo encontrado com estes filtros.</p>
              <p className="mt-1 text-sm text-slate-500">Tente ajustar a categoria ou a busca por texto.</p>
              <button
                onClick={() => { setCat('todas'); setCombustivel('todos'); setQ('') }}
                className="mt-4 rounded-full bg-slate-900 px-6 py-2 text-xs font-semibold text-white hover:bg-yellow-400 hover:text-slate-950"
              >
                Ver Todas as Motos
              </button>
            </div>
          )}
        </div>

        {/* Destaques de Tecnologia Yamaha */}
        <div className="mt-24 rounded-3xl border border-slate-200/80 bg-white p-8 sm:p-12 shadow-sm">
          <div className="max-w-2xl">
            <span className="eyebrow">Engenharia e Inovação</span>
            <h2 className="mt-2 text-3xl font-extrabold text-slate-950">Por que escolher sua Yamaha na Baruch?</h2>
            <p className="mt-3 text-sm text-slate-600 leading-relaxed">
              Além de toda a linha 0km com garantia oficial de 3 anos, você conta com suporte completo da nossa equipe especializada em São Luís.
            </p>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-6">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-yellow-100 text-yellow-800 font-bold mb-4">
                <Smartphone size={22} />
              </div>
              <h3 className="font-bold text-slate-900 text-base">Yamaha Y-Connect</h3>
              <p className="mt-2 text-xs text-slate-500 leading-relaxed">
                Conecte seu smartphone via Bluetooth para acompanhar consumo, alertas de manutenção, localização da moto e telemetria de viagem em tempo real.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-6">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-yellow-100 text-yellow-800 font-bold mb-4">
                <Zap size={22} />
              </div>
              <h3 className="font-bold text-slate-900 text-base">Híbridas & Elétricas</h3>
              <p className="mt-2 text-xs text-slate-500 leading-relaxed">
                Pioneirismo em mobilidade sustentável com os modelos Fluo Hybrid, ZR Hybrid e Neos 100% Elétrica, combinando torque instantâneo e economia máxima.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-6">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-yellow-100 text-yellow-800 font-bold mb-4">
                <Calculator size={22} />
              </div>
              <h3 className="font-bold text-slate-900 text-base">Consórcio Yamaha Oficial</h3>
              <p className="mt-2 text-xs text-slate-500 leading-relaxed">
                Planos em até 80 meses sem taxa de juros, sem entrada obrigatória e com possibilidade de utilizar lance embutido de até 25% da cota.
              </p>
            </div>
          </div>
        </div>

        {/* Banner Consórcio de Motos */}
        <div className="mt-12 rounded-3xl border-2 border-yellow-300 bg-gradient-to-br from-yellow-50 via-white to-yellow-100/60 p-8 sm:p-12 shadow-lg flex flex-col lg:flex-row items-center justify-between gap-8">
          <div>
            <span className="eyebrow">Plano Especial Sem Juros</span>
            <h2 className="mt-2 text-2xl sm:text-3xl font-extrabold text-slate-950">
              Quer tirar sua moto Yamaha 0km pelo Consórcio?
            </h2>
            <p className="mt-2 text-sm text-slate-600 max-w-xl">
              Com o Consórcio Yamaha Baruch, você adquire sua motocicleta em planos com parcelas a partir de <strong>R$ 277,06/mês</strong> sem entrada obrigatória e sem juros.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button
              onClick={() => setConsorcioModal(motos[0])}
              arrow
            >
              Simular Cota Yamaha
            </Button>
            <Button
              href={waLink('Olá! Gostaria de fazer uma simulação do Consórcio Yamaha para Motocicletas.')}
              variant="ghost"
            >
              Atendimento WhatsApp
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
