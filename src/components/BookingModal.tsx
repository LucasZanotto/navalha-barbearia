import { useEffect, useMemo, useRef, useState } from 'react'
import { ArrowLeft, Check, Clock, MessageCircle, X } from 'lucide-react'
import { BARBERS, SERVICES, brl } from '../data'
import {
  addBooking,
  formatDateLong,
  getSlots,
  isBarberWorking,
  nextDays,
  toISODate,
  whatsappLink,
  whatsappMessage,
  type Booking,
} from '../lib/schedule'

export type BookingPreset = { serviceId?: string; barberId?: string }

const STEPS = ['Serviço', 'Barbeiro', 'Horário', 'Seus dados'] as const

const maskPhone = (v: string) => {
  const d = v.replace(/\D/g, '').slice(0, 11)
  if (d.length <= 2) return d.length ? `(${d}` : ''
  if (d.length <= 7) return `(${d.slice(0, 2)}) ${d.slice(2)}`
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`
}

export function BookingModal({ preset, onClose, onBooked }: { preset: BookingPreset; onClose: () => void; onBooked: () => void }) {
  const [serviceId, setServiceId] = useState(preset.serviceId)
  const [barberId, setBarberId] = useState(preset.barberId)
  const [date, setDate] = useState<string>()
  const [time, setTime] = useState<string>()
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [step, setStep] = useState(() => (!preset.serviceId ? 0 : !preset.barberId ? 1 : 2))
  const [done, setDone] = useState<Booking | null>(null)
  const dialogRef = useRef<HTMLDivElement>(null)

  const service = SERVICES.find((s) => s.id === serviceId)
  const days = useMemo(() => nextDays(14), [])

  // escolhe automaticamente o primeiro dia em que o barbeiro atende
  useEffect(() => {
    if (step === 2 && barberId && (!date || !isBarberWorking(barberId, date))) {
      const first = days.map(toISODate).find((d) => isBarberWorking(barberId, d) && getSlots(barberId, d, service?.minutes ?? 30).some((s) => s.available))
      if (first && first !== date) {
        setDate(first)
        setTime(undefined)
      }
    }
  }, [step, barberId, date, days, service])

  const slots = useMemo(
    () => (barberId && date && service ? getSlots(barberId, date, service.minutes) : []),
    [barberId, date, service],
  )

  // fecha com ESC e trava o scroll da página
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    dialogRef.current?.focus()
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [onClose])

  const phoneOk = phone.replace(/\D/g, '').length >= 10
  const canSubmit = name.trim().length >= 2 && phoneOk

  const confirm = () => {
    if (!serviceId || !barberId || !date || !time || !canSubmit) return
    const b = addBooking({ serviceId, barberId, date, time, name: name.trim(), phone })
    setDone(b)
    onBooked()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 backdrop-blur-sm sm:items-center sm:p-6" onClick={onClose}>
      <div
        ref={dialogRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label="Agendar horário"
        onClick={(e) => e.stopPropagation()}
        className="flex max-h-[92svh] w-full max-w-lg animate-fade-up flex-col overflow-hidden rounded-t-3xl border border-line bg-coal outline-none sm:rounded-3xl"
      >
        {/* topo */}
        <div className="flex items-center gap-3 border-b border-line px-5 py-4">
          {!done && step > 0 ? (
            <button onClick={() => setStep(step - 1)} className="grid h-9 w-9 place-items-center rounded-full hover:bg-char" aria-label="Voltar">
              <ArrowLeft size={18} />
            </button>
          ) : (
            <span className="w-9" />
          )}
          <div className="flex-1 text-center">
            <p className="font-display text-xl">{done ? 'Agendado!' : STEPS[step]}</p>
            {!done && <p className="text-xs text-sand">Passo {step + 1} de {STEPS.length}</p>}
          </div>
          <button onClick={onClose} className="grid h-9 w-9 place-items-center rounded-full hover:bg-char" aria-label="Fechar">
            <X size={18} />
          </button>
        </div>
        {!done && (
          <div className="h-1 bg-char">
            <div className="h-full bg-brass transition-all duration-300" style={{ width: `${((step + 1) / STEPS.length) * 100}%` }} />
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-5">
          {done ? (
            <Success booking={done} onClose={onClose} />
          ) : step === 0 ? (
            <div className="grid gap-2.5">
              {SERVICES.map((s) => (
                <Option
                  key={s.id}
                  selected={serviceId === s.id}
                  onClick={() => {
                    setServiceId(s.id)
                    setTime(undefined)
                    setStep(barberId ? 2 : 1)
                  }}
                >
                  <div className="flex-1">
                    <p className="font-semibold">{s.name}</p>
                    <p className="flex items-center gap-1 text-xs text-sand">
                      <Clock size={12} /> {s.minutes} min
                    </p>
                  </div>
                  <span className="font-semibold text-brass-light">{brl(s.price)}</span>
                </Option>
              ))}
            </div>
          ) : step === 1 ? (
            <div className="grid gap-2.5">
              {BARBERS.map((b) => (
                <Option
                  key={b.id}
                  selected={barberId === b.id}
                  onClick={() => {
                    setBarberId(b.id)
                    setTime(undefined)
                    setStep(2)
                  }}
                >
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-gradient-to-br from-brass to-[#7a5a2e] font-display text-lg text-ink">
                    {b.initials}
                  </span>
                  <div className="flex-1">
                    <p className="font-semibold">{b.name}</p>
                    <p className="text-xs text-sand">{b.specialty}</p>
                  </div>
                </Option>
              ))}
            </div>
          ) : step === 2 ? (
            <div>
              <div className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-2 [scrollbar-width:none]">
                {days.map((d) => {
                  const iso = toISODate(d)
                  const works = barberId ? isBarberWorking(barberId, iso) : false
                  const selected = iso === date
                  return (
                    <button
                      key={iso}
                      disabled={!works}
                      onClick={() => {
                        setDate(iso)
                        setTime(undefined)
                      }}
                      className={`flex w-16 shrink-0 flex-col items-center rounded-2xl border py-3 transition ${
                        selected
                          ? 'border-brass bg-brass text-ink'
                          : works
                            ? 'border-line bg-char hover:border-brass/50'
                            : 'cursor-not-allowed border-line/50 text-sand/30'
                      }`}
                    >
                      <span className="text-[11px] font-medium uppercase">{d.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', '')}</span>
                      <span className="text-xl font-semibold">{d.getDate()}</span>
                      <span className="text-[11px]">{d.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '')}</span>
                    </button>
                  )
                })}
              </div>

              {date && <p className="mb-3 mt-5 text-sm text-sand">{formatDateLong(date)}</p>}
              {slots.length === 0 || !slots.some((s) => s.available) ? (
                <p className="rounded-xl border border-dashed border-line p-6 text-center text-sm text-sand">
                  Sem horários livres neste dia. Escolha outra data.
                </p>
              ) : (
                <div className="grid grid-cols-4 gap-2">
                  {slots.map((s) => (
                    <button
                      key={s.time}
                      disabled={!s.available}
                      onClick={() => setTime(s.time)}
                      className={`rounded-xl border py-2.5 text-sm font-medium transition ${
                        time === s.time
                          ? 'border-brass bg-brass text-ink'
                          : s.available
                            ? 'border-line bg-char hover:border-brass/50'
                            : 'cursor-not-allowed border-transparent text-sand/30 line-through'
                      }`}
                    >
                      {s.time}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <form
              id="booking-form"
              className="grid gap-4"
              onSubmit={(e) => {
                e.preventDefault()
                confirm()
              }}
            >
              <Summary serviceId={serviceId!} barberId={barberId!} date={date!} time={time!} />
              <label className="grid gap-1.5 text-sm font-medium">
                Seu nome
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoComplete="name"
                  required
                  className="rounded-xl border border-line bg-char px-4 py-3 text-base outline-none transition focus:border-brass"
                  placeholder="Como podemos te chamar?"
                />
              </label>
              <label className="grid gap-1.5 text-sm font-medium">
                WhatsApp
                <input
                  value={phone}
                  onChange={(e) => setPhone(maskPhone(e.target.value))}
                  inputMode="tel"
                  autoComplete="tel"
                  required
                  className="rounded-xl border border-line bg-char px-4 py-3 text-base outline-none transition focus:border-brass"
                  placeholder="(49) 99999-9999"
                />
              </label>
            </form>
          )}
        </div>

        {/* rodapé com ação */}
        {!done && (step === 2 || step === 3) && (
          <div className="flex items-center justify-between gap-4 border-t border-line px-5 py-4">
            <div className="text-sm">
              <p className="font-semibold">{service?.name}</p>
              <p className="text-sand">
                {service && brl(service.price)} {time && `· ${time}`}
              </p>
            </div>
            {step === 2 ? (
              <button
                disabled={!time}
                onClick={() => setStep(3)}
                className="rounded-full bg-brass px-6 py-3 font-semibold text-ink transition enabled:hover:bg-brass-light disabled:opacity-40"
              >
                Continuar
              </button>
            ) : (
              <button
                type="submit"
                form="booking-form"
                disabled={!canSubmit}
                className="rounded-full bg-brass px-6 py-3 font-semibold text-ink transition enabled:hover:bg-brass-light disabled:opacity-40"
              >
                Confirmar
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function Option({ selected, onClick, children }: { selected: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition ${
        selected ? 'border-brass bg-brass/10' : 'border-line bg-char hover:border-brass/50'
      }`}
    >
      {children}
      {selected && <Check size={18} className="shrink-0 text-brass" />}
    </button>
  )
}

