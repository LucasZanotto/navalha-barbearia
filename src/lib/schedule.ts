import { BARBERS, HOURS, SERVICES, SHOP, brl } from '../data'

export type Booking = {
  id: string
  serviceId: string
  barberId: string
  /** yyyy-mm-dd */
  date: string
  /** HH:mm */
  time: string
  name: string
  phone: string
  createdAt: number
}

const STORAGE_KEY = 'navalha:bookings'
const SLOT_MINUTES = 30

// ---------- datas ----------
export const toISODate = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`

export const fromISODate = (s: string) => {
  const [y, m, d] = s.split('-').map(Number)
  return new Date(y, m - 1, d)
}

const toMinutes = (hhmm: string) => {
  const [h, m] = hhmm.split(':').map(Number)
  return h * 60 + m
}
const toHHMM = (min: number) => `${String(Math.floor(min / 60)).padStart(2, '0')}:${String(min % 60).padStart(2, '0')}`

export function nextDays(count = 14, from = new Date()) {
  const days: Date[] = []
  const d = new Date(from.getFullYear(), from.getMonth(), from.getDate())
  for (let i = 0; i < count; i++) {
    days.push(new Date(d))
    d.setDate(d.getDate() + 1)
  }
  return days
}

export function formatDateLong(iso: string) {
  const s = fromISODate(iso).toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' })
  return s.charAt(0).toUpperCase() + s.slice(1)
}

// ---------- disponibilidade ----------
/** Hash simples e determinístico: simula horários já ocupados por outros clientes. */
function seeded(str: string) {
  let h = 2166136261
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return (h >>> 0) / 4294967295
}

export function isBarberWorking(barberId: string, iso: string) {
  const barber = BARBERS.find((b) => b.id === barberId)
  const weekday = fromISODate(iso).getDay()
  return Boolean(barber?.days.includes(weekday) && HOURS[weekday])
}

export type Slot = { time: string; available: boolean }

export function getSlots(barberId: string, iso: string, serviceMinutes: number, now = new Date()): Slot[] {
  const hours = HOURS[fromISODate(iso).getDay()]
  if (!hours || !isBarberWorking(barberId, iso)) return []

  const open = toMinutes(hours.open)
  const close = toMinutes(hours.close)
  const isToday = iso === toISODate(now)
  const nowMin = now.getHours() * 60 + now.getMinutes()

  // ocupados: simulação + agendamentos reais salvos neste navegador
  const taken = new Set<number>()
  for (let t = open; t < close; t += SLOT_MINUTES) {
    if (seeded(`${barberId}|${iso}|${t}`) < 0.35) taken.add(t)
  }
  for (const b of loadBookings()) {
    if (b.barberId !== barberId || b.date !== iso) continue
    const start = toMinutes(b.time)
    const len = SERVICES.find((s) => s.id === b.serviceId)?.minutes ?? SLOT_MINUTES
    for (let t = start; t < start + len; t += SLOT_MINUTES) taken.add(t)
  }

  const slots: Slot[] = []
  for (let t = open; t + serviceMinutes <= close; t += SLOT_MINUTES) {
    if (isToday && t <= nowMin + 30) continue // horários que já passaram nem aparecem
    let free = true
    for (let k = t; free && k < t + serviceMinutes; k += SLOT_MINUTES) if (taken.has(k)) free = false
    slots.push({ time: toHHMM(t), available: free })
  }
  return slots
}

// ---------- persistência ----------
export function loadBookings(): Booking[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') as Booking[]
  } catch {
    return []
  }
}

function saveBookings(list: Booking[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
  } catch {
    /* navegador sem storage: o agendamento segue só pelo WhatsApp */
  }
}

export function addBooking(b: Omit<Booking, 'id' | 'createdAt'>): Booking {
  const booking: Booking = { ...b, id: crypto.randomUUID?.() ?? String(Date.now()), createdAt: Date.now() }
  saveBookings([...loadBookings(), booking])
  return booking
}

export function cancelBooking(id: string) {
  saveBookings(loadBookings().filter((b) => b.id !== id))
}

export function upcomingBookings(now = new Date()) {
  const today = toISODate(now)
  return loadBookings()
    .filter((b) => b.date >= today)
    .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time))
}

// ---------- WhatsApp ----------
export function whatsappMessage(b: Pick<Booking, 'serviceId' | 'barberId' | 'date' | 'time' | 'name'>, kind: 'new' | 'cancel' = 'new') {
  const service = SERVICES.find((s) => s.id === b.serviceId)!
  const barber = BARBERS.find((x) => x.id === b.barberId)!
  const head = kind === 'new' ? 'Olá! Gostaria de confirmar meu agendamento:' : 'Olá! Preciso cancelar meu agendamento:'
  return [
    head,
    '',
    `✂️ ${service.name} (${brl(service.price)})`,
    `💈 Com ${barber.name}`,
    `📅 ${formatDateLong(b.date)} às ${b.time}`,
    `👤 ${b.name}`,
  ].join('\n')
}

export const whatsappLink = (text: string) => `https://wa.me/${SHOP.whatsapp}?text=${encodeURIComponent(text)}`
