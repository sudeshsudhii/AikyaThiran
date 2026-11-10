import { GoogleOAuthProvider } from "@react-oauth/google";
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { api, ApiError, type ProfileUpdate, type User } from "../lib/api";

type Status = "loading" | "signed-in" | "signed-out";

type AuthValue = {
  status: Status;
  user: User | null;
  googleClientId: string;
  backendDown: boolean;
  signInWithGoogle: (credential: string) => Promise<User>;
  signOut: () => Promise<void>;
  updateProfile: (body: ProfileUpdate) => Promise<User>;
};

const AuthContext = createContext<AuthValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<Status>("loading");
  const [user, setUser] = useState<User | null>(null);
  const [googleClientId, setGoogleClientId] = useState(import.meta.env.VITE_GOOGLE_CLIENT_ID ?? "");
  const [backendDown, setBackendDown] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const cfg = await api.config();
        if (!cancelled && cfg.google_client_id) setGoogleClientId(cfg.google_client_id);
      } catch {
        if (!cancelled) setBackendDown(true);
      }
      try {
        const me = await api.me();
        if (!cancelled) { setUser(me); setStatus("signed-in"); }
      } catch (err) {
        if (!cancelled) {
          if (!(err instanceof ApiError)) setBackendDown(true);
          setStatus("signed-out");
        }
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const signInWithGoogle = useCallback(async (credential: string) => {
    const u = await api.loginWithGoogle(credential);
    setUser(u);
    setStatus("signed-in");
    return u;
  }, []);

  const signOut = useCallback(async () => {
    try { await api.logout(); } finally { setUser(null); setStatus("signed-out"); }
  }, []);

  const updateProfile = useCallback(async (body: ProfileUpdate) => {
    const u = await api.updateProfile(body);
    setUser(u);
    return u;
  }, []);

  const value = useMemo(
    () => ({ status, user, googleClientId, backendDown, signInWithGoogle, signOut, updateProfile }),
    [status, user, googleClientId, backendDown, signInWithGoogle, signOut, updateProfile],
  );

  const content = <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
  // The Google script only loads when a client id exists.
  return googleClientId ? <GoogleOAuthProvider clientId={googleClientId}>{content}</GoogleOAuthProvider> : content;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
