export type Service = {
  id: string
  name: string
  description: string
  price: number
  minutes: number
  popular?: boolean
}

export type Barber = {
  id: string
  name: string
  role: string
  specialty: string
  initials: string
  /** dias da semana em que atende (0 = domingo) */
  days: number[]
}

export const SHOP = {
  name: 'Navalha Barbearia',
  whatsapp: '5549999271760',
  address: 'Rua das Palmeiras, 120 — Centro',
  city: 'Chapecó, SC',
  instagram: '@navalha.barbearia',
  mapsQuery: 'Centro, Chapecó - SC',
}

/** Horário de funcionamento por dia da semana (0 = domingo) */
export const HOURS: Record<number, { open: string; close: string } | null> = {
  0: null,
  1: { open: '09:00', close: '19:00' },
  2: { open: '09:00', close: '19:00' },
  3: { open: '09:00', close: '19:00' },
  4: { open: '09:00', close: '20:00' },
  5: { open: '09:00', close: '20:00' },
  6: { open: '08:00', close: '14:00' },
}

export const SERVICES: Service[] = [
  { id: 'corte', name: 'Corte masculino', description: 'Corte na tesoura ou máquina, lavagem e finalização.', price: 45, minutes: 30, popular: true },
  { id: 'barba', name: 'Barba completa', description: 'Toalha quente, navalha e hidratação com óleo.', price: 35, minutes: 30 },
  { id: 'combo', name: 'Corte + barba', description: 'O combo completo, com desconto e uma bebida por conta da casa.', price: 70, minutes: 60, popular: true },
  { id: 'degrade', name: 'Degradê navalhado', description: 'Fade com acabamento na navalha e desenho opcional.', price: 55, minutes: 45 },
  { id: 'sobrancelha', name: 'Sobrancelha', description: 'Limpeza e alinhamento na navalha.', price: 15, minutes: 15 },
  { id: 'pigmentacao', name: 'Pigmentação de barba', description: 'Preenche falhas e realça o contorno da barba.', price: 40, minutes: 30 },
]

export const BARBERS: Barber[] = [
  { id: 'rafael', name: 'Rafael Souza', role: 'Fundador', specialty: 'Cortes clássicos e tesoura', initials: 'RS', days: [1, 2, 3, 4, 5, 6] },
  { id: 'diego', name: 'Diego Lima', role: 'Barbeiro', specialty: 'Degradê e desenhos', initials: 'DL', days: [2, 3, 4, 5, 6] },
  { id: 'matheus', name: 'Matheus Alves', role: 'Barbeiro', specialty: 'Barba e navalha', initials: 'MA', days: [1, 2, 4, 5, 6] },
]

export const GALLERY = [
  { src: '/img/navalha.webp', alt: 'Barbeiro aparando o cabelo de um cliente com navalha', tall: true },
  { src: '/img/ferramentas.webp', alt: 'Máquinas, tesoura e pente sobre uma bancada' },
  { src: '/img/cadeira.webp', alt: 'Cadeira de barbeiro de couro em frente a uma parede de tijolos' },
  { src: '/img/barba.webp', alt: 'Barbeiro aparando a barba de um cliente com tesoura', tall: true },
  { src: '/img/secador.webp', alt: 'Barbeiro finalizando um corte com secador' },
  { src: '/img/tesoura.webp', alt: 'Barbeiro usando tesoura e pente em um corte' },
]

export const brl = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
