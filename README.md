# Navalha Barbearia

Site para barbearia com **agendamento online**. O cliente escolhe o serviço, o barbeiro, o dia e um horário livre, e a confirmação já sai formatada para o WhatsApp da barbearia.

> Projeto demonstrativo: a barbearia é fictícia.

**🔗 Demo:** [navalha-barbearia-xi.vercel.app](https://navalha-barbearia-xi.vercel.app)

![Navalha Barbearia](docs/preview.jpg)

## Funcionalidades

- Landing page responsiva: hero, tabela de preços, equipe, galeria, horário de funcionamento e mapa
- Agendamento em 4 passos (serviço → barbeiro → data e horário → dados), num modal que vira *bottom sheet* no celular
- Horários calculados pelo expediente de cada dia, pelos dias em que cada barbeiro atende e pela duração do serviço (um serviço de 60 min ocupa 2 horários)
- Horários que já passaram ficam escondidos, e os já reservados ficam bloqueados
- "Seus próximos horários": o cliente vê e cancela os próprios agendamentos (salvos no `localStorage`)
- Confirmação e cancelamento enviados por mensagem pronta no WhatsApp (`wa.me`)
- Máscara de telefone, fechamento com `Esc`, foco no modal e suporte a `prefers-reduced-motion`

## Tecnologias

React 19 · TypeScript · Tailwind CSS 4 · Vite · lucide-react

## Rodando localmente

```bash
npm install
npm run dev
```

## Estrutura

```
src/
  data.ts                 # serviços, barbeiros, horários e dados da loja
  lib/schedule.ts         # regras de horários, persistência e WhatsApp
  components/
    BookingModal.tsx      # fluxo de agendamento
    MyBookings.tsx        # próximos horários do cliente
  App.tsx                 # landing page
```

Para adaptar a outra barbearia, basta editar o `src/data.ts`.

## Próximos passos

- Back-end (Node.js + PostgreSQL) para centralizar a agenda
- Painel do barbeiro com a agenda do dia

---

Fotos: [Unsplash](https://unsplash.com) (licença Unsplash).
