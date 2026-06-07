# CareerNext

CareerNext is a production-oriented SaaS web application for students and early professionals moving from learning into opportunity.

It helps users analyze resumes, improve ATS readiness, prepare for interviews, discover internship paths, track applications, generate tailored cover letters, and create learning roadmaps with Google Gemini.

## Product Scope

- Resume analyzer with skill extraction, missing skills, and practical recommendations
- PDF/DOCX resume upload to `public/uploads/`
- Job description vs resume matcher with compatibility scoring
- Internship recommendation workflow based on skills, interests, and preferred roles
- Interview preparation for HR, technical, ECE, and mock interview practice
- Immersive mock interview mode with timer, follow-up questions, and confidence/technical/communication scores
- Cover letter generator with editable document-style output
- Job application tracker with kanban and table views
- Insights panel with concise recruiter-style feedback and suggested next steps
- Weekly career planner with completion tracking and regeneration
- JWT authentication with protected dashboard routes
- MongoDB Atlas persistence through Mongoose models
- Clean SaaS dashboard UI with responsive layouts

## Tech Stack

- Next.js 14 App Router
- TypeScript
- Tailwind CSS
- shadcn-style UI primitives
- Lucide React
- Framer Motion ready for subtle transitions
- Recharts
- MongoDB Atlas and Mongoose
- JWT authentication
- Google Gemini via `@google/generative-ai`

## Getting Started

Install dependencies:

```bash
npm install
```

Create a local environment file:

```bash
cp .env.example .env.local
```

Fill in:

```bash
MONGODB_URI=
GOOGLE_GEMINI_API_KEY=
JWT_SECRET=
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Start the development server:

```bash
npm run dev -- -p 3001
```

Open `http://localhost:3001`.

## Environment Notes

`GOOGLE_GEMINI_API_KEY` is optional for local preview. API routes include fallback responses for simpler local testing, but production should be configured with a real Gemini key and MongoDB connection.

`MONGODB_URI` and `JWT_SECRET` are required for authentication and persistence.

## Architecture

```text
app/
  api/                 Next.js API routes
  dashboard/           Protected product workspace
  login/ signup/       Auth screens
components/
  dashboard/           Dashboard-specific UI
  forms/               Client forms
  layout/              Marketing and dashboard shells
  ui/                  Reusable shadcn-style primitives
lib/
  auth.ts              JWT, cookies, password hashing
  db.ts                MongoDB connection cache
  gemini.ts            Google Gemini JSON helper
models/                Mongoose schemas
types/                 Shared TypeScript types
```

## Deployment

CareerNext is compatible with Vercel. Add the environment variables in the Vercel project settings, connect a MongoDB Atlas cluster, and deploy from the main branch.

## Screenshots

Add production screenshots after deployment:

- Landing page
- Dashboard overview
- Resume analyzer report
- Application tracker
- Cover letter editor
- Progress analytics
- JD matcher

## Security Considerations

- Passwords are hashed with bcrypt before storage
- JWT sessions are stored in HTTP-only cookies
- Dashboard routes are protected through Next.js middleware
- AI calls use only Google Gemini through `@google/generative-ai`

## Hackathon QA Checklist

- `npm.cmd run lint`
- `npm.cmd run build`
- Verify signup/login and protected dashboard redirect
- Upload a PDF or DOCX resume from `/dashboard`
- Test `/dashboard/resume`, `/dashboard/interviews`, `/dashboard/applications`, `/dashboard/recommendations`, `/dashboard/progress`, and `/dashboard/settings`
- Confirm Gemini fallback behavior by running without `GOOGLE_GEMINI_API_KEY`
- Confirm MongoDB persistence by adding `MONGODB_URI`

## License

MIT
