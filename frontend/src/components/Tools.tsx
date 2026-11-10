type Tool = { name: string; what: string; icon: JSX.Element };

const iconCls = "h-6 w-6";
export const TOOLS: Tool[] = [
  {
    name: "Thiran Skills",
    what: "Skill tracks for coding, AI and design. Learn step by step and see your progress.",
    icon: (
      <svg viewBox="0 0 24 24" className={iconCls} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="m8 8-4 4 4 4M16 8l4 4-4 4M13.5 5l-3 14" />
      </svg>
    ),
  },
  {
    name: "Thiran Paath",
    what: "Your AI study helper. Ask doubts, make notes and plan your exam week.",
    icon: (
      <svg viewBox="0 0 24 24" className={iconCls} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5zM4 20.5A2.5 2.5 0 0 0 6.5 23H20v-5" />
      </svg>
    ),
  },
  {
    name: "Aikyam",
    what: "Groups and discussions with students who learn the same things as you.",
    icon: (
      <svg viewBox="0 0 24 24" className={iconCls} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <circle cx="9" cy="8" r="3.5" /><path d="M2.5 20a6.5 6.5 0 0 1 13 0M16 4.6a3.5 3.5 0 0 1 0 6.8M18 14.2a6.5 6.5 0 0 1 3.5 5.8" />
      </svg>
    ),
  },
];

export function SoonPill() {
  return <span className="whitespace-nowrap rounded-full bg-sun-soft px-3 py-1 text-xs font-bold text-sun-text">Opening soon</span>;
}

export function ToolList({ compact = false }: { compact?: boolean }) {
  return (
    <ul className="divide-y divide-teal-line/70 border-y border-teal-line/70">
      {TOOLS.map((t) => (
        <li key={t.name} className={`flex items-start gap-4 ${compact ? "py-5" : "py-7"}`}>
          <span className="mt-0.5 grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-teal-soft text-teal">{t.icon}</span>
          <div className="min-w-0 flex-1 sm:flex sm:items-baseline sm:gap-8">
            <h3 className={`font-display font-semibold text-ink sm:w-44 sm:shrink-0 ${compact ? "text-base" : "text-lg"}`}>{t.name}</h3>
            <p className="mt-1 max-w-prose text-ink-muted sm:mt-0">{t.what}</p>
          </div>
          <SoonPill />
        </li>
      ))}
    </ul>
  );
}
