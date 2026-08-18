import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2, MapPin, Package, Truck } from "lucide-react";
import { ORDERS, type Order } from "@/data/crafts";
import { useSpeakable } from "@/components/a11y";

export const Route = createFileRoute("/orders")({
  head: () => ({
    meta: [
      { title: "Orders to Pack & Track — Kalakriti Artisan Studio" },
      {
        name: "description",
        content:
          "Track every artisan order with plain-language stages, large touch targets and read-aloud support.",
      },
      { property: "og:title", content: "Orders to Pack & Track — Kalakriti" },
      {
        property: "og:description",
        content: "Plain-language order tracking built for differently-abled artisans.",
      },
    ],
  }),
  component: Orders,
});

const STAGES: Record<
  Order["stage"],
  { label: string; icon: typeof Package; className: string; step: number }
> = {
  packing: {
    label: "Needs packing",
    icon: Package,
    className: "bg-vermillion text-vermillion-foreground",
    step: 1,
  },
  shipped: {
    label: "On the way",
    icon: Truck,
    className: "bg-marigold text-marigold-foreground",
    step: 2,
  },
  delivered: {
    label: "Delivered",
    icon: CheckCircle2,
    className: "bg-temple text-primary-foreground",
    step: 3,
  },
};

function OrderRow({ order }: { order: Order }) {
  const stage = STAGES[order.stage];
  const Icon = stage.icon;
  const speak = useSpeakable(
    `Order ${order.id}. ${order.craft} for ${order.buyer} in ${order.place}. ${stage.label}. ${order.due}.`,
  );

  return (
    <li {...speak} tabIndex={0} className="rounded-3xl bg-card p-6 zari-border">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4 sm:flex sm:justify-between">
        <div className="min-w-0">
          <p className="font-accent text-sm text-vermillion">Order {order.id}</p>
          <h2 className="font-display text-2xl font-bold">{order.craft}</h2>
          <p className="mt-1 flex flex-wrap items-center gap-2 text-muted-foreground">
            <MapPin className="size-5 shrink-0" aria-hidden="true" />
            {order.buyer} · {order.place}
          </p>
        </div>
        <span
          className={`inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full px-4 font-bold ${stage.className}`}
        >
          <Icon className="size-5 shrink-0" aria-hidden="true" />
          {stage.label}
        </span>
      </div>

      <ol className="mt-5 flex gap-2" aria-label={`Progress: ${stage.label}`}>
        {[1, 2, 3].map((n) => (
          <li
            key={n}
            className={`h-3 flex-1 rounded-full ${n <= stage.step ? "bg-temple" : "bg-muted"}`}
          >
            <span className="sr-only">
              {["Packing", "Shipped", "Delivered"][n - 1]}: {n <= stage.step ? "done" : "pending"}
            </span>
          </li>
        ))}
      </ol>

      <div className="mt-5 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 sm:flex sm:justify-between">
        <p className="min-w-0 font-display text-3xl font-black">₹{order.amount.toLocaleString()}</p>
        <p className="text-right font-semibold text-muted-foreground sm:text-left">{order.due}</p>
      </div>

      {order.stage === "packing" && (
        <button
          type="button"
          className="mt-5 inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-full bg-primary px-6 font-display text-lg font-bold text-primary-foreground hover:bg-indigo-deep sm:w-auto"
        >
          Print the packing slip
        </button>
      )}
    </li>
  );
}

function Orders() {
  return (
    <section className="mx-auto max-w-4xl px-4 py-14">
      <p className="font-accent text-xl text-vermillion">Farmaish</p>
      <h1 className="font-display text-4xl font-black sm:text-5xl">Your orders</h1>
      <p className="mt-2 max-w-2xl text-muted-foreground">
        Three stages only: pack it, it travels, it arrives. No jargon, no timers, no hidden menus.
      </p>

      <ul className="mt-10 grid gap-6">
        {ORDERS.map((order) => (
          <OrderRow key={order.id} order={order} />
        ))}
      </ul>
    </section>
  );
}
