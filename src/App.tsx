import { useEffect, useState } from 'react'
import { CalendarDays, Clock, Instagram, MapPin, Menu, Scissors, X } from 'lucide-react'
import { BARBERS, GALLERY, HOURS, SERVICES, SHOP, brl } from './data'
import { BookingModal, type BookingPreset } from './components/BookingModal'
import { MyBookings } from './components/MyBookings'

const WEEKDAYS = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']
const NAV = [
  { href: '#servicos', label: 'Serviços' },
  { href: '#equipe', label: 'Equipe' },
  { href: '#galeria', label: 'Galeria' },
  { href: '#contato', label: 'Contato' },
]

export default function App() {
  const [booking, setBooking] = useState<BookingPreset | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [pastHero, setPastHero] = useState(false)
  const [refresh, setRefresh] = useState(0)

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 10)
      setPastHero(window.scrollY > window.innerHeight * 0.7)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const open = (preset: BookingPreset = {}) => {
    setMenuOpen(false)
    setBooking(preset)
  }

  return (
    <>
      {/* HEADER */}
      <header
        className={`fixed inset-x-0 top-0 z-40 transition-colors duration-300 ${
          scrolled || menuOpen ? 'border-b border-line bg-ink/90 backdrop-blur-md' : 'bg-transparent'
        }`}
      >
        <div className="mx-auto flex h-[68px] max-w-6xl items-center justify-between px-4 sm:px-6">
          <a href="#" className="flex items-center gap-2.5">
            <img src="/favicon.svg" alt="" className="h-9 w-9" />
            <span className="font-display text-xl tracking-wide">Navalha</span>
          </a>
          <nav className="hidden items-center gap-8 md:flex">
            {NAV.map((n) => (
              <a key={n.href} href={n.href} className="text-sm font-medium text-sand transition hover:text-cream">
                {n.label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <button
              onClick={() => open()}
              className="hidden rounded-full bg-brass px-5 py-2.5 text-sm font-semibold text-ink transition hover:bg-brass-light sm:block"
            >
              Agendar horário
            </button>
            <button
              className="grid h-10 w-10 place-items-center rounded-full border border-line md:hidden"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
              aria-expanded={menuOpen}
            >
              {menuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
        {menuOpen && (
          <nav className="border-t border-line px-4 pb-5 md:hidden">
            {NAV.map((n) => (
              <a key={n.href} href={n.href} onClick={() => setMenuOpen(false)} className="block border-b border-line py-3.5 text-base">
                {n.label}
              </a>
            ))}
            <button onClick={() => open()} className="mt-4 w-full rounded-full bg-brass py-3 font-semibold text-ink">
              Agendar horário
            </button>
          </nav>
        )}
      </header>

      <main>
        {/* HERO */}
        <section className="relative flex min-h-[92svh] items-end overflow-hidden pb-20 pt-32 sm:items-center sm:pb-0">
          <img src="/img/hero.webp" alt="" className="absolute inset-0 h-full w-full object-cover object-[70%_center]" fetchPriority="high" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/75 to-ink/10 sm:bg-gradient-to-r sm:from-ink sm:via-ink/80 sm:to-ink/10" />
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-ink to-transparent" />
          <div className="relative mx-auto w-full max-w-6xl px-4 sm:px-6">
            <div className="max-w-xl animate-fade-up">
              <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-brass/30 bg-brass/10 px-3.5 py-1.5 text-xs font-medium uppercase tracking-[.18em] text-brass-light">
                <Scissors size={14} /> Desde 2015 · {SHOP.city}
              </p>
              <h1 className="font-display text-5xl leading-[1.02] sm:text-7xl">
                Tradição na navalha. <span className="text-brass">Estilo</span> no espelho.
              </h1>
              <p className="mt-6 max-w-md text-lg text-sand">
                Corte, barba e cuidado masculino com hora marcada. Escolha o serviço, o barbeiro e o horário em menos de 1 minuto.
              </p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <button
                  onClick={() => open()}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-brass px-7 py-4 font-semibold text-ink shadow-[0_10px_40px_-10px] shadow-brass/60 transition hover:-translate-y-0.5 hover:bg-brass-light"
                >
                  <CalendarDays size={18} /> Agendar agora
                </button>
                <a
                  href="#servicos"
                  className="inline-flex items-center justify-center rounded-full border border-cream/20 px-7 py-4 font-semibold transition hover:border-cream/50"
                >
                  Ver serviços e preços
                </a>
              </div>
              <div className="mt-10 flex items-center gap-3 text-sm text-sand">
                <Clock size={16} className="text-brass" />
                Atendimento com hora marcada, sem fila de espera
              </div>
            </div>
          </div>
        </section>

        <MyBookings refreshKey={refresh} onChange={() => setRefresh((r) => r + 1)} />

        {/* SERVIÇOS */}
        <section id="servicos" className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
          <SectionHead kicker="Serviços" title="Tabela de preços" sub="Valores fixos, sem surpresa. Clique em um serviço para agendar direto." />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {SERVICES.map((s) => (
              <button
                key={s.id}
                onClick={() => open({ serviceId: s.id })}
                className="group relative flex flex-col rounded-2xl border border-line bg-coal p-6 text-left transition hover:-translate-y-1 hover:border-brass/50"
              >
                {s.popular && (
                  <span className="absolute right-5 top-5 rounded-full bg-brass/15 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-brass">
                    Mais pedido
                  </span>
                )}
                <h3 className="pr-24 font-display text-2xl">{s.name}</h3>
                <p className="mt-2 flex-1 text-sm text-sand">{s.description}</p>
                <div className="mt-6 flex items-end justify-between border-t border-line pt-4">
                  <div>
                    <span className="text-2xl font-semibold text-brass-light">{brl(s.price)}</span>
                    <span className="ml-2 inline-flex items-center gap-1 text-xs text-sand">
                      <Clock size={12} /> {s.minutes} min
                    </span>
                  </div>
                  <span className="text-sm font-medium text-brass opacity-80 transition group-hover:opacity-100">Agendar →</span>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* EQUIPE */}
        <section id="equipe" className="border-y border-line bg-coal">
          <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
            <SectionHead kicker="Equipe" title="Quem cuida de você" sub="Escolha seu barbeiro preferido na hora de agendar." />
            <div className="grid gap-5 md:grid-cols-3">
              {BARBERS.map((b) => (
                <article key={b.id} className="rounded-2xl border border-line bg-char p-7">
                  <div className="grid h-16 w-16 place-items-center rounded-full bg-gradient-to-br from-brass to-[#7a5a2e] font-display text-2xl text-ink">
                    {b.initials}
                  </div>
                  <h3 className="mt-5 font-display text-2xl">{b.name}</h3>
                  <p className="text-sm font-medium text-brass">{b.role}</p>
                  <p className="mt-3 text-sm text-sand">{b.specialty}</p>
                  <p className="mt-4 text-xs uppercase tracking-wider text-sand/70">
                    Atende: {b.days.map((d) => WEEKDAYS[d].slice(0, 3)).join(' · ')}
                  </p>
                  <button
                    onClick={() => open({ barberId: b.id })}
                    className="mt-6 w-full rounded-full border border-brass/40 py-2.5 text-sm font-semibold text-brass-light transition hover:bg-brass hover:text-ink"
                  >
                    Agendar com {b.name.split(' ')[0]}
                  </button>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* GALERIA */}
        <section id="galeria" className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
          <SectionHead kicker="Galeria" title="O ambiente" sub="Um espaço pensado para você relaxar enquanto cuida do visual." />
          <div className="columns-2 gap-4 md:columns-3 [&>*]:mb-4">
            {GALLERY.map((g) => (
              <img
                key={g.src}
                src={g.src}
                alt={g.alt}
                loading="lazy"
                className={`w-full break-inside-avoid rounded-2xl object-cover ${g.tall ? 'aspect-[3/4]' : 'aspect-[4/3]'}`}
              />
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="relative overflow-hidden rounded-3xl border border-brass/30 bg-gradient-to-br from-[#2a2117] to-coal px-6 py-14 text-center sm:px-12">
            <h2 className="font-display text-4xl sm:text-5xl">Bora dar um tapa no visual?</h2>
            <p className="mx-auto mt-4 max-w-md text-sand">Escolha o horário que cabe na sua agenda. A confirmação chega no seu WhatsApp.</p>
            <button
              onClick={() => open()}
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-brass px-8 py-4 font-semibold text-ink transition hover:bg-brass-light"
            >
              <CalendarDays size={18} /> Agendar horário
            </button>
          </div>
        </section>

        {/* CONTATO */}
        <section id="contato" className="mx-auto grid max-w-6xl gap-10 px-4 py-24 sm:px-6 md:grid-cols-2">
          <div>
            <SectionHead kicker="Contato" title="Onde estamos" />
            <ul className="space-y-4 text-sand">
              <li className="flex gap-3">
                <MapPin className="mt-0.5 shrink-0 text-brass" size={20} />
                <span>
                  {SHOP.address}
                  <br />
                  {SHOP.city}
                </span>
              </li>
              <li className="flex gap-3">
                <Instagram className="shrink-0 text-brass" size={20} /> {SHOP.instagram}
              </li>
            </ul>
            <div className="mt-8 overflow-hidden rounded-2xl border border-line">
              <iframe
                title="Mapa"
                className="h-64 w-full grayscale invert-[.92] contrast-[.9]"
                loading="lazy"
                src={`https://maps.google.com/maps?q=${encodeURIComponent(SHOP.mapsQuery)}&z=15&output=embed`}
              />
            </div>
          </div>
          <div className="rounded-2xl border border-line bg-coal p-7">
            <h3 className="flex items-center gap-2 font-display text-2xl">
              <Clock className="text-brass" size={22} /> Horário de funcionamento
            </h3>
            <ul className="mt-6 divide-y divide-line">
              {[1, 2, 3, 4, 5, 6, 0].map((d) => {
                const h = HOURS[d]
                const today = new Date().getDay() === d
                return (
                  <li key={d} className={`flex justify-between py-3 ${today ? 'font-semibold text-cream' : 'text-sand'}`}>
                    <span>
                      {WEEKDAYS[d]} {today && <span className="ml-2 text-xs text-brass">hoje</span>}
                    </span>
                    <span>{h ? `${h.open} – ${h.close}` : 'Fechado'}</span>
                  </li>
                )
              })}
            </ul>
          </div>
        </section>
      </main>

      <footer className="border-t border-line">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-8 text-sm text-sand sm:flex-row sm:justify-between sm:px-6">
          <span>© {new Date().getFullYear()} {SHOP.name}</span>
          <span>
            Projeto demonstrativo · desenvolvido por{' '}
            <a href="https://github.com/LucasZanotto" target="_blank" rel="noopener" className="text-brass hover:underline">
              Lucas Zanotto
            </a>
          </span>
        </div>
      </footer>

      {/* Botão flutuante no celular */}
      <button
        onClick={() => open()}
        tabIndex={pastHero ? 0 : -1}
        aria-hidden={!pastHero}
        className={`fixed inset-x-4 bottom-4 z-30 flex items-center justify-center gap-2 rounded-full bg-brass py-4 font-semibold text-ink shadow-2xl transition duration-300 sm:hidden ${
          pastHero ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-24 opacity-0'
        }`}
      >
        <CalendarDays size={18} /> Agendar horário
      </button>

      {booking && (
        <BookingModal
          preset={booking}
          onClose={() => setBooking(null)}
          onBooked={() => setRefresh((r) => r + 1)}
        />
      )}
    </>
  )
}

function SectionHead({ kicker, title, sub }: { kicker: string; title: string; sub?: string }) {
  return (
    <div className="mb-12 max-w-xl">
      <p className="mb-3 text-xs font-semibold uppercase tracking-[.2em] text-brass">{kicker}</p>
      <h2 className="font-display text-4xl sm:text-5xl">{title}</h2>
      {sub && <p className="mt-4 text-sand">{sub}</p>}
    </div>
  )
}
