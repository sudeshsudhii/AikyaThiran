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
- Frontend complete for v0.1 and `npm run build` passes: Landing (`/`), Dashboard (`/dashboard`), Profile
  (`/profile`, `?welcome=1` after first sign-in), NotFound. Shared tool list in `components/Tools.tsx`.
- Checked with Playwright screenshots at 1280px and iPhone size (Google button stubbed in the sandbox).

TODO (next steps):
1. Write `README.md` (simple English): Google Cloud OAuth client setup (Web app; Authorized JavaScript origins
   `http://localhost:5173` and later `https://aikyathiran.in`), copy `backend/.env.example` to `.env`, run backend
   (`uvicorn app.main:app --reload`) and frontend (`npm install && npm run dev`).
2. Test real Google sign-in with a real client id.
3. Mobile: add Home/Profile links to the user menu (top nav is hidden below md).
4. Later: Alembic migrations, Docker, deploy, CSRF hardening for cookie auth, then build Thiran Skills.
