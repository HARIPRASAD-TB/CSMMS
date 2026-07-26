import Link from "next/link";
import { Search, Users, Building2, Package, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/Button";

const stats = [
  { label: "10K+ Happy Customers", value: "10K+" },
  { label: "5K+ Skilled Workers", value: "5K+" },
  { label: "2K+ Contractors", value: "2K+" },
  { label: "50K+ Orders Delivered", value: "50K+" },
];

const cards = [
  {
    href: "/workers",
    icon: Users,
    title: "Hire Workers",
    desc: "Find painters, carpenters, electricians & more",
  },
  {
    href: "/workers?tab=contractors",
    icon: Building2,
    title: "Book Contractors",
    desc: "Full construction or labour-only contracts",
  },
  {
    href: "/materials",
    icon: Package,
    title: "Buy Materials",
    desc: "Cement, bricks, steel, wood & more",
  },
];

export default function HomePage() {
  return (
    <>
      <section className="relative overflow-hidden px-4 py-20 text-center">
        <div className="absolute inset-0 bg-gradient-to-b from-accent/5 to-transparent" />
        <div className="relative mx-auto max-w-4xl">
          <h1 className="mb-6 text-4xl font-bold leading-tight md:text-6xl">
            All Your Construction Needs,{" "}
            <span className="text-accent">One Platform</span>
          </h1>
          <p className="mb-10 text-lg text-zinc-400">
            Hire skilled workers, book trusted contractors, and purchase quality
            materials — all with transparent pricing and verified reviews.
          </p>
          <form
            action="/workers"
            className="mx-auto flex max-w-2xl gap-2 rounded-xl border border-zinc-700 bg-surface p-2"
          >
            <Search className="ml-3 h-5 w-5 shrink-0 self-center text-zinc-500" />
            <input
              name="q"
              type="search"
              placeholder="Search services or materials..."
              className="flex-1 border-0 bg-transparent px-2 py-3 focus:ring-0"
            />
            <Button type="submit" className="shrink-0">
              Search
            </Button>
          </form>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-4 pb-16 md:grid-cols-3">
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="group rounded-2xl border border-zinc-800 bg-surface p-8 transition hover:border-accent/50 hover:shadow-lg hover:shadow-accent/5"
          >
            <card.icon className="mb-4 h-12 w-12 text-accent transition group-hover:scale-110" />
            <h2 className="mb-2 text-xl font-bold">{card.title}</h2>
            <p className="text-zinc-400">{card.desc}</p>
          </Link>
        ))}
      </section>

      <section className="border-y border-zinc-800 bg-surface py-12">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-4 md:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <div className="mb-1 flex items-center justify-center gap-2 text-3xl font-bold text-accent">
                <TrendingUp className="h-6 w-6" />
                {s.value}
              </div>
              <p className="text-sm text-zinc-400">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="rounded-2xl border border-zinc-800 bg-surface p-8 md:p-12">
          <h2 className="mb-4 text-center text-2xl font-bold md:text-3xl">
            Trusted by builders across India
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-center text-zinc-400">
            Whether you are renovating a home or managing a commercial site,
            BuildConnect brings verified professionals and quality materials to
            your fingertips — with upfront pricing and genuine customer reviews.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/workers"
              className="rounded-lg border border-zinc-700 px-6 py-3 text-sm font-medium transition hover:border-accent hover:text-accent"
            >
              Explore Services
            </Link>
            <Link
              href="/about"
              className="rounded-lg border border-zinc-700 px-6 py-3 text-sm font-medium transition hover:border-accent hover:text-accent"
            >
              Learn About Us
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
