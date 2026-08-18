import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type A11yState = {
  scale: number;
  setScale: (n: number) => void;
  contrast: boolean;
  toggleContrast: () => void;
  calm: boolean;
  toggleCalm: () => void;
  speech: boolean;
  toggleSpeech: () => void;
  say: (text: string) => void;
};

const A11yContext = createContext<A11yState | null>(null);

const STORAGE_KEY = "kalakriti-a11y";

export function A11yProvider({ children }: { children: ReactNode }) {
  const [scale, setScale] = useState(1);
  const [contrast, setContrast] = useState(false);
  const [calm, setCalm] = useState(false);
  const [speech, setSpeech] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const saved = JSON.parse(raw) as Partial<{
        scale: number;
        contrast: boolean;
        calm: boolean;
        speech: boolean;
      }>;
      if (typeof saved.scale === "number") setScale(saved.scale);
      if (typeof saved.contrast === "boolean") setContrast(saved.contrast);
      if (typeof saved.calm === "boolean") setCalm(saved.calm);
      if (typeof saved.speech === "boolean") setSpeech(saved.speech);
    } catch {
      /* first visit */
    }
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--a11y-scale", String(scale));
    root.classList.toggle("contrast-max", contrast);
    root.classList.toggle("calm-motion", calm);
    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ scale, contrast, calm, speech }),
      );
    } catch {
      /* storage blocked */
    }
  }, [scale, contrast, calm, speech]);

  const say = useCallback(
    (text: string) => {
      if (!speech || typeof window === "undefined" || !("speechSynthesis" in window)) return;
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.92;
      window.speechSynthesis.speak(utterance);
    },
    [speech],
  );

  const value = useMemo<A11yState>(
    () => ({
      scale,
      setScale,
      contrast,
      toggleContrast: () => setContrast((v) => !v),
      calm,
      toggleCalm: () => setCalm((v) => !v),
      speech,
      toggleSpeech: () =>
        setSpeech((v) => {
          if (v && typeof window !== "undefined" && "speechSynthesis" in window) {
            window.speechSynthesis.cancel();
          }
          return !v;
        }),
      say,
    }),
    [scale, contrast, calm, speech, say],
  );

  return <A11yContext.Provider value={value}>{children}</A11yContext.Provider>;
}

export function useA11y() {
  const ctx = useContext(A11yContext);
  if (!ctx) throw new Error("useA11y must be used inside A11yProvider");
  return ctx;
}

/** Reads text aloud on hover/focus when read-aloud mode is on. */
export function useSpeakable(text: string) {
  const { say } = useA11y();
  return {
    onMouseEnter: () => say(text),
    onFocus: () => say(text),
  };
}