function Summary({ serviceId, barberId, date, time }: Pick<Booking, 'serviceId' | 'barberId' | 'date' | 'time'>) {
  const s = SERVICES.find((x) => x.id === serviceId)!
  const b = BARBERS.find((x) => x.id === barberId)!
  return (
    <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 rounded-2xl border border-line bg-char p-4 text-sm">
      <dt className="text-sand">Serviço</dt>
      <dd className="text-right font-medium">{s.name}</dd>
      <dt className="text-sand">Barbeiro</dt>
      <dd className="text-right font-medium">{b.name}</dd>
      <dt className="text-sand">Quando</dt>
      <dd className="text-right font-medium">
        {formatDateLong(date)} · {time}
      </dd>
      <dt className="text-sand">Valor</dt>
      <dd className="text-right font-semibold text-brass-light">{brl(s.price)}</dd>
    </dl>
  )
}

function Success({ booking, onClose }: { booking: Booking; onClose: () => void }) {
  return (
    <div className="text-center">
      <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-brass/15 text-brass">
        <Check size={32} />
      </div>
      <h3 className="mt-4 font-display text-3xl">Tudo certo, {booking.name.split(' ')[0]}!</h3>
      <p className="mx-auto mt-2 max-w-xs text-sm text-sand">
        Seu horário foi reservado. Envie a confirmação pelo WhatsApp para a barbearia receber seus dados.
      </p>
      <div className="mt-6 text-left">
        <Summary {...booking} />
      </div>
      <a
        href={whatsappLink(whatsappMessage(booking))}
        target="_blank"
        rel="noopener"
        className="mt-6 flex items-center justify-center gap-2 rounded-full bg-[#25d366] py-3.5 font-semibold text-ink transition hover:brightness-110"
      >
        <MessageCircle size={18} /> Confirmar no WhatsApp
      </a>
      <button onClick={onClose} className="mt-3 w-full rounded-full py-3 text-sm font-medium text-sand hover:text-cream">
        Fechar
      </button>
    </div>
  )
}
