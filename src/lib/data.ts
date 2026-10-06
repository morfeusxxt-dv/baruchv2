import raw from '../data/vehicles.json'

export type Vehicle = {
  id: string; slug: string; marca: string; modelo: string; versao: string
  anoFab: number; anoMod: number; cor: string | null; combustivel: string; cambio: string
  km: number; preco: number; status: string; opcionais: string[]; descricao: string
  destaque: boolean; entrada: string; categoria: string; vistoriado: boolean; imagens: string[]
}

export const SITE = {
  name: 'Baruch Veículos',
  phone: '(98) 98591-6850',
  whatsapp: '5598985916850',
  email: 'contato@baruchveiculos.com.br',
  address: 'Av. dos Africanos, 386 - Fátima, São Luís - MA, 65031-455',
  hours: [['Segunda a sexta', '8h às 18h'], ['Sábado e domingo', 'Fechado']],
}

// Normaliza dados para garantir marcas padronizadas e categorias consistentes
export const vehicles: Vehicle[] = (raw as Vehicle[]).map(v => {
  const isYamaha = v.marca.toLowerCase().includes('yamaha')
  return {
    ...v,
    marca: isYamaha ? 'Yamaha' : v.marca,
    categoria: isYamaha ? 'MOTO' : (v.categoria || 'HATCH'),
  }
})

export const isMoto = (v: Vehicle) => v.marca.toLowerCase().includes('yamaha') || v.categoria === 'MOTO'
export const motos = vehicles.filter(isMoto)
export const carros = vehicles.filter(v => !isMoto(v))

// Subclassificação inteligente para motocicletas Yamaha
export type MotoSubcategory = 'street' | 'trail' | 'scooter' | 'hibrida_eletrica' | 'offroad'

export const getMotoCategory = (m: Vehicle): MotoSubcategory => {
  const name = `${m.modelo} ${m.versao} ${m.descricao}`.toLowerCase()
  if (name.includes('crosser') || name.includes('lander') || name.includes('tenere')) return 'trail'
  if (name.includes('aerox') || name.includes('fluo') || name.includes('nmax') || name.includes('neo') || name.includes('scooter')) {
    if (m.combustivel === 'eletrico' || m.combustivel === 'hibrido') return 'hibrida_eletrica'
    return 'scooter'
  }
  if (name.includes('tt-r') || name.includes('wr') || name.includes('trilha') || name.includes('off-road')) return 'offroad'
  if (m.combustivel === 'eletrico' || m.combustivel === 'hibrido') return 'hibrida_eletrica'
  return 'street'
}

export const MOTO_CATEGORIES: { id: MotoSubcategory | 'todas'; label: string; icon: string }[] = [
  { id: 'todas', label: 'Todas as Motos', icon: '🏍️' },
  { id: 'street', label: 'Street & Urbana', icon: '⚡' },
  { id: 'trail', label: 'Trail & Aventura', icon: '🏔️' },
  { id: 'scooter', label: 'Scooters & City', icon: '🛵' },
  { id: 'hibrida_eletrica', label: 'Híbridas & Elétricas', icon: '🔋' },
  { id: 'offroad', label: 'Off-Road & Trilha', icon: '🏁' },
]

export type ConsorcioPlan = {
  meses: number
  parcela: number
  parcelaFmt: string
}

// Extrai parcelas reais do Consórcio Yamaha descritas no texto ou calcula tabelado
export const getConsorcioPlans = (v: Vehicle): ConsorcioPlan[] => {
  const text = v.descricao || ''
  const plans: ConsorcioPlan[] = []
  
  // Regex para capturar e.g. "80x de R$ 375,49"
  const regex = /(\d{2})x\s*de\s*R\$\s*([\d\.,]+)/gi
  let match
  while ((match = regex.exec(text)) !== null) {
    const meses = parseInt(match[1], 10)
    const valClean = match[2].replace(/\./g, '').replace(',', '.')
    const parcela = parseFloat(valClean)
    if (!isNaN(parcela)) {
      plans.push({
        meses,
        parcela,
        parcelaFmt: parcela.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
      })
    }
  }

  // Se não tiver no texto, calcula estimativa padrão da Yamaha Consórcio (taxa adm ~16-20% diluída em prazos)
  if (plans.length === 0) {
    const base = v.preco || 20000
    const prazos = [80, 72, 60, 48, 36]
    return prazos.map(meses => {
      const taxaAdm = 1 + (meses >= 60 ? 0.20 : 0.16)
      const parcela = (base * taxaAdm) / meses
      return {
        meses,
        parcela: Math.round(parcela * 100) / 100,
        parcelaFmt: parcela.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
      }
    })
  }

  return plans.sort((a, b) => b.meses - a.meses)
}

