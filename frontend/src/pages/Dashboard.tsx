import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { Avatar } from "../components/AppShell";
import { ToolList } from "../components/Tools";

function greeting() {
  const h = new Date().getHours();
  return h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening";
}

export default function Dashboard() {
  const { user } = useAuth();
  if (!user) return null;
  const first = user.name.split(" ")[0];
  const yearLabel = user.year_of_study ? `Year ${user.year_of_study}` : null;

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_20rem]">
      <div>
        <p className="text-ink-muted">{greeting()}</p>
        <h1 className="mt-1 font-display text-3xl font-bold tracking-tight text-teal sm:text-4xl">Welcome back, {first}</h1>

        {!user.profile_complete && (
          <div className="mt-8 flex flex-col gap-4 rounded-3xl bg-sun-soft p-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-display font-semibold text-ink">Tell us what you study</h2>
              <p className="mt-1 text-sm text-ink/75">Add your college, course and interests so we can suggest the right skills for you.</p>
            </div>
            <Link to="/profile" className="btn-primary shrink-0">Complete your profile</Link>
          </div>
        )}

        <h2 className="mb-4 mt-12 font-display text-xl font-semibold text-ink">Your tools</h2>
        <ToolList compact />
      </div>

      <aside className="h-fit rounded-3xl bg-white p-6 ring-1 ring-teal-line">
        <div className="flex items-center gap-3">
          <Avatar name={user.name} picture={user.picture} size={48} />
          <div className="min-w-0">
            <p className="truncate font-display font-semibold">{user.name}</p>
            <p className="truncate text-sm text-ink-muted">{user.email}</p>
          </div>
        </div>
        <dl className="mt-6 space-y-3 text-sm">
          <div className="flex justify-between gap-4"><dt className="text-ink-muted">College</dt><dd className="text-right font-semibold">{user.college ?? "Not added"}</dd></div>
          <div className="flex justify-between gap-4"><dt className="text-ink-muted">Course</dt><dd className="text-right font-semibold">{user.course ?? "Not added"}</dd></div>
          <div className="flex justify-between gap-4"><dt className="text-ink-muted">Year</dt><dd className="text-right font-semibold">{yearLabel ?? "Not added"}</dd></div>
        </dl>
        <div className="mt-6">
          <p className="mb-2 text-sm text-ink-muted">Interests</p>
          {user.interests.length ? (
            <ul className="flex flex-wrap gap-2">
              {user.interests.map((i) => <li key={i} className="rounded-full bg-teal-soft px-3 py-1 text-sm font-semibold text-teal">{i}</li>)}
            </ul>
          ) : (
            <p className="text-sm">No interests yet.</p>
          )}
        </div>
        <Link to="/profile" className="btn-ghost -ml-3 mt-5">Edit profile</Link>
      </aside>
    </div>
  );
}
