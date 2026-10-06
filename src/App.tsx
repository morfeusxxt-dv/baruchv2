import { useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Footer, Header } from './components/Layout'
import { WhatsAppFloat } from './components/ui'
import { StoreProvider } from './lib/store'
import { ConsorcioModal } from './components/ConsorcioModal'
import { TestDriveModal } from './components/TestDriveModal'
import { FavoritesDrawer } from './components/FavoritesDrawer'
import { CompareModal } from './components/CompareModal'
import { SearchModal } from './components/SearchModal'
import Home from './pages/Home'
import Estoque from './pages/Estoque'
import Motos from './pages/Motos'
import Financiamento from './pages/Financiamento'
import Avaliacao from './pages/Avaliacao'
import Veiculo from './pages/Veiculo'
import ConsorcioImoveis from './pages/ConsorcioImoveis'
import ConsorcioNautica from './pages/ConsorcioNautica'
import ConsorcioPesados from './pages/ConsorcioPesados'
import Admin from './pages/Admin'
import { Marcas, QuemSomos, Consorcio, Contato } from './pages/Institucional'

export default function App() {
  const location = useLocation()
  const isAdmin = location.pathname.startsWith('/admin')

  useEffect(() => { window.scrollTo({ top: 0 }) }, [location.pathname])

  return (
    <StoreProvider>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-full focus:bg-yellow-400 focus:px-4 focus:py-2 focus:text-black">
        Pular para o conteúdo
      </a>
      
      {!isAdmin && <Header />}

      <AnimatePresence mode="wait">
        <motion.main
          id="main"
          key={location.pathname}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        >
          <Routes location={location}>
            <Route path="/" element={<Home />} />
            <Route path="/estoque" element={<Estoque />} />
            <Route path="/motos" element={<Motos />} />
            <Route path="/financiamento" element={<Financiamento />} />
            <Route path="/avaliacao" element={<Avaliacao />} />
            <Route path="/veiculo/:slug" element={<Veiculo />} />
            
            {/* Painel Administrativo / CMS */}
            <Route path="/admin" element={<Admin />} />
            <Route path="/painel" element={<Admin />} />
            
            {/* Páginas Dedicadas de Consórcio e Categorias */}
            <Route path="/consorcio" element={<Consorcio />} />
            <Route path="/consorcio/imoveis" element={<ConsorcioImoveis />} />
            <Route path="/imoveis" element={<ConsorcioImoveis />} />
            <Route path="/consorcio/nautica" element={<ConsorcioNautica />} />
            <Route path="/nautica" element={<ConsorcioNautica />} />
            <Route path="/consorcio/pesados" element={<ConsorcioPesados />} />
            <Route path="/caminhoes" element={<ConsorcioPesados />} />
            <Route path="/pesados" element={<ConsorcioPesados />} />
            
            <Route path="/marcas" element={<Marcas />} />
            <Route path="/quem-somos" element={<QuemSomos />} />
            <Route path="/contato" element={<Contato />} />
            <Route path="*" element={<Home />} />
          </Routes>
        </motion.main>
      </AnimatePresence>

      {!isAdmin && <Footer />}
      {!isAdmin && <WhatsAppFloat />}

      {/* Modais e Drawers Globais */}
      <ConsorcioModal />
      <TestDriveModal />
      <FavoritesDrawer />
      <CompareModal />
      <SearchModal />
    </StoreProvider>
  )
}

