import { useMemo } from 'react'
import { CalendarCheck, X } from 'lucide-react'
import { BARBERS, SERVICES } from '../data'
import { cancelBooking, formatDateLong, upcomingBookings, whatsappLink, whatsappMessage } from '../lib/schedule'

/** Mostra os próximos agendamentos feitos neste navegador. */
export function MyBookings({ refreshKey, onChange }: { refreshKey: number; onChange: () => void }) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const list = useMemo(() => upcomingBookings(), [refreshKey])
  if (list.length === 0) return null

  return (
    <section className="mx-auto max-w-6xl px-4 pt-6 sm:px-6" aria-label="Meus agendamentos">
      <div className="rounded-2xl border border-brass/30 bg-brass/5 p-5">
        <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-brass">
          <CalendarCheck size={16} /> Seus próximos horários
        </h2>
        <ul className="mt-3 divide-y divide-line">
          {list.map((b) => {
            const s = SERVICES.find((x) => x.id === b.serviceId)
            const barber = BARBERS.find((x) => x.id === b.barberId)
            return (
              <li key={b.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
                <div>
                  <p className="font-medium">
                    {s?.name} com {barber?.name.split(' ')[0]}
                  </p>
                  <p className="text-sm text-sand">
                    {formatDateLong(b.date)} · {b.time}
                  </p>
                </div>
                <button
                  onClick={() => {
                    if (!confirm('Cancelar este horário?')) return
                    cancelBooking(b.id)
                    onChange()
                    window.open(whatsappLink(whatsappMessage(b, 'cancel')), '_blank', 'noopener')
                  }}
                  className="inline-flex items-center gap-1.5 rounded-full border border-line px-3.5 py-1.5 text-sm text-sand transition hover:border-red-400/50 hover:text-red-300"
                >
                  <X size={14} /> Cancelar
                </button>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
