# SchoolHub

SchoolHub is a modern educational web application for Ghanaian basic school students and teachers. It is optimized for mobile devices, low data usage, and easy access to textbooks, slide materials, and past questions.

## Tech Stack

- Frontend: React + Vite + Tailwind CSS
- Backend: Node.js + Express
- Database: Supabase (with local demo fallback)
- Auth: JWT with role-based access
- Uploads: Local file uploads in development

## 1. Run the backend

```bash
cd backend
npm install
cp .env.example .env
npm run seed
npm run dev
```

## 2. Run the frontend

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

## Quick start from the root folder

```bash
npm run install:all
npm run seed:backend
npm run dev
```

This starts both the backend and frontend together from the `School Hub` folder.

## Demo accounts

- Student: `student@schoolhub.gh` / `password123`
- Teacher: `teacher@schoolhub.gh` / `password123`
- Admin: `admin@schoolhub.gh` / `password123`

## Step-by-step local setup

1. Open one terminal and move into `backend`.
2. Run `npm install`.
3. Copy `.env.example` to `.env`.
4. If Supabase is configured, run `npm run seed` to load demo users and resources.
5. Start the API with `npm run dev`.
6. Open a second terminal and move into `frontend`.
7. Run `npm install`.
8. Copy `.env.example` to `.env`.
9. Start the frontend with `npm run dev`.
10. Open `http://localhost:5173`.

Or from the project root:

1. Run `npm run install:all`
2. Run `npm run seed:backend`
3. Run `npm run dev`
4. Open `http://localhost:5173`

## Supabase notes

- The backend automatically switches to Supabase when `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are provided.
- A starter schema is available in [backend/src/data/supabase-schema.sql](/c:/Users/ANSU%20T.K%20JOHNSON/Desktop/School%20Hub/backend/src/data/supabase-schema.sql).
- Without Supabase credentials, SchoolHub still works in demo mode using seeded users and resources.

## Included sample data

- Seeded student, teacher, and admin users
- Sample Mathematics, English, Science, Social Studies, and ICT resources
- Featured content used on the homepage
