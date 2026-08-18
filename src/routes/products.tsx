import { createFileRoute, Link } from "@tanstack/react-router";
import { Camera, Eye, Languages, Sparkles } from "lucide-react";
import { CRAFTS, type Craft } from "@/data/crafts";
import { useSpeakable } from "@/components/a11y";

export const Route = createFileRoute("/products")({
  head: () => ({
    meta: [
      { title: "My Crafts — Kalakriti Artisan Studio" },
      {
        name: "description",
        content:
          "Every craft you have listed, with its AI-written listing, price, stock and translations in one accessible view.",
      },
      { property: "og:title", content: "My Crafts — Kalakriti Artisan Studio" },
      {
        property: "og:description",
        content: "Listings, prices, stock and translations for every craft you sell.",
      },
    ],
  }),
  component: Products,
});

const STATUS: Record<Craft["status"], { label: string; className: string }> = {
  live: { label: "Live for buyers", className: "bg-temple text-primary-foreground" },
  draft: { label: "Draft", className: "bg-muted text-foreground" },
  review: { label: "Waiting for your yes", className: "bg-marigold text-marigold-foreground" },
};

function CraftCard({ craft }: { craft: Craft }) {
  const speak = useSpeakable(
    `${craft.name}. ${craft.craftType}. Priced ${craft.price} rupees. ${
      craft.stock > 0 ? `${craft.stock} in stock` : "Out of stock"
    }. ${STATUS[craft.status].label}.`,
  );
  return (
    <article {...speak} tabIndex={0} className="overflow-hidden rounded-3xl bg-card zari-border">
      <div className="relative">
        <img
          src={craft.image}
          alt={craft.imageAlt}
          loading="lazy"
          width={800}
          height={800}
          className="aspect-square w-full object-cover"
        />
        <span
          className={`absolute top-3 left-3 rounded-full px-4 py-1.5 text-sm font-bold ${STATUS[craft.status].className}`}
        >
          {STATUS[craft.status].label}
        </span>
      </div>
      <div className="p-6">
        <p className="font-accent text-sm text-vermillion">{craft.craftType}</p>
        <h3 className="mt-1 font-display text-2xl font-bold">{craft.name}</h3>

        <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-xl bg-secondary p-3">
            <dt className="font-semibold text-muted-foreground">Your price</dt>
            <dd className="font-display text-2xl font-black">₹{craft.price.toLocaleString()}</dd>
          </div>
          <div className="rounded-xl bg-secondary p-3">
            <dt className="font-semibold text-muted-foreground">AI suggests</dt>
            <dd className="font-display text-2xl font-black text-temple">
              ₹{craft.suggestedPrice.toLocaleString()}
            </dd>
          </div>
        </dl>

        <p className="mt-4 flex flex-wrap items-center gap-2 text-sm">
          <Languages className="size-5 shrink-0 text-primary" aria-hidden="true" />
          {craft.languages.map((lang) => (
            <span key={lang} className="rounded-full bg-accent px-3 py-1 text-accent-foreground">
              {lang}
            </span>
          ))}
        </p>

        <p className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
          <Eye className="size-5 shrink-0" aria-hidden="true" />
          {craft.views.toLocaleString()} people looked at this
          <span aria-hidden="true">·</span>
          <span className={craft.stock === 0 ? "font-bold text-vermillion" : ""}>
            {craft.stock === 0 ? "Out of stock" : `${craft.stock} left`}
          </span>
        </p>

        <div className="mt-5 flex flex-wrap gap-3">
          <button
            type="button"
            className="inline-flex min-h-12 items-center gap-2 rounded-full bg-primary px-5 font-semibold text-primary-foreground hover:bg-indigo-deep"
          >
            <Sparkles className="size-5 shrink-0" aria-hidden="true" />
            Rewrite with AI
          </button>
          <button
            type="button"
            className="inline-flex min-h-12 items-center rounded-full border-2 border-input px-5 font-semibold hover:bg-secondary"
          >
            Edit details
          </button>
        </div>
      </div>
    </article>
  );
}

function Products() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-14">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4 sm:flex sm:justify-between">
        <div className="min-w-0">
          <p className="font-accent text-xl text-vermillion">Sangrah</p>
          <h1 className="font-display text-4xl font-black sm:text-5xl">My crafts</h1>
          <p className="mt-2 max-w-xl text-muted-foreground">
            Everything you have listed. Nothing goes live until you say yes.
          </p>
        </div>
        <Link
          to="/upload"
          className="inline-flex min-h-14 shrink-0 items-center gap-2 rounded-full bg-marigold px-6 font-display text-lg font-bold text-marigold-foreground block-shadow"
        >
          <Camera className="size-6 shrink-0" aria-hidden="true" />
          Add craft
        </Link>
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {CRAFTS.map((craft) => (
          <CraftCard key={craft.id} craft={craft} />
        ))}
      </div>
    </section>
  );
}
