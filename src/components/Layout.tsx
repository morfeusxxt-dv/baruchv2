import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Menu, X, Phone, MapPin, Mail, Sparkles, Calculator, Search, Heart, Scale } from 'lucide-react'
import { Logo } from './ui'
import { SITE, waLink } from '../lib/data'
import { useStore } from '../lib/store'

export const NAV = [
  { to: '/', label: 'Início' },
  { to: '/estoque', label: 'Estoque' },
  { to: '/motos', label: 'Motos Yamaha' },
  { to: '/financiamento', label: 'Financiamento' },
  { to: '/avaliacao', label: 'Avaliar Veículo' },
  { to: '/consorcio', label: 'Consórcio' },
  { to: '/quem-somos', label: 'Quem Somos' },
  { to: '/contato', label: 'Contato' },
]

export function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()
  const { setSearchOpen, setFavDrawerOpen, favorites } = useStore()

  useEffect(() => {
    const f = () => setScrolled(scrollY > 20)
    f()
    addEventListener('scroll', f, { passive: true })
    return () => removeEventListener('scroll', f)
  }, [])

  useEffect(() => setOpen(false), [pathname])
  useEffect(() => { document.body.style.overflow = open ? 'hidden' : '' }, [open])

  return (
    <>
      <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${scrolled ? 'h-[72px] border-b border-slate-200/80 bg-white/95 shadow-sm backdrop-blur-md' : 'h-24 bg-white/60 backdrop-blur-sm lg:bg-transparent'}`}>
        <div className="mx-auto flex h-full max-w-[1480px] items-center justify-between px-6 lg:px-12">
          <Link to="/" aria-label="Baruch Veículos - início">
            <Logo size={scrolled ? 36 : 42} dark={false} />
          </Link>

          <nav aria-label="Principal" className="hidden items-center gap-5 xl:gap-7 lg:flex">
            {NAV.map(n => (
              <NavLink
                key={n.to}
                to={n.to}
                end={n.to === '/'}
                className={({ isActive }) => `relative py-2 text-xs xl:text-sm font-semibold tracking-wide transition-colors ${isActive ? 'text-yellow-800' : 'text-slate-700 hover:text-slate-950'}`}
              >
                {({ isActive }) => (
                  <>
                    {n.label}
                    <span className={`absolute -bottom-0.5 left-0 h-[2.5px] bg-yellow-400 rounded-full transition-all duration-300 ${isActive ? 'w-full' : 'w-0'}`} />
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-2.5">
            {/* Botão de Busca Global */}
            <button
              onClick={() => setSearchOpen(true)}
              aria-label="Buscar veículos e páginas"
              title="Buscar (Ctrl+K)"
              className="grid h-10 w-10 place-items-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-yellow-400 hover:text-slate-950"
            >
              <Search size={16} />
            </button>

            {/* Botão de Favoritos */}
            <button
              onClick={() => setFavDrawerOpen(true)}
              aria-label="Ver favoritos salvos"
              title="Meus Favoritos"
              className="relative grid h-10 w-10 place-items-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-yellow-400 hover:text-red-500"
            >
              <Heart size={16} fill={favorites.length > 0 ? '#ef4444' : 'none'} className={favorites.length > 0 ? 'text-red-500' : ''} />
              {favorites.length > 0 && (
                <span className="absolute -top-1 -right-1 grid h-4 w-4 place-items-center rounded-full bg-yellow-400 text-[10px] font-extrabold text-slate-950 shadow">
                  {favorites.length}
                </span>
              )}
            </button>

            {/* WhatsApp Contato */}
            <a
              href={waLink('Olá! Vim pelo site da Baruch Veículos.')}
              target="_blank"
              rel="noreferrer"
              className="hidden items-center gap-2.5 rounded-full border border-slate-200 bg-white shadow-sm py-1.5 pl-2 pr-4 text-xs transition hover:border-yellow-400 hover:shadow md:flex"
            >
              <span className="grid h-7 w-7 place-items-center rounded-full bg-yellow-400 text-slate-950 font-bold">
                <Phone size={13} />
              </span>
              <span className="leading-tight">
                <span className="block text-[0.58rem] font-bold uppercase tracking-wider text-slate-400">WhatsApp</span>
                <span className="font-bold text-slate-900">{SITE.phone}</span>
              </span>
            </a>

            {/* Menu Hambúrguer Mobile */}
            <button
              className="grid h-10 w-10 place-items-center rounded-full border border-slate-300 bg-white text-slate-800 lg:hidden"
              onClick={() => setOpen(true)}
              aria-label="Abrir menu"
            >
              <Menu size={18} />
            </button>
          </div>
        </div>
      </header>

      {/* Menu Drawer Mobile */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[60] flex flex-col bg-white px-6 pb-10 pt-6 shadow-2xl overflow-y-auto"
            role="dialog"
            aria-modal="true"
            aria-label="Menu de navegação"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <Logo size={36} />
              <button
                onClick={() => setOpen(false)}
                className="grid h-10 w-10 place-items-center rounded-full border border-slate-200 text-slate-800"
                aria-label="Fechar menu"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mt-4">
              <button
                onClick={() => { setOpen(false); setSearchOpen(true) }}
                className="flex w-full items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-3 text-left text-xs font-semibold text-slate-400"
              >
                <Search size={16} />
                <span>Buscar carros, motos Yamaha, consórcio...</span>
              </button>
            </div>

            <nav className="mt-6 flex flex-1 flex-col gap-1">
              {NAV.map((n, i) => (
                <div key={n.to}>
                  <Link
                    to={n.to}
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-between border-b border-slate-100 py-3.5 font-display text-2xl font-bold text-slate-900 hover:text-yellow-700"
                  >
                    <span>{n.label}</span>
                    <span className="text-xs font-bold text-yellow-600 tracking-widest">0{i + 1}</span>
                  </Link>
                </div>
              ))}
            </nav>

            <div className="mt-6 flex flex-col gap-2.5">
              <Link
                to="/financiamento"
                onClick={() => setOpen(false)}
                className="flex items-center justify-center gap-2 rounded-2xl bg-yellow-400 py-3.5 text-center font-bold text-slate-950 shadow-sm"
              >
                <Calculator size={16} /> Simular Financiamento
              </Link>
              <a
                href={waLink('Olá!')}
                className="flex items-center justify-center gap-2 rounded-2xl border border-slate-200 py-3.5 text-center font-bold text-slate-800 shadow-sm"
              >
                <Phone size={16} className="text-yellow-600" /> WhatsApp {SITE.phone}
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export function Footer() {
  const shortcuts = [
    ['Motos Yamaha 0km', '/motos'],
    ['Carros Seminovos', '/estoque'],
    ['Consórcio Imobiliário', '/consorcio/imoveis'],
    ['Consórcio Náutico Yamaha', '/consorcio/nautica'],
    ['Caminhões & Frotas', '/consorcio/pesados'],
    ['Simular Financiamento', '/financiamento'],
    ['Avalie seu Veículo', '/avaliacao'],
    ['Fale Conosco', '/contato'],
  ]
  
  return (
    <footer className="border-t border-slate-200 bg-white text-slate-800 pb-24 pt-16 md:pb-12">
      <div className="mx-auto grid max-w-[1480px] gap-10 px-6 lg:grid-cols-[1.3fr_1fr_1fr_1.2fr] lg:px-12">
        <div>
          <Logo size={44} dark={false} />
          <p className="mt-5 max-w-xs font-display text-lg leading-snug text-slate-700 font-bold">
            Seu próximo carro ou moto começa com uma escolha abençoada.
          </p>
          <div className="mt-5 flex items-center gap-2 text-xs font-bold text-yellow-900 bg-yellow-50 border border-yellow-200/80 rounded-full px-4 py-1.5 w-fit">
            <Sparkles size={13} className="text-yellow-600" />
            <span>Showroom em São Luís · MA</span>
          </div>
        </div>
        <FooterCol title="Navegação Principal">{NAV.slice(0, 5).map(n => <Link key={n.to} to={n.to} className="py-1 text-slate-600 font-medium transition hover:text-yellow-700 text-xs sm:text-sm">{n.label}</Link>)}</FooterCol>
        <FooterCol title="Serviços & Atalhos">{shortcuts.map(([l, t]) => <Link key={l} to={t} className="py-1 text-slate-600 font-medium transition hover:text-yellow-700 text-xs sm:text-sm">{l}</Link>)}</FooterCol>
        <FooterCol title="Atendimento Showroom">
          <span className="flex gap-2 text-slate-600 text-xs sm:text-sm font-medium"><MapPin size={15} className="mt-0.5 shrink-0 text-yellow-600" />{SITE.address}</span>
          <a href={`mailto:${SITE.email}`} className="flex gap-2 text-slate-600 text-xs sm:text-sm font-medium hover:text-yellow-700"><Mail size={15} className="mt-0.5 text-yellow-600" />{SITE.email}</a>
          <a href={waLink('Olá!')} className="flex gap-2 text-slate-600 text-xs sm:text-sm font-medium hover:text-yellow-700"><Phone size={15} className="mt-0.5 text-yellow-600" />WhatsApp: {SITE.phone}</a>
        </FooterCol>
      </div>
      <div className="mx-auto mt-12 flex max-w-[1480px] flex-col justify-between gap-3 border-t border-slate-100 px-6 pt-6 text-xs text-slate-400 font-medium lg:flex-row lg:px-12">
        <p>© {new Date().getFullYear()} Baruch Veículos · CNPJ cadastrado · Todos os direitos reservados.</p>
        <p>Av. dos Africanos, 386 · Bairro de Fátima · São Luís - MA, 65031-455</p>
      </div>
    </footer>
  )
}

const FooterCol = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="flex flex-col gap-2 text-sm"><h3 className="mb-2 font-sans text-xs font-bold uppercase tracking-[0.2em] text-yellow-700">{title}</h3>{children}</div>
)
