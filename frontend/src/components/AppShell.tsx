import { useEffect, useRef, useState, type ReactNode } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { Wordmark } from "./Logo";

export function Avatar({ name, picture, size = 36 }: { name: string; picture: string | null; size?: number }) {
  const [broken, setBroken] = useState(false);
  const initials = name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();
  if (picture && !broken) {
    return <img src={picture} alt="" width={size} height={size} referrerPolicy="no-referrer" onError={() => setBroken(true)}
      className="rounded-full object-cover" style={{ width: size, height: size }} />;
  }
  return (
    <span className="grid place-items-center rounded-full bg-sun font-display text-sm font-bold text-teal-deep"
      style={{ width: size, height: size }}>{initials || "?"}</span>
  );
}

function UserMenu() {
  const { user, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent | KeyboardEvent) => {
      if (e instanceof KeyboardEvent ? e.key === "Escape" : !ref.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", close);
    return () => { document.removeEventListener("mousedown", close); document.removeEventListener("keydown", close); };
  }, [open]);

  if (!user) return null;
  return (
    <div className="relative" ref={ref}>
      <button onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-haspopup="menu"
        className="flex items-center gap-2 rounded-full p-1 pr-3 hover:bg-teal-soft">
        <Avatar name={user.name} picture={user.picture} size={32} />
        <span className="hidden text-sm font-bold sm:inline">{user.name.split(" ")[0]}</span>
      </button>
      {open && (
        <div role="menu" className="absolute right-0 z-40 mt-2 w-64 animate-toast rounded-2xl bg-white p-2 shadow-xl ring-1 ring-teal-line">
          <div className="px-3 py-2">
            <p className="truncate font-bold">{user.name}</p>
            <p className="truncate text-sm text-ink-muted">{user.email}</p>
          </div>
          <Link role="menuitem" to="/profile" onClick={() => setOpen(false)}
            className="block rounded-xl px-3 py-2 text-sm font-semibold hover:bg-teal-soft">Edit profile</Link>
          <button role="menuitem" onClick={async () => { await signOut(); navigate("/", { replace: true }); }}
            className="block w-full rounded-xl px-3 py-2 text-left text-sm font-semibold text-danger hover:bg-danger/5">Sign out</button>
        </div>
      )}
    </div>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const nav = ({ isActive }: { isActive: boolean }) =>
    `rounded-full px-4 py-2 text-sm font-bold transition-colors ${isActive ? "bg-teal text-white" : "text-ink-muted hover:bg-teal-soft hover:text-teal"}`;
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-30 border-b border-teal-line/60 bg-paper/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
          <Link to="/dashboard" aria-label="AikyaThiran home"><Wordmark /></Link>
          <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
            <NavLink to="/dashboard" className={nav}>Home</NavLink>
            <NavLink to="/profile" className={nav}>Profile</NavLink>
          </nav>
          <UserMenu />
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">{children}</main>
    </div>
  );
}
