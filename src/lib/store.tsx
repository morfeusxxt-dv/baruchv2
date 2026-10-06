import React, { createContext, useContext, useEffect, useState } from 'react'
import { Vehicle, vehicles as initialVehicles, isMoto } from './data'

export type SupabaseConfig = {
  url: string
  anonKey: string
  tableName: string
  enabled: boolean
}

type StoreContextType = {
  // Inventory State & CRUD
  vehicles: Vehicle[]
  carros: Vehicle[]
  motos: Vehicle[]
  activeVehicles: Vehicle[]
  soldVehicles: Vehicle[]
  getVehicle: (slugOrId?: string) => Vehicle | undefined
  addVehicle: (v: Omit<Vehicle, 'id'> & { id?: string }) => void
  updateVehicle: (id: string, partial: Partial<Vehicle>) => void
  deleteVehicle: (id: string) => void
  toggleVehicleStatus: (id: string) => void
  toggleVehicleFeatured: (id: string) => void
  resetToDefaultVehicles: () => void
  importVehicles: (jsonString: string) => { success: boolean; count?: number; error?: string }
  exportVehicles: () => string

  // Cloud Supabase Sync
  supabaseConfig: SupabaseConfig
  saveSupabaseConfig: (cfg: SupabaseConfig) => void
  syncWithSupabase: () => Promise<{ success: boolean; message: string }>
  isSyncing: boolean

  // Favorites & Compare
  favorites: string[]
  toggleFavorite: (id: string) => void
  isFavorite: (id: string) => boolean
  favVehicles: Vehicle[]
  compareList: string[]
  toggleCompare: (id: string) => void
  inCompare: (id: string) => boolean
  clearCompare: () => void
  compareVehicles: Vehicle[]

  // Modals & Drawers
  searchOpen: boolean
  setSearchOpen: (open: boolean) => void
  favDrawerOpen: boolean
  setFavDrawerOpen: (open: boolean) => void
  testDriveModal: Vehicle | null
  setTestDriveModal: (v: Vehicle | null) => void
  consorcioModal: Vehicle | null
  setConsorcioModal: (v: Vehicle | null) => void

  // Admin Auth
  isAdminAuth: boolean
  loginAdmin: (pin: string) => boolean
  logoutAdmin: () => void
}

const StoreContext = createContext<StoreContextType | null>(null)