export const getMinConsorcioParcela = (v: Vehicle): string => {
  const plans = getConsorcioPlans(v)
  if (plans.length > 0) {
    const longest = plans[0] // 80x ou maior prazo
    return longest.parcelaFmt
  }
  return 'R$ 277,06'
}

export const FEATURED_ORDER = [
  'volkswagen-polo-track-1-0-2026-1', 'volkswagen-gol-mpi-1-0-2023', 'volkswagen-saveiro-cross-ce-2014',
  'nissan-kicks-play-sense-2025', 'jeep-compass-longitude-2017', 'fiat-strada-freedom-cd-1-3-2025',
]
export const featured = FEATURED_ORDER.map(s => vehicles.find(v => v.slug === s)!).filter(Boolean)
export const featuredMotos = motos.slice(0, 6)
export const getVehicle = (slug?: string) => vehicles.find(v => v.slug === slug)

export const brl = (n: number) => n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
export const kmFmt = (n: number) => (n === 0 ? '0 km (Nova)' : `${n.toLocaleString('pt-BR')} km`)
export const fuel = (f: string) => ({ flex: 'Flex', hibrido: 'Híbrido', eletrico: 'Elétrico', gasolina: 'Gasolina', diesel: 'Diesel' } as Record<string, string>)[f] ?? f
export const gear = (g: string) => (g === 'automatico' ? 'Automático' : g === 'manual' ? 'Manual' : g)
export const title = (v: Vehicle) => `${v.marca} ${v.modelo}`.replace(/\s+/g, ' ').trim()
export const years = (v: Vehicle) => `${v.anoFab}/${v.anoMod}`
export const waLink = (msg: string) => `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(msg)}`
export const waVehicle = (v: Vehicle) =>
  waLink(`Olá, tenho interesse no ${title(v)} ${v.versao} ${years(v)} anunciado no site da Baruch.`)

export const BRANDS = ['Fiat', 'Chevrolet', 'Volkswagen', 'Toyota', 'Honda', 'Ford', 'Jeep', 'Renault', 'Mitsubishi', 'Caoa Chery', 'Hyundai', 'Nissan', 'Kia', 'BMW', 'Mercedes-Benz', 'Audi', 'BYD', 'Citroën', 'Volvo', 'Yamaha']
const SLUGS: Record<string, string> = { 'Caoa Chery': 'chery', 'Mercedes-Benz': 'mercedes', Citroën: 'citroen', Volkswagen: 'volkswagen', Yamaha: 'yamaha' }
export const brandIcon = (b: string) => `https://cdn.simpleicons.org/${SLUGS[b] ?? b.toLowerCase()}/2563eb`
export const brandCount = (b: string) => vehicles.filter(v => v.marca.toLowerCase().startsWith(b.toLowerCase())).length

export const CONSORCIO = [
  { id: 'motos', nome: 'Motocicletas Yamaha', valor: 'R$ 277,06', to: '/motos', cta: 'Ver showroom de motos', descricao: 'Planos para toda a linha Yamaha 0km, elétricas e híbridas', taxa: 'Taxa zero de juros · Até 80 meses' },
  { id: 'autos', nome: 'Automóveis', valor: 'R$ 370,68', to: '/estoque', cta: 'Ver estoque de automóveis', descricao: 'Carros novos e seminovos multimarcas com entrega garantida', taxa: 'Planos de 36x a 100x' },
  { id: 'nautica', nome: 'Motores de popa & Náutica', valor: 'R$ 262,48', to: '/consorcio/nautica', cta: 'Ver planos náuticos', descricao: 'Consórcio náutico oficial Yamaha Marine para embarcações', taxa: 'Até 60 meses para embarcações' },
  { id: 'imoveis', nome: 'Imóveis & Terrenos', valor: 'R$ 372,84', to: '/consorcio/imoveis', cta: 'Ver planos imobiliários', descricao: 'Casas, apartamentos, terrenos, construção e reformas', taxa: 'Prazos estendidos de até 200 meses' },
  { id: 'caminhoes', nome: 'Caminhões & Pesados', valor: 'R$ 2.518,44', to: '/consorcio/pesados', cta: 'Ver linha pesada e frotas', descricao: 'Frotas, cavalos mecânicos, caminhões e utilitários de carga', taxa: 'Linha pesada com lance facilitado' },
]
