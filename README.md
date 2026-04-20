# PropNexus

PropNexus is a multi-page Next.js real estate SaaS starter with:

- Landing, pricing, AI tools, marketplace, login, signup, and dashboard routes
- Supabase-ready authentication and database wiring
- OpenAI-backed AI generation through a Next.js API route
- Admin, agent, and listing management dashboard views
- Seeded fallback data so the app still runs before external services are configured

## Run locally

1. Create a `.env.local` file from `.env.example`
2. Add your Supabase and OpenAI keys
3. Install dependencies
4. Run the app

```bash
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000)

## Environment variables

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `OPENAI_API_KEY`
- `OPENAI_MODEL`

## Database setup

Run the SQL in `supabase/schema.sql` inside your Supabase SQL editor.

## Notes

- Without Supabase keys, login/signup pages show setup guidance instead of authenticating users.
- Without an OpenAI key, `/api/ai` returns polished fallback content so the UI stays functional.
- The marketplace page is seeded locally today but can switch to live Supabase property records through `/api/properties`.
