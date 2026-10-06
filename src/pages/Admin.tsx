import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus,
  Search,
  Filter,
  Car,
  Bike,
  Sparkles,
  CheckCircle2,
  XCircle,
  Edit3,
  Trash2,
  Eye,
  Download,
  Upload,
  RefreshCw,
  Database,
  Lock,
  LogOut,
  Image as ImageIcon,
  DollarSign,
  Layers,
  ChevronRight,
  X,
  Check,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  Sliders,
  Tag
} from 'lucide-react'
import { Button, Logo } from '../components/ui'
import { useStore, SupabaseConfig } from '../lib/store'
import { Vehicle, brl, kmFmt, fuel, gear, years, isMoto } from '../lib/data'

export default function Admin() {
  const {
    vehicles,
    activeVehicles,
    soldVehicles,
    carros,
    motos,
    addVehicle,
    updateVehicle,
    deleteVehicle,
    toggleVehicleStatus,
    toggleVehicleFeatured,
    resetToDefaultVehicles,
    importVehicles,
    exportVehicles,
    supabaseConfig,
    saveSupabaseConfig,
    syncWithSupabase,
    isSyncing,
    isAdminAuth,
    loginAdmin,
    logoutAdmin,
  } = useStore()

  // Auth State
  const [pinInput, setPinInput] = useState('')
  const [pinError, setPinError] = useState(false)

  // Filters & Search
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'todos' | 'ativo' | 'vendido' | 'destaque' | 'carros' | 'motos'>('todos')
  const [viewMode, setViewMode] = useState<'tabela' | 'cards'>('tabela')

  // Modals
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)
  const [cloudModalOpen, setCloudModalOpen] = useState(false)
  const [syncStatusMsg, setSyncStatusMsg] = useState<{ text: string; success: boolean } | null>(null)

  // Auth Submit
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (loginAdmin(pinInput)) {
      setPinError(false)
      setPinInput('')
    } else {
      setPinError(true)
    }
  }

  // Filtered List
  const filteredVehicles = vehicles.filter(v => {
    const term = searchTerm.toLowerCase()
    const matchesSearch =
      v.modelo.toLowerCase().includes(term) ||
      v.marca.toLowerCase().includes(term) ||
      v.versao.toLowerCase().includes(term) ||
      v.categoria.toLowerCase().includes(term)

    if (!matchesSearch) return false

    if (statusFilter === 'ativo') return v.status !== 'vendido' && v.status !== 'inativo'
    if (statusFilter === 'vendido') return v.status === 'vendido'
    if (statusFilter === 'destaque') return !!v.destaque
    if (statusFilter === 'carros') return !isMoto(v)
    if (statusFilter === 'motos') return isMoto(v)

    return true
  })

  // Total Portfolio Value
  const totalValue = activeVehicles.reduce((acc, v) => acc + (v.preco || 0), 0)

  // Export JSON file
  const handleExport = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(exportVehicles())
    const downloadAnchor = document.createElement('a')
    downloadAnchor.setAttribute('href', dataStr)
    downloadAnchor.setAttribute('download', `baruch-estoque-${new Date().toISOString().slice(0, 10)}.json`)
    document.body.appendChild(downloadAnchor)
    downloadAnchor.click()
    downloadAnchor.remove()
  }

  // Import JSON file
  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = event => {
      const content = event.target?.result as string
      if (content) {
        const res = importVehicles(content)
        if (res.success) {
          alert(`Sucesso! ${res.count} veículos foram importados.`)
        } else {
          alert('Erro ao importar: ' + res.error)
        }
      }
    }
    reader.readAsText(file)
  }

  // Cloud Sync Click
  const handleCloudSync = async () => {
    const res = await syncWithSupabase()
    setSyncStatusMsg({ text: res.message, success: res.success })
    setTimeout(() => setSyncStatusMsg(null), 5000)
  }

  // 1. PIN Login Screen
  if (!isAdminAuth) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="w-full max-w-md rounded-3xl bg-slate-900 border border-slate-800 p-8 shadow-2xl text-center space-y-6">
          <div className="flex justify-center">
            <Logo dark size={50} />
          </div>

          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-yellow-400/10 border border-yellow-400/20 px-3 py-1 text-xs font-bold text-yellow-400 mb-2">
              <Lock size={13} /> Acesso Restrito
            </span>
            <h1 className="text-2xl font-bold text-white">Painel de Gestão Baruch</h1>
            <p className="text-xs text-slate-400 mt-1">
              Digite seu PIN de acesso para gerenciar o estoque em tempo real.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="password"
                maxLength={20}
                value={pinInput}
                onChange={e => {
                  setPinInput(e.target.value)
                  setPinError(false)
                }}
                placeholder="Digite o PIN (ex: 1234 ou baruch2026)"
                className={`h-12 w-full rounded-xl border bg-slate-800 px-4 text-center text-sm text-white font-mono tracking-widest outline-none transition ${
                  pinError
                    ? 'border-red-500 focus:ring-2 focus:ring-red-500/20'
                    : 'border-slate-700 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20'
                }`}
                autoFocus
              />
              {pinError && (
                <p className="mt-1.5 text-xs font-semibold text-red-400">PIN incorreto. Tente 1234 ou baruch2026.</p>
              )}
            </div>

            <button
              type="submit"
              className="h-12 w-full rounded-xl bg-yellow-400 font-bold text-slate-950 shadow-md hover:bg-yellow-500 transition-colors"
            >
              Entrar no Painel Administrativo
            </button>
          </form>

          <div className="pt-2 border-t border-slate-800">
            <Link to="/" className="text-xs font-semibold text-slate-400 hover:text-white transition">
              ← Voltar ao site público
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // 2. Admin Dashboard View
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 pb-28 pt-24 sm:pt-28">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10">
        
        {/* Top Header Bar */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div className="flex items-center gap-4">
            <Logo dark size={40} />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">Gestão de Estoque & CMS</h1>
                <span className="rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 text-[11px] font-extrabold text-emerald-400 flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" /> Live CMS
                </span>
              </div>
              <p className="text-xs text-slate-400">Baruch Veículos · São Luís - MA</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setCloudModalOpen(true)}
              className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2 text-xs font-bold text-slate-200 hover:border-yellow-400 hover:text-yellow-400 transition"
              title="Configurar banco de dados Supabase"
            >
              <Database size={14} />
              <span>Nuvem Supabase</span>
            </button>

            <button
              onClick={handleExport}
              className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2 text-xs font-bold text-slate-200 hover:border-slate-500 transition"
              title="Baixar backup completo em JSON"
            >
              <Download size={14} />
              <span>Exportar</span>
            </button>

            <label className="flex cursor-pointer items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2 text-xs font-bold text-slate-200 hover:border-slate-500 transition">
              <Upload size={14} />
              <span>Importar</span>
              <input type="file" accept=".json" onChange={handleImport} className="hidden" />
            </label>

            <Link
              to="/estoque"
              target="_blank"
              className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2 text-xs font-bold text-slate-200 hover:text-white transition"
            >
              <Eye size={14} />
              <span>Ver Site</span>
            </Link>

            <button
              onClick={logoutAdmin}
              className="flex items-center gap-1.5 rounded-xl border border-red-500/30 bg-red-500/10 px-3.5 py-2 text-xs font-bold text-red-400 hover:bg-red-500 hover:text-white transition"
              title="Encerrar sessão"
            >
              <LogOut size={14} />
              <span>Sair</span>
            </button>
          </div>
        </div>

        {/* Sync Status Banner */}
        {syncStatusMsg && (
          <div
            className={`mb-6 flex items-center justify-between rounded-2xl p-4 text-xs font-bold ${
              syncStatusMsg.success
                ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300'
                : 'bg-red-500/10 border border-red-500/30 text-red-300'
            }`}
          >
            <div className="flex items-center gap-2">
              {syncStatusMsg.success ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
              <span>{syncStatusMsg.text}</span>
            </div>
            <button onClick={() => setSyncStatusMsg(null)}>
              <X size={14} />
            </button>
          </div>
        )}

        {/* Metrics Grid */}
        <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <div className="rounded-2xl border border-slate-800 bg-slate-800/60 p-4">
            <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">Total em Estoque</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="font-display text-2xl sm:text-3xl font-black text-white">{activeVehicles.length}</span>
              <span className="text-xs text-emerald-400 font-bold">veículos ativos</span>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-800/60 p-4">
            <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">Carros Seminovos</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="font-display text-2xl sm:text-3xl font-black text-yellow-400">{carros.filter(c => c.status !== 'vendido').length}</span>
              <span className="text-xs text-slate-400 font-medium">unidades</span>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-800/60 p-4">
            <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">Motos Yamaha 0km</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="font-display text-2xl sm:text-3xl font-black text-yellow-400">{motos.filter(m => m.status !== 'vendido').length}</span>
              <span className="text-xs text-slate-400 font-medium">modelos</span>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-800/60 p-4">
            <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">Vendidos / Histórico</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="font-display text-2xl sm:text-3xl font-black text-slate-400">{soldVehicles.length}</span>
              <span className="text-xs text-slate-500 font-medium">desativados</span>
            </div>
          </div>

          <div className="col-span-2 lg:col-span-1 rounded-2xl border border-yellow-500/30 bg-gradient-to-br from-yellow-500/10 to-amber-500/5 p-4">
            <span className="block text-[11px] font-bold uppercase tracking-wider text-yellow-400">Valor do Estoque</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="font-display text-xl sm:text-2xl font-black text-white truncate">{brl(totalValue)}</span>
            </div>
          </div>
        </div>

        {/* Toolbar & Filter Actions */}
        <div className="mb-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4 rounded-2xl border border-slate-800 bg-slate-800/40 p-4">
          
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Buscar por modelo, marca, versão..."
              className="h-11 w-full rounded-xl border border-slate-700 bg-slate-900 pl-10 pr-4 text-xs text-white placeholder-slate-500 outline-none focus:border-yellow-400"
            />
          </div>

          {/* Quick Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs font-bold">
            {(
              [
                ['todos', `Todos (${vehicles.length})`],
                ['ativo', `Ativos (${activeVehicles.length})`],
                ['vendido', `Vendidos (${soldVehicles.length})`],
                ['destaque', `Destaques (${vehicles.filter(v => v.destaque).length})`],
                ['carros', `Carros (${carros.length})`],
                ['motos', `Motos (${motos.length})`],
              ] as const
            ).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setStatusFilter(key)}
                className={`rounded-xl px-3 py-2 transition ${
                  statusFilter === key
                    ? 'bg-yellow-400 text-slate-950 shadow-xs'
                    : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* New Vehicle Button */}
          <button
            onClick={() => {
              setEditingVehicle(null)
              setIsCreating(true)
            }}
            className="flex items-center justify-center gap-2 rounded-xl bg-yellow-400 px-5 py-2.5 text-xs font-black text-slate-950 shadow-md hover:bg-yellow-500 transition"
          >
            <Plus size={16} />
            <span>Cadastrar Veículo</span>
          </button>
        </div>

        {/* Vehicles Table / Inventory Grid */}
        <div className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-800/40 shadow-xl">
          {filteredVehicles.length === 0 ? (
            <div className="py-20 text-center">
              <Car size={40} className="mx-auto text-slate-600 mb-3" />
              <p className="font-bold text-slate-300">Nenhum veículo encontrado com os filtros atuais.</p>
              <p className="text-xs text-slate-500 mt-1">Tente ajustar sua busca ou cadastre um novo veículo.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-slate-800 bg-slate-900/80 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  <tr>
                    <th className="py-4 pl-6 pr-3">Veículo</th>
                    <th className="px-3 py-4">Categoria / Ano</th>
                    <th className="px-3 py-4">Preço</th>
                    <th className="px-3 py-4">Km / Câmbio</th>
                    <th className="px-3 py-4 text-center">Destaque</th>
                    <th className="px-3 py-4 text-center">Status</th>
                    <th className="py-4 pl-3 pr-6 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-medium">
                  {filteredVehicles.map(v => {
                    const isSold = v.status === 'vendido'
                    const moto = isMoto(v)

                    return (
                      <tr key={v.id} className="hover:bg-slate-800/40 transition">
                        
                        {/* Foto e Título */}
                        <td className="py-3.5 pl-6 pr-3">
                          <div className="flex items-center gap-3.5">
                            <div className="relative h-12 w-16 shrink-0 overflow-hidden rounded-lg bg-slate-950 border border-slate-700">
                              <img
                                src={v.imagens[0] || '/brand/card.jpg'}
                                alt=""
                                className="h-full w-full object-cover"
                              />
                              <span className="absolute bottom-0.5 right-0.5 rounded bg-black/80 px-1 py-0.2 text-[9px] text-white">
                                {v.imagens.length}
                              </span>
                            </div>
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="font-bold text-white text-sm">
                                  {v.marca} {v.modelo}
                                </span>
                                {moto && (
                                  <span className="rounded bg-yellow-400/20 px-1.5 py-0.5 text-[9px] font-extrabold text-yellow-400">
                                    0km
                                  </span>
                                )}
                              </div>
                              <span className="block text-[11px] text-slate-400 truncate max-w-[220px]">
                                {v.versao || 'Versão Padrão'}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Categoria e Ano */}
                        <td className="px-3 py-3.5">
                          <span className="block font-bold text-slate-200">Ano {years(v)}</span>
                          <span className="block text-[11px] text-slate-500">{v.categoria || (moto ? 'Moto' : 'Seminovo')}</span>
                        </td>

                        {/* Preço */}
                        <td className="px-3 py-3.5">
                          <span className="font-display font-extrabold text-white text-sm">
                            {brl(v.preco)}
                          </span>
                        </td>

                        {/* Km e Câmbio */}
                        <td className="px-3 py-3.5">
                          <span className="block text-slate-300 font-semibold">{kmFmt(v.km)}</span>
                          <span className="block text-[11px] text-slate-500">{gear(v.cambio)} · {fuel(v.combustivel)}</span>
                        </td>

                        {/* Toggle Destaque */}
                        <td className="px-3 py-3.5 text-center">
                          <button
                            onClick={() => toggleVehicleFeatured(v.id)}
                            title={v.destaque ? 'Remover dos destaques' : 'Destacar na Home'}
                            className={`inline-grid h-8 w-8 place-items-center rounded-lg border transition ${
                              v.destaque
                                ? 'border-yellow-400 bg-yellow-400/20 text-yellow-400'
                                : 'border-slate-700 bg-slate-800 text-slate-500 hover:text-slate-300'
                            }`}
                          >
                            <Sparkles size={14} />
                          </button>
                        </td>

                        {/* Toggle Status (Disponível / Vendido) */}
                        <td className="px-3 py-3.5 text-center">
                          <button
                            onClick={() => toggleVehicleStatus(v.id)}
                            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-extrabold transition ${
                              isSold
                                ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                                : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            }`}
                          >
                            {isSold ? (
                              <>
                                <XCircle size={12} /> Vendido
                              </>
                            ) : (
                              <>
                                <CheckCircle2 size={12} /> Ativo
                              </>
                            )}
                          </button>
                        </td>

                        {/* Ações */}
                        <td className="py-3.5 pl-3 pr-6 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <Link
                              to={`/veiculo/${v.slug}`}
                              target="_blank"
                              title="Ver página ao vivo"
                              className="grid h-8 w-8 place-items-center rounded-lg border border-slate-700 bg-slate-800 text-slate-400 hover:text-white hover:border-slate-600 transition"
                            >
                              <ExternalLink size={13} />
                            </Link>
                            
                            <button
                              onClick={() => {
                                setEditingVehicle(v)
                                setIsCreating(false)
                              }}
                              title="Editar veículo"
                              className="grid h-8 w-8 place-items-center rounded-lg border border-slate-700 bg-slate-800 text-yellow-400 hover:bg-yellow-400 hover:text-slate-950 transition"
                            >
                              <Edit3 size={13} />
                            </button>

                            <button
                              onClick={() => setDeleteConfirmId(v.id)}
                              title="Excluir veículo"
                              className="grid h-8 w-8 place-items-center rounded-lg border border-slate-700 bg-slate-800 text-red-400 hover:bg-red-500 hover:text-white transition"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </td>

                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Reset Factory Catalog Button */}
        <div className="mt-8 flex items-center justify-between border-t border-slate-800 pt-6 text-xs text-slate-500">
          <span>Baruch Veículos Digital Store Engine v2.0</span>
          <button
            onClick={() => {
              if (confirm('Atenção: Isso irá restaurar o catálogo de veículos original de fábrica da Baruch. Deseja continuar?')) {
                resetToDefaultVehicles()
              }
            }}
            className="flex items-center gap-1.5 text-slate-500 hover:text-red-400 transition"
          >
            <RefreshCw size={13} /> Restaurar Catálogo Inicial de Fábrica
          </button>
        </div>

      </div>

      {/* MODAL DE CRIAÇÃO E EDIÇÃO DE VEÍCULO */}
      <AnimatePresence>
        {(isCreating || editingVehicle) && (
          <VehicleFormModal
            vehicle={editingVehicle}
            onClose={() => {
              setIsCreating(false)
              setEditingVehicle(null)
            }}
            onSave={data => {
              if (editingVehicle) {
                updateVehicle(editingVehicle.id, data)
              } else {
                addVehicle(data)
              }
              setIsCreating(false)
              setEditingVehicle(null)
            }}
          />
        )}
      </AnimatePresence>

      {/* MODAL DE CONFIRMAÇÃO DE EXCLUSÃO */}
      <AnimatePresence>
        {deleteConfirmId && (
          <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 backdrop-blur-sm p-4">
            <div className="w-full max-w-sm rounded-3xl bg-slate-900 border border-slate-800 p-6 text-center space-y-4 shadow-2xl">
              <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-red-500/20 text-red-400">
                <Trash2 size={24} />
              </div>
              <h3 className="text-lg font-bold text-white">Excluir este veículo?</h3>
              <p className="text-xs text-slate-400">
                Esta ação removerá o veículo do catálogo permanentemente.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setDeleteConfirmId(null)}
                  className="flex-1 rounded-xl bg-slate-800 py-2.5 text-xs font-bold text-slate-300 hover:bg-slate-700"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => {
                    deleteVehicle(deleteConfirmId)
                    setDeleteConfirmId(null)
                  }}
                  className="flex-1 rounded-xl bg-red-600 py-2.5 text-xs font-bold text-white hover:bg-red-700"
                >
                  Sim, Excluir
                </button>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL DE CONFIGURAÇÃO SUPABASE */}
      <AnimatePresence>
        {cloudModalOpen && (
          <SupabaseConfigModal
            config={supabaseConfig}
            onClose={() => setCloudModalOpen(false)}
            onSave={cfg => {
              saveSupabaseConfig(cfg)
              setCloudModalOpen(false)
              handleCloudSync()
            }}
            onSync={handleCloudSync}
            isSyncing={isSyncing}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

// -------------------------------------------------------------
// COMPONENTE DO FORMULÁRIO COMPLETO DE VEÍCULO (NOVO / EDITAR)
// -------------------------------------------------------------
function VehicleFormModal({
  vehicle,
  onClose,
  onSave,
}: {
  vehicle: Vehicle | null
  onClose: () => void
  onSave: (data: any) => void
}) {
  const isEditing = !!vehicle

  const [tipo, setTipo] = useState<'carro' | 'moto'>(vehicle ? (isMoto(vehicle) ? 'moto' : 'carro') : 'carro')
  const [marca, setMarca] = useState(vehicle?.marca || 'Volkswagen')
  const [modelo, setModelo] = useState(vehicle?.modelo || '')
  const [versao, setVersao] = useState(vehicle?.versao || '')
  const [anoFab, setAnoFab] = useState(vehicle?.anoFab || 2024)
  const [anoMod, setAnoMod] = useState(vehicle?.anoMod || 2025)
  const [preco, setPreco] = useState(vehicle?.preco || 80000)
  const [km, setKm] = useState(vehicle?.km ?? 0)
  const [combustivel, setCombustivel] = useState(vehicle?.combustivel || 'flex')
  const [cambio, setCambio] = useState(vehicle?.cambio || 'manual')
  const [cor, setCor] = useState(vehicle?.cor || 'Branco')
  const [categoria, setCategoria] = useState(vehicle?.categoria || 'HATCH')
  const [status, setStatus] = useState(vehicle?.status || 'ativo')
  const [destaque, setDestaque] = useState(vehicle?.destaque ?? false)
  const [vistoriado, setVistoriado] = useState(vehicle?.vistoriado ?? true)
  const [descricao, setDescricao] = useState(vehicle?.descricao || '')
  
  // Imagens
  const [imagens, setImagens] = useState<string[]>(vehicle?.imagens || ['/brand/card.jpg'])
  const [newImageUrl, setNewImageUrl] = useState('')

  // Opcionais
  const [opcionais, setOpcionais] = useState<string[]>(
    vehicle?.opcionais || [
      'Ar-condicionado',
      'Direção elétrica',
      'Vidros elétricos',
      'Airbags frontais',
      'Freios ABS',
    ]
  )
  const [newOpcional, setNewOpcional] = useState('')

  const commonOptions = [
    'Ar-condicionado',
    'Direção elétrica',
    'Vidros elétricos',
    'Travas elétricas',
    'Câmera de ré',
    'Sensor de estacionamento',
    'Central Multimídia',
    'Conexão Bluetooth e Apple CarPlay',
    'Controle de tração e estabilidade',
    'Bancos em couro',
    'Rodas de liga leve',
    'Faróis em LED',
    'Piloto automático',
    'Partida Start/Stop',
  ]

  const handleAddImage = () => {
    if (newImageUrl.trim()) {
      setImagens(prev => [...prev, newImageUrl.trim()])
      setNewImageUrl('')
    }
  }

  const handleRemoveImage = (index: number) => {
    setImagens(prev => prev.filter((_, i) => i !== index))
  }

  const handleAddOpcional = () => {
    if (newOpcional.trim() && !opcionais.includes(newOpcional.trim())) {
      setOpcionais(prev => [...prev, newOpcional.trim()])
      setNewOpcional('')
    }
  }

  const toggleOption = (opt: string) => {
    setOpcionais(prev => (prev.includes(opt) ? prev.filter(x => x !== opt) : [...prev, opt]))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const finalData = {
      ...(vehicle || {}),
      marca: tipo === 'moto' && !marca.toLowerCase().includes('yamaha') ? 'Yamaha' : marca,
      modelo,
      versao,
      anoFab: Number(anoFab),
      anoMod: Number(anoMod),
      preco: Number(preco),
      km: Number(km),
      combustivel,
      cambio,
      cor,
      categoria: tipo === 'moto' ? 'MOTO' : categoria,
      status,
      destaque,
      vistoriado,
      descricao,
      imagens: imagens.length > 0 ? imagens : ['/brand/card.jpg'],
      opcionais,
    }

    onSave(finalData)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/80 backdrop-blur-sm p-4 sm:p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-4xl rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden my-8"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 p-6 bg-slate-950/60">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-yellow-400">
              {isEditing ? 'Editar Veículo' : 'Novo Cadastro'}
            </span>
            <h2 className="text-xl font-bold text-white">
              {isEditing ? `${vehicle.marca} ${vehicle.modelo}` : 'Cadastrar Veículo no Estoque'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="grid h-9 w-9 place-items-center rounded-full border border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6 max-h-[75vh] overflow-y-auto">
          
          {/* Tipo de Veículo */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => {
                setTipo('carro')
                setMarca('Volkswagen')
              }}
              className={`flex-1 flex items-center justify-center gap-2 rounded-2xl py-3 border font-bold text-xs transition ${
                tipo === 'carro'
                  ? 'border-yellow-400 bg-yellow-400 text-slate-950 shadow-sm'
                  : 'border-slate-800 bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <Car size={16} /> Carro Seminovo
            </button>
            <button
              type="button"
              onClick={() => {
                setTipo('moto')
                setMarca('Yamaha')
              }}
              className={`flex-1 flex items-center justify-center gap-2 rounded-2xl py-3 border font-bold text-xs transition ${
                tipo === 'moto'
                  ? 'border-yellow-400 bg-yellow-400 text-slate-950 shadow-sm'
                  : 'border-slate-800 bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <Bike size={16} /> Motocicleta Yamaha 0km
            </button>
          </div>

          {/* Dados Principais */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Marca</label>
              <input
                required
                type="text"
                value={marca}
                onChange={e => setMarca(e.target.value)}
                placeholder="Ex: Toyota, Honda, Yamaha..."
                className="h-11 w-full rounded-xl border border-slate-700 bg-slate-800 px-3.5 text-xs text-white outline-none focus:border-yellow-400"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Modelo</label>
              <input
                required
                type="text"
                value={modelo}
                onChange={e => setModelo(e.target.value)}
                placeholder="Ex: Corolla, Polo Track, Lander 250..."
                className="h-11 w-full rounded-xl border border-slate-700 bg-slate-800 px-3.5 text-xs text-white outline-none focus:border-yellow-400"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Versão</label>
              <input
                type="text"
                value={versao}
                onChange={e => setVersao(e.target.value)}
                placeholder="Ex: 2.0 XEi Flex Automático"
                className="h-11 w-full rounded-xl border border-slate-700 bg-slate-800 px-3.5 text-xs text-white outline-none focus:border-yellow-400"
              />
            </div>
          </div>

          {/* Preço, Ano e Km */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Preço à Vista (R$)</label>
              <input
                required
                type="number"
                value={preco}
                onChange={e => setPreco(Number(e.target.value))}
                className="h-11 w-full rounded-xl border border-slate-700 bg-slate-800 px-3.5 text-xs text-white font-bold outline-none focus:border-yellow-400"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Quilometragem (Km)</label>
              <input
                type="number"
                value={km}
                onChange={e => setKm(Number(e.target.value))}
                className="h-11 w-full rounded-xl border border-slate-700 bg-slate-800 px-3.5 text-xs text-white outline-none focus:border-yellow-400"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Ano Fabricação</label>
              <input
                type="number"
                value={anoFab}
                onChange={e => setAnoFab(Number(e.target.value))}
                className="h-11 w-full rounded-xl border border-slate-700 bg-slate-800 px-3.5 text-xs text-white outline-none focus:border-yellow-400"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Ano Modelo</label>
              <input
                type="number"
                value={anoMod}
                onChange={e => setAnoMod(Number(e.target.value))}
                className="h-11 w-full rounded-xl border border-slate-700 bg-slate-800 px-3.5 text-xs text-white outline-none focus:border-yellow-400"
              />
            </div>
          </div>

          {/* Combustível, Câmbio, Cor e Categoria */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Combustível</label>
              <select
                value={combustivel}
                onChange={e => setCombustivel(e.target.value)}
                className="h-11 w-full rounded-xl border border-slate-700 bg-slate-800 px-3 text-xs text-white outline-none focus:border-yellow-400"
              >
                <option value="flex">Flex (Álcool/Gasolina)</option>
                <option value="gasolina">Gasolina</option>
                <option value="diesel">Diesel</option>
                <option value="hibrido">Híbrido</option>
                <option value="eletrico">100% Elétrico</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Câmbio</label>
              <select
                value={cambio}
                onChange={e => setCambio(e.target.value)}
                className="h-11 w-full rounded-xl border border-slate-700 bg-slate-800 px-3 text-xs text-white outline-none focus:border-yellow-400"
              >
                <option value="manual">Manual</option>
                <option value="automatico">Automático</option>
                <option value="cvt">Automático CVT</option>
                <option value="automatizado">Automatizado</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Cor</label>
              <input
                type="text"
                value={cor}
                onChange={e => setCor(e.target.value)}
                placeholder="Ex: Prata, Preto, Branco..."
                className="h-11 w-full rounded-xl border border-slate-700 bg-slate-800 px-3.5 text-xs text-white outline-none focus:border-yellow-400"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Status</label>
              <select
                value={status}
                onChange={e => setStatus(e.target.value)}
                className="h-11 w-full rounded-xl border border-slate-700 bg-slate-800 px-3 text-xs text-white outline-none focus:border-yellow-400"
              >
                <option value="ativo">Ativo (Disponível)</option>
                <option value="vendido">Vendido (Desativado)</option>
                <option value="reservado">Reservado / Proposta</option>
              </select>
            </div>
          </div>

          {/* Destaque e Vistoria Checkboxes */}
          <div className="flex flex-wrap items-center gap-6 rounded-2xl bg-slate-800/60 p-4 border border-slate-800">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-200">
              <input
                type="checkbox"
                checked={destaque}
                onChange={e => setDestaque(e.target.checked)}
                className="h-4 w-4 rounded text-yellow-400 focus:ring-yellow-400"
              />
              <span>Destaque na Página Inicial (Home)</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-200">
              <input
                type="checkbox"
                checked={vistoriado}
                onChange={e => setVistoriado(e.target.checked)}
                className="h-4 w-4 rounded text-yellow-400 focus:ring-yellow-400"
              />
              <span>Laudo Cautelar e Vistoria 100% Aprovada</span>
            </label>
          </div>

          {/* Galeria de Fotos */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Galeria de Fotos ({imagens.length} fotos)
              </label>
              <span className="text-[11px] text-slate-500">A primeira foto será a capa principal</span>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={newImageUrl}
                onChange={e => setNewImageUrl(e.target.value)}
                placeholder="Cole o link direto da imagem (URL https://...)"
                className="h-11 flex-1 rounded-xl border border-slate-700 bg-slate-800 px-3.5 text-xs text-white outline-none focus:border-yellow-400"
              />
              <button
                type="button"
                onClick={handleAddImage}
                className="rounded-xl bg-slate-800 border border-slate-700 px-4 text-xs font-bold text-yellow-400 hover:bg-slate-700 transition"
              >
                + Adicionar Foto
              </button>
            </div>

            {/* Previews das Imagens */}
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {imagens.map((url, i) => (
                <div key={url + i} className="group relative aspect-[4/3] rounded-xl overflow-hidden bg-slate-950 border border-slate-700">
                  <img src={url} alt="" className="h-full w-full object-cover" />
                  {i === 0 && (
                    <span className="absolute top-1 left-1 rounded bg-yellow-400 px-1 py-0.5 text-[9px] font-black text-slate-950">
                      Capa
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(i)}
                    className="absolute top-1 right-1 grid h-6 w-6 place-items-center rounded-full bg-red-600 text-white opacity-0 group-hover:opacity-100 transition shadow-md"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Equipamentos e Opcionais */}
          <div className="space-y-3">
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
              Opcionais e Equipamentos de Série
            </label>

            <div className="flex flex-wrap gap-1.5">
              {commonOptions.map(opt => {
                const active = opcionais.includes(opt)
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => toggleOption(opt)}
                    className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold transition ${
                      active
                        ? 'bg-yellow-400 text-slate-950 shadow-xs'
                        : 'bg-slate-800 border border-slate-700 text-slate-400 hover:text-white'
                    }`}
                  >
                    {active ? <Check size={12} /> : <Plus size={12} />}
                    <span>{opt}</span>
                  </button>
                )
              })}
            </div>

            <div className="flex gap-2 pt-2">
              <input
                type="text"
                value={newOpcional}
                onChange={e => setNewOpcional(e.target.value)}
                placeholder="Adicionar opcional personalizado..."
                className="h-10 flex-1 rounded-xl border border-slate-700 bg-slate-800 px-3.5 text-xs text-white outline-none focus:border-yellow-400"
              />
              <button
                type="button"
                onClick={handleAddOpcional}
                className="rounded-xl bg-slate-800 border border-slate-700 px-4 text-xs font-bold text-white hover:bg-slate-700 transition"
              >
                Adicionar
              </button>
            </div>
          </div>

          {/* Descrição Completa */}
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
              Sobre este veículo (Descrição e Condições)
            </label>
            <textarea
              rows={4}
              value={descricao}
              onChange={e => setDescricao(e.target.value)}
              placeholder="Descreva detalhes como estado de conservação, laudo cautelar aprovado, planos de consórcio ou financiamento..."
              className="w-full rounded-xl border border-slate-700 bg-slate-800 p-3.5 text-xs text-white outline-none focus:border-yellow-400 leading-relaxed"
            />
          </div>

          {/* Botões do Rodapé do Modal */}
          <div className="flex items-center justify-end gap-3 border-t border-slate-800 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl bg-slate-800 px-5 py-3 text-xs font-bold text-slate-300 hover:bg-slate-700 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="rounded-xl bg-yellow-400 px-7 py-3 text-xs font-black text-slate-950 shadow-md hover:bg-yellow-500 transition"
            >
              {isEditing ? 'Salvar Alterações' : 'Cadastrar Veículo'}
            </button>
          </div>

        </form>
      </motion.div>
    </div>
  )
}

// -------------------------------------------------------------
// COMPONENTE MODAL DE CONFIGURAÇÃO SUPABASE CLOUD
// -------------------------------------------------------------
function SupabaseConfigModal({
  config,
  onClose,
  onSave,
  onSync,
  isSyncing,
}: {
  config: SupabaseConfig
  onClose: () => void
  onSave: (cfg: SupabaseConfig) => void
  onSync: () => void
  isSyncing: boolean
}) {
  const [url, setUrl] = useState(config.url || '')
  const [anonKey, setAnonKey] = useState(config.anonKey || '')
  const [tableName, setTableName] = useState(config.tableName || 'vehicles')

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8 shadow-2xl space-y-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-2xl bg-emerald-500/20 text-emerald-400">
              <Database size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Sincronização com Supabase</h3>
              <p className="text-xs text-slate-400">Conecte sua tabela PostgreSQL no Supabase na nuvem.</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X size={18} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
              Project URL do Supabase
            </label>
            <input
              type="text"
              value={url}
              onChange={e => setUrl(e.target.value)}
              placeholder="https://xyzcompany.supabase.co"
              className="h-11 w-full rounded-xl border border-slate-700 bg-slate-800 px-3.5 text-xs text-white outline-none focus:border-yellow-400"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
              Anon / Public API Key
            </label>
            <input
              type="password"
              value={anonKey}
              onChange={e => setAnonKey(e.target.value)}
              placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6..."
              className="h-11 w-full rounded-xl border border-slate-700 bg-slate-800 px-3.5 text-xs text-white outline-none focus:border-yellow-400"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
              Nome da Tabela
            </label>
            <input
              type="text"
              value={tableName}
              onChange={e => setTableName(e.target.value)}
              placeholder="vehicles"
              className="h-11 w-full rounded-xl border border-slate-700 bg-slate-800 px-3.5 text-xs text-white outline-none focus:border-yellow-400"
            />
          </div>
        </div>

        <div className="rounded-2xl bg-slate-800/60 p-4 text-xs text-slate-400 space-y-1">
          <p className="font-bold text-slate-200">💡 Como funciona na Vercel:</p>
          <p>
            Você pode adicionar estas credenciais nas <strong>Environment Variables da Vercel</strong> como <code className="text-yellow-400">VITE_SUPABASE_URL</code> e <code className="text-yellow-400">VITE_SUPABASE_ANON_KEY</code> para sincronização automática.
          </p>
        </div>

        <div className="flex gap-2 pt-2">
          <button
            onClick={() => onSave({ url, anonKey, tableName, enabled: true })}
            className="flex-1 rounded-xl bg-yellow-400 py-3 text-xs font-black text-slate-950 shadow-md hover:bg-yellow-500 transition"
          >
            Salvar & Conectar
          </button>
          <button
            onClick={onSync}
            disabled={isSyncing}
            className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-xs font-bold text-white hover:bg-slate-700 transition flex items-center gap-1.5"
          >
            <RefreshCw size={14} className={isSyncing ? 'animate-spin' : ''} />
            <span>{isSyncing ? 'Sincronizando...' : 'Sincronizar Agora'}</span>
          </button>
        </div>
      </div>
    </div>
  )
}
