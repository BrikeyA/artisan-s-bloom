import { Contrast, Ear, Minus, Plus, Snowflake, Type } from "lucide-react";
import { useA11y } from "./a11y";

function Pill({
  active,
  label,
  onClick,
  children,
}: {
  active?: boolean;
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      aria-label={label}
      className={`inline-flex min-h-11 items-center gap-2 rounded-full border-2 border-primary-foreground/40 px-4 text-sm font-semibold transition-colors ${
        active
          ? "bg-marigold text-marigold-foreground"
          : "bg-transparent text-primary-foreground hover:bg-primary-foreground/15"
      }`}
    >
      {children}
    </button>
  );
}

export function AccessibilityBar() {
  const { scale, setScale, contrast, toggleContrast, calm, toggleCalm, speech, toggleSpeech } =
    useA11y();

  return (
    <div className="bg-indigo-deep text-primary-foreground">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-2 px-4 py-2 sm:gap-3">
        <span className="mr-1 flex items-center gap-2 text-xs font-bold tracking-[0.22em] uppercase">
          <Type className="size-4 shrink-0" aria-hidden="true" />
          Comfort
        </span>

        <div
          className="flex items-center gap-1 rounded-full border-2 border-primary-foreground/40 p-1"
          role="group"
          aria-label="Text size"
        >
          <button
            type="button"
            aria-label="Make text smaller"
            onClick={() => setScale(Math.max(0.9, Number((scale - 0.1).toFixed(2))))}
            className="grid size-9 place-items-center rounded-full hover:bg-primary-foreground/15"
          >
            <Minus className="size-4" aria-hidden="true" />
          </button>
          <span className="min-w-14 text-center text-sm font-semibold" aria-live="polite">
            {Math.round(scale * 100)}%
          </span>
          <button
            type="button"
            aria-label="Make text bigger"
            onClick={() => setScale(Math.min(1.6, Number((scale + 0.1).toFixed(2))))}
            className="grid size-9 place-items-center rounded-full hover:bg-primary-foreground/15"
          >
            <Plus className="size-4" aria-hidden="true" />
          </button>
        </div>

        <Pill active={contrast} label="High contrast mode" onClick={toggleContrast}>
          <Contrast className="size-4 shrink-0" aria-hidden="true" />
          <span className="hidden sm:inline">High contrast</span>
        </Pill>
        <Pill active={calm} label="Reduce motion" onClick={toggleCalm}>
          <Snowflake className="size-4 shrink-0" aria-hidden="true" />
          <span className="hidden sm:inline">Calm motion</span>
        </Pill>
        <Pill active={speech} label="Read aloud what I point at" onClick={toggleSpeech}>
          <Ear className="size-4 shrink-0" aria-hidden="true" />
          <span className="hidden sm:inline">Read aloud</span>
        </Pill>
      </div>
    </div>
  );
}