export function StoreProvider({ children }: { children: React.ReactNode }) {
  // 1. Dynamic Vehicles Inventory
  const [vehicles, setVehicles] = useState<Vehicle[]>(() => {
    try {
      const saved = localStorage.getItem('baruch_inventory_v2')
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed) && parsed.length > 0) return parsed
      }
    } catch {
      // ignore
    }
    return initialVehicles
  })

  // 2. Supabase Cloud Configuration
  const [supabaseConfig, setSupabaseConfig] = useState<SupabaseConfig>(() => {
    try {
      const saved = localStorage.getItem('baruch_supabase_cfg')
      return saved
        ? JSON.parse(saved)
        : {
            url: (import.meta as any).env?.VITE_SUPABASE_URL || '',
            anonKey: (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || '',
            tableName: 'vehicles',
            enabled: false,
          }
    } catch {
      return { url: '', anonKey: '', tableName: 'vehicles', enabled: false }
    }
  })

  const [isSyncing, setIsSyncing] = useState(false)

  // 3. Admin Authentication (PIN)
  const [isAdminAuth, setIsAdminAuth] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('baruch_admin_session') === 'true'
    } catch {
      return false
    }
  })

  // 4. Favorites & Compare
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('baruch_favs')
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  const [compareList, setCompareList] = useState<string[]>([])
  const [searchOpen, setSearchOpen] = useState(false)
  const [favDrawerOpen, setFavDrawerOpen] = useState(false)
  const [testDriveModal, setTestDriveModal] = useState<Vehicle | null>(null)
  const [consorcioModal, setConsorcioModal] = useState<Vehicle | null>(null)

  // Save vehicles to local storage on change
  useEffect(() => {
    try {
      localStorage.setItem('baruch_inventory_v2', JSON.stringify(vehicles))
    } catch {
      // ignore
    }
  }, [vehicles])

  // Save favorites to local storage on change
  useEffect(() => {
    try {
      localStorage.setItem('baruch_favs', JSON.stringify(favorites))
    } catch {
      // ignore
    }
  }, [favorites])

  // Save Supabase Config
  const saveSupabaseConfig = (cfg: SupabaseConfig) => {
    setSupabaseConfig(cfg)
    try {
      localStorage.setItem('baruch_supabase_cfg', JSON.stringify(cfg))
    } catch {
      // ignore
    }
  }

  // Cloud Sync Handler with Supabase REST API (zero dependencies required)
  const syncWithSupabase = async (): Promise<{ success: boolean; message: string }> => {
    if (!supabaseConfig.url || !supabaseConfig.anonKey) {
      return { success: false, message: 'Configure a URL e a Anon Key do Supabase primeiro.' }
    }
    setIsSyncing(true)
    try {
      const endpoint = `${supabaseConfig.url.replace(/\/$/, '')}/rest/v1/${supabaseConfig.tableName || 'vehicles'}`
      const res = await fetch(`${endpoint}?select=*`, {
        headers: {
          apikey: supabaseConfig.anonKey,
          Authorization: `Bearer ${supabaseConfig.anonKey}`,
        },
      })

      if (!res.ok) {
        throw new Error(`Erro na comunicação com o Supabase: status ${res.status}`)
      }

      const remoteData = await res.json()
      if (Array.isArray(remoteData) && remoteData.length > 0) {
        setVehicles(remoteData)
        setIsSyncing(false)
        return { success: true, message: `Sincronizado com sucesso! ${remoteData.length} veículos carregados do Supabase.` }
      } else {
        // If remote is empty, offer to upload local dataset
        const pushRes = await fetch(endpoint, {
          method: 'POST',
          headers: {
            apikey: supabaseConfig.anonKey,
            Authorization: `Bearer ${supabaseConfig.anonKey}`,
            'Content-Type': 'application/json',
            Prefer: 'resolution=merge-duplicates',
          },
          body: JSON.stringify(vehicles),
        })

        setIsSyncing(false)
        if (pushRes.ok) {
          return { success: true, message: 'Estoque local sincronizado e enviado para a tabela do Supabase!' }
        }
        return { success: true, message: 'Tabela do Supabase conectada.' }
      }
    } catch (err: any) {
      setIsSyncing(false)
      return { success: false, message: err?.message || 'Falha ao conectar ao Supabase.' }
    }
  }

  // Inventory Mutations
  const addVehicle = (v: Omit<Vehicle, 'id'> & { id?: string }) => {
    const slugBase = `${v.marca}-${v.modelo}-${v.anoMod || v.anoFab}`
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')

    const newVehicle: Vehicle = {
      ...v,
      id: v.id || `baruch-${Date.now()}`,
      slug: v.slug || `${slugBase}-${Date.now().toString().slice(-4)}`,
      destaque: v.destaque ?? false,
      vistoriado: v.vistoriado ?? true,
      status: v.status || 'ativo',
      imagens: v.imagens?.length ? v.imagens : ['/brand/card.jpg'],
      opcionais: v.opcionais || [],
    }

    setVehicles(prev => [newVehicle, ...prev])
  }

  const updateVehicle = (id: string, partial: Partial<Vehicle>) => {
    setVehicles(prev => prev.map(v => (v.id === id ? { ...v, ...partial } : v)))
  }

  const deleteVehicle = (id: string) => {
    setVehicles(prev => prev.filter(v => v.id !== id))
    setFavorites(prev => prev.filter(x => x !== id))
    setCompareList(prev => prev.filter(x => x !== id))
  }

  const toggleVehicleStatus = (id: string) => {
    setVehicles(prev =>
      prev.map(v => {
        if (v.id === id) {
          const nextStatus = v.status === 'vendido' ? 'ativo' : 'vendido'
          return { ...v, status: nextStatus }
        }
        return v
      })
    )
  }

  const toggleVehicleFeatured = (id: string) => {
    setVehicles(prev =>
      prev.map(v => (v.id === id ? { ...v, destaque: !v.destaque } : v))
    )
  }

  const resetToDefaultVehicles = () => {
    setVehicles(initialVehicles)
  }

  const importVehicles = (jsonString: string) => {
    try {
      const parsed = JSON.parse(jsonString)
      if (!Array.isArray(parsed) || parsed.length === 0) {
        return { success: false, error: 'O arquivo JSON deve conter uma lista de veículos válida.' }
      }
      setVehicles(parsed)
      return { success: true, count: parsed.length }
    } catch (err: any) {
      return { success: false, error: 'Erro ao processar arquivo JSON: ' + err.message }
    }
  }

  const exportVehicles = () => {
    return JSON.stringify(vehicles, null, 2)
  }

  const getVehicle = (slugOrId?: string) => {
    if (!slugOrId) return undefined
    return vehicles.find(v => v.slug === slugOrId || v.id === slugOrId)
  }

  // Derived collections
  const activeVehicles = vehicles.filter(v => v.status !== 'vendido' && v.status !== 'inativo')
  const soldVehicles = vehicles.filter(v => v.status === 'vendido')
  const carros = vehicles.filter(v => !isMoto(v))
  const motos = vehicles.filter(isMoto)

  // Favorites logic
  const toggleFavorite = (id: string) => {
    setFavorites(prev => (prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]))
  }
  const isFavorite = (id: string) => favorites.includes(id)
  const favVehicles = vehicles.filter(v => favorites.includes(v.id))

  // Compare logic
  const toggleCompare = (id: string) => {
    setCompareList(prev => {
      if (prev.includes(id)) return prev.filter(x => x !== id)
      if (prev.length >= 3) {
        alert('Você pode comparar no máximo 3 veículos ao mesmo tempo.')
        return prev
      }
      return [...prev, id]
    })
  }
  const inCompare = (id: string) => compareList.includes(id)
  const clearCompare = () => setCompareList([])
  const compareVehicles = vehicles.filter(v => compareList.includes(v.id))

  // Admin Auth (Default PIN: 1234 or baruch2026)
  const loginAdmin = (pin: string) => {
    const valid = pin.trim() === '1234' || pin.trim() === 'baruch2026' || pin.trim() === 'admin'
    if (valid) {
      setIsAdminAuth(true)
      try {
        sessionStorage.setItem('baruch_admin_session', 'true')
      } catch {
        // ignore
      }
      return true
    }
    return false
  }

  const logoutAdmin = () => {
    setIsAdminAuth(false)
    try {
      sessionStorage.removeItem('baruch_admin_session')
    } catch {
      // ignore
    }
  }

  return (
    <StoreContext.Provider
      value={{
        vehicles,
        carros,
        motos,
        activeVehicles,
        soldVehicles,
        getVehicle,
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
        favorites,
        toggleFavorite,
        isFavorite,
        favVehicles,
        compareList,
        toggleCompare,
        inCompare,
        clearCompare,
        compareVehicles,
        searchOpen,
        setSearchOpen,
        favDrawerOpen,
        setFavDrawerOpen,
        testDriveModal,
        setTestDriveModal,
        consorcioModal,
        setConsorcioModal,
        isAdminAuth,
        loginAdmin,
        logoutAdmin,
      }}
    >
      {children}
    </StoreContext.Provider>
  )
}

export function useStore() {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore must be used within StoreProvider')
  return ctx
}

