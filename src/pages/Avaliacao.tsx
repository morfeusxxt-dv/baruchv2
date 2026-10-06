import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Car, CheckCircle2, MessageCircle, ShieldCheck, Sparkles, UploadCloud } from 'lucide-react'
import { Button, Reveal, SectionHeading } from '../components/ui'
import { vehicles, waLink } from '../lib/data'

export default function Avaliacao() {
  const [tipo, setTipo] = useState<'carro' | 'moto'>('carro')
  const [marca, setMarca] = useState('')
  const [modelo, setModelo] = useState('')
  const [ano, setAno] = useState('')
  const [km, setKm] = useState('')
  const [cambio, setCambio] = useState('manual')
  const [combustivel, setCombustivel] = useState('flex')
  const [interesse, setInteresse] = useState('')
  const [nome, setNome] = useState('')
  const [telefone, setTelefone] = useState('')
  const [detalhes, setDetalhes] = useState('')
  const [sent, setSent] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const msg = `Olá! Gostaria de solicitar uma avaliação para venda/troca do meu veículo:\n\n• *Tipo:* ${tipo.toUpperCase()}\n• *Veículo:* ${marca} ${modelo}\n• *Ano:* ${ano}\n• *KM:* ${km || 'Não informado'}\n• *Câmbio/Combustível:* ${cambio} / ${combustivel}\n• *Interesse na troca:* ${interesse || 'Apenas vender'}\n• *Observações:* ${detalhes || 'Nenhuma'}\n• *Nome:* ${nome}\n• *Telefone:* ${telefone}\n\nPodem me enviar uma estimativa de avaliação?`
    
    window.open(waLink(msg), '_blank')
    setSent(true)
  }

  return (
    <div className="min-h-screen bg-slate-50/50 pb-32 pt-32 lg:pt-36">
      <div className="mx-auto max-w-[1480px] px-6 lg:px-12">
        <header className="max-w-3xl">
          <span className="eyebrow">Avaliação Justa</span>
          <h1 className="mt-3 text-[clamp(2.4rem,5vw,4.2rem)] font-extrabold tracking-tight text-slate-950 leading-[1.05]">
            Avalie ou Troque seu Veículo
          </h1>
          <p className="mt-3 text-base md:text-lg text-slate-600 font-normal">
            Receba uma proposta justa e transparente pelo seu carro ou moto seminovo. Pagamento rápido ou supervalorização na troca pelo seu próximo seminovo na Baruch.
          </p>
        </header>

        <div className="mt-12 grid gap-10 lg:grid-cols-[1.4fr_1fr]">
          {/* Formulário de Avaliação */}
          <div className="rounded-3xl border border-slate-200/80 bg-white p-8 sm:p-10 shadow-sm">
            {sent ? (
              <div className="py-12 text-center">
                <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-yellow-100 text-yellow-700 mb-4">
                  <CheckCircle2 size={32} />
                </div>
                <p className="font-display text-2xl font-bold text-slate-900">Solicitação Iniciada no WhatsApp!</p>
                <p className="mt-2 text-sm text-slate-600 max-w-md mx-auto">
                  Nossa equipe de avaliação entrará em contato em instantes com a análise técnica e proposta para o seu veículo.
                </p>
                <button
                  type="button"
                  onClick={() => setSent(false)}
                  className="mt-6 rounded-full bg-slate-900 px-6 py-2.5 text-xs font-semibold text-white"
                >
                  Avaliar outro veículo
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                    Tipo do seu Veículo
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setTipo('carro')}
                      className={`rounded-2xl py-3 text-xs font-bold transition-all shadow-sm ${
                        tipo === 'carro'
                          ? 'bg-yellow-400 text-slate-950 ring-2 ring-yellow-400/30'
                          : 'bg-slate-50 border border-slate-200 text-slate-700'
                      }`}
                    >
                      🚗 Carro / Utilitário
                    </button>
                    <button
                      type="button"
                      onClick={() => setTipo('moto')}
                      className={`rounded-2xl py-3 text-xs font-bold transition-all shadow-sm ${
                        tipo === 'moto'
                          ? 'bg-yellow-400 text-slate-950 ring-2 ring-yellow-400/30'
                          : 'bg-slate-50 border border-slate-200 text-slate-700'
                      }`}
                    >
                      🏍️ Motocicleta
                    </button>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Marca</label>
                    <input
                      required
                      value={marca}
                      onChange={e => setMarca(e.target.value)}
                      placeholder="Ex: Fiat, Toyota, Honda..."
                      className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none focus:border-yellow-500 focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Modelo e Versão</label>
                    <input
                      required
                      value={modelo}
                      onChange={e => setModelo(e.target.value)}
                      placeholder="Ex: Polo Track 1.0, Kicks..."
                      className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none focus:border-yellow-500 focus:bg-white"
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Ano Fabricação/Modelo</label>
                    <input
                      required
                      value={ano}
                      onChange={e => setAno(e.target.value)}
                      placeholder="Ex: 2022/2023"
                      className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none focus:border-yellow-500 focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Quilometragem (KM)</label>
                    <input
                      required
                      value={km}
                      onChange={e => setKm(e.target.value)}
                      placeholder="Ex: 45.000"
                      className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none focus:border-yellow-500 focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Câmbio</label>
                    <select
                      value={cambio}
                      onChange={e => setCambio(e.target.value)}
                      className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none focus:border-yellow-500 focus:bg-white"
                    >
                      <option value="manual">Manual</option>
                      <option value="automatico">Automático</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    Gostaria de dar de entrada na troca por algum veículo da Baruch?
                  </label>
                  <select
                    value={interesse}
                    onChange={e => setInteresse(e.target.value)}
                    className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none focus:border-yellow-500 focus:bg-white"
                  >
                    <option value="">Apenas desejo vender meu veículo</option>
                    {vehicles.map(v => (
                      <option key={v.id} value={`${v.marca} ${v.modelo} ${v.versao}`}>
                        Trocar por: {v.marca} {v.modelo} {v.versao}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 pt-2 border-t border-slate-100">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Seu Nome</label>
                    <input
                      required
                      value={nome}
                      onChange={e => setNome(e.target.value)}
                      placeholder="Nome completo"
                      className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none focus:border-yellow-500 focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Seu WhatsApp</label>
                    <input
                      required
                      type="tel"
                      value={telefone}
                      onChange={e => setTelefone(e.target.value)}
                      placeholder="(98) 99999-9999"
                      className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none focus:border-yellow-500 focus:bg-white"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="h-14 w-full rounded-full bg-yellow-400 font-extrabold text-slate-950 shadow-md hover:bg-yellow-500 transition-all flex items-center justify-center gap-2"
                >
                  <MessageCircle size={18} />
                  Solicitar Avaliação Gratuita no WhatsApp
                </button>
              </form>
            )}
          </div>

          {/* Dicas e Processo de Avaliação */}
          <div className="space-y-6">
            <div className="rounded-3xl border border-slate-200/80 bg-white p-8 shadow-sm space-y-4">
              <span className="eyebrow">Como Funciona</span>
              <h3 className="text-xl font-bold text-slate-900">Passo a passo simples:</h3>
              <ol className="space-y-3 text-xs sm:text-sm text-slate-600 font-medium">
                <li className="flex items-start gap-3">
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-yellow-400 font-bold text-slate-950 text-xs">1</span>
                  <span>Preencha os dados do seu veículo no formulário acima.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-yellow-400 font-bold text-slate-950 text-xs">2</span>
                  <span>Nossa equipe avalia a tabela FIPE, estado e laudo cautelar.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-yellow-400 font-bold text-slate-950 text-xs">3</span>
                  <span>Receba a proposta para pagamento à vista ou abatimento na troca.</span>
                </li>
              </ol>
            </div>

            <div className="rounded-3xl border-2 border-yellow-300 bg-yellow-50/70 p-6 shadow-sm flex items-center gap-4">
              <ShieldCheck size={32} className="text-yellow-700 shrink-0" />
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Garantia de Negociação Segura</h4>
                <p className="text-xs text-slate-600 mt-0.5">Mais de 10 anos de transparência e seriedade no Maranhão.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
