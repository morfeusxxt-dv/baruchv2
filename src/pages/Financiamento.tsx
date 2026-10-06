import { useState, useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Calculator, CheckCircle2, MessageCircle, ShieldCheck, Sparkles } from 'lucide-react'
import { Button, Reveal, SectionHeading } from '../components/ui'
import { vehicles, brl, waLink, title, years } from '../lib/data'

export default function Financiamento() {
  const [sp] = useSearchParams()
  const initialSlug = sp.get('veiculo') || ''
  
  const [selectedSlug, setSelectedSlug] = useState(initialSlug)
  const [customPrice, setCustomPrice] = useState('80000')
  const [downPaymentPercent, setDownPaymentPercent] = useState(30)
  const [installments, setInstallments] = useState(48)
  const [name, setName] = useState('')
  const [cpf, setCpf] = useState('')
  const [phone, setPhone] = useState('')

  const currentVehicle = vehicles.find(v => v.slug === selectedSlug)
  const priceValue = currentVehicle ? currentVehicle.preco : (parseFloat(customPrice) || 0)

  const calculation = useMemo(() => {
    const downPayment = (priceValue * downPaymentPercent) / 100
    const financed = priceValue - downPayment
    
    // Estimativa de taxa média de financiamento de mercado (1.49% a.m.)
    const monthlyRate = 0.0149
    const factor = (monthlyRate * Math.pow(1 + monthlyRate, installments)) / (Math.pow(1 + monthlyRate, installments) - 1)
    const monthlyPayment = financed > 0 ? financed * factor : 0

    return {
      downPayment,
      financed,
      monthlyPayment,
    }
  }, [priceValue, downPaymentPercent, installments])

  const handleWhatsAppSimulation = (e: React.FormEvent) => {
    e.preventDefault()
    const vehicleText = currentVehicle
      ? `${title(currentVehicle)} ${currentVehicle.versao} ${years(currentVehicle)} (${brl(currentVehicle.preco)})`
      : `Veículo no valor de ${brl(priceValue)}`
    
    const msg = `Olá! Gostaria de consultar uma aprovação de financiamento:\n\n• *Veículo:* ${vehicleText}\n• *Entrada:* ${brl(calculation.downPayment)} (${downPaymentPercent}%)\n• *Prazo:* ${installments}x de aprox. ${brl(calculation.monthlyPayment)}\n• *Nome:* ${name || 'Não informado'}\n• *Telefone:* ${phone || 'Não informado'}\n\nPodem avaliar minha simulação com os bancos parceiros?`
    
    window.open(waLink(msg), '_blank')
  }

  return (
    <div className="min-h-screen bg-slate-50/50 pb-32 pt-32 lg:pt-36">
      <div className="mx-auto max-w-[1480px] px-6 lg:px-12">
        <header className="max-w-3xl">
          <span className="eyebrow">Aprovação Rápida</span>
          <h1 className="mt-3 text-[clamp(2.4rem,5vw,4.2rem)] font-extrabold tracking-tight text-slate-950 leading-[1.05]">
            Simulador de Financiamento
          </h1>
          <p className="mt-3 text-base md:text-lg text-slate-600 font-normal">
            Calcule sua entrada e parcelas estimadas com as melhores taxas dos principais bancos parceiros da Baruch Veículos em São Luís.
          </p>
        </header>

        <div className="mt-12 grid gap-10 lg:grid-cols-[1.3fr_1fr]">
          {/* Formulário Interativo de Simulação */}
          <div className="rounded-3xl border border-slate-200/80 bg-white p-8 sm:p-10 shadow-sm space-y-6">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Calculator size={20} className="text-yellow-600" />
              Parâmetros da Simulação
            </h2>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Escolha o Veículo do Estoque ou Digite o Valor
              </label>
              <select
                value={selectedSlug}
                onChange={e => setSelectedSlug(e.target.value)}
                className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-800 outline-none shadow-sm focus:border-yellow-500 focus:ring-2 focus:ring-yellow-100"
              >
                <option value="">Personalizar valor do veículo...</option>
                {vehicles.map(v => (
                  <option key={v.id} value={v.slug}>
                    {v.marca} {v.modelo} {v.versao} ({years(v)}) — {brl(v.preco)}
                  </option>
                ))}
              </select>
            </div>

            {!selectedSlug && (
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Valor Estimado do Carro ou Moto (R$)
                </label>
                <input
                  type="number"
                  value={customPrice}
                  onChange={e => setCustomPrice(e.target.value)}
                  className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-900 outline-none shadow-sm focus:border-yellow-500 focus:ring-2 focus:ring-yellow-100"
                  placeholder="Ex: 85000"
                />
              </div>
            )}

            {/* Slider de Entrada */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Valor da Entrada: <strong className="text-slate-900 text-sm">{downPaymentPercent}% ({brl(calculation.downPayment)})</strong>
                </label>
              </div>
              <input
                type="range"
                min="10"
                max="80"
                step="5"
                value={downPaymentPercent}
                onChange={e => setDownPaymentPercent(Number(e.target.value))}
                className="w-full accent-yellow-500 h-2 bg-slate-200 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[0.68rem] text-slate-400 font-semibold">
                <span>10% (mínimo)</span>
                <span>30% (recomendado)</span>
                <span>50%</span>
                <span>80%</span>
              </div>
            </div>

            {/* Prazo de Parcelas */}
            <div className="pt-2 border-t border-slate-100">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                Quantidade de Parcelas
              </label>
              <div className="grid grid-cols-5 gap-2">
                {[12, 24, 36, 48, 60].map(months => (
                  <button
                    key={months}
                    type="button"
                    onClick={() => setInstallments(months)}
                    className={`rounded-2xl py-3 text-xs font-bold transition-all shadow-sm ${
                      installments === months
                        ? 'bg-yellow-400 text-slate-950 ring-2 ring-yellow-400/30 font-extrabold'
                        : 'bg-slate-50 border border-slate-200 text-slate-700 hover:border-yellow-400'
                    }`}
                  >
                    {months}x
                  </button>
                ))}
              </div>
            </div>

            {/* Dados para envio direto */}
            <form onSubmit={handleWhatsAppSimulation} className="pt-4 border-t border-slate-100 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Seus dados para aprovação bancária
              </h3>
              <div className="grid gap-3 sm:grid-cols-2">
                <input
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Seu nome completo"
                  className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-xs font-medium text-slate-900 outline-none focus:border-yellow-500 focus:bg-white"
                />
                <input
                  required
                  type="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="WhatsApp com DDD (98)"
                  className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-xs font-medium text-slate-900 outline-none focus:border-yellow-500 focus:bg-white"
                />
              </div>

              <button
                type="submit"
                className="mt-2 h-14 w-full rounded-full bg-yellow-400 font-extrabold text-slate-950 shadow-md hover:bg-yellow-500 transition-all flex items-center justify-center gap-2"
              >
                <MessageCircle size={18} />
                Enviar Simulação para Aprovação no WhatsApp
              </button>
            </form>
          </div>

          {/* Resumo do Cálculo da Simulação */}
          <div className="space-y-6">
            <div className="rounded-3xl border-2 border-yellow-300 bg-gradient-to-br from-yellow-50 via-white to-yellow-100/50 p-8 shadow-md">
              <span className="eyebrow">Estimativa de Parcela</span>
              <p className="mt-2 font-display text-4xl sm:text-5xl font-extrabold text-slate-950">
                {installments}x de {brl(calculation.monthlyPayment)}
              </p>
              <p className="text-xs font-medium text-slate-500 mt-1">
                Com entrada de <strong>{brl(calculation.downPayment)}</strong>
              </p>

              <dl className="mt-6 divide-y divide-yellow-200/60 border-y border-yellow-200/60 text-xs py-2">
                <div className="flex justify-between py-2">
                  <dt className="text-slate-600 font-medium">Valor Total do Veículo</dt>
                  <dd className="font-bold text-slate-900">{brl(priceValue)}</dd>
                </div>
                <div className="flex justify-between py-2">
                  <dt className="text-slate-600 font-medium">Valor Financiado</dt>
                  <dd className="font-bold text-slate-900">{brl(calculation.financed)}</dd>
                </div>
                <div className="flex justify-between py-2">
                  <dt className="text-slate-600 font-medium">Prazo Escolhido</dt>
                  <dd className="font-bold text-slate-900">{installments} meses</dd>
                </div>
              </dl>

              <div className="mt-6 flex items-center gap-2 text-xs font-semibold text-slate-700">
                <ShieldCheck size={16} className="text-yellow-600 shrink-0" />
                <span>Trabalhamos com Santander, BV, Itaú, Bradesco, Pan e Safra.</span>
              </div>
            </div>

            {/* Dúvidas e Garantias */}
            <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm space-y-3 text-xs text-slate-600">
              <h3 className="font-bold text-slate-900 text-sm">Vantagens do Financiamento Baruch:</h3>
              <ul className="space-y-2">
                <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-yellow-600" /> Aprovação sem burocracia mesmo sem CNH</li>
                <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-yellow-600" /> Possibilidade de entrada parcelada no cartão em até 18x</li>
                <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-yellow-600" /> Aceitamos seu veículo usado na troca com supervalorização</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
