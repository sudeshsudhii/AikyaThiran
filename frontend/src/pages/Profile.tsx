import { useState, type FormEvent, type KeyboardEvent } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { Toast } from "../components/Toast";

const SUGGESTED = ["AI & ML", "Web development", "Data science", "UI/UX design", "Cloud", "Cybersecurity", "App development", "DSA"];
const MAX_INTERESTS = 20;

export default function Profile() {
  const { user, updateProfile } = useAuth();
  const [params] = useSearchParams();
  const welcome = params.get("welcome") === "1";
  const navigate = useNavigate();

  const [name, setName] = useState(user?.name ?? "");
  const [college, setCollege] = useState(user?.college ?? "");
  const [course, setCourse] = useState(user?.course ?? "");
  const [year, setYear] = useState<string>(user?.year_of_study ? String(user.year_of_study) : "");
  const [interests, setInterests] = useState<string[]>(user?.interests ?? []);
  const [draft, setDraft] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  if (!user) return null;

  const addInterest = (raw: string) => {
    const v = raw.trim().slice(0, 40);
    if (!v || interests.length >= MAX_INTERESTS) return;
    if (interests.some((i) => i.toLowerCase() === v.toLowerCase())) return;
    setInterests([...interests, v]);
  };
  const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") { e.preventDefault(); addInterest(draft); setDraft(""); }
    if (e.key === "Backspace" && !draft && interests.length) setInterests(interests.slice(0, -1));
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) { setError("Enter your name."); return; }
    setSaving(true); setError(null);
    try {
      const pending = draft.trim() ? [...interests, draft.trim()] : interests;
      await updateProfile({
        name: name.trim(), college: college.trim() || null, course: course.trim() || null,
        year_of_study: year ? Number(year) : null, interests: pending,
      });
      setDraft("");
      if (welcome) navigate("/dashboard", { replace: true });
      else setToast("Profile saved");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't save your profile. Try again.");
    } finally { setSaving(false); }
  };

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="font-display text-3xl font-bold tracking-tight text-teal">{welcome ? `Welcome, ${user.name.split(" ")[0]}` : "Your profile"}</h1>
      <p className="mt-2 text-ink-muted">
        {welcome ? "One quick step: tell us what you study, so we can suggest the right skills." : "This helps us suggest skills and groups that fit you."}
      </p>

      <form onSubmit={onSubmit} className="mt-8 space-y-6 rounded-3xl bg-white p-6 ring-1 ring-teal-line sm:p-8" noValidate>
        <div>
          <label htmlFor="name" className="label">Full name</label>
          <input id="name" className="field" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" required />
        </div>
        <div>
          <label htmlFor="email" className="label">Email</label>
          <input id="email" className="field bg-paper text-ink-muted" value={user.email} disabled />
          <p className="mt-1.5 text-xs text-ink-muted">From your Google account.</p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="college" className="label">College</label>
            <input id="college" className="field" value={college} onChange={(e) => setCollege(e.target.value)} placeholder="e.g. SRM Institute of Science and Technology" />
          </div>
          <div>
            <label htmlFor="course" className="label">Course</label>
            <input id="course" className="field" value={course} onChange={(e) => setCourse(e.target.value)} placeholder="e.g. B.Tech Computer Science" />
          </div>
        </div>
        <div className="sm:w-1/2 sm:pr-3">
          <label htmlFor="year" className="label">Year of study</label>
          <select id="year" className="field" value={year} onChange={(e) => setYear(e.target.value)}>
            <option value="">Choose year</option>
            {[1, 2, 3, 4, 5, 6].map((y) => <option key={y} value={y}>Year {y}</option>)}
          </select>
        </div>

        <div>
          <label htmlFor="interest" className="label">Interests</label>
          <div className="field flex min-h-[3.25rem] flex-wrap items-center gap-2 py-2 focus-within:border-teal focus-within:ring-2 focus-within:ring-teal/20">
            {interests.map((i) => (
              <span key={i} className="inline-flex items-center gap-1 rounded-full bg-teal-soft py-1 pl-3 pr-1 text-sm font-semibold text-teal">
                {i}
                <button type="button" onClick={() => setInterests(interests.filter((x) => x !== i))}
                  className="grid h-6 w-6 place-items-center rounded-full hover:bg-teal hover:text-white" aria-label={`Remove ${i}`}>×</button>
              </span>
            ))}
            <input id="interest" value={draft} onChange={(e) => setDraft(e.target.value)} onKeyDown={onKey}
              placeholder={interests.length ? "Add more" : "Type and press Enter"} disabled={interests.length >= MAX_INTERESTS}
              className="min-w-[8rem] flex-1 bg-transparent py-1 focus:outline-none" />
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {SUGGESTED.filter((s) => !interests.includes(s)).map((s) => (
              <button key={s} type="button" onClick={() => addInterest(s)}
                className="rounded-full border border-dashed border-teal-line px-3 py-1 text-sm text-ink-muted hover:border-teal hover:text-teal">+ {s}</button>
            ))}
          </div>
        </div>

        {error && <p role="alert" className="text-sm text-danger">{error}</p>}
        <div className="flex items-center gap-3 pt-2">
          <button type="submit" className="btn-primary" disabled={saving}>{saving ? "Saving…" : "Save changes"}</button>
          {welcome && <button type="button" className="btn-ghost" onClick={() => navigate("/dashboard")}>Skip for now</button>}
        </div>
      </form>
      <Toast message={toast} onDone={() => setToast(null)} />
    </div>
  );
}
