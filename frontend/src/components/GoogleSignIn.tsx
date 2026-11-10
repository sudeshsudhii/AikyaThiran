import { GoogleLogin } from "@react-oauth/google";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export function GoogleSignIn() {
  const { googleClientId, backendDown, signInWithGoogle } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();

  if (backendDown) {
    return (
      <p role="alert" className="rounded-xl bg-white p-4 text-sm text-danger ring-1 ring-danger/20">
        Can't reach the server. Start the backend (<code>uvicorn app.main:app --reload</code>) and refresh this page.
      </p>
    );
  }
  if (!googleClientId) {
    return (
      <p role="alert" className="rounded-xl bg-white p-4 text-sm text-ink-muted ring-1 ring-teal-line">
        Google sign-in isn't set up yet. Add <code>GOOGLE_CLIENT_ID</code> to <code>backend/.env</code> and restart the server.
      </p>
    );
  }

  return (
    <div className="flex flex-col items-start gap-3">
      <div aria-busy={busy} className={busy ? "pointer-events-none opacity-60" : ""}>
        <GoogleLogin
          onSuccess={async (res) => {
            if (!res.credential) { setError("Google didn't return a sign-in token. Try again."); return; }
            setBusy(true); setError(null);
            try {
              const user = await signInWithGoogle(res.credential);
              navigate(user.profile_complete ? "/dashboard" : "/profile?welcome=1", { replace: true });
            } catch (e) {
              setError(e instanceof Error ? e.message : "Sign-in failed. Try again.");
            } finally { setBusy(false); }
          }}
          onError={() => setError("Google sign-in was closed or blocked. Try again.")}
          text="continue_with"
          shape="pill"
          size="large"
          width="300"
        />
      </div>
      {error && <p role="alert" className="text-sm text-danger">{error}</p>}
    </div>
  );
}
