import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import {
  Camera,
  Check,
  IndianRupee,
  Languages,
  Loader2,
  Mic,
  MicOff,
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
  component: UploadPage,
});

const AI_STEPS = [
  "Looking at your photo & voice description",
  "Recognising the craft and material",
  "Writing the story in your voice",
  "Comparing fair prices",
  "Translating for buyers abroad",
];

type Phase = "capture" | "prompt_speech" | "listening" | "thinking" | "result";

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
  const [transcript, setTranscript] = useState<string>("");
  const [isListening, setIsListening] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);

  const captureSpeak = useSpeakable(
    "Take a photo of your craft. One picture is enough, blurry is fine.",
  );

  // Initialize Speech Recognition on mount
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = "en-IN"; // Supports Hindi ('hi-IN') or regional dialects if needed

      recognition.onresult = (event: any) => {
        let currentTranscript = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        setTranscript(currentTranscript);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error);
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  // Handle AI step progression
  useEffect(() => {
    if (phase !== "thinking") return;
    setStepIndex(0);
    const timer = window.setInterval(() => {
      setStepIndex((i) => {
        if (i >= AI_STEPS.length - 1) {
          window.clearInterval(timer);
          setPhase("result");
          say("Your listing is ready based on your photo and spoken words.");
          return i;
        }
        return i + 1;
      });
    }, 900);
    return () => window.clearInterval(timer);
  }, [phase, say]);

  // Step 1: Triggered when image is captured
  function handleImageCapture(file?: File) {
    if (file) setPreview(URL.createObjectURL(file));
    else setPreview(pottery);

    setPhase("prompt_speech");
    const promptText = "Photo uploaded! Now, press the mic and tell us about your craft in any language.";
    say(promptText);
    toast.info("Please tell us about your craft using your voice.");
  }

  // Step 2: Start capturing speech
  function startListening() {
    if (!recognitionRef.current) {
      toast.error("Speech recognition is not supported in this browser.");
      processWithSpeech("Handmade artisan pottery vase"); // Fallback
      return;
    }

    setTranscript("");
    setIsListening(true);
    setPhase("listening");
    say("Listening now. Speak clearly.");

    try {
      recognitionRef.current.start();
    } catch (err) {
      console.warn("Recognition start failed:", err);
    }
  }

  // Step 3: Stop speech and trigger AI generation
  function stopListeningAndGenerate() {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
    processWithSpeech(transcript || "Handmade pottery item");
  }

  // Step 4: Advance to AI processing
  function processWithSpeech(userSpeech: string) {
    setPhase("thinking");
    say(`Thank you. Generating your listing based on: ${userSpeech}`);
  }

  return (
    <section className="mx-auto max-w-5xl px-4 py-14">
      <p className="font-accent text-xl text-vermillion">Naya Kaam</p>
      <h1 className="font-display text-4xl font-black sm:text-5xl">Add a craft in one photo</h1>
      <p className="mt-2 max-w-2xl text-muted-foreground">
        You never have to type. Take a picture, speak a few words, and let the studio create your listing.
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
                onChange={(e) => handleImageCapture(e.target.files?.[0])}
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
                onClick={() => handleImageCapture()}
                className="min-h-12 text-left font-semibold text-primary underline underline-offset-4"
              >
                No camera right now? Try it with a sample craft
              </button>
            </div>
          </div>
        </div>

        {/* Step 2 — Voice Prompt after photo selection */}
        {(phase === "prompt_speech" || phase === "listening") && (
          <div className="rounded-3xl bg-card p-6 zari-border sm:p-8 animate-in fade-in duration-300">
            <StepBadge
              n={2}
              title="Tell us about this item"
              hint="Press speak and say what it is, how it was made, or what material was used."
            />

            <div className="mt-6 grid gap-6">
              <div className="rounded-2xl bg-secondary p-6 text-center">
                {isListening ? (
                  <div className="flex flex-col items-center gap-3">
                    <span className="relative flex size-12">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-vermillion opacity-75"></span>
                      <span className="relative inline-flex size-12 items-center justify-center rounded-full bg-vermillion text-white">
                        <Mic className="size-6" />
                      </span>
                    </span>
                    <p className="font-display text-xl font-bold text-vermillion">Listening to you...</p>
                    <p className="min-h-12 rounded-xl bg-background p-4 text-lg italic text-foreground w-full">
                      "{transcript || "Start speaking now..."}"
                    </p>
                  </div>
                ) : (
                  <p className="text-lg text-muted-foreground">
                    Click below and say something like: <i>"Blue pottery vase made with natural clay and hand-painted."</i>
                  </p>
                )}
              </div>

              <div className="flex flex-wrap gap-4">
                {!isListening ? (
                  <button
                    type="button"
                    onClick={startListening}
                    className="inline-flex min-h-16 items-center gap-3 rounded-2xl bg-vermillion px-8 font-display text-xl font-bold text-vermillion-foreground block-shadow"
                  >
                    <Mic className="size-7 shrink-0" aria-hidden="true" />
                    Press to Speak
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={stopListeningAndGenerate}
                    className="inline-flex min-h-16 items-center gap-3 rounded-2xl bg-primary px-8 font-display text-xl font-bold text-primary-foreground hover:bg-indigo-deep"
                  >
                    <Check className="size-7 shrink-0" aria-hidden="true" />
                    Done Speaking — Generate Listing
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => processWithSpeech("Handmade artisan item")}
                  className="inline-flex min-h-16 items-center gap-3 rounded-2xl border-3 border-input px-6 font-display text-lg font-bold hover:bg-secondary"
                >
                  Skip Voice — Use Image Only
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 3 — AI working */}
        {phase === "thinking" && (
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
                <p className="opacity-85">Processing image & speech description...</p>
              </div>
            </div>

            <ol className="mt-6 grid gap-3" aria-live="polite">
              {AI_STEPS.map((step, i) => {
                const done = i < stepIndex;
                const active = i === stepIndex;
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

        {/* Step 4 — Result */}
        {phase === "result" && (
          <div className="rounded-3xl bg-card p-6 zari-border sm:p-8">
            <StepBadge
              n={3}
              title="Here is what we wrote"
              hint="Read it, or press listen. Change anything you like."
            />

            <div className="mt-6 grid gap-6">
              <div className="rounded-2xl bg-secondary p-5">
                <p className="text-xs font-bold tracking-[0.2em] text-muted-foreground uppercase">
                  Craft name
                </p>
                <p className="mt-1 font-display text-3xl font-black">Jaipur Blue Pottery Vase</p>
                
                {transcript && (
                  <p className="mt-2 text-sm font-semibold text-vermillion">
                    Voice Note Incorporated: "{transcript}"
                  </p>
                )}

                <p className="mt-3 text-lg">
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
                    Similar hand-painted vases sold between ₹2,300 and ₹2,900 this month.
                  </p>
                  <label htmlFor="price" className="mt-4 block font-semibold">
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
                    setPhase("prompt_speech");
                  }}
                  className="inline-flex min-h-16 items-center gap-3 rounded-full border-3 border-input px-8 font-display text-xl font-bold hover:bg-secondary"
                >
                  <RefreshCcw className="size-6 shrink-0" aria-hidden="true" />
                  Speak again / Record new voice note
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}