import { useRef, useState, type ReactNode } from 'react'
import { motion, useInView } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, MessageCircle } from 'lucide-react'
import { SITE, waLink } from '../lib/data'

const ease = [0.22, 1, 0.36, 1] as const

export function Logo({ size = 42, wordmark = true, dark = false }: { size?: number; wordmark?: boolean; dark?: boolean }) {
  const h = size
  const w = Math.round(size * 0.65)

  return (
    <span className="inline-flex items-center gap-2 select-none" aria-label="Baruch Veículos">
      {/* Official Emblem: Authentic Yellow Capsule with Black Cursive B */}
      <img
        src="/brand/emblem.png"
        alt="Baruch Veículos"
        width={w}
        height={h}
        className="shrink-0 object-contain drop-shadow-xs transition-transform duration-300 hover:scale-105"
        style={{ height: h, width: 'auto' }}
        loading="eager"
      />

      {/* Official Wordmark */}
      {wordmark && (
        <span className="flex flex-col justify-center leading-none">
          <span className={`font-display text-[1.44rem] font-black tracking-[0.06em] ${dark ? 'text-white' : 'text-slate-950'}`}>
            BARUCH
          </span>
          <span className={`mt-0.5 text-[0.56rem] font-extrabold tracking-[0.42em] ${dark ? 'text-yellow-400' : 'text-slate-500'}`}>
            VEÍCULOS
          </span>
        </span>
      )}
    </span>
  )
}

export function Reveal({ children, delay = 0, y = 24, className = '' }: { children: ReactNode; delay?: number; y?: number; className?: string }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '0px 0px -8% 0px' })
  return (
    <motion.div ref={ref} className={className} initial={{ opacity: 0, y }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, delay, ease }}>
      {children}
    </motion.div>
  )
}

export function SectionHeading({ eyebrow, title, sub, dark = false, align = 'left' }: { eyebrow: string; title: string; sub?: string; dark?: boolean; align?: 'left' | 'center' }) {
  return (
    <Reveal className={align === 'center' ? 'text-center mx-auto' : ''}>
      <span className={dark ? 'eyebrow-light' : 'eyebrow'}>{eyebrow}</span>
      <h2 className={`mt-4 max-w-3xl text-[clamp(2.2rem,4.5vw,3.8rem)] font-semibold leading-[1.05] tracking-tight ${dark ? 'text-white' : 'text-slate-900'} ${align === 'center' ? 'mx-auto' : ''}`}>{title}</h2>
      {sub && <p className={`mt-4 max-w-xl text-base md:text-lg leading-relaxed ${dark ? 'text-slate-300' : 'text-slate-600'} ${align === 'center' ? 'mx-auto' : ''}`}>{sub}</p>}
    </Reveal>
  )
}

type BtnProps = { children: ReactNode; to?: string; href?: string; onClick?: () => void; variant?: 'gold' | 'ghost' | 'dark' | 'outline'; className?: string; type?: 'button' | 'submit'; arrow?: boolean }
export function Button({ children, to, href, onClick, variant = 'gold', className = '', type = 'button', arrow }: BtnProps) {
  const base = 'group relative inline-flex items-center justify-center gap-2.5 overflow-hidden rounded-full px-7 py-3.5 text-sm font-semibold tracking-wide transition-all duration-300 active:scale-[0.98] min-h-12 shadow-sm'
  const v = {
    gold: 'bg-gold text-slate-950 hover:bg-yellow-400 hover:shadow-[0_8px_24px_rgba(234,179,8,0.28)]',
    ghost: 'border border-slate-300 text-slate-800 bg-white hover:border-slate-900 hover:bg-slate-50',
    dark: 'bg-slate-900 text-white hover:bg-slate-800 hover:shadow-[0_8px_24px_rgba(15,23,42,0.25)]',
    outline: 'border border-white/25 text-white hover:border-white hover:bg-white/10',
  }[variant]
  const inner = (<>{children}{arrow && <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />}</>)
  const cls = `${base} ${v} ${className}`
  if (to) return <Link to={to} className={cls}>{inner}</Link>
  if (href) return <a href={href} className={cls} target={href.startsWith('http') ? '_blank' : undefined} rel="noreferrer">{inner}</a>
  return <button type={type} onClick={onClick} className={cls}>{inner}</button>
}

export function Img({ src, alt, className = '' }: { src: string; alt: string; className?: string }) {
  const [ok, setOk] = useState(false)
  return (
    <span className={`relative block overflow-hidden ${ok ? '' : 'skeleton'} ${className}`}>
      <img src={src} alt={alt} loading="lazy" onLoad={() => setOk(true)} className={`h-full w-full object-cover transition-opacity duration-500 ${ok ? 'opacity-100' : 'opacity-0'}`} />
    </span>
  )
}

export function WhatsAppFloat() {
  return (
    <a href={waLink('Olá! Vim pelo site da Baruch Veículos.')} target="_blank" rel="noreferrer" aria-label="Falar no WhatsApp"
      className="fixed bottom-6 right-6 z-40 hidden h-13 items-center gap-3 rounded-full bg-gold px-6 text-sm font-semibold text-slate-950 shadow-[0_10px_30px_rgba(234,179,8,0.35)] transition-all duration-300 hover:scale-105 hover:bg-yellow-400 md:flex">
      <MessageCircle size={19} className="fill-current" /> WhatsApp
    </a>
  )
}

export const Badge = ({ children, tone = 'gold' }: { children: ReactNode; tone?: 'gold' | 'dark' | 'soft' }) => {
  const styles = {
    gold: 'bg-yellow-100 text-yellow-900 border border-yellow-300',
    dark: 'bg-slate-900 text-white',
    soft: 'bg-slate-100 text-slate-700 border border-slate-200',
  }[tone]
  return <span className={`rounded-full px-3 py-1 text-[0.65rem] font-bold uppercase tracking-[0.14em] ${styles}`}>{children}</span>
}

export const TrustBadge = ({ children }: { children: ReactNode }) => (
  <li className="flex items-center gap-3 text-sm text-slate-700 font-medium">
    <span className="grid h-5 w-5 place-items-center rounded-full bg-yellow-100 text-[11px] font-bold text-yellow-800 border border-yellow-300">✓</span>
    {children}
  </li>
)

export { SITE }

