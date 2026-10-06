import { useState, type FormEvent } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { CheckCircle2, Clock, Mail, MapPin, Phone, ShieldCheck, Award, Users, Sparkles, HelpCircle, Check, ArrowRight, Calculator, Bike, Car, Anchor, Home as HomeIcon, Truck } from 'lucide-react'
import { Button, Reveal, SectionHeading } from '../components/ui'
import { BrandGrid, CtaFinal, ExperienceSection } from '../components/sections'
import { CONSORCIO, SITE, vehicles, waLink } from '../lib/data'

const PageHead = ({ eyebrow, title, sub }: { eyebrow: string; title: string; sub?: string }) => (
  <header className="mx-auto max-w-[1480px] px-6 pb-12 pt-32 lg:pt-36 lg:px-12">
    <h1 className="sr-only">{title}</h1>
    <SectionHeading eyebrow={eyebrow} title={title} sub={sub} />
  </header>
)

export function Marcas() {
  return (
    <div className="min-h-screen bg-slate-50/50 pb-32">
      <PageHead eyebrow="Catálogo de Marcas" title="Encontre pela sua marca preferida." sub="Escolha a marca que combina com seu estilo e necessidades." />
      <div className="mx-auto max-w-[1480px] px-6 lg:px-12">
        <BrandGrid />
      </div>
    </div>
  )
}

export function QuemSomos() {
  const mvv = [
    ['01', 'Missão', 'Transformar relacionamentos comerciais em parcerias familiares, oferecendo excelência, transparência absoluta e um pós-venda incomparável.'],
    ['02', 'Visão', 'Ser reconhecida como a empresa que redefiniu parceria genuína no mercado automotivo do Maranhão.'],
  ]
  const valores = ['Família', 'Transparência radical', 'Excelência', 'Relacionamento', 'Pós-venda']

  return (
    <div className="min-h-screen bg-slate-50/40">
      <PageHead eyebrow="Quem somos" title="Você não está apenas comprando um carro." sub="Está escolhendo com quem vai contar depois da compra." />
      <ExperienceSection />
      
      <section className="bg-white py-24 lg:py-32 border-y border-slate-200/80" aria-label="Missão, visão e valores">
        <div className="mx-auto max-w-[1480px] px-6 lg:px-12">
          {mvv.map(([n, t, d], i) => (
            <Reveal key={t}>
              <div className={`grid gap-6 border-t border-slate-200 py-12 lg:grid-cols-[100px_200px_1fr] ${i === 1 ? 'border-b' : ''}`}>
                <span className="font-display text-sm font-bold text-yellow-600">{n}</span>
                <h2 className="font-display text-xs font-bold uppercase tracking-[0.25em] text-slate-400">{t}</h2>
                <p className="max-w-3xl font-display text-[clamp(1.5rem,2.8vw,2.4rem)] font-bold text-slate-900 leading-[1.2]">{d}</p>
              </div>
            </Reveal>
          ))}
          
          <Reveal>
            <div className="mt-16 grid gap-8 lg:grid-cols-[300px_1fr]">
              <div>
                <span className="eyebrow">Nossos Pilares</span>
                <h2 className="mt-3 text-2xl font-bold text-slate-900">Valores que nos guiam</h2>
              </div>
              <ol className="space-y-2">
                {valores.map((v, i) => (
                  <li key={v} className="group flex items-center gap-6 border-b border-slate-100 py-4 transition-all duration-300 hover:pl-3">
                    <span className="text-xs font-bold text-yellow-600">0{i + 1}</span>
                    <span className="font-display text-2xl sm:text-3xl font-bold text-slate-800 transition-colors group-hover:text-yellow-700">{v}</span>
                  </li>
                ))}
              </ol>
            </div>
          </Reveal>
        </div>
      </section>

      <CtaFinal />
    </div>
  )
}

