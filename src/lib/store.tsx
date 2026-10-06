import React, { createContext, useContext, useEffect, useState } from 'react'
import { Vehicle, vehicles } from './data'

type StoreContextType = {
  favorites: string[]
  toggleFavorite: (id: string) => void
  isFavorite: (id: string) => boolean
  favVehicles: Vehicle[]
  compareList: string[]
  toggleCompare: (id: string) => void
  inCompare: (id: string) => boolean
  clearCompare: () => void
  compareVehicles: Vehicle[]
  searchOpen: boolean
  setSearchOpen: (open: boolean) => void
  favDrawerOpen: boolean
  setFavDrawerOpen: (open: boolean) => void
  testDriveModal: Vehicle | null
  setTestDriveModal: (v: Vehicle | null) => void
  consorcioModal: Vehicle | null
  setConsorcioModal: (v: Vehicle | null) => void
}

const StoreContext = createContext<StoreContextType | null>(null)

export function StoreProvider({ children }: { children: React.ReactNode }) {
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

  useEffect(() => {
    try {
      localStorage.setItem('baruch_favs', JSON.stringify(favorites))
    } catch {
      // ignore
    }
  }, [favorites])

  const toggleFavorite = (id: string) => {
    setFavorites(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  }

  const isFavorite = (id: string) => favorites.includes(id)

  const favVehicles = vehicles.filter(v => favorites.includes(v.id))

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

  return (
    <StoreContext.Provider
      value={{
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
