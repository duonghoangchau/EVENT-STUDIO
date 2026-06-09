# Delfi Event Studio MVP

AI-powered internal event landing page and registration form builder for Delfi technical/dev team.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Prisma ORM
- MySQL local
- JSON schema-driven landing renderer
- Mock AI draft assistant

## Run local

```bash
npm install
cp .env.example .env
# tạo database MySQL: delfi_event_studio
npx prisma generate
npx prisma migrate dev --name init
npm run prisma:seed
npm run dev
```

Open: http://localhost:3000

## Main pages

- `/` Dashboard
- `/projects` Project list
- `/projects/new` Create project
- `/projects/[id]` Project overview
- `/projects/[id]/builder` Section builder
- `/projects/[id]/forms` Form builder
- `/preview/[slug]` Public landing preview
- `/submit/[formId]` Public registration form

## MVP rule

AI only returns JSON-like draft data. The app renders from approved sections and schemas. Do not let AI generate executable React/HTML code directly.