export function Consorcio({ teaser = false }: { teaser?: boolean }) {
  const [sp] = useSearchParams()
  const activeCategoryParam = sp.get('cat')

  const stats = [
    ['60+', 'anos de mercado mundial'],
    ['50+', 'anos no Brasil'],
    ['43', 'anos de Consórcio Yamaha'],
    ['120 mil+', 'consorciados ativos'],
    ['500 mil+', 'sonhos realizados'],
  ]

  const modalidades = [
    { title: 'Sorteio Mensal', desc: 'Concorra todos os meses pela Loteria Federal sem pagar nada a mais pela contemplação.' },
    { title: 'Lance Livre', desc: 'Oferte o percentual que desejar para antecipar a retirada do seu bem.' },
    { title: 'Lance Fixo', desc: 'Concorra apenas com consorciados que ofertaram o mesmo percentual fixado em contrato.' },
    { title: 'Lance Embutido', desc: 'Utilize até 25% da própria carta de crédito para pagar o seu lance vencedor.' },
  ]

  const getCategoryIcon = (id: string) => {
    switch (id) {
      case 'motos': return Bike
      case 'autos': return Car
      case 'nautica': return Anchor
      case 'imoveis': return HomeIcon
      case 'caminhoes': return Truck
      default: return Sparkles
    }
  }

  return (
    <section className={`relative overflow-hidden ${teaser ? 'bg-gradient-to-b from-slate-50/70 via-yellow-50/20 to-white py-24 lg:py-32' : 'bg-white pb-32 pt-32 lg:pt-36'}`} aria-labelledby="consorcio">
      <div className="relative mx-auto max-w-[1480px] px-6 lg:px-12">
        <span className="eyebrow">Consórcio Yamaha Baruch</span>
        <h2 id="consorcio" className="mt-4 max-w-4xl text-[clamp(2.5rem,6vw,4.8rem)] font-extrabold tracking-tight text-slate-950 leading-[1.02]">
          Seu sonho acontece primeiro.
        </h2>
        <p className="mt-4 max-w-2xl text-base md:text-lg text-slate-600 leading-relaxed font-normal">
          A Yamaha Consórcio é a administradora oficial no Brasil. Planeje a conquista da sua moto 0km, automóvel, náutica ou imóvel sem taxa de juros e com parcelas que cabem no bolso.
        </p>

        {/* Indicadores Yamaha */}
        <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {stats.map(([a, b]) => (
            <div key={b} className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm">
              <p className="font-display text-3xl font-extrabold text-yellow-600 lg:text-4xl">{a}</p>
              <p className="mt-1 text-xs text-slate-500 font-semibold">{b}</p>
            </div>
          ))}
        </div>

        {/* Cards de Categorias Dedicadas (Navegação para páginas dedicadas) */}
        <div className="mt-10">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
            Selecione uma categoria para explorar os modelos e planos dedicados:
          </p>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {CONSORCIO.map((c, i) => {
              const Icon = getCategoryIcon(c.id)
              return (
                <Reveal key={c.id} delay={i * 0.04}>
                  <Link
                    to={c.to}
                    className="group flex h-full min-h-[260px] flex-col justify-between rounded-3xl border-2 border-slate-200/80 bg-white p-6 transition-all duration-300 hover:-translate-y-1.5 hover:border-yellow-400 hover:shadow-[0_16px_36px_rgba(234,179,8,0.14)] shadow-sm"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className="grid h-11 w-11 place-items-center rounded-2xl bg-yellow-100 text-yellow-900 group-hover:bg-yellow-400 transition-colors">
                          <Icon size={20} />
                        </div>
                        <span className="grid h-8 w-8 place-items-center rounded-full border border-slate-200 text-slate-400 group-hover:border-yellow-400 group-hover:bg-yellow-400 group-hover:text-slate-950 transition-all text-xs font-bold">
                          →
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-slate-950 group-hover:text-yellow-700 transition-colors leading-snug">
                        {c.nome}
                      </h3>
                      <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                        {c.descricao}
                      </p>
                    </div>

                    <div className="mt-6 border-t border-slate-100 pt-4">
                      <p className="text-[0.65rem] font-bold uppercase tracking-wider text-slate-400">parcelas a partir de</p>
                      <p className="font-display text-2xl font-extrabold text-slate-950 group-hover:text-yellow-600 transition-colors">
                        {c.valor}
                      </p>
                      <span className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-yellow-700 group-hover:underline">
                        {c.cta} <ArrowRight size={12} />
                      </span>
                    </div>
                  </Link>
                </Reveal>
              )
            })}
          </div>
        </div>

        {/* Formas de Contemplação */}
        <div className="mt-20 rounded-3xl border border-slate-200/80 bg-slate-50/50 p-8 sm:p-12">
          <div className="max-w-2xl">
            <span className="eyebrow">Formas de Contemplação</span>
            <h3 className="mt-2 text-2xl sm:text-3xl font-extrabold text-slate-950">Como você pode retirar seu bem:</h3>
            <p className="mt-2 text-sm text-slate-600">Você não precisa esperar até o final do plano para ser contemplado.</p>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {modalidades.map((m, idx) => (
              <div key={m.title} className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
                <span className="grid h-8 w-8 place-items-center rounded-xl bg-yellow-100 text-yellow-900 font-bold text-xs mb-3">
                  0{idx + 1}
                </span>
                <h4 className="font-bold text-slate-950 text-base">{m.title}</h4>
                <p className="mt-2 text-xs text-slate-500 leading-relaxed">{m.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export function Contato() {
  const [sent, setSent] = useState(false)
  const [busy, setBusy] = useState(false)
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [telefone, setTelefone] = useState('')
  const [assunto, setAssunto] = useState('Tenho interesse em um veículo')
  const [veiculo, setVeiculo] = useState('')
  const [mensagem, setMensagem] = useState('')

  const submit = (e: FormEvent) => {
    e.preventDefault()
    setBusy(true)
    setTimeout(() => {
      setBusy(false)
      setSent(true)
      const msg = `Olá! Mensagem enviada pelo site da Baruch:\n\n• *Nome:* ${nome}\n• *Telefone:* ${telefone}\n• *E-mail:* ${email}\n• *Assunto:* ${assunto}\n• *Veículo de interesse:* ${veiculo || 'Geral'}\n• *Mensagem:* ${mensagem || 'Gostaria de atendimento.'}`
      window.open(waLink(msg), '_blank')
    }, 600)
  }

  const cls = 'mt-1.5 h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none shadow-sm transition placeholder:text-slate-400 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-100'

  const info = [
    [Phone, 'Telefone / WhatsApp', SITE.phone],
    [Mail, 'E-mail Comercial', SITE.email],
    [MapPin, 'Endereço Showroom', SITE.address],
    [Clock, 'Horário de Funcionamento', 'Segunda a Sexta: 8h às 18h · Sáb & Dom: Fechado'],
  ] as const

  return (
    <div className="min-h-screen bg-slate-50/50 pb-32">
      <PageHead eyebrow="Fale Conosco" title="Vamos conversar?" sub="Tire suas dúvidas, agende um test drive exclusivo ou solicite uma avaliação do seu seminovo." />
      
      <div className="mx-auto grid max-w-[1480px] gap-12 px-6 pb-20 lg:grid-cols-[1.3fr_1fr] lg:px-12">
        <div className="rounded-3xl border border-slate-200/80 bg-white p-8 sm:p-10 shadow-sm">
          <form onSubmit={submit} className="space-y-4">
            {sent ? (
              <div className="py-12 text-center">
                <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-yellow-100 text-yellow-700 mb-4">
                  <CheckCircle2 size={32} />
                </div>
                <p className="font-display text-2xl font-bold text-slate-900">Mensagem enviada com sucesso!</p>
                <p className="mt-2 text-sm text-slate-600 max-w-sm mx-auto">Nossa equipe responderá sua solicitação através do WhatsApp informado.</p>
                <button
                  type="button"
                  onClick={() => setSent(false)}
                  className="mt-6 rounded-full bg-slate-900 px-6 py-2.5 text-xs font-semibold text-white"
                >
                  Enviar outra mensagem
                </button>
              </div>
            ) : (
              <>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                    Seu Nome
                    <input
                      required
                      value={nome}
                      onChange={e => setNome(e.target.value)}
                      placeholder="Nome completo"
                      className={cls}
                    />
                  </label>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                    E-mail
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="seu@email.com"
                      className={cls}
                    />
                  </label>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                    WhatsApp / Telefone
                    <input
                      type="tel"
                      required
                      value={telefone}
                      onChange={e => setTelefone(e.target.value)}
                      placeholder="(98) 99999-9999"
                      className={cls}
                    />
                  </label>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                    Assunto
                    <select
                      value={assunto}
                      onChange={e => setAssunto(e.target.value)}
                      className={cls}
                    >
                      <option>Tenho interesse em um veículo</option>
                      <option>Comprar moto Yamaha 0km</option>
                      <option>Agendar test drive</option>
                      <option>Avaliação do meu veículo usado</option>
                      <option>Consórcio Yamaha</option>
                      <option>Outro assunto</option>
                    </select>
                  </label>
                </div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                  Veículo de interesse (opcional)
                  <select
                    value={veiculo}
                    onChange={e => setVeiculo(e.target.value)}
                    className={cls}
                  >
                    <option value="">Selecione um modelo...</option>
                    {vehicles.map(v => (
                      <option key={v.id} value={`${v.marca} ${v.modelo} ${v.versao}`}>
                        {v.marca} {v.modelo} {v.versao}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                  Mensagem
                  <textarea
                    rows={4}
                    value={mensagem}
                    onChange={e => setMensagem(e.target.value)}
                    placeholder="Como podemos te ajudar hoje?"
                    className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-900 outline-none shadow-sm transition placeholder:text-slate-400 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-100"
                  />
                </label>
                <Button type="submit" arrow className="w-full sm:w-auto">
                  {busy ? 'Enviando…' : 'Enviar mensagem para a Baruch'}
                </Button>
              </>
            )}
          </form>
        </div>

        <div className="space-y-4 self-start">
          <div className="rounded-3xl border border-slate-200/80 bg-white p-8 shadow-sm space-y-6">
            <h3 className="font-bold text-slate-900 text-lg">Informações Diretas</h3>
            <div className="space-y-5">
              {info.map(([I, l, v]) => (
                <div key={l} className="flex gap-4">
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-yellow-50 border border-yellow-200 text-yellow-700">
                    <I size={18} />
                  </div>
                  <div>
                    <p className="text-[0.68rem] font-bold uppercase tracking-wider text-slate-400">{l}</p>
                    <p className="text-sm font-semibold text-slate-800 mt-0.5">{v}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Mapa */}
      <div className="mx-auto max-w-[1480px] px-6 lg:px-12">
        <div className="overflow-hidden rounded-3xl border border-slate-200 shadow-sm bg-white p-2">
          <iframe
            title="Localização Baruch Veículos"
            loading="lazy"
            className="h-[380px] w-full rounded-2xl"
            src={`https://www.google.com/maps?q=${encodeURIComponent('Av. dos Africanos, 386 - Fátima, São Luís - MA')}&output=embed`}
          />
        </div>
      </div>
    </div>
  )
}
