import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import {
  Camera,
  Check,
  IndianRupee,
  Languages,
  Loader2,
  Mic,
  RefreshCcw,
  Sparkles,
  Upload,
} from "lucide-react";
import { toast } from "sonner";
import pottery from "@/assets/craft-pottery.jpg";
import { useA11y, useSpeakable } from "@/components/a11y";

export const Route = createFileRoute("/upload")({
  head: () => ({
    meta: [
      { title: "Photograph a Craft — Kalakriti Artisan Studio" },
      {
        name: "description",
        content:
          "Take one photo of your handmade craft and let AI write the description, suggest a price and translate the listing.",
      },
      { property: "og:title", content: "Photograph a Craft — Kalakriti" },
      {
        property: "og:description",
        content: "One photo in, a full multilingual listing out. No typing required.",
      },
    ],
  }),
  component: UploadPage;
});

const AI_STEPS = [
  "Looking at your photo",
  "Recognising the craft and material",
  "Writing the story in your voice",
  "Comparing fair prices",
  "Translating for buyers abroad",
];

type Phase = "capture" | "thinking" | "result";

function StepBadge({ n, title, hint }: { n: number; title: string; hint: string }) {
  return (
    <div className="flex min-w-0 items-start gap-4">
      <span
        className="grid size-12 shrink-0 place-items-center rounded-full bg-vermillion font-display text-xl font-black text-vermillion-foreground"
        aria-hidden="true"
      >
        {n}
      </span>
      <div className="min-w-0">
        <h2 className="font-display text-2xl font-bold">{title}</h2>
        <p className="text-muted-foreground">{hint}</p>
      </div>
    </div>
  );
}

