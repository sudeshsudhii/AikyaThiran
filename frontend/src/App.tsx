import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "./auth/AuthContext";
import { AppShell } from "./components/AppShell";
import { FullPageLoader, RequireAuth } from "./components/RequireAuth";
import Dashboard from "./pages/Dashboard";
import Landing from "./pages/Landing";
import NotFound from "./pages/NotFound";
import Profile from "./pages/Profile";

function Home() {
  const { status } = useAuth();
  if (status === "loading") return <FullPageLoader />;
  if (status === "signed-in") return <Navigate to="/dashboard" replace />;
  return <Landing />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/dashboard" element={<RequireAuth><AppShell><Dashboard /></AppShell></RequireAuth>} />
      <Route path="/profile" element={<RequireAuth><AppShell><Profile /></AppShell></RequireAuth>} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
