# AikyaThiran — project notes for Claude

AikyaThiran (aikyathiran.in) is a web app for students: learn skills, study smarter with AI, grow together.
Owner: Sudesh P. **Explain things in simple, easy English.**

**Global product:** English only. No Tamil text, Tamil fonts or regional references anywhere in the UI or copy.

More background (name, products, logo history): see `brand/BRAND-CONTEXT.md`. Logo files: `brand/logo/`.

## Stack
- `backend/` — FastAPI + SQLAlchemy 2 (SQLite by default, `DATABASE_URL` for Postgres), Google sign-in.
- `frontend/` — React 18 + Vite 5 + TypeScript + Tailwind 3. Dev server proxies `/api` to `localhost:8000`.

## How sign-in works
1. Frontend shows the Google button (`@react-oauth/google`, client id fetched from `GET /api/auth/config`).
2. Google returns an ID token -> frontend sends it to `POST /api/auth/google`.
3. Backend verifies it with `google-auth`, creates/updates the user, and sets an httpOnly JWT cookie `at_session`.
4. `GET /api/auth/me`, `PATCH /api/users/me`, `POST /api/auth/logout`.

## Brand
- Colors: teal `#025049` (deep `#013A35`, soft `#DCEDEA`), sun/marigold `#FEB803` (soft `#FFF1C2`), ink `#12221F`, paper `#F4F8F7`.
- Fonts: Sora (display), Manrope (body). Loaded via @fontsource.
- Logo: "Sunrise T" — bold T crossing a rising sun. Component: `frontend/src/components/Logo.tsx` (`LogoMark`, `Wordmark`).
- Design rules: one memorable moment (sun rising once on landing), no generic SaaS card grids, no ALL-CAPS eyebrow labels,
  no numbered markers unless it is a real sequence, no "→" in buttons, sentence case, plain active-voice copy.

## Status
Done:
- Backend complete, 10 tests passing (`cd backend && pip install -r requirements-dev.txt && pytest -q`).
- Frontend: config, Tailwind theme, `index.css`, `main.tsx`, `App.tsx` (routes), `lib/api.ts`, `auth/AuthContext.tsx`,
  components (`Logo`, `GoogleSignIn`, `RequireAuth`, `AppShell`, `Toast`), `public/favicon.svg`.

TODO (next steps):
1. `frontend/src/pages/Landing.tsx` — top bar with Wordmark; hero with headline
   "Learn skills. Grow together."; `<GoogleSignIn />` block with note
   "Free for students. We only use your name, email and photo from Google."; big rising sun on a horizon line behind the
   LogoMark using `animate-rise` (once, on load) + `animate-fadein`; a simple list (not cards) of the 3 tools:
   Thiran Skills (skill tracks + progress), Thiran Paath (AI study helper, notes, planner), Aikyam (student community) —
   each "Opening soon"; footer with © year AikyaThiran and aikyathiran.in.
2. `frontend/src/pages/Dashboard.tsx` — greeting "Welcome back, {first name}"; if `!user.profile_complete`
   show a sun-soft banner with "Complete your profile" button to `/profile`; list of the 3 tools with "Opening soon";
   the student's interests as chips with an "Edit" link.
3. `frontend/src/pages/Profile.tsx` — form: name, college, course, year of study (1–6 select), interests as chips
   (add with Enter, remove with ×, max 20). "Save changes" -> `updateProfile` from `useAuth()` -> `<Toast>` "Profile saved".
   If URL has `?welcome=1`, show a short welcome line and after saving go to `/dashboard`.
4. `frontend/src/pages/NotFound.tsx` — LogoMark, "This page doesn't exist.", link "Go to home".
5. `npm run build` must pass; check pages with Playwright screenshots at 1280px and 375px.
6. Write `README.md` (simple English): Google Cloud OAuth client setup (Web app; Authorized JavaScript origins
   `http://localhost:5173` and later `https://aikyathiran.in`), copy `backend/.env.example` to `.env`, run backend
   (`uvicorn app.main:app --reload`) and frontend (`npm install && npm run dev`).
7. Later: Alembic migrations, Docker, deploy, CSRF hardening for cookie auth.