function UploadPage() {
  const { say } = useA11y();
  const [phase, setPhase] = useState<Phase>("capture");
  const [stepIndex, setStepIndex] = useState(0);
  const [preview, setPreview] = useState<string | null>(null);
  const [price, setPrice] = useState(2650);
  const fileRef = useRef<HTMLInputElement>(null);

  const captureSpeak = useSpeakable(
    "Take a photo of your craft. One picture is enough, blurry is fine.",
  );

  useEffect(() => {
    if (phase !== "thinking") return;
    setStepIndex(0);
    const timer = window.setInterval(() => {
      setStepIndex((i) => {
        if (i >= AI_STEPS.length - 1) {
          window.clearInterval(timer);
          setPhase("result");
          say("Your listing is ready. Please check it and say yes.");
          return i;
        }
        return i + 1;
      });
    }, 900);
    return () => window.clearInterval(timer);
  }, [phase, say]);

  function startWithFile(file?: File) {
    if (file) setPreview(URL.createObjectURL(file));
    else setPreview(pottery);
    setPhase("thinking");
    say("Photo received. The studio is writing your listing now.");
  }

  return (
    <section className="mx-auto max-w-5xl px-4 py-14">
      <p className="font-accent text-xl text-vermillion">Naya Kaam</p>
      <h1 className="font-display text-4xl font-black sm:text-5xl">Add a craft in one photo</h1>
      <p className="mt-2 max-w-2xl text-muted-foreground">
        You never have to type. Take a picture, listen to what the studio wrote, then say yes or ask
        for a change.
      </p>

      <div className="mt-10 grid gap-8">
        {/* Step 1 — capture */}
        <div className="rounded-3xl bg-card p-6 zari-border sm:p-8">
          <StepBadge n={1} title="Show us the craft" hint="One photo. Crooked or dim is fine." />

          <div className="mt-6 grid gap-6 md:grid-cols-[1fr_1fr]">
            <div
              {...captureSpeak}
              className="grid aspect-square place-items-center overflow-hidden rounded-2xl border-4 border-dashed border-border bg-secondary"
            >
              {preview ? (
                <img
                  src={preview}
                  alt="The craft you just photographed"
                  className="size-full object-cover"
                />
              ) : (
                <p className="px-6 text-center font-display text-xl text-muted-foreground">
                  Your photo will appear here, big and clear
                </p>
              )}
            </div>

            <div className="grid content-start gap-4">
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                capture="environment"
                className="sr-only"
                aria-label="Choose or take a photo of your craft"
                onChange={(e) => startWithFile(e.target.files?.[0])}
              />
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="inline-flex min-h-20 items-center justify-center gap-3 rounded-2xl bg-marigold px-6 font-display text-2xl font-bold text-marigold-foreground block-shadow"
              >
                <Camera className="size-8 shrink-0" aria-hidden="true" />
                Take photo
              </button>
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="inline-flex min-h-16 items-center justify-center gap-3 rounded-2xl border-3 border-input px-6 font-display text-xl font-bold hover:bg-secondary"
              >
                <Upload className="size-6 shrink-0" aria-hidden="true" />
                Pick from phone
              </button>
              <button
                type="button"
                onClick={() => {
                  toast("Listening… say the name of your craft in any language.");
                  say("Listening. Say the name of your craft in any language.");
                }}
                className="inline-flex min-h-16 items-center justify-center gap-3 rounded-2xl border-3 border-input px-6 font-display text-xl font-bold hover:bg-secondary"
              >
                <Mic className="size-6 shrink-0" aria-hidden="true" />
                Speak instead
              </button>
              <button
                type="button"
                onClick={() => startWithFile()}
                className="min-h-12 text-left font-semibold text-primary underline underline-offset-4"
              >
                No camera right now? Try it with a sample craft
              </button>
            </div>
          </div>
        </div>

        {/* Step 2 — AI working */}
        {phase !== "capture" && (
          <div className="rounded-3xl jewel-surface p-6 sm:p-8">
            <div className="flex min-w-0 items-start gap-4">
              <span
                className="grid size-12 shrink-0 place-items-center rounded-full bg-marigold text-marigold-foreground"
                aria-hidden="true"
              >
                <Sparkles className="size-6" />
              </span>
              <div className="min-w-0">
                <h2 className="font-display text-2xl font-bold">The studio is working</h2>
                <p className="opacity-85">No hurry. Nothing is published without your yes.</p>
              </div>
            </div>

            <ol className="mt-6 grid gap-3" aria-live="polite">
              {AI_STEPS.map((step, i) => {
                const done = phase === "result" || i < stepIndex;
                const active = phase === "thinking" && i === stepIndex;
                return (
                  <li key={step} className="flex items-center gap-3 text-lg">
                    <span
                      className={`grid size-9 shrink-0 place-items-center rounded-full ${
                        done ? "bg-marigold text-marigold-foreground" : "bg-white/15"
                      }`}
                      aria-hidden="true"
                    >
                      {done ? (
                        <Check className="size-5" />
                      ) : active ? (
                        <Loader2 className="size-5 animate-spin" />
                      ) : (
                        <span className="size-2 rounded-full bg-white/60" />
                      )}
                    </span>
                    <span className={done || active ? "font-semibold" : "opacity-70"}>{step}</span>
                  </li>
                );
              })}
            </ol>
          </div>
        )}

        {/* Step 3 — result */}
        {phase === "result" && (
          <div className="rounded-3xl bg-card p-6 zari-border sm:p-8">
            <StepBadge
              n={2}
              title="Here is what we wrote"
              hint="Read it, or press listen. Change anything you like."
            />

            <div className="mt-6 grid gap-6">
              <div className="rounded-2xl bg-secondary p-5">
                <p className="text-xs font-bold tracking-[0.2em] text-muted-foreground uppercase">
                  Craft name
                </p>
                <p className="mt-1 font-display text-3xl font-black">Jaipur Blue Pottery Vase</p>
                <p className="mt-4 text-lg">
                  A hand-thrown vase glazed in the cobalt and turquoise palette that Jaipur potters
                  have used for four centuries. Quartz-based clay, fired low and slow, painted
                  freehand with flowering vines — no two pieces repeat. Wipe with a dry cloth.
                </p>
                <button
                  type="button"
                  onClick={() =>
                    say(
                      "Jaipur Blue Pottery Vase. A hand thrown vase glazed in the cobalt and turquoise palette that Jaipur potters have used for four centuries.",
                    )
                  }
                  className="mt-4 inline-flex min-h-12 items-center gap-2 rounded-full border-2 border-input bg-card px-5 font-semibold hover:bg-background"
                >
                  <Mic className="size-5 shrink-0" aria-hidden="true" />
                  Listen to this
                </button>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="rounded-2xl bg-secondary p-5">
                  <p className="flex items-center gap-2 text-xs font-bold tracking-[0.2em] text-muted-foreground uppercase">
                    <IndianRupee className="size-4 shrink-0" aria-hidden="true" />
                    Suggested price
                  </p>
                  <p className="mt-1 font-display text-5xl font-black text-temple">
                    ₹{price.toLocaleString()}
                  </p>
                  <p className="mt-2 text-muted-foreground">
                    Similar hand-painted vases sold between ₹2,300 and ₹2,900 this month. Your glaze
                    work is finer, so we aimed a little higher.
                  </p>
                  <label
                    htmlFor="price"
                    className="mt-4 block font-semibold"
                  >
                    Change the price yourself
                  </label>
                  <input
                    id="price"
                    type="range"
                    min={1500}
                    max={4000}
                    step={50}
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="mt-2 h-3 w-full accent-vermillion"
                  />
                </div>

                <div className="rounded-2xl bg-secondary p-5">
                  <p className="flex items-center gap-2 text-xs font-bold tracking-[0.2em] text-muted-foreground uppercase">
                    <Languages className="size-4 shrink-0" aria-hidden="true" />
                    Translated for buyers
                  </p>
                  <ul className="mt-3 grid gap-2 text-lg">
                    <li>English · Blue Pottery Vase</li>
                    <li>हिन्दी · नीली मिट्टी का फूलदान</li>
                    <li>Français · Vase en céramique bleue</li>
                    <li>日本語 · ブルーポタリーの花瓶</li>
                  </ul>
                  <p className="mt-3 text-sm text-muted-foreground">
                    The craft's own name stays untranslated, so buyers learn it.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-4">
                <button
                  type="button"
                  onClick={() => {
                    toast.success("Listing published in 4 languages.");
                    say("Your craft is now live for buyers.");
                  }}
                  className="inline-flex min-h-16 items-center gap-3 rounded-full bg-primary px-8 font-display text-xl font-bold text-primary-foreground hover:bg-indigo-deep"
                >
                  <Check className="size-6 shrink-0" aria-hidden="true" />
                  Yes, put it up for sale
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setPhase("thinking");
                    toast("Writing it again, in a warmer tone.");
                  }}
                  className="inline-flex min-h-16 items-center gap-3 rounded-full border-3 border-input px-8 font-display text-xl font-bold hover:bg-secondary"
                >
                  <RefreshCcw className="size-6 shrink-0" aria-hidden="true" />
                  Write it differently
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
