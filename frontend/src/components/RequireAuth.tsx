import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { LogoMark } from "./Logo";

export function FullPageLoader() {
  return (
    <div className="grid min-h-screen place-items-center" aria-live="polite">
      <div className="flex flex-col items-center gap-3 text-ink-muted">
        <LogoMark className="h-12 w-12 animate-pulse" />
        <span className="text-sm">Loading…</span>
      </div>
    </div>
  );
}

export function RequireAuth({ children }: { children: ReactNode }) {
  const { status } = useAuth();
  const location = useLocation();
  if (status === "loading") return <FullPageLoader />;
  if (status === "signed-out") return <Navigate to="/" replace state={{ from: location.pathname }} />;
  return <>{children}</>;
}
