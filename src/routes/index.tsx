import { createFileRoute, Link } from "@tanstack/react-router";
import { Camera, Ear, Hand, Languages, Sparkles, TrendingUp } from "lucide-react";
import heroPattern from "@/assets/hero-pattern.jpg";
import { CRAFTS, ORDERS } from "@/data/crafts";
import { useSpeakable } from "@/components/a11y";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Kalakriti Studio — Sell Your Craft, AI Does the Typing" },
      {
        name: "description",
        content:
          "An inclusive artisan dashboard: photograph a craft, and AI writes the listing, sets a fair price and translates it worldwide.",
      },
      { property: "og:title", content: "Kalakriti Studio — Sell Your Craft" },
      {
        property: "og:description",
        content: "Photograph your craft. AI writes, prices and translates the listing for you.",
      },
    ],
  }),
  component: Home,
});

function StatCard({ label, value, note }: { label: string; value: string; note: string }) {
  const speak = useSpeakable(`${label}: ${value}. ${note}`);
  return (
    <div
      {...speak}
      tabIndex={0}
      className="zari-border rounded-2xl bg-card p-5 block-shadow"
    >
      <p className="text-xs font-bold tracking-[0.2em] text-muted-foreground uppercase">{label}</p>
      <p className="mt-2 font-display text-4xl font-black text-foreground">{value}</p>
      <p className="mt-1 text-sm text-muted-foreground">{note}</p>
    </div>
  );
}

const HELPERS = [
  {
    icon: Camera,
    title: "One photo is enough",
    body: "Point the camera. Blurry or crooked is fine — the studio straightens, crops and cleans the background for you.",
  },
  {
    icon: Sparkles,
    title: "AI writes the words",
    body: "Craft name, story, materials, care notes and search keywords are written out. You only nod yes or say change it.",
  },
  {
    icon: TrendingUp,
    title: "A fair price, explained",
    body: "We compare similar handmade pieces and show why the price is suggested, in plain words and in big numbers.",
  },
  {
    icon: Languages,
    title: "Sold in seven languages",
    body: "Your listing is translated for buyers abroad, keeping the local name of your craft intact.",
  },
  {
    icon: Ear,
    title: "Speak or listen",
    body: "Record your answer in your own language instead of typing. Turn on read-aloud to hear every button.",
  },
  {
    icon: Hand,
    title: "Big, forgiving targets",
    body: "Every control is at least a thumb wide, nothing disappears on hover, and nothing is timed.",
  },
];

function Home() {
  const liveCount = CRAFTS.filter((c) => c.status === "live").length;
  const packing = ORDERS.filter((o) => o.stage === "packing").length;

  return (
    <>
      <section className="relative overflow-hidden bg-indigo-deep">
        <img
          src={heroPattern}
          alt=""
          aria-hidden="true"
          width={1600}
          height={912}
          className="absolute inset-0 size-full object-cover opacity-30"
        />
        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-16 lg:grid-cols-[1.15fr_0.85fr] lg:py-24">
          <div className="min-w-0">
            <p className="inline-flex items-center gap-2 rounded-full bg-marigold px-4 py-2 text-xs font-bold tracking-[0.22em] text-marigold-foreground uppercase">
              Namaste, Meera ji
            </p>
            <h1 className="mt-6 font-display text-5xl leading-[1.02] font-black text-primary-foreground sm:text-6xl lg:text-7xl">
              You make the craft.
              <span className="mt-2 block font-accent text-4xl text-marigold sm:text-5xl lg:text-6xl">
                We make the listing.
              </span>
            </h1>
            <p className="mt-6 max-w-xl text-lg text-primary-foreground/85">
              Take one picture of your piece. Kalakriti writes the description, suggests a fair
              price, translates it for buyers around the world, and reads everything back to you
              aloud.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/upload"
                className="inline-flex min-h-16 items-center gap-3 rounded-full bg-marigold px-8 font-display text-xl font-bold text-marigold-foreground transition-transform hover:-translate-y-0.5 block-shadow"
              >
                <Camera className="size-7 shrink-0" aria-hidden="true" />
                Photograph a craft
              </Link>
              <Link
                to="/orders"
                className="inline-flex min-h-16 items-center rounded-full border-3 border-marigold px-8 font-display text-xl font-bold text-primary-foreground transition-colors hover:bg-marigold/15"
              >
                See {packing} order to pack
              </Link>
            </div>
          </div>

          <div className="relative grid gap-4 self-center sm:grid-cols-2 lg:grid-cols-1">
            <div className="marigold-surface rounded-3xl arch-top p-6 zari-border">
              <p className="font-accent text-xl">Today at your stall</p>
              <p className="mt-2 font-display text-5xl font-black">₹8,050</p>
              <p className="text-sm font-semibold">3 buyers from 3 countries</p>
            </div>
            <div className="rounded-3xl bg-card p-6 zari-border">
              <p className="text-xs font-bold tracking-[0.2em] text-muted-foreground uppercase">
                Listings live
              </p>
              <p className="mt-1 font-display text-4xl font-black">{liveCount}</p>
              <p className="text-sm text-muted-foreground">
                All written and translated by the studio.
              </p>
            </div>
          </div>
        </div>
        <div className="kolam-rule" aria-hidden="true" />
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14" aria-labelledby="numbers">
        <h2 id="numbers" className="font-display text-3xl font-black sm:text-4xl">
          Your week, in plain numbers
        </h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Visitors" value="3,995" note="People who looked at your crafts" />
          <StatCard label="Orders" value="3" note="One still needs packing" />
          <StatCard label="Earned" value="₹10,500" note="Money already in your account" />
          <StatCard label="Countries" value="7" note="Where your crafts travelled" />
        </div>
      </section>

      <section className="bg-secondary py-16" aria-labelledby="how">
        <div className="mx-auto max-w-7xl px-4">
          <p className="font-accent text-xl text-vermillion">Built inclusive, from the first line</p>
          <h2 id="how" className="mt-2 max-w-2xl font-display text-3xl font-black sm:text-5xl">
            Nothing here assumes you can see, hear, type or read fast
          </h2>
          <ul className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {HELPERS.map((h) => {
              const Icon = h.icon;
              return (
                <li
                  key={h.title}
                  className="rounded-3xl bg-card p-6 zari-border transition-transform hover:-translate-y-1"
                >
                  <span
                    className="grid size-14 place-items-center rounded-2xl bg-vermillion text-vermillion-foreground"
                    aria-hidden="true"
                  >
                    <Icon className="size-7" />
                  </span>
                  <h3 className="mt-4 font-display text-2xl font-bold">{h.title}</h3>
                  <p className="mt-2 text-muted-foreground">{h.body}</p>
                </li>
              );
            })}
          </ul>
        </div>
      </section>
    </>
  );
}
