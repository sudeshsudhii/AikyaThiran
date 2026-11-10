import { GoogleSignIn } from "../components/GoogleSignIn";
import { LogoMark, Wordmark } from "../components/Logo";
import { ToolList } from "../components/Tools";

function Sunrise() {
  return (
    <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[2rem] bg-teal sm:aspect-square lg:aspect-[4/5]" aria-hidden>
      {/* sky glow */}
      <div className="absolute inset-0 bg-[radial-gradient(120%_70%_at_50%_72%,rgba(254,184,3,0.28),transparent_60%)]" />
      {/* the sun rises once */}
      <div className="absolute inset-x-0 bottom-[30%] flex justify-center">
        <div className="animate-rise">
          <div className="h-[min(58vw,22rem)] w-[min(58vw,22rem)] translate-y-1/2 rounded-full bg-sun" />
        </div>
      </div>
      {/* ground */}
      <div className="absolute inset-x-0 bottom-0 h-[30%] bg-teal-deep" />
      <div className="absolute inset-x-0 bottom-[30%] h-[3px] bg-sun/70" />
      {/* the T stands on the horizon */}
      <div className="absolute inset-x-0 bottom-[12%] flex animate-fadein justify-center">
        <svg viewBox="56 150 400 320" className="h-[min(44vw,17rem)] drop-shadow-[0_10px_30px_rgba(0,0,0,0.25)]">
          <rect x="56" y="150" width="400" height="86" rx="24" fill="#fff" />
          <rect x="212" y="150" width="88" height="320" rx="24" fill="#fff" />
        </svg>
      </div>
    </div>
  );
}

export default function Landing() {
  const year = new Date().getFullYear();
  return (
    <div className="min-h-screen">
      <header className="mx-auto flex h-20 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Wordmark />
        <a href="#sign-in" className="btn-ghost">Sign in</a>
      </header>

      <main>
        <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 pb-16 pt-6 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:gap-16 lg:pb-24 lg:pt-10">
          <div>
            <h1 className="font-display text-[2.75rem] font-bold leading-[1.02] tracking-[-0.035em] text-teal sm:text-6xl lg:text-[4.5rem]">
              Learn skills.
              <br />
              Grow together.
            </h1>
            <p className="mt-6 max-w-[34rem] text-lg leading-relaxed text-ink-muted">
              AikyaThiran is one place for students to build real skills, study smarter with an AI helper,
              and learn alongside people who share their goals.
            </p>

            <div id="sign-in" className="mt-10 max-w-md scroll-mt-24 rounded-3xl bg-white p-6 ring-1 ring-teal-line sm:p-7">
              <h2 className="font-display text-lg font-semibold text-ink">Start learning for free</h2>
              <p className="mb-5 mt-1 text-sm text-ink-muted">Use your Google account. It takes a few seconds.</p>
              <GoogleSignIn />
              <p className="mt-5 text-xs leading-relaxed text-ink-muted">
                We only use your name, email and profile photo from Google.
              </p>
            </div>
          </div>
          <Sunrise />
        </section>

        <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6 lg:pb-28">
          <h2 className="font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl">What you'll find inside</h2>
          <p className="mb-8 mt-2 max-w-prose text-ink-muted">Three tools, one account. We're opening them one by one.</p>
          <ToolList />
        </section>
      </main>

      <footer className="border-t border-teal-line/70">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-8 text-sm text-ink-muted sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <span className="inline-flex items-center gap-2"><LogoMark className="h-5 w-5" /> © {year} AikyaThiran</span>
          <a href="https://aikyathiran.in" className="hover:text-teal">aikyathiran.in</a>
        </div>
      </footer>
    </div>
  );
}
