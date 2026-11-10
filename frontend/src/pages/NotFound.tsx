import { Link } from "react-router-dom";
import { LogoMark } from "../components/Logo";

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center px-4">
      <div className="flex max-w-sm flex-col items-center text-center">
        <LogoMark className="h-14 w-14" />
        <h1 className="mt-6 font-display text-2xl font-bold text-teal">This page doesn't exist.</h1>
        <p className="mt-2 text-ink-muted">The link may be old or typed wrong.</p>
        <Link to="/" className="btn-primary mt-6">Go to home</Link>
      </div>
    </main>
  );
}
