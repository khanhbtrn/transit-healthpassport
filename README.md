# Transit

**Your healthcare moves with you.**

Transit is an AI healthcare relocation agent for people who move between countries.

[DEMO->](https://www.loom.com/share/feac3f6c05294d2f882ffcbfacf5399e)

<img width="1482" height="910" alt="image" src="https://github.com/user-attachments/assets/6fc30a37-d617-480b-9c65-069bc09ca384" />


## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

The app runs fully in **demo mode** without API keys. Use **Follow Maria’s journey** or **Use Maria’s example journey** to seed the experience.

## Environment

Copy `.env.example` to `.env.local` and optionally configure:

- `AI_PROVIDER=mock|anthropic|openai`
- Anthropic / OpenAI keys for live AI responses
- ElevenLabs keys for spoken handoff audio
- Supabase keys for auth/persistence

When credentials are missing, Transit falls back to seeded mock data and simulated services.

## Demo journey

1. Landing → Start transition / Follow Maria
2. Onboarding → seed Maria’s journey
3. Overview command centre
4. Health profile + timeline
5. Documents upload simulation
6. Doctor conversation recording + fact approval
7. Spain relocation plan
8. Care search + simulated appointment request
9. Medical handoff + spoken playback
10. Transit Agent
11. Arrival mode

## Stack

- Next.js App Router + TypeScript + Tailwind CSS
- Framer Motion + Lucide
- Zustand demo persistence
- AI provider abstraction (`anthropic` / `openai` / `mock`)
- Supabase schema + optional client
- ElevenLabs optional voice

## Safety

Transit organises information and prepares actions. It does not replace clinicians, determine legal eligibility, contact providers without approval, or book appointments autonomously.
