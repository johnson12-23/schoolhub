# SchoolHub Admin Panel

Separate Next.js 15 admin console for SchoolHub.

## Stack

- Next.js 15 App Router
- TypeScript
- Tailwind CSS
- Supabase Auth, Database, Storage
- Framer Motion
- Recharts
- Dark and light mode

## Routes

- Admin login: `/schoolhub-admin/login`
- Admin dashboard: `/schoolhub-admin`
- Protected modules: students, teachers, classes, attendance, results, payments, announcements, messages, roles, settings

## Environment

Copy `.env.example` to `.env.local` in the `admin` folder:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
NEXT_PUBLIC_ADMIN_ROUTE=/schoolhub-admin
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=your_paystack_public_key
```

## Setup

```bash
npm install
npm run dev:admin
```

The admin app runs on `http://localhost:3001/schoolhub-admin`.

Run `supabase/schema.sql` in your Supabase SQL editor, create the `school-assets` storage bucket, then invite admin users through Supabase Auth and insert matching rows in `admins`.

## Security Notes

- Middleware protects `/schoolhub-admin/*`.
- Admin access requires a valid Supabase session and an active row in `admins`.
- Role checks are enforced in middleware and API routes.
- API examples use Zod validation before writing to Supabase.
- Supabase RLS policies in `supabase/schema.sql` limit table access to active admins.
