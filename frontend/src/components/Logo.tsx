import { useId } from "react";

type Props = { className?: string; mono?: boolean; onDark?: boolean; title?: string };

/** The Sunrise T mark: a bold T crossing a rising sun. */
export function LogoMark({ className = "h-9 w-9", mono = false, onDark = false, title }: Props) {
  const id = useId().replace(/:/g, "");
  const t = onDark ? "#FFFFFF" : "#025049";
  const sun = mono ? t : "#FEB803";
  return (
    <svg viewBox="40 52 432 434" className={className} role={title ? "img" : undefined} aria-hidden={title ? undefined : true}>
      {title && <title>{title}</title>}
      <mask id={`m${id}`}>
        <rect width="512" height="512" fill="#fff" />
        <path d="M40 134H472V252H316V486H196V252H40Z" fill="#000" />
      </mask>
      <circle cx="256" cy="236" r="168" fill={sun} mask={`url(#m${id})`} />
      <rect x="56" y="150" width="400" height="86" rx="24" fill={t} />
      <rect x="212" y="150" width="88" height="320" rx="24" fill={t} />
    </svg>
  );
}

export function Wordmark({ onDark = false, className = "" }: { onDark?: boolean; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <LogoMark className="h-8 w-8" onDark={onDark} />
      <span className={`font-display text-xl font-bold tracking-tight ${onDark ? "text-white" : "text-teal"}`}>
        Aikya<span className={onDark ? "text-sun" : "text-ink"}>Thiran</span>
      </span>
    </span>
  );
}
